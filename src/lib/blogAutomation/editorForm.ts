import type { BlogAutomationArticleLength, BlogAutomationTopicMode } from "@/lib/blogAutomation/types";

export type BlogPostingRecurrence = "none" | "weekly" | "biweekly" | "monthly";

/** CMS editor shape for `blogAutomationSettings/default` (mirrors Firestore, minus timestamps). */
export type BlogAutomationFormState = {
  enabled: boolean;
  articlesPerWeek: number;
  /** One day per week when the automatic pipeline may create a new draft. */
  preferredDays: string[];
  /** Local wall-clock time after which draft creation may happen on the draft day. */
  preferredTime: string;
  /** Weekdays when approved articles should be scheduled to go live. */
  postingDays: string[];
  /** Local wall-clock time for approved article publishing. */
  postingTime: string;
  /** Whether approved articles should reserve the next editorial slot repeatedly. */
  postingRecurrence: BlogPostingRecurrence;
  timezone: string;
  targetAudience: string;
  tone: string;
  defaultLanguage: string;
  topicMode: BlogAutomationTopicMode;
  requireHumanApproval: boolean;
  autoPublish: boolean;
  createSocialPosts: boolean;
  socialPlatforms: string[];
  articleLength: BlogAutomationArticleLength;
  /** Preserved from Firestore; not shown in simplified UI. */
  brandInstructions: string;
  forbiddenTopics: string;
};

export const DEFAULT_BLOG_AUTOMATION_FORM: BlogAutomationFormState = {
  enabled: false,
  articlesPerWeek: 1,
  preferredDays: ["monday"],
  preferredTime: "09:00",
  postingDays: ["thursday"],
  postingTime: "09:00",
  postingRecurrence: "none",
  timezone: "Europe/Zurich",
  targetAudience: "",
  tone: "Ruhig und exekutiv",
  defaultLanguage: "de-CH",
  topicMode: "topic_queue",
  requireHumanApproval: true,
  autoPublish: false,
  createSocialPosts: false,
  socialPlatforms: [],
  articleLength: "medium",
  brandInstructions: "",
  forbiddenTopics: "",
};

function readBool(v: unknown, fallback: boolean): boolean {
  return typeof v === "boolean" ? v : fallback;
}

function readStr(v: unknown, fallback: string): string {
  return typeof v === "string" ? v : fallback;
}

function readStrArr(v: unknown): string[] {
  return Array.isArray(v) ? v.map(String) : [];
}

function readPostingRecurrence(v: unknown): BlogPostingRecurrence {
  return v === "weekly" || v === "biweekly" || v === "monthly" ? v : "none";
}

/** Maps a Firestore settings document to editor state (shared server + browser). */
export function mapFirestoreRecordToBlogAutomationForm(data: Record<string, unknown> | undefined): BlogAutomationFormState {
  if (!data) return { ...DEFAULT_BLOG_AUTOMATION_FORM };

  const topicMode: BlogAutomationTopicMode = data.topicMode === "ai_suggested" ? "ai_suggested" : "topic_queue";
  const articleLengthRaw = data.articleLength;
  const articleLength: BlogAutomationArticleLength =
    articleLengthRaw === "short" || articleLengthRaw === "long" ? articleLengthRaw : "medium";

  const legacyPreferredDays = readStrArr(data.preferredDays);
  const preferredDays = legacyPreferredDays.length ? [legacyPreferredDays[0]!] : DEFAULT_BLOG_AUTOMATION_FORM.preferredDays;
  const postingDaysRaw = readStrArr(data.postingDays);

  return {
    enabled: readBool(data.enabled, DEFAULT_BLOG_AUTOMATION_FORM.enabled),
    articlesPerWeek: 1,
    preferredDays,
    preferredTime: readStr(data.preferredTime, DEFAULT_BLOG_AUTOMATION_FORM.preferredTime),
    postingDays: postingDaysRaw.length ? postingDaysRaw : legacyPreferredDays.length ? legacyPreferredDays : DEFAULT_BLOG_AUTOMATION_FORM.postingDays,
    postingTime: readStr(data.postingTime, readStr(data.preferredTime, DEFAULT_BLOG_AUTOMATION_FORM.postingTime)),
    postingRecurrence: readPostingRecurrence(data.postingRecurrence),
    timezone: readStr(data.timezone, DEFAULT_BLOG_AUTOMATION_FORM.timezone),
    targetAudience: readStr(data.targetAudience, ""),
    tone: readStr(data.tone, DEFAULT_BLOG_AUTOMATION_FORM.tone),
    defaultLanguage: readStr(data.defaultLanguage, DEFAULT_BLOG_AUTOMATION_FORM.defaultLanguage),
    topicMode,
    requireHumanApproval: readBool(data.requireHumanApproval, true),
    autoPublish: readBool(data.autoPublish, false),
    createSocialPosts: readBool(data.createSocialPosts, false),
    socialPlatforms: readStrArr(data.socialPlatforms),
    articleLength,
    brandInstructions: readStr(data.brandInstructions, ""),
    forbiddenTopics: readStr(data.forbiddenTopics, ""),
  };
}
