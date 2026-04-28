import { z } from "zod";
import { parsePostUpsert } from "@/cms/schema";
import { SEED_AUTHOR_DOC_IDS } from "@/cms/seed/sample-authors";
import { slugFromTitle } from "@/lib/cms/slug-from-title";
import { sanitizeBlogHtml } from "@/lib/cms/sanitize-blog-html";
import { serializePostBody } from "@/lib/cms/post-body-storage";
import type { PostUpsertInput } from "@/cms/types/dto";

/** One legacy row (compatible with `scripts/scrape-blogs.mjs` output + optional CMS fields). */
export const legacyPostJsonSchema = z.object({
  slug: z.string().min(1).max(400),
  /** May be empty when `listTitle` holds the headline (scrape output). */
  title: z.string().max(2000).optional().default(""),
  /** Primary HTML body (legacy Webflow / blog markup). */
  bodyHtml: z.string().max(500_000).optional().default(""),
  /** ISO-ish date from legacy `<time datetime>` or `publishedAt` export. */
  publishedISO: z.string().max(50).optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  listTitle: z.string().optional(),
  url: z.string().optional(),
  /** If present, scrape failed : importer skips. */
  error: z.string().optional(),
  excerpt: z.string().max(20_000).optional(),
  /** Validated again in mapper (must be http(s) if set). */
  heroImageUrl: z.string().max(2000).optional().nullable(),
  heroImageAlt: z.string().max(500).optional().nullable(),
  categoryIds: z.array(z.string().min(1).max(128)).max(50).optional().default([]),
  seoTitle: z.string().max(320).optional().nullable(),
  seoDescription: z.string().max(2000).optional().nullable(),
  featured: z.boolean().optional(),
});

export type LegacyPostJson = z.infer<typeof legacyPostJsonSchema>;

/** Wrapper file : `posts` rows are coerced (may use `body` / `publishedAt` export shape). */
export const legacyPostsFileSchema = z.object({
  version: z.number().int().positive().optional(),
  posts: z.array(z.unknown()),
});

export type LegacyPostsFile = {
  version?: number;
  posts: LegacyPostJson[];
};

/**
 * Normalizes one JSON object into {@link LegacyPostJson}:
 * - `data/legacy-abexis-posts.json` uses `body` + `publishedAt`
 * - older scrapes use `bodyHtml` + `publishedISO`
 */
export function coerceLegacyPostRow(input: unknown): LegacyPostJson {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Expected a post object");
  }
  const o = input as Record<string, unknown>;
  const publishedRaw = o.publishedAt ?? o.publishedISO;
  const publishedISO =
    publishedRaw == null || publishedRaw === "" ? "" : String(publishedRaw).trim().slice(0, 50);
  const optString = (v: unknown) => (v == null ? undefined : String(v));
  const optNullableUrl = (key: string) => {
    if (!(key in o)) return undefined;
    const v = o[key];
    if (v === null || v === "") return null;
    return String(v).slice(0, 2000);
  };
  const optNullableSeo = (key: string) => {
    if (!(key in o)) return undefined;
    const v = o[key];
    if (v === null) return null;
    return String(v).trim() || null;
  };
  const merged = {
    slug: String(o.slug ?? "").trim(),
    title: String(o.title ?? o.listTitle ?? "").trim(),
    bodyHtml: String(o.bodyHtml ?? o.body ?? "").trim(),
    publishedISO,
    tags: Array.isArray(o.tags) ? o.tags.map((t) => String(t)) : [],
    listTitle: optString(o.listTitle),
    url: optString(o.url),
    error: optString(o.error),
    excerpt: optString(o.excerpt),
    heroImageUrl: optNullableUrl("heroImageUrl"),
    heroImageAlt: optString(o.heroImageAlt),
    categoryIds: Array.isArray(o.categoryIds) ? o.categoryIds.map(String) : undefined,
    seoTitle: optNullableSeo("seoTitle"),
    seoDescription: optNullableSeo("seoDescription"),
    featured: typeof o.featured === "boolean" ? o.featured : undefined,
  };
  return legacyPostJsonSchema.parse(merged);
}

/** Accepts `{ "posts": [...] }` or a root-level array (e.g. `data/legacy-abexis-posts.json`). */
export function parseLegacyPostsPayload(raw: unknown): LegacyPostsFile {
  if (Array.isArray(raw)) {
    return { posts: raw.map((row) => coerceLegacyPostRow(row)) };
  }
  const file = legacyPostsFileSchema.parse(raw);
  return { version: file.version, posts: file.posts.map((row) => coerceLegacyPostRow(row)) };
}

export type MapLegacyPostResult =
  | { ok: true; upsert: PostUpsertInput }
  | { ok: false; reasons: string[] };

function stripTagsForExcerpt(html: string, maxLen: number): string {
  const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (plain.length <= maxLen) return plain;
  return `${plain.slice(0, Math.max(0, maxLen - 1)).trim()}…`;
}

function isValidCmsSlug(s: string): boolean {
  return /^[\p{L}\p{N}]+(?:[-_/][\p{L}\p{N}]+)*$/u.test(s);
}

/**
 * Normalizes URL path segment into a CMS `slugSegment`-compatible slug.
 */
/** Slug after normalization (for duplicate checks before allocating a doc id). */
export function resolveLegacySlugForImport(raw: LegacyPostJson): string {
  const title = raw.title.trim() || raw.listTitle?.trim() || "";
  return normalizeLegacySlug(raw.slug, title || "beitrag");
}

export function normalizeLegacySlug(raw: string, titleForFallback: string): string {
  let decoded = raw.trim();
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    /* keep trimmed raw */
  }
  let s = decoded
    .replace(/^\/+|\/+$/g, "")
    .replace(/^blog\/?/i, "")
    .replace(/\.html?$/i, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\p{L}\p{N}_/-]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 200)
    .replace(/-+$/, "");

  if (!s) s = slugFromTitle(titleForFallback);
  if (!isValidCmsSlug(s)) s = slugFromTitle(titleForFallback);
  if (!s) s = "beitrag";
  return s.slice(0, 200);
}

function normalizeTags(tags: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const t of tags) {
    const x = t.trim().slice(0, 80);
    if (!x || seen.has(x.toLowerCase())) continue;
    seen.add(x.toLowerCase());
    out.push(x);
    if (out.length >= 50) break;
  }
  return out;
}

function parsePublishedDate(publishedISO: string): Date | null {
  const t = publishedISO.trim();
  if (!t) return null;
  const d = new Date(t);
  return Number.isFinite(d.getTime()) ? d : null;
}

function normalizeHeroUrl(url: string | null | undefined): string | null {
  if (url == null) return null;
  const u = url.trim();
  if (!u) return null;
  if (!/^https?:\/\//i.test(u)) return null;
  try {
    // eslint-disable-next-line no-new -- validate URL shape
    new URL(u);
  } catch {
    return null;
  }
  return u.length > 2000 ? u.slice(0, 2000) : u;
}

/**
 * Maps one legacy JSON row to a {@link PostUpsertInput} (published, site abexis).
 * `id` must be a new Firestore document id allocated by the caller.
 */
export function mapLegacyPostToUpsert(
  raw: LegacyPostJson,
  options: { id: string; authorId: string },
): MapLegacyPostResult {
  if (raw.error?.trim()) {
    return { ok: false, reasons: [`legacy error flag: ${raw.error.trim().slice(0, 200)}`] };
  }

  const title = raw.title.trim() || raw.listTitle?.trim() || "";
  const slug = normalizeLegacySlug(raw.slug, title || raw.listTitle || "beitrag");
  const bodyHtml = raw.bodyHtml?.trim() ?? "";

  const reasons: string[] = [];
  if (!title) reasons.push("missing title");
  if (!slug) reasons.push("missing slug");
  if (!bodyHtml) reasons.push("missing or empty bodyHtml");
  if (reasons.length) return { ok: false, reasons };

  const sanitizedBody = sanitizeBlogHtml(bodyHtml);
  const body = serializePostBody(sanitizedBody);

  const excerptRaw = raw.excerpt?.trim();
  const excerpt = excerptRaw && excerptRaw.length > 0 ? excerptRaw.slice(0, 20_000) : stripTagsForExcerpt(sanitizedBody, 600).slice(0, 20_000);

  const published = parsePublishedDate(raw.publishedISO);
  const publishedAtIso = published ? published.toISOString() : new Date().toISOString();

  const heroImageUrl = normalizeHeroUrl(raw.heroImageUrl ?? undefined);
  const heroImageAlt = raw.heroImageAlt?.trim() ? raw.heroImageAlt.trim().slice(0, 500) : null;

  const upsertCandidate: PostUpsertInput = {
    id: options.id,
    title: title.slice(0, 500),
    slug,
    excerpt,
    body,
    heroImageUrl,
    heroImageAlt,
    heroImagePath: null,
    authorId: options.authorId.trim() || SEED_AUTHOR_DOC_IDS.sampleEditorial,
    categoryIds: (raw.categoryIds ?? []).map((x) => x.trim()).filter(Boolean).slice(0, 50),
    tags: normalizeTags(raw.tags ?? []),
    site: "abexis",
    status: "published",
    seoTitle: raw.seoTitle?.trim() ? raw.seoTitle.trim().slice(0, 320) : null,
    seoDescription: raw.seoDescription?.trim()
      ? raw.seoDescription.trim().slice(0, 2000)
      : excerpt.slice(0, 2000) || null,
    featured: raw.featured === true,
    publishedAt: publishedAtIso,
  };

  const parsed = parsePostUpsert(upsertCandidate);
  if (!parsed.success) {
    const zodReasons = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
    return { ok: false, reasons: zodReasons };
  }

  return { ok: true, upsert: parsed.data };
}

export function parseLegacyPostsFileJson(raw: unknown): LegacyPostsFile {
  const file = legacyPostsFileSchema.parse(raw);
  return { version: file.version, posts: file.posts.map((row) => coerceLegacyPostRow(row)) };
}

export const DEFAULT_LEGACY_IMPORT_AUTHOR_ID = SEED_AUTHOR_DOC_IDS.sampleEditorial;
