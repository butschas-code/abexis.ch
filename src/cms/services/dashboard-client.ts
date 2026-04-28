"use client";

import {
  collection,
  getCountFromServer,
  query,
  where,
  type QueryConstraint,
} from "firebase/firestore";
import { COLLECTIONS } from "../firestore/collections";
import type { SiteKey } from "../types/site";
import { getCmsFirestore } from "@/firebase/firestore";
import { listRecentPostsForDashboard, type CmsPostListItem } from "./posts-client";
import { listSubmissionsForAdmin, type SubmissionRow } from "./submissions-client";

export type AdminDashboardCounts = {
  publishedPosts: number;
  draftPosts: number;
  categories: number;
  authors: number;
  submissions: number;
};

export type AdminDashboardSitePostCounts = Record<SiteKey, number>;

export type AdminDashboardData = {
  counts: AdminDashboardCounts;
  /** All posts (any status) grouped by `posts.site`. */
  postsBySite: AdminDashboardSitePostCounts;
  recentPosts: CmsPostListItem[];
  recentSubmissions: SubmissionRow[];
};

async function countDocs(collectionId: string, constraints: QueryConstraint[] = []): Promise<number> {
  const db = getCmsFirestore();
  if (!db) return 0;
  const snap = await getCountFromServer(query(collection(db, collectionId), ...constraints));
  return snap.data().count;
}

export type LoadAdminDashboardOptions = {
  recentPostsLimit?: number;
  recentSubmissionsLimit?: number;
  /**
   * When `false`, skip submission aggregates/lists (editors : no `manage_submissions`).
   * Avoids fetching PII-adjacent rows client-side.
   */
  includeSubmissionsIntake?: boolean;
};

const emptyAggregates = (): Pick<AdminDashboardData, "counts" | "postsBySite"> => ({
  counts: { publishedPosts: 0, draftPosts: 0, categories: 0, authors: 0, submissions: 0 },
  postsBySite: { abexis: 0, search: 0, both: 0 },
});

/**
 * Aggregate counts only (parallel `getCountFromServer` calls). Use with {@link loadAdminDashboardLists}
 * so the UI can render recent rows before counts finish.
 */
export async function loadAdminDashboardAggregates(
  options: Pick<LoadAdminDashboardOptions, "includeSubmissionsIntake"> = {},
): Promise<Pick<AdminDashboardData, "counts" | "postsBySite">> {
  const includeSubmissionsIntake = options.includeSubmissionsIntake !== false;
  const db = getCmsFirestore();
  if (!db) return emptyAggregates();

  const countQueries = [
    countDocs(COLLECTIONS.posts, [where("status", "==", "published")]),
    countDocs(COLLECTIONS.posts, [where("status", "==", "draft")]),
    countDocs(COLLECTIONS.categories),
    countDocs(COLLECTIONS.authors),
    countDocs(COLLECTIONS.posts, [where("site", "==", "abexis")]),
    countDocs(COLLECTIONS.posts, [where("site", "==", "search")]),
    countDocs(COLLECTIONS.posts, [where("site", "==", "both")]),
  ] as const;

  if (!includeSubmissionsIntake) {
    const [publishedPosts, draftPosts, categories, authors, abexisPosts, searchPosts, bothPosts] =
      await Promise.all([...countQueries]);
    return {
      counts: {
        publishedPosts,
        draftPosts,
        categories,
        authors,
        submissions: 0,
      },
      postsBySite: {
        abexis: abexisPosts,
        search: searchPosts,
        both: bothPosts,
      },
    };
  }

  const [publishedPosts, draftPosts, categories, authors, abexisPosts, searchPosts, bothPosts, submissions] =
    await Promise.all([...countQueries, countDocs(COLLECTIONS.submissions)]);

  return {
    counts: {
      publishedPosts,
      draftPosts,
      categories,
      authors,
      submissions,
    },
    postsBySite: {
      abexis: abexisPosts,
      search: searchPosts,
      both: bothPosts,
    },
  };
}

/**
 * Recent posts + optional submissions list (lighter than loading full dashboard).
 */
export async function loadAdminDashboardLists(
  options: LoadAdminDashboardOptions = {},
): Promise<Pick<AdminDashboardData, "recentPosts" | "recentSubmissions">> {
  const recentPostsLimit = options.recentPostsLimit ?? 6;
  const recentSubmissionsLimit = options.recentSubmissionsLimit ?? 6;
  const includeSubmissionsIntake = options.includeSubmissionsIntake !== false;
  const db = getCmsFirestore();
  if (!db) {
    return { recentPosts: [], recentSubmissions: [] };
  }

  const [recentPosts, recentSubmissions] = await Promise.all([
    listRecentPostsForDashboard(recentPostsLimit),
    includeSubmissionsIntake ? listSubmissionsForAdmin(recentSubmissionsLimit) : Promise.resolve([] as SubmissionRow[]),
  ]);
  return { recentPosts, recentSubmissions };
}

/**
 * Loads dashboard aggregates and recent rows in parallel (Firestore client SDK, admin UI).
 */
export async function loadAdminDashboardData(
  options: LoadAdminDashboardOptions = {},
): Promise<AdminDashboardData> {
  const db = getCmsFirestore();
  if (!db) {
    return {
      ...emptyAggregates(),
      recentPosts: [],
      recentSubmissions: [],
    };
  }
  const [lists, aggregates] = await Promise.all([
    loadAdminDashboardLists(options),
    loadAdminDashboardAggregates(options),
  ]);
  return { ...lists, ...aggregates };
}
