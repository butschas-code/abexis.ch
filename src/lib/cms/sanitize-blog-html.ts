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

export function sanitizeBlogHtml(html: string): string {
  const input = typeof html === "string" ? html : String(html ?? "");
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
