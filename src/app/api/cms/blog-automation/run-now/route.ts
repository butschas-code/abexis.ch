import { NextResponse } from "next/server";

import { requireCmsManagePosts } from "@/cms/auth/require-cms-manage-posts";
import { runBlogAutomation } from "@/lib/blogAutomation/runBlogAutomation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const auth = await requireCmsManagePosts(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const result = await runBlogAutomation("manual", { bypassScheduleGate: true });
    if (!result.ok) {
      return NextResponse.json(
        {
          success: false,
          action: "failed",
          reason: result.error ?? "Vorbereitung fehlgeschlagen.",
          error: result.error,
          runId: result.runId ?? null,
          topicId: result.topicId ?? null,
          draftId: result.draftId ?? null,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      action: result.skipped ? "skipped" : result.publishedPostId ? "published" : "draft_created",
      reason: result.reason ?? "Vorbereitung abgeschlossen.",
      runId: result.runId ?? null,
      topicId: result.topicId ?? null,
      draftId: result.draftId ?? null,
      publishedPostId: result.publishedPostId ?? null,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Vorbereitung fehlgeschlagen.";
    return NextResponse.json({ success: false, action: "error", reason: message, error: message }, { status: 500 });
  }
}
