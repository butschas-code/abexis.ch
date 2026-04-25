"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CMS_PATHS } from "@/admin/paths";
import { listVacanciesForAdmin, type VacancyListItem } from "@/cms/services/vacancies-client";
import { deleteVacancy, saveVacancy, vacancyListItemToUpsert } from "@/cms/services/vacancy-write-client";
import type { PostStatus } from "@/cms/types/enums";
import {
  adminBtnGhost,
  adminBtnPrimary,
  adminBtnSecondary,
  adminFeedbackInfo,
  adminPanelInset,
  adminPill,
  adminTableWrap,
} from "@/components/admin/admin-ui";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageContainer, AdminPageHeader, AdminPageSection } from "@/components/admin/AdminPageContainer";

const statusLabel: Record<PostStatus, string> = {
  draft: "Entwurf",
  published: "Live",
  archived: "Archiv",
};

function formatWhen(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("de-CH", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

export function AdminVacanciesManager() {
  const router = useRouter();
  const [vacancies, setVacancies] = useState<VacancyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setVacancies(await listVacanciesForAdmin(200));
    } catch {
      setError("Vakanzen konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => void reload());
  }, [reload]);

  async function handlePublish(v: VacancyListItem) {
    setBusyId(v.id);
    setBanner(null);
    try {
      await saveVacancy({ ...vacancyListItemToUpsert(v), status: "published" });
      await reload();
      setBanner("Vakanz veröffentlicht.");
    } catch (e) {
      setBanner(e instanceof Error ? e.message : "Veröffentlichen fehlgeschlagen.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleUnpublish(v: VacancyListItem) {
    setBusyId(v.id);
    setBanner(null);
    try {
      await saveVacancy({ ...vacancyListItemToUpsert(v), status: "draft" });
      await reload();
      setBanner("Vakanz zurückgezogen (Entwurf).");
    } catch (e) {
      setBanner(e instanceof Error ? e.message : "Zurückziehen fehlgeschlagen.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setBusyId(deleteTarget.id);
    setBanner(null);
    try {
      await deleteVacancy(deleteTarget.id);
      setDeleteTarget(null);
      await reload();
      setBanner("Vakanz gelöscht.");
    } catch (e) {
      setBanner(e instanceof Error ? e.message : "Löschen fehlgeschlagen.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Vakanzen"
        description="Aktuelle Executive Search Mandate. Veröffentlichte Vakanzen erscheinen auf der öffentlichen Vakanzen-Seite."
        actions={
          <Link href={CMS_PATHS.adminVacancyNew} className={adminBtnPrimary}>
            Neue Vakanz
          </Link>
        }
      />

      <AdminPageSection className="space-y-4">
        {banner ? <div className={adminFeedbackInfo}>{banner}</div> : null}

        {error ? (
          <div className="rounded-[1rem] border border-red-200/95 bg-red-50 px-4 py-3 text-[14px] leading-snug text-red-900">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className={`${adminTableWrap} overflow-hidden`}>
            <AdminLoading compact message="Vakanzen werden geladen…" />
          </div>
        ) : vacancies.length === 0 ? (
          <AdminEmptyState
            title="Noch keine Vakanzen"
            description="Legen Sie eine erste Vakanz an — sie erscheint dann auf der öffentlichen Seite, sobald veröffentlicht."
            action={{ label: "Erste Vakanz anlegen", href: CMS_PATHS.adminVacancyNew }}
          />
        ) : (
          <div className={adminTableWrap}>
            <table className="w-full min-w-[720px] text-left text-[15px]">
              <thead className="border-b border-black/[0.07] bg-[color-mix(in_srgb,var(--apple-bg-subtle)_70%,white)] text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-text-tertiary)]">
                <tr>
                  <th className="px-4 py-3.5 pl-5">Titel / Slug</th>
                  <th className="px-4 py-3.5">Branche</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="hidden px-4 py-3.5 md:table-cell">Veröffentlicht</th>
                  <th className="hidden px-4 py-3.5 lg:table-cell">Bearbeitet</th>
                  <th className="px-4 py-3.5 pr-5 text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06]">
                {vacancies.map((v) => (
                  <tr
                    key={v.id}
                    className={
                      busyId === v.id
                        ? "bg-[var(--apple-bg-subtle)]/80 opacity-[0.72]"
                        : "transition-colors hover:bg-[color-mix(in_srgb,var(--apple-bg-subtle)_42%,white)]"
                    }
                  >
                    <td className="max-w-[280px] px-4 py-3.5 pl-5">
                      <Link
                        href={CMS_PATHS.adminVacancyEdit(v.id)}
                        className="font-medium text-[var(--apple-text)] hover:text-[var(--brand-900)]"
                      >
                        {v.title || "(ohne Titel)"}
                      </Link>
                      <div className="mt-0.5 font-mono text-[11px] text-[var(--apple-text-tertiary)]">{v.slug}</div>
                    </td>
                    <td className="max-w-[160px] truncate px-4 py-3.5 text-[var(--apple-text-secondary)]">
                      {v.sector || "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`${adminPill} whitespace-nowrap`}>{statusLabel[v.status]}</span>
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-3.5 text-[var(--apple-text-secondary)] md:table-cell">
                      {formatWhen(v.publishedAt)}
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-3.5 text-[var(--apple-text-secondary)] lg:table-cell">
                      {formatWhen(v.updatedAt)}
                    </td>
                    <td className="px-4 py-3.5 pr-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={CMS_PATHS.adminVacancyEdit(v.id)}
                          className="hidden rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[12px] font-medium text-[var(--brand-900)] shadow-[0_1px_0_rgba(0,0,0,0.03)] transition hover:bg-[var(--apple-bg-subtle)] sm:inline-flex sm:items-center"
                        >
                          Bearbeiten
                        </Link>
                        {v.status !== "published" ? (
                          <button
                            type="button"
                            disabled={busyId === v.id}
                            onClick={() => void handlePublish(v)}
                            className="rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[12px] font-medium text-emerald-700 shadow-[0_1px_0_rgba(0,0,0,0.03)] transition hover:bg-[var(--apple-bg-subtle)] disabled:opacity-40 inline-flex items-center"
                          >
                            Veröffentlichen
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={busyId === v.id}
                            onClick={() => void handleUnpublish(v)}
                            className="rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[12px] font-medium text-[var(--apple-text-secondary)] shadow-[0_1px_0_rgba(0,0,0,0.03)] transition hover:bg-[var(--apple-bg-subtle)] disabled:opacity-40 inline-flex items-center"
                          >
                            Zurückziehen
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={busyId === v.id}
                          onClick={() => setDeleteTarget({ id: v.id, title: v.title })}
                          className="rounded-full border border-red-200/80 bg-white px-3 py-1.5 text-[12px] font-medium text-red-600 shadow-[0_1px_0_rgba(0,0,0,0.03)] transition hover:bg-red-50 disabled:opacity-40 inline-flex items-center"
                        >
                          Löschen
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminPageSection>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-[1.5rem] border border-black/[0.06] bg-white p-6 shadow-[0_24px_64px_rgba(0,0,0,0.18)]">
            <h3 className="text-[17px] font-semibold text-[var(--apple-text)]">Vakanz löschen?</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--apple-text-secondary)]">
              <strong className="font-medium text-[var(--apple-text)]">{deleteTarget.title}</strong> wird unwiderruflich
              gelöscht und verschwindet sofort von der öffentlichen Seite.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className={adminBtnSecondary}
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={() => void handleDelete()}
                className="inline-flex min-h-[42px] shrink-0 items-center justify-center rounded-full bg-red-600 px-5 text-[14px] font-medium text-white shadow-sm transition hover:bg-red-700 active:scale-[0.99]"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminPageContainer>
  );
}
