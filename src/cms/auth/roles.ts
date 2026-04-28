/**
 * @deprecated Import from `@/cms/auth/permissions` for new code : this file re-exports for backwards compatibility.
 */
export {
  canAccessCmsDashboard,
  CMS_ADMIN_ONLY_ROLES,
  CMS_EDITOR_ROLES,
  isCmsAdminRole,
  userHasAnyCmsRole,
} from "./permissions";

export type { CmsPermission } from "./permissions";
