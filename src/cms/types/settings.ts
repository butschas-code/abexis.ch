import type { DeploymentSiteKey } from "./site";
import type { SiteKey } from "./site";

/** Contact block for one deployment; all keys explicit when the block exists. */
export type SiteContactDetails = {
  businessName: string | null;
  email: string | null;
  phone: string | null;
  addressLines: string[];
  headline: string | null;
};

export type SiteFooterLegalLink = {
  label: string;
  href: string;
};

export type SiteFooterColumn = {
  title: string | null;
  bodyHtml: string | null;
};

export type SiteFooterData = {
  copyrightHtml: string | null;
  legalLinks: SiteFooterLegalLink[];
  /** Optional extra columns; default `[]` when absent in Firestore. */
  columns: SiteFooterColumn[];
};

/** Legacy single-site SEO block (Firestore may still carry `defaultSeo` only). */
export type SiteDefaultSeo = {
  titleSuffix: string | null;
  defaultDescription: string | null;
  ogType: "website" | "article";
};

/** Per-deployment SEO defaults (`abexis` / `search`). */
export type SiteSeoBlock = {
  defaultTitle: string | null;
  defaultMetaDescription: string | null;
  titleSuffix: string | null;
  ogType: "website" | "article";
};

export type SiteSocialLink = {
  label: string;
  href: string;
  order: number;
};

export type SiteSwitchBarLink = {
  label: string;
  href: string;
  site: SiteKey;
  order: number;
};

/**
 * `settings/{docId}` : singleton-style document (`CMS_SETTINGS_GLOBAL_DOC_ID`).
 */
export type SiteSettings = {
  contactBySite: Partial<Record<DeploymentSiteKey, SiteContactDetails>>;
  footer: SiteFooterData;
  /** @deprecated Prefer `seoBySite`; still read for migration. */
  defaultSeo?: SiteDefaultSeo;
  seoBySite: Partial<Record<DeploymentSiteKey, SiteSeoBlock>>;
  switchBarLinks: SiteSwitchBarLink[];
  socialLinks: SiteSocialLink[];
  createdAt: string;
  updatedAt: string;
};

export const CMS_SETTINGS_GLOBAL_DOC_ID = "global" as const;

/** Legacy names : prefer `Site*` types. */
export type CmsSiteContactDetails = SiteContactDetails;
export type CmsFooterLegalLink = SiteFooterLegalLink;
export type CmsFooterColumn = SiteFooterColumn;
export type CmsFooterData = SiteFooterData;
export type CmsDefaultSeo = SiteDefaultSeo;
export type CmsSiteSeoBlock = SiteSeoBlock;
export type CmsSiteSocialLink = SiteSocialLink;
export type CmsSwitchBarLink = SiteSwitchBarLink;
export type CmsSettings = SiteSettings;
