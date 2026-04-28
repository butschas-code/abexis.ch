import { z } from "zod";
import { deploymentSiteKeySchema, submissionStatusSchema, submissionTypeSchema } from "./common";

const payloadRecord = z
  .record(z.string().max(80), z.string().max(8000))
  .refine((o) => Object.keys(o).length > 0 && Object.keys(o).length <= 40, { message: "Payload: 1-40 Felder." });

export const submissionCreateInputSchema = z.object({
  type: submissionTypeSchema,
  site: deploymentSiteKeySchema,
  payload: payloadRecord,
  /** Public or signed URLs : not strictly `http(s)` (may be relative paths from clients). */
  fileUrls: z.array(z.string().max(2000)).max(20).default([]),
  status: submissionStatusSchema.default("new"),
  sourceUrl: z.union([z.string().max(2000), z.null()]).default(null),
  userAgent: z.union([z.string().max(500), z.null()]).default(null),
});

export const submissionUpdateInputSchema = z.object({
  id: z.string().trim().min(1).max(128),
  status: submissionStatusSchema.optional(),
  fileUrls: z.array(z.string().max(2000)).max(20).optional(),
  sourceUrl: z.union([z.string().max(2000), z.null()]).optional(),
  userAgent: z.union([z.string().max(500), z.null()]).optional(),
});

export const submissionOutputSchema = submissionCreateInputSchema.extend({
  id: z.string().trim().min(1).max(128),
  createdAt: z.string().min(10).max(40),
  updatedAt: z.union([z.string().min(10).max(40), z.null()]).optional(),
});
