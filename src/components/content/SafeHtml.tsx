import sanitizeHtmlLib from "sanitize-html";

type Props = {
  html: string;
  className?: string;
};

/**
 * Sanitized legacy HTML (eigener migrierter Content).
 * Uses `sanitize-html` (pure JS) instead of `isomorphic-dompurify` to stay
 * compatible with Vercel's serverless runtime.
 */
export function SafeHtml({ html, className }: Props) {
  const input = typeof html === "string" ? html : String(html ?? "");
  let clean = "";
  try {
    clean = sanitizeHtmlLib(input, {
      allowedTags: [
        ...sanitizeHtmlLib.defaults.allowedTags,
        "img",
        "figure",
        "figcaption",
        "time",
        "section",
        "article",
        "aside",
        "header",
        "footer",
        "hgroup",
      ],
      allowedAttributes: {
        ...sanitizeHtmlLib.defaults.allowedAttributes,
        "*": [
          "class",
          "style",
          "target",
          "rel",
          "datetime",
          "itemprop",
          "itemscope",
          "itemtype",
        ],
        img: ["src", "alt", "title", "loading", "width", "height", "class"],
        a: ["href", "title", "target", "rel", "class"],
      },
      allowedSchemes: ["http", "https", "mailto", "tel"],
      allowedSchemesByTag: { img: ["http", "https", "data"] },
      allowProtocolRelative: true,
    });
  } catch {
    clean = "";
  }
  return (
    <div
      className={className ?? "legacy-prose max-w-none"}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
