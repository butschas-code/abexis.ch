"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CMS_PATHS } from "@/admin/paths";
import type { CmsSubmissionStatus } from "@/cms/types/enums";
import { CMS_SUBMISSION_STATUSES } from "@/cms/types/enums";
import {
  listSubmissionsForAdmin,
  updateSubmissionStatus,
  type SubmissionListItem,
} from "@/cms/services/submissions-admin-client";
import {
  adminFeedbackError,
  adminInput,
  adminPanelInset,
  adminTableWrap,
} from "@/components/admin/admin-ui";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageContainer, AdminPageHeader, AdminPageSection } from "@/components/admin/AdminPageContainer";
import { APPLICATION_BOARD_COLUMNS, applicationBoardColumn } from "@/lib/cms/application-board";
import { SubmissionDetailDrawer } from "./SubmissionDetailDrawer";
import { applicationBoardLabelDe, submissionStatusLabelDe } from "./submission-admin-labels";

type SortKey = "createdAt" | "applicantName" | "email" | "jobTitle" | "status";
type SortDir = "asc" | "desc";

function compareLocale(a: string, b: string, dir: SortDir): number {
  const c = a.localeCompare(b, "de-CH", { sensitivity: "base" });
  return dir === "asc" ? c : -c;
}

function sortApplications(rows: SubmissionListItem[], key: SortKey, dir: SortDir): SubmissionListItem[] {
  const out = [...rows];
  out.sort((ra, rb) => {
    if (key === "createdAt") {
      const ta = ra.createdAt ? new Date(ra.createdAt).getTime() : 0;
      const tb = rb.createdAt ? new Date(rb.createdAt).getTime() : 0;
      return dir === "asc" ? ta - tb : tb - ta;
    }
    if (key === "status") {
      return compareLocale(ra.status, rb.status, dir);
    }
    const va = String(
      key === "applicantName"
        ? (ra.applicantName ?? "")
        : key === "email"
          ? (ra.email ?? "")
          : (ra.jobTitle ?? ""),
    );
    const vb = String(
      key === "applicantName"
        ? (rb.applicantName ?? "")
        : key === "email"
          ? (rb.email ?? "")
          : (rb.jobTitle ?? ""),
    );
    return compareLocale(va, vb, dir);
  });
  return out;
}

export function AdminJobApplicationsManager() {
  const [rows, setRows] = useState<SubmissionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<CmsSubmissionStatus | "all">("all");
  const [q, setQ] = useState("");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "board">("table");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [rowSavingId, setRowSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listSubmissionsForAdmin(150);
      setRows(data);
    } catch {
      setError("Bewerbungen konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  const applications = useMemo(() => rows.filter((r) => r.type === "application"), [rows]);

  const filtered = useMemo(() => {
    return applications.filter((r) => {
      if (filterStatus !== "all" && r.status !== filterStatus) return false;
      const s = q.trim().toLowerCase();
      if (!s) return true;
      return (
        r.id.toLowerCase().includes(s) ||
        (r.summary ?? "").toLowerCase().includes(s) ||
        (r.email ?? "").toLowerCase().includes(s) ||
        (r.jobTitle ?? "").toLowerCase().includes(s) ||
        (r.applicantName ?? "").toLowerCase().includes(s) ||
        (r.phone ?? "").toLowerCase().includes(s) ||
        (r.messagePreview ?? "").toLowerCase().includes(s)
      );
    });
  }, [applications, filterStatus, q]);

  const sorted = useMemo(() => sortApplications(filtered, sortKey, sortDir), [filtered, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "createdAt" ? "desc" : "asc");
    }
  };

  const onInlineStatusChange = async (id: string, status: CmsSubmissionStatus) => {
    setRowSavingId(id);
    setError(null);
    try {
      await updateSubmissionStatus(id, status);
      await load();
    } catch {
      setError("Status konnte nicht gespeichert werden.");
    } finally {
      setRowSavingId(null);
    }
  };

  const sortHint = (key: SortKey) => {
    if (sortKey !== key) return "↕";
    return sortDir === "asc" ? "↑" : "↓";
  };

  const boardRows = useMemo(() => sortApplications(filtered, "createdAt", "desc"), [filtered]);

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Bewerbungen"
        description="Alle Job-Eingänge von der Website: sortierbare Tabelle, Board mit Phasen, Status und Detailansicht."
      />

      <AdminPageSection>
        <div className="flex flex-wrap items-center justify-between gap-3 text-[15px] mb-4">
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={CMS_PATHS.adminHome}
              className="font-medium text-[var(--brand-900)] underline decoration-[var(--brand-900)]/20 underline-offset-4 transition hover:decoration-[var(--brand-900)]/45"
            >
              Zur Übersicht
            </Link>
            <Link
              href={CMS_PATHS.adminSubmissions}
              className="font-medium text-[var(--brand-900)] underline decoration-[var(--brand-900)]/25 underline-offset-4 transition hover:decoration-[var(--brand-900)]/50"
            >
              Alle Eingänge →
            </Link>
          </div>
          <div className="flex bg-[var(--apple-bg-subtle)] p-1 rounded-xl items-center border border-black/[0.06]">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition ${viewMode === "table" ? "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-black" : "text-[var(--apple-text-secondary)] hover:text-black"}`}
            >
              Tabelle
            </button>
            <button
              type="button"
              onClick={() => setViewMode("board")}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition ${viewMode === "board" ? "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-black" : "text-[var(--apple-text-secondary)] hover:text-black"}`}
            >
              Board
            </button>
          </div>
        </div>

        {viewMode === "table" && (
          <div className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${adminPanelInset} mb-6`}>
            <label className="block w-full max-w-md flex-1">
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--apple-text)]">Suche</span>
              <input
                type="search"
                placeholder="Name, E-Mail, Position, Nachricht, ID…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className={adminInput}
              />
            </label>
            <label className="block w-full min-w-[200px] sm:w-52">
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--apple-text)]">Label / Status</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as CmsSubmissionStatus | "all")}
                className={adminInput}
              >
                <option value="all">Alle Status</option>
                {CMS_SUBMISSION_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {submissionStatusLabelDe[st]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {error ? <div className={adminFeedbackError}>{error}</div> : null}

        {loading ? (
          <div className={`${adminTableWrap} overflow-hidden`}>
            <AdminLoading compact message="Bewerbungen werden geladen…" />
          </div>
        ) : applications.length === 0 ? (
          <AdminEmptyState
            title="Noch keine Bewerbungen"
            description="Sobald Kandidatinnen ein Formular auf einer Vakanz senden, erscheint der Eintrag hier."
          />
        ) : viewMode === "board" ? (
          <div className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x">
            {APPLICATION_BOARD_COLUMNS.map((colKey) => {
              const colItems = boardRows.filter((r) => applicationBoardColumn(r.status) === colKey);
              return (
                <div
                  key={colKey}
                  className="flex-none w-80 bg-[var(--apple-bg-subtle)] rounded-2xl flex flex-col snap-start border border-black/[0.04] p-4 max-h-[780px]"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-[14px] text-[var(--apple-text)]">
                      {applicationBoardLabelDe[colKey]}
                    </h3>
                    <span className="bg-black/5 text-[11px] font-mono px-2 py-0.5 rounded-full text-[var(--apple-text-tertiary)]">
                      {colItems.length}
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-3 pb-2 pr-1">
                    {colItems.length === 0 ? (
                      <p className="text-[13px] text-[var(--apple-text-tertiary)] italic p-2 text-center">Leer</p>
                    ) : (
                      colItems.map((r) => (
                        <div
                          key={r.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => setDetailId(r.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setDetailId(r.id);
                            }
                          }}
                          className="bg-white p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.06] cursor-pointer transition hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 text-left w-full"
                        >
                          <div className="flex justify-between items-start mb-2 gap-2">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand-900)] line-clamp-2 break-words">
                              {r.jobTitle || "Position unbekannt"}
                            </div>
                            {r.hasFiles && (
                              <svg
                                className="w-3.5 h-3.5 text-[var(--apple-text-tertiary)] shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                />
                              </svg>
                            )}
                          </div>
                          <p className="text-[14px] leading-snug font-medium text-[var(--apple-text)] mb-1 break-words">
                            {r.applicantName || r.summary || "Unbekannt"}
                          </p>
                          {r.email ? (
                            <p className="text-[12px] text-[var(--apple-text-secondary)] break-all">{r.email}</p>
                          ) : null}
                          <p className="text-[10px] text-[var(--apple-text-tertiary)] mt-2">
                            {submissionStatusLabelDe[r.status]}
                          </p>
                          <p className="text-[11px] text-[var(--apple-text-tertiary)] mt-0.5">
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
                  <th className="px-3 py-3.5 pl-4 lg:pl-5">
                    <button
                      type="button"
                      onClick={() => toggleSort("jobTitle")}
                      className="font-semibold text-left uppercase tracking-[0.14em] text-[var(--apple-text-tertiary)] hover:text-black"
                    >
                      Position {sortHint("jobTitle")}
                    </button>
                  </th>
                  <th className="hidden px-3 py-3.5 lg:table-cell">
                    <button
                      type="button"
                      onClick={() => toggleSort("applicantName")}
                      className="font-semibold text-left uppercase tracking-[0.14em] text-[var(--apple-text-tertiary)] hover:text-black"
                    >
                      Name {sortHint("applicantName")}
                    </button>
                  </th>
                  <th className="hidden px-3 py-3.5 xl:table-cell">
                    <button
                      type="button"
                      onClick={() => toggleSort("email")}
                      className="font-semibold text-left uppercase tracking-[0.14em] text-[var(--apple-text-tertiary)] hover:text-black"
                    >
                      E-Mail {sortHint("email")}
                    </button>
                  </th>
                  <th className="hidden px-3 py-3.5 md:table-cell">Telefon</th>
                  <th className="hidden px-3 py-3.5 lg:table-cell max-w-[14rem]">Nachricht</th>
                  <th className="hidden px-3 py-3.5 md:table-cell text-center">Datei</th>
                  <th className="px-3 py-3.5">
                    <button
                      type="button"
                      onClick={() => toggleSort("createdAt")}
                      className="font-semibold text-left uppercase tracking-[0.14em] text-[var(--apple-text-tertiary)] hover:text-black"
                    >
                      Eingang {sortHint("createdAt")}
                    </button>
                  </th>
                  <th className="px-3 py-3.5 pr-4 lg:pr-5 min-w-[10.5rem]">
                    <button
                      type="button"
                      onClick={() => toggleSort("status")}
                      className="font-semibold text-left uppercase tracking-[0.14em] text-[var(--apple-text-tertiary)] hover:text-black"
                    >
                      Status {sortHint("status")}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06]">
                {sorted.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-14 text-center">
                      <p className="font-serif text-[1.1rem] font-medium text-[var(--apple-text)]">Keine Treffer</p>
                      <p className="mt-2 text-[14px] text-[var(--apple-text-secondary)]">
                        Suche oder Statusfilter anpassen.
                      </p>
                    </td>
                  </tr>
                ) : (
                  sorted.map((r) => (
                    <tr
                      key={r.id}
                      className="cursor-pointer transition-colors hover:bg-[color-mix(in_srgb,var(--apple-bg-subtle)_42%,white)] align-top"
                      onClick={() => setDetailId(r.id)}
                    >
                      <td className="px-3 py-3.5 pl-4 lg:pl-5">
                        <div className="font-medium text-[var(--apple-text)] break-words">{r.jobTitle || "—"}</div>
                        <div className="mt-1 font-mono text-[10px] text-[var(--apple-text-tertiary)] lg:hidden">
                          {r.id}
                        </div>
                        <div className="mt-1 text-[12px] text-[var(--apple-text-secondary)] lg:hidden">
                          {[r.applicantName, r.email].filter(Boolean).join(" · ") || "—"}
                        </div>
                        <div className="mt-0.5 font-mono text-[10px] text-[var(--apple-text-tertiary)] hidden lg:block">
                          {r.id}
                        </div>
                      </td>
                      <td className="hidden px-3 py-3.5 text-[var(--apple-text)] lg:table-cell break-words">
                        {r.applicantName || "—"}
                      </td>
                      <td className="hidden px-3 py-3.5 xl:table-cell break-all text-[13px] text-[var(--apple-text-secondary)]">
                        {r.email || "—"}
                      </td>
                      <td className="hidden px-3 py-3.5 md:table-cell text-[13px] text-[var(--apple-text-secondary)] break-words">
                        {r.phone || "—"}
                      </td>
                      <td className="hidden px-3 py-3.5 lg:table-cell text-[13px] text-[var(--apple-text-secondary)] max-w-[14rem]">
                        <span className="line-clamp-3">{r.messagePreview || "—"}</span>
                      </td>
                      <td className="hidden px-3 py-3.5 md:table-cell text-center">
                        {r.hasFiles ? (
                          <span title="Anhang vorhanden" className="inline-flex text-[var(--brand-900)]" aria-label="Anhang">
                            ✓
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-3 py-3.5 text-[13px] text-[var(--apple-text-secondary)] whitespace-nowrap">
                        {r.createdAt ? new Date(r.createdAt).toLocaleString("de-CH") : "—"}
                      </td>
                      <td className="px-3 py-3.5 pr-4 lg:pr-5" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={r.status}
                          disabled={rowSavingId === r.id}
                          onChange={(e) => void onInlineStatusChange(r.id, e.target.value as CmsSubmissionStatus)}
                          className={`${adminInput} py-2 text-[13px] min-w-[9.5rem]`}
                          aria-label="Status setzen"
                        >
                          {CMS_SUBMISSION_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {submissionStatusLabelDe[st]}
                            </option>
                          ))}
                        </select>
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
