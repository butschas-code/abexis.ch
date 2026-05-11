"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { CMS_PATHS } from "@/admin/paths";
import { useCmsAuth } from "@/cms/auth/cms-auth-context";
import { apiListBlogDraftsForAdmin } from "@/cms/services/blog-automation-cms-api-client";
import type { BlogDraftListItem } from "@/cms/services/blog-pipeline-types";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageContainer, AdminPageHeader } from "@/components/admin/AdminPageContainer";
import { adminPill, adminTableWrap, adminBody } from "@/components/admin/admin-ui";

type DraftTab = "review" | "approved" | "published" | "attention";

const TABS: { key: DraftTab; label: string }[] = [
  { key: "review", label: "Zur Freigabe" },
  { key: "approved", label: "Freigegeben" },
  { key: "published", label: "Veröffentlicht" },
  { key: "attention", label: "Benötigt Aufmerksamkeit" },
];

function statusesForTab(tab: DraftTab): Set<string> | null {
  switch (tab) {
    case "review":
      return null;
    case "approved":
      return new Set(["approved"]);
    case "published":
      return new Set(["published"]);
    case "attention":
      return new Set(["failed"]);
    default:
      return new Set();
  }
}

const TAB_EMPTY: Record<DraftTab, { title: string; description: string }> = {
  review: {
    title: "Keine Entwürfe in dieser Rubrik",
    description:
      "Neue Entwürfe erscheinen hier nach dem nächsten geplanten Schreibtag. Prüfen Sie in der Blog-Automation, ob die Automatisierung eingeschaltet und Themen oder KI-Vorschläge aktiv sind.",
  },
  approved: {
    title: "Noch keine freigegebenen Entwürfe",
    description: "Wenn Sie einen Entwurf freigeben, finden Sie ihn hier wieder.",
  },
  published: {
    title: "Noch keine veröffentlichten Entwürfe aus dieser Übersicht",
    description: "Nach der Veröffentlichung eines KI-Entwurfs erscheint er in diesem Tab.",
  },
  attention: {
    title: "Nichts markiert",
    description: "Es gibt aktuell keine Entwürfe, die besondere Aufmerksamkeit brauchen.",
  },
};

function rowMatchesTab(row: BlogDraftListItem, tab: DraftTab): boolean {
  const allow = statusesForTab(tab);
  if (allow === null) {
    return row.status !== "approved" && row.status !== "published" && row.status !== "failed";
  }
  return allow.has(row.status);
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

export function BlogAutomationDraftsList() {
  const { user, ready } = useCmsAuth();
  const [rows, setRows] = useState<BlogDraftListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<DraftTab>("review");

  useEffect(() => {
    if (!ready || !user) return;
    let cancelled = false;
    void (async () => {
      try {
        const token = await user.getIdToken();
        const list = await apiListBlogDraftsForAdmin(token, 160);
        if (!cancelled) setRows(list);
      } catch {
        if (!cancelled) setError("Die Liste konnte nicht geladen werden. Bitte versuchen Sie es später erneut.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, user]);

  const filtered = useMemo(() => {
    if (!rows) return [];
    return rows.filter((r) => rowMatchesTab(r, tab));
  }, [rows, tab]);

  const tabCount = useCallback(
    (t: DraftTab) => {
      if (!rows) return 0;
      return rows.filter((r) => rowMatchesTab(r, t)).length;
    },
    [rows],
  );

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
        <AdminPageHeader title="KI-Entwürfe" description={error} />
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
        title="KI-Entwürfe"
        description="Prüfen, bearbeiten und bei Bedarf als normalen Blogbeitrag veröffentlichen. Die Veröffentlichung erfolgt nur, wenn Sie unten auf «Veröffentlichen» klicken."
      />

      <p className={`mb-6 ${adminBody}`}>
        <Link href={CMS_PATHS.adminBlogAutomation} className="font-medium text-[var(--brand-900)] underline-offset-4 hover:underline">
          ← Blog-Automation
        </Link>
      </p>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-black/[0.06] pb-4">
        {TABS.map((t) => {
          const count = tabCount(t.key);
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-2 text-[13px] font-medium transition ${
                active
                  ? "bg-[var(--brand-900)] text-white shadow-sm"
                  : "border border-black/[0.08] bg-white/90 text-[var(--apple-text)] hover:border-black/14"
              }`}
            >
              {t.label}
              <span className={`ml-2 tabular-nums ${active ? "text-white/80" : "text-[var(--apple-text-secondary)]"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {rows.length === 0 ? (
        <AdminEmptyState
          title="Noch keine KI-Entwürfe"
          description="Neue Entwürfe erscheinen hier nach dem nächsten geplanten Schreibtag, sobald die Automatisierung aktiv ist und Themen oder Vorschläge vorliegen."
          action={{ label: "Blog-Automation öffnen", href: CMS_PATHS.adminBlogAutomation }}
        />
      ) : filtered.length === 0 ? (
        <AdminEmptyState title={TAB_EMPTY[tab].title} description={TAB_EMPTY[tab].description} />
      ) : (
        <div className={adminTableWrap}>
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-black/[0.08] text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-text-tertiary)]">
                <th className="py-3 pr-4 font-medium">Datum</th>
                <th className="py-3 pr-4 font-medium">Titel</th>
                <th className="py-3 pr-4 font-medium">URL-Kürzel</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 font-medium"> </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-black/[0.05] last:border-0">
                  <td className="py-3 pr-4 align-top text-[var(--apple-text-secondary)]">{formatWhen(r.createdAt)}</td>
                  <td className="py-3 pr-4 align-top font-medium text-[var(--apple-text)]">{r.title}</td>
                  <td className="py-3 pr-4 align-top font-mono text-xs text-[var(--apple-text-secondary)]">{r.slug}</td>
                  <td className="py-3 pr-4 align-top">
                    <span className={adminPill}>{friendlyDraftStatus(r.status)}</span>
                  </td>
                  <td className="py-3 align-top text-right">
                    <Link
                      href={CMS_PATHS.adminBlogAutomationDraft(r.id)}
                      className="text-sm font-medium text-[var(--brand-900)] underline-offset-4 hover:underline"
                    >
                      Bearbeiten
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminPageContainer>
  );
}
