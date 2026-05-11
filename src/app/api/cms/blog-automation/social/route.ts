import { NextResponse } from "next/server";

import { requireCmsManagePosts } from "@/cms/auth/require-cms-manage-posts";
import {
  cmsListBlogSocialPostsForAdmin,
  cmsListBlogSocialPostsForDraft,
} from "@/lib/blogAutomation/cms-server/blogAutomationCmsOps";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = await requireCmsManagePosts(req);
  if (auth instanceof NextResponse) return auth;
  const url = new URL(req.url);
  const draftId = url.searchParams.get("draftId")?.trim() ?? "";
  const max = Math.min(200, Math.max(1, Number(url.searchParams.get("max")) || 80));

  try {
    if (draftId) {
      const social = await cmsListBlogSocialPostsForDraft(draftId);
      return NextResponse.json({ social }, { headers: { "Cache-Control": "no-store" } });
    }
    const social = await cmsListBlogSocialPostsForAdmin(max);
    return NextResponse.json({ social }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Social-Posts konnten nicht geladen werden.";
    return NextResponse.json({ error: "SERVER_ERROR", message }, { status: 500 });
  }
}
