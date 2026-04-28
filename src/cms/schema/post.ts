import { z } from "zod";
import { idString, isoDateString, postStatusSchema, siteKeySchema, slugSegment } from "./common";

/** Empty / whitespace → `null`; otherwise must be `http(s)` URL (max length). */
const heroImageUrlSchema = z.preprocess((v) => {
  if (v == null) return null;
  if (typeof v !== "string") return v;
  const t = v.trim();
  return t === "" ? null : t;
}, z.union([z.null(), z.string().url({ message: "Bitte eine gültige URL eingeben." }).max(2000)]));

/** Empty / whitespace → `null`. */
const heroImageAltSchema = z.preprocess((v) => {
  if (v == null) return null;
  if (typeof v !== "string") return v;
  const t = v.trim();
  return t === "" ? null : t;
}, z.union([z.null(), z.string().max(500)]));

/** Create a new post (no Firestore id yet : assign client-side id before first write). */
export const postCreateInputSchema = z.object({
  title: z.string().trim().min(1).max(500),
  slug: slugSegment,
  excerpt: z.string().max(20_000).default(""),
  body: z.string().max(500_000).default(""),
  heroImageUrl: heroImageUrlSchema,
  /** Optional alt text for the hero / cover image (accessibility + SEO). */
  heroImageAlt: heroImageAltSchema,
  /** Legacy Storage object path; editor leaves this unset (null). */
  heroImagePath: z.union([z.string().max(1024), z.null()]).default(null),
  authorId: idString,
  categoryIds: z.array(idString).max(50).default([]),
  tags: z.array(z.string().trim().min(1).max(80)).max(50).default([]),
  site: siteKeySchema,
  status: postStatusSchema.default("draft"),
  seoTitle: z.union([z.string().max(320), z.null()]).default(null),
  seoDescription: z.union([z.string().max(2000), z.null()]).default(null),
  featured: z.boolean().default(false),
});

/** Upsert (admin editor) : includes Firestore document id. */
export const postUpsertInputSchema = postCreateInputSchema.extend({
  id: idString,
  /** When publishing: optional fixed publish time (ISO). Omit = server time on first publish; preserve when omitted on update. */
  publishedAt: z.union([isoDateString, z.null()]).optional(),
});

/** Partial update: at least one mutable field; `id` required for addressing. */
export const postUpdateInputSchema = postCreateInputSchema
  .partial()
  .extend({
    id: idString,
  })
  .refine((v) => Object.keys(v).length > 1, { message: "Mindestens ein Feld neben id muss gesetzt sein." });

/** Serialized post returned from API / mappers (includes server timestamps as ISO). */
export const postOutputSchema = postCreateInputSchema.extend({
  id: idString,
  publishedAt: z.union([isoDateString, z.null()]),
  createdAt: isoDateString,
  updatedAt: isoDateString,
});
