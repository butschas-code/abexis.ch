import type { BlogAutomationArticleLength, BlogAutomationTopicMode } from "@/lib/blogAutomation/types";

export type BlogPostingRecurrence = "none" | "weekly" | "biweekly" | "monthly";
export type BlogAutomationOutputMode = "de" | "de_en";
export type BlogAutomationScheduleSlot = {
  weekday: string;
  time: string;
  enabled: boolean;
};

/** CMS editor shape for `blogAutomationSettings/default` (mirrors Firestore, minus timestamps). */
export type BlogAutomationFormState = {
  enabled: boolean;
  articlesPerWeek: number;
  /** One day per week when the automatic pipeline may create a new draft. */
  preferredDays: string[];
  /** Local wall-clock time after which draft creation may happen on the draft day. */
  preferredTime: string;
  /** Up to two editorial slots when the automatic pipeline may create a new draft. */
  draftSlots: BlogAutomationScheduleSlot[];
  /** Weekdays when approved articles should be scheduled to go live. */
  postingDays: string[];
  /** Local wall-clock time for approved article publishing. */
  postingTime: string;
  /** Up to two editorial slots when approved articles should go live. */
  postingSlots: BlogAutomationScheduleSlot[];
  /** Whether approved articles should reserve the next editorial slot repeatedly. */
  postingRecurrence: BlogPostingRecurrence;
  timezone: string;
  targetAudience: string;
  tone: string;
  defaultLanguage: string;
  outputMode: BlogAutomationOutputMode;
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
  draftSlots: [
    { weekday: "monday", time: "09:00", enabled: true },
    { weekday: "thursday", time: "09:00", enabled: false },
  ],
  postingDays: ["thursday"],
  postingTime: "09:00",
  postingSlots: [
    { weekday: "thursday", time: "09:00", enabled: true },
    { weekday: "tuesday", time: "09:00", enabled: false },
  ],
  postingRecurrence: "none",
  timezone: "Europe/Zurich",
  targetAudience: "",
  tone: "Ruhig und exekutiv",
  defaultLanguage: "de-CH",
  outputMode: "de",
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

function readOutputMode(v: unknown): BlogAutomationOutputMode {
  return v === "de_en" ? "de_en" : "de";
}

function readScheduleSlots(
  value: unknown,
  fallbackDays: string[],
  fallbackTime: string,
  fallback: BlogAutomationScheduleSlot[],
): BlogAutomationScheduleSlot[] {
  const raw = Array.isArray(value) ? value : [];
  const slots = raw
    .map((row) => {
      const o = row && typeof row === "object" ? (row as Record<string, unknown>) : {};
      const weekday = typeof o.weekday === "string" && o.weekday.trim() ? o.weekday.trim().toLowerCase() : "";
      const time = typeof o.time === "string" && o.time.trim() ? o.time.trim() : fallbackTime;
      return weekday ? { weekday, time, enabled: o.enabled !== false } : null;
    })
    .filter((slot): slot is BlogAutomationScheduleSlot => slot != null)
    .slice(0, 2);

  if (slots.length > 0) {
    while (slots.length < 2) {
      const fill = fallback[slots.length] ?? fallback[0]!;
      slots.push({ ...fill, enabled: false });
    }
    return slots;
  }

  const days = fallbackDays.length ? fallbackDays : [fallback[0]?.weekday ?? "monday"];
  return [0, 1].map((idx) => ({
    weekday: days[idx] ?? fallback[idx]?.weekday ?? days[0] ?? "monday",
    time: fallbackTime || fallback[idx]?.time || "09:00",
    enabled: idx === 0 ? true : Boolean(days[idx]),
  }));
}

/** Maps a Firestore settings document to editor state (shared server + browser). */
export function mapFirestoreRecordToBlogAutomationForm(data: Record<string, unknown> | undefined): BlogAutomationFormState {
  if (!data) return { ...DEFAULT_BLOG_AUTOMATION_FORM };

  const topicMode: BlogAutomationTopicMode = data.topicMode === "ai_suggested" ? "ai_suggested" : "topic_queue";
  const articleLengthRaw = data.articleLength;
  const articleLength: BlogAutomationArticleLength =
    articleLengthRaw === "short" || articleLengthRaw === "long" ? articleLengthRaw : "medium";

  const legacyPreferredDays = readStrArr(data.preferredDays);
  const preferredDays = legacyPreferredDays.length ? legacyPreferredDays.slice(0, 2) : DEFAULT_BLOG_AUTOMATION_FORM.preferredDays;
  const postingDaysRaw = readStrArr(data.postingDays);
  const postingDays = postingDaysRaw.length ? postingDaysRaw : legacyPreferredDays.length ? legacyPreferredDays : DEFAULT_BLOG_AUTOMATION_FORM.postingDays;
  const preferredTime = readStr(data.preferredTime, DEFAULT_BLOG_AUTOMATION_FORM.preferredTime);
  const postingTime = readStr(data.postingTime, readStr(data.preferredTime, DEFAULT_BLOG_AUTOMATION_FORM.postingTime));
  const draftSlots = readScheduleSlots(data.draftSlots, legacyPreferredDays, preferredTime, DEFAULT_BLOG_AUTOMATION_FORM.draftSlots);
  const postingSlots = readScheduleSlots(data.postingSlots, postingDays, postingTime, DEFAULT_BLOG_AUTOMATION_FORM.postingSlots);

  return {
    enabled: readBool(data.enabled, DEFAULT_BLOG_AUTOMATION_FORM.enabled),
    articlesPerWeek: Math.min(2, Math.max(1, Math.floor(Number(data.articlesPerWeek)) || 1)),
    preferredDays,
    preferredTime,
    draftSlots,
    postingDays,
    postingTime,
    postingSlots,
    postingRecurrence: readPostingRecurrence(data.postingRecurrence),
    timezone: readStr(data.timezone, DEFAULT_BLOG_AUTOMATION_FORM.timezone),
    targetAudience: readStr(data.targetAudience, ""),
    tone: readStr(data.tone, DEFAULT_BLOG_AUTOMATION_FORM.tone),
    defaultLanguage: readStr(data.defaultLanguage, DEFAULT_BLOG_AUTOMATION_FORM.defaultLanguage),
    outputMode: readOutputMode(data.outputMode),
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
