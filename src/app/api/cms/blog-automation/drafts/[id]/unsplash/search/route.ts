import { NextResponse } from "next/server";

import { requireCmsManagePosts } from "@/cms/auth/require-cms-manage-posts";
import { cmsSearchUnsplashPhotosForDraft } from "@/lib/blogAutomation/cms-server/blogAutomationCmsOps";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: RouteContext) {
  const auth = await requireCmsManagePosts(req);
  if (auth instanceof NextResponse) return auth;
  await ctx.params;
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    const query = typeof body?.query === "string" ? body.query : "";
    const photos = await cmsSearchUnsplashPhotosForDraft(query);
    return NextResponse.json({ photos }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unsplash-Suche fehlgeschlagen.";
    return NextResponse.json({ error: "BAD_REQUEST", message }, { status: 400 });
  }
}
