"use client";

import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { parseSiteSettingsReplace } from "@/cms/schema";
import { SETTINGS_DOCUMENT_FIELDS } from "../firestore/schema";
import { COLLECTIONS } from "../firestore/collections";
import type { SiteSettingsReplaceInput } from "../types/dto";
import { CMS_SETTINGS_GLOBAL_DOC_ID } from "../types/settings";
import { getCmsFirestore } from "@/firebase/firestore";
import { mergeSiteSettingsForForm } from "@/lib/cms/site-settings-defaults";

const EMPTY_CONTACT = {
  businessName: null,
  email: null,
  phone: null,
  addressLines: [] as string[],
  headline: null,
};

const EMPTY_SEO = {
  defaultTitle: null,
  defaultMetaDescription: null,
  titleSuffix: null,
  ogType: "website" as const,
};

function migrateFirestoreSettings(rest: Record<string, unknown>): Record<string, unknown> {
  const o = { ...rest };

  if (!o.footer || typeof o.footer !== "object") {
    o.footer = { copyrightHtml: null, legalLinks: [], columns: [] };
  }
  if (!Array.isArray(o.socialLinks)) o.socialLinks = [];
  if (!Array.isArray(o.switchBarLinks)) o.switchBarLinks = [];

  const seoSiteRaw = (o.seoBySite ?? {}) as Record<string, unknown>;
  const seoBy = seoSiteRaw && typeof seoSiteRaw === "object" ? seoSiteRaw : {};
  const hasSeo = seoBy.abexis != null || seoBy.search != null;
  if (!hasSeo && o.defaultSeo && typeof o.defaultSeo === "object") {
    const ds = o.defaultSeo as Record<string, unknown>;
    const block = {
      defaultTitle: null,
      defaultMetaDescription: ds.defaultDescription ?? null,
      titleSuffix: ds.titleSuffix ?? null,
      ogType: ds.ogType === "article" ? ("article" as const) : ("website" as const),
    };
    o.seoBySite = { abexis: { ...EMPTY_SEO, ...block } };
  } else {
    const searchBlk = seoBy.search != null && typeof seoBy.search === "object" ? seoBy.search : null;
    const abexisBlk = seoBy.abexis != null && typeof seoBy.abexis === "object" ? seoBy.abexis : null;
    o.seoBySite = {
      abexis: {
        ...EMPTY_SEO,
        ...(searchBlk as object),
        ...(abexisBlk as object),
      },
    };
  }

  const cbsRaw = (o.contactBySite ?? {}) as Record<string, unknown>;
  const searchContact = cbsRaw.search != null && typeof cbsRaw.search === "object" ? cbsRaw.search : null;
  const abexisContact = cbsRaw.abexis != null && typeof cbsRaw.abexis === "object" ? cbsRaw.abexis : null;
  o.contactBySite = {
    abexis: {
      ...EMPTY_CONTACT,
      ...(searchContact as object),
      ...(abexisContact as object),
    },
  };

  o.switchBarLinks = (o.switchBarLinks as unknown[]).map((row) => {
    if (row && typeof row === "object" && "site" in row) {
      return { ...(row as object), site: "abexis" };
    }
    return row;
  });

  return o;
}

function toIso(v: unknown): string | null {
  if (v && typeof (v as { toDate?: () => Date }).toDate === "function") {
    return (v as { toDate: () => Date }).toDate().toISOString();
  }
  if (typeof v === "string" && v.length > 0) return v;
  return null;
}

function coerceContactEmailAndNulls(input: SiteSettingsReplaceInput): SiteSettingsReplaceInput {
  const next = structuredClone(input);
  const trimOrNull = (s: string | null | undefined): string | null => {
    if (s == null) return null;
    const t = s.trim();
    return t === "" ? null : t;
  };

  const abexisContact = next.contactBySite?.abexis;
  if (abexisContact) {
    abexisContact.businessName = trimOrNull(abexisContact.businessName);
    abexisContact.email = trimOrNull(abexisContact.email);
    abexisContact.phone = trimOrNull(abexisContact.phone);
    abexisContact.headline = trimOrNull(abexisContact.headline);
    abexisContact.addressLines = (abexisContact.addressLines ?? [])
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  const abexisSeo = next.seoBySite?.abexis;
  if (abexisSeo) {
    abexisSeo.defaultTitle = trimOrNull(abexisSeo.defaultTitle);
    abexisSeo.defaultMetaDescription = trimOrNull(abexisSeo.defaultMetaDescription);
    abexisSeo.titleSuffix = trimOrNull(abexisSeo.titleSuffix);
  }

  if (next.footer) {
    next.footer.copyrightHtml = trimOrNull(next.footer.copyrightHtml);
    next.footer.legalLinks = (next.footer.legalLinks ?? []).map((l) => ({
      label: l.label.trim(),
      href: l.href.trim(),
    }));
    next.footer.columns = (next.footer.columns ?? []).map((c) => ({
      title: trimOrNull(c.title),
      bodyHtml: trimOrNull(c.bodyHtml),
    }));
  }

  next.socialLinks = (next.socialLinks ?? []).map((l, i) => ({
    label: l.label.trim(),
    href: l.href.trim(),
    order: typeof l.order === "number" ? l.order : i,
  }));

  next.switchBarLinks = (next.switchBarLinks ?? []).map((l, i) => ({
    label: l.label.trim(),
    href: l.href.trim(),
    site: "abexis" as const,
    order: typeof l.order === "number" ? l.order : i,
  }));

  if (next.defaultSeo) {
    next.defaultSeo.titleSuffix = trimOrNull(next.defaultSeo.titleSuffix);
    next.defaultSeo.defaultDescription = trimOrNull(next.defaultSeo.defaultDescription);
  }

  return next;
}

export type LoadedSiteSettings = {
  settings: SiteSettingsReplaceInput;
  createdAt: string | null;
  updatedAt: string | null;
};

export async function getSiteSettingsForAdmin(): Promise<LoadedSiteSettings | null> {
  const db = getCmsFirestore();
  if (!db) return null;

  const ref = doc(db, COLLECTIONS.settings, CMS_SETTINGS_GLOBAL_DOC_ID);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    return null;
  }

  const raw = snap.data() as Record<string, unknown>;
  const createdAt = toIso(raw[SETTINGS_DOCUMENT_FIELDS.createdAt]);
  const updatedAt = toIso(raw[SETTINGS_DOCUMENT_FIELDS.updatedAt]);

  const rest: Record<string, unknown> = { ...raw };
  delete rest[SETTINGS_DOCUMENT_FIELDS.createdAt];
  delete rest[SETTINGS_DOCUMENT_FIELDS.updatedAt];
  const migrated = migrateFirestoreSettings(rest);
  const parsed = parseSiteSettingsReplace(migrated);
  if (!parsed.success) {
    console.error(parsed.error.flatten());
    return {
      settings: mergeSiteSettingsForForm(null),
      createdAt,
      updatedAt,
    };
  }

  return {
    settings: mergeSiteSettingsForForm(parsed.data),
    createdAt,
    updatedAt,
  };
}

export async function saveSiteSettings(
  input: SiteSettingsReplaceInput,
  options: { hadExistingDoc: boolean },
): Promise<void> {
  const db = getCmsFirestore();
  if (!db) throw new Error("Firebase ist nicht konfiguriert.");

  const coerced = coerceContactEmailAndNulls(input);
  const parsed = parseSiteSettingsReplace(coerced);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((e) => e.message).join(" · ");
    throw new Error(msg || "Validierung fehlgeschlagen.");
  }

  const ref = doc(db, COLLECTIONS.settings, CMS_SETTINGS_GLOBAL_DOC_ID);
  const d = parsed.data;
  const payload: Record<string, unknown> = {
    [SETTINGS_DOCUMENT_FIELDS.contactBySite]: d.contactBySite,
    [SETTINGS_DOCUMENT_FIELDS.footer]: d.footer,
    [SETTINGS_DOCUMENT_FIELDS.seoBySite]: d.seoBySite,
    [SETTINGS_DOCUMENT_FIELDS.socialLinks]: d.socialLinks,
    [SETTINGS_DOCUMENT_FIELDS.switchBarLinks]: d.switchBarLinks,
    [SETTINGS_DOCUMENT_FIELDS.updatedAt]: serverTimestamp(),
  };

  if (d.defaultSeo !== undefined) {
    payload[SETTINGS_DOCUMENT_FIELDS.defaultSeo] = d.defaultSeo;
  }

  if (!options.hadExistingDoc) {
    payload[SETTINGS_DOCUMENT_FIELDS.createdAt] = serverTimestamp();
  }

  await setDoc(ref, payload, { merge: true });
}
