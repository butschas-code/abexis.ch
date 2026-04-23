import { getApp, getApps, initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, limit, query, where } from "firebase/firestore";
import { COLLECTIONS } from "@/cms/firestore/collections";
import { parseFirebaseWebEnv } from "@/firebase/env.schema";
import { mapPostDocData } from "@/lib/cms/map-post";
import type { PublishedPostWithId } from "@/public-site/cms/published-post";
import type { PublicDeploymentSite } from "@/public-site/site";
import { allInsightsPostSitesInClause, getResolvedPublicDeploymentSite, visiblePostSitesInClause } from "@/public-site/site";

/**
 * Default web app for **server** Route Handlers / RSC (anonymous Firestore reads).
 * Uses `getApp()` when `[DEFAULT]` already exists so concurrent serverless invocations
 * do not throw `FirebaseError: Firebase App named '[DEFAULT]' already exists`.
 */
function getServerWebFirestore() {
  const parsed = parseFirebaseWebEnv();
  if (!parsed.ok) return null;
  if (getApps().length > 0) {
    return getFirestore(getApp());
  }
  try {
    return getFirestore(initializeApp(parsed.config));
  } catch {
    if (getApps().length > 0) {
      return getFirestore(getApp());
    }
    return null;
  }
}

/**
 * When Firebase Admin is not configured (e.g. local dev with only `NEXT_PUBLIC_FIREBASE_*`),
 * read published posts with the **Web SDK** as an anonymous client. Matches
 * `firestore.rules` (`posts`: read if published).
 */
export async function listPublishedPostsViaWebSdkForDeployment(
  deployment: PublicDeploymentSite,
  fetchLimit: number,
): Promise<PublishedPostWithId[]> {
  const db = getServerWebFirestore();
  if (!db) return [];
  const sites = visiblePostSitesInClause(deployment);
  /** Must respect `fetchLimit` (e.g. slug fallback asks for 200); do not cap at 50 or older posts 404. */
  const lim = Math.min(200, Math.max(1, fetchLimit));

  /**
   * Avoid `orderBy("publishedAt")` here: that composite index is not always present when the Web SDK
   * fallback runs (e.g. fresh projects), and list queries must satisfy rules for every matching row.
   * We cap reads and sort client-side instead.
   */
  try {
    const q = query(
      collection(db, COLLECTIONS.posts),
      where("status", "==", "published"),
      where("site", "in", sites),
      limit(Math.min(200, Math.max(lim, lim * 4))),
    );

    const snap = await getDocs(q);
    const rows = snap.docs
      .map((doc) => {
        const post = mapPostDocData(doc.id, doc.data() as Record<string, unknown>);
        return { id: doc.id, ...post };
      })
      .filter((p) => p.status === "published");
    rows.sort((a, b) => {
      const ta = a.publishedAt ? Date.parse(a.publishedAt) : 0;
      const tb = b.publishedAt ? Date.parse(b.publishedAt) : 0;
      return tb - ta;
    });
    return rows.slice(0, lim);
  } catch {
    return [];
  }
}

export async function listPublishedPostsViaWebSdkAllSites(fetchLimit: number): Promise<PublishedPostWithId[]> {
  const db = getServerWebFirestore();
  if (!db) return [];
  const sites = allInsightsPostSitesInClause();
  const lim = Math.min(200, Math.max(1, fetchLimit));

  try {
    const q = query(
      collection(db, COLLECTIONS.posts),
      where("status", "==", "published"),
      where("site", "in", sites),
      limit(Math.min(200, Math.max(lim, lim * 4))),
    );

    const snap = await getDocs(q);
    const rows = snap.docs
      .map((doc) => {
        const post = mapPostDocData(doc.id, doc.data() as Record<string, unknown>);
        return { id: doc.id, ...post };
      })
      .filter((p) => p.status === "published");
    rows.sort((a, b) => {
      const ta = a.publishedAt ? Date.parse(a.publishedAt) : 0;
      const tb = b.publishedAt ? Date.parse(b.publishedAt) : 0;
      return tb - ta;
    });
    return rows.slice(0, lim);
  } catch {
    return [];
  }
}

export async function listPublishedPostsViaWebSdk(fetchLimit: number): Promise<PublishedPostWithId[]> {
  const deployment = await getResolvedPublicDeploymentSite();
  return listPublishedPostsViaWebSdkForDeployment(deployment, fetchLimit);
}

export async function getPublishedPostBySlugViaWebSdkForDeployment(
  deployment: PublicDeploymentSite,
  slug: string,
): Promise<PublishedPostWithId | null> {
  const db = getServerWebFirestore();
  if (!db) return null;
  const allowed = new Set(allInsightsPostSitesInClause());
  const trimmed = slug.trim();
  if (!trimmed) return null;

  try {
    const q = query(
      collection(db, COLLECTIONS.posts),
      where("slug", "==", trimmed),
      where("status", "==", "published"),
      limit(40),
    );
    const snap = await getDocs(q);
    for (const doc of snap.docs) {
      const post = mapPostDocData(doc.id, doc.data() as Record<string, unknown>);
      if (!allowed.has(post.site)) continue;
      return { id: doc.id, ...post };
    }
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[cms] Web SDK slug+status query failed; falling back to published list scan.", err);
    }
    try {
      const pool = await listPublishedPostsViaWebSdkAllSites(200);
      return pool.find((p) => p.slug === trimmed) ?? null;
    } catch {
      return null;
    }
  }
  return null;
}

export async function getPublishedPostBySlugViaWebSdk(slug: string): Promise<PublishedPostWithId | null> {
  const deployment = await getResolvedPublicDeploymentSite();
  return getPublishedPostBySlugViaWebSdkForDeployment(deployment, slug);
}
