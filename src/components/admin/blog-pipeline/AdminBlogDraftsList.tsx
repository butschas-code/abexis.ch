"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CMS_PATHS } from "@/admin/paths";
import { useCmsAuth } from "@/cms/auth/cms-auth-context";
import { apiListBlogDraftsForAdmin } from "@/cms/services/blog-automation-cms-api-client";
import type { BlogDraftListItem } from "@/cms/services/blog-pipeline-types";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageContainer, AdminPageHeader, AdminPageSection } from "@/components/admin/AdminPageContainer";
import { adminPill, adminTableWrap } from "@/components/admin/admin-ui";

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

export function AdminBlogDraftsList() {
  const { user, ready } = useCmsAuth();
  const [rows, setRows] = useState<BlogDraftListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !user) return;
    let cancelled = false;
    void (async () => {
      try {
        const token = await user.getIdToken();
        const list = await apiListBlogDraftsForAdmin(token, 80);
        if (!cancelled) setRows(list);
      } catch {
        if (!cancelled) setError("Entwürfe konnten nicht geladen werden.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, user]);

  if (!ready || !user) {
    return (
      <AdminPageContainer>
        <AdminLoading message="Entwürfe werden geladen…" />
      </AdminPageContainer>
    );
  }

  if (error) {
    return (
      <AdminPageContainer>
        <AdminPageHeader title="Blog (KI-Entwürfe)" description={error} />
      </AdminPageContainer>
    );
  }

  if (rows === null) {
    return (
      <AdminPageContainer>
        <AdminLoading message="Entwürfe werden geladen…" />
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Blog (KI-Entwürfe)"
        description="Automatisch erzeugte Artikelentwürfe zur redaktionellen Freigabe. Es erfolgt keine automatische Publikation."
      />
      <AdminPageSection>
        {rows.length === 0 ? (
          <AdminEmptyState
            title="Keine Entwürfe"
            description='Neue Einträge entstehen, wenn ein `blogTopics`-Dokument mit Status `queued` durch den Cron verarbeitet wird.'
          />
        ) : (
          <div className={adminTableWrap}>
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-black/[0.08] text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-text-tertiary)]">
                  <th className="py-3 pr-4 font-medium">Datum</th>
                  <th className="py-3 pr-4 font-medium">Titel</th>
                  <th className="py-3 pr-4 font-medium">Slug</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 font-medium"> </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-black/[0.05] last:border-0">
                    <td className="py-3 pr-4 align-top text-[var(--apple-text-secondary)]">{formatWhen(r.createdAt)}</td>
                    <td className="py-3 pr-4 align-top font-medium text-[var(--apple-text)]">{r.title}</td>
                    <td className="py-3 pr-4 align-top font-mono text-xs text-[var(--apple-text-secondary)]">{r.slug}</td>
                    <td className="py-3 pr-4 align-top">
                      <span className={adminPill}>{r.status}</span>
                    </td>
                    <td className="py-3 align-top text-right">
                      <Link
                        href={CMS_PATHS.adminBlogPipelineDraft(r.id)}
                        className="text-sm font-medium text-[var(--brand-900)] underline-offset-4 hover:underline"
                      >
                        Öffnen
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminPageSection>
    </AdminPageContainer>
  );
}
