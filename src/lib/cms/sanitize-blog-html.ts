import sanitizeHtmlLib from "sanitize-html";

/**
 * Strict allowlist for blog HTML from the CMS editor and legacy imports.
 * Keep in sync with TipTap output (StarterKit + Link + Image).
 *
 * Uses `sanitize-html` (pure JS, no jsdom) so the bundle works in Vercel
 * serverless runtime without hitting the ESM/CJS interop issue that
 * `isomorphic-dompurify` → `jsdom` → `html-encoding-sniffer` triggers.
 */
const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "a",
  "blockquote",
  "img",
  "span",
];

const ALLOWED_ATTR: Record<string, string[]> = {
  a: ["href", "title", "target", "rel"],
  img: ["src", "alt", "title", "loading", "class"],
  span: ["class"],
  "*": ["class"],
};

const ALLOWED_SCHEMES = ["http", "https", "mailto"];
const ALLOWED_SCHEMES_BY_TAG: Record<string, string[]> = { img: ["http", "https", "data"] };

const ESCAPED_HTML_TAG_PATTERN =
  /&(?:amp;)?lt;\/?(?:article|section|main|div|p|br|strong|em|b|i|u|h[1-6]|ul|ol|li|a|blockquote|img|span)\b/i;

const GENERATED_TAIL_HEADING_PATTERN =
  /<h[2-6]\b[^>]*>\s*(?:Bildersuche(?:[-\s]Anfragen)?|Alt[-\s]?Text(?:\s+für\s+das\s+Titelbild)?|LinkedIn|Social(?:\s*Media)?|Meta(?:daten)?|SEO\s+Metadata|SEO[-\s]Titel|Quellen|Sources|Image(?:\s+search)?|Hero(?:\s+image)?)\s*<\/h[2-6]>/i;

const GENERATED_TAIL_LINE_PATTERN =
  /(?:^|\n)\s*(?:Bildersuche(?:[-\s]Anfragen)?|Alt[-\s]?Text(?:\s+für\s+das\s+Titelbild)?|LinkedIn(?:\s+Post)?|Social(?:\s*Media)?|Meta(?:daten)?|SEO\s+Metadata|SEO[-\s]Titel|Quellen|Sources|Image(?:\s+search)?|Hero(?:\s+image)?)(?:\s*:|\s*$)/i;

const EXTERNAL_URL_PATTERN = /https?:\/\/(?!(?:www\.)?abexis\.ch(?:\/|$))[^\s<")]+/gi;

const GENERATED_RESIDUE_PATTERN =
  /\{\{BLOG_URL\}\}|BLOG_URL|Für weitere Informationen|besuchen Sie unsere Webseite|Bildersuche|Unsplash|Alt[-\s]?Text|imageSearchQueries|heroImageAlt/i;

const COMPETITOR_REFERENCE_PATTERN =
  /\b(?:Accenture|Deloitte|PwC|KPMG|EY|Ernst\s*&\s*Young|McKinsey|BCG|Boston\s+Consulting\s+Group|Bain|Capgemini|Bearing\s*Point|BearingPoint|Zühlke|Zuehlke|Swisscom|ELCA|ti\s*&\s*m|ti&amp;m|Adesso|isolutions|Erni|AWK|Wavestone|Synpulse|Implement\s+Consulting\s+Group|Sopra\s+Steria|NTT\s+DATA|Cognizant|Wipro|Infosys|TCS|DXC|EPAM|Gartner|Forrester)\b|https?:\/\/(?:www\.)?(?:accenture|deloitte|pwc|kpmg|ey|mckinsey|bcg|bain|capgemini|bearingpoint|zuehlke|swisscom|elca|ti8m|adesso|isolutions|erni|awk|wavestone|synpulse|implementconsultinggroup|soprasteria|nttdata|cognizant|wipro|infosys|tcs|dxc|epam|gartner|forrester)\.[^\s<")]+/i;

/**
 * Repairs generated/CMS bodies that were accidentally stored as escaped HTML,
 * e.g. `&lt;section&gt;&lt;p&gt;...`, before the strict sanitizer runs.
 */
export function normalizeEscapedBlogHtml(html: string): string {
  let out = typeof html === "string" ? html : String(html ?? "");

  for (let i = 0; i < 3 && ESCAPED_HTML_TAG_PATTERN.test(out); i += 1) {
    const decoded = out
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#0?39;|&apos;/gi, "'")
      .replace(/&nbsp;/gi, " ");

    if (decoded === out) break;
    out = decoded;
  }

  return out;
}

function stripModelCodeFences(html: string): string {
  return html
    .trim()
    .replace(/^```(?:html|json|markdown|md)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

function unwrapGeneratedContainers(html: string): string {
  return html.replace(/<\/?(?:article|section|main)\b[^>]*>/gi, "").trim();
}

function stripGeneratedTail(html: string): string {
  let out = html;
  const headingStop = out.search(GENERATED_TAIL_HEADING_PATTERN);
  if (headingStop >= 0) {
    out = out.slice(0, headingStop).trim();
  }

  const lineStop = out.search(GENERATED_TAIL_LINE_PATTERN);
  if (lineStop >= 0) {
    out = out.slice(0, lineStop).trim();
  }

  return stripHtmlBlocksMatching(out, GENERATED_RESIDUE_PATTERN)
    .replace(/\{\{BLOG_URL\}\}/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function stripHtmlBlocksMatching(html: string, pattern: RegExp): string {
  let out = html;
  for (const tag of ["p", "li", "blockquote", "h2", "h3"] as const) {
    out = out.replace(
      new RegExp(`<${tag}\\b[^>]*>(?:(?!<\\/${tag}>)[\\s\\S])*?(?:${pattern.source})(?:(?!<\\/${tag}>)[\\s\\S])*?<\\/${tag}>`, "gi"),
      "",
    );
  }
  return out;
}

function normalizeAbexisInternalHref(href: string | undefined): string | null {
  const raw = href?.trim();
  if (!raw) return null;
  if (raw.startsWith("/")) return raw.startsWith("//") ? null : raw;
  try {
    const url = new URL(raw);
    if (url.hostname === "abexis.ch" || url.hostname === "www.abexis.ch") {
      return `${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    return null;
  }
  return null;
}

function restoreInternalMarkdownLinks(html: string): string {
  return html.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_match, label: string, href: string) => {
    const internalHref = normalizeAbexisInternalHref(href);
    if (!internalHref) return label;
    return `<a href="${internalHref}">${label}</a>`;
  });
}

export function containsCompetitorReference(value: string): boolean {
  return COMPETITOR_REFERENCE_PATTERN.test(value);
}

export function stripCompetitorReferenceLines(value: string): string {
  return value
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line && !COMPETITOR_REFERENCE_PATTERN.test(line))
    .join("\n\n")
    .trim();
}

/** Removes generator-only notes that should never display at the bottom of public articles. */
export function removeGeneratedArticleResidue(html: string): string {
  const input = unwrapGeneratedContainers(normalizeEscapedBlogHtml(stripModelCodeFences(html)));
  return unwrapGeneratedContainers(stripGeneratedTail(input));
}

/**
 * Normalizes AI-generated article bodies before they are stored or published.
 * It keeps semantic article HTML, removes source/competitor residue, and leaves
 * final rendering to the strict sanitizer below.
 */
export function cleanGeneratedBlogArticleHtml(html: string): string {
  let out = restoreInternalMarkdownLinks(removeGeneratedArticleResidue(html)
    .replace(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi, (_m, text) => `<h2>${String(text).trim()}</h2>`));

  out = out
    .replace(/\[([^\]]+)\]\((?:https?:\/\/[^\s)]+|[^)\s]+)\)/g, "$1")
    .replace(/\(\s*(?:Quelle|Source|vgl\.?|see|https?:\/\/)[^)]+\)/gi, "")
    .replace(EXTERNAL_URL_PATTERN, "");

  out = stripHtmlBlocksMatching(out, COMPETITOR_REFERENCE_PATTERN);

  return out
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function sanitizeBlogHtml(html: string): string {
  const input = stripHtmlBlocksMatching(removeGeneratedArticleResidue(html), COMPETITOR_REFERENCE_PATTERN);
  try {
    return sanitizeHtmlLib(input, {
      allowedTags: ALLOWED_TAGS,
      allowedAttributes: ALLOWED_ATTR,
      allowedSchemes: ALLOWED_SCHEMES,
      allowedSchemesByTag: ALLOWED_SCHEMES_BY_TAG,
      allowProtocolRelative: true,
      disallowedTagsMode: "discard",
      transformTags: {
        a: (tagName, attribs) => ({
          tagName,
          attribs: {
            ...attribs,
            /** External link hardening : safe default for CMS/legacy content. */
            target: attribs.target ?? "_blank",
            rel: attribs.rel ?? "noopener noreferrer",
          },
        }),
      },
    });
  } catch {
    return "";
  }
}

/** Generated articles may carry internal Abexis links, but never source/citation links. */
export function sanitizeGeneratedBlogHtmlWithoutLinks(html: string): string {
  const input = cleanGeneratedBlogArticleHtml(html);
  try {
    return sanitizeHtmlLib(input, {
      allowedTags: ALLOWED_TAGS,
      allowedAttributes: {
        a: ALLOWED_ATTR.a,
        img: ALLOWED_ATTR.img,
        span: ALLOWED_ATTR.span,
        "*": ALLOWED_ATTR["*"],
      },
      allowedSchemes: ALLOWED_SCHEMES,
      allowedSchemesByTag: ALLOWED_SCHEMES_BY_TAG,
      allowProtocolRelative: true,
      disallowedTagsMode: "discard",
      transformTags: {
        a: (_tagName, attribs) => {
          const href = normalizeAbexisInternalHref(attribs.href);
          if (!href) return { tagName: "span", attribs: {} };
          const cleanAttribs: Record<string, string> = { href };
          if (attribs.title) cleanAttribs.title = attribs.title;
          return {
            tagName: "a",
            attribs: cleanAttribs,
          };
        },
      },
    });
  } catch {
    return "";
  }
}
