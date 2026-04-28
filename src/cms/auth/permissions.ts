import type { AppUserRole } from "@/cms/types/enums";

/**
 * Fine-grained CMS capabilities. Use these for route guards and UI : not raw role string checks : so new roles
 * or rule changes stay localized.
 *
 * TODO(future-roles): When adding roles (e.g. `moderator`, `translator`), extend {@link ROLE_PERMISSIONS} only.
 * TODO(security): Mirror critical rules in Firestore Security Rules / Admin API so UI restrictions are not the sole enforcement.
 */
export const CMS_PERMISSIONS = [
  "view_dashboard",
  "manage_posts",
  "manage_media",
  "manage_categories",
  "manage_authors",
  /** Form intakes, PII : admin only in v1. */
  "manage_submissions",
  /** Site settings, SEO blocks, legal/contact config : admin only. */
  "manage_site_settings",
  /** Executive Search vacancy/mandate postings. */
  "manage_vacancies",
] as const;

export type CmsPermission = (typeof CMS_PERMISSIONS)[number];

/**
 * Explicit grant list per role. `admin` is handled as a superset in {@link roleHasPermission}.
 * `viewer` is never granted CMS UI access via this matrix : see {@link canAccessCmsDashboard}.
 */
const EDITOR_PERMISSIONS: ReadonlySet<CmsPermission> = new Set([
  "view_dashboard",
  "manage_posts",
  "manage_media",
  "manage_categories",
  "manage_authors",
  "manage_vacancies",
]);

/** @deprecated Prefer {@link roleHasPermission} with a concrete permission. Kept for existing imports. */
export const CMS_EDITOR_ROLES: readonly AppUserRole[] = ["admin", "editor"];

/** @deprecated Prefer `'manage_site_settings'` / `'manage_submissions'` checks. */
export const CMS_ADMIN_ONLY_ROLES: readonly AppUserRole[] = ["admin"];

export function canAccessCmsDashboard(role: AppUserRole | null | undefined): boolean {
  if (!role) return false;
  return role === "admin" || role === "editor";
}

export function isCmsAdminRole(role: AppUserRole | null | undefined): boolean {
  return role === "admin";
}

/**
 * @param allowed : legacy API: list of roles that may pass (typically `['admin']`).
 */
export function userHasAnyCmsRole(
  userRole: AppUserRole | null | undefined,
  allowed: readonly AppUserRole[],
): boolean {
  if (!userRole) return false;
  return allowed.includes(userRole);
}

export function roleHasPermission(role: AppUserRole | null | undefined, permission: CmsPermission): boolean {
  if (!role) return false;
  if (role === "admin") return true;
  if (role === "viewer") return false;
  if (role === "editor") return EDITOR_PERMISSIONS.has(permission);
  return false;
}

/** Returns true if the role may perform every listed permission. */
export function roleHasAllPermissions(
  role: AppUserRole | null | undefined,
  permissions: readonly CmsPermission[],
): boolean {
  return permissions.every((p) => roleHasPermission(role, p));
}
