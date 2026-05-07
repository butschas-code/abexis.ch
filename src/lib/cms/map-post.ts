import type { DocumentSnapshot } from "firebase-admin/firestore";
import type { PostStatus } from "@/cms/types/enums";
import type { CmsPost } from "@/cms/types/post";
import type { SiteKey } from "@/cms/types/site";

function normalizePostSite(_raw: unknown): SiteKey {
  return "abexis";
}

function readHeroPath(d: Record<string, unknown>): string | null {
  if (d.heroImagePath != null) return String(d.heroImagePath);
  if (d.heroStoragePath != null) return String(d.heroStoragePath);
  return null;
}

function readTags(d: Record<string, unknown>): string[] {
  if (!Array.isArray(d.tags)) return [];
  return d.tags.map((t) => String(t)).filter(Boolean);
}

function readFeatured(d: Record<string, unknown>): boolean {
  return d.featured === true;
}

function readStatus(d: Record<string, unknown>): PostStatus {
  const s = d.status;
  if (s === "published" || s === "archived" || s === "draft") return s;
  return "draft";
}

function toIsoField(v: unknown): string | null {
  if (v && typeof (v as { toDate?: () => Date }).toDate === "function") {
    return (v as { toDate: () => Date }).toDate().toISOString();
  }
  if (typeof v === "string") return v;
  return null;
}

/**
 * Map raw Firestore document data to `CmsPost` (shared by Admin SDK and Web SDK readers).
 */
export function mapPostDocData(id: string, d: Record<string, unknown>): CmsPost {
  return {
    title: String(d.title ?? ""),
    slug: String(d.slug ?? id),
    excerpt: String(d.excerpt ?? ""),
    body: String(d.body ?? ""),
    heroImageUrl: d.heroImageUrl != null ? String(d.heroImageUrl) : null,
    heroImageAlt: d.heroImageAlt != null ? String(d.heroImageAlt) : null,
    heroImagePath: readHeroPath(d),
    authorId: String(d.authorId ?? ""),
    categoryIds: Array.isArray(d.categoryIds) ? d.categoryIds.map(String) : [],
    tags: readTags(d),
    site: normalizePostSite(d.site),
    status: readStatus(d),
    seoTitle: d.seoTitle != null ? String(d.seoTitle) : null,
    seoDescription: d.seoDescription != null ? String(d.seoDescription) : null,
    featured: readFeatured(d),
    publishedAt: toIsoField(d.publishedAt),
    createdAt: toIsoField(d.createdAt) ?? new Date().toISOString(),
    updatedAt: toIsoField(d.updatedAt) ?? new Date().toISOString(),
  };
}

/** Map Admin `DocumentSnapshot` to `CmsPost` (ISO date strings). */
export function mapPostDoc(id: string, snap: DocumentSnapshot): CmsPost | null {
  const d = snap.data();
  if (!d) return null;
  return mapPostDocData(id, d as Record<string, unknown>);
}
