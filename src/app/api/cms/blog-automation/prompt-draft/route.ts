import { NextResponse } from "next/server";
import { z } from "zod";

import { requireCmsManagePosts } from "@/cms/auth/require-cms-manage-posts";
import { COLLECTIONS } from "@/cms/firestore/collections";
import { cmsCreateBlogTopic } from "@/lib/blogAutomation/cms-server/blogAutomationCmsOps";
import { runBlogAutomation } from "@/lib/blogAutomation/runBlogAutomation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const promptDraftSchema = z.object({
  prompt: z.string().trim().min(20, "Bitte einen aussagekräftigen Prompt eingeben.").max(12000),
  title: z.string().trim().max(160).optional(),
});

function deriveTitle(prompt: string, explicitTitle?: string): string {
  const title = explicitTitle?.trim();
  if (title) return title.slice(0, 140);

  const firstLine =
    prompt
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find(Boolean) ?? "Entwurf aus Prompt";

  const cleaned = firstLine.replace(/^(titel|title|thema|topic)\s*[:–—-]\s*/i, "").trim();
  return (cleaned || "Entwurf aus Prompt").slice(0, 140);
}

function buildPromptNotes(prompt: string): string {
  return [
    "Direkter CMS-Prompt. Der Artikel soll dem folgenden Prompt eng folgen.",
    "Konkrete Struktur, Thesen, Beispiele, Sprache und Länge aus dem Prompt haben Vorrang vor allgemeinen Automationseinstellungen.",
    "Abexis-Brand, Faktenprüfung und ausgeschlossene Themen bleiben verbindlich.",
    "",
    prompt.trim(),
  ].join("\n");
}

export async function POST(req: Request) {
  const auth = await requireCmsManagePosts(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json().catch(() => null);
    const parsed = promptDraftSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Prompt konnte nicht gelesen werden.";
      return NextResponse.json({ success: false, action: "failed", message, reason: message }, { status: 400 });
    }

    const title = deriveTitle(parsed.data.prompt, parsed.data.title);
    const { id: topicId } = await cmsCreateBlogTopic({
      title,
      targetKeyword: title,
      angle: "Direkter Prompt aus dem CMS",
      notes: buildPromptNotes(parsed.data.prompt),
      priority: 0,
      audienceFallback: "",
    });

    const result = await runBlogAutomation("manual", {
      bypassScheduleGate: true,
      forcedTopicRefPath: `${COLLECTIONS.blogTopics}/${topicId}`,
    });

    if (!result.ok) {
      const message = result.error ?? result.reason ?? "Entwurf aus Prompt konnte nicht vorbereitet werden.";
      return NextResponse.json(
        {
          success: false,
          action: "failed",
          message,
          reason: message,
          error: result.error,
          runId: result.runId ?? null,
          topicId: result.topicId ?? topicId,
          draftId: result.draftId ?? null,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      action: result.skipped ? "skipped" : result.publishedPostId ? "published" : "draft_created",
      reason: result.reason ?? "Entwurf aus Prompt wurde vorbereitet.",
      runId: result.runId ?? null,
      topicId: result.topicId ?? topicId,
      draftId: result.draftId ?? null,
      publishedPostId: result.publishedPostId ?? null,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Entwurf aus Prompt konnte nicht vorbereitet werden.";
    return NextResponse.json({ success: false, action: "error", message, reason: message, error: message }, { status: 500 });
  }
}
