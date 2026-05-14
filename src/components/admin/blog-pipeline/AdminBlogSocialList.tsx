"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CMS_PATHS } from "@/admin/paths";
import { useCmsAuth } from "@/cms/auth/cms-auth-context";
import {
  apiListBlogSocialPostsForAdmin,
  apiSendBlogSocialPostToNuelink,
} from "@/cms/services/blog-automation-cms-api-client";
import type { BlogSocialListItem } from "@/cms/services/blog-pipeline-types";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageContainer, AdminPageHeader, AdminPageSection } from "@/components/admin/AdminPageContainer";
import {
  adminBtnPrimary,
  adminFeedbackError,
  adminFeedbackSuccess,
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
  const [busyId, setBusyId] = useState<string | null>(null);

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

  async function sendToNuelink(row: BlogSocialListItem) {
    if (!user) return;
    setBusyId(row.id);
    setError(null);
    setFlash(null);
    try {
      const token = await user.getIdToken();
      const { result } = await apiSendBlogSocialPostToNuelink(token, row.id, {
        target: "linkedin",
        caption: row.linkedinPost,
      });
      setFlash(`LinkedIn-Post wurde an Nuelink übergeben (${result.publishMode}).`);
      await loadRows(user);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nuelink-Verbindung fehlgeschlagen.");
    } finally {
      setBusyId(null);
    }
  }

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
              <article key={r.id} className={`rounded-2xl ${adminPanelInset} shadow-[0_1px_0_rgba(0,0,0,0.04)]`}>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] pb-4">
                  <div className="text-sm text-[var(--apple-text-secondary)]">
                    {formatWhen(r.createdAt)}
                    <span className="mx-2 text-[var(--apple-text-tertiary)]">·</span>
                    <span className={adminPill}>{r.status}</span>
                  </div>
                  <Link
                    href={CMS_PATHS.adminBlogPipelineDraft(r.blogDraftId)}
                    className="text-sm font-medium text-[var(--brand-900)] underline-offset-4 hover:underline"
                  >
                    Zugehöriger Blog-Entwurf
                  </Link>
                </div>
                {r.nuelinkLastSentAt ? (
                  <p className="mt-4 text-sm font-medium text-emerald-900">An Nuelink übergeben · {formatWhen(r.nuelinkLastSentAt)}</p>
                ) : null}
                <div className="mt-5 grid gap-6 lg:grid-cols-1">
                  <PostBlock label="LinkedIn" body={r.linkedinPost} />
                  <PostBlock label="LinkedIn (kurz)" body={r.shortLinkedinPost} />
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] pt-5">
                    <p className="max-w-xl text-sm leading-relaxed text-[var(--apple-text-secondary)]">
                      Sendet den LinkedIn-Text an die Abexis Collection «Global Queue» in Nuelink.
                    </p>
                    <button
                      type="button"
                      className={`${adminBtnPrimary} text-[13px]`}
                      disabled={busyId === r.id || !r.linkedinPost.trim()}
                      onClick={() => void sendToNuelink(r)}
                    >
                      {busyId === r.id ? "Wird übergeben…" : "LinkedIn an Nuelink"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </AdminPageSection>
    </AdminPageContainer>
  );
}

function PostBlock({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-text-tertiary)]">{label}</p>
      <textarea
        readOnly
        className="mt-2 min-h-[120px] w-full resize-y rounded-xl border border-black/[0.08] bg-[var(--apple-bg)] p-3 text-sm leading-relaxed text-[var(--apple-text)]"
        value={body}
      />
    </div>
  );
}
