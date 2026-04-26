import { unstable_cache } from "next/cache";
import { cache } from "react";
import { getApp, getApps, initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore, limit, query, where } from "firebase/firestore";
import { COLLECTIONS } from "@/cms/firestore/collections";
import { getAdminFirestore } from "@/firebase/server";
import { parseFirebaseWebEnv } from "@/firebase/env.schema";
import type { Vacancy, VacancyFile } from "@/cms/types/vacancy";
import type { PostStatus } from "@/cms/types/enums";

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

export type PublishedVacancy = Vacancy & { id: string };

const REVALIDATE = 120;

function toIso(v: unknown): string | null {
  if (v && typeof (v as { toDate?: () => Date }).toDate === "function") {
    return (v as { toDate: () => Date }).toDate().toISOString();
  }
  if (typeof v === "string") return v;
  return null;
}

function readFiles(v: unknown): VacancyFile[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((f): f is Record<string, unknown> => typeof f === "object" && f != null)
    .map((f) => ({ label: String(f.label ?? ""), url: String(f.url ?? "") }))
    .filter((f) => f.label && f.url);
}

function readStatus(v: unknown): PostStatus {
  if (v === "published" || v === "archived" || v === "draft") return v;
  return "draft";
}

/** Staging / placeholder rows that stay in CMS but must not show on the public site. */
function isVacancyHiddenFromPublic(v: Pick<PublishedVacancy, "slug" | "title">): boolean {
  const s = v.slug.trim().toLowerCase();
  const t = v.title.trim().toLowerCase();
  return s === "test" || t === "test";
}

function mapVacancyDoc(id: string, d: Record<string, unknown>): PublishedVacancy {
  return {
    id,
    title: String(d.title ?? ""),
    slug: String(d.slug ?? id),
    excerpt: String(d.excerpt ?? ""),
    sector: String(d.sector ?? ""),
    location: String(d.location ?? ""),
    employmentType: String(d.employmentType ?? ""),
    hook: String(d.hook ?? ""),
    body: String(d.body ?? ""),
    files: readFiles(d.files),
    apply: String(d.apply ?? ""),
    site: d.site === "search" || d.site === "both" || d.site === "abexis" ? d.site : "search",
    status: readStatus(d.status),
    publishedAt: toIso(d.publishedAt),
    createdAt: toIso(d.createdAt) ?? new Date().toISOString(),
    updatedAt: toIso(d.updatedAt) ?? new Date().toISOString(),
  };
}

async function listPublishedVacanciesUncached(lim: number): Promise<PublishedVacancy[]> {
  const db = getAdminFirestore();
  if (db) {
    try {
      // Single equality filter only — no composite index needed. Sort in memory.
      const fetchCap = Math.min(100, Math.max(lim, lim + 8));
      const snap = await db
        .collection(COLLECTIONS.vacancies)
        .where("status", "==", "published")
        .limit(fetchCap)
        .get();
      const rows = snap.docs.map((doc) => mapVacancyDoc(doc.id, doc.data() as Record<string, unknown>));
      rows.sort((a, b) => {
        const ta = a.publishedAt ?? a.createdAt;
        const tb = b.publishedAt ?? b.createdAt;
        return tb < ta ? -1 : ta < tb ? 1 : 0;
      });
      return rows.filter((v) => !isVacancyHiddenFromPublic(v)).slice(0, lim);
    } catch (error) {
      console.warn("[CMS] Admin Firestore vacancies failed; falling back to Web SDK.", error instanceof Error ? error.message : "Unknown error");
    }
  }

  const webDb = getServerWebFirestore();
  if (!webDb) return [];
  try {
    const fetchCap = Math.min(100, Math.max(lim, lim + 8));
    const q = query(
      collection(webDb, COLLECTIONS.vacancies),
      where("status", "==", "published"),
      limit(fetchCap)
    );
    const snap = await getDocs(q);
    const rows = snap.docs.map((doc) => mapVacancyDoc(doc.id, doc.data() as Record<string, unknown>));
    rows.sort((a, b) => {
      const ta = a.publishedAt ?? a.createdAt;
      const tb = b.publishedAt ?? b.createdAt;
      return tb < ta ? -1 : ta < tb ? 1 : 0;
    });
    return rows.filter((v) => !isVacancyHiddenFromPublic(v)).slice(0, lim);
  } catch (error) {
    console.warn("[CMS] Web SDK vacancies query failed:", error instanceof Error ? error.message : "Unknown error");
    return [];
  }
}

const listPublishedVacanciesCached = unstable_cache(
  async (lim: number) => listPublishedVacanciesUncached(lim),
  ["published-vacancies"],
  { revalidate: REVALIDATE, tags: ["published-vacancies"] },
);

export const listPublishedVacancies = cache(async (limit = 20): Promise<PublishedVacancy[]> => {
  return listPublishedVacanciesCached(Math.min(100, Math.max(1, limit)));
});

async function getVacancyBySlugUncached(slug: string): Promise<PublishedVacancy | null> {
  const db = getAdminFirestore();
  if (db) {
    try {
      // Single equality filter — no composite index needed. Check status in code.
      const snap = await db
        .collection(COLLECTIONS.vacancies)
        .where("slug", "==", slug)
        .limit(5)
        .get();
      for (const doc of snap.docs) {
        const v = mapVacancyDoc(doc.id, doc.data() as Record<string, unknown>);
        if (v.status === "published") {
          if (isVacancyHiddenFromPublic(v)) return null;
          return v;
        }
      }
      return null;
    } catch (error) {
      console.warn(`[CMS] Admin Firestore vacancy by slug "${slug}" failed; falling back to Web SDK.`, error instanceof Error ? error.message : "Unknown error");
    }
  }

  const webDb = getServerWebFirestore();
  if (!webDb) return null;
  try {
    const q = query(
      collection(webDb, COLLECTIONS.vacancies),
      where("slug", "==", slug),
      limit(5)
    );
    const snap = await getDocs(q);
    for (const doc of snap.docs) {
      const v = mapVacancyDoc(doc.id, doc.data() as Record<string, unknown>);
      if (v.status === "published") {
        if (isVacancyHiddenFromPublic(v)) return null;
        return v;
      }
    }
    return null;
  } catch (error) {
    console.warn(`[CMS] Web SDK vacancy by slug "${slug}" failed:`, error instanceof Error ? error.message : "Unknown error");
    return null;
  }
}

const getVacancyBySlugCached = unstable_cache(
  async (slug: string) => getVacancyBySlugUncached(slug),
  ["vacancy-by-slug"],
  { revalidate: REVALIDATE, tags: ["published-vacancies"] },
);

export const getPublishedVacancyBySlug = cache(async (slug: string): Promise<PublishedVacancy | null> => {
  const normalized = slug.trim();
  if (!normalized) return null;
  return getVacancyBySlugCached(normalized);
});
