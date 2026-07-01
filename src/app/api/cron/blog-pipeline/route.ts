import { NextResponse } from "next/server";
import { runBlogAutomation } from "@/lib/blogAutomation/runBlogAutomation";

export const runtime = "nodejs";

/**
 * Vercel Cron: secured with `Authorization: Bearer ${CRON_SECRET}` when `CRON_SECRET` is set on the project.
 * Runs {@link runBlogAutomation} (schedule gate, topic queue / AI suggestion, draft generation, audit logs).
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ ok: false, error: "Cron authentication is not configured." }, { status: 503 });
  }

  const auth = req.headers.get("authorization")?.trim();
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const result = await runBlogAutomation("cron");
    const status = result.ok ? 200 : 500;
    return NextResponse.json({ ok: result.ok, result }, { status });
  } catch (e) {
    console.error("Blog pipeline cron failed:", e);
    return NextResponse.json({ ok: false, error: "Cron job failed." }, { status: 500 });
  }
}
