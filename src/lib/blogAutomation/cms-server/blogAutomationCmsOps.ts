import "server-only";

import { FieldValue, Timestamp, type WriteBatch } from "firebase-admin/firestore";
import { DateTime } from "luxon";

import { parsePostUpsert } from "@/cms/schema";
import { COLLECTIONS } from "@/cms/firestore/collections";
import type { PostUpsertInput } from "@/cms/types/dto";
import type { BlogDraftEditableFields } from "@/cms/types/blog-draft-pipeline";
import {
  DEFAULT_BLOG_AUTOMATION_FORM,
  mapFirestoreRecordToBlogAutomationForm,
  type BlogAutomationFormState,
} from "@/lib/blogAutomation/editorForm";
import {
  BLOG_AUTOMATION_SETTINGS_DOC_ID,
  type BlogAutomationArticleLength,
  type BlogAutomationTopicMode,
} from "@/lib/blogAutomation/types";
import {
  findNextLikelyDraftAt,
  nextBlogAutomationCronUtc,
  type AutomationScheduleSettings,
  type RunAggRow,
} from "@/lib/blogAutomation/schedulingSimulation";
import { serializePostBody } from "@/lib/cms/post-body-storage";
import {
  normalizeEscapedBlogHtml,
  normalizeSwissGermanText,
  sanitizeGeneratedBlogHtmlWithoutLinks,
  stripCompetitorReferenceLines,
} from "@/lib/cms/sanitize-blog-html";
import {
  applyUnsplashPhotoToHeroFields,
  getUnsplashPhotoById,
  searchUnsplashLandscapePhotos,
} from "@/lib/blogAutomation/findUnsplashImage";
import type { UnsplashPhotoBrief } from "@/lib/blogAutomation/unsplash-photo-types";
import { adminDb } from "@/lib/firebaseAdmin";
import { createNuelinkSocialPost, type NuelinkPublishMode, type NuelinkSocialTarget } from "@/lib/nuelink/client";
import { POST_SITE_FIRESTORE_IN } from "@/public-site/site/filters";

import type {
  BlogDraftDetail,
  BlogDraftListItem,
  BlogSocialListItem,
  BlogTopicListItem,
} from "@/cms/services/blog-pipeline-types";
import type {
  BlogAutomationDashboardSnapshot,
  BlogPipelineLogDashboardRow,
  BlogPipelineRunDashboardRow,
} from "@/lib/blogAutomation/cms-dashboard-types";
import type { AddBlogTopicInput, QueuedBlogTopicRow } from "@/lib/blogAutomation/blogTopicQueue";

function toIso(v: unknown): string | null {
  if (v && typeof v === "object" && "toDate" in v && typeof (v as Timestamp).toDate === "function") {
    return (v as Timestamp).toDate().toISOString();
  }
  if (typeof v === "string") return v;
  return null;
}

function toTime(v: unknown): number | null {
  const iso = toIso(v);
  if (!iso) return null;
  const t = new Date(iso).getTime();
  return Number.isFinite(t) ? t : null;
}

const PUBLIC_BLOG_BASE_URL = "https://www.abexis.ch/blog";
const WEEKDAY_KEYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

function mapRun(id: string, d: Record<string, unknown>): BlogPipelineRunDashboardRow {
  return {
    id,
    trigger: String(d.trigger ?? ""),
    status: String(d.status ?? ""),
    startedAt: toIso(d.startedAt),
    completedAt: toIso(d.completedAt),
    topicsProcessed: typeof d.topicsProcessed === "number" ? d.topicsProcessed : 0,
    draftsCreated: typeof d.draftsCreated === "number" ? d.draftsCreated : 0,
    socialPostsCreated: typeof d.socialPostsCreated === "number" ? d.socialPostsCreated : 0,
    errorCount: typeof d.errorCount === "number" ? d.errorCount : 0,
    lastErrorMessage: typeof d.lastErrorMessage === "string" ? d.lastErrorMessage : null,
  };
}

function mapLog(id: string, d: Record<string, unknown>): BlogPipelineLogDashboardRow {
  return {
    id,
    pipelineRunId: String(d.pipelineRunId ?? ""),
    createdAt: toIso(d.createdAt),
    level: String(d.level ?? ""),
    message: String(d.message ?? ""),
  };
}

function mapDraftList(id: string, d: Record<string, unknown>): BlogDraftListItem {
  return {
    id,
    topicId: String(d.topicId ?? ""),
    status: String(d.status ?? ""),
    title: String(d.title ?? ""),
    slug: String(d.slug ?? ""),
    excerpt: String(d.excerpt ?? ""),
    createdAt: toIso(d.createdAt),
  };
}

function mapDraftDetail(id: string, d: Record<string, unknown>): BlogDraftDetail {
  const base = mapDraftList(id, d);
  const nu = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
  return {
    ...base,
    metaTitle: String(d.metaTitle ?? ""),
    metaDescription: String(d.metaDescription ?? ""),
    articleHtml: normalizeEscapedBlogHtml(String(d.articleHtml ?? "")),
    researchSummary: String(d.researchSummary ?? ""),
    sources: [],
    authorId: nu(d.authorId),
    openaiResponseId: d.openaiResponseId != null ? String(d.openaiResponseId) : null,
    pipelineModel: d.pipelineModel != null ? String(d.pipelineModel) : null,
    approvedAt: toIso(d.approvedAt),
    publishedAt: toIso(d.publishedAt),
    publishedPostId: typeof d.publishedPostId === "string" ? d.publishedPostId : null,
    heroImageUrl: nu(d.heroImageUrl),
    heroImageAlt: nu(d.heroImageAlt),
    heroImageCredit: nu(d.heroImageCredit),
    heroImagePhotographerName: nu(d.heroImagePhotographerName),
    heroImagePhotographerUrl: nu(d.heroImagePhotographerUrl),
    heroImageUnsplashUrl: nu(d.heroImageUnsplashUrl),
    imageSearchQuery: nu(d.imageSearchQuery),
  };
}

async function allocateUniquePublishedSlug(baseSlug: string): Promise<{ slug: string; adjusted: boolean }> {
  const normalized = baseSlug.trim().toLowerCase() || `post-${Date.now().toString(36)}`;
  const existing = await adminDb.collection(COLLECTIONS.posts).where("slug", "==", normalized).limit(1).get();
  if (existing.empty) return { slug: normalized, adjusted: false };
  return { slug: `${normalized}-${Date.now().toString(36)}`, adjusted: true };
}

function parsePreferredTime(preferredTime: string): { hour: number; minute: number } {
  const m = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(preferredTime.trim());
  if (!m) return { hour: 9, minute: 0 };
  return { hour: Number(m[1]), minute: Number(m[2]) };
}

function nextApprovalPublishSlot(form: BlogAutomationFormState, from = new Date()): Date {
  const zone = form.timezone?.trim() || "Europe/Zurich";
  const postingDays = form.postingDays.map((d) => d.trim().toLowerCase()).filter(Boolean);
  const days = postingDays.length ? postingDays : ["thursday"];
  const { hour, minute } = parsePreferredTime(form.postingTime || "09:00");
  const now = DateTime.fromJSDate(from, { zone });

  for (let offset = 0; offset < 28; offset += 1) {
    const candidateDay = now.plus({ days: offset });
    const key = WEEKDAY_KEYS[candidateDay.weekday - 1];
    if (!key || !days.includes(key)) continue;
    const candidate = candidateDay.set({ hour, minute, second: 0, millisecond: 0 });
    if (candidate.toMillis() > now.toMillis() + 60_000) return candidate.toJSDate();
  }

  return now.plus({ days: 1 }).set({ hour, minute, second: 0, millisecond: 0 }).toJSDate();
}

function normalizeLinkedInCaptionForBlog(caption: string, blogUrl: string): string {
  const clean = stripCompetitorReferenceLines(normalizeSwissGermanText(caption))
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, "$1")
    .replace(/https?:\/\/(?!www\.abexis\.ch\/blog\/)[^\s)]+/gi, "")
    .replace(/\{\{BLOG_URL\}\}/g, "")
    .replace(/\(\s*\)/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (!blogUrl) return clean;
  if (clean.includes(blogUrl)) return clean;
  return `${clean}\n\n${blogUrl}`.trim();
}

function normalizeSwissTextField(value: unknown): string {
  return normalizeSwissGermanText(String(value ?? "")).trim();
}

async function resolveDefaultBlogAuthorId(): Promise<string> {
  const configured = process.env.BLOG_AUTOMATION_DEFAULT_AUTHOR_ID?.trim();
  if (configured) return configured;

  const snap = await adminDb.collection(COLLECTIONS.authors).limit(200).get();
  const daniel = snap.docs.find((docSnap) => {
    const row = docSnap.data() as Record<string, unknown>;
    return (
      /daniel\s+sengstag/i.test(String(row.name ?? "")) ||
      /daniel[-_\s]?sengstag/i.test(String(row.slug ?? "")) ||
      /daniel\.sengstag/i.test(String(row.email ?? ""))
    );
  });
  return daniel?.id ?? "";
}

async function syncDraftHeroToSocialPosts(draftId: string, fields: { imageUrl?: string | null; imageAlt?: string | null }): Promise<void> {
  const snap = await adminDb.collection(COLLECTIONS.blogSocialPosts).where("blogDraftId", "==", draftId.trim()).get();
  if (snap.empty) return;
  const batch = adminDb.batch();
  for (const docSnap of snap.docs) {
    if (docSnap.get("socialImageManualOverride") === true) continue;
    const patch: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() };
    if ("imageUrl" in fields) patch.socialImageUrl = fields.imageUrl?.trim() || FieldValue.delete();
    if ("imageAlt" in fields) patch.socialImageAlt = fields.imageAlt?.trim() || FieldValue.delete();
    batch.update(docSnap.ref, patch);
  }
  await batch.commit();
}

function timestampMillis(value: unknown): number {
  if (value instanceof Timestamp) return value.toMillis();
  if (value && typeof value === "object" && "toMillis" in value && typeof (value as Timestamp).toMillis === "function") {
    return (value as Timestamp).toMillis();
  }
  return 0;
}

function readSocialCaptionForClone(source: Record<string, unknown>, draft: Record<string, unknown>): string {
  const fromSocial = typeof source.linkedinPost === "string" ? source.linkedinPost.trim() : "";
  if (fromSocial) return normalizeSwissGermanText(fromSocial);
  const title = normalizeSwissTextField(draft.title);
  return title ? `${title}\n\n{{BLOG_URL}}` : "{{BLOG_URL}}";
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).map((v) => v.trim()).filter(Boolean) : [];
}

async function ensureSendableSocialPostForDraft(params: {
  batch: WriteBatch;
  draftId: string;
  draft: Record<string, unknown>;
  targetStatus: "scheduled" | "published";
  publishedPostId: string;
  now: FieldValue;
}): Promise<string[]> {
  const snap = await adminDb.collection(COLLECTIONS.blogSocialPosts).where("blogDraftId", "==", params.draftId.trim()).get();
  if (snap.empty) return [];

  const sendableIds: string[] = [];
  for (const socialDoc of snap.docs) {
    const source = socialDoc.data() as Record<string, unknown>;
    const socialPatch: Record<string, unknown> = {
      status: params.targetStatus,
      updatedAt: params.now,
    };
    if (source.socialImageManualOverride !== true) {
      socialPatch.socialImageUrl =
        typeof params.draft.heroImageUrl === "string" && params.draft.heroImageUrl.trim()
          ? params.draft.heroImageUrl.trim()
          : FieldValue.delete();
      socialPatch.socialImageAlt =
        typeof params.draft.heroImageAlt === "string" && params.draft.heroImageAlt.trim()
          ? normalizeSwissGermanText(params.draft.heroImageAlt.trim())
          : FieldValue.delete();
    }
    if (!socialDoc.get("nuelinkLastSentAt")) {
      sendableIds.push(socialDoc.id);
    }
    params.batch.update(socialDoc.ref, socialPatch);
  }
  if (sendableIds.length > 0) return sendableIds;

  const sourceDoc = [...snap.docs].sort((a, b) => {
    const at = timestampMillis(a.get("createdAt")) || timestampMillis(a.get("updatedAt"));
    const bt = timestampMillis(b.get("createdAt")) || timestampMillis(b.get("updatedAt"));
    return bt - at;
  })[0];
  if (!sourceDoc) return [];

  const source = sourceDoc.data() as Record<string, unknown>;
  const newRef = adminDb.collection(COLLECTIONS.blogSocialPosts).doc();
  const socialImageUrl =
    typeof source.socialImageUrl === "string" && source.socialImageUrl.trim()
      ? source.socialImageUrl.trim()
      : typeof params.draft.heroImageUrl === "string" && params.draft.heroImageUrl.trim()
        ? params.draft.heroImageUrl.trim()
        : null;
  const socialImageAlt =
    typeof source.socialImageAlt === "string" && source.socialImageAlt.trim()
      ? normalizeSwissGermanText(source.socialImageAlt.trim())
      : typeof params.draft.heroImageAlt === "string" && params.draft.heroImageAlt.trim()
        ? normalizeSwissGermanText(params.draft.heroImageAlt.trim())
        : null;

  params.batch.set(newRef, {
    topicId: typeof source.topicId === "string" ? source.topicId : typeof params.draft.topicId === "string" ? params.draft.topicId : null,
    blogDraftId: params.draftId,
    automationRunId: typeof source.automationRunId === "string" ? source.automationRunId : typeof params.draft.automationRunId === "string" ? params.draft.automationRunId : null,
    status: params.targetStatus,
    platforms: readStringArray(source.platforms).length ? readStringArray(source.platforms) : ["linkedin"],
    linkedinPost: readSocialCaptionForClone(source, params.draft),
    socialImageUrl,
    socialImageAlt,
    socialImageManualOverride: source.socialImageManualOverride === true,
    clonedFromSocialPostId: sourceDoc.id,
    clonedForPublishedPostId: params.publishedPostId,
    clonedReason: "published_after_previous_nuelink_test_send",
    createdAt: params.now,
    updatedAt: params.now,
  });

  return [newRef.id];
}

// ——— Settings ———

export async function cmsReadBlogAutomationSettings(): Promise<{ form: BlogAutomationFormState; docExists: boolean }> {
  const snap = await adminDb.doc(`${COLLECTIONS.blogAutomationSettings}/${BLOG_AUTOMATION_SETTINGS_DOC_ID}`).get();
  if (!snap.exists) {
    return { form: { ...DEFAULT_BLOG_AUTOMATION_FORM }, docExists: false };
  }
  return {
    form: mapFirestoreRecordToBlogAutomationForm(snap.data() as Record<string, unknown>),
    docExists: true,
  };
}

export async function cmsWriteBlogAutomationSettings(
  form: BlogAutomationFormState,
  opts: { docExists: boolean },
): Promise<void> {
  const ref = adminDb.doc(`${COLLECTIONS.blogAutomationSettings}/${BLOG_AUTOMATION_SETTINGS_DOC_ID}`);
  const payload: Record<string, unknown> = {
    enabled: form.enabled,
    articlesPerWeek: 1,
    preferredDays: form.preferredDays.length ? form.preferredDays.slice(0, 1) : DEFAULT_BLOG_AUTOMATION_FORM.preferredDays,
    preferredTime: form.preferredTime || DEFAULT_BLOG_AUTOMATION_FORM.preferredTime,
    postingDays: form.postingDays.length ? form.postingDays : DEFAULT_BLOG_AUTOMATION_FORM.postingDays,
    postingTime: form.postingTime || DEFAULT_BLOG_AUTOMATION_FORM.postingTime,
    timezone: form.timezone,
    targetAudience: form.targetAudience.trim(),
    tone: form.tone,
    defaultLanguage: form.defaultLanguage,
    topicMode: form.topicMode,
    requireHumanApproval: form.requireHumanApproval,
    autoPublish: form.autoPublish,
    createSocialPosts: form.createSocialPosts,
    socialPlatforms: form.socialPlatforms,
    articleLength: form.articleLength,
    brandInstructions: form.brandInstructions,
    forbiddenTopics: form.forbiddenTopics,
    updatedAt: FieldValue.serverTimestamp(),
  };
  if (!opts.docExists) {
    payload.createdAt = FieldValue.serverTimestamp();
  }
  await ref.set(payload, { merge: true });
}

// ——— Topics ———

export async function cmsListQueuedBlogTopics(max = 80): Promise<QueuedBlogTopicRow[]> {
  const snap = await adminDb.collection(COLLECTIONS.blogTopics).where("status", "==", "queued").get();
  return snap.docs
    .map((d) => {
      const x = d.data() as Record<string, unknown>;
      return {
        id: d.id,
        title: String(x.title ?? ""),
        targetKeyword: String(x.targetKeyword ?? ""),
        angle: String(x.angle ?? ""),
        notes: String(x.notes ?? ""),
        priority: typeof x.priority === "number" ? x.priority : 0,
        status: String(x.status ?? ""),
      };
    })
    .sort((a, b) => a.priority - b.priority || a.title.localeCompare(b.title, "de-CH"))
    .slice(0, max);
}

export async function cmsListBlogTopicsForAdmin(max = 80): Promise<BlogTopicListItem[]> {
  const snap = await adminDb.collection(COLLECTIONS.blogTopics).orderBy("createdAt", "desc").limit(max).get();
  return snap.docs.map((d) => {
    const x = d.data() as Record<string, unknown>;
    return {
      id: d.id,
      title: String(x.title ?? ""),
      brief: typeof x.brief === "string" ? x.brief : null,
      status: String(x.status ?? ""),
      lastPipelineError: typeof x.lastPipelineError === "string" ? x.lastPipelineError : null,
      lastDraftId: typeof x.lastDraftId === "string" ? x.lastDraftId : null,
      createdAt: toIso(x.createdAt),
    };
  });
}

export async function cmsCreateBlogTopic(input: AddBlogTopicInput): Promise<{ id: string }> {
  if (!input.title.trim()) throw new Error("Bitte einen Titel eingeben.");
  const ref = adminDb.collection(COLLECTIONS.blogTopics).doc();
  await ref.set({
    title: input.title.trim(),
    targetKeyword: input.targetKeyword.trim(),
    audience: input.audienceFallback.trim(),
    angle: input.angle.trim(),
    notes: input.notes.trim(),
    priority: Number.isFinite(input.priority) ? Math.floor(input.priority) : 50,
    status: "queued",
    scheduledFor: null,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return { id: ref.id };
}

export type BlogTopicPatch = Partial<{
  title: string;
  targetKeyword: string;
  angle: string;
  notes: string;
  priority: number;
  status: string;
  audience: string;
}>;

export async function cmsUpdateBlogTopic(topicId: string, patch: BlogTopicPatch): Promise<void> {
  const ref = adminDb.collection(COLLECTIONS.blogTopics).doc(topicId.trim());
  const snap = await ref.get();
  if (!snap.exists) throw new Error("Thema nicht gefunden.");

  const row: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() };
  if (patch.title !== undefined) row.title = String(patch.title).trim();
  if (patch.targetKeyword !== undefined) row.targetKeyword = String(patch.targetKeyword).trim();
  if (patch.angle !== undefined) row.angle = String(patch.angle).trim();
  if (patch.notes !== undefined) row.notes = String(patch.notes).trim();
  if (patch.audience !== undefined) row.audience = String(patch.audience).trim();
  if (patch.priority !== undefined && Number.isFinite(patch.priority)) row.priority = Math.floor(patch.priority);
  if (patch.status !== undefined && String(patch.status).trim()) row.status = String(patch.status).trim();

  await ref.update(row);
}

export async function cmsDeleteBlogTopic(topicId: string): Promise<void> {
  const ref = adminDb.collection(COLLECTIONS.blogTopics).doc(topicId.trim());
  const snap = await ref.get();
  if (!snap.exists) throw new Error("Thema nicht gefunden.");
  await ref.delete();
}

// ——— Drafts ———

export async function cmsListBlogDraftsForAdmin(max = 120): Promise<BlogDraftListItem[]> {
  const snap = await adminDb.collection(COLLECTIONS.blogDrafts).orderBy("createdAt", "desc").limit(max).get();
  return snap.docs.map((d) => mapDraftList(d.id, d.data() as Record<string, unknown>));
}

export async function cmsGetBlogDraftForAdmin(id: string): Promise<BlogDraftDetail | null> {
  const snap = await adminDb.collection(COLLECTIONS.blogDrafts).doc(id.trim()).get();
  if (!snap.exists) return null;
  return mapDraftDetail(snap.id, snap.data() as Record<string, unknown>);
}

export async function cmsUpdateBlogDraftFields(draftId: string, fields: BlogDraftEditableFields): Promise<void> {
  const ref = adminDb.collection(COLLECTIONS.blogDrafts).doc(draftId.trim());
  const snap = await ref.get();
  if (!snap.exists) throw new Error("Entwurf nicht gefunden.");

  const baseArticle: Record<string, unknown> = {
    title: normalizeSwissTextField(fields.title),
    slug: fields.slug.trim(),
    excerpt: normalizeSwissGermanText(fields.excerpt),
    metaTitle: normalizeSwissTextField(fields.metaTitle),
    metaDescription: normalizeSwissTextField(fields.metaDescription),
    articleHtml: sanitizeGeneratedBlogHtmlWithoutLinks(fields.articleHtml),
    researchSummary: normalizeSwissGermanText(fields.researchSummary),
    sources: [],
    updatedAt: FieldValue.serverTimestamp(),
  };
  if (fields.authorId !== undefined) {
    baseArticle.authorId = fields.authorId.trim() || FieldValue.delete();
  }

  if (fields.heroImageClear === true) {
    await ref.update({
      ...baseArticle,
      heroImageUrl: FieldValue.delete(),
      heroImageAlt: FieldValue.delete(),
      heroImageCredit: FieldValue.delete(),
      heroImagePhotographerName: FieldValue.delete(),
      heroImagePhotographerUrl: FieldValue.delete(),
      heroImageUnsplashUrl: FieldValue.delete(),
      heroImageDownloadLocation: FieldValue.delete(),
      imageSearchQuery: FieldValue.delete(),
    });
    await syncDraftHeroToSocialPosts(draftId, { imageUrl: null, imageAlt: null });
    return;
  }

  const patch: Record<string, unknown> = { ...baseArticle };
  if (fields.heroImageUrl !== undefined) {
    const imageUrl = fields.heroImageUrl?.trim() || null;
    patch.heroImageUrl = imageUrl;
    patch.heroImagePhotographerName = FieldValue.delete();
    patch.heroImagePhotographerUrl = FieldValue.delete();
    patch.heroImageUnsplashUrl = FieldValue.delete();
    patch.heroImageDownloadLocation = FieldValue.delete();
    patch.imageSearchQuery = "Medienbibliothek / Upload";
  }
  if (fields.heroImageAlt !== undefined) {
    patch.heroImageAlt = fields.heroImageAlt.trim() ? normalizeSwissGermanText(fields.heroImageAlt.trim()) : null;
  }
  if (fields.heroImageCredit !== undefined) {
    patch.heroImageCredit = fields.heroImageCredit.trim() || null;
  }
  await ref.update(patch);
  if (fields.heroImageUrl !== undefined || fields.heroImageAlt !== undefined) {
    await syncDraftHeroToSocialPosts(draftId, {
      ...(fields.heroImageUrl !== undefined ? { imageUrl: fields.heroImageUrl } : {}),
      ...(fields.heroImageAlt !== undefined ? { imageAlt: normalizeSwissGermanText(fields.heroImageAlt) } : {}),
    });
  }
}

export type ApproveBlogDraftServerParams = {
  authorId?: string;
  categoryIds?: string[];
  tags?: string[];
};

export type ApproveBlogDraftServerResult = {
  postId: string;
  scheduledFor: string;
  nuelinkSent: boolean;
  nuelinkError: string | null;
};

export async function cmsSetBlogDraftApproved(
  draftId: string,
  params: ApproveBlogDraftServerParams = {},
): Promise<ApproveBlogDraftServerResult> {
  const ref = adminDb.collection(COLLECTIONS.blogDrafts).doc(draftId.trim());
  const snap = await ref.get();
  if (!snap.exists) throw new Error("Entwurf nicht gefunden.");

  const d = snap.data() as Record<string, unknown>;
  if (String(d.status ?? "") === "published") {
    throw new Error("Dieser Entwurf ist bereits veröffentlicht.");
  }

  const authorId =
    params.authorId?.trim() ||
    (typeof d.authorId === "string" ? d.authorId.trim() : "") ||
    (await resolveDefaultBlogAuthorId()) ||
    "";
  if (!authorId) {
    throw new Error("Bitte eine Autorin / einen Autor wählen, bevor der Entwurf freigegeben wird.");
  }

  const { form } = await cmsReadBlogAutomationSettings();
  const scheduledFor = nextApprovalPublishSlot(form);
  const scheduledTs = Timestamp.fromDate(scheduledFor);
  const existingPostId = typeof d.publishedPostId === "string" && d.publishedPostId.trim() ? d.publishedPostId.trim() : "";
  const postId = existingPostId || adminDb.collection(COLLECTIONS.posts).doc().id;
  const postRef = adminDb.collection(COLLECTIONS.posts).doc(postId);
  const postSnap = existingPostId ? await postRef.get() : null;
  const requestedSlug = String(d.slug ?? "").trim();
  const slugResult = existingPostId
    ? { slug: String(postSnap?.get("slug") ?? requestedSlug).trim() || requestedSlug, adjusted: false }
    : await allocateUniquePublishedSlug(requestedSlug);
  const seoTitle = String(d.metaTitle ?? "").trim() || null;
  const seoDescription = String(d.metaDescription ?? "").trim() || null;
  const cleanArticleHtml = sanitizeGeneratedBlogHtmlWithoutLinks(String(d.articleHtml ?? ""));

  const upsert: PostUpsertInput = {
    id: postId,
    title: normalizeSwissTextField(d.title),
    slug: slugResult.slug,
    excerpt: normalizeSwissGermanText(String(d.excerpt ?? "")),
    body: serializePostBody(cleanArticleHtml),
    heroImagePath: null,
    ...readPublishedHeroFromDraft(d),
    authorId,
    categoryIds: params.categoryIds ?? [],
    tags: params.tags ?? [],
    site: "abexis",
    status: "scheduled",
    seoTitle,
    seoDescription,
    featured: false,
    publishedAt: scheduledFor.toISOString(),
  };

  const parsed = parsePostUpsert(upsert);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join(" · ");
    throw new Error(msg || "Beitrag konnte nicht validiert werden.");
  }

  const batch = adminDb.batch();
  const now = FieldValue.serverTimestamp();
  const postPayload: Record<string, unknown> = {
    title: normalizeSwissTextField(parsed.data.title),
    slug: parsed.data.slug.trim(),
    status: "scheduled",
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
    excerpt: normalizeSwissGermanText(parsed.data.excerpt),
    seoTitle: parsed.data.seoTitle ? normalizeSwissGermanText(parsed.data.seoTitle) : null,
    seoDescription: parsed.data.seoDescription ? normalizeSwissGermanText(parsed.data.seoDescription) : null,
    publishedAt: scheduledTs,
    updatedAt: now,
  };
  if (!postSnap?.exists) postPayload.createdAt = now;
  batch.set(postRef, postPayload, { merge: true });
  batch.update(ref, {
    title: normalizeSwissTextField(parsed.data.title),
    slug: parsed.data.slug.trim(),
    excerpt: normalizeSwissGermanText(String(d.excerpt ?? "")),
    metaTitle: normalizeSwissTextField(d.metaTitle),
    metaDescription: normalizeSwissTextField(d.metaDescription),
    articleHtml: cleanArticleHtml,
    sources: [],
    authorId,
    status: "approved",
    approvedAt: now,
    publishedAt: scheduledTs,
    publishedPostId: postId,
    updatedAt: now,
  });

  await ensureSendableSocialPostForDraft({
    batch,
    draftId,
    draft: {
      ...d,
      title: parsed.data.title,
      heroImageUrl: d.heroImageUrl,
      heroImageAlt: d.heroImageAlt,
    },
    targetStatus: "scheduled",
    publishedPostId: postId,
    now,
  });

  await batch.commit();

  return {
    postId,
    scheduledFor: scheduledFor.toISOString(),
    nuelinkSent: false,
    nuelinkError: null,
  };
}

export async function cmsSetBlogDraftSendBack(draftId: string): Promise<void> {
  const ref = adminDb.collection(COLLECTIONS.blogDrafts).doc(draftId.trim());
  const snap = await ref.get();
  if (!snap.exists) throw new Error("Entwurf nicht gefunden.");
  await ref.update({
    status: "needs_review",
    approvedAt: FieldValue.delete(),
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function cmsDeleteBlogDraft(draftId: string): Promise<void> {
  const ref = adminDb.collection(COLLECTIONS.blogDrafts).doc(draftId.trim());
  const snap = await ref.get();
  if (!snap.exists) throw new Error("Entwurf nicht gefunden.");
  const socialSnap = await adminDb.collection(COLLECTIONS.blogSocialPosts).where("blogDraftId", "==", draftId.trim()).get();
  const batch = adminDb.batch();
  batch.delete(ref);
  for (const socialDoc of socialSnap.docs) {
    batch.delete(socialDoc.ref);
  }
  await batch.commit();
}

/** Server-side Unsplash search for draft hero picker (access key stays on server). */
export async function cmsSearchUnsplashPhotosForDraft(query: string): Promise<UnsplashPhotoBrief[]> {
  const q = query.trim();
  if (!q) throw new Error("Bitte einen Suchbegriff eingeben.");
  return searchUnsplashLandscapePhotos(q);
}

export async function cmsApplyUnsplashPhotoToBlogDraft(
  draftId: string,
  photoId: string,
  imageSearchQuery: string,
): Promise<void> {
  const ref = adminDb.collection(COLLECTIONS.blogDrafts).doc(draftId.trim());
  const snap = await ref.get();
  if (!snap.exists) throw new Error("Entwurf nicht gefunden.");
  const d = snap.data() as Record<string, unknown>;
  if (String(d.status ?? "") === "published") {
    throw new Error("Dieser Entwurf ist bereits veröffentlicht.");
  }

  const photo = await getUnsplashPhotoById(photoId.trim());
  if (!photo) throw new Error("Bild nicht gefunden.");

  const openAiAlt = typeof d.heroImageAlt === "string" ? d.heroImageAlt : "";
  const hero = await applyUnsplashPhotoToHeroFields(photo, {
    openAiAlt,
    imageSearchQuery: imageSearchQuery.trim() || "CMS",
  });
  if (!hero) throw new Error("Bildmetadaten unvollständig.");

  await ref.update({
    heroImageUrl: hero.heroImageUrl,
    heroImageAlt: hero.heroImageAlt,
    heroImageCredit: hero.heroImageCredit,
    heroImagePhotographerName: hero.heroImagePhotographerName,
    heroImagePhotographerUrl: hero.heroImagePhotographerUrl,
    heroImageUnsplashUrl: hero.heroImageUnsplashUrl,
    heroImageDownloadLocation: hero.heroImageDownloadLocation,
    imageSearchQuery: hero.imageSearchQuery,
    updatedAt: FieldValue.serverTimestamp(),
  });
  await syncDraftHeroToSocialPosts(draftId, { imageUrl: hero.heroImageUrl, imageAlt: hero.heroImageAlt });
}

export type PublishBlogDraftServerParams = BlogDraftEditableFields & {
  draftId: string;
  authorId: string;
  categoryIds?: string[];
  tags?: string[];
};

export type PublishBlogDraftServerResult = {
  postId: string;
  slugUsed: string;
  slugAdjusted: boolean;
};

function readPublishedHeroFromDraft(d: Record<string, unknown>): Pick<
  PostUpsertInput,
  | "heroImageUrl"
  | "heroImageAlt"
  | "heroImageCredit"
  | "heroImagePhotographerName"
  | "heroImagePhotographerUrl"
  | "heroImageUnsplashUrl"
> {
  const nu = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
  return {
    heroImageUrl: nu(d.heroImageUrl),
    heroImageAlt: nu(d.heroImageAlt),
    heroImageCredit: nu(d.heroImageCredit),
    heroImagePhotographerName: nu(d.heroImagePhotographerName),
    heroImagePhotographerUrl: nu(d.heroImagePhotographerUrl),
    heroImageUnsplashUrl: nu(d.heroImageUnsplashUrl),
  };
}

export async function cmsPublishBlogDraftToPost(params: PublishBlogDraftServerParams): Promise<PublishBlogDraftServerResult> {
  const draftRef = adminDb.collection(COLLECTIONS.blogDrafts).doc(params.draftId.trim());
  const draftSnap = await draftRef.get();
  if (!draftSnap.exists) throw new Error("Entwurf nicht gefunden.");

  const draftData = draftSnap.data() as Record<string, unknown>;
  if (draftData.status === "published") {
    throw new Error("Dieser Entwurf ist bereits veröffentlicht.");
  }

  const { slug: uniqueSlug, adjusted } = await allocateUniquePublishedSlug(params.slug);

  const postId = adminDb.collection(COLLECTIONS.posts).doc().id;
  const postRef = adminDb.collection(COLLECTIONS.posts).doc(postId);

  const seoTitle = params.metaTitle.trim() ? params.metaTitle.trim() : null;
  const seoDescription = params.metaDescription.trim() ? params.metaDescription.trim() : null;

  const upsert: PostUpsertInput = {
    id: postId,
    title: normalizeSwissTextField(params.title),
    slug: uniqueSlug,
    excerpt: normalizeSwissGermanText(params.excerpt),
    body: serializePostBody(sanitizeGeneratedBlogHtmlWithoutLinks(params.articleHtml)),
    heroImagePath: null,
    ...readPublishedHeroFromDraft(draftData),
    authorId: params.authorId.trim(),
    categoryIds: params.categoryIds ?? [],
    tags: params.tags ?? [],
    site: "abexis",
    status: "published",
    seoTitle,
    seoDescription,
    featured: false,
    publishedAt: new Date().toISOString(),
  };

  const parsed = parsePostUpsert(upsert);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join(" · ");
    throw new Error(msg || "Beitrag konnte nicht validiert werden.");
  }

  const ts = FieldValue.serverTimestamp();
  const payload: Record<string, unknown> = {
    title: normalizeSwissTextField(parsed.data.title),
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
    excerpt: normalizeSwissGermanText(parsed.data.excerpt),
    seoTitle: parsed.data.seoTitle ? normalizeSwissGermanText(parsed.data.seoTitle) : null,
    seoDescription: parsed.data.seoDescription ? normalizeSwissGermanText(parsed.data.seoDescription) : null,
    updatedAt: ts,
    createdAt: ts,
    publishedAt: ts,
  };

  const batch = adminDb.batch();
  batch.set(postRef, payload);
  batch.update(draftRef, {
    title: normalizeSwissTextField(params.title),
    slug: uniqueSlug,
    excerpt: normalizeSwissGermanText(params.excerpt),
    metaTitle: normalizeSwissTextField(params.metaTitle),
    metaDescription: normalizeSwissTextField(params.metaDescription),
    articleHtml: sanitizeGeneratedBlogHtmlWithoutLinks(params.articleHtml),
    researchSummary: normalizeSwissGermanText(params.researchSummary),
    sources: [],
    authorId: parsed.data.authorId,
    status: "published",
    publishedPostId: postId,
    publishedAt: ts,
    updatedAt: ts,
  });
  const socialPostIdsToSend = await ensureSendableSocialPostForDraft({
    batch,
    draftId: params.draftId,
    draft: {
      ...draftData,
      title: parsed.data.title,
      heroImageUrl: draftData.heroImageUrl,
      heroImageAlt: draftData.heroImageAlt,
    },
    targetStatus: "published",
    publishedPostId: postId,
    now: ts,
  });

  await batch.commit();

  for (const socialPostId of socialPostIdsToSend) {
    try {
      const snap = await adminDb.collection(COLLECTIONS.blogSocialPosts).doc(socialPostId).get();
      if (!snap.exists || snap.get("nuelinkLastSentAt")) continue;
      await cmsSendBlogSocialPostToNuelink(socialPostId, {
        target: "linkedin",
        caption: String(snap.get("linkedinPost") ?? ""),
        publishMode: "IMMEDIATE",
      });
    } catch (e) {
      await adminDb.collection(COLLECTIONS.blogSocialPosts).doc(socialPostId).update({
        nuelinkLastError: e instanceof Error ? e.message : "Nuelink-Verbindung fehlgeschlagen.",
        updatedAt: FieldValue.serverTimestamp(),
      }).catch(() => undefined);
    }
  }

  return { postId, slugUsed: uniqueSlug, slugAdjusted: adjusted };
}

// ——— Social ———

function mapSocialListItem(
  id: string,
  d: Record<string, unknown>,
  draft?: Record<string, unknown> | null,
): BlogSocialListItem {
  const nu = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
  const draftSlug = nu(draft?.slug);
  const blogHeroImageUrl = nu(draft?.heroImageUrl);
  const blogHeroImageAlt = nu(draft?.heroImageAlt);
  const blogUrl = draftSlug ? `https://www.abexis.ch/blog/${encodeURIComponent(draftSlug)}` : "";
  const linkedinPostRaw = String(d.linkedinPost ?? "");
  return {
    id,
    topicId: String(d.topicId ?? ""),
    blogDraftId: String(d.blogDraftId ?? ""),
    status: String(d.status ?? ""),
    linkedinPost: blogUrl && linkedinPostRaw.includes("{{BLOG_URL}}") ? linkedinPostRaw.replace("{{BLOG_URL}}", blogUrl) : linkedinPostRaw,
    shortLinkedinPost: typeof d.shortLinkedinPost === "string" ? d.shortLinkedinPost : "",
    xPost: typeof d.xPost === "string" ? d.xPost : "",
    socialImageUrl: nu(d.socialImageUrl) ?? blogHeroImageUrl,
    socialImageAlt: nu(d.socialImageAlt) ?? blogHeroImageAlt,
    socialImageManualOverride: d.socialImageManualOverride === true,
    blogDraftExists: draft != null,
    blogHeroImageUrl,
    blogHeroImageAlt,
    createdAt: toIso(d.createdAt),
    usedAt: toIso(d.usedAt),
    nuelinkLastSentAt: toIso(d.nuelinkLastSentAt),
    nuelinkLastTarget: typeof d.nuelinkLastTarget === "string" ? d.nuelinkLastTarget : null,
    nuelinkLastPostId: typeof d.nuelinkLastPostId === "string" ? d.nuelinkLastPostId : null,
  };
}

async function readDraftForSocial(d: Record<string, unknown>): Promise<Record<string, unknown> | null> {
  const draftId = typeof d.blogDraftId === "string" ? d.blogDraftId.trim() : "";
  if (!draftId) return null;
  const snap = await adminDb.collection(COLLECTIONS.blogDrafts).doc(draftId).get();
  return snap.exists ? (snap.data() as Record<string, unknown>) : null;
}

export async function cmsListBlogSocialPostsForDraft(draftId: string): Promise<BlogSocialListItem[]> {
  const trimmed = draftId.trim();
  if (!trimmed) return [];
  const [snap, draftSnap] = await Promise.all([
    adminDb.collection(COLLECTIONS.blogSocialPosts).where("blogDraftId", "==", trimmed).get(),
    adminDb.collection(COLLECTIONS.blogDrafts).doc(trimmed).get(),
  ]);
  const draft = draftSnap.exists ? (draftSnap.data() as Record<string, unknown>) : null;
  const rows = snap.docs.map((docSnap) => mapSocialListItem(docSnap.id, docSnap.data() as Record<string, unknown>, draft));
  rows.sort((a, b) => {
    const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return tb - ta;
  });
  return rows;
}

export async function cmsListBlogSocialPostsForAdmin(max = 80): Promise<BlogSocialListItem[]> {
  const snap = await adminDb.collection(COLLECTIONS.blogSocialPosts).orderBy("createdAt", "desc").limit(max).get();
  return Promise.all(snap.docs.map(async (docSnap) => {
    const d = docSnap.data() as Record<string, unknown>;
    return mapSocialListItem(docSnap.id, d, await readDraftForSocial(d));
  }));
}

export async function cmsPatchBlogSocialPost(
  socialPostId: string,
  patch: Partial<{
    linkedinPost: string;
    socialImageUrl: string | null;
    socialImageAlt: string | null;
    markUsed: boolean;
  }>,
): Promise<void> {
  const ref = adminDb.collection(COLLECTIONS.blogSocialPosts).doc(socialPostId.trim());
  const snap = await ref.get();
  if (!snap.exists) throw new Error("Social-Beitrag nicht gefunden.");

  const row: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() };
  if (patch.linkedinPost !== undefined) row.linkedinPost = normalizeSwissGermanText(patch.linkedinPost);
  if (patch.socialImageUrl !== undefined) {
    const imageUrl = patch.socialImageUrl?.trim() || "";
    row.socialImageUrl = imageUrl || FieldValue.delete();
    row.socialImageManualOverride = !!imageUrl;
  }
  if (patch.socialImageAlt !== undefined) row.socialImageAlt = patch.socialImageAlt?.trim() ? normalizeSwissGermanText(patch.socialImageAlt.trim()) : FieldValue.delete();
  if (patch.markUsed === true) {
    row.usedAt = FieldValue.serverTimestamp();
  }
  await ref.update(row);
}

export async function cmsDeleteBlogSocialPost(socialPostId: string): Promise<void> {
  const ref = adminDb.collection(COLLECTIONS.blogSocialPosts).doc(socialPostId.trim());
  const snap = await ref.get();
  if (!snap.exists) throw new Error("Social-Beitrag nicht gefunden.");
  await ref.delete();
}

export async function cmsSendBlogSocialPostToNuelink(
  socialPostId: string,
  params: {
    target: NuelinkSocialTarget;
    caption: string;
    socialImageUrl?: string | null;
    socialImageAlt?: string | null;
    publishMode?: NuelinkPublishMode | null;
    scheduledAt?: string | null;
  },
): Promise<{
  postId: string;
  publishMode: string;
  collectionId: number;
  sentAt: string;
}> {
  const ref = adminDb.collection(COLLECTIONS.blogSocialPosts).doc(socialPostId.trim());
  const snap = await ref.get();
  if (!snap.exists) throw new Error("Social-Beitrag nicht gefunden.");
  const row = snap.data() as Record<string, unknown>;
  const draft = await readDraftForSocial(row);

  const draftSlug = typeof draft?.slug === "string" ? draft.slug.trim() : "";
  const blogUrl = draftSlug ? `${PUBLIC_BLOG_BASE_URL}/${encodeURIComponent(draftSlug)}` : "";
  const caption = normalizeLinkedInCaptionForBlog(params.caption.trim(), blogUrl);
  if (!caption) throw new Error("Bitte zuerst einen Social-Text erfassen.");
  const socialImageUrl = params.socialImageUrl?.trim() || (typeof row.socialImageUrl === "string" ? row.socialImageUrl.trim() : "") || (typeof draft?.heroImageUrl === "string" ? draft.heroImageUrl.trim() : "");
  const socialImageAlt = params.socialImageAlt?.trim() || (typeof row.socialImageAlt === "string" ? row.socialImageAlt.trim() : "") || (typeof draft?.heroImageAlt === "string" ? draft.heroImageAlt.trim() : "");

  const result = await createNuelinkSocialPost({
    target: params.target,
    caption,
    link: blogUrl || undefined,
    title: typeof draft?.title === "string" ? draft.title : undefined,
    alt: socialImageAlt || undefined,
    mediaUrl: socialImageUrl || undefined,
    publishMode: params.publishMode,
    scheduledAt: params.scheduledAt,
  });
  const sentAt = Timestamp.now();
  const update: Record<string, unknown> = {
    updatedAt: FieldValue.serverTimestamp(),
    nuelinkLastSentAt: sentAt,
    nuelinkLastTarget: params.target,
    nuelinkLastPostId: result.postId,
    socialImageUrl: socialImageUrl || FieldValue.delete(),
    socialImageAlt: socialImageAlt || FieldValue.delete(),
    nuelinkSends: FieldValue.arrayUnion({
      target: params.target,
      postId: result.postId,
      brandId: result.brandId,
      collectionId: result.collectionId,
      publishMode: result.publishMode,
      sentAt,
    }),
  };
  if (params.target === "linkedin") update.linkedinPost = caption;
  await ref.update(update);

  return {
    postId: result.postId,
    publishMode: result.publishMode,
    collectionId: result.collectionId,
    sentAt: sentAt.toDate().toISOString(),
  };
}

export async function cmsPublishDueScheduledPosts(max = 20): Promise<{ published: number; postIds: string[] }> {
  const now = Timestamp.now();
  const snap = await adminDb
    .collection(COLLECTIONS.posts)
    .where("status", "==", "scheduled")
    .limit(Math.max(max * 3, 30))
    .get();
  if (snap.empty) return { published: 0, postIds: [] };

  const dueDocs = snap.docs.filter((row) => {
    const publishedAt = row.get("publishedAt");
    return publishedAt instanceof Timestamp && publishedAt.toMillis() <= now.toMillis();
  }).slice(0, max);
  if (!dueDocs.length) return { published: 0, postIds: [] };

  const batch = adminDb.batch();
  const postIds: string[] = [];
  const socialPostIdsToSend: string[] = [];
  for (const docSnap of dueDocs) {
    postIds.push(docSnap.id);
    batch.update(docSnap.ref, {
      status: "published",
      updatedAt: FieldValue.serverTimestamp(),
    });
    const draftSnap = await adminDb.collection(COLLECTIONS.blogDrafts).where("publishedPostId", "==", docSnap.id).limit(5).get();
    for (const draftDoc of draftSnap.docs) {
      batch.update(draftDoc.ref, {
        status: "published",
        publishedAt: docSnap.get("publishedAt") ?? now,
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
    for (const draftDoc of draftSnap.docs.slice(0, 10)) {
      const ids = await ensureSendableSocialPostForDraft({
        batch,
        draftId: draftDoc.id,
        draft: draftDoc.data() as Record<string, unknown>,
        targetStatus: "published",
        publishedPostId: docSnap.id,
        now: FieldValue.serverTimestamp(),
      });
      socialPostIdsToSend.push(...ids);
    }
  }

  await batch.commit();

  for (const socialPostId of socialPostIdsToSend) {
    try {
      const snap = await adminDb.collection(COLLECTIONS.blogSocialPosts).doc(socialPostId).get();
      if (!snap.exists || snap.get("nuelinkLastSentAt")) continue;
      await cmsSendBlogSocialPostToNuelink(socialPostId, {
        target: "linkedin",
        caption: String(snap.get("linkedinPost") ?? ""),
        publishMode: "IMMEDIATE",
      });
    } catch (e) {
      await adminDb.collection(COLLECTIONS.blogSocialPosts).doc(socialPostId).update({
        nuelinkLastError: e instanceof Error ? e.message : "Nuelink-Verbindung fehlgeschlagen.",
        updatedAt: FieldValue.serverTimestamp(),
      }).catch(() => undefined);
    }
  }

  return { published: postIds.length, postIds };
}

// ——— Dashboard snapshot ———

function formToScheduleSettings(form: BlogAutomationFormState): AutomationScheduleSettings {
  return {
    enabled: form.enabled,
    articlesPerWeek: 1,
    preferredDays: form.preferredDays.slice(0, 1),
    preferredTime: form.preferredTime,
    timezone: form.timezone,
  };
}

async function fetchBlogPipelineRuns(limitRows: number): Promise<BlogPipelineRunDashboardRow[]> {
  const snap = await adminDb
    .collection(COLLECTIONS.blogPipelineRuns)
    .orderBy("startedAt", "desc")
    .limit(limitRows)
    .get();
  return snap.docs.map((d) => mapRun(d.id, d.data() as Record<string, unknown>));
}

async function listRecentBlogPipelineLogs(maxRows: number): Promise<BlogPipelineLogDashboardRow[]> {
  const snap = await adminDb.collection(COLLECTIONS.blogPipelineLogs).orderBy("createdAt", "desc").limit(maxRows).get();
  return snap.docs.map((d) => mapLog(d.id, d.data() as Record<string, unknown>));
}

async function countDraftsAwaitingReview(): Promise<number> {
  const agg = await adminDb
    .collection(COLLECTIONS.blogDrafts)
    .where("status", "in", ["needs_review", "draft_created"])
    .count()
    .get();
  return agg.data().count;
}

async function countPublishedPostsThisCalendarMonth(monthTz: string): Promise<number> {
  const zone = monthTz?.trim() || "Europe/Zurich";
  const start = DateTime.now().setZone(zone).startOf("month");
  const monthStartMs = start.toMillis();

  const snap = await adminDb.collection(COLLECTIONS.posts).where("status", "==", "published").get();
  return snap.docs.filter((docSnap) => {
    const d = docSnap.data() as Record<string, unknown>;
    if (!POST_SITE_FIRESTORE_IN.includes(String(d.site) as (typeof POST_SITE_FIRESTORE_IN)[number])) return false;
    const publishedAtMs = toTime(d.publishedAt);
    return publishedAtMs != null && publishedAtMs >= monthStartMs;
  }).length;
}

export async function cmsBuildBlogAutomationDashboardSnapshot(form: BlogAutomationFormState): Promise<BlogAutomationDashboardSnapshot> {
  const monthTz = form.timezone?.trim() || "Europe/Zurich";

  const [runsForEstimate, logs, draftsAwaitingReview, publishedThisMonth] = await Promise.all([
    fetchBlogPipelineRuns(120),
    listRecentBlogPipelineLogs(48),
    countDraftsAwaitingReview(),
    countPublishedPostsThisCalendarMonth(monthTz),
  ]);

  const runs = runsForEstimate.slice(0, 18);

  const runAgg: RunAggRow[] = runsForEstimate
    .map((r) => ({
      startedAt: r.startedAt ? new Date(r.startedAt) : null,
      draftsCreated: r.draftsCreated,
    }))
    .filter((row): row is RunAggRow => row.startedAt != null && !Number.isNaN(row.startedAt.getTime()));

  const now = new Date();
  const schedule = formToScheduleSettings(form);
  const nextCheck = nextBlogAutomationCronUtc(now);
  const nextDraft = form.enabled ? findNextLikelyDraftAt(schedule, runAgg, now) : null;

  return {
    runs,
    logs,
    draftsAwaitingReview,
    publishedThisMonth,
    nextAutomaticCheckAt: nextCheck.toISOString(),
    nextLikelyDraftAt: nextDraft?.toISOString() ?? null,
  };
}

/** Validates automation settings payload from JSON (settings PUT). */
export function parseBlogAutomationFormFromJson(body: unknown): BlogAutomationFormState {
  if (!body || typeof body !== "object") throw new Error("Ungültige JSON-Nutzlast.");
  const o = body as Record<string, unknown>;

  const topicMode: BlogAutomationTopicMode = o.topicMode === "ai_suggested" ? "ai_suggested" : "topic_queue";
  const articleLengthRaw = o.articleLength;
  const articleLength: BlogAutomationArticleLength =
    articleLengthRaw === "short" || articleLengthRaw === "long" ? articleLengthRaw : "medium";

  const preferredDaysRaw = Array.isArray(o.preferredDays) ? o.preferredDays.map(String) : DEFAULT_BLOG_AUTOMATION_FORM.preferredDays;
  const preferredDays = preferredDaysRaw.length ? [preferredDaysRaw[0]!] : DEFAULT_BLOG_AUTOMATION_FORM.preferredDays;
  const postingDaysRaw = Array.isArray(o.postingDays) ? o.postingDays.map(String).filter(Boolean) : [];
  const postingDays = postingDaysRaw.length
    ? postingDaysRaw
    : preferredDaysRaw.length
      ? preferredDaysRaw
      : DEFAULT_BLOG_AUTOMATION_FORM.postingDays;
  const socialPlatforms = Array.isArray(o.socialPlatforms) ? o.socialPlatforms.map(String) : [];

  return {
    enabled: !!o.enabled,
    articlesPerWeek: 1,
    preferredDays,
    preferredTime: typeof o.preferredTime === "string" ? o.preferredTime : DEFAULT_BLOG_AUTOMATION_FORM.preferredTime,
    postingDays,
    postingTime:
      typeof o.postingTime === "string"
        ? o.postingTime
        : typeof o.preferredTime === "string"
          ? o.preferredTime
          : DEFAULT_BLOG_AUTOMATION_FORM.postingTime,
    timezone: typeof o.timezone === "string" ? o.timezone : DEFAULT_BLOG_AUTOMATION_FORM.timezone,
    targetAudience: typeof o.targetAudience === "string" ? o.targetAudience : "",
    tone: typeof o.tone === "string" ? o.tone : DEFAULT_BLOG_AUTOMATION_FORM.tone,
    defaultLanguage: typeof o.defaultLanguage === "string" ? o.defaultLanguage : DEFAULT_BLOG_AUTOMATION_FORM.defaultLanguage,
    topicMode,
    requireHumanApproval: o.requireHumanApproval !== false,
    autoPublish: !!o.autoPublish,
    createSocialPosts: !!o.createSocialPosts,
    socialPlatforms,
    articleLength,
    brandInstructions: typeof o.brandInstructions === "string" ? o.brandInstructions : "",
    forbiddenTopics: typeof o.forbiddenTopics === "string" ? o.forbiddenTopics : "",
  };
}

export function parseBlogDraftEditableFields(body: unknown): BlogDraftEditableFields {
  if (!body || typeof body !== "object") throw new Error("Ungültige JSON-Nutzlast.");
  const o = body as Record<string, unknown>;
  const sourcesRaw = o.sources;
  const sources = Array.isArray(sourcesRaw)
    ? sourcesRaw.map((row) => {
        const x = row as Record<string, unknown>;
        return { title: String(x.title ?? ""), url: String(x.url ?? "") };
      })
    : [];
  const base: BlogDraftEditableFields = {
    title: String(o.title ?? ""),
    slug: String(o.slug ?? ""),
    excerpt: String(o.excerpt ?? ""),
    metaTitle: String(o.metaTitle ?? ""),
    metaDescription: String(o.metaDescription ?? ""),
    articleHtml: String(o.articleHtml ?? ""),
    researchSummary: String(o.researchSummary ?? ""),
    sources,
  };
  if (typeof o.heroImageUrl === "string" || o.heroImageUrl === null) {
    base.heroImageUrl = o.heroImageUrl === null ? null : o.heroImageUrl;
  }
  if (typeof o.authorId === "string") {
    base.authorId = o.authorId;
  }
  if (typeof o.heroImageAlt === "string") {
    base.heroImageAlt = o.heroImageAlt;
  }
  if (typeof o.heroImageCredit === "string") {
    base.heroImageCredit = o.heroImageCredit;
  }
  if (o.heroImageClear === true) {
    base.heroImageClear = true;
  }
  return base;
}
