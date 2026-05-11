import { NextResponse } from "next/server";

import { requireCmsManagePosts } from "@/cms/auth/require-cms-manage-posts";
import { cmsApplyUnsplashPhotoToBlogDraft } from "@/lib/blogAutomation/cms-server/blogAutomationCmsOps";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: RouteContext) {
  const auth = await requireCmsManagePosts(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await ctx.params;
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    const photoId = typeof body?.photoId === "string" ? body.photoId.trim() : "";
    if (!photoId) {
      return NextResponse.json({ error: "BAD_REQUEST", message: "photoId erforderlich." }, { status: 400 });
    }
    const imageSearchQuery = typeof body?.imageSearchQuery === "string" ? body.imageSearchQuery : "";
    await cmsApplyUnsplashPhotoToBlogDraft(id, photoId, imageSearchQuery);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Bild konnte nicht gesetzt werden.";
    const status = message.includes("nicht gefunden") ? 404 : 400;
    return NextResponse.json({ error: "BAD_REQUEST", message }, { status });
  }
}
