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
    await cmsSetBlogDraftApproved(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Freigabe fehlgeschlagen.";
    const status = message.includes("nicht gefunden") ? 404 : 400;
    return NextResponse.json({ error: "BAD_REQUEST", message }, { status });
  }
}
