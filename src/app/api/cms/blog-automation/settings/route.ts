import { NextResponse } from "next/server";

import { requireCmsManagePosts } from "@/cms/auth/require-cms-manage-posts";
import {
  cmsReadBlogAutomationSettings,
  cmsWriteBlogAutomationSettings,
  parseBlogAutomationFormFromJson,
} from "@/lib/blogAutomation/cms-server/blogAutomationCmsOps";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = await requireCmsManagePosts(req);
  if (auth instanceof NextResponse) return auth;
  try {
    const data = await cmsReadBlogAutomationSettings();
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Einstellungen konnten nicht geladen werden.";
    return NextResponse.json({ error: "SERVER_ERROR", message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const auth = await requireCmsManagePosts(req);
  if (auth instanceof NextResponse) return auth;
  try {
    const body = (await req.json().catch(() => null)) as unknown;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "BAD_REQUEST", message: "Ungültige JSON-Nutzlast." }, { status: 400 });
    }
    const o = body as { form?: unknown; docExists?: unknown };
    const rawForm = o.form !== undefined && o.form !== null ? o.form : body;
    const form = parseBlogAutomationFormFromJson(rawForm);
    const docExists = typeof o.docExists === "boolean" ? o.docExists : false;
    await cmsWriteBlogAutomationSettings(form, { docExists });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Speichern fehlgeschlagen.";
    return NextResponse.json({ error: "BAD_REQUEST", message }, { status: 400 });
  }
}
