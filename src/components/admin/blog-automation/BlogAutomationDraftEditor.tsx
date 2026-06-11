"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { CMS_PATHS } from "@/admin/paths";
import { useCmsAuth } from "@/cms/auth/cms-auth-context";
import type { BlogDraftEditableFields } from "@/cms/types/blog-draft-pipeline";
import { listMediaAssets, recordMediaAsset, type MediaAssetListItem } from "@/cms/services/media-client";
import {
  apiApproveBlogDraft,
  apiDeleteBlogDraft,
  apiGetBlogDraftForAdmin,
  apiListBlogSocialPostsForDraft,
  apiPublishBlogDraft,
  apiSearchBlogDraftUnsplash,
  apiSelectBlogDraftUnsplashPhoto,
  apiSendBackBlogDraft,
  apiUpdateBlogDraftFields,
} from "@/cms/services/blog-automation-cms-api-client";
import type { BlogDraftDetail, BlogSocialListItem, UnsplashPhotoBrief } from "@/cms/services/blog-pipeline-types";
import { listAuthorsForAdmin, type AuthorOption } from "@/cms/services/content-lookup-client";
import {
  adminBody,
  adminBtnGhost,
  adminBtnPrimary,
  adminBtnSecondary,
  adminFeedbackError,
  adminInput,
  adminPanel,
  adminSectionLabel,
} from "@/components/admin/admin-ui";
import { BlogAutomationDraftSocialPosts } from "@/components/admin/blog-automation/BlogAutomationDraftSocialPosts";
import { AdminFileUpload } from "@/components/admin/AdminFileUpload";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageContainer, AdminPageHeader, AdminPageSection } from "@/components/admin/AdminPageContainer";

type Props = { draftId: string };

type DraftFormState = {
  title: string;
  slug: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  articleHtml: string;
  researchSummary: string;
  sources: Array<{ title: string; url: string }>;
  heroImageAlt: string;
  heroImageCredit: string;
};

function mapDraftToForm(d: BlogDraftDetail): DraftFormState {
  return {
    title: d.title,
    slug: d.slug,
    excerpt: d.excerpt,
    metaTitle: d.metaTitle,
    metaDescription: d.metaDescription,
    articleHtml: d.articleHtml,
    researchSummary: d.researchSummary,
    sources: d.sources.length ? d.sources.map((s) => ({ ...s })) : [{ title: "", url: "" }],
    heroImageAlt: d.heroImageAlt ?? "",
    heroImageCredit: d.heroImageCredit ?? "",
  };
}

function friendlyDraftStatus(status: string): string {
  switch (status.trim()) {
    case "needs_review":
      return "Zur Freigabe";
    case "draft_created":
      return "Entwurf vorhanden";
    case "approved":
      return "Freigegeben";
    case "published":
      return "Veröffentlicht";
    case "failed":
      return "Benötigt Aufmerksamkeit";
    default:
      return status || "—";
  }
}

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("de-CH", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function BlogAutomationDraftEditor({ draftId }: Props) {
  const router = useRouter();
  const { user, ready: authReady } = useCmsAuth();
  const [draft, setDraft] = useState<BlogDraftDetail | null | undefined>(undefined);
  const [authors, setAuthors] = useState<AuthorOption[]>([]);
  const [authorId, setAuthorId] = useState("");
  const [form, setForm] = useState<DraftFormState | null>(null);
  const [socialRows, setSocialRows] = useState<BlogSocialListItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [unsplashQuery, setUnsplashQuery] = useState("");
  const [unsplashResults, setUnsplashResults] = useState<UnsplashPhotoBrief[]>([]);
  const [unsplashBusy, setUnsplashBusy] = useState(false);
  const [heroPickerOpen, setHeroPickerOpen] = useState(false);
  const [mediaRows, setMediaRows] = useState<MediaAssetListItem[]>([]);
  const [mediaBusy, setMediaBusy] = useState(false);

  const reload = useCallback(async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const [row, authRows, social] = await Promise.all([
        apiGetBlogDraftForAdmin(token, draftId),
        listAuthorsForAdmin(120),
        apiListBlogSocialPostsForDraft(token, draftId),
      ]);
      setDraft(row);
      setAuthors(authRows);
      setSocialRows(social);
      if (row) {
        setForm(mapDraftToForm(row));
        setUnsplashQuery(row.imageSearchQuery ?? "");
        setUnsplashResults([]);
        setAuthorId((prev) => {
          if (prev.trim()) return prev;
          return authRows[0]?.id ?? "";
        });
      } else {
        setForm(null);
        setUnsplashQuery("");
        setUnsplashResults([]);
        setMediaRows([]);
      }
    } catch {
      setDraft(null);
      setForm(null);
      setSocialRows([]);
      setUnsplashQuery("");
      setUnsplashResults([]);
      setMediaRows([]);
    }
  }, [draftId, user]);

  useEffect(() => {
    if (!authReady || !user) return;
    queueMicrotask(() => void reload());
  }, [reload, authReady, user]);

  const flashSuccess = useCallback((msg: string) => {
    setError(null);
    setSuccess(msg);
  }, []);

  const flashError = useCallback((msg: string) => {
    setSuccess(null);
    setError(msg);
  }, []);

  const readOnly = draft?.status === "published";

  const patchForm = useCallback((p: Partial<DraftFormState>) => {
    setForm((s) => (s ? { ...s, ...p } : s));
  }, []);

  const collectEditable = useCallback((): BlogDraftEditableFields => {
    if (!form) throw new Error("Formular nicht bereit.");
    return {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      metaTitle: form.metaTitle,
      metaDescription: form.metaDescription,
      articleHtml: form.articleHtml,
      researchSummary: form.researchSummary,
      sources: form.sources.filter((s) => s.title.trim() || s.url.trim()),
      heroImageAlt: form.heroImageAlt,
      heroImageCredit: form.heroImageCredit,
    };
  }, [form]);

  const persistDraftFields = useCallback(
    async (successMsg: string) => {
      if (!form || readOnly || !user) return;
      setBusy(true);
      setError(null);
      setSuccess(null);
      try {
        const token = await user.getIdToken();
        await apiUpdateBlogDraftFields(token, draftId, collectEditable());
        setSuccess(successMsg);
        await reload();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Speichern fehlgeschlagen.");
      } finally {
        setBusy(false);
      }
    },
    [collectEditable, draftId, form, readOnly, reload, user],
  );

  const onSave = useCallback(async () => {
    await persistDraftFields("Änderungen gespeichert.");
  }, [persistDraftFields]);

  const onSaveHeroFields = useCallback(async () => {
    await persistDraftFields("Gespeichert.");
  }, [persistDraftFields]);

  const onApprove = useCallback(async () => {
    if (!form || readOnly || !user) return;
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const token = await user.getIdToken();
      await apiUpdateBlogDraftFields(token, draftId, collectEditable());
      if (!authorId.trim()) {
        throw new Error("Bitte eine Autorin / einen Autor wählen, bevor der Entwurf freigegeben wird.");
      }
      const { result } = await apiApproveBlogDraft(token, draftId, {
        authorId,
        categoryIds: [],
        tags: [],
      });
      const scheduled = formatDateTime(result.scheduledFor);
      const nuelink = result.nuelinkSent
        ? " LinkedIn wurde an Nuelink übergeben."
        : result.nuelinkError
          ? ` Nuelink braucht noch Aufmerksamkeit: ${result.nuelinkError}`
          : "";
      setSuccess(`Freigegeben und als Beitrag für ${scheduled} geplant.${nuelink}`);
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Freigabe fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  }, [authorId, collectEditable, draftId, form, readOnly, reload, user]);

  const onSendBack = useCallback(async () => {
    if (readOnly || !user) return;
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const token = await user.getIdToken();
      await apiUpdateBlogDraftFields(token, draftId, collectEditable());
      await apiSendBackBlogDraft(token, draftId);
      setSuccess("Zurück an die Bearbeitung — Status: Zur Freigabe.");
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Zurücksetzen fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  }, [collectEditable, draftId, readOnly, reload, user]);

  const onPublish = useCallback(async () => {
    if (!form || readOnly || !user) return;
    if (!authorId.trim()) {
      setError("Bitte eine Autorin / einen Autor für den Beitrag wählen.");
      return;
    }
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const token = await user.getIdToken();
      await apiUpdateBlogDraftFields(token, draftId, collectEditable());
      const editable = collectEditable();
      const result = await apiPublishBlogDraft(token, draftId, {
        ...editable,
        authorId,
        categoryIds: [],
        tags: [],
      });
      let msg = `Der Beitrag ist live. Sie können ihn über «Beitrag öffnen und bearbeiten» anpassen.`;
      if (result.slugAdjusted) {
        msg += ` Der Slug «${result.slugUsed}» wurde vergeben, damit keine Kollision entsteht.`;
      }
      setSuccess(msg);
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Veröffentlichen fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  }, [authorId, collectEditable, draftId, form, readOnly, reload, user]);

  const onSearchUnsplash = useCallback(async () => {
    if (!user || readOnly) return;
    const q = unsplashQuery.trim();
    if (!q) {
      flashError("Bitte einen Suchbegriff eingeben.");
      return;
    }
    setUnsplashBusy(true);
    setSuccess(null);
    setError(null);
    try {
      const token = await user.getIdToken();
      const photos = await apiSearchBlogDraftUnsplash(token, draftId, q);
      setUnsplashResults(photos);
      if (!photos.length) flashError("Keine Treffer — anderen Begriff versuchen.");
    } catch (e) {
      flashError(e instanceof Error ? e.message : "Suche fehlgeschlagen.");
    } finally {
      setUnsplashBusy(false);
    }
  }, [draftId, flashError, readOnly, unsplashQuery, user]);

  const onPickUnsplash = useCallback(
    async (photoId: string) => {
      if (!user || readOnly) return;
      setUnsplashBusy(true);
      try {
        const token = await user.getIdToken();
        await apiSelectBlogDraftUnsplashPhoto(token, draftId, photoId, unsplashQuery.trim());
        flashSuccess("Bild wurde gewechselt.");
        setUnsplashResults([]);
        setHeroPickerOpen(false);
        await reload();
      } catch (e) {
        flashError(e instanceof Error ? e.message : "Auswahl fehlgeschlagen.");
      } finally {
        setUnsplashBusy(false);
      }
    },
    [draftId, flashError, flashSuccess, readOnly, reload, unsplashQuery, user],
  );

  const onRemoveHero = useCallback(async () => {
    if (!user || readOnly || !form) return;
    if (!window.confirm("Titelbild wirklich entfernen?")) return;
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const token = await user.getIdToken();
      await apiUpdateBlogDraftFields(token, draftId, { ...collectEditable(), heroImageClear: true });
      setSuccess("Titelbild entfernt.");
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Entfernen fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  }, [collectEditable, draftId, form, readOnly, reload, user]);

  const loadMedia = useCallback(async () => {
    setMediaBusy(true);
    try {
      const rows = await listMediaAssets(80);
      setMediaRows(rows.filter((row) => row.downloadUrl && row.mimeType.startsWith("image/")));
    } catch (e) {
      flashError(e instanceof Error ? e.message : "Medien konnten nicht geladen werden.");
    } finally {
      setMediaBusy(false);
    }
  }, [flashError]);

  const applyHeroImageUrl = useCallback(
    async (url: string, alt?: string, credit?: string) => {
      if (!user || readOnly || !form) return;
      setBusy(true);
      setError(null);
      setSuccess(null);
      try {
        const token = await user.getIdToken();
        await apiUpdateBlogDraftFields(token, draftId, {
          ...collectEditable(),
          heroImageUrl: url,
          heroImageAlt: alt ?? form.heroImageAlt,
          heroImageCredit: credit ?? form.heroImageCredit,
        });
        setSuccess("Titelbild aktualisiert. Das Social-Bild wurde mit angepasst.");
        setHeroPickerOpen(false);
        await reload();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Bild konnte nicht gespeichert werden.");
      } finally {
        setBusy(false);
      }
    },
    [collectEditable, draftId, form, readOnly, reload, user],
  );

  const onHeroUpload = useCallback(
    async (url: string, meta: { storagePath: string; file: File }) => {
      try {
        await recordMediaAsset({
          storagePath: meta.storagePath,
          downloadUrl: url,
          originalFileName: meta.file.name,
          mimeType: meta.file.type || "image/jpeg",
          sizeBytes: meta.file.size,
          kind: "hero",
          source: "blog_automation_draft",
        });
      } catch {
        /* Image is still usable even if media metadata registration fails. */
      }
      await applyHeroImageUrl(url, form?.heroImageAlt || meta.file.name.replace(/\.[^.]+$/, ""), "");
    },
    [applyHeroImageUrl, form?.heroImageAlt],
  );

  const onDelete = useCallback(async () => {
    if (!user) return;
    const isPublished = draft?.status === "published";
    const msg = isPublished
      ? "Diesen Entwurf löschen? Der bereits veröffentlichte Blogbeitrag bleibt bestehen."
      : "Diesen Entwurf endgültig löschen?";
    if (!window.confirm(msg)) return;
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const token = await user.getIdToken();
      await apiDeleteBlogDraft(token, draftId);
      router.push(CMS_PATHS.adminBlogAutomationDrafts);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Löschen fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  }, [draft?.status, draftId, router, user]);

  const addSource = useCallback(() => {
    setForm((s) => (s ? { ...s, sources: [...s.sources, { title: "", url: "" }] } : s));
  }, []);

  const removeSource = useCallback((index: number) => {
    setForm((s) => {
      if (!s) return s;
      const next = s.sources.filter((_, i) => i !== index);
      return { ...s, sources: next.length ? next : [{ title: "", url: "" }] };
    });
  }, []);

  if (!authReady || !user) {
    return (
      <AdminPageContainer>
        <AdminLoading message="Entwurf wird geladen…" />
      </AdminPageContainer>
    );
  }

  if (draft === undefined) {
    return (
      <AdminPageContainer>
        <AdminLoading message="Entwurf wird geladen…" />
      </AdminPageContainer>
    );
  }

  if (draft === null || form === null) {
    return (
      <AdminPageContainer>
        <AdminPageHeader title="Entwurf" description="Dieser Entwurf wurde nicht gefunden." />
        <Link href={CMS_PATHS.adminBlogAutomationDrafts} className="text-sm font-medium text-[var(--brand-900)] underline-offset-4 hover:underline">
          Zurück zur Liste
        </Link>
      </AdminPageContainer>
    );
  }

  const canApprove = !readOnly && draft.status !== "approved";
  const canSendBack = !readOnly && draft.status === "approved";
  const canPublish = !readOnly;

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title={draft.title || "Entwurf"}
        description={`Status: ${friendlyDraftStatus(draft.status)} · «Freigeben» erstellt den geplanten Beitrag und übergibt LinkedIn an Nuelink.`}
      />

      <p className={`${adminBody} -mt-4 mb-6`}>
        <Link href={CMS_PATHS.adminBlogAutomationDrafts} className="font-medium text-[var(--brand-900)] underline-offset-4 hover:underline">
          ← Alle Entwürfe
        </Link>
        {" · "}
        <Link href={CMS_PATHS.adminBlogAutomation} className="font-medium text-[var(--brand-900)] underline-offset-4 hover:underline">
          Blog-Automation
        </Link>
      </p>

      {draft.publishedPostId ? (
        <div className="mb-6 rounded-xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-[14px] text-emerald-950">
          {draft.status === "published" ? "Veröffentlichter" : "Geplanter"} Blogbeitrag
          {draft.publishedAt ? ` (${formatDateTime(draft.publishedAt)})` : ""}:{" "}
          <Link href={CMS_PATHS.adminPostEdit(draft.publishedPostId)} className="font-semibold underline-offset-2 hover:underline">
            Beitrag öffnen und bearbeiten
          </Link>
        </div>
      ) : null}

      {readOnly ? (
        <div className="mb-6 rounded-xl border border-black/[0.08] bg-white/90 px-4 py-3 text-[14px] text-[var(--apple-text-secondary)]">
          Dieser Entwurf ist schreibgeschützt, weil er bereits veröffentlicht wurde. Änderungen am Live-Text nehmen Sie im normalen Beitrags-Editor vor.
        </div>
      ) : null}

      {error ? <div className={`${adminFeedbackError} mb-4`}>{error}</div> : null}
      {success ? (
        <div className="mb-4 rounded-[1rem] border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-[14px] text-emerald-950">{success}</div>
      ) : null}

      <AdminPageSection>
        <div className={`flex flex-wrap gap-2 ${readOnly ? "opacity-60" : ""}`}>
          <button type="button" className={`${adminBtnSecondary} text-[13px]`} disabled={busy || readOnly} onClick={() => void onSave()}>
            Änderungen speichern
          </button>
          {canApprove ? (
            <button type="button" className={`${adminBtnSecondary} text-[13px]`} disabled={busy || readOnly} onClick={() => void onApprove()}>
              Freigeben & planen
            </button>
          ) : null}
          {canSendBack ? (
            <button type="button" className={`${adminBtnGhost} text-[13px]`} disabled={busy || readOnly} onClick={() => void onSendBack()}>
              Zurück zur Bearbeitung
            </button>
          ) : null}
          {canPublish ? (
            <button type="button" className={`${adminBtnPrimary} text-[13px]`} disabled={busy || readOnly} onClick={() => void onPublish()}>
              Sofort veröffentlichen
            </button>
          ) : null}
        </div>
        <div className="mt-3">
          <button type="button" className={`${adminBtnGhost} text-[13px] text-red-700 hover:border-red-300`} disabled={busy} onClick={() => void onDelete()}>
            Löschen
          </button>
        </div>

        {!readOnly ? (
          <div className="mt-4 max-w-md">
            <label className="block space-y-2">
              <span className="text-[14px] font-medium text-[var(--apple-text)]">Autor für Veröffentlichung</span>
              <select className={adminInput} value={authorId} onChange={(e) => setAuthorId(e.target.value)}>
                <option value="">Bitte wählen…</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
              <span className={`${adminBody} text-[13px]`}>Pflichtfeld für «Freigeben & planen» und «Sofort veröffentlichen».</span>
            </label>
          </div>
        ) : null}
      </AdminPageSection>

      <AdminPageSection>
        <h2 className={adminSectionLabel}>Titelbild</h2>
        <div className={`space-y-6 ${adminPanel} p-6 sm:p-8`}>
          {draft.heroImageUrl ? (
            <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-black/[0.02]">
              {/* eslint-disable-next-line @next/next/no-img-element -- CMS preview */}
              <img
                src={draft.heroImageUrl}
                alt={form.heroImageAlt || "Titelbild"}
                className="max-h-[min(520px,68vh)] w-full object-cover object-center"
              />
            </div>
          ) : (
            <div
              className={`flex max-w-[880px] min-h-[140px] items-center justify-center rounded-2xl border border-dashed border-black/[0.12] bg-black/[0.02] px-6 py-12 ${adminBody} text-[15px] text-[var(--apple-text-secondary)]`}
            >
              Noch kein Bild gewählt.
            </div>
          )}

          <p className={`max-w-xl ${adminBody} text-[14px] text-[var(--apple-text-secondary)]`}>
            Vorschlag passend zum Artikelthema.
          </p>

          {!readOnly ? (
            <button
              type="button"
              className={`${adminBtnSecondary} text-[13px]`}
              disabled={busy}
              onClick={() => setHeroPickerOpen((open) => !open)}
            >
              {heroPickerOpen ? "Auswahl schließen" : "Bild ändern"}
            </button>
          ) : null}

          {!readOnly && heroPickerOpen ? (
            <div className="max-w-3xl space-y-4 rounded-2xl border border-black/[0.06] bg-[color-mix(in_srgb,var(--apple-bg-subtle)_40%,white)] p-5 sm:p-6">
              <label className="block space-y-2">
                <span className="text-[14px] font-medium text-[var(--apple-text)]">Suchbegriffe</span>
                <div className="flex flex-wrap gap-2">
                  <input
                    className={`${adminInput} min-w-[200px] flex-1`}
                    value={unsplashQuery}
                    onChange={(e) => setUnsplashQuery(e.target.value)}
                    placeholder="Stichwörter eingeben"
                  />
                  <button
                    type="button"
                    className={`${adminBtnSecondary} shrink-0 text-[13px]`}
                    disabled={busy || unsplashBusy}
                    onClick={() => void onSearchUnsplash()}
                  >
                    {unsplashBusy ? "Suche läuft …" : "Suchen"}
                  </button>
                </div>
              </label>

              {unsplashResults.length ? (
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {unsplashResults.map((ph) => (
                    <li key={ph.id} className="flex flex-col gap-2 rounded-xl border border-black/[0.06] bg-white p-3 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={ph.urls.small} alt="" className="aspect-video w-full rounded-lg object-cover" />
                      <button
                        type="button"
                        className={`${adminBtnPrimary} w-full text-[13px]`}
                        disabled={unsplashBusy || busy}
                        onClick={() => void onPickUnsplash(ph.id)}
                      >
                        Auswählen
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="border-t border-black/[0.06] pt-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[14px] font-medium text-[var(--apple-text)]">Eigenes Bild</p>
                    <p className={`${adminBody} mt-1 text-[13px]`}>Hochladen oder aus der Medienbibliothek wählen.</p>
                  </div>
                  <AdminFileUpload
                    path={`cms/media/blog-drafts/${draftId}/`}
                    accept="image/*"
                    label="Bild hochladen"
                    onUploadSuccess={(url, meta) => void onHeroUpload(url, meta)}
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={`${adminBtnGhost} text-[13px]`}
                    disabled={mediaBusy}
                    onClick={() => void loadMedia()}
                  >
                    {mediaBusy ? "Medien werden geladen …" : "Medienbibliothek anzeigen"}
                  </button>
                </div>
                {mediaRows.length ? (
                  <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {mediaRows.map((asset) => (
                      <li key={asset.id} className="flex flex-col gap-2 rounded-xl border border-black/[0.06] bg-white p-3 shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={asset.downloadUrl} alt="" className="aspect-video w-full rounded-lg object-cover" />
                        <p className="truncate text-[12px] text-[var(--apple-text-tertiary)]">{asset.originalFileName || "Medienbild"}</p>
                        <button
                          type="button"
                          className={`${adminBtnPrimary} w-full text-[13px]`}
                          disabled={busy}
                          onClick={() => void applyHeroImageUrl(asset.downloadUrl, form.heroImageAlt || asset.originalFileName.replace(/\.[^.]+$/, ""), "")}
                        >
                          Verwenden
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="max-w-xl space-y-5 border-t border-black/[0.06] pt-6">
            <label className="block space-y-2">
              <span className="text-[14px] font-medium text-[var(--apple-text)]">Alternativtext</span>
              <textarea
                className={`${adminInput} min-h-[80px]`}
                readOnly={readOnly}
                value={form.heroImageAlt}
                onChange={(e) => patchForm({ heroImageAlt: e.target.value })}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-[14px] font-medium text-[var(--apple-text)]">Bildnachweis</span>
              <textarea
                className={`${adminInput} min-h-[72px]`}
                readOnly={readOnly}
                value={form.heroImageCredit}
                onChange={(e) => patchForm({ heroImageCredit: e.target.value })}
                placeholder="z. B. Foto: Name auf Anbieter"
              />
            </label>

            {!readOnly ? (
              <div className="flex flex-wrap gap-2 pt-1">
                <button type="button" className={`${adminBtnPrimary} text-[13px]`} disabled={busy} onClick={() => void onSaveHeroFields()}>
                  Speichern
                </button>
                <button
                  type="button"
                  className={`${adminBtnGhost} text-[13px]`}
                  disabled={busy || !draft.heroImageUrl}
                  onClick={() => void onRemoveHero()}
                >
                  Bild entfernen
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </AdminPageSection>

      <AdminPageSection>
        <h2 className={adminSectionLabel}>Metadaten</h2>
        <div className={`grid gap-4 ${adminPanel} p-6 sm:p-7 md:grid-cols-2`}>
          <label className="block space-y-2 md:col-span-2">
            <span className="text-[14px] font-medium text-[var(--apple-text)]">Titel</span>
            <input className={adminInput} readOnly={readOnly} value={form.title} onChange={(e) => patchForm({ title: e.target.value })} />
          </label>
          <label className="block space-y-2">
            <span className="text-[14px] font-medium text-[var(--apple-text)]">Slug (URL)</span>
            <input className={adminInput} readOnly={readOnly} value={form.slug} onChange={(e) => patchForm({ slug: e.target.value })} />
          </label>
          <label className="block space-y-2 md:col-span-2">
            <span className="text-[14px] font-medium text-[var(--apple-text)]">Teaser / Auszug</span>
            <textarea className={`${adminInput} min-h-[72px]`} readOnly={readOnly} value={form.excerpt} onChange={(e) => patchForm({ excerpt: e.target.value })} />
          </label>
          <label className="block space-y-2">
            <span className="text-[14px] font-medium text-[var(--apple-text)]">SEO-Titel</span>
            <input className={adminInput} readOnly={readOnly} value={form.metaTitle} onChange={(e) => patchForm({ metaTitle: e.target.value })} />
          </label>
          <label className="block space-y-2">
            <span className="text-[14px] font-medium text-[var(--apple-text)]">SEO-Beschreibung</span>
            <textarea className={`${adminInput} min-h-[72px]`} readOnly={readOnly} value={form.metaDescription} onChange={(e) => patchForm({ metaDescription: e.target.value })} />
          </label>
        </div>
      </AdminPageSection>

      <AdminPageSection>
        <BlogAutomationDraftSocialPosts
          rows={socialRows}
          onRefresh={reload}
          onFlashSuccess={flashSuccess}
          onFlashError={flashError}
        />
      </AdminPageSection>

      <AdminPageSection>
        <h2 className={adminSectionLabel}>Recherche</h2>
        <div className={`space-y-4 ${adminPanel} p-6 sm:p-7`}>
          <label className="block space-y-2">
            <span className="text-[14px] font-medium text-[var(--apple-text)]">Zusammenfassung</span>
            <textarea className={`${adminInput} min-h-[120px]`} readOnly={readOnly} value={form.researchSummary} onChange={(e) => patchForm({ researchSummary: e.target.value })} />
          </label>
          <div>
            <span className="mb-2 block text-[14px] font-medium text-[var(--apple-text)]">Quellen</span>
            <div className="space-y-3">
              {form.sources.map((s, i) => (
                <div key={i} className="flex flex-col gap-2 rounded-lg border border-black/[0.06] bg-white/80 p-3 md:flex-row md:items-end">
                  <label className="min-w-0 flex-1 space-y-1">
                    <span className={`${adminBody} text-[12px]`}>Titel</span>
                    <input
                      className={adminInput}
                      readOnly={readOnly}
                      value={s.title}
                      onChange={(e) => {
                        const next = [...form.sources];
                        next[i] = { ...next[i], title: e.target.value };
                        patchForm({ sources: next });
                      }}
                    />
                  </label>
                  <label className="min-w-0 flex-[2] space-y-1">
                    <span className={`${adminBody} text-[12px]`}>URL</span>
                    <input
                      className={adminInput}
                      readOnly={readOnly}
                      value={s.url}
                      onChange={(e) => {
                        const next = [...form.sources];
                        next[i] = { ...next[i], url: e.target.value };
                        patchForm({ sources: next });
                      }}
                    />
                  </label>
                  {!readOnly ? (
                    <button type="button" className={`${adminBtnGhost} shrink-0 text-[12px]`} onClick={() => removeSource(i)}>
                      Entfernen
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
            {!readOnly ? (
              <button type="button" className={`${adminBtnGhost} mt-3 text-[13px]`} onClick={addSource}>
                Quelle hinzufügen
              </button>
            ) : null}
          </div>
        </div>
      </AdminPageSection>

      <AdminPageSection>
        <h2 className={adminSectionLabel}>Artikel (HTML)</h2>
        <textarea
          readOnly={readOnly}
          className="h-[min(55vh,560px)] w-full resize-y rounded-xl border border-black/[0.1] bg-white p-4 font-mono text-xs leading-relaxed text-[var(--apple-text)] shadow-inner"
          value={form.articleHtml}
          onChange={(e) => patchForm({ articleHtml: e.target.value })}
        />
      </AdminPageSection>

      {draft.openaiResponseId ? (
        <AdminPageSection>
          <p className={`${adminBody} text-[13px] text-[var(--apple-text-tertiary)]`}>
            Referenz für Support-Anfragen:{" "}
            <span className="font-mono text-[12px]">{draft.openaiResponseId}</span>
          </p>
        </AdminPageSection>
      ) : null}
    </AdminPageContainer>
  );
}
