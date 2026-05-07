"use client";

import { collection, getDocs, limit, orderBy, query, where, type QueryConstraint } from "firebase/firestore";
import { getCmsFirestore } from "@/firebase/firestore";
import { POST_SITE_FIRESTORE_IN } from "@/public-site/site/filters";
import { COLLECTIONS } from "../firestore/collections";
import type { Vacancy, VacancyFile } from "../types/vacancy";
import type { PostStatus } from "../types/enums";
import type { SiteKey } from "../types/site";

function normalizeVacancySite(_raw: unknown): SiteKey {
  return "abexis";
}

export type VacancyListItem = Vacancy & { id: string };

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

function readJobType(v: unknown): "vacancy" | "spontanbewerbung" {
  return v === "spontanbewerbung" ? "spontanbewerbung" : "vacancy";
}

export function mapVacancyClientDoc(id: string, d: Record<string, unknown>): VacancyListItem {
  const jobType = readJobType(d.jobType);
  const isSpontaneous = typeof d.isSpontaneous === "boolean" ? d.isSpontaneous : jobType === "spontanbewerbung";
  return {
    id,
    title: String(d.title ?? ""),
    slug: String(d.slug ?? id),
    excerpt: String(d.excerpt ?? ""),
    sector: String(d.sector ?? ""),
    location: String(d.location ?? ""),
    employmentType: String(d.employmentType ?? ""),
    jobType,
    isSpontaneous,
    hook: String(d.hook ?? ""),
    body: String(d.body ?? ""),
    files: readFiles(d.files),
    apply: String(d.apply ?? ""),
    site: normalizeVacancySite(d.site),
    status: readStatus(d.status),
    publishedAt: toIso(d.publishedAt),
    createdAt: toIso(d.createdAt) ?? new Date().toISOString(),
    updatedAt: toIso(d.updatedAt) ?? new Date().toISOString(),
  };
}

/** All vacancies for admin table (all statuses). */
export async function listVacanciesForAdmin(max = 100): Promise<VacancyListItem[]> {
  const db = getCmsFirestore();
  if (!db) return [];
  const constraints: QueryConstraint[] = [orderBy("updatedAt", "desc"), limit(max)];
  const q = query(collection(db, COLLECTIONS.vacancies), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((doc) => mapVacancyClientDoc(doc.id, doc.data() as Record<string, unknown>));
}

/** Published vacancies for public listing (`site` is `abexis` in Firestore). */
export async function listPublishedVacanciesForCurrentSite(max = 20): Promise<VacancyListItem[]> {
  const db = getCmsFirestore();
  if (!db) return [];
  const q = query(
    collection(db, COLLECTIONS.vacancies),
    where("status", "==", "published"),
    where("site", "in", [...POST_SITE_FIRESTORE_IN]),
    orderBy("publishedAt", "desc"),
    limit(max),
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => mapVacancyClientDoc(doc.id, doc.data() as Record<string, unknown>));
}
