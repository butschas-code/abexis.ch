import "server-only";

import OpenAI from "openai";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

import { COLLECTIONS } from "@/cms/firestore/collections";
import { parsePostUpsert } from "@/cms/schema";
import type { PostUpsertInput } from "@/cms/types/dto";
import { serializePostBody } from "@/lib/cms/post-body-storage";
import {
  generateBlogDraft,
  type BlogAutomationDraftOutput,
} from "@/lib/blogAutomation/generateBlogDraft";
import { findUnsplashImage, type UnsplashHeroSelection } from "@/lib/blogAutomation/findUnsplashImage";
import { shouldRunAutomation } from "@/lib/blogAutomation/shouldRunAutomation";
import {
  BLOG_AUTOMATION_SETTINGS_DOC_ID,
  type BlogAutomationArticleLength,
  type BlogAutomationSettings,
  type BlogAutomationTopicMode,
  type BlogPipelineLogLevel,
  type BlogPipelineRunTrigger,
  type BlogPipelineStatus,
  type BlogTopic,
} from "@/lib/blogAutomation/types";
import { adminDb } from "@/lib/firebaseAdmin";

const SETTINGS_DOC_PATH = `${COLLECTIONS.blogAutomationSettings}/${BLOG_AUTOMATION_SETTINGS_DOC_ID}`;

export type RunBlogAutomationResult = {
  ok: boolean;
  skipped?: boolean;
  reason?: string;
  error?: string;
  runId?: string;
  topicId?: string;
  draftId?: string;
  publishedPostId?: string;
};

export type RunBlogAutomationOptions = {
  /** CMS action: create one draft immediately, without waiting for the daily cron/time gate. */
  bypassScheduleGate?: boolean;
};

function resolveOpenAiModel(): string {
  return process.env.OPENAI_BLOG_MODEL?.trim() || "gpt-4.1-mini";
}

function asTimestamp(value: unknown): Timestamp {
  if (value && typeof (value as Timestamp).toMillis === "function") {
    return value as Timestamp;
  }
  return Timestamp.now();
}

/**
 * Maps Firestore → domain shape with **safe defaults** (human review on by default).
 */
export function coerceBlogAutomationSettings(raw: Record<string, unknown>): BlogAutomationSettings {
  const topicMode: BlogAutomationTopicMode =
    raw.topicMode === "ai_suggested" ? "ai_suggested" : "topic_queue";

  const articleLengthRaw = raw.articleLength;
  const articleLength: BlogAutomationArticleLength =
    articleLengthRaw === "short" || articleLengthRaw === "long" ? articleLengthRaw : "medium";

  const rawApw =
    typeof raw.articlesPerWeek === "number" && Number.isFinite(raw.articlesPerWeek)
      ? Math.floor(raw.articlesPerWeek)
      : 1;

  let preferredDays = Array.isArray(raw.preferredDays)
    ? raw.preferredDays.map(String).map((s) => s.trim().toLowerCase()).filter(Boolean)
    : [];
  if (preferredDays.length === 0) {
    preferredDays = ["monday"];
  }

  return {
    enabled: raw.enabled === true,
    articlesPerWeek: Math.min(3, Math.max(1, rawApw)),
    preferredDays,
    preferredTime: typeof raw.preferredTime === "string" ? raw.preferredTime : "09:00",
    timezone: typeof raw.timezone === "string" ? raw.timezone : "Europe/Zurich",
    targetAudience: typeof raw.targetAudience === "string" ? raw.targetAudience : "",
    tone: typeof raw.tone === "string" ? raw.tone : "",
    defaultLanguage: typeof raw.defaultLanguage === "string" ? raw.defaultLanguage : "de-CH",
    topicMode,
    /** Default true : safer for non-technical editors. */
    requireHumanApproval: raw.requireHumanApproval !== false,
    /** Default false : drafts stay off the live site unless explicitly enabled. */
    autoPublish: raw.autoPublish === true,
    createSocialPosts: raw.createSocialPosts === true,
    socialPlatforms: Array.isArray(raw.socialPlatforms) ? raw.socialPlatforms.map(String) : [],
    articleLength,
    brandInstructions: typeof raw.brandInstructions === "string" ? raw.brandInstructions : "",
    forbiddenTopics: typeof raw.forbiddenTopics === "string" ? raw.forbiddenTopics : "",
    createdAt: asTimestamp(raw.createdAt),
    updatedAt: asTimestamp(raw.updatedAt),
  } as BlogAutomationSettings;
}

async function loadAutomationSettings(): Promise<BlogAutomationSettings | null> {
  const snap = await adminDb.doc(SETTINGS_DOC_PATH).get();
  if (!snap.exists) return null;
  return coerceBlogAutomationSettings(snap.data() as Record<string, unknown>);
}

async function appendPipelineLog(params: {
  pipelineRunId: string;
  level: BlogPipelineLogLevel;
  message: string;
  topicId?: string | null;
  draftId?: string | null;
  context?: Record<string, unknown> | null;
}): Promise<void> {
  await adminDb.collection(COLLECTIONS.blogPipelineLogs).add({
    pipelineRunId: params.pipelineRunId,
    createdAt: FieldValue.serverTimestamp(),
    level: params.level,
    message: params.message,
    topicId: params.topicId ?? null,
    draftId: params.draftId ?? null,
    context: params.context ?? null,
  });
}

const aiTopicSuggestionSchema = z.object({
  title: z.string().min(1),
  targetKeyword: z.string(),
  audience: z.string(),
  angle: z.string(),
  notes: z.string(),
  priority: z.number().int(),
});

const AI_TOPIC_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["title", "targetKeyword", "audience", "angle", "notes", "priority"],
  properties: {
    title: { type: "string" },
    targetKeyword: { type: "string" },
    audience: { type: "string" },
    angle: { type: "string" },
    notes: { type: "string" },
    priority: { type: "integer" },
  },
} as const;

async function suggestQueuedBlogTopic(settings: BlogAutomationSettings): Promise<z.infer<typeof aiTopicSuggestionSchema>> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("[blogAutomation] Missing OPENAI_API_KEY for AI topic suggestion.");
  }

  const client = new OpenAI({ apiKey });
  const model = resolveOpenAiModel();

  const instructions = `You propose ONE editorial blog topic for Abexis (Swiss consulting). Output strict JSON only.
Constraints:
- Align with target audience, tone, brand instructions, and avoid forbidden themes listed in the user message.
- Executive Search is only one practice area, not the whole firm.
- Priority is an integer (lower = sooner); use 10–50 typical range.
- No hype; titles are professional and precise.`;

  const userMsg = `Automation context:
targetAudience: ${settings.targetAudience}
tone: ${settings.tone}
defaultLanguage: ${settings.defaultLanguage}
articleLength: ${settings.articleLength}
brandInstructions: ${settings.brandInstructions || "(none)"}
forbiddenTopics: ${settings.forbiddenTopics || "(none)"}

Suggest one topic as JSON matching the schema.`;

  const response = await client.responses.parse({
    model,
    tools: [
      {
        type: "web_search",
        user_location: { type: "approximate", country: "CH", city: "Zürich", region: "Zürich" },
      },
    ],
    tool_choice: "auto",
    include: ["web_search_call.action.sources"],
    instructions,
    input: userMsg,
    text: {
      format: {
        type: "json_schema",
        name: "blog_topic_suggestion_v1",
        strict: true,
        schema: AI_TOPIC_JSON_SCHEMA as unknown as Record<string, unknown>,
      },
    },
  });

  const raw = response.output_parsed ?? safeParseJson((response as { output_text?: string }).output_text);
  const parsed = aiTopicSuggestionSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`[blogAutomation] Invalid AI topic JSON: ${JSON.stringify(parsed.error.flatten())}`);
  }
  return parsed.data;
}

function safeParseJson(outputText: string | undefined): unknown {
  const text = outputText?.trim();
  if (!text) throw new Error("[blogAutomation] Empty AI topic response.");
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error("[blogAutomation] AI topic response is not JSON.");
  }
}

async function createQueuedTopicDoc(suggestion: z.infer<typeof aiTopicSuggestionSchema>): Promise<void> {
  const ref = adminDb.collection(COLLECTIONS.blogTopics).doc();
  const now = FieldValue.serverTimestamp();
  await ref.set({
    title: suggestion.title,
    targetKeyword: suggestion.targetKeyword,
    audience: suggestion.audience,
    angle: suggestion.angle,
    notes: suggestion.notes,
    priority: suggestion.priority,
    status: "queued",
    scheduledFor: null,
    createdAt: now,
    updatedAt: now,
  });
}

function mapTopicDoc(data: Record<string, unknown>): BlogTopic {
  return {
    title: String(data.title ?? ""),
    targetKeyword: String(data.targetKeyword ?? ""),
    audience: String(data.audience ?? ""),
    angle: String(data.angle ?? ""),
    notes: String(data.notes ?? ""),
    priority: typeof data.priority === "number" ? data.priority : 0,
    status: data.status as BlogTopic["status"],
    scheduledFor: data.scheduledFor instanceof Timestamp ? data.scheduledFor : null,
    createdAt: asTimestamp(data.createdAt),
    updatedAt: asTimestamp(data.updatedAt),
  } as BlogTopic;
}

async function claimNextQueuedTopic(topicRefPath: string): Promise<{ id: string; topic: BlogTopic } | null> {
  const ref = adminDb.doc(topicRefPath);
  try {
    await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) {
        throw new Error("Topic missing.");
      }
      const status = snap.get("status");
      if (status !== "queued") {
        throw new Error(`Topic not queued (status=${String(status)}).`);
      }
      tx.update(ref, { status: "researching", updatedAt: FieldValue.serverTimestamp() });
    });
  } catch {
    return null;
  }
  const snap = await ref.get();
  const data = snap.data() as Record<string, unknown>;
  return { id: ref.id, topic: mapTopicDoc(data) };
}

async function pickNextQueuedTopicRef(): Promise<string | null> {
  const snap = await adminDb.collection(COLLECTIONS.blogTopics).where("status", "==", "queued").get();
  if (snap.empty) return null;
  const [next] = snap.docs.sort((a, b) => {
    const ap = typeof a.get("priority") === "number" ? a.get("priority") : 0;
    const bp = typeof b.get("priority") === "number" ? b.get("priority") : 0;
    const byPriority = ap - bp;
    if (byPriority !== 0) return byPriority;
    return String(a.get("title") ?? "").localeCompare(String(b.get("title") ?? ""), "de-CH");
  });
  return next?.ref.path ?? null;
}

async function allocateUniquePostSlug(baseSlug: string): Promise<string> {
  const normalized = baseSlug.trim().toLowerCase() || `post-${Date.now().toString(36)}`;
  const existing = await adminDb.collection(COLLECTIONS.posts).where("slug", "==", normalized).limit(1).get();
  if (existing.empty) return normalized;
  return `${normalized}-${Date.now().toString(36)}`;
}

/**
 * Main cron entry: schedules via {@link shouldRunAutomation}, claims a topic, generates a draft, audits in `blogPipelineRuns` / `blogPipelineLogs`.
 */
export async function runBlogAutomation(
  trigger: BlogPipelineRunTrigger = "cron",
  options: RunBlogAutomationOptions = {},
): Promise<RunBlogAutomationResult> {
  const runRef = adminDb.collection(COLLECTIONS.blogPipelineRuns).doc();
  const runId = runRef.id;
  const startedAt = Timestamp.now();

  const finishSkipped = async (reason: string): Promise<RunBlogAutomationResult> => {
    await runRef.set({
      trigger,
      status: "completed",
      startedAt,
      completedAt: FieldValue.serverTimestamp(),
      topicsProcessed: 0,
      draftsCreated: 0,
      socialPostsCreated: 0,
      errorCount: 0,
      lastErrorMessage: null,
    });
    await appendPipelineLog({
      pipelineRunId: runId,
      level: "info",
      message: reason,
      context: { phase: "schedule_gate" },
    });
    return { ok: true, skipped: true, reason, runId };
  };

  const finishFailed = async (message: string, topicId?: string | null): Promise<RunBlogAutomationResult> => {
    await runRef.set({
      trigger,
      status: "failed",
      startedAt,
      completedAt: FieldValue.serverTimestamp(),
      topicsProcessed: topicId ? 1 : 0,
      draftsCreated: 0,
      socialPostsCreated: 0,
      errorCount: 1,
      lastErrorMessage: message,
    });
    await appendPipelineLog({
      pipelineRunId: runId,
      level: "error",
      message,
      topicId: topicId ?? null,
      context: { phase: "error" },
    });
    return { ok: false, error: message, runId };
  };

  try {
    await runRef.set({
      trigger,
      status: "started",
      startedAt,
      completedAt: null,
      topicsProcessed: 0,
      draftsCreated: 0,
      socialPostsCreated: 0,
      errorCount: 0,
      lastErrorMessage: null,
    });

    const settings = await loadAutomationSettings();
    if (!settings) {
      return await finishFailed(
        "Blog-Automation ist noch nicht eingerichtet — bitte unter «Blog-Automation» die Einstellungen öffnen und einmal speichern.",
      );
    }

    if (options.bypassScheduleGate) {
      await appendPipelineLog({
        pipelineRunId: runId,
        level: "info",
        message: "Manual CMS run requested: schedule gate bypassed for one immediate draft attempt.",
        context: { phase: "schedule_gate", bypassed: true },
      });
    } else {
      const gate = await shouldRunAutomation(settings, new Date());
      if (!gate.shouldRun) {
        return await finishSkipped(gate.reason);
      }

      await appendPipelineLog({
        pipelineRunId: runId,
        level: "info",
        message: `Schedule gate passed: ${gate.reason}`,
        context: { phase: "schedule_gate" },
      });
    }

    let topicPath = await pickNextQueuedTopicRef();

    if (!topicPath && settings.topicMode === "ai_suggested") {
      const suggestion = await suggestQueuedBlogTopic(settings);
      await createQueuedTopicDoc(suggestion);
      topicPath = await pickNextQueuedTopicRef();
    }

    if (!topicPath) {
      await appendPipelineLog({
        pipelineRunId: runId,
        level: "info",
        message: "No queued topic available (topic queue empty and AI suggestion unavailable or failed to enqueue).",
        context: { phase: "topic_pick" },
      });
      await runRef.set({
        trigger,
        status: "completed",
        startedAt,
        completedAt: FieldValue.serverTimestamp(),
        topicsProcessed: 0,
        draftsCreated: 0,
        socialPostsCreated: 0,
        errorCount: 0,
        lastErrorMessage: null,
      });
      return { ok: true, skipped: true, reason: "No queued topic.", runId };
    }

    const claimed = await claimNextQueuedTopic(topicPath);
    if (!claimed) {
      return await finishSkipped("Lost race claiming queued topic (another worker may have taken it).");
    }

    const topicId = claimed.id;
    const topic = claimed.topic;

    await appendPipelineLog({
      pipelineRunId: runId,
      level: "info",
      message: `Topic claimed and marked researching: ${topic.title}`,
      topicId,
      context: { phase: "topic_claim" },
    });

    let draftOutput: BlogAutomationDraftOutput;
    try {
      const gen = await generateBlogDraft({ settings, topic });
      draftOutput = gen.output;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await adminDb.doc(topicPath).update({
        status: "failed",
        updatedAt: FieldValue.serverTimestamp(),
      });
      await appendPipelineLog({
        pipelineRunId: runId,
        level: "error",
        message: msg,
        topicId,
        context: { phase: "openai_generate" },
      });
      await runRef.set({
        trigger,
        status: "failed",
        startedAt,
        completedAt: FieldValue.serverTimestamp(),
        topicsProcessed: 1,
        draftsCreated: 0,
        socialPostsCreated: 0,
        errorCount: 1,
        lastErrorMessage: msg,
      });
      return { ok: false, error: msg, runId, topicId };
    }

    const draftRef = adminDb.collection(COLLECTIONS.blogDrafts).doc();
    const draftId = draftRef.id;

    let unsplashHero: UnsplashHeroSelection | null = null;
    try {
      unsplashHero = await findUnsplashImage({
        imageSearchQueries: draftOutput.imageSearchQueries,
        heroImageAlt: draftOutput.heroImageAlt,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await appendPipelineLog({
        pipelineRunId: runId,
        level: "warn",
        message: `Unsplash: ${msg}`,
        topicId,
        draftId,
        context: { phase: "unsplash" },
      });
    }

    const draftHeroFirestore: Record<string, unknown> = unsplashHero
      ? {
          heroImageUrl: unsplashHero.heroImageUrl,
          heroImageAlt: unsplashHero.heroImageAlt,
          heroImageCredit: unsplashHero.heroImageCredit,
          heroImagePhotographerName: unsplashHero.heroImagePhotographerName,
          heroImagePhotographerUrl: unsplashHero.heroImagePhotographerUrl,
          heroImageUnsplashUrl: unsplashHero.heroImageUnsplashUrl,
          heroImageDownloadLocation: unsplashHero.heroImageDownloadLocation,
          imageSearchQuery: unsplashHero.imageSearchQuery,
        }
      : {};

    const mayAutoPublish = settings.autoPublish === true && settings.requireHumanApproval === false;

    let draftStatus: BlogPipelineStatus = "needs_review";
    let approvedAt: Timestamp | null = null;
    let publishedAt: Timestamp | null = null;
    let publishedPostId: string | undefined;
    let persistedDraftSlug = draftOutput.slug;

    const batch = adminDb.batch();

    if (mayAutoPublish) {
      const authorId = process.env.BLOG_AUTOMATION_DEFAULT_AUTHOR_ID?.trim();
      if (!authorId) {
        await appendPipelineLog({
          pipelineRunId: runId,
          level: "warn",
          message:
            "Auto-Veröffentlichung ist eingeschaltet, aber keine Standard-Autorin / kein Standard-Autor ist konfiguriert — Entwurf bleibt zur Freigabe.",
          topicId,
          draftId,
          context: { phase: "auto_publish" },
        });
      } else {
        try {
          const slug = await allocateUniquePostSlug(draftOutput.slug);
          const postRef = adminDb.collection(COLLECTIONS.posts).doc();
          publishedPostId = postRef.id;
          const seoTitle = draftOutput.metaTitle.trim() ? draftOutput.metaTitle.trim() : null;
          const seoDescription = draftOutput.metaDescription.trim() ? draftOutput.metaDescription.trim() : null;

          const upsert: PostUpsertInput = {
            id: publishedPostId,
            title: draftOutput.title.trim(),
            slug,
            excerpt: draftOutput.excerpt,
            body: serializePostBody(draftOutput.articleHtml),
            heroImagePath: null,
            ...postHeroFieldsFromUnsplash(unsplashHero),
            authorId,
            categoryIds: [],
            tags: [],
            site: "abexis",
            status: "published",
            seoTitle,
            seoDescription,
            featured: false,
            publishedAt: new Date().toISOString(),
          };

          const parsed = parsePostUpsert(upsert);
          if (!parsed.success) {
            const v = parsed.error.issues.map((i) => i.message).join(" · ");
            throw new Error(v || "Beitrag konnte nicht validiert werden.");
          }

          const ts = FieldValue.serverTimestamp();
          batch.set(postRef, {
            title: parsed.data.title.trim(),
            slug: parsed.data.slug.trim(),
            status: "published",
            site: parsed.data.site,
            authorId: parsed.data.authorId,
            categoryIds: parsed.data.categoryIds,
            tags: parsed.data.tags,
            featured: parsed.data.featured,
            heroImageUrl: parsed.data.heroImageUrl,
            heroImageAlt: parsed.data.heroImageAlt,
            heroImagePath: parsed.data.heroImagePath,
            heroImageCredit: parsed.data.heroImageCredit,
            heroImagePhotographerName: parsed.data.heroImagePhotographerName,
            heroImagePhotographerUrl: parsed.data.heroImagePhotographerUrl,
            heroImageUnsplashUrl: parsed.data.heroImageUnsplashUrl,
            body: parsed.data.body,
            excerpt: parsed.data.excerpt,
            seoTitle: parsed.data.seoTitle,
            seoDescription: parsed.data.seoDescription,
            updatedAt: ts,
            createdAt: ts,
            publishedAt: ts,
            heroStoragePath: FieldValue.delete(),
          });
          draftStatus = "published";
          approvedAt = Timestamp.now();
          publishedAt = Timestamp.now();
          persistedDraftSlug = slug;
        } catch (pubErr) {
          const msg = pubErr instanceof Error ? pubErr.message : String(pubErr);
          await appendPipelineLog({
            pipelineRunId: runId,
            level: "error",
            message: `Auto-Veröffentlichung fehlgeschlagen: ${msg}`,
            topicId,
            draftId,
            context: { phase: "auto_publish" },
          });
          draftStatus = "needs_review";
          approvedAt = null;
          publishedAt = null;
          publishedPostId = undefined;
          persistedDraftSlug = draftOutput.slug;
        }
      }
    }

    batch.set(draftRef, {
      title: draftOutput.title,
      slug: persistedDraftSlug,
      excerpt: draftOutput.excerpt,
      metaTitle: draftOutput.metaTitle,
      metaDescription: draftOutput.metaDescription,
      articleHtml: draftOutput.articleHtml,
      researchSummary: draftOutput.researchSummary,
      sources: draftOutput.sources,
      status: draftStatus,
      topicId,
      automationRunId: runId,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      approvedAt,
      publishedAt,
      ...(publishedPostId ? { publishedPostId } : {}),
      ...draftHeroFirestore,
    });

    let socialCreated = 0;
    if (settings.createSocialPosts) {
      const socialRef = adminDb.collection(COLLECTIONS.blogSocialPosts).doc();
      batch.set(socialRef, {
        topicId,
        blogDraftId: draftId,
        automationRunId: runId,
        status: draftStatus === "published" ? "published" : "needs_review",
        platforms: settings.socialPlatforms,
        linkedinPost: draftOutput.linkedinPost,
        shortLinkedinPost: draftOutput.shortLinkedinPost,
        xPost: draftOutput.xPost,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      socialCreated = 1;
    }

    batch.update(adminDb.doc(topicPath), {
      status: "draft_created",
      updatedAt: FieldValue.serverTimestamp(),
    });

    batch.set(runRef, {
      trigger,
      status: "completed",
      startedAt,
      completedAt: FieldValue.serverTimestamp(),
      topicsProcessed: 1,
      draftsCreated: 1,
      socialPostsCreated: socialCreated,
      errorCount: 0,
      lastErrorMessage: null,
    });

    await batch.commit();

    await appendPipelineLog({
      pipelineRunId: runId,
      level: "info",
      message: `Draft saved (${draftStatus}).`,
      topicId,
      draftId,
      context: { phase: "persist", publishedPostId: publishedPostId ?? null },
    });

    return {
      ok: true,
      runId,
      topicId,
      draftId,
      publishedPostId,
      reason:
        mayAutoPublish && publishedPostId ? "Draft generated and auto-published." : "Draft generated for review.",
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return await finishFailed(msg);
  }
}

function postHeroFieldsFromUnsplash(
  h: UnsplashHeroSelection | null,
): Pick<
  PostUpsertInput,
  | "heroImageUrl"
  | "heroImageAlt"
  | "heroImageCredit"
  | "heroImagePhotographerName"
  | "heroImagePhotographerUrl"
  | "heroImageUnsplashUrl"
> {
  if (!h) {
    return {
      heroImageUrl: null,
      heroImageAlt: null,
      heroImageCredit: null,
      heroImagePhotographerName: null,
      heroImagePhotographerUrl: null,
      heroImageUnsplashUrl: null,
    };
  }
  return {
    heroImageUrl: h.heroImageUrl,
    heroImageAlt: h.heroImageAlt,
    heroImageCredit: h.heroImageCredit,
    heroImagePhotographerName: h.heroImagePhotographerName,
    heroImagePhotographerUrl: h.heroImagePhotographerUrl,
    heroImageUnsplashUrl: h.heroImageUnsplashUrl,
  };
}
