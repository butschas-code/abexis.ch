/** Post workflow — stored as string on `posts.status`. */
export const CMS_POST_STATUSES = ["draft", "published", "archived"] as const;
export type PostStatus = (typeof CMS_POST_STATUSES)[number];
export type CmsPostStatus = PostStatus;

/** Inbound lead / form record — `submissions.status`. */
export const CMS_SUBMISSION_STATUSES = [
  "new",
  "reviewed",
  "archived",
  "spam",
  "screening",
  "interview",
  "offer",
  "hired",
  "rejected",
] as const;
export type CmsSubmissionStatus = (typeof CMS_SUBMISSION_STATUSES)[number];

/** High-level submission channel — `submissions.type`. */
export const CMS_SUBMISSION_TYPES = [
  "contact",
  "executive_search",
  "application",
  "newsletter",
  "generic",
] as const;
export type CmsSubmissionType = (typeof CMS_SUBMISSION_TYPES)[number];

/** Editorial / access roles — `users.role` (custom claims may mirror this). */
export const CMS_USER_ROLES = ["admin", "editor", "viewer"] as const;
export type AppUserRole = (typeof CMS_USER_ROLES)[number];
export type CmsUserRole = AppUserRole;
