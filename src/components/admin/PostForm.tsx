"use client";

import { CMS_PATHS } from "@/admin/paths";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { parsePostUpsert } from "@/cms/schema";
import {
  listAuthorsForAdmin,
  listCategoriesForAdmin,
  type CategoryOption,
} from "@/cms/services/content-lookup-client";
import { getPostForAdmin, savePost } from "@/cms/services/post-write-client";
import type { CmsPostListItem } from "@/cms/services/posts-client";
import { commaTextFromTags, tagsFromCommaText } from "@/cms/types/admin-forms";
import { defaultPostUpsertDraft } from "@/cms/types/defaults";
import type { PostUpsertInput } from "@/cms/types/dto";
import type { SiteKey } from "@/cms/types/site";
import {
  normalizePostBodyForPersistence,
  parsePostBody,
  serializePostBody,
} from "@/lib/cms/post-body-storage";
import { categorySiteLabel } from "@/lib/cms/normalize-category-site";
import { sanitizeBlogHtml } from "@/lib/cms/sanitize-blog-html";
import { slugFromTitle } from "@/lib/cms/slug-from-title";
import {
  adminBtnPrimary,
  adminBtnSecondary,
  adminFeedbackError,
  adminFeedbackSuccess,
  adminInput,
  adminInputError,
  adminPanel,
  adminSectionLabel,
} from "@/components/admin/admin-ui";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminFileUpload } from "./AdminFileUpload";

const PostBodyEditor = dynamic(
  () => import("@/components/admin/PostBodyEditor").then((m) => ({ default: m.PostBodyEditor })),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex min-h-[280px] items-center justify-center rounded-xl border border-black/10 bg-[var(--apple-bg-elevated)] px-4 text-sm text-[var(--apple-text-secondary)]"
        role="status"
        aria-live="polite"
      >
        Editor wird geladen…
      </div>
    ),
  },
);

type Mode = "new" | "edit";

const emptyInput = (id: string): PostUpsertInput => defaultPostUpsertDraft(id);

function fromPost(p: CmsPostListItem): PostUpsertInput {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    body: p.body,
    heroImageUrl: p.heroImageUrl,
    heroImageAlt: p.heroImageAlt ?? null,
    heroImagePath: null,
    authorId: p.authorId.trim() || "_",
    categoryIds: p.categoryIds,
    tags: p.tags,
    site: p.site,
    status: p.status,
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
    featured: p.featured,
    publishedAt: p.publishedAt ?? undefined,
  };
}

function toDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fieldErrorsFromZod(issues: { path: (string | number)[]; message: string }[]): Record<string, string> {
  const m: Record<string, string> = {};
  for (const i of issues) {
    const key = i.path[0] != null ? String(i.path[0]) : "form";
    if (!m[key]) m[key] = i.message;
  }
  return m;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isLikelyHttpUrl(s: string): boolean {
  const t = s.trim();
  if (!t) return false;
  try {
    const u = new URL(t);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function PostForm({ mode, postId }: { mode: Mode; postId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [autosaving, setAutosaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [authors, setAuthors] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [input, setInput] = useState<PostUpsertInput>(() => emptyInput(postId));
  const [publishSchedule, setPublishSchedule] = useState("");
  const [heroPreviewBroken, setHeroPreviewBroken] = useState(false);
  const [prevHeroUrl, setPrevHeroUrl] = useState(input.heroImageUrl);
  if (prevHeroUrl !== input.heroImageUrl) {
    setPrevHeroUrl(input.heroImageUrl);
    setHeroPreviewBroken(false);
  }
  const [autosaveEnabled, setAutosaveEnabled] = useState(false);
  const slugTouched = useRef(false);
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showSuccess = useCallback((msg: string) => {
    setSuccess(msg);
    if (successTimer.current) clearTimeout(successTimer.current);
    successTimer.current = setTimeout(() => setSuccess(null), 4500);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [a, c] = await Promise.all([listAuthorsForAdmin(), listCategoriesForAdmin()]);
        if (cancelled) return;
        setAuthors(a);
        setCategories(c);
      } catch {
        if (!cancelled) setError("Autoren oder Kategorien konnten nicht geladen werden.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (mode !== "edit") return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const p = await getPostForAdmin(postId);
        if (cancelled) return;
        if (!p) {
          setError("Beitrag nicht gefunden.");
          return;
        }
        slugTouched.current = true;
        setInput(fromPost(p));
        setPublishSchedule(toDatetimeLocalValue(p.publishedAt));
      } catch {
        if (!cancelled) setError("Beitrag konnte nicht geladen werden.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, postId]);

const slugPreview = useMemo(() => input.slug.trim() || "(slug)", [input.slug]);
  const bodyHtml = useMemo(() => parsePostBody(input.body).html, [input.body]);

  /** Optional autosave: Entwurf sichern ohne Navigation. */
  useEffect(() => {
    if (!autosaveEnabled || loading || saving || autosaving) return;
    const t = window.setTimeout(() => {
      void (async () => {
        const draft: PostUpsertInput = {
          ...input,
          status: "draft",
          body: normalizePostBodyForPersistence(input.body),
          publishedAt: undefined,
        };
        const parsed = parsePostUpsert(draft);
        if (!parsed.success) return;
        setAutosaving(true);
        try {
          await savePost(parsed.data);
          showSuccess("Entwurf automatisch gesichert.");
        } catch {
          /* still */
        } finally {
          setAutosaving(false);
        }
      })();
    }, 35000);
    return () => window.clearTimeout(t);
  }, [input, autosaveEnabled, loading, saving, autosaving, showSuccess]);

  function applySlugFromTitle() {
    slugTouched.current = true;
    setInput((s) => ({ ...s, slug: slugFromTitle(s.title) }));
    setFieldErrors((fe) => {
      const next = { ...fe };
      delete next.slug;
      return next;
    });
  }

  function onTitleChange(title: string) {
    setInput((s) => {
      const next = { ...s, title };
      if (!slugTouched.current) {
        next.slug = slugFromTitle(title);
      }
      return next;
    });
    setFieldErrors((fe) => {
      const n = { ...fe };
      delete n.title;
      if (!slugTouched.current) delete n.slug;
      return n;
    });
  }

  async function persist(intent: "draft" | "publish" | "save") {
    setSaving(true);
    setAutosaving(false);
    setError(null);
    setFieldErrors({});
    try {
      const status =
        intent === "publish" ? ("published" as const) : intent === "draft" ? ("draft" as const) : input.status;

      let publishedAt: string | undefined;
      if (status === "published") {
        if (publishSchedule.trim()) {
          const d = new Date(publishSchedule);
          if (!Number.isFinite(d.getTime())) {
            throw new Error("Bitte gültiges Veröffentlichungsdatum wählen.");
          }
          publishedAt = d.toISOString();
        } else {
          publishedAt = undefined;
        }
      } else {
        publishedAt = undefined;
      }

      const payload: PostUpsertInput = {
        ...input,
        status,
        authorId: input.authorId.trim() || "_",
        publishedAt,
        body: normalizePostBodyForPersistence(input.body),
      };

      const parsed = parsePostUpsert(payload);
      if (!parsed.success) {
        setFieldErrors(fieldErrorsFromZod(parsed.error.issues));
        const msg = parsed.error.issues.map((i) => i.message).join(" · ");
        throw new Error(msg || "Bitte Eingaben prüfen.");
      }

      await savePost(parsed.data);
      setInput(parsed.data);
      if (status === "published" && parsed.data.publishedAt) {
        setPublishSchedule(toDatetimeLocalValue(parsed.data.publishedAt));
      }
      if (intent === "publish") {
        showSuccess("Beitrag veröffentlicht.");
      } else if (intent === "draft") {
        showSuccess("Entwurf gespeichert.");
      } else {
        showSuccess("Gespeichert.");
      }
      if (intent === "save" || intent === "draft") {
        router.refresh();
      }
      if (intent === "publish") {
        router.push(CMS_PATHS.adminPosts);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen.");
    } finally {
      setSaving(false);
    }
  }

  function toggleCategory(id: string) {
    setInput((s) => ({
      ...s,
      categoryIds: s.categoryIds.includes(id) ? s.categoryIds.filter((x) => x !== id) : [...s.categoryIds, id],
    }));
  }

  function openPreview() {
    const title = escapeHtml(input.title.trim() || "Vorschau");
    const excerpt = escapeHtml(input.excerpt.trim());
    const body = sanitizeBlogHtml(parsePostBody(input.body).html);
    const hero = input.heroImageUrl ? escapeHtml(input.heroImageUrl.trim()) : "";
    const heroAlt = escapeHtml(input.heroImageAlt?.trim() || "");
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) {
      setError("Popup blockiert — bitte Popups für diese Seite erlauben, um die Vorschau zu öffnen.");
      return;
    }
    w.document.write(`<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
      <title>${title}</title>
      <style>
        body{font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.6;color:#1d1d1f;background:#fbfbfd;margin:0;padding:1.5rem}
        .wrap{max-width:40rem;margin:0 auto;background:#fff;padding:1.75rem;border-radius:1rem;box-shadow:0 1px 0 rgba(0,0,0,.06)}
        .lead{color:#6e6e73;font-size:1rem;margin:0 0 1.25rem}
        img{max-width:100%;border-radius:0.75rem;margin-bottom:1.25rem}
        h1{font-size:1.5rem;font-weight:600;margin:0 0 0.75rem}
      </style></head><body><div class="wrap">
      ${hero ? `<img src="${hero}" alt="${heroAlt}"/>` : ""}
      <h1>${title}</h1>
      ${excerpt ? `<p class="lead">${excerpt}</p>` : ""}
      <div class="legacy-prose max-w-none">${body}</div>
      </div></body></html>`);
    w.document.close();
  }

  if (loading) {
    return <AdminLoading compact message="Beitrag wird geladen…" />;
  }

  const disabledForm = saving || autosaving;

  return (
    <form className="mx-auto max-w-[1180px] space-y-10" onSubmit={(e) => e.preventDefault()}>
      <div className="flex flex-col gap-6 border-b border-black/[0.05] pb-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className={adminSectionLabel}>Beitrag</p>
          <h1 className="font-serif text-[1.75rem] font-medium leading-[1.15] tracking-[-0.02em] text-[var(--apple-text)] sm:text-[1.95rem]">
            {mode === "new" ? "Neuer Beitrag" : "Beitrag bearbeiten"}
          </h1>
          <p className="text-[14px] text-[var(--apple-text-secondary)]">
            ID <span className="font-mono text-[12px] text-[var(--apple-text)]">{input.id}</span>
            <span className="mx-2 text-[var(--apple-text-tertiary)]">·</span>
            URL <span className="font-mono text-[12px]">/…/{slugPreview}</span>
          </p>
          {input.status === "archived" ? (
            <p className="mt-2 rounded-[10px] border border-amber-200/80 bg-amber-50/90 px-3 py-2 text-[13px] text-amber-950">
              Dieser Beitrag ist archiviert. Sie können ihn bearbeiten oder als Entwurf/Live setzen.
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <div className="flex flex-wrap justify-end gap-2">
            <Link href={CMS_PATHS.adminPosts} className={`${adminBtnSecondary} !min-h-[40px] !px-4 text-[13px]`}>
              Zur Liste
            </Link>
            <button
              type="button"
              disabled={disabledForm}
              onClick={() => void persist("draft")}
              className={`${adminBtnSecondary} !min-h-[40px] text-[13px]`}
            >
              {saving ? "Speichern…" : "Entwurf speichern"}
            </button>
            <button
              type="button"
              disabled={disabledForm}
              onClick={() => void persist("publish")}
              className={`${adminBtnPrimary} !min-h-[40px] text-[13px]`}
            >
              {saving ? "Veröffentlichen…" : "Veröffentlichen"}
            </button>
            <button
              type="button"
              disabled={disabledForm}
              onClick={() => void persist("save")}
              className={`${adminBtnSecondary} !min-h-[40px] border-[var(--brand-900)]/20 bg-[color-mix(in_srgb,var(--brand-900)_8%,white)] text-[13px] text-[var(--brand-900)] hover:bg-[color-mix(in_srgb,var(--brand-900)_12%,white)]`}
            >
              Status beibehalten
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3 text-[12px] text-[var(--apple-text-secondary)]">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={autosaveEnabled}
                onChange={(e) => setAutosaveEnabled(e.target.checked)}
                className="rounded border-black/20"
              />
              Automatisch Entwurf sichern (ca. 35&nbsp;s nach letzter Änderung)
            </label>
            <button
              type="button"
              onClick={() => openPreview()}
              className="font-medium text-[var(--brand-900)] hover:underline"
            >
              Vorschau
            </button>
            {autosaving ? <span className="text-[var(--apple-text-tertiary)]">Sichert…</span> : null}
          </div>
        </div>
      </div>

      {success ? (
        <div className={adminFeedbackSuccess} role="status">
          {success}
        </div>
      ) : null}

      {error ? (
        <div className={adminFeedbackError} role="alert">
          {error}
        </div>
      ) : null}

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className={`space-y-5 ${adminPanel} p-6 sm:p-7`}>
            <h2 className={adminSectionLabel}>Inhalt</h2>
            <label className="block space-y-2">
              <span className="text-[14px] font-medium text-[var(--apple-text)]">Titel</span>
              <input
                className={`${adminInput} ${fieldErrors.title ? adminInputError : ""}`}
                value={input.title}
                onChange={(e) => onTitleChange(e.target.value)}
                aria-invalid={!!fieldErrors.title}
                aria-describedby={fieldErrors.title ? "err-title" : undefined}
              />
              {fieldErrors.title ? (
                <p id="err-title" className="text-xs text-red-600">
                  {fieldErrors.title}
                </p>
              ) : null}
            </label>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[14px] font-medium text-[var(--apple-text)]">Slug</span>
                <button
                  type="button"
                  onClick={() => applySlugFromTitle()}
                  className="text-[12px] font-medium text-[var(--brand-900)] underline decoration-[var(--brand-900)]/20 underline-offset-2 hover:decoration-[var(--brand-900)]/50"
                >
                  Aus Titel erzeugen
                </button>
              </div>
              <input
                className={`${adminInput} font-mono text-[13px] ${fieldErrors.slug ? adminInputError : ""}`}
                value={input.slug}
                onChange={(e) => {
                  slugTouched.current = true;
                  setInput((s) => ({ ...s, slug: e.target.value }));
                  setFieldErrors((fe) => {
                    const n = { ...fe };
                    delete n.slug;
                    return n;
                  });
                }}
                aria-invalid={!!fieldErrors.slug}
                aria-describedby={fieldErrors.slug ? "err-slug" : undefined}
              />
              {fieldErrors.slug ? (
                <p id="err-slug" className="text-xs text-red-600">
                  {fieldErrors.slug}
                </p>
              ) : (
                <p className="text-xs text-[var(--apple-text-tertiary)]">Nur Buchstaben, Zahlen und Bindestriche.</p>
              )}
            </div>

            <label className="block space-y-2">
              <span className="text-[14px] font-medium text-[var(--apple-text)]">Kurzbeschreibung (Auszug)</span>
              <textarea
                className={`min-h-[108px] w-full resize-y ${adminInput} ${fieldErrors.excerpt ? adminInputError : ""}`}
                value={input.excerpt}
                onChange={(e) => setInput((s) => ({ ...s, excerpt: e.target.value }))}
              />
              {fieldErrors.excerpt ? <p className="text-xs text-red-600">{fieldErrors.excerpt}</p> : null}
            </label>

            <div className="space-y-2">
              <span className="text-[14px] font-medium text-[var(--apple-text)]">Text</span>
              <PostBodyEditor
                value={bodyHtml}
                onChange={(html) => {
                  setInput((s) => ({ ...s, body: serializePostBody(html) }));
                  setFieldErrors((fe) => {
                    const n = { ...fe };
                    delete n.body;
                    return n;
                  });
                }}
                disabled={disabledForm}
                uploadPath={`cms/posts/${input.id}/body`}
              />
              {fieldErrors.body ? <p className="text-xs text-red-600">{fieldErrors.body}</p> : null}
            </div>
          </section>

          <section className={`space-y-5 border-t border-black/[0.06] pt-10 ${adminPanel} p-6 sm:p-7`}>
            <h2 className={adminSectionLabel}>SEO</h2>
            <label className="block space-y-2">
              <span className="text-[14px] font-medium text-[var(--apple-text)]">SEO-Titel</span>
              <input
                className={adminInput}
                value={input.seoTitle ?? ""}
                onChange={(e) => setInput((s) => ({ ...s, seoTitle: e.target.value || null }))}
              />
              {fieldErrors.seoTitle ? <p className="text-xs text-red-600">{fieldErrors.seoTitle}</p> : null}
            </label>
            <label className="block space-y-2">
              <span className="text-[14px] font-medium text-[var(--apple-text)]">SEO-Beschreibung</span>
              <textarea
                className={`min-h-[92px] w-full resize-y ${adminInput}`}
                value={input.seoDescription ?? ""}
                onChange={(e) => setInput((s) => ({ ...s, seoDescription: e.target.value || null }))}
              />
              {fieldErrors.seoDescription ? <p className="text-xs text-red-600">{fieldErrors.seoDescription}</p> : null}
            </label>
          </section>
        </div>

        <div className="space-y-7 lg:sticky lg:top-24">
          <div className={`space-y-5 ${adminPanel} p-6`}>
            <h2 className={adminSectionLabel}>Veröffentlichung</h2>
            <label className="block space-y-2">
              <span className="text-[14px] font-medium text-[var(--apple-text)]">Status</span>
              <select className={adminInput}
                value={input.status}
                onChange={(e) =>
                  setInput((s) => ({
                    ...s,
                    status: e.target.value as (typeof input)["status"],
                  }))
                }
              >
                <option value="draft">Entwurf</option>
                <option value="published">Veröffentlicht</option>
                <option value="archived">Archiviert</option>
              </select>
              <p className="text-[12px] leading-relaxed text-[var(--apple-text-tertiary)]">
                Die Buttons oben setzen Entwurf oder Live; hier können Sie auch archivieren.
              </p>
            </label>

            <label className="block space-y-2">
              <span className="text-[14px] font-medium text-[var(--apple-text)]">Veröffentlichungsdatum</span>
              <input
                type="datetime-local"
                className={adminInput}
                value={publishSchedule}
                onChange={(e) => setPublishSchedule(e.target.value)}
                disabled={disabledForm}
              />
              <p className="text-[12px] leading-relaxed text-[var(--apple-text-tertiary)]">
                Beim Veröffentlichen: leer lassen für «jetzt», oder Datum für eine Planung.
              </p>
              {fieldErrors.publishedAt ? <p className="text-xs text-red-600">{fieldErrors.publishedAt}</p> : null}
            </label>

            <label className="block space-y-2">
              <span className="text-[14px] font-medium text-[var(--apple-text)]">Website</span>
              <select className={adminInput}
                value={input.site}
                onChange={(e) => setInput((s) => ({ ...s, site: e.target.value as SiteKey }))}
              >
                <option value="abexis">abexis.ch</option>
                <option value="search">Executive Search</option>
                <option value="both">Beide</option>
              </select>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-black/[0.06] bg-[color-mix(in_srgb,var(--apple-bg-subtle)_88%,white)] px-3 py-3">
              <input
                type="checkbox"
                className="mt-0.5 rounded border-black/20"
                checked={input.featured}
                onChange={(e) => setInput((s) => ({ ...s, featured: e.target.checked }))}
              />
              <span>
                <span className="text-[14px] font-medium text-[var(--apple-text)]">Hervorgehoben</span>
                <span className="mt-1 block text-[12px] leading-snug text-[var(--apple-text-secondary)]">
                  Sichtbar als Empfehlung, wenn das Layout das vorsieht.
                </span>
              </span>
            </label>
          </div>

          <div className={`space-y-5 ${adminPanel} p-6`}>
            <h2 className={adminSectionLabel}>Zuordnung</h2>
            <label className="block space-y-2">
              <span className="text-[14px] font-medium text-[var(--apple-text)]">Autor:in</span>
              <select className={adminInput}
                value={input.authorId || "_"}
                onChange={(e) => setInput((s) => ({ ...s, authorId: e.target.value }))}
              >
                <option value="_">— noch nicht zugewiesen —</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
              {fieldErrors.authorId ? <p className="text-xs text-red-600">{fieldErrors.authorId}</p> : null}
              {authors.length === 0 ? (
                <p className="text-xs text-[var(--apple-text-tertiary)]">Noch keine Autoren in Firestore.</p>
              ) : null}
            </label>

            <div className="space-y-2">
              <span className="text-[14px] font-medium text-[var(--apple-text)]">Kategorien</span>
              <div className="max-h-44 space-y-2 overflow-auto rounded-xl border border-black/[0.07] bg-[color-mix(in_srgb,var(--apple-bg-subtle)_65%,white)] p-3.5">
                {categories.length === 0 ? (
                  <p className="text-xs text-[var(--apple-text-tertiary)]">Noch keine Kategorien in Firestore.</p>
                ) : (
                  categories.map((c) => (
                    <label key={c.id} className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="rounded border-black/20"
                        checked={input.categoryIds.includes(c.id)}
                        onChange={() => toggleCategory(c.id)}
                      />
                      <span>{c.name}</span>
                      <span className="text-xs text-[var(--apple-text-tertiary)]">
                        ({categorySiteLabel(c.site)})
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <label className="block space-y-2">
              <span className="text-[14px] font-medium text-[var(--apple-text)]">Schlagwörter</span>
              <input
                className={adminInput}
                value={commaTextFromTags(input.tags)}
                onChange={(e) => setInput((s) => ({ ...s, tags: tagsFromCommaText(e.target.value) }))}
                placeholder="Strategie, Leadership, …"
              />
              {fieldErrors.tags ? <p className="text-xs text-red-600">{fieldErrors.tags}</p> : null}
            </label>
          </div>

          <div className={`space-y-4 ${adminPanel} p-6`}>
            <h2 className={adminSectionLabel}>Titelbild</h2>
            <p className="text-xs text-[var(--apple-text-secondary)]">
              Laden Sie ein Bild hoch oder geben Sie eine öffentlich erreichbare URL ein.
            </p>
            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="text-[14px] font-medium text-[var(--apple-text)]">Titelbild URL</span>
                <input
                  className={`${adminInput} ${fieldErrors.heroImageUrl ? adminInputError : ""}`}
                  type="url"
                  inputMode="url"
                  placeholder="https://…"
                  value={input.heroImageUrl ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    setInput((s) => ({ ...s, heroImageUrl: v === "" ? null : v }));
                  }}
                  disabled={disabledForm}
                  autoComplete="off"
                  aria-invalid={!!fieldErrors.heroImageUrl}
                  aria-describedby={fieldErrors.heroImageUrl ? "err-hero-url" : undefined}
                />
                {fieldErrors.heroImageUrl ? (
                  <p id="err-hero-url" className="text-xs text-red-600">
                    {fieldErrors.heroImageUrl}
                  </p>
                ) : null}
              </label>

              <AdminFileUpload
                path={`cms/heroes/${input.id}`}
                label="Bild hochladen"
                accept="image/*"
                onUploadSuccess={(url) => {
                  setInput((s) => ({ ...s, heroImageUrl: url }));
                  showSuccess("Bild hochgeladen.");
                }}
              />
            </div>
            <label className="block space-y-2">
              <span className="text-[14px] font-medium text-[var(--apple-text)]">Alternativtext</span>
              <input
                className={`${adminInput} ${fieldErrors.heroImageAlt ? adminInputError : ""}`}
                type="text"
                placeholder="Kurze Bildbeschreibung für Barrierefreiheit und SEO"
                value={input.heroImageAlt ?? ""}
                onChange={(e) =>
                  setInput((s) => ({
                    ...s,
                    heroImageAlt: e.target.value.trim() === "" ? null : e.target.value,
                  }))
                }
                disabled={disabledForm}
                aria-invalid={!!fieldErrors.heroImageAlt}
                aria-describedby={fieldErrors.heroImageAlt ? "err-hero-alt" : undefined}
              />
              {fieldErrors.heroImageAlt ? (
                <p id="err-hero-alt" className="text-xs text-red-600">
                  {fieldErrors.heroImageAlt}
                </p>
              ) : null}
            </label>
            {isLikelyHttpUrl(input.heroImageUrl ?? "") && !heroPreviewBroken ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin live preview
              <img
                src={input.heroImageUrl!.trim()}
                alt={input.heroImageAlt?.trim() || "Vorschau Titelbild"}
                className="h-40 w-full rounded-xl object-cover ring-1 ring-black/10"
                onError={() => setHeroPreviewBroken(true)}
              />
            ) : isLikelyHttpUrl(input.heroImageUrl ?? "") && heroPreviewBroken ? (
              <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-amber-200/80 bg-amber-50/60 px-4 text-center text-xs text-amber-950">
                Vorschau nicht möglich (URL blockiert, nicht gefunden oder kein Bild).
              </div>
            ) : (input.heroImageUrl ?? "").trim() !== "" ? (
              <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-black/15 bg-[var(--apple-bg-subtle)] px-4 text-center text-xs text-[var(--apple-text-secondary)]">
                Bitte eine gültige http(s)-URL eingeben, um die Vorschau zu sehen.
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-black/15 bg-[var(--apple-bg-subtle)] text-xs text-[var(--apple-text-tertiary)]">
                Noch kein Bild
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
