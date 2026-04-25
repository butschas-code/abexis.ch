import { CMS_PATHS } from "@/admin/paths";
import type { CmsPermission } from "@/cms/auth/permissions";

export type AdminNavItem = {
  href: string;
  label: string;
  /** Minimum permission to show and use this destination. */
  permission: CmsPermission;
};

/** Primary CMS shell navigation (order = sidebar order). */
export const ADMIN_NAV_ITEMS: readonly AdminNavItem[] = [
  { href: CMS_PATHS.adminHome, label: "Übersicht", permission: "view_dashboard" },
  { href: CMS_PATHS.adminPosts, label: "Beiträge", permission: "manage_posts" },
  { href: CMS_PATHS.adminPostNew, label: "Neuer Beitrag", permission: "manage_posts" },
  { href: CMS_PATHS.adminMedia, label: "Medien", permission: "manage_media" },
  { href: CMS_PATHS.adminCategories, label: "Kategorien", permission: "manage_categories" },
  { href: CMS_PATHS.adminAuthors, label: "Autor:innen", permission: "manage_authors" },
  { href: CMS_PATHS.adminVacancies, label: "Vakanzen", permission: "manage_vacancies" },
  { href: CMS_PATHS.adminSubmissions, label: "Eingänge", permission: "manage_submissions" },
  { href: CMS_PATHS.adminSettings, label: "Einstellungen", permission: "manage_site_settings" },
] as const;

export function adminNavItemIsActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === CMS_PATHS.adminHome) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
