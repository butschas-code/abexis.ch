import type { CmsPostListItem } from "@/cms/services/posts-client";
import type { PostStatus } from "@/cms/types/enums";

export type PostsAdminSortKey = "updatedAt" | "publishedAt" | "title";
export type PostsAdminSortOrder = "asc" | "desc";

export type PostsAdminFilterState = {
  q: string;
  status: PostStatus | "all";
  categoryId: string | "all";
  sort: PostsAdminSortKey;
  order: PostsAdminSortOrder;
};

function parseTime(iso: string | null | undefined): number {
  if (!iso) return 0;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : 0;
}

export function filterAndSortPosts(items: CmsPostListItem[], f: PostsAdminFilterState): CmsPostListItem[] {
  let rows = [...items];
  const q = f.q.trim().toLowerCase();
  if (q) {
    rows = rows.filter((p) => p.title.toLowerCase().includes(q));
  }
  if (f.status !== "all") {
    rows = rows.filter((p) => p.status === f.status);
  }
  if (f.categoryId !== "all") {
    rows = rows.filter((p) => p.categoryIds.includes(f.categoryId));
  }

  const dir = f.order === "asc" ? 1 : -1;
  rows.sort((a, b) => {
    let cmp = 0;
    if (f.sort === "title") {
      cmp = a.title.localeCompare(b.title, "de", { sensitivity: "base" });
    } else if (f.sort === "publishedAt") {
      cmp = parseTime(a.publishedAt) - parseTime(b.publishedAt);
    } else {
      cmp = parseTime(a.updatedAt) - parseTime(b.updatedAt);
    }
    return cmp * dir;
  });

  return rows;
}
