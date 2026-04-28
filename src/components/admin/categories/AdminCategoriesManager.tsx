"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CMS_PATHS } from "@/admin/paths";
import { deleteCategory, listCategoriesAdmin } from "@/cms/services/categories-admin-client";
import type { Category } from "@/cms/types/category";
import type { CategorySiteKey } from "@/cms/types/category-site";
import { categorySiteLabel } from "@/lib/cms/normalize-category-site";
import { AdminDeleteDialog } from "@/components/admin/AdminDeleteDialog";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageContainer, AdminPageHeader, AdminPageSection } from "@/components/admin/AdminPageContainer";

type Row = Category & { id: string };

export function AdminCategoriesManager() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [siteFilter, setSiteFilter] = useState<CategorySiteKey | "all">("all");
  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);
  const [deleteWorking, setDeleteWorking] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listCategoriesAdmin(500);
      setRows(data);
    } catch {
      setError("Kategorien konnten nicht geladen werden.");
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
    const bySite = siteFilter === "all" ? rows : rows.filter((r) => r.site === siteFilter);
    const s = q.trim().toLowerCase();
    if (!s) return bySite;
    return bySite.filter(
      (r) =>
        r.name.toLowerCase().includes(s) ||
        r.slug.toLowerCase().includes(s) ||
        categorySiteLabel(r.site).toLowerCase().includes(s),
    );
  }, [rows, q, siteFilter]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteWorking(true);
    try {
      await deleteCategory(deleteTarget.id);
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
        title="Kategorien"
        description="Themen und Navigation : pro Website oder für beide Auftritte."
        actions={
          <Link
            href={CMS_PATHS.adminCategoryNew}
            className="inline-flex items-center justify-center rounded-full bg-[var(--brand-900)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--brand-950)]"
          >
            Neue Kategorie
          </Link>
        }
      />

      <AdminPageSection>
        <p className="text-sm">
          <Link href={CMS_PATHS.adminHome} className="font-medium text-[var(--brand-900)] hover:underline">
            ← Übersicht
          </Link>
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <input
            type="search"
            placeholder="Suche nach Name, Slug oder Site…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full max-w-md rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-[var(--brand-500)]/20 focus:ring-4 sm:max-w-sm"
          />
          <label className="flex items-center gap-2 text-sm text-[var(--apple-text-secondary)]">
            <span className="shrink-0">Site</span>
            <select
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value as CategorySiteKey | "all")}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-[var(--brand-500)]/20 focus:ring-4"
            >
              <option value="all">Alle</option>
              <option value="abexis">abexis</option>
              <option value="search">search</option>
              <option value="shared">shared</option>
            </select>
          </label>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
        ) : null}

        {loading ? (
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
            <AdminLoading compact message="Kategorien werden geladen…" />
          </div>
        ) : filtered.length === 0 && rows.length === 0 ? (
          <AdminEmptyState
            title="Noch keine Kategorien"
            description="Legen Sie eine erste Kategorie an, um Beiträge zuzuordnen."
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-black/10 bg-[var(--apple-bg-subtle)] text-xs font-medium uppercase tracking-wide text-[var(--apple-text-tertiary)]">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Slug</th>
                  <th className="px-4 py-3">Site</th>
                  <th className="w-[1%] px-4 py-3 text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-[var(--apple-text-secondary)]">
                      Keine Treffer für diese Suche.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-black/[0.02]">
                      <td className="px-4 py-3">
                        <div className="font-medium">{r.name}</div>
                        <div className="font-mono text-xs text-[var(--apple-text-tertiary)] sm:hidden">{r.slug}</div>
                      </td>
                      <td className="hidden px-4 py-3 font-mono text-[var(--apple-text-secondary)] sm:table-cell">
                        {r.slug}
                      </td>
                      <td className="px-4 py-3 text-[var(--apple-text-secondary)]">{categorySiteLabel(r.site)}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <Link
                          href={CMS_PATHS.adminCategoryEdit(r.id)}
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
        entityLabel="Kategorie"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        working={deleteWorking}
      />
    </AdminPageContainer>
  );
}
