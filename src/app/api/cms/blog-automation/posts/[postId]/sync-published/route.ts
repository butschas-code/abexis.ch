import { NextResponse } from "next/server";

import { requireCmsManagePosts } from "@/cms/auth/require-cms-manage-posts";
import { cmsSyncLinkedBlogDraftAfterPostPublish } from "@/lib/blogAutomation/cms-server/blogAutomationCmsOps";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ postId: string }> };

export async function POST(req: Request, ctx: RouteContext) {
  const auth = await requireCmsManagePosts(req);
  if (auth instanceof NextResponse) return auth;
  const { postId } = await ctx.params;
  try {
    const result = await cmsSyncLinkedBlogDraftAfterPostPublish(postId);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Synchronisation fehlgeschlagen.";
    return NextResponse.json({ error: "BAD_REQUEST", message }, { status: 400 });
  }
}
