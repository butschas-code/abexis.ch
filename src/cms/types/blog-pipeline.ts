import { z } from "zod";

/** Source row returned by the OpenAI pipeline (stored on drafts). */
export const blogPipelineSourceSchema = z.object({
  title: z.string(),
  url: z.string(),
});

export const blogPipelineOutputSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string(),
  metaTitle: z.string(),
  metaDescription: z.string(),
  articleHtml: z.string(),
  researchSummary: z.string(),
  sources: z.array(blogPipelineSourceSchema),
  linkedinPost: z.string(),
  shortLinkedinPost: z.string(),
  xPost: z.string(),
  imageSearchQueries: z.array(z.string().min(1)).min(1).max(8),
  heroImageAlt: z.string(),
});

export type BlogPipelineOutput = z.infer<typeof blogPipelineOutputSchema>;

export type BlogTopicStatus = "queued" | "processing" | "completed" | "failed";

export type BlogDraftReviewStatus = "needs_review" | "approved" | "rejected";

export type BlogSocialReviewStatus = "needs_review" | "approved" | "rejected";
