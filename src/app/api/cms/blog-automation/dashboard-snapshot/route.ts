import { NextResponse } from "next/server";

import { requireCmsManagePosts } from "@/cms/auth/require-cms-manage-posts";
import {
  cmsBuildBlogAutomationDashboardSnapshot,
  parseBlogAutomationFormFromJson,
} from "@/lib/blogAutomation/cms-server/blogAutomationCmsOps";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const auth = await requireCmsManagePosts(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = (await req.json().catch(() => null)) as unknown;
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "BAD_REQUEST", message: "Ungültige JSON-Nutzlast." }, { status: 400 });
    }
    const form = parseBlogAutomationFormFromJson((body as { form?: unknown }).form ?? body);
    const snapshot = await cmsBuildBlogAutomationDashboardSnapshot(form);
    return NextResponse.json(snapshot);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Dashboard konnte nicht berechnet werden.";
    return NextResponse.json({ error: "BAD_REQUEST", message }, { status: 400 });
  }
}
