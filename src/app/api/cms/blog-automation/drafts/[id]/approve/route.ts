import { NextResponse } from "next/server";

import { requireCmsManagePosts } from "@/cms/auth/require-cms-manage-posts";
import { cmsSetBlogDraftApproved } from "@/lib/blogAutomation/cms-server/blogAutomationCmsOps";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: RouteContext) {
  const auth = await requireCmsManagePosts(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await ctx.params;
  try {
    const body = await req.json().catch(() => ({})) as Record<string, unknown>;
    const authorId = typeof body.authorId === "string" ? body.authorId : undefined;
    const categoryIds = Array.isArray(body.categoryIds) ? body.categoryIds.map(String) : undefined;
    const tags = Array.isArray(body.tags) ? body.tags.map(String) : undefined;
    const result = await cmsSetBlogDraftApproved(id, { authorId, categoryIds, tags });
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Freigabe fehlgeschlagen.";
    const status = message.includes("nicht gefunden") ? 404 : 400;
    return NextResponse.json({ error: "BAD_REQUEST", message }, { status });
  }
}
