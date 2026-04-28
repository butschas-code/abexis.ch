import type { AppUserRole } from "./enums";

/**
 * `users/{uid}` : CMS profile (document id **must** equal Firebase Auth `uid`).
 *
 * **Role (`role`):** drives {@link import("../auth/permissions").roleHasPermission | RBAC} for the admin UI.
 * Create/update documents via Firebase Console or a future admin-only user screen : not from public clients.
 *
 * TODO(future-roles): optional fields like `lastLoginAt`, `invitedBy` for audit trails.
 */
export type AppUser = {
  uid: string;
  email: string;
  role: AppUserRole;
  displayName: string;
  createdAt: string;
  updatedAt: string;
};

export type CmsUser = AppUser;
