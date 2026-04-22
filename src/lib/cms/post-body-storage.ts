/** Canonical blog body storage written by the CMS editor. */
export const POST_BODY_FORMAT = "abexis-blog-body" as const;
export const POST_BODY_VERSION = 1 as const;

export type PostBodyEnvelope = {
  format: typeof POST_BODY_FORMAT;
  version: typeof POST_BODY_VERSION;
  /** Sanitized HTML fragment (no full document). */
  html: string;
};

/**
 * Wraps editor HTML in a small JSON envelope so the field stays structured,
 * versionable, and easy to migrate later (e.g. to block JSON) without breaking reads.
 */
export function serializePostBody(html: string): string {
  const env: PostBodyEnvelope = {
    format: POST_BODY_FORMAT,
    version: POST_BODY_VERSION,
    html: html?.trim() ? html : "<p></p>",
  };
  return JSON.stringify(env);
}

/**
 * Reads stored `posts.body`: envelope JSON or legacy plain HTML string.
 */
export function parsePostBody(raw: string): { html: string; envelope: PostBodyEnvelope | null } {
  const s = typeof raw === "string" ? raw : String(raw ?? "");
  const t = s.trim();
  if (!t.startsWith("{")) {
    return { html: s, envelope: null };
  }
  try {
    const o = JSON.parse(t) as Partial<PostBodyEnvelope>;
    if (o?.format === POST_BODY_FORMAT && o.version === POST_BODY_VERSION && typeof o.html === "string") {
      return { html: o.html, envelope: o as PostBodyEnvelope };
    }
  } catch {
    /* fall through */
  }
  return { html: s, envelope: null };
}

/** Normalizes legacy HTML to the canonical envelope before save. */
export function normalizePostBodyForPersistence(raw: string): string {
  const { html } = parsePostBody(raw);
  return serializePostBody(html);
}
