"use client";

import { useEffect, useState } from "react";
import { useCmsAuth } from "@/cms/auth/cms-auth-context";
import { apiListBlogTopicsForAdmin } from "@/cms/services/blog-automation-cms-api-client";
import type { BlogTopicListItem } from "@/cms/services/blog-pipeline-types";
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

export function AdminBlogTopicsList() {
  const { user, ready } = useCmsAuth();
  const [rows, setRows] = useState<BlogTopicListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !user) return;
    let cancelled = false;
    void (async () => {
      try {
        const token = await user.getIdToken();
        const list = await apiListBlogTopicsForAdmin(token);
        if (!cancelled) setRows(list);
      } catch {
        if (!cancelled) setError("Themen konnten nicht geladen werden.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, user]);

  if (!ready || !user) {
    return (
      <AdminPageContainer>
        <AdminLoading message="Themen werden geladen…" />
      </AdminPageContainer>
    );
  }

  if (error) {
    return (
      <AdminPageContainer>
        <AdminPageHeader title="Blog-Themen" description={error} />
      </AdminPageContainer>
    );
  }

  if (rows === null) {
    return (
      <AdminPageContainer>
        <AdminLoading message="Themen werden geladen…" />
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Blog-Themen"
        description="Übersicht automatischer Themen und Verarbeitungsstände. Neue Themen für die Warteschlange legen Sie benutzerfreundlich unter «Blog-Automation» an — dort steuern Sie auch Rhythmus und Freigabe."
      />
      <AdminPageSection>
        {rows.length === 0 ? (
          <AdminEmptyState
            title="Keine Themen"
            description="Wenn Sie Themen für automatische Entwürfe eintragen möchten, öffnen Sie «Blog-Automation» und fügen Sie dort Einträge zur Warteschlange hinzu."
          />
        ) : (
          <div className={adminTableWrap}>
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-black/[0.08] text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-text-tertiary)]">
                  <th className="py-3 pr-4 font-medium">Datum</th>
                  <th className="py-3 pr-4 font-medium">Titel</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 font-medium">Hinweis</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-black/[0.05] align-top last:border-0">
                    <td className="py-3 pr-4 text-[var(--apple-text-secondary)]">{formatWhen(r.createdAt)}</td>
                    <td className="py-3 pr-4">
                      <div className="font-medium text-[var(--apple-text)]">{r.title}</div>
                      {r.brief ? (
                        <div className="mt-1 max-w-xl text-xs leading-snug text-[var(--apple-text-secondary)]">{r.brief}</div>
                      ) : null}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={adminPill}>{r.status}</span>
                    </td>
                    <td className="py-3 text-xs text-[var(--apple-text-secondary)]">
                      {r.lastPipelineError ? (
                        <span className="text-red-800">{r.lastPipelineError}</span>
                      ) : r.lastDraftId ? (
                        <span>Draft-ID: {r.lastDraftId}</span>
                      ) : (
                        "—"
                      )}
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
