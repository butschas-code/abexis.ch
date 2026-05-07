import { z } from "zod";

export const siteKeySchema = z.literal("abexis");
/** `categories.site` : always `abexis` for new writes. */
export const categorySiteKeySchema = z.literal("abexis");
export const deploymentSiteKeySchema = z.literal("abexis");

export const postStatusSchema = z.enum(["draft", "published", "archived"]);
export const submissionStatusSchema = z.enum(["new", "reviewed", "archived", "spam"]);
export const submissionTypeSchema = z.enum([
  "contact",
  "executive_search",
  "application",
  "newsletter",
  "generic",
]);
export const appUserRoleSchema = z.enum(["admin", "editor", "viewer"]);

export const idString = z.string().trim().min(1).max(128);
export const slugSegment = z
  .string()
  .trim()
  .min(1)
  .max(200)
  .regex(/^[\p{L}\p{N}]+(?:[-_/][\p{L}\p{N}]+)*$/u, "Slug: Buchstaben/Zahlen, optional mit Bindestrich");

/** ISO-like timestamps from our mappers (avoid overly strict RFC3339 parsing). */
export const isoDateString = z.string().min(10).max(40);
