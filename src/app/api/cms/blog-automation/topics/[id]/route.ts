import { NextResponse } from "next/server";

import { requireCmsManagePosts } from "@/cms/auth/require-cms-manage-posts";
import type { BlogTopicPatch } from "@/lib/blogAutomation/cms-server/blogAutomationCmsOps";
import { cmsDeleteBlogTopic, cmsUpdateBlogTopic } from "@/lib/blogAutomation/cms-server/blogAutomationCmsOps";

export const dynamic = "force-dynamic";

function parseTopicPatch(body: unknown): BlogTopicPatch {
  if (!body || typeof body !== "object") throw new Error("Ungültige JSON-Nutzlast.");
  const o = body as Record<string, unknown>;
  const patch: BlogTopicPatch = {};
  if ("title" in o) patch.title = String(o.title ?? "");
  if ("targetKeyword" in o) patch.targetKeyword = String(o.targetKeyword ?? "");
  if ("angle" in o) patch.angle = String(o.angle ?? "");
  if ("notes" in o) patch.notes = String(o.notes ?? "");
  if ("audience" in o) patch.audience = String(o.audience ?? "");
  if ("priority" in o && o.priority != null) patch.priority = Number(o.priority);
  if ("status" in o && o.status != null) patch.status = String(o.status);
  return patch;
}

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: RouteContext) {
  const auth = await requireCmsManagePosts(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await ctx.params;
  try {
    const body = await req.json().catch(() => null);
    await cmsUpdateBlogTopic(id, parseTopicPatch(body));
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Aktualisieren fehlgeschlagen.";
    const status = message.includes("nicht gefunden") ? 404 : 400;
    return NextResponse.json({ error: "BAD_REQUEST", message }, { status });
  }
}

export async function DELETE(req: Request, ctx: RouteContext) {
  const auth = await requireCmsManagePosts(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await ctx.params;
  try {
    await cmsDeleteBlogTopic(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Löschen fehlgeschlagen.";
    const status = message.includes("nicht gefunden") ? 404 : 400;
    return NextResponse.json({ error: "BAD_REQUEST", message }, { status });
  }
}
