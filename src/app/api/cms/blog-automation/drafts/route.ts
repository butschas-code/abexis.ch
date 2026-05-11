import { NextResponse } from "next/server";

import { requireCmsManagePosts } from "@/cms/auth/require-cms-manage-posts";
import { cmsListBlogDraftsForAdmin } from "@/lib/blogAutomation/cms-server/blogAutomationCmsOps";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = await requireCmsManagePosts(req);
  if (auth instanceof NextResponse) return auth;
  const url = new URL(req.url);
  const max = Math.min(200, Math.max(1, Number(url.searchParams.get("max")) || 120));

  try {
    const drafts = await cmsListBlogDraftsForAdmin(max);
    return NextResponse.json({ drafts }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Entwürfe konnten nicht geladen werden.";
    return NextResponse.json({ error: "SERVER_ERROR", message }, { status: 500 });
  }
}
