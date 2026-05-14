import type { Timestamp } from "firebase/firestore";

/**
 * Blog automation & pipeline documents (`blogAutomationSettings`, `blogTopics`, etc.).
 * Timestamps are Firestore {@link Timestamp} in persisted docs unless noted otherwise.
 */

/** Canonical lifecycle values shared across topics, drafts, and social rows where applicable. */
export const BLOG_PIPELINE_STATUSES = [
  "queued",
  "scheduled",
  "researching",
  "draft_created",
  "needs_review",
  "approved",
  "published",
  "failed",
  "skipped",
] as const;

export type BlogPipelineStatus = (typeof BLOG_PIPELINE_STATUSES)[number];

/** Lowercase weekday labels for `preferredDays` (IANA timezone handled separately). */
export const BLOG_AUTOMATION_WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type BlogAutomationWeekday = (typeof BLOG_AUTOMATION_WEEKDAYS)[number];

export type BlogAutomationTopicMode = "topic_queue" | "ai_suggested";

export type BlogAutomationArticleLength = "short" | "medium" | "long";

/**
 * Single settings document : use doc id {@link BLOG_AUTOMATION_SETTINGS_DOC_ID} unless you intentionally shard by env/site later.
 */
export const BLOG_AUTOMATION_SETTINGS_DOC_ID = "default" as const;

/** `blogAutomationSettings/{docId}` — editorial automation preferences. */
export type BlogAutomationSettings = {
  enabled: boolean;
  articlesPerWeek: number;
  /** Weekday labels, typically `monday` … `sunday` (validate at write-time in CMS). */
  preferredDays: string[];
  /** Local wall-clock time for scheduling, e.g. `"09:30"`. */
  preferredTime: string;
  /** IANA timezone, e.g. `Europe/Zurich`. */
  timezone: string;
  targetAudience: string;
  tone: string;
  /** Content language hint for generation, e.g. `de-CH`. */
  defaultLanguage: string;
  topicMode: BlogAutomationTopicMode;
  /** When true, drafts never promote without explicit approval (even if `autoPublish` is true elsewhere). */
  requireHumanApproval: boolean;
  /** When true and approval satisfied, pipeline may publish — keep false for draft-only workflows. */
  autoPublish: boolean;
  createSocialPosts: boolean;
  /** e.g. `linkedin`, `x` — stored as plain strings for flexibility. */
  socialPlatforms: string[];
  articleLength: BlogAutomationArticleLength;
  brandInstructions: string;
  forbiddenTopics: string;
  updatedAt: Timestamp;
  createdAt: Timestamp;
};

/** External citation stored on drafts. */
export type BlogDraftSource = {
  title: string;
  url: string;
};

/** `blogTopics/{topicId}` — queued or scheduled editorial intents. */
export type BlogTopic = {
  title: string;
  targetKeyword: string;
  audience: string;
  angle: string;
  notes: string;
  priority: number;
  status: BlogPipelineStatus;
  /** When the topic is intended to enter the pipeline (optional). */
  scheduledFor: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

/** `blogDrafts/{draftId}` — generated article payload before/after review & publish. */
export type BlogDraft = {
  title: string;
  slug: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  articleHtml: string;
  researchSummary: string;
  sources: BlogDraftSource[];
  status: BlogPipelineStatus;
  topicId: string | null;
  automationRunId: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  approvedAt: Timestamp | null;
  publishedAt: Timestamp | null;
  /** Optional Unsplash-backed hero (automation + manual picker). */
  heroImageUrl?: string | null;
  heroImageAlt?: string | null;
  heroImageCredit?: string | null;
  heroImagePhotographerName?: string | null;
  heroImagePhotographerUrl?: string | null;
  heroImageUnsplashUrl?: string | null;
  heroImageDownloadLocation?: string | null;
  imageSearchQuery?: string | null;
};

/** `blogSocialPosts/{id}` — optional social variants tied to a draft/topic. */
export type BlogSocialPost = {
  topicId: string | null;
  blogDraftId: string | null;
  automationRunId: string | null;
  status: BlogPipelineStatus;
  /** Subset of platforms this row covers (mirrors settings granularity). */
  platforms: string[];
  linkedinPost: string;
  socialImageUrl?: string | null;
  socialImageAlt?: string | null;
  /** Manual editorial flag (CMS only): marked when copy was posted elsewhere. */
  usedAt?: Timestamp | null;
  /** Append-only summary of successful Nuelink handoffs. */
  nuelinkSends?: Array<{
    target: string;
    postId: string;
    brandId: number;
    collectionId: number;
    publishMode: string;
    sentAt: Timestamp;
  }>;
  nuelinkLastSentAt?: Timestamp | null;
  nuelinkLastTarget?: string | null;
  nuelinkLastPostId?: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

/** Run lifecycle for audit batches ( separate from per-topic/draft status ). */
export const BLOG_PIPELINE_RUN_STATUSES = ["started", "completed", "failed", "cancelled"] as const;

export type BlogPipelineRunStatus = (typeof BLOG_PIPELINE_RUN_STATUSES)[number];

export type BlogPipelineRunTrigger = "cron" | "manual";

/** `blogPipelineRuns/{runId}` — one scheduler / batch execution record. */
export type BlogPipelineRun = {
  trigger: BlogPipelineRunTrigger;
  status: BlogPipelineRunStatus;
  startedAt: Timestamp;
  completedAt: Timestamp | null;
  /** High-level counters for dashboards (best-effort). */
  topicsProcessed: number;
  draftsCreated: number;
  socialPostsCreated: number;
  errorCount: number;
  /** Last error message when status is `failed` (optional detail lives in logs). */
  lastErrorMessage: string | null;
};

export const BLOG_PIPELINE_LOG_LEVELS = ["debug", "info", "warn", "error"] as const;

export type BlogPipelineLogLevel = (typeof BLOG_PIPELINE_LOG_LEVELS)[number];

/** `blogPipelineLogs/{logId}` — append-only diagnostic rows for a run. */
export type BlogPipelineLog = {
  pipelineRunId: string;
  createdAt: Timestamp;
  level: BlogPipelineLogLevel;
  message: string;
  topicId: string | null;
  draftId: string | null;
  /** Structured detail safe for Firestore (no nested entity graphs). */
  context: Record<string, unknown> | null;
};
