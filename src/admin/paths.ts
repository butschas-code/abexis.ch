/** Central path constants for CMS admin + auth (keep links consistent). */
export const CMS_PATHS = {
  /** CMS sign-in (outside the protected admin shell). */
  authLogin: "/admin/login",
  /** Verify Firebase Auth email (required before TOTP enrollment). */
  adminVerifyEmail: "/admin/verify-email",
  /** Register Authenticator (TOTP) as second factor. */
  adminMfaSetup: "/admin/mfa-setup",
  /** App-code step when already enrolled but MFA cookie expired (custom TOTP). */
  adminMfaChallenge: "/admin/mfa-challenge",
  adminHome: "/admin",
  adminPosts: "/admin/posts",
  adminPostNew: "/admin/posts/new",
  /** Form intakes (canonical). */
  adminSubmissions: "/admin/submissions",
  /** @deprecated Use `adminSubmissions`; kept for redirects. */
  adminForms: "/admin/forms",
  adminMedia: "/admin/media",
  adminCategories: "/admin/categories",
  adminCategoryNew: "/admin/categories/new",
  adminCategoryEdit: (id: string) => `/admin/categories/${id}` as const,
  adminAuthors: "/admin/authors",
  adminAuthorNew: "/admin/authors/new",
  adminAuthorEdit: (id: string) => `/admin/authors/${id}` as const,
  adminSettings: "/admin/settings",
  adminPostEdit: (id: string) => `/admin/posts/${id}` as const,
  adminVacancies: "/admin/vacancies",
  adminVacancyNew: "/admin/vacancies/new",
  adminVacancyEdit: (id: string) => `/admin/vacancies/${id}` as const,
} as const;
