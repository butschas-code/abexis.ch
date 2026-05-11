import { NextResponse } from "next/server";

import { requireCmsManagePosts } from "@/cms/auth/require-cms-manage-posts";
import type { AddBlogTopicInput } from "@/lib/blogAutomation/blogTopicQueue";
import {
  cmsCreateBlogTopic,
  cmsListBlogTopicsForAdmin,
  cmsListQueuedBlogTopics,
} from "@/lib/blogAutomation/cms-server/blogAutomationCmsOps";

export const dynamic = "force-dynamic";

function parseAddTopicBody(body: unknown): AddBlogTopicInput {
  if (!body || typeof body !== "object") throw new Error("Ungültige JSON-Nutzlast.");
  const o = body as Record<string, unknown>;
  return {
    title: String(o.title ?? ""),
    targetKeyword: String(o.targetKeyword ?? ""),
    angle: String(o.angle ?? ""),
    notes: String(o.notes ?? ""),
    priority: Number.isFinite(Number(o.priority)) ? Math.floor(Number(o.priority)) : 50,
    audienceFallback: String(o.audienceFallback ?? ""),
  };
}

export async function GET(req: Request) {
  const auth = await requireCmsManagePosts(req);
  if (auth instanceof NextResponse) return auth;

  const url = new URL(req.url);
  const queuedOnly = url.searchParams.get("queued") === "1" || url.searchParams.get("queued") === "true";

  try {
    if (queuedOnly) {
      const rows = await cmsListQueuedBlogTopics(80);
      return NextResponse.json({ topics: rows }, { headers: { "Cache-Control": "no-store" } });
    }
    const rows = await cmsListBlogTopicsForAdmin(100);
    return NextResponse.json({ topics: rows }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Themen konnten nicht geladen werden.";
    return NextResponse.json({ error: "SERVER_ERROR", message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireCmsManagePosts(req);
  if (auth instanceof NextResponse) return auth;
  try {
    const body = await req.json().catch(() => null);
    const input = parseAddTopicBody(body);
    const { id } = await cmsCreateBlogTopic(input);
    return NextResponse.json({ id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Thema konnte nicht erstellt werden.";
    const status = message.includes("nicht gefunden") ? 404 : 400;
    return NextResponse.json({ error: "BAD_REQUEST", message }, { status });
  }
}
