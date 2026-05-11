export type BlogDraftListItem = {
  id: string;
  topicId: string;
  status: string;
  title: string;
  slug: string;
  excerpt: string;
  createdAt: string | null;
};

export type BlogDraftDetail = BlogDraftListItem & {
  metaTitle: string;
  metaDescription: string;
  articleHtml: string;
  researchSummary: string;
  sources: Array<{ title: string; url: string }>;
  openaiResponseId: string | null;
  pipelineModel: string | null;
  approvedAt: string | null;
  publishedAt: string | null;
  publishedPostId: string | null;
  heroImageUrl: string | null;
  heroImageAlt: string | null;
  heroImageCredit: string | null;
  heroImagePhotographerName: string | null;
  heroImagePhotographerUrl: string | null;
  heroImageUnsplashUrl: string | null;
  imageSearchQuery: string | null;
};

export type BlogSocialListItem = {
  id: string;
  topicId: string;
  blogDraftId: string;
  status: string;
  linkedinPost: string;
  shortLinkedinPost: string;
  xPost: string;
  createdAt: string | null;
  /** Set when an editor marks the copy as manually posted (never triggers API posting). */
  usedAt: string | null;
};

export type BlogTopicListItem = {
  id: string;
  title: string;
  brief: string | null;
  status: string;
  lastPipelineError: string | null;
  lastDraftId: string | null;
  createdAt: string | null;
};

export type { UnsplashPhotoBrief } from "@/lib/blogAutomation/unsplash-photo-types";
