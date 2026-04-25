"use client";

import {
  Timestamp,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { getCmsFirestore } from "@/firebase/firestore";
import { COLLECTIONS } from "../firestore/collections";
import type { VacancyFile } from "../types/vacancy";
import { mapVacancyClientDoc, type VacancyListItem } from "./vacancies-client";

export type VacancyUpsertInput = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  sector: string;
  location: string;
  employmentType: string;
  hook: string;
  body: string;
  files: VacancyFile[];
  apply: string;
  site: "abexis" | "search" | "both";
  status: "draft" | "published" | "archived";
  publishedAt?: string | null;
};

export function newVacancyId(): string {
  const db = getCmsFirestore();
  if (!db) throw new Error("Firebase ist nicht konfiguriert.");
  return doc(collection(db, COLLECTIONS.vacancies)).id;
}

export async function getVacancyForAdmin(id: string): Promise<VacancyListItem | null> {
  const db = getCmsFirestore();
  if (!db) return null;
  const ref = doc(db, COLLECTIONS.vacancies, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return mapVacancyClientDoc(snap.id, snap.data() as Record<string, unknown>);
}

export async function saveVacancy(input: VacancyUpsertInput): Promise<void> {
  const db = getCmsFirestore();
  if (!db) throw new Error("Firebase ist nicht konfiguriert.");

  const ref = doc(db, COLLECTIONS.vacancies, input.id);
  const existing = await getDoc(ref);
  const prev = existing.exists() ? (existing.data() as Record<string, unknown>) : undefined;

  const payload: Record<string, unknown> = {
    title: input.title.trim(),
    slug: input.slug.trim(),
    excerpt: input.excerpt,
    sector: input.sector,
    location: input.location,
    employmentType: input.employmentType,
    hook: input.hook,
    body: input.body,
    files: input.files,
    apply: input.apply,
    site: input.site,
    status: input.status,
    updatedAt: serverTimestamp(),
  };

  if (!existing.exists()) {
    payload.createdAt = serverTimestamp();
  }

  if (input.status === "published") {
    if (typeof input.publishedAt === "string" && input.publishedAt.length > 0) {
      const d = new Date(input.publishedAt);
      if (Number.isFinite(d.getTime())) payload.publishedAt = Timestamp.fromDate(d);
    } else if (prev?.publishedAt == null) {
      payload.publishedAt = serverTimestamp();
    }
  } else if (input.status === "draft") {
    payload.publishedAt = deleteField();
  }

  await setDoc(ref, payload, { merge: true });
}

export async function deleteVacancy(id: string): Promise<void> {
  const db = getCmsFirestore();
  if (!db) throw new Error("Firebase ist nicht konfiguriert.");
  await deleteDoc(doc(db, COLLECTIONS.vacancies, id));
}

export function vacancyListItemToUpsert(v: VacancyListItem): VacancyUpsertInput {
  return {
    id: v.id,
    title: v.title,
    slug: v.slug,
    excerpt: v.excerpt,
    sector: v.sector,
    location: v.location,
    employmentType: v.employmentType,
    hook: v.hook,
    body: v.body,
    files: v.files,
    apply: v.apply,
    site: v.site,
    status: v.status,
    publishedAt: v.publishedAt ?? undefined,
  };
}
