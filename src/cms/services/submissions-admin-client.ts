"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { SUBMISSION_DOCUMENT_FIELDS } from "../firestore/schema";
import { COLLECTIONS } from "../firestore/collections";
import type { CmsSubmissionStatus, CmsSubmissionType } from "../types/enums";
import type { Submission } from "../types/submission";
import { getCmsFirestore } from "@/firebase/firestore";
import { normalizeSubmissionStatus } from "@/lib/cms/normalize-submission-status";

export type SubmissionListItem = {
  id: string;
  type: string;
  site: string;
  status: CmsSubmissionStatus;
  createdAt: string | null;
  /** From payload when present */
  summary: string | null;
  hasFiles: boolean;
  /** Bewerbung / lead list (from payload); null when absent */
  applicantName: string | null;
  email: string | null;
  phone: string | null;
  jobTitle: string | null;
  messagePreview: string | null;
};

export type SubmissionDetail = Submission & { id: string };

function toIso(v: unknown): string | null {
  if (v && typeof (v as { toDate?: () => Date }).toDate === "function") {
    return (v as { toDate: () => Date }).toDate().toISOString();
  }
  if (typeof v === "string") return v;
  return null;
}

function parseType(raw: unknown): CmsSubmissionType {
  const t = String(raw ?? "");
  if (t === "contact" || t === "executive_search" || t === "application" || t === "newsletter" || t === "generic") {
    return t;
  }
  return "generic";
}

function normalizeSubmissionSite(_raw: unknown): "abexis" {
  return "abexis";
}

function mapDetail(id: string, data: Record<string, unknown>): SubmissionDetail {
  const payload = data[SUBMISSION_DOCUMENT_FIELDS.payload];
  const fileUrls = data[SUBMISSION_DOCUMENT_FIELDS.fileUrls];
  return {
    id,
    type: parseType(data[SUBMISSION_DOCUMENT_FIELDS.type]),
    site: normalizeSubmissionSite(data[SUBMISSION_DOCUMENT_FIELDS.site]),
    payload:
      payload && typeof payload === "object" && !Array.isArray(payload)
        ? Object.fromEntries(
            Object.entries(payload as Record<string, unknown>).map(([k, v]) => [k, String(v ?? "")]),
          )
        : {},
    fileUrls: Array.isArray(fileUrls) ? fileUrls.map(String) : [],
    status: normalizeSubmissionStatus(data[SUBMISSION_DOCUMENT_FIELDS.status]),
    createdAt: toIso(data[SUBMISSION_DOCUMENT_FIELDS.createdAt]) ?? new Date(0).toISOString(),
    updatedAt: toIso(data[SUBMISSION_DOCUMENT_FIELDS.updatedAt]),
    sourceUrl: data[SUBMISSION_DOCUMENT_FIELDS.sourceUrl] == null ? null : String(data[SUBMISSION_DOCUMENT_FIELDS.sourceUrl]),
    userAgent: data[SUBMISSION_DOCUMENT_FIELDS.userAgent] == null ? null : String(data[SUBMISSION_DOCUMENT_FIELDS.userAgent]),
  };
}

function payloadSummary(payload: Record<string, string>): string | null {
  const name = payload.name?.trim();
  const email = payload.email?.trim();
  const company = payload.company?.trim();
  const jobTitle = payload.jobTitle?.trim();
  const bits = [name, company, jobTitle, email].filter(Boolean);
  return bits.length ? bits.join(" · ") : null;
}

function messagePreview(payload: Record<string, string>): string | null {
  const m = payload.message?.trim();
  if (!m) return null;
  return m.length > 160 ? `${m.slice(0, 157)}…` : m;
}

export async function listSubmissionsForAdmin(max = 150): Promise<SubmissionListItem[]> {
  const db = getCmsFirestore();
  if (!db) return [];
  const q = query(collection(db, COLLECTIONS.submissions), orderBy("createdAt", "desc"), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as Record<string, unknown>;
    const payload =
      data.payload && typeof data.payload === "object" && !Array.isArray(data.payload)
        ? (data.payload as Record<string, string>)
        : {};
    const applicantName = payload.name?.trim() || null;
    const email = payload.email?.trim() || null;
    const phone = payload.phone?.trim() || null;
    const jobTitle = payload.jobTitle?.trim() || null;
    return {
      id: d.id,
      type: String(data.type ?? ""),
      site: normalizeSubmissionSite(data.site),
      status: normalizeSubmissionStatus(data.status),
      createdAt: toIso(data.createdAt),
      summary: payloadSummary(payload),
      hasFiles: Array.isArray(data.fileUrls) && data.fileUrls.length > 0,
      applicantName,
      email,
      phone,
      jobTitle,
      messagePreview: messagePreview(payload),
    };
  });
}

export async function getSubmissionForAdmin(id: string): Promise<SubmissionDetail | null> {
  const db = getCmsFirestore();
  if (!db) return null;
  const ref = doc(db, COLLECTIONS.submissions, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return mapDetail(snap.id, snap.data() as Record<string, unknown>);
}

export async function updateSubmissionStatus(id: string, status: CmsSubmissionStatus): Promise<void> {
  const db = getCmsFirestore();
  if (!db) throw new Error("Firebase ist nicht konfiguriert.");
  const ref = doc(db, COLLECTIONS.submissions, id);
  await updateDoc(ref, {
    [SUBMISSION_DOCUMENT_FIELDS.status]: status,
    [SUBMISSION_DOCUMENT_FIELDS.updatedAt]: serverTimestamp(),
  });
}
