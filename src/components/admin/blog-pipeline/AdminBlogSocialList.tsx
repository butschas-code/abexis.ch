"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CMS_PATHS } from "@/admin/paths";
import { useCmsAuth } from "@/cms/auth/cms-auth-context";
import { apiListBlogSocialPostsForAdmin } from "@/cms/services/blog-automation-cms-api-client";
import type { BlogSocialListItem } from "@/cms/services/blog-pipeline-types";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageContainer, AdminPageHeader, AdminPageSection } from "@/components/admin/AdminPageContainer";
import { adminPanelInset, adminPill } from "@/components/admin/admin-ui";

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

  useEffect(() => {
    if (!ready || !user) return;
    let cancelled = false;
    void (async () => {
      try {
        const token = await user.getIdToken();
        const list = await apiListBlogSocialPostsForAdmin(token, 80);
        if (!cancelled) setRows(list);
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

  if (error) {
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
        description="LinkedIn- und X-Texte zum Abgleich mit dem jeweiligen Blog-Entwurf. Keine automatische Veröffentlichung."
      />
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
                <div className="mt-5 grid gap-6 lg:grid-cols-1">
                  <PostBlock label="LinkedIn" body={r.linkedinPost} />
                  <PostBlock label="LinkedIn (kurz)" body={r.shortLinkedinPost} />
                  <PostBlock label="X" body={r.xPost} />
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
