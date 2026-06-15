"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CMS_PATHS } from "@/admin/paths";
import { useCmsAuth } from "@/cms/auth/cms-auth-context";
import {
  apiListBlogSocialPostsForAdmin,
  apiPatchBlogSocialPost,
  apiSendBlogSocialPostToNuelink,
} from "@/cms/services/blog-automation-cms-api-client";
import type { BlogSocialListItem } from "@/cms/services/blog-pipeline-types";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageContainer, AdminPageHeader, AdminPageSection } from "@/components/admin/AdminPageContainer";
import {
  adminBtnPrimary,
  adminBtnSecondary,
  adminFeedbackError,
  adminFeedbackSuccess,
  adminInput,
  adminPanelInset,
  adminPill,
} from "@/components/admin/admin-ui";

function formatWhen(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("de-CH", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

export function AdminBlogSocialList() {
  const { user, ready } = useCmsAuth();
  const [rows, setRows] = useState<BlogSocialListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  async function loadRows(currentUser: typeof user) {
    if (!currentUser) return;
    const token = await currentUser.getIdToken();
    const list = await apiListBlogSocialPostsForAdmin(token, 80);
    setRows(list);
  }

  useEffect(() => {
    if (!ready || !user) return;
    let cancelled = false;
    void (async () => {
      try {
        const token = await user.getIdToken();
        const list = await apiListBlogSocialPostsForAdmin(token, 80);
        if (!cancelled) {
          setRows(list);
          setError(null);
        }
      } catch {
        if (!cancelled) setError("Social-Entwürfe konnten nicht geladen werden.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, user]);

  if (!ready || !user) {
    return (
      <AdminPageContainer>
        <AdminLoading message="Social-Entwürfe werden geladen…" />
      </AdminPageContainer>
    );
  }

  if (error && rows === null) {
    return (
      <AdminPageContainer>
        <AdminPageHeader title="Social (KI)" description={error} />
      </AdminPageContainer>
    );
  }

  if (rows === null) {
    return (
      <AdminPageContainer>
        <AdminLoading message="Social-Entwürfe werden geladen…" />
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Social (KI)"
        description="LinkedIn-Texte für Daniel Sengstags Profil prüfen und an Nuelink übergeben."
      />
      {flash ? <div className={adminFeedbackSuccess}>{flash}</div> : null}
      {error ? <div className={adminFeedbackError}>{error}</div> : null}
      <AdminPageSection>
        {rows.length === 0 ? (
          <AdminEmptyState title="Keine Social-Entwürfe" description="Entstehen zusammen mit einem neuen KI-Blogentwurf nach Cron-Lauf." />
        ) : (
          <div className="space-y-10">
            {rows.map((r) => (
              <SocialRowCard
                key={r.id}
                row={r}
                onRefresh={() => loadRows(user)}
                onError={setError}
                onFlash={setFlash}
              />
            ))}
          </div>
        )}
      </AdminPageSection>
    </AdminPageContainer>
  );
}

function SocialRowCard(props: {
  row: BlogSocialListItem;
  onRefresh: () => Promise<void>;
  onFlash: (message: string | null) => void;
  onError: (message: string | null) => void;
}) {
  const { row, onRefresh, onFlash, onError } = props;
  const { user } = useCmsAuth();
  const [linkedinPost, setLinkedinPost] = useState(row.linkedinPost);
  const [socialImageUrl, setSocialImageUrl] = useState(row.socialImageUrl ?? "");
  const [socialImageAlt, setSocialImageAlt] = useState(row.socialImageAlt ?? "");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setLinkedinPost(row.linkedinPost);
      setSocialImageUrl(row.socialImageUrl ?? "");
      setSocialImageAlt(row.socialImageAlt ?? "");
    });
  }, [row.id, row.linkedinPost, row.socialImageUrl, row.socialImageAlt]);

  async function save() {
    if (!user) return;
    setBusy(true);
    onError(null);
    onFlash(null);
    try {
      const token = await user.getIdToken();
      const imageUrl = socialImageUrl.trim();
      const inheritedBlogImage =
        !row.socialImageManualOverride && !!row.blogHeroImageUrl && imageUrl === row.blogHeroImageUrl;
      await apiPatchBlogSocialPost(token, row.id, {
        linkedinPost,
        socialImageUrl: inheritedBlogImage ? null : imageUrl || null,
        socialImageAlt: inheritedBlogImage ? null : socialImageAlt.trim() || null,
      });
      onFlash("LinkedIn-Post gespeichert.");
      await onRefresh();
    } catch (e) {
      onError(e instanceof Error ? e.message : "Speichern fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  }

  async function applyBlogImage() {
    if (!user) return;
    setBusy(true);
    onError(null);
    onFlash(null);
    try {
      const token = await user.getIdToken();
      await apiPatchBlogSocialPost(token, row.id, {
        socialImageUrl: null,
        socialImageAlt: null,
      });
      onFlash("LinkedIn verwendet wieder das Blogbild.");
      await onRefresh();
    } catch (e) {
      onError(e instanceof Error ? e.message : "Bild konnte nicht übernommen werden.");
    } finally {
      setBusy(false);
    }
  }

  async function sendToNuelink() {
    if (!user) return;
    setBusy(true);
    onError(null);
    onFlash(null);
    try {
      const token = await user.getIdToken();
      const { result } = await apiSendBlogSocialPostToNuelink(token, row.id, {
        target: "linkedin",
        caption: linkedinPost,
        socialImageUrl: socialImageUrl.trim() || null,
        socialImageAlt: socialImageAlt.trim() || null,
      });
      onFlash(`LinkedIn-Post wurde an Nuelink übergeben (${result.publishMode}).`);
      await onRefresh();
    } catch (e) {
      onError(e instanceof Error ? e.message : "Nuelink-Verbindung fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className={`rounded-2xl ${adminPanelInset} shadow-[0_1px_0_rgba(0,0,0,0.04)]`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] pb-4">
        <div className="text-sm text-[var(--apple-text-secondary)]">
          {formatWhen(row.createdAt)}
          <span className="mx-2 text-[var(--apple-text-tertiary)]">·</span>
          <span className={adminPill}>{row.status}</span>
        </div>
        <Link
          href={CMS_PATHS.adminBlogPipelineDraft(row.blogDraftId)}
          className="text-sm font-medium text-[var(--brand-900)] underline-offset-4 hover:underline"
        >
          Zugehöriger Blog-Entwurf
        </Link>
      </div>
      {row.nuelinkLastSentAt ? (
        <p className="mt-4 text-sm font-medium text-emerald-900">An Nuelink übergeben · {formatWhen(row.nuelinkLastSentAt)}</p>
      ) : null}
      <div className="mt-5 grid gap-6">
        <PostBlock label="LinkedIn" body={linkedinPost} onChange={setLinkedinPost} />
        <div className="grid gap-4 rounded-xl border border-black/[0.06] bg-white/70 p-4 md:grid-cols-[minmax(220px,320px)_1fr]">
          <div className="overflow-hidden rounded-lg border border-black/[0.08] bg-[var(--apple-bg-subtle)]">
            {socialImageUrl.trim() ? (
              // eslint-disable-next-line @next/next/no-img-element -- CMS preview for editor-selected remote image URL
              <img src={socialImageUrl} alt={socialImageAlt || ""} className="aspect-[1.91/1] h-full w-full object-cover" />
            ) : (
              <div className="flex aspect-[1.91/1] items-center justify-center px-4 text-center text-sm text-[var(--apple-text-secondary)]">
                Kein LinkedIn-Bild ausgewählt
              </div>
            )}
          </div>
          <div className="space-y-3">
            {row.socialImageManualOverride && row.blogHeroImageUrl && row.socialImageUrl !== row.blogHeroImageUrl ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-amber-950">
                Dieses LinkedIn-Bild weicht vom Blogbild ab.
                <div className="mt-3">
                  <button type="button" className={`${adminBtnSecondary} text-[13px]`} disabled={busy} onClick={() => void applyBlogImage()}>
                    Blogbild übernehmen
                  </button>
                </div>
              </div>
            ) : row.blogHeroImageUrl ? (
              <p className="text-[13px] leading-relaxed text-[var(--apple-text-secondary)]">
                LinkedIn verwendet das Blogbild, solange hier kein eigenes Bild gespeichert wird.
              </p>
            ) : null}
            <label className="block space-y-1.5">
              <span className="text-[13px] font-medium text-[var(--apple-text)]">Bild-URL für LinkedIn</span>
              <input className={adminInput} value={socialImageUrl} onChange={(e) => setSocialImageUrl(e.target.value)} placeholder="https://…" />
            </label>
            <label className="block space-y-1.5">
              <span className="text-[13px] font-medium text-[var(--apple-text)]">Alt-Text</span>
              <input className={adminInput} value={socialImageAlt} onChange={(e) => setSocialImageAlt(e.target.value)} />
            </label>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] pt-5">
          <p className="max-w-xl text-sm leading-relaxed text-[var(--apple-text-secondary)]">
            Sendet Text, Blog-Link und Bild an die Abexis Collection «Global Queue» in Nuelink.
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={`${adminBtnSecondary} text-[13px]`} disabled={busy} onClick={() => void save()}>
              Speichern
            </button>
            <button
              type="button"
              className={`${adminBtnPrimary} text-[13px]`}
              disabled={busy || !linkedinPost.trim()}
              onClick={() => void sendToNuelink()}
            >
              {busy ? "Wird verarbeitet…" : "LinkedIn an Nuelink"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function PostBlock({ label, body, onChange }: { label: string; body: string; onChange: (value: string) => void }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-text-tertiary)]">{label}</p>
      <textarea
        className="mt-2 min-h-[180px] w-full resize-y rounded-xl border border-black/[0.08] bg-[var(--apple-bg)] p-3 text-sm leading-relaxed text-[var(--apple-text)]"
        value={body}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
