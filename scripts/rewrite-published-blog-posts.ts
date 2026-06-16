/**
 * One-off editorial refresh for already published CMS blog posts.
 *
 * What it does:
 * - rewrites published Abexis posts with the current AI editorial rules
 * - preserves each post's slug and publish date
 * - adds contextual internal Abexis links to the article body
 * - creates/updates a linked CMS draft and LinkedIn social row
 * - never calls Nuelink; prepared social rows stay in the CMS for manual sending
 *
 * Usage:
 *   pnpm run cms:rewrite-published-blog -- --dry-run --limit 3
 *   CMS_REWRITE_PUBLISHED_BLOG_ALLOW=1 pnpm run cms:rewrite-published-blog -- --write
 *
 * Required env:
 *   OPENAI_API_KEY
 *   FIREBASE_PROJECT_ID + FIREBASE_SERVICE_ACCOUNT_JSON (or ADC)
 */
import { loadEnvConfig } from "@next/env";
import OpenAI from "openai";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

import { COLLECTIONS } from "@/cms/firestore/collections";
import { serializePostBody, parsePostBody } from "@/lib/cms/post-body-storage";
import {
  sanitizeGeneratedBlogHtmlWithoutLinks,
  stripCompetitorReferenceLines,
} from "@/lib/cms/sanitize-blog-html";
import { getAdminFirestore } from "@/firebase/server";

loadEnvConfig(process.cwd());

const PUBLIC_BLOG_BASE_URL = "https://www.abexis.ch/blog";
const DEFAULT_MODEL = process.env.OPENAI_BLOG_REWRITE_MODEL?.trim() || process.env.OPENAI_BLOG_MODEL?.trim() || "gpt-4.1-mini";

const INTERNAL_LINKS = [
  "/projectrealitycheck",
  "/leistungen",
  "/fokusthemen/digitale-transformation",
  "/fokusthemen/unternehmensstrategie",
  "/fokusthemen/projektmanagement",
  "/fokusthemen/prozessoptimierung",
  "/fokusthemen/vertriebmarketing",
  "/fokusthemen/veränderungsmanagement",
  "/danielsengstag",
  "/kontakt",
] as const;

type Args = {
  write: boolean;
  limit: number;
  postId: string | null;
  force: boolean;
};

type RewrittenPost = {
  title: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  articleHtml: string;
  linkedinPost: string;
};

const RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["title", "excerpt", "seoTitle", "seoDescription", "articleHtml", "linkedinPost"],
  properties: {
    title: { type: "string" },
    excerpt: { type: "string" },
    seoTitle: { type: "string" },
    seoDescription: { type: "string" },
    articleHtml: { type: "string" },
    linkedinPost: { type: "string" },
  },
} as const;

function parseArgs(argv: string[]): Args {
  const args: Args = { write: false, limit: 500, postId: null, force: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]!;
    if (arg === "--") continue;
    if (arg === "--write") args.write = true;
    else if (arg === "--dry-run") args.write = false;
    else if (arg === "--force") args.force = true;
    else if (arg === "--limit") args.limit = Number.parseInt(argv[++i] ?? "", 10);
    else if (arg.startsWith("--limit=")) args.limit = Number.parseInt(arg.slice("--limit=".length), 10);
    else if (arg === "--post-id") args.postId = argv[++i] ?? null;
    else if (arg.startsWith("--post-id=")) args.postId = arg.slice("--post-id=".length);
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!Number.isFinite(args.limit) || args.limit <= 0) args.limit = 500;
  return args;
}

function timestampToIso(value: unknown): string | null {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

function toSwissGerman(value: string): string {
  return value.replace(/ß/g, "ss").replace(/ẞ/g, "SS");
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function buildInstructions(blogUrl: string): string {
  return `You are refreshing already published German blog articles for Abexis, a Swiss consulting firm.

Rewrite the article so it is clearer, more useful, and more editorially polished, while preserving the original topic and intent.

Non-negotiables:
- German for Switzerland: always use "ss", never "ß".
- Do not mention competitors or external consulting/technology provider sites by name.
- Do not add source lists, footnotes, citation links, "Quellen", "Weiterlesen", external URLs, or competitor references.
- Keep the article as semantic HTML fragments only: p, h2/h3, ul/ol/li, strong/em, a. No h1, no html/body/article wrapper.
- Add 2-4 contextual internal links to relevant Abexis pages. Use only these relative URLs: ${INTERNAL_LINKS.join(", ")}.
- Internal links must be natural editorial references, not a link list.
- Keep the post substantial and structured, with a strong intro and clear h2 sections.
- The LinkedIn post must be a short teaser, 350-700 characters, no hashtags, no external links, no source links.
- The LinkedIn post must end with this exact blog URL on its own final line: ${blogUrl}
- Output exactly one JSON object matching the schema.`;
}

function buildPrompt(post: {
  title: string;
  slug: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  html: string;
}): string {
  return `Refresh this already published Abexis blog post.

Preserve the URL slug exactly: ${post.slug}
Do not output a slug.

Current title:
${post.title}

Current excerpt:
${post.excerpt || "(empty)"}

Current SEO title:
${post.seoTitle || "(empty)"}

Current SEO description:
${post.seoDescription || "(empty)"}

Current article text:
${stripHtml(post.html).slice(0, 24_000)}

Return the improved post fields as JSON.`;
}

async function rewritePost(client: OpenAI, post: {
  title: string;
  slug: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  html: string;
}): Promise<{ output: RewrittenPost; responseId: string }> {
  const blogUrl = `${PUBLIC_BLOG_BASE_URL}/${encodeURIComponent(post.slug)}`;
  const response = await client.responses.create({
    model: DEFAULT_MODEL,
    instructions: buildInstructions(blogUrl),
    input: buildPrompt(post),
    max_output_tokens: 16_000,
    text: {
      format: {
        type: "json_schema",
        name: "abexis_published_blog_rewrite_v1",
        strict: true,
        schema: RESPONSE_SCHEMA as unknown as Record<string, unknown>,
      },
    },
  });

  const text = response.output_text?.trim();
  if (!text) throw new Error("OpenAI returned no JSON text.");
  const raw = JSON.parse(text) as Partial<RewrittenPost>;
  const required = ["title", "excerpt", "seoTitle", "seoDescription", "articleHtml", "linkedinPost"] as const;
  for (const key of required) {
    if (typeof raw[key] !== "string" || !raw[key]?.trim()) {
      throw new Error(`OpenAI JSON missing ${key}.`);
    }
  }

  const articleHtml = sanitizeGeneratedBlogHtmlWithoutLinks(toSwissGerman(raw.articleHtml!));
  const linkedinPost = normalizeLinkedinPost(raw.linkedinPost!, blogUrl);

  return {
    responseId: response.id,
    output: {
      title: toSwissGerman(raw.title!).trim(),
      excerpt: toSwissGerman(raw.excerpt!).trim(),
      seoTitle: toSwissGerman(raw.seoTitle!).trim(),
      seoDescription: toSwissGerman(raw.seoDescription!).trim(),
      articleHtml,
      linkedinPost,
    },
  };
}

function normalizeLinkedinPost(value: string, blogUrl: string): string {
  const clean = stripCompetitorReferenceLines(toSwissGerman(value))
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, "$1")
    .replace(/https?:\/\/(?!www\.abexis\.ch\/blog\/)[^\s)]+/gi, "")
    .replace(new RegExp(blogUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), "")
    .replace(/\{\{BLOG_URL\}\}/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return `${clean}\n\n${blogUrl}`.trim();
}

async function findOrCreateDraft(params: {
  db: NonNullable<ReturnType<typeof getAdminFirestore>>;
  postId: string;
  postData: Record<string, unknown>;
  rewrite: RewrittenPost;
  responseId: string;
  publishedAt: unknown;
  write: boolean;
}): Promise<string> {
  const { db, postId, postData, rewrite, responseId, publishedAt, write } = params;
  const existing = await db.collection(COLLECTIONS.blogDrafts).where("publishedPostId", "==", postId).limit(1).get();
  const draftRef = existing.empty ? db.collection(COLLECTIONS.blogDrafts).doc() : existing.docs[0]!.ref;
  const now = FieldValue.serverTimestamp();
  const patch = {
    topicId: `published-refresh:${postId}`,
    status: "published",
    title: rewrite.title,
    slug: String(postData.slug ?? postId),
    excerpt: rewrite.excerpt,
    metaTitle: rewrite.seoTitle,
    metaDescription: rewrite.seoDescription,
    articleHtml: rewrite.articleHtml,
    researchSummary: "Existing published CMS article refreshed with current Abexis editorial/linking rules.",
    sources: [],
    authorId: String(postData.authorId ?? ""),
    openaiResponseId: responseId,
    pipelineModel: DEFAULT_MODEL,
    publishedPostId: postId,
    publishedAt: publishedAt ?? null,
    heroImageUrl: postData.heroImageUrl ?? null,
    heroImageAlt: postData.heroImageAlt ?? null,
    heroImageCredit: postData.heroImageCredit ?? null,
    heroImagePhotographerName: postData.heroImagePhotographerName ?? null,
    heroImagePhotographerUrl: postData.heroImagePhotographerUrl ?? null,
    heroImageUnsplashUrl: postData.heroImageUnsplashUrl ?? null,
    updatedAt: now,
    ...(existing.empty ? { createdAt: now, approvedAt: publishedAt ?? now } : {}),
  };
  if (write) await draftRef.set(patch, { merge: true });
  return draftRef.id;
}

async function upsertManualSocialPost(params: {
  db: NonNullable<ReturnType<typeof getAdminFirestore>>;
  draftId: string;
  postId: string;
  postData: Record<string, unknown>;
  rewrite: RewrittenPost;
  responseId: string;
  write: boolean;
}): Promise<string> {
  const { db, draftId, postId, postData, rewrite, responseId, write } = params;
  const snap = await db.collection(COLLECTIONS.blogSocialPosts).where("blogDraftId", "==", draftId).get();
  const unsent = snap.docs.find((doc) => !doc.get("nuelinkLastSentAt"));
  const socialRef = unsent?.ref ?? db.collection(COLLECTIONS.blogSocialPosts).doc();
  const now = FieldValue.serverTimestamp();
  const patch = {
    topicId: `published-refresh:${postId}`,
    blogDraftId: draftId,
    status: "needs_review",
    platforms: ["linkedin"],
    linkedinPost: rewrite.linkedinPost,
    socialImageUrl: typeof postData.heroImageUrl === "string" ? postData.heroImageUrl : null,
    socialImageAlt: typeof postData.heroImageAlt === "string" ? postData.heroImageAlt : null,
    socialImageManualOverride: false,
    openaiResponseId: responseId,
    preparedWithoutNuelink: true,
    preparedWithoutNuelinkAt: now,
    updatedAt: now,
    ...(unsent ? {} : { createdAt: now }),
  };
  if (write) await socialRef.set(patch, { merge: true });
  return socialRef.id;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (args.write && process.env.CMS_REWRITE_PUBLISHED_BLOG_ALLOW !== "1") {
    throw new Error("Refusing writes. Set CMS_REWRITE_PUBLISHED_BLOG_ALLOW=1 and pass --write.");
  }

  const db = getAdminFirestore();
  if (!db) throw new Error("Firebase Admin not configured. Set FIREBASE_PROJECT_ID and FIREBASE_SERVICE_ACCOUNT_JSON, or ADC.");

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY.");
  const client = new OpenAI({ apiKey });

  const postDocs = args.postId
    ? [(await db.collection(COLLECTIONS.posts).doc(args.postId).get())].filter((doc) => doc.exists)
    : (await db.collection(COLLECTIONS.posts).where("status", "==", "published").limit(args.limit).get()).docs;

  console.log(`[cms:rewrite-published-blog] mode=${args.write ? "write" : "dry-run"} posts=${postDocs.length} model=${DEFAULT_MODEL}`);

  let updated = 0;
  let skipped = 0;
  for (const doc of postDocs) {
    const data = doc.data() as Record<string, unknown>;
    if (!args.force && data.aiRefreshVersion === "internal-links-v1") {
      skipped += 1;
      console.log(`- skip ${doc.id} (${data.slug ?? doc.id}) already refreshed`);
      continue;
    }

    const slug = String(data.slug ?? doc.id).trim();
    const publishedAt = data.publishedAt;
    const { html } = parsePostBody(String(data.body ?? ""));
    const rewrite = await rewritePost(client, {
      title: String(data.title ?? ""),
      slug,
      excerpt: String(data.excerpt ?? ""),
      seoTitle: String(data.seoTitle ?? ""),
      seoDescription: String(data.seoDescription ?? ""),
      html,
    });

    const draftId = await findOrCreateDraft({
      db,
      postId: doc.id,
      postData: data,
      rewrite: rewrite.output,
      responseId: rewrite.responseId,
      publishedAt,
      write: args.write,
    });
    const socialId = await upsertManualSocialPost({
      db,
      draftId,
      postId: doc.id,
      postData: data,
      rewrite: rewrite.output,
      responseId: rewrite.responseId,
      write: args.write,
    });

    const postPatch = {
      title: rewrite.output.title,
      excerpt: rewrite.output.excerpt,
      body: serializePostBody(rewrite.output.articleHtml),
      seoTitle: rewrite.output.seoTitle,
      seoDescription: rewrite.output.seoDescription,
      status: "published",
      aiRefreshVersion: "internal-links-v1",
      aiRefreshOpenaiResponseId: rewrite.responseId,
      aiRefreshUpdatedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (args.write) await doc.ref.set(postPatch, { merge: true });
    updated += 1;
    console.log(
      `- ${args.write ? "updated" : "would update"} ${doc.id} /${slug} publishedAt=${timestampToIso(publishedAt) ?? "(missing)"} draft=${draftId} social=${socialId}`,
    );
  }

  console.log(`[cms:rewrite-published-blog] done updated=${updated} skipped=${skipped} write=${args.write}`);
}

main().catch((err) => {
  console.error("[cms:rewrite-published-blog] failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
