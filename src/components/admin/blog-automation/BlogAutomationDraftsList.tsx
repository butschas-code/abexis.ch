"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { CMS_PATHS } from "@/admin/paths";
import { useCmsAuth } from "@/cms/auth/cms-auth-context";
import { apiListBlogDraftsForAdmin } from "@/cms/services/blog-automation-cms-api-client";
import type { BlogDraftListItem } from "@/cms/services/blog-pipeline-types";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageContainer, AdminPageHeader, AdminPageSection } from "@/components/admin/AdminPageContainer";
import { adminBody, adminPanel, adminPill } from "@/components/admin/admin-ui";

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

function splitWhen(iso: string | null): { date: string; time: string } {
  const formatted = formatWhen(iso);
  const parts = formatted.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) return { date: parts[0], time: parts.slice(1).join(", ") };
  return { date: formatted, time: "" };
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
      <p className={adminBody}>
        <Link href={CMS_PATHS.adminBlogAutomation} className="font-medium text-[var(--brand-900)] underline-offset-4 hover:underline">
          ← Blog-Automation
        </Link>
      </p>

      <AdminPageHeader
        title="KI-Entwürfe"
        description="Prüfen, bearbeiten und bei Bedarf als normalen Blogbeitrag veröffentlichen. Die Veröffentlichung erfolgt nur, wenn Sie unten auf «Veröffentlichen» klicken."
      />

      <AdminPageSection>
        <div className="flex flex-wrap gap-2 border-b border-black/[0.06] pb-5">
          {TABS.map((t) => {
            const count = tabCount(t.key);
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`inline-flex min-h-[42px] items-center gap-2 rounded-full px-5 text-[14px] font-medium transition ${
                  active
                    ? "bg-[var(--brand-900)] text-white shadow-sm shadow-[var(--brand-900)]/18"
                    : "border border-black/[0.08] bg-white/90 text-[var(--apple-text)] hover:border-black/14 hover:bg-[var(--apple-bg-subtle)]"
                }`}
              >
                {t.label}
                <span className={`tabular-nums ${active ? "text-white/80" : "text-[var(--apple-text-secondary)]"}`}>{count}</span>
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
          <div className={`${adminPanel} overflow-hidden`}>
            <div className="border-b border-black/[0.06] px-6 py-5 sm:px-7">
              <p className="text-[13px] font-medium text-[var(--apple-text)]">
                {filtered.length === 1 ? "1 Entwurf" : `${filtered.length} Entwürfe`}
              </p>
              <p className={`${adminBody} mt-1 text-[13px]`}>Sortiert nach letzter Erstellung. Öffnen Sie einen Entwurf für Prüfung, Freigabe oder Veröffentlichung.</p>
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full border-collapse text-left text-[14px]">
                <thead>
                  <tr className="border-b border-black/[0.06] bg-[color-mix(in_srgb,var(--apple-bg-subtle)_45%,white)] text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-text-tertiary)]">
                    <th className="w-[118px] px-7 py-4 font-medium">Datum</th>
                    <th className="min-w-[340px] px-7 py-4 font-medium">Titel</th>
                    <th className="min-w-[320px] px-7 py-4 font-medium">URL-Kürzel</th>
                    <th className="w-[170px] px-7 py-4 font-medium">Status</th>
                    <th className="w-[120px] px-7 py-4 font-medium"> </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => {
                    const when = splitWhen(r.createdAt);
                    return (
                      <tr key={r.id} className="border-b border-black/[0.05] transition last:border-0 hover:bg-[color-mix(in_srgb,var(--apple-bg-subtle)_42%,white)]">
                        <td className="px-7 py-5 align-top text-[var(--apple-text-secondary)]">
                          <span className="block whitespace-nowrap">{when.date}</span>
                          {when.time ? <span className="mt-1 block text-[13px]">{when.time}</span> : null}
                        </td>
                        <td className="px-7 py-5 align-top">
                          <Link
                            href={CMS_PATHS.adminBlogAutomationDraft(r.id)}
                            className="block max-w-[52ch] text-[15px] font-medium leading-snug text-[var(--apple-text)] underline-offset-4 hover:text-[var(--brand-900)] hover:underline"
                          >
                            {r.title}
                          </Link>
                        </td>
                        <td className="px-7 py-5 align-top">
                          <span className="block max-w-[42ch] break-words font-mono text-[12px] leading-relaxed text-[var(--apple-text-secondary)]">{r.slug}</span>
                        </td>
                        <td className="px-7 py-5 align-top">
                          <span className={adminPill}>{friendlyDraftStatus(r.status)}</span>
                        </td>
                        <td className="px-7 py-5 align-top text-right">
                          <Link
                            href={CMS_PATHS.adminBlogAutomationDraft(r.id)}
                            className="inline-flex min-h-[36px] items-center justify-center rounded-full px-3 text-[13px] font-medium text-[var(--brand-900)] transition hover:bg-[var(--brand-900)]/[0.07]"
                          >
                            Bearbeiten
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-black/[0.06] lg:hidden">
              {filtered.map((r) => {
                const when = splitWhen(r.createdAt);
                return (
                  <article key={r.id} className="space-y-4 px-5 py-5 sm:px-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-[13px] leading-snug text-[var(--apple-text-secondary)]">
                        <span>{when.date}</span>
                        {when.time ? <span> · {when.time}</span> : null}
                      </div>
                      <span className={adminPill}>{friendlyDraftStatus(r.status)}</span>
                    </div>
                    <div className="space-y-2">
                      <Link
                        href={CMS_PATHS.adminBlogAutomationDraft(r.id)}
                        className="block text-[16px] font-medium leading-snug text-[var(--apple-text)] underline-offset-4 hover:text-[var(--brand-900)] hover:underline"
                      >
                        {r.title}
                      </Link>
                      <p className="break-words font-mono text-[12px] leading-relaxed text-[var(--apple-text-secondary)]">{r.slug}</p>
                    </div>
                    <Link
                      href={CMS_PATHS.adminBlogAutomationDraft(r.id)}
                      className="inline-flex min-h-[38px] items-center justify-center rounded-full border border-black/[0.08] bg-white px-4 text-[13px] font-medium text-[var(--brand-900)] transition hover:bg-[var(--apple-bg-subtle)]"
                    >
                      Bearbeiten
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </AdminPageSection>
    </AdminPageContainer>
  );
}
