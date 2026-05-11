import { NextResponse } from "next/server";

import { requireCmsManagePosts } from "@/cms/auth/require-cms-manage-posts";
import {
  cmsDeleteBlogDraft,
  cmsGetBlogDraftForAdmin,
  cmsUpdateBlogDraftFields,
  parseBlogDraftEditableFields,
} from "@/lib/blogAutomation/cms-server/blogAutomationCmsOps";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: RouteContext) {
  const auth = await requireCmsManagePosts(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await ctx.params;
  try {
    const draft = await cmsGetBlogDraftForAdmin(id);
    if (!draft) {
      return NextResponse.json({ error: "NOT_FOUND", message: "Entwurf nicht gefunden." }, { status: 404 });
    }
    return NextResponse.json({ draft }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Entwurf konnte nicht geladen werden.";
    return NextResponse.json({ error: "SERVER_ERROR", message }, { status: 500 });
  }
}

export async function PATCH(req: Request, ctx: RouteContext) {
  const auth = await requireCmsManagePosts(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await ctx.params;
  try {
    const body = await req.json().catch(() => null);
    const fields = parseBlogDraftEditableFields(body);
    await cmsUpdateBlogDraftFields(id, fields);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Speichern fehlgeschlagen.";
    const status = message.includes("nicht gefunden") ? 404 : 400;
    return NextResponse.json({ error: "BAD_REQUEST", message }, { status });
  }
}

export async function DELETE(req: Request, ctx: RouteContext) {
  const auth = await requireCmsManagePosts(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await ctx.params;
  try {
    await cmsDeleteBlogDraft(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Löschen fehlgeschlagen.";
    const status = message.includes("nicht gefunden") ? 404 : 400;
    return NextResponse.json({ error: "BAD_REQUEST", message }, { status });
  }
}
