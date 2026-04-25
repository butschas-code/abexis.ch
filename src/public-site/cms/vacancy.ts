import { unstable_cache } from "next/cache";
import { cache } from "react";
import { COLLECTIONS } from "@/cms/firestore/collections";
import { getAdminFirestore } from "@/firebase/server";
import type { Vacancy, VacancyFile } from "@/cms/types/vacancy";
import type { PostStatus } from "@/cms/types/enums";

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
  if (!db) return [];
  try {
    // Single equality filter only — no composite index needed. Sort in memory.
    const snap = await db
      .collection(COLLECTIONS.vacancies)
      .where("status", "==", "published")
      .limit(lim)
      .get();
    const rows = snap.docs.map((doc) => mapVacancyDoc(doc.id, doc.data() as Record<string, unknown>));
    rows.sort((a, b) => {
      const ta = a.publishedAt ?? a.createdAt;
      const tb = b.publishedAt ?? b.createdAt;
      return tb < ta ? -1 : ta < tb ? 1 : 0;
    });
    return rows;
  } catch (error) {
    console.warn("[CMS] Failed to list published vacancies (credentials might be missing during build):", error instanceof Error ? error.message : "Unknown error");
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
  if (!db) return null;
  try {
    // Single equality filter — no composite index needed. Check status in code.
    const snap = await db
      .collection(COLLECTIONS.vacancies)
      .where("slug", "==", slug)
      .limit(5)
      .get();
    for (const doc of snap.docs) {
      const v = mapVacancyDoc(doc.id, doc.data() as Record<string, unknown>);
      if (v.status === "published") return v;
    }
    return null;
  } catch (error) {
    console.warn(`[CMS] Failed to get vacancy by slug "${slug}":`, error instanceof Error ? error.message : "Unknown error");
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
