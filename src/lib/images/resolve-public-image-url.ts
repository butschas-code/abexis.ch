/**
 * Public-site image URLs: when Firebase Storage billing/API is down (HTTP 402) or rules block GCS,
 * fall back to legacy Hoststar CDN (same migrated UUID assets) or known Unsplash originals for `cms/media/site/*`.
 *
 * Safe to keep enabled after billing returns — fallbacks mirror the same assets.
 */

const FIREBASE_MIGRATED_RE =
  /^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^/]+\/o\/cms%2Fmedia%2Fmigrated%2F([0-9a-f-]{36})\.([a-zA-Z0-9]+)(?:\?.*)?$/i;

const FIREBASE_SITE_RE =
  /^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^/]+\/o\/cms%2Fmedia%2Fsite%2F([a-z0-9-]+)\.([a-zA-Z0-9]+)(?:\?.*)?$/i;

const GCS_BUCKET_RE =
  /^https:\/\/storage\.googleapis\.com\/[^/]+\/site\/(.+)$/i;

/** Editorial keys under `cms/media/site/` → Unsplash source used at first upload. */
const SITE_EDITORIAL_UNSPLASH: Record<string, string> = {
  "editorial-insights": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1800&q=80",
  "editorial-insights-desk": "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1800&q=80",
  "editorial-hero": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80",
  "editorial-services": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1800&q=80",
  "editorial-process": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=80",
  "editorial-contact": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1800&q=80",
  "editorial-team": "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1800&q=80",
  "editorial-about": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1800&q=80",
  "editorial-vakanzen": "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?auto=format&fit=crop&w=1800&q=80",
  "editorial-executive": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=82",
  "executive-unsplash": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=82",
};

function hoststarUrlFromUuid(uuid: string, ext: string): string {
  const id = uuid.toLowerCase();
  return `https://files.designer.hoststar.ch/${id.slice(0, 2)}/${id.slice(2, 4)}/${id}.${ext}`;
}

function resolveFirebaseStorageUrl(url: string): string | null {
  const migrated = url.match(FIREBASE_MIGRATED_RE);
  if (migrated) {
    return hoststarUrlFromUuid(migrated[1], migrated[2]);
  }

  const site = url.match(FIREBASE_SITE_RE);
  if (site) {
    const key = site[1];
    return SITE_EDITORIAL_UNSPLASH[key] ?? null;
  }

  return null;
}

function resolveGcsSiteUrl(url: string): string | null {
  const m = url.match(GCS_BUCKET_RE);
  if (!m) return null;

  const path = decodeURIComponent(m[1]);
  if (path === "hero/home-hero.png") {
    return "/images/legacy/home-hero.webp";
  }

  // Partner / prc assets live under site/ with readable names — no stable Hoststar mapping here.
  return null;
}

/**
 * Rewrites broken Firebase/GCS image URLs to working fallbacks for the public site.
 * Relative paths and non-Firebase URLs are returned unchanged.
 */
export function resolvePublicImageUrl(src: string): string {
  const trimmed = src.trim();
  if (!trimmed) return trimmed;

  if (trimmed.startsWith("http://files.designer.hoststar.ch")) {
    return `https://${trimmed.slice("http://".length)}`;
  }

  if (trimmed.includes("firebasestorage.googleapis.com")) {
    return resolveFirebaseStorageUrl(trimmed) ?? trimmed;
  }

  if (trimmed.includes("storage.googleapis.com")) {
    return resolveGcsSiteUrl(trimmed) ?? trimmed;
  }

  return trimmed;
}
