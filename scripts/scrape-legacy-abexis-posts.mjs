/**
 * Scrape legacy Abexis blog (Webflow) and write a clean JSON array for CMS import:
 *   data/legacy-abexis-posts.json
 *
 * @see scripts/migration/README.md
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "cheerio";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../data/legacy-abexis-posts.json");

const BASE_CANDIDATES = ["https://www.abexis.ch", "https://abexis.ch"];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      "user-agent": "AbexisLegacyBlogExport/1.1 (+migration)",
      accept: "text/html,application/xhtml+xml",
    },
  });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.text();
}

async function resolveBaseUrl() {
  for (const base of BASE_CANDIDATES) {
    const u = new URL("/blog", base).toString();
    try {
      await fetchText(u);
      return base;
    } catch {
      /* try next */
    }
  }
  throw new Error(`Could not fetch /blog from ${BASE_CANDIDATES.join(", ")}`);
}

function extractSlugsFromListHtml(html) {
  const $ = load(html);
  const out = [];
  $("a.blogpostlist__title-link[href^='/blog/']").each((_, el) => {
    const href = $(el).attr("href");
    const title = $(el).text().trim();
    if (!href || href === "/blog") return;
    if (/^\/blog\/page\/\d+\/?$/i.test(href)) return;
    out.push({ path: href, title });
  });
  const seen = new Set();
  return out.filter((p) => {
    if (seen.has(p.path)) return false;
    seen.add(p.path);
    return true;
  });
}

/** Walk `/blog`, `/blog/page/2`, … until a page adds no new post links or fetch fails. */
async function collectAllPostLinks(base) {
  const byPath = new Map();
  let page = 1;
  const maxPages = 80;

  while (page <= maxPages) {
    const listUrl = page === 1 ? new URL("/blog", base).toString() : new URL(`/blog/page/${page}`, base).toString();
    let html;
    try {
      html = await fetchText(listUrl);
    } catch {
      break;
    }
    const batch = extractSlugsFromListHtml(html);
    if (batch.length === 0) break;
    let added = 0;
    for (const row of batch) {
      if (!byPath.has(row.path)) {
        byPath.set(row.path, row.title);
        added++;
      }
    }
    if (added === 0) break;
    page++;
    await sleep(400);
  }

  return [...byPath.entries()].map(([path, title]) => ({ path, title }));
}

function plainFromHtml(html, maxLen) {
  const t = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (t.length <= maxLen) return t;
  return `${t.slice(0, maxLen - 1).trim()}…`;
}

function stripJunkFromArticleRoot($, root) {
  root.find("script, style, noscript, iframe").remove();
  root.find("form").remove();
  root.find(".w-embed, .w-widget-twitter, [data-share], .share-buttons").remove();
  root.find("nav, aside, footer").remove();
}

/**
 * @returns {{
 *   title: string,
 *   slug: string,
 *   excerpt: string,
 *   body: string,
 *   heroImageUrl: string | null,
 *   publishedAt: string | null,
 *   tags: string[],
 *   seoTitle: string | null,
 *   seoDescription: string | null,
 * }}
 */
function extractPost(html, base, path, listTitle) {
  const $ = load(html);
  const h1 = $("h1.blogpost__post-title").first().text().trim();
  const title = h1 || listTitle || "";

  const timeAttr = $("time.blogpost__timestamp").attr("datetime")?.trim() ?? "";
  let publishedAt = null;
  if (timeAttr) {
    const d = new Date(timeAttr);
    if (Number.isFinite(d.getTime())) publishedAt = d.toISOString();
  }

  const $body = $("div.blogpost__post-body[itemprop='articleBody']").first().clone();
  stripJunkFromArticleRoot($, $body);
  let body = $body.html()?.trim() ?? "";
  if (!body) {
    const fallback = $("article [itemprop='articleBody'], .blogpost__post-body, article .rich-text").first().html();
    body = (fallback ?? "").trim();
  }

  const metaDesc =
    $('meta[name="description"]').attr("content")?.trim() ||
    $('meta[property="og:description"]').attr("content")?.trim() ||
    null;
  const ogTitle = $('meta[property="og:title"]').attr("content")?.trim() || null;
  const ogImage = $('meta[property="og:image"]').attr("content")?.trim() || null;
  const twImage = $('meta[name="twitter:image"]').attr("content")?.trim() || null;

  const tags = [];
  $("a.blogpost__tag-link .blogpost__tag-text").each((_, el) => {
    const t = $(el).text().trim();
    if (t) tags.push(t);
  });

  let heroImageUrl = ogImage || twImage || null;
  if (!heroImageUrl && body) {
    const $b = load(`<div>${body}</div>`);
    const first = $b("img[src^='http']").first().attr("src")?.trim();
    if (first) heroImageUrl = first;
  }

  const excerpt =
    metaDesc && metaDesc.length > 0
      ? metaDesc.slice(0, 2000)
      : body
        ? plainFromHtml(body, 320)
        : "";

  const seoTitle = ogTitle && ogTitle.length > 0 ? ogTitle.slice(0, 320) : title ? title.slice(0, 320) : null;
  const seoDescription =
    metaDesc && metaDesc.length > 0 ? metaDesc.slice(0, 2000) : excerpt ? excerpt.slice(0, 2000) : null;

  let slug = path.replace(/^\/blog\//, "").replace(/^\//, "");
  try {
    slug = decodeURIComponent(slug);
  } catch {
    /* keep */
  }

  return {
    title,
    slug,
    excerpt,
    body,
    heroImageUrl,
    publishedAt,
    tags,
    seoTitle,
    seoDescription,
  };
}

async function main() {
  const base = await resolveBaseUrl();
  console.log("Using base:", base);

  const links = await collectAllPostLinks(base);
  console.log(`Found ${links.length} unique post links (all list pages)`);

  const results = [];
  for (let i = 0; i < links.length; i++) {
    const { path, title: listTitle } = links[i];
    const url = new URL(path, base).toString();
    process.stdout.write(`[${i + 1}/${links.length}] ${path} … `);
    try {
      const html = await fetchText(url);
      const row = extractPost(html, base, path, listTitle);
      if (!row.title) row.title = listTitle || row.slug;
      if (!row.body) {
        console.log("EMPTY BODY - skipped");
        continue;
      }
      results.push(row);
      console.log("ok");
    } catch (e) {
      console.log("FAIL", e.message);
    }
    await sleep(400);
  }

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(results, null, 2), "utf8");
  console.log(`\nWrote ${results.length} posts to ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
