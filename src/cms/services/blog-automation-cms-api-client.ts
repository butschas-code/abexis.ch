"use client";

/**
 * Authenticated CMS calls for blog automation (Firestore via Firebase Admin on the server).
 * Always send `Authorization: Bearer ${await user.getIdToken()}`.
 */

import type { BlogDraftEditableFields } from "@/cms/types/blog-draft-pipeline";
import type {
  BlogDraftDetail,
  BlogDraftListItem,
  BlogSocialListItem,
  BlogTopicListItem,
  UnsplashPhotoBrief,
} from "@/cms/services/blog-pipeline-types";
import type { AddBlogTopicInput, QueuedBlogTopicRow } from "@/lib/blogAutomation/blogTopicQueue";
import type { BlogAutomationDashboardSnapshot } from "@/lib/blogAutomation/cms-dashboard-types";
import type { BlogAutomationFormState } from "@/lib/blogAutomation/editorForm";

const BASE = "/api/cms/blog-automation";

async function cmsBlogAutomationFetch<T>(
  idToken: string,
  path: string,
  init?: Omit<RequestInit, "headers"> & { headers?: HeadersInit },
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      Authorization: `Bearer ${idToken}`,
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  const j = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
  if (!res.ok) {
    throw new Error(typeof j.message === "string" ? j.message : `Anfrage fehlgeschlagen (${res.status}).`);
  }
  return j as T;
}

export async function apiLoadBlogAutomationSettings(
  idToken: string,
): Promise<{ form: BlogAutomationFormState; docExists: boolean }> {
  return cmsBlogAutomationFetch(idToken, "/settings");
}

export async function apiSaveBlogAutomationSettings(
  idToken: string,
  form: BlogAutomationFormState,
  docExists: boolean,
): Promise<void> {
  await cmsBlogAutomationFetch(idToken, "/settings", {
    method: "PUT",
    body: JSON.stringify({ form, docExists }),
  });
}

export async function apiLoadBlogAutomationDashboardSnapshot(
  idToken: string,
  form: BlogAutomationFormState,
): Promise<BlogAutomationDashboardSnapshot> {
  return cmsBlogAutomationFetch(idToken, "/dashboard-snapshot", {
    method: "POST",
    body: JSON.stringify({ form }),
  });
}

export type RunBlogAutomationNowResult = {
  success: boolean;
  action: "draft_created" | "published" | "skipped" | "failed" | "error";
  reason: string;
  runId: string | null;
  topicId: string | null;
  draftId: string | null;
  publishedPostId: string | null;
};

export async function apiRunBlogAutomationNow(idToken: string): Promise<RunBlogAutomationNowResult> {
  return cmsBlogAutomationFetch<RunBlogAutomationNowResult>(idToken, "/run-now", { method: "POST" });
}

export async function apiGenerateBlogDraftFromPrompt(
  idToken: string,
  input: { prompt: string; title?: string },
): Promise<RunBlogAutomationNowResult> {
  return cmsBlogAutomationFetch<RunBlogAutomationNowResult>(idToken, "/prompt-draft", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function apiListQueuedBlogTopics(idToken: string): Promise<QueuedBlogTopicRow[]> {
  const j = await cmsBlogAutomationFetch<{ topics: QueuedBlogTopicRow[] }>(idToken, "/topics?queued=true");
  return j.topics;
}

export async function apiListBlogTopicsForAdmin(idToken: string): Promise<BlogTopicListItem[]> {
  const j = await cmsBlogAutomationFetch<{ topics: BlogTopicListItem[] }>(idToken, "/topics");
  return j.topics;
}

export async function apiCreateBlogTopic(idToken: string, input: AddBlogTopicInput): Promise<void> {
  await cmsBlogAutomationFetch(idToken, "/topics", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function apiUpdateBlogTopic(idToken: string, topicId: string, patch: Record<string, unknown>): Promise<void> {
  await cmsBlogAutomationFetch(idToken, `/topics/${encodeURIComponent(topicId)}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export async function apiDeleteBlogTopic(idToken: string, topicId: string): Promise<void> {
  await cmsBlogAutomationFetch(idToken, `/topics/${encodeURIComponent(topicId)}`, {
    method: "DELETE",
  });
}

export async function apiListBlogDraftsForAdmin(idToken: string, max = 160): Promise<BlogDraftListItem[]> {
  const j = await cmsBlogAutomationFetch<{ drafts: BlogDraftListItem[] }>(idToken, `/drafts?max=${max}`);
  return j.drafts;
}

export async function apiGetBlogDraftForAdmin(idToken: string, draftId: string): Promise<BlogDraftDetail | null> {
  const res = await fetch(`${BASE}/drafts/${encodeURIComponent(draftId)}`, {
    credentials: "include",
    headers: { Authorization: `Bearer ${idToken}` },
  });
  if (res.status === 404) return null;
  const j = (await res.json().catch(() => ({}))) as { draft?: BlogDraftDetail; message?: string };
  if (!res.ok) {
    throw new Error(typeof j.message === "string" ? j.message : `Anfrage fehlgeschlagen (${res.status}).`);
  }
  return j.draft ?? null;
}

export async function apiUpdateBlogDraftFields(idToken: string, draftId: string, fields: BlogDraftEditableFields): Promise<void> {
  await cmsBlogAutomationFetch(idToken, `/drafts/${encodeURIComponent(draftId)}`, {
    method: "PATCH",
    body: JSON.stringify(fields),
  });
}

export async function apiSearchBlogDraftUnsplash(
  idToken: string,
  draftId: string,
  query: string,
): Promise<UnsplashPhotoBrief[]> {
  const j = await cmsBlogAutomationFetch<{ photos: UnsplashPhotoBrief[] }>(
    idToken,
    `/drafts/${encodeURIComponent(draftId)}/unsplash/search`,
    { method: "POST", body: JSON.stringify({ query }) },
  );
  return Array.isArray(j.photos) ? j.photos : [];
}

export async function apiSelectBlogDraftUnsplashPhoto(
  idToken: string,
  draftId: string,
  photoId: string,
  imageSearchQuery?: string,
): Promise<void> {
  await cmsBlogAutomationFetch(idToken, `/drafts/${encodeURIComponent(draftId)}/unsplash/select`, {
    method: "POST",
    body: JSON.stringify({ photoId, imageSearchQuery: imageSearchQuery ?? "" }),
  });
}

export type ApproveBlogDraftApiResult = {
  postId: string;
  scheduledFor: string;
  nuelinkSent: boolean;
  nuelinkError: string | null;
};

export async function apiApproveBlogDraft(
  idToken: string,
  draftId: string,
  body: { authorId?: string; categoryIds?: string[]; tags?: string[] } = {},
): Promise<{ result: ApproveBlogDraftApiResult }> {
  return cmsBlogAutomationFetch(idToken, `/drafts/${encodeURIComponent(draftId)}/approve`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function apiSendBackBlogDraft(idToken: string, draftId: string): Promise<void> {
  await cmsBlogAutomationFetch(idToken, `/drafts/${encodeURIComponent(draftId)}/send-back`, { method: "POST" });
}

export type PublishBlogDraftApiResult = {
  postId: string;
  slugUsed: string;
  slugAdjusted: boolean;
};

export async function apiPublishBlogDraft(
  idToken: string,
  draftId: string,
  body: BlogDraftEditableFields & { authorId: string; categoryIds?: string[]; tags?: string[] },
): Promise<PublishBlogDraftApiResult> {
  return cmsBlogAutomationFetch<PublishBlogDraftApiResult>(idToken, `/drafts/${encodeURIComponent(draftId)}/publish`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function apiDeleteBlogDraft(idToken: string, draftId: string): Promise<void> {
  await cmsBlogAutomationFetch(idToken, `/drafts/${encodeURIComponent(draftId)}`, { method: "DELETE" });
}

export async function apiListBlogSocialPostsForDraft(idToken: string, draftId: string): Promise<BlogSocialListItem[]> {
  const j = await cmsBlogAutomationFetch<{ social: BlogSocialListItem[] }>(
    idToken,
    `/social?draftId=${encodeURIComponent(draftId)}`,
  );
  return j.social;
}

export async function apiListBlogSocialPostsForAdmin(idToken: string, max = 80): Promise<BlogSocialListItem[]> {
  const j = await cmsBlogAutomationFetch<{ social: BlogSocialListItem[] }>(idToken, `/social?max=${max}`);
  return j.social;
}

export async function apiPatchBlogSocialPost(
  idToken: string,
  socialPostId: string,
  patch: Partial<{ linkedinPost: string; socialImageUrl: string | null; socialImageAlt: string | null; markUsed: boolean }>,
): Promise<void> {
  await cmsBlogAutomationFetch(idToken, `/social/${encodeURIComponent(socialPostId)}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export async function apiDeleteBlogSocialPost(idToken: string, socialPostId: string): Promise<void> {
  await cmsBlogAutomationFetch(idToken, `/social/${encodeURIComponent(socialPostId)}`, {
    method: "DELETE",
  });
}

export async function apiSendBlogSocialPostToNuelink(
  idToken: string,
  socialPostId: string,
  body: { target: "linkedin"; caption: string; socialImageUrl?: string | null; socialImageAlt?: string | null },
): Promise<{ result: { postId: string; publishMode: string; collectionId: number; sentAt: string } }> {
  return cmsBlogAutomationFetch(idToken, `/social/${encodeURIComponent(socialPostId)}/nuelink`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
