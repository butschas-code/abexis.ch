import { z } from "zod";
import { idString, isoDateString, postStatusSchema, siteKeySchema, slugSegment } from "./common";

const vacancyFileSchema = z.object({
  label: z.string().trim().min(1).max(300),
  url: z.string().url({ message: "Bitte eine gültige URL eingeben." }).max(2000),
});

const nullableStr = (max = 2000) =>
  z.preprocess((v) => {
    if (v == null) return "";
    if (typeof v !== "string") return String(v);
    return v.trim();
  }, z.string().max(max).default(""));

/** Mirrors Firestore `vacancies` — distinguishes general spontaneous applications from concrete mandates. */
export const vacancyJobKindSchema = z.enum(["vacancy", "spontanbewerbung"]);

export const vacancyCreateInputSchema = z.object({
  title: z.string().trim().min(1).max(500),
  slug: slugSegment,
  excerpt: nullableStr(1000),
  sector: nullableStr(200),
  location: nullableStr(200),
  employmentType: nullableStr(200),
  jobType: vacancyJobKindSchema.default("vacancy"),
  /** General spontaneous-application entry; excluded from public vacancy listings; synced with `jobType` in the CMS UI. */
  isSpontaneous: z.boolean().default(false),
  hook: nullableStr(1000),
  body: z.string().max(500_000).default(""),
  files: z.array(vacancyFileSchema).max(20).default([]),
  apply: nullableStr(2000),
  site: siteKeySchema,
  status: postStatusSchema.default("draft"),
});

export const vacancyUpsertInputSchema = vacancyCreateInputSchema.extend({
  id: idString,
  publishedAt: z.union([isoDateString, z.null()]).optional(),
});

export const vacancyUpdateInputSchema = vacancyCreateInputSchema
  .partial()
  .extend({ id: idString })
  .refine((v) => Object.keys(v).length > 1, { message: "Mindestens ein Feld neben id muss gesetzt sein." });

export const vacancyOutputSchema = vacancyCreateInputSchema.extend({
  id: idString,
  publishedAt: z.union([isoDateString, z.null()]),
  createdAt: isoDateString,
  updatedAt: isoDateString,
});
