import { NextResponse } from "next/server";

import { cmsPublishDueScheduledPosts } from "@/lib/blogAutomation/cms-server/blogAutomationCmsOps";
import { runBlogAutomation } from "@/lib/blogAutomation/runBlogAutomation";

export const runtime = "nodejs";

/**
 * Vercel Cron (scheduled only): secured with `Authorization: Bearer ${CRON_SECRET}`.
 */
export async function GET(_req: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      {
        success: false,
        action: "error",
        reason: "CRON_SECRET is not configured.",
        error: "CRON_SECRET is not configured.",
      },
      { status: 503 },
    );
  }

  const auth = _req.headers.get("authorization")?.trim();
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json(
      {
        success: false,
        action: "unauthorized",
        reason: "Authorization header must be Bearer CRON_SECRET.",
        error: "Unauthorized.",
      },
      { status: 401 },
    );
  }

  try {
    const scheduled = await cmsPublishDueScheduledPosts();
    const result = await runBlogAutomation("cron");

    if (!result.ok) {
      return NextResponse.json(
        {
          success: false,
          action: "failed",
          reason: result.error ?? "Automation run failed.",
          error: result.error,
          ...(result.draftId ? { draftId: result.draftId } : {}),
        },
        { status: 500 },
      );
    }

    if (result.skipped) {
      return NextResponse.json({
        success: true,
        action: "skipped",
        reason: result.reason ?? "Skipped.",
        scheduledPublished: scheduled.published,
      });
    }

    return NextResponse.json({
      success: true,
      action: result.publishedPostId ? "published" : "draft_created",
      reason: result.reason ?? "Automation finished.",
      scheduledPublished: scheduled.published,
      ...(result.draftId ? { draftId: result.draftId } : {}),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      {
        success: false,
        action: "error",
        reason: message,
        error: message,
      },
      { status: 500 },
    );
  }
}
