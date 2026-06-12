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

export function sanitizeBlogHtml(html: string): string {
  const input = normalizeEscapedBlogHtml(html);
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

/** Generated articles should not carry source/citation links into the public post. */
export function sanitizeGeneratedBlogHtmlWithoutLinks(html: string): string {
  const input = normalizeEscapedBlogHtml(html);
  try {
    return sanitizeHtmlLib(input, {
      allowedTags: ALLOWED_TAGS.filter((tag) => tag !== "a"),
      allowedAttributes: {
        img: ALLOWED_ATTR.img,
        span: ALLOWED_ATTR.span,
        "*": ALLOWED_ATTR["*"],
      },
      allowedSchemes: ALLOWED_SCHEMES,
      allowedSchemesByTag: ALLOWED_SCHEMES_BY_TAG,
      allowProtocolRelative: true,
      disallowedTagsMode: "discard",
      transformTags: {
        a: "span",
      },
    });
  } catch {
    return "";
  }
}
