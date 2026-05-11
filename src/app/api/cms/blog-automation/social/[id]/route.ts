import { NextResponse } from "next/server";

import { requireCmsManagePosts } from "@/cms/auth/require-cms-manage-posts";
import { cmsPatchBlogSocialPost } from "@/lib/blogAutomation/cms-server/blogAutomationCmsOps";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: RouteContext) {
  const auth = await requireCmsManagePosts(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await ctx.params;
  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "BAD_REQUEST", message: "Ungültige JSON-Nutzlast." }, { status: 400 });
    }
    await cmsPatchBlogSocialPost(id, {
      linkedinPost: typeof body.linkedinPost === "string" ? body.linkedinPost : undefined,
      shortLinkedinPost: typeof body.shortLinkedinPost === "string" ? body.shortLinkedinPost : undefined,
      xPost: typeof body.xPost === "string" ? body.xPost : undefined,
      markUsed: body.markUsed === true,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Speichern fehlgeschlagen.";
    const status = message.includes("nicht gefunden") ? 404 : 400;
    return NextResponse.json({ error: "BAD_REQUEST", message }, { status });
  }
}
