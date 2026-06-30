/**
 * Repair a published AI draft whose only connected LinkedIn row was already
 * handed to Nuelink during testing. The script preserves the sent row for audit,
 * creates a fresh sendable row, and optionally sends it to Nuelink immediately.
 *
 * Usage:
 *   ./node_modules/.bin/tsx scripts/repair-nuelink-social-handoff.ts --draft IqAaO3P2c2PnpMvwOmF1
 *   ./node_modules/.bin/tsx scripts/repair-nuelink-social-handoff.ts --draft IqAaO3P2c2PnpMvwOmF1 --send
 */

import { loadEnvConfig } from "@next/env";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, Timestamp, getFirestore } from "firebase-admin/firestore";

loadEnvConfig(process.cwd());

const PUBLIC_BLOG_BASE_URL = "https://www.abexis.ch/blog";
const NUELINK_API_BASE = "https://nuelink.com/api/public/v1";

function arg(name: string): string {
  const idx = process.argv.indexOf(name);
  return idx >= 0 ? process.argv[idx + 1] ?? "" : "";
}

function hasFlag(name: string): boolean {
  return process.argv.includes(name);
}

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function normalizeSwiss(value: string): string {
  return value.replace(/ß/g, "ss").replace(/ẞ/g, "SS");
}

function readMillis(value: unknown): number {
  return value instanceof Timestamp ? value.toMillis() : 0;
}

function readPlatforms(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).map((v) => v.trim()).filter(Boolean) : ["linkedin"];
}

function initDb() {
  const raw = requiredEnv("FIREBASE_SERVICE_ACCOUNT_JSON");
  const serviceAccount = JSON.parse(raw) as Record<string, string>;
  if (typeof serviceAccount.private_key === "string") {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
  }
  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
  }
  return getFirestore();
}

function normalizeLinkedInCaptionForBlog(caption: string, blogUrl: string): string {
  const clean = normalizeSwiss(caption)
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

async function sendToNuelink(params: {
  caption: string;
  blogUrl: string;
  title: string;
  imageUrl: string;
  imageAlt: string;
}) {
  const apiKey = requiredEnv("NUELINK_API_KEY");
  const brandId = Number(requiredEnv("NUELINK_BRAND_ID"));
  const collectionId = Number(process.env.NUELINK_LINKEDIN_COLLECTION_ID?.trim() || requiredEnv("NUELINK_COLLECTION_ID"));
  const publishMode = (process.env.NUELINK_PUBLISH_MODE?.trim().toUpperCase() || "QUEUE") as "QUEUE" | "DRAFT" | "IMMEDIATE" | "SCHEDULE";

  const body: Record<string, unknown> = {
    caption: params.caption,
    publishMode,
    link: params.blogUrl,
    title: params.title.slice(0, 255),
  };
  if (params.imageAlt) body.alt = params.imageAlt.slice(0, 255);
  if (params.imageUrl) body.media = [{ url: params.imageUrl }];

  const response = await fetch(`${NUELINK_API_BASE}/brands/${brandId}/collections/${collectionId}/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  if (!response.ok) {
    throw new Error(typeof data?.message === "string" ? data.message : `Nuelink failed (${response.status})`);
  }
  const nested = data?.data && typeof data.data === "object" ? data.data as Record<string, unknown> : null;
  const postId = String(nested?.id ?? data?.id ?? "");
  if (!postId) throw new Error("Nuelink did not return a post id.");
  return { postId, brandId, collectionId, publishMode };
}

async function main() {
  const draftId = arg("--draft").trim();
  if (!draftId) throw new Error("Pass --draft <draftId>.");

  const db = initDb();
  const draftRef = db.collection("blogDrafts").doc(draftId);
  const draftSnap = await draftRef.get();
  if (!draftSnap.exists) throw new Error(`Draft not found: ${draftId}`);
  const draft = draftSnap.data() as Record<string, unknown>;
  const slug = String(draft.slug ?? "").trim();
  const blogUrl = slug ? `${PUBLIC_BLOG_BASE_URL}/${encodeURIComponent(slug)}` : "";

  const socialSnap = await db.collection("blogSocialPosts").where("blogDraftId", "==", draftId).get();
  if (socialSnap.empty) throw new Error(`No social rows found for draft ${draftId}.`);

  let sendableRef = socialSnap.docs.find((doc) => !doc.get("nuelinkLastSentAt"))?.ref ?? null;
  if (!sendableRef) {
    const source = [...socialSnap.docs].sort((a, b) => {
      const at = readMillis(a.get("createdAt")) || readMillis(a.get("updatedAt"));
      const bt = readMillis(b.get("createdAt")) || readMillis(b.get("updatedAt"));
      return bt - at;
    })[0]!;
    const row = source.data() as Record<string, unknown>;
    const newRef = db.collection("blogSocialPosts").doc();
    await newRef.set({
      topicId: typeof row.topicId === "string" ? row.topicId : typeof draft.topicId === "string" ? draft.topicId : null,
      blogDraftId: draftId,
      automationRunId: typeof row.automationRunId === "string" ? row.automationRunId : typeof draft.automationRunId === "string" ? draft.automationRunId : null,
      status: "published",
      platforms: readPlatforms(row.platforms),
      linkedinPost: normalizeSwiss(String(row.linkedinPost ?? `${String(draft.title ?? "").trim()}\n\n{{BLOG_URL}}`)),
      socialImageUrl: typeof row.socialImageUrl === "string" && row.socialImageUrl.trim() ? row.socialImageUrl.trim() : draft.heroImageUrl ?? null,
      socialImageAlt: typeof row.socialImageAlt === "string" && row.socialImageAlt.trim() ? normalizeSwiss(row.socialImageAlt.trim()) : draft.heroImageAlt ?? null,
      socialImageManualOverride: row.socialImageManualOverride === true,
      clonedFromSocialPostId: source.id,
      clonedForPublishedPostId: typeof draft.publishedPostId === "string" ? draft.publishedPostId : null,
      clonedReason: "manual_repair_after_previous_nuelink_test_send",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    sendableRef = newRef;
    console.log(`Created fresh social row ${newRef.id} from previously sent row ${source.id}.`);
  } else {
    console.log(`Found existing unsent social row ${sendableRef.id}.`);
  }

  if (!hasFlag("--send")) {
    console.log("Dry run complete. Add --send to push this row to Nuelink.");
    return;
  }

  const sendable = await sendableRef.get();
  if (!sendable.exists) throw new Error(`Sendable social row disappeared: ${sendableRef.id}`);
  const row = sendable.data() as Record<string, unknown>;
  const caption = normalizeLinkedInCaptionForBlog(String(row.linkedinPost ?? ""), blogUrl);
  const imageUrl = String(row.socialImageUrl ?? draft.heroImageUrl ?? "").trim();
  const imageAlt = normalizeSwiss(String(row.socialImageAlt ?? draft.heroImageAlt ?? "").trim());
  const result = await sendToNuelink({
    caption,
    blogUrl,
    title: normalizeSwiss(String(draft.title ?? "")),
    imageUrl,
    imageAlt,
  });
  const sentAt = Timestamp.now();
  await sendableRef.update({
    linkedinPost: caption,
    socialImageUrl: imageUrl || FieldValue.delete(),
    socialImageAlt: imageAlt || FieldValue.delete(),
    nuelinkLastSentAt: sentAt,
    nuelinkLastTarget: "linkedin",
    nuelinkLastPostId: result.postId,
    nuelinkSends: FieldValue.arrayUnion({
      target: "linkedin",
      postId: result.postId,
      brandId: result.brandId,
      collectionId: result.collectionId,
      publishMode: result.publishMode,
      sentAt,
    }),
    updatedAt: FieldValue.serverTimestamp(),
  });
  console.log(`Sent social row ${sendableRef.id} to Nuelink post ${result.postId} (${result.publishMode}).`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
