import { NextResponse } from "next/server";
import { getAdminFirestore } from "@/firebase/server";
import { listPublishedPostsFromDb } from "@/public-site/cms/get-published-posts";
import { getResolvedPublicDeploymentSite } from "@/public-site/site";

/**
 * Public read model: published posts for the **current deployment’s** site
 * (`NEXT_PUBLIC_CMS_SITE_ID` = `abexis` | `search`), including `site == "both"`.
 *
 * Requires Firebase Admin credentials on the server.
 */
export async function GET(req: Request) {
  const db = getAdminFirestore();
  if (!db) {
    return NextResponse.json(
      { error: "CMS_ADMIN_NOT_CONFIGURED", message: "The posts backend is not configured." },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10) || 20));

  try {
    const deployment = await getResolvedPublicDeploymentSite();
    const items = await listPublishedPostsFromDb(db, deployment, limit);
    return NextResponse.json({ items });
  } catch (e) {
    console.error("Published posts query failed:", e);
    return NextResponse.json(
      { error: "CMS_QUERY_FAILED", message: "Published posts could not be loaded." },
      { status: 500 },
    );
  }
}
