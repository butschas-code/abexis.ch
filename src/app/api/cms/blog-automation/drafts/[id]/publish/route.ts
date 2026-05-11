import { NextResponse } from "next/server";

import { requireCmsManagePosts } from "@/cms/auth/require-cms-manage-posts";
import {
  cmsPublishBlogDraftToPost,
  parseBlogDraftEditableFields,
} from "@/lib/blogAutomation/cms-server/blogAutomationCmsOps";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: RouteContext) {
  const auth = await requireCmsManagePosts(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await ctx.params;
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "BAD_REQUEST", message: "Ungültige JSON-Nutzlast." }, { status: 400 });
    }
    const authorId = String(body.authorId ?? "").trim();
    if (!authorId) {
      return NextResponse.json({ error: "BAD_REQUEST", message: "Autor-ID erforderlich." }, { status: 400 });
    }
    const categoryIds = Array.isArray(body.categoryIds) ? body.categoryIds.map(String) : [];
    const tags = Array.isArray(body.tags) ? body.tags.map(String) : [];
    const fields = parseBlogDraftEditableFields(body);
    const result = await cmsPublishBlogDraftToPost({
      draftId: id,
      authorId,
      categoryIds,
      tags,
      ...fields,
    });
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Veröffentlichen fehlgeschlagen.";
    const status =
      message.includes("nicht gefunden") || message.includes("bereits veröffentlicht") ? 400 : 400;
    return NextResponse.json({ error: "BAD_REQUEST", message }, { status });
  }
}
