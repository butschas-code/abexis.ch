import { NextResponse } from "next/server";

import { requireCmsManagePosts } from "@/cms/auth/require-cms-manage-posts";
import { cmsSendBlogSocialPostToNuelink } from "@/lib/blogAutomation/cms-server/blogAutomationCmsOps";
import type { NuelinkSocialTarget } from "@/lib/nuelink/client";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

function readTarget(value: unknown): NuelinkSocialTarget | null {
  return value === "linkedin" ? value : null;
}

export async function POST(req: Request, ctx: RouteContext) {
  const auth = await requireCmsManagePosts(req);
  if (auth instanceof NextResponse) return auth;
  const { id } = await ctx.params;

  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    const target = readTarget(body?.target);
    const caption = typeof body?.caption === "string" ? body.caption : "";
    const socialImageUrl = typeof body?.socialImageUrl === "string" ? body.socialImageUrl : null;
    const socialImageAlt = typeof body?.socialImageAlt === "string" ? body.socialImageAlt : null;

    if (!target) {
      return NextResponse.json({ error: "BAD_REQUEST", message: "Bitte LinkedIn auswählen." }, { status: 400 });
    }

    const result = await cmsSendBlogSocialPostToNuelink(id, { target, caption, socialImageUrl, socialImageAlt });
    return NextResponse.json({ ok: true, result }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Nuelink-Verbindung fehlgeschlagen.";
    const status = message.includes("nicht gefunden") ? 404 : 400;
    return NextResponse.json({ error: "BAD_REQUEST", message }, { status });
  }
}
