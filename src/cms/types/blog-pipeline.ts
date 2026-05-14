import { z } from "zod";

export const blogPipelineOutputSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string(),
  metaTitle: z.string(),
  metaDescription: z.string(),
  articleHtml: z.string(),
  researchSummary: z.string(),
  linkedinPost: z.string(),
  imageSearchQueries: z.array(z.string().min(1)).min(1).max(8),
  heroImageAlt: z.string(),
});

export type BlogPipelineOutput = z.infer<typeof blogPipelineOutputSchema>;

export type BlogTopicStatus = "queued" | "processing" | "completed" | "failed";

export type BlogDraftReviewStatus = "needs_review" | "approved" | "rejected";

export type BlogSocialReviewStatus = "needs_review" | "approved" | "rejected";
