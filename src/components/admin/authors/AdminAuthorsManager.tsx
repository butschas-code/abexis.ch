"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CMS_PATHS } from "@/admin/paths";
import { deleteAuthor, listAuthorsAdmin } from "@/cms/services/authors-admin-client";
import type { Author } from "@/cms/types/author";
import { AdminDeleteDialog } from "@/components/admin/AdminDeleteDialog";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageContainer, AdminPageHeader, AdminPageSection } from "@/components/admin/AdminPageContainer";

type Row = Author & { id: string };

export function AdminAuthorsManager() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);
  const [deleteWorking, setDeleteWorking] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listAuthorsAdmin(500);
      setRows(data);
    } catch {
      setError("Autor:innen konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(s) ||
        r.role.toLowerCase().includes(s) ||
        (r.bio ?? "").toLowerCase().includes(s) ||
        (r.slug ?? "").toLowerCase().includes(s) ||
        (r.imageUrl ?? "").toLowerCase().includes(s),
    );
  }, [rows, q]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteWorking(true);
    try {
      await deleteAuthor(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch {
      setError("Löschen ist fehlgeschlagen.");
    } finally {
      setDeleteWorking(false);
    }
  };

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Autor:innen"
        description="Personen, die auf Beiträgen erscheinen : mit Profil und Rolle."
        actions={
          <Link
            href={CMS_PATHS.adminAuthorNew}
            className="inline-flex items-center justify-center rounded-full bg-[var(--brand-900)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--brand-950)]"
          >
            Neue:r Autor:in
          </Link>
        }
      />

      <AdminPageSection>
        <p className="text-sm">
          <Link href={CMS_PATHS.adminHome} className="font-medium text-[var(--brand-900)] hover:underline">
            ← Übersicht
          </Link>
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            placeholder="Suche nach Name, Rolle oder Kurztext…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full max-w-md rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-[var(--brand-500)]/20 focus:ring-4 sm:max-w-sm"
          />
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
        ) : null}

        {loading ? (
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
            <AdminLoading compact message="Autor:innen werden geladen…" />
          </div>
        ) : filtered.length === 0 && rows.length === 0 ? (
          <AdminEmptyState
            title="Noch keine Autor:innen"
            description="Legen Sie Profile an, um sie Beiträgen zuzuweisen."
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-black/10 bg-[var(--apple-bg-subtle)] text-xs font-medium uppercase tracking-wide text-[var(--apple-text-tertiary)]">
                <tr>
                  <th className="px-4 py-3">Profil</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Rolle</th>
                  <th className="w-[1%] px-4 py-3 text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-[var(--apple-text-secondary)]">
                      Keine Treffer für diese Suche.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-black/[0.02]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[var(--apple-bg-subtle)] ring-1 ring-black/10">
                            {r.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element -- admin list thumbnail
                              <img src={r.imageUrl} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center text-xs font-medium text-[var(--apple-text-tertiary)]">
                                {r.name.slice(0, 1).toUpperCase() || "?"}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium">{r.name}</div>
                            <div className="text-xs text-[var(--apple-text-tertiary)] sm:hidden">{r.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden max-w-xs truncate px-4 py-3 text-[var(--apple-text-secondary)] sm:table-cell">
                        {r.role || ","}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <Link
                          href={CMS_PATHS.adminAuthorEdit(r.id)}
                          className="mr-3 font-medium text-[var(--brand-900)] hover:underline"
                        >
                          Bearbeiten
                        </Link>
                        <button
                          type="button"
                          className="font-medium text-red-700 hover:underline"
                          onClick={() => setDeleteTarget(r)}
                        >
                          Löschen
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </AdminPageSection>

      <AdminDeleteDialog
        open={deleteTarget != null}
        title={deleteTarget?.name ?? ""}
        entityLabel="Autor:in"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        working={deleteWorking}
      />
    </AdminPageContainer>
  );
}
