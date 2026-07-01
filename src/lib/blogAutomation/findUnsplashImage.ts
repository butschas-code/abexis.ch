import "server-only";

import type { UnsplashPhotoBrief } from "@/lib/blogAutomation/unsplash-photo-types";

/**
 * Unsplash hero imagery for blog automation (server-only).
 * Uses UNSPLASH_ACCESS_KEY; never import this module from client bundles.
 *
 * https://unsplash.com/documentation#search-photos
 */

const SEARCH_URL = "https://api.unsplash.com/search/photos";
const CMS_PICKER_RESULTS_PER_SEARCH = 24;

/** Token-kitsch cues we penalise when ranking results for Swiss editorial tone. */
const CHEESY_SUBSTRINGS = [
  "handshake",
  "shaking hands",
  "high five",
  "fist bump",
  "stock photo",
  "businessman smiling",
  "businesswoman smiling",
  "corporate team",
  "team building",
  "trust fall",
  "happy employees",
  "office party",
  "fake laptop",
  "laptop screen",
  "computer screen",
  "chart on screen",
  "financial chart",
  "skyscraper",
  "city skyline",
  "swiss architecture",
  "switzerland",
  "swiss alps",
  "mountain landscape",
  "landscape",
  "flag",
  "growth hacking",
  "millionaire mindset",
  "cash money",
  "piggy bank",
  "thumbs up",
  "pointing at",
];

const FALLBACK_BUSINESS_TECH_QUERIES = [
  "business technology",
  "enterprise software",
  "digital transformation",
  "IT project management",
  "business strategy meeting",
  "software implementation",
  "workflow automation",
] as const;

export type UnsplashHeroSelection = {
  heroImageUrl: string;
  heroImageAlt: string;
  heroImageCredit: string;
  heroImagePhotographerName: string;
  heroImagePhotographerUrl: string;
  heroImageUnsplashUrl: string;
  heroImageDownloadLocation: string;
  /** Query string that produced the winning search result. */
  imageSearchQuery: string;
};

type UnsplashSearchResponse = {
  results?: UnsplashPhotoBrief[];
};

function unsplashHeaders(): HeadersInit | null {
  const key = process.env.UNSPLASH_ACCESS_KEY?.trim();
  if (!key) return null;
  return { Authorization: `Client-ID ${key}` };
}

function editorialPenalty(text: string): number {
  const t = text.toLowerCase();
  let score = 0;
  for (const kw of CHEESY_SUBSTRINGS) {
    if (t.includes(kw)) score += 12;
  }
  return score;
}

function photoScore(p: UnsplashPhotoBrief, avoidUrls?: Set<string>): number {
  const blob = [p.alt_description ?? "", p.user?.name ?? ""].join(" ");
  let score = editorialPenalty(blob);
  const urls = [p.urls?.regular, p.urls?.small, p.links?.html].map((u) => u?.trim()).filter(Boolean);
  if (avoidUrls && urls.some((u) => avoidUrls.has(u))) score += 1000;
  return score;
}

function buildCredit(photographerName: string): string {
  const name = photographerName.trim() || "Photographer";
  return `Photo by ${name} on Unsplash`;
}

function heroFromPhoto(p: UnsplashPhotoBrief, openAiAlt: string, queryUsed: string): UnsplashHeroSelection | null {
  const regular = p.urls?.regular?.trim();
  const downloadLoc = p.links?.download_location?.trim();
  const unsplashPage = p.links?.html?.trim();
  const photographerUrl = p.user?.links?.html?.trim();
  const photographerName = p.user?.name?.trim() ?? "";
  if (!regular || !downloadLoc || !unsplashPage || !photographerUrl) return null;

  const altFromPhoto = p.alt_description?.trim();
  const heroAlt = openAiAlt.trim() || altFromPhoto || "Blog hero image";

  return {
    heroImageUrl: regular,
    heroImageAlt: heroAlt,
    heroImageCredit: buildCredit(photographerName),
    heroImagePhotographerName: photographerName,
    heroImagePhotographerUrl: photographerUrl,
    heroImageUnsplashUrl: unsplashPage,
    heroImageDownloadLocation: downloadLoc,
    imageSearchQuery: queryUsed.trim(),
  };
}

/**
 * Unsplash requires hitting `download_location` once when an application uses a photo
 * (tracks downloads for photographers).
 */
export async function triggerUnsplashPhotoDownload(downloadLocationUrl: string | null | undefined): Promise<void> {
  const raw = downloadLocationUrl?.trim();
  if (!raw) return;
  let host = "";
  try {
    host = new URL(raw).hostname;
  } catch {
    return;
  }
  if (!host.endsWith("unsplash.com")) return;

  const headers = unsplashHeaders();
  if (!headers) return;

  await fetch(raw, { headers, method: "GET" }).catch(() => undefined);
}

async function fetchSearchPage(query: string): Promise<UnsplashPhotoBrief[]> {
  const headers = unsplashHeaders();
  if (!headers) return [];

  const params = new URLSearchParams({
    query: query.trim(),
    orientation: "landscape",
    per_page: String(CMS_PICKER_RESULTS_PER_SEARCH),
    content_filter: "high",
  });

  const res = await fetch(`${SEARCH_URL}?${params.toString()}`, {
    headers,
    method: "GET",
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`[unsplash] Search failed (${res.status}): ${t.slice(0, 200)}`);
  }

  const json = (await res.json()) as UnsplashSearchResponse;
  return Array.isArray(json.results) ? json.results : [];
}

/**
 * Returns ranked landscape results for CMS pickers (does not trigger download).
 */
export async function searchUnsplashLandscapePhotos(query: string): Promise<UnsplashPhotoBrief[]> {
  const rows = await fetchSearchPage(query);
  return [...rows].sort((a, b) => photoScore(a) - photoScore(b));
}

/**
 * Loads a single photo by id (authoritative metadata for editor selections).
 */
export async function getUnsplashPhotoById(photoId: string): Promise<UnsplashPhotoBrief | null> {
  const id = photoId.trim();
  if (!id) return null;
  const headers = unsplashHeaders();
  if (!headers) return null;

  const res = await fetch(`https://api.unsplash.com/photos/${encodeURIComponent(id)}`, {
    headers,
    method: "GET",
    next: { revalidate: 0 },
  });

  if (!res.ok) return null;
  return (await res.json()) as UnsplashPhotoBrief;
}

/**
 * Builds persisted hero metadata, triggers download tracking, returns fields for Firestore.
 * Prefer {@link applyUnsplashPhotoToHeroFields} when the photo is already known (CMS selection).
 */
export async function applyUnsplashPhotoToHeroFields(
  photo: UnsplashPhotoBrief,
  opts: { openAiAlt: string; imageSearchQuery: string },
): Promise<UnsplashHeroSelection | null> {
  const hero = heroFromPhoto(photo, opts.openAiAlt, opts.imageSearchQuery);
  if (!hero) return null;
  await triggerUnsplashPhotoDownload(hero.heroImageDownloadLocation);
  return hero;
}

/**
 * Iterates OpenAI search queries, picks the least «stock» landscape match, triggers download.
 */
export async function findUnsplashImage(params: {
  imageSearchQueries: string[];
  heroImageAlt: string;
  avoidImageUrls?: string[];
}): Promise<UnsplashHeroSelection | null> {
  const badQuery = /\b(swiss|schweiz|switzerland|architecture|architectural|landschaft|landscape|mountain|alps|flag|handshake|skyscraper)\b/i;
  const generatedQueries = params.imageSearchQueries
    .map((q) => q.trim())
    .filter(Boolean)
    .filter((q) => !badQuery.test(q));
  const queries = [...new Set([...generatedQueries, ...FALLBACK_BUSINESS_TECH_QUERIES])].slice(0, 8);
  if (!queries.length) return null;
  if (!unsplashHeaders()) return null;
  const avoidUrls = new Set((params.avoidImageUrls ?? []).map((u) => u.trim()).filter(Boolean));

  let best: { photo: UnsplashPhotoBrief; query: string; penalty: number } | null = null;

  for (const query of queries) {
    let rows: UnsplashPhotoBrief[];
    try {
      rows = await fetchSearchPage(query);
    } catch {
      continue;
    }
    if (!rows.length) continue;

    const ranked = [...rows].sort((a, b) => photoScore(a, avoidUrls) - photoScore(b, avoidUrls));
    const top = ranked[0];
    const penalty = photoScore(top, avoidUrls);
    if (!best || penalty < best.penalty) {
      best = { photo: top, query, penalty };
    }
    // Good enough: stop early if we already have a very clean match.
    if (penalty === 0) break;
  }

  if (!best) return null;

  return applyUnsplashPhotoToHeroFields(best.photo, {
    openAiAlt: params.heroImageAlt,
    imageSearchQuery: best.query,
  });
}
