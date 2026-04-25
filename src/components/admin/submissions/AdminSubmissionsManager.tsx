"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CMS_PATHS } from "@/admin/paths";
import type { CmsSubmissionStatus } from "@/cms/types/enums";
import {
  listSubmissionsForAdmin,
  type SubmissionListItem,
} from "@/cms/services/submissions-admin-client";
import {
  adminFeedbackError,
  adminInput,
  adminPanelInset,
  adminPill,
  adminTableWrap,
} from "@/components/admin/admin-ui";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageContainer, AdminPageHeader, AdminPageSection } from "@/components/admin/AdminPageContainer";
import { SubmissionDetailDrawer } from "./SubmissionDetailDrawer";

const statusLabel: Record<CmsSubmissionStatus, string> = {
  new: "Neu",
  reviewed: "Gelesen",
  archived: "Archiviert",
  spam: "Spam",
  screening: "In Prüfung",
  interview: "Interview",
  offer: "Angebot",
  hired: "Eingestellt",
  rejected: "Abgesagt",
};

const typeLabel: Record<string, string> = {
  contact: "Kontakt",
  executive_search: "Suchauftrag",
  application: "Bewerbung",
  newsletter: "Newsletter",
  generic: "Generisch",
};

const PIPELINE_COLUMNS: CmsSubmissionStatus[] = [
  "new",
  "screening",
  "interview",
  "offer",
  "hired",
  "rejected"
];

export function AdminSubmissionsManager() {
  const [rows, setRows] = useState<SubmissionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<CmsSubmissionStatus | "all">("all");
  const [q, setQ] = useState("");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "pipeline">("table");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listSubmissionsForAdmin(150);
      setRows(data);
    } catch {
      setError("Einträge konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filterStatus !== "all" && r.status !== filterStatus) return false;
      const s = q.trim().toLowerCase();
      if (!s) return true;
      const tLabel = typeLabel[r.type] ?? r.type;
      return (
        tLabel.toLowerCase().includes(s) ||
        r.type.toLowerCase().includes(s) ||
        r.id.toLowerCase().includes(s) ||
        (r.summary ?? "").toLowerCase().includes(s) ||
        r.site.toLowerCase().includes(s)
      );
    });
  }, [rows, filterStatus, q]);

  // For pipeline mode, we only show job applications
  const pipelineRows = useMemo(() => {
    return filtered.filter((r) => r.type === "application");
  }, [filtered]);

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Eingänge & Bewerber"
        description="Nachrichten und Bewerbungs-Pipeline. Nutzen Sie die Table-Ansicht für Kontakte und Pipeline für Job-Bewerber."
      />

      <AdminPageSection>
        <div className="flex items-center justify-between text-[15px] mb-4">
          <Link
            href={CMS_PATHS.adminHome}
            className="font-medium text-[var(--brand-900)] underline decoration-[var(--brand-900)]/20 underline-offset-4 transition hover:decoration-[var(--brand-900)]/45"
          >
            Zur Übersicht
          </Link>
          <div className="flex bg-[var(--apple-bg-subtle)] p-1 rounded-xl items-center border border-black/[0.06]">
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition ${viewMode === "table" ? "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-black" : "text-[var(--apple-text-secondary)] hover:text-black"}`}
            >
              Tabelle
            </button>
            <button
              onClick={() => setViewMode("pipeline")}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition ${viewMode === "pipeline" ? "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-black" : "text-[var(--apple-text-secondary)] hover:text-black"}`}
            >
              Pipeline
            </button>
          </div>
        </div>

        {viewMode === "table" && (
          <div className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${adminPanelInset} mb-6`}>
            <label className="block w-full max-w-md flex-1">
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--apple-text)]">Suche</span>
              <input
                type="search"
                placeholder="Typ, Kurzinfo oder ID…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className={adminInput}
              />
            </label>
            <label className="block w-full min-w-[200px] sm:w-52">
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--apple-text)]">Status</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as CmsSubmissionStatus | "all")}
                className={adminInput}
              >
                <option value="all">Alle Status</option>
                <option value="new">Neu</option>
                <option value="reviewed">Gelesen</option>
                <option value="screening">In Prüfung</option>
                <option value="interview">Interview</option>
                <option value="offer">Angebot</option>
                <option value="hired">Eingestellt</option>
                <option value="rejected">Abgesagt</option>
                <option value="archived">Archiviert</option>
                <option value="spam">Spam</option>
              </select>
            </label>
          </div>
        )}

        {error ? <div className={adminFeedbackError}>{error}</div> : null}

        {loading ? (
          <div className={`${adminTableWrap} overflow-hidden`}>
            <AdminLoading compact message="Eingänge werden geladen…" />
          </div>
        ) : rows.length === 0 ? (
          <AdminEmptyState
            title="Noch keine Eingänge"
            description="Wenn Besucher ein Formular absenden, erscheint der Eintrag hier."
          />
        ) : viewMode === "pipeline" ? (
          <div className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x">
            {PIPELINE_COLUMNS.map((colStatus) => {
              const colItems = pipelineRows.filter((r) => r.status === colStatus);
              return (
                <div key={colStatus} className="flex-none w-80 bg-[var(--apple-bg-subtle)] rounded-2xl flex flex-col snap-start border border-black/[0.04] p-4 max-h-[750px]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-[14px] text-[var(--apple-text)]">{statusLabel[colStatus]}</h3>
                    <span className="bg-black/5 text-[11px] font-mono px-2 py-0.5 rounded-full text-[var(--apple-text-tertiary)]">{colItems.length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-3 pb-2 pr-1">
                    {colItems.length === 0 ? (
                      <p className="text-[13px] text-[var(--apple-text-tertiary)] italic p-2 text-center">Leer</p>
                    ) : (
                      colItems.map((r) => (
                        <div
                          key={r.id}
                          onClick={() => setDetailId(r.id)}
                          className="bg-white p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.06] cursor-pointer transition hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand-900)] line-clamp-1 break-all">
                              {typeLabel[r.type] ?? r.type}
                            </div>
                            {r.hasFiles && (
                              <svg className="w-3.5 h-3.5 text-[var(--apple-text-tertiary)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                            )}
                          </div>
                          <p className="text-[14px] leading-snug font-medium text-[var(--apple-text)] mb-2 break-words">
                            {r.summary || "Unbekannter Bewerber"}
                          </p>
                          <p className="text-[11px] text-[var(--apple-text-tertiary)]">
                            {r.createdAt ? new Date(r.createdAt).toLocaleDateString("de-CH") : "—"}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={adminTableWrap}>
            <table className="w-full text-left text-[15px]">
              <thead className="border-b border-black/[0.07] bg-[color-mix(in_srgb,var(--apple-bg-subtle)_65%,white)] text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-text-tertiary)]">
                <tr>
                  <th className="px-4 py-3.5 pl-5">Typ / Kurzinfo</th>
                  <th className="px-4 py-3.5">Site</th>
                  <th className="hidden px-4 py-3.5 md:table-cell">Zeit</th>
                  <th className="px-4 py-3.5 pr-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06]">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-14 text-center">
                      <p className="font-serif text-[1.1rem] font-medium text-[var(--apple-text)]">Keine Treffer</p>
                      <p className="mt-2 text-[14px] text-[var(--apple-text-secondary)]">
                        Suche oder Statusfilter anpassen.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr
                      key={r.id}
                      className="cursor-pointer transition-colors hover:bg-[color-mix(in_srgb,var(--apple-bg-subtle)_42%,white)]"
                      onClick={() => setDetailId(r.id)}
                    >
                      <td className="px-4 py-3.5 pl-5">
                        <div className="font-medium flex items-center gap-2">
                          {typeLabel[r.type] ?? r.type}
                          {r.hasFiles && (
                            <svg className="w-3.5 h-3.5 text-[var(--apple-text-tertiary)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                          )}
                        </div>
                        {r.summary ? (
                          <div className="mt-0.5 text-[13px] text-[var(--apple-text-secondary)] break-words line-clamp-2">{r.summary}</div>
                        ) : null}
                        <div className="font-mono text-xs text-[var(--apple-text-tertiary)]">{r.id}</div>
                      </td>
                      <td className="px-4 py-3.5 text-[var(--apple-text-secondary)]">{r.site}</td>
                      <td className="hidden px-4 py-3.5 text-[var(--apple-text-secondary)] md:table-cell">
                        {r.createdAt ? new Date(r.createdAt).toLocaleString("de-CH") : "—"}
                      </td>
                      <td className="px-4 py-3.5 pr-5">
                        <span className={adminPill}>{statusLabel[r.status] ?? r.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </AdminPageSection>

      <SubmissionDetailDrawer
        submissionId={detailId}
        open={detailId != null}
        onClose={() => setDetailId(null)}
        onStatusChanged={() => void load()}
      />
    </AdminPageContainer>
  );
}
