import { z } from "zod";
import { siteKeySchema } from "./common";

const contactBlock = z.object({
  businessName: z.union([z.string().max(200), z.null()]).default(null),
  email: z.union([z.string().email().max(320), z.null()]),
  phone: z.union([z.string().max(80), z.null()]),
  addressLines: z.array(z.string().max(200)).max(20).default([]),
  headline: z.union([z.string().max(200), z.null()]),
});

const footerLegal = z.object({
  label: z.string().min(1).max(120),
  href: z.string().min(1).max(2000),
});

const footerColumn = z.object({
  title: z.union([z.string().max(200), z.null()]),
  bodyHtml: z.union([z.string().max(50_000), z.null()]),
});

const footer = z.object({
  copyrightHtml: z.union([z.string().max(2000), z.null()]),
  legalLinks: z.array(footerLegal).max(30).default([]),
  columns: z.array(footerColumn).max(20).default([]),
});

/** Legacy field; omitted on new writes when `seoBySite` is used. */
const defaultSeo = z.object({
  titleSuffix: z.union([z.string().max(200), z.null()]),
  defaultDescription: z.union([z.string().max(2000), z.null()]),
  ogType: z.enum(["website", "article"]).default("website"),
});

const seoBlock = z.object({
  defaultTitle: z.union([z.string().max(200), z.null()]),
  defaultMetaDescription: z.union([z.string().max(2000), z.null()]),
  titleSuffix: z.union([z.string().max(200), z.null()]),
  ogType: z.enum(["website", "article"]).default("website"),
});

const socialLink = z.object({
  label: z.string().min(1).max(120),
  href: z.string().min(1).max(2000),
  order: z.number().int().min(0).max(1_000_000).default(0),
});

const switchLink = z.object({
  label: z.string().min(1).max(120),
  href: z.string().min(1).max(2000),
  site: siteKeySchema,
  order: z.number().int().min(0).max(1_000_000).default(0),
});

const contactBySite = z.object({
  abexis: contactBlock.optional(),
});

const seoBySite = z.object({
  abexis: seoBlock.optional(),
});

/** Full replace of settings document (admin save). */
export const siteSettingsReplaceInputSchema = z.object({
  contactBySite: contactBySite.default({}),
  footer,
  defaultSeo: defaultSeo.optional(),
  seoBySite: seoBySite.default({}),
  socialLinks: z.array(socialLink).max(20).default([]),
  switchBarLinks: z.array(switchLink).max(40).default([]),
});

/** Patch-style update (merge-friendly). */
export const siteSettingsUpdateInputSchema = siteSettingsReplaceInputSchema.partial();

export const siteSettingsOutputSchema = siteSettingsReplaceInputSchema.extend({
  createdAt: z.string().min(10).max(40),
  updatedAt: z.string().min(10).max(40),
});
