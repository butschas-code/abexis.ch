"use client";

import { useCallback, useEffect, useState } from "react";
import { CMS_SUBMISSION_STATUSES } from "@/cms/types/enums";
import type { CmsSubmissionStatus } from "@/cms/types/enums";
import {
  getSubmissionForAdmin,
  updateSubmissionStatus,
  type SubmissionDetail,
} from "@/cms/services/submissions-admin-client";

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

type Props = {
  submissionId: string | null;
  open: boolean;
  onClose: () => void;
  onStatusChanged: () => void;
};

export function SubmissionDetailDrawer({ submissionId, open, onClose, onStatusChanged }: Props) {
  const [row, setRow] = useState<SubmissionDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!submissionId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getSubmissionForAdmin(submissionId);
      setRow(data);
      if (!data) setError("Eintrag nicht gefunden.");
    } catch {
      setError("Laden fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  }, [submissionId]);

  useEffect(() => {
    if (!open) {
      queueMicrotask(() => setRow(null));
      return;
    }
    if (!submissionId) return;
    queueMicrotask(() => {
      void load();
    });
  }, [open, submissionId, load]);

  const setStatus = async (status: CmsSubmissionStatus) => {
    if (!submissionId) return;
    setSaving(true);
    setError(null);
    try {
      await updateSubmissionStatus(submissionId, status);
      await load();
      onStatusChanged();
    } catch {
      setError("Status konnte nicht gespeichert werden.");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-[#1d1d1f]/35 backdrop-blur-[3px] transition-opacity"
        aria-label="Schließen"
        onClick={onClose}
      />
      <aside className="relative z-10 flex h-full w-full max-w-[28rem] flex-col border-l border-black/[0.07] bg-[color-mix(in_srgb,white_98%,var(--apple-bg-subtle))] shadow-[-12px_0_48px_-12px_rgba(0,0,0,0.12)]">
        <div className="flex items-center justify-between border-b border-black/[0.06] px-6 py-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--apple-text-tertiary)]">
              Detail
            </p>
            <h2 className="mt-1 font-serif text-[1.25rem] font-medium text-[var(--apple-text)]">Eingang</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-2 text-[13px] text-[var(--apple-text-secondary)] transition hover:bg-black/[0.05]"
          >
            Schließen
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading ? (
            <p className="text-[15px] text-[var(--apple-text-secondary)]">Wird geladen…</p>
          ) : error ? (
            <p className="rounded-[12px] border border-red-200/90 bg-red-50 px-3 py-2 text-[14px] text-red-900">{error}</p>
          ) : row ? (
            <div className="space-y-6 text-[15px] leading-relaxed">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-text-tertiary)]">
                  Status
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CMS_SUBMISSION_STATUSES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={saving || row.status === s}
                      onClick={() => void setStatus(s)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                        row.status === s
                          ? "bg-[var(--brand-900)] text-white"
                          : "border border-black/10 bg-white text-[var(--apple-text-secondary)] hover:border-black/20"
                      }`}
                    >
                      {statusLabel[s]}
                    </button>
                  ))}
                </div>
              </div>

              <MetaLine label="Typ" value={row.type} />
              <MetaLine label="Website" value={row.site} />
              <MetaLine
                label="Eingang"
                value={row.createdAt ? new Date(row.createdAt).toLocaleString("de-CH") : ","}
              />
              {row.updatedAt ? (
                <MetaLine label="Zuletzt bearbeitet" value={new Date(row.updatedAt).toLocaleString("de-CH")} />
              ) : null}
              {row.sourceUrl ? (
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-text-tertiary)]">
                    Quelle
                  </span>
                  <p className="mt-1 break-all font-mono text-xs text-[var(--brand-900)]">
                    <a href={row.sourceUrl} target="_blank" rel="noreferrer" className="hover:underline">
                      {row.sourceUrl}
                    </a>
                  </p>
                </div>
              ) : null}

              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-text-tertiary)]">
                  Nachricht & Felder
                </span>
                <dl className="mt-2 space-y-2 rounded-xl border border-black/[0.06] bg-[var(--apple-bg-subtle)] p-3">
                  {Object.entries(row.payload).map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[11px] font-medium uppercase tracking-wide text-[var(--apple-text-tertiary)]">
                        {k}
                      </dt>
                      <dd className="whitespace-pre-wrap text-[var(--apple-text)]">{v || ","}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {row.fileUrls.length > 0 ? (
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-text-tertiary)]">
                    Dateien
                  </span>
                  <ul className="mt-2 space-y-2">
                    {row.fileUrls.map((url) => (
                      <li key={url}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="break-all text-[var(--brand-900)] hover:underline"
                        >
                          {url.includes("?") ? url.split("/").pop()?.split("?")[0] : url.split("/").pop()}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {row.userAgent ? (
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-text-tertiary)]">
                    User-Agent
                  </span>
                  <p className="mt-1 font-mono text-[11px] text-[var(--apple-text-secondary)]">{row.userAgent}</p>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

function MetaLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-text-tertiary)]">
        {label}
      </span>
      <p className="mt-1 text-[var(--apple-text)]">{value}</p>
    </div>
  );
}
