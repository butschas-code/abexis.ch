import type { BlogAutomationArticleLength, BlogAutomationTopicMode } from "@/lib/blogAutomation/types";

/** CMS editor shape for `blogAutomationSettings/default` (mirrors Firestore, minus timestamps). */
export type BlogAutomationFormState = {
  enabled: boolean;
  articlesPerWeek: number;
  preferredDays: string[];
  preferredTime: string;
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

function readNum(v: unknown, fallback: number): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function readBool(v: unknown, fallback: boolean): boolean {
  return typeof v === "boolean" ? v : fallback;
}

function readStr(v: unknown, fallback: string): string {
  return typeof v === "string" ? v : fallback;
}

function readStrArr(v: unknown): string[] {
  return Array.isArray(v) ? v.map(String) : [];
}

/** Maps a Firestore settings document to editor state (shared server + browser). */
export function mapFirestoreRecordToBlogAutomationForm(data: Record<string, unknown> | undefined): BlogAutomationFormState {
  if (!data) return { ...DEFAULT_BLOG_AUTOMATION_FORM };

  const topicMode: BlogAutomationTopicMode = data.topicMode === "ai_suggested" ? "ai_suggested" : "topic_queue";
  const articleLengthRaw = data.articleLength;
  const articleLength: BlogAutomationArticleLength =
    articleLengthRaw === "short" || articleLengthRaw === "long" ? articleLengthRaw : "medium";

  return {
    enabled: readBool(data.enabled, DEFAULT_BLOG_AUTOMATION_FORM.enabled),
    articlesPerWeek: Math.min(3, Math.max(1, Math.floor(readNum(data.articlesPerWeek, 1)))) || 1,
    preferredDays: readStrArr(data.preferredDays).length ? readStrArr(data.preferredDays) : DEFAULT_BLOG_AUTOMATION_FORM.preferredDays,
    preferredTime: readStr(data.preferredTime, DEFAULT_BLOG_AUTOMATION_FORM.preferredTime),
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
