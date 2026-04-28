"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CMS_PATHS } from "@/admin/paths";
import { listAuthorsForAdmin, listCategoriesForAdmin } from "@/cms/services/content-lookup-client";
import type { CategoryOption } from "@/cms/services/content-lookup-client";
import {
  cmsPostListItemToUpsert,
  deletePost,
  duplicatePost,
  savePost,
} from "@/cms/services/post-write-client";
import { listPostsForAdmin, type CmsPostListItem } from "@/cms/services/posts-client";
import type { PostStatus } from "@/cms/types/enums";
import type { SiteKey } from "@/cms/types/site";
import { parsePostUpsert } from "@/cms/schema";
import { filterAndSortPosts, type PostsAdminFilterState } from "@/lib/cms/posts-admin-filter";
import {
  adminBtnGhost,
  adminBtnPrimary,
  adminFeedbackInfo,
  adminInput,
  adminPanelInset,
  adminPill,
  adminTableWrap,
} from "@/components/admin/admin-ui";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageContainer, AdminPageHeader, AdminPageSection } from "@/components/admin/AdminPageContainer";
import { PostsDeleteDialog } from "./PostsDeleteDialog";
import { PostsRowMenu } from "./PostsRowMenu";

const siteLabel: Record<SiteKey, string> = {
  abexis: "abexis.ch",
  search: "Search",
  both: "Beide",
};

const statusLabel: Record<PostStatus, string> = {
  draft: "Entwurf",
  published: "Live",
  archived: "Archiv",
};

function formatWhen(iso: string | null) {
  if (!iso) return ",";
  try {
    return new Intl.DateTimeFormat("de-CH", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return ",";
  }
}

function parseStatus(v: string | null): PostStatus | "all" {
  if (v === "draft" || v === "published" || v === "archived") return v;
  return "all";
}

function parseSite(v: string | null): SiteKey | "all" {
  if (v === "abexis" || v === "search" || v === "both") return v;
  return "all";
}

function parseSort(v: string | null): PostsAdminFilterState["sort"] {
  if (v === "publishedAt" || v === "title") return v;
  return "updatedAt";
}

function parseOrder(v: string | null): PostsAdminFilterState["order"] {
  return v === "asc" ? "asc" : "desc";
}

function buildFilterFromParams(searchParams: URLSearchParams, qLocal: string): PostsAdminFilterState {
  return {
    q: qLocal,
    status: parseStatus(searchParams.get("status")),
    site: parseSite(searchParams.get("site")),
    categoryId: searchParams.get("category")?.trim() || "all",
    sort: parseSort(searchParams.get("sort")),
    order: parseOrder(searchParams.get("order")),
  };
}

export function AdminPostsManager() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [qLocal, setQLocal] = useState("");
  const [allPosts, setAllPosts] = useState<CmsPostListItem[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [authors, setAuthors] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [deleteWorking, setDeleteWorking] = useState(false);

  const authorById = useMemo(() => new Map(authors.map((a) => [a.id, a.name])), [authors]);

  const searchKey = searchParams.toString();
  const filter = useMemo(
    () => buildFilterFromParams(new URLSearchParams(searchKey), qLocal),
    [searchKey, qLocal],
  );

  const visiblePosts = useMemo(() => filterAndSortPosts(allPosts, filter), [allPosts, filter]);

  const syncUrl = useCallback(
    (patch: Partial<Record<string, string | null>>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v === undefined) continue;
        if (v === null || v === "" || v === "all") next.delete(k);
        else next.set(k, v);
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [rows, cats, auths] = await Promise.all([
        listPostsForAdmin(500),
        listCategoriesForAdmin(200),
        listAuthorsForAdmin(200),
      ]);
      setAllPosts(rows);
      setCategories(cats);
      setAuthors(auths);
    } catch {
      setError("Beiträge konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void reload();
    });
  }, [reload]);

  const qFromUrl = searchParams.get("q") ?? "";
  useEffect(() => {
    queueMicrotask(() => {
      setQLocal(qFromUrl);
    });
  }, [qFromUrl]);

  async function handlePublish(post: CmsPostListItem) {
    setBusyId(post.id);
    setBanner(null);
    try {
      const next = { ...cmsPostListItemToUpsert(post), status: "published" as const };
      const parsed = parsePostUpsert(next);
      if (!parsed.success) throw new Error(parsed.error.issues.map((i) => i.message).join(" · "));
      await savePost(parsed.data);
      await reload();
      setBanner("Beitrag veröffentlicht.");
    } catch (e) {
      setBanner(e instanceof Error ? e.message : "Veröffentlichen fehlgeschlagen.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleUnpublish(post: CmsPostListItem) {
    setBusyId(post.id);
    setBanner(null);
    try {
      const next = { ...cmsPostListItemToUpsert(post), status: "draft" as const };
      const parsed = parsePostUpsert(next);
      if (!parsed.success) throw new Error(parsed.error.issues.map((i) => i.message).join(" · "));
      await savePost(parsed.data);
      await reload();
      setBanner("Beitrag zurückgezogen (Entwurf).");
    } catch (e) {
      setBanner(e instanceof Error ? e.message : "Zurückziehen fehlgeschlagen.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDuplicate(post: CmsPostListItem) {
    setBusyId(post.id);
    setBanner(null);
    try {
      const newId = await duplicatePost(post.id);
      await reload();
      router.push(CMS_PATHS.adminPostEdit(newId));
    } catch (e) {
      setBanner(e instanceof Error ? e.message : "Duplizieren fehlgeschlagen.");
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleteWorking(true);
    setBanner(null);
    try {
      await deletePost(deleteTarget.id);
      setDeleteTarget(null);
      await reload();
      setBanner("Beitrag gelöscht.");
    } catch (e) {
      setBanner(e instanceof Error ? e.message : "Löschen fehlgeschlagen.");
    } finally {
      setDeleteWorking(false);
    }
  }

  const statusFilter = parseStatus(searchParams.get("status"));
  const siteFilter = parseSite(searchParams.get("site"));
  const categoryFilter = searchParams.get("category")?.trim() || "all";

  const description =
    statusFilter !== "all" || siteFilter !== "all" || categoryFilter !== "all" || qLocal.trim()
      ? "Gefilterte und sortierte Liste : bis zu 500 zuletzt bearbeitete Beiträge aus der Datenbank."
      : "Bis zu 500 zuletzt bearbeitete Beiträge. Suche und Filter wirken auf diese Auswahl.";

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Beiträge"
        description={description}
        actions={
          <Link href={CMS_PATHS.adminPostNew} className={adminBtnPrimary}>
            Neuer Beitrag
          </Link>
        }
      />

      {(statusFilter !== "all" ||
        siteFilter !== "all" ||
        categoryFilter !== "all" ||
        searchParams.get("sort") ||
        searchParams.get("order") ||
        qLocal.trim()) && (
        <p className="text-[15px] text-[var(--apple-text-secondary)]">
          <button
            type="button"
            className={`${adminBtnGhost} -ml-1`}
            onClick={() => {
              setQLocal("");
              router.replace(pathname, { scroll: false });
            }}
          >
            Alle Filter zurücksetzen
          </button>
        </p>
      )}

      <AdminPageSection className="space-y-4">
        <div className={adminPanelInset}>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--apple-text-tertiary)]">
            Filtern & sortieren
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
            <label className="block min-w-[min(100%,220px)] flex-1">
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--apple-text)]">Suche (Titel)</span>
              <input
                type="search"
                value={qLocal}
                onChange={(e) => setQLocal(e.target.value)}
                placeholder="Titel enthält…"
                className={`${adminInput} bg-[var(--apple-bg-subtle)]`}
              />
            </label>
            <label className="block w-full min-w-[140px] sm:w-40">
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--apple-text)]">Status</span>
              <select
                className={adminInput}
                value={statusFilter}
                onChange={(e) => syncUrl({ status: e.target.value === "all" ? null : e.target.value })}
              >
                <option value="all">Alle</option>
                <option value="draft">Entwurf</option>
                <option value="published">Live</option>
                <option value="archived">Archiv</option>
              </select>
            </label>
            <label className="block w-full min-w-[140px] sm:w-40">
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--apple-text)]">Website</span>
              <select className={adminInput}
                value={siteFilter}
                onChange={(e) => syncUrl({ site: e.target.value === "all" ? null : e.target.value })}
              >
                <option value="all">Alle</option>
                <option value="abexis">abexis.ch</option>
                <option value="search">Search</option>
                <option value="both">Beide</option>
              </select>
            </label>
            <label className="block w-full min-w-[180px] sm:min-w-[200px] sm:flex-1">
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--apple-text)]">Kategorie</span>
              <select className={adminInput}
                value={categoryFilter}
                onChange={(e) => syncUrl({ category: e.target.value === "all" ? null : e.target.value })}
              >
                <option value="all">Alle</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block w-full min-w-[160px] sm:w-44">
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--apple-text)]">Sortierung</span>
              <select className={adminInput}
                value={`${filter.sort}:${filter.order}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split(":") as [
                    PostsAdminFilterState["sort"],
                    PostsAdminFilterState["order"],
                  ];
                  const isDefault = sort === "updatedAt" && order === "desc";
                  if (isDefault) syncUrl({ sort: null, order: null });
                  else syncUrl({ sort, order });
                }}
              >
                <option value="updatedAt:desc">Bearbeitet (neu zuerst)</option>
                <option value="updatedAt:asc">Bearbeitet (alt zuerst)</option>
                <option value="publishedAt:desc">Veröffentlicht (neu zuerst)</option>
                <option value="publishedAt:asc">Veröffentlicht (alt zuerst)</option>
                <option value="title:asc">Titel A-Z</option>
                <option value="title:desc">Titel Z-A</option>
              </select>
            </label>
          </div>
        </div>

        {banner ? <div className={adminFeedbackInfo}>{banner}</div> : null}

        {error ? (
          <div className="rounded-[1rem] border border-red-200/95 bg-red-50 px-4 py-3 text-[14px] leading-snug text-red-900">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className={`${adminTableWrap} overflow-hidden`}>
            <AdminLoading compact message="Beiträge werden geladen…" />
          </div>
        ) : allPosts.length === 0 ? (
          <AdminEmptyState
            title="Noch keine Beiträge"
            description="Sobald Inhalte angelegt sind, erscheinen sie hier."
            action={{ label: "Ersten Beitrag anlegen", href: CMS_PATHS.adminPostNew }}
          />
        ) : visiblePosts.length === 0 ? (
          <div className="rounded-[1.25rem] border border-dashed border-black/[0.1] bg-[color-mix(in_srgb,var(--apple-bg-subtle)_50%,var(--apple-bg-elevated))] px-8 py-14 text-center">
            <p className="font-serif text-[1.2rem] font-medium text-[var(--apple-text)]">Keine Treffer</p>
            <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-[var(--apple-text-secondary)]">
              Passe Suche oder Filter an : oder setzen Sie die Filter zurück.
            </p>
            <button
              type="button"
              className={`${adminBtnGhost} mt-6`}
              onClick={() => {
                setQLocal("");
                router.replace(pathname, { scroll: false });
              }}
            >
              Alle Filter zurücksetzen
            </button>
          </div>
        ) : (
          <div className={adminTableWrap}>
            <table className="w-full min-w-[880px] text-left text-[15px]">
              <thead className="border-b border-black/[0.07] bg-[color-mix(in_srgb,var(--apple-bg-subtle)_70%,white)] text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-text-tertiary)]">
                <tr>
                  <th className="px-4 py-3.5 pl-5">Titel</th>
                  <th className="px-4 py-3.5">Website</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="hidden px-4 py-3.5 lg:table-cell">Autor:in</th>
                  <th className="hidden px-4 py-3.5 md:table-cell">Bearbeitet</th>
                  <th className="hidden px-4 py-3.5 xl:table-cell">Veröffentlicht</th>
                  <th className="px-4 py-3.5 pr-5 text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06]">
                {visiblePosts.map((p) => (
                  <tr
                    key={p.id}
                    className={
                      busyId === p.id
                        ? "bg-[var(--apple-bg-subtle)]/80 opacity-[0.72]"
                        : "transition-colors hover:bg-[color-mix(in_srgb,var(--apple-bg-subtle)_42%,white)]"
                    }
                  >
                    <td className="max-w-[280px] px-4 py-3.5 pl-5">
                      <Link
                        href={CMS_PATHS.adminPostEdit(p.id)}
                        className="font-medium text-[var(--apple-text)] hover:text-[var(--brand-900)]"
                      >
                        {p.title || "(ohne Titel)"}
                      </Link>
                      <div className="mt-0.5 font-mono text-[11px] text-[var(--apple-text-tertiary)]">{p.slug}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-[var(--apple-text-secondary)]">
                      {siteLabel[p.site]}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`${adminPill} whitespace-nowrap`}>{statusLabel[p.status]}</span>
                    </td>
                    <td className="hidden max-w-[160px] truncate px-4 py-3.5 text-[var(--apple-text-secondary)] lg:table-cell">
                      {authorById.get(p.authorId) ?? (p.authorId && p.authorId !== "_" ? p.authorId : ",")}
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-3.5 text-[var(--apple-text-secondary)] md:table-cell">
                      {formatWhen(p.updatedAt)}
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-3.5 text-[var(--apple-text-secondary)] xl:table-cell">
                      {formatWhen(p.publishedAt)}
                    </td>
                    <td className="px-4 py-3.5 pr-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={CMS_PATHS.adminPostEdit(p.id)}
                          className="hidden rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[12px] font-medium text-[var(--brand-900)] shadow-[0_1px_0_rgba(0,0,0,0.03)] transition hover:bg-[var(--apple-bg-subtle)] sm:inline-flex sm:items-center"
                        >
                          Bearbeiten
                        </Link>
                        <PostsRowMenu
                          post={p}
                          busy={busyId === p.id}
                          onDuplicate={() => void handleDuplicate(p)}
                          onDelete={() => setDeleteTarget({ id: p.id, title: p.title })}
                          onPublish={() => void handlePublish(p)}
                          onUnpublish={() => void handleUnpublish(p)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminPageSection>

      <PostsDeleteDialog
        open={deleteTarget != null}
        title={deleteTarget?.title ?? ""}
        working={deleteWorking}
        onCancel={() => {
          if (!deleteWorking) setDeleteTarget(null);
        }}
        onConfirm={() => void confirmDelete()}
      />
    </AdminPageContainer>
  );
}
