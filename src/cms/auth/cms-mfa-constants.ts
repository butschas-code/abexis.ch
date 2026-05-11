/** Firestore: enrolled TOTP secrets (Admin SDK only — deny all in security rules). */
export const CMS_TOTP_COLLECTION = "cms_totp";

/** Firestore: transient enrollment material before first successful code. */
export const CMS_TOTP_PENDING_COLLECTION = "cms_totp_pending";

/** HTTP-only cookie — proves this browser completed the app-code step for `uid`. */
export const CMS_MFA_SESSION_COOKIE_NAME = "abexis_cms_mfa_v1";

/** MFA browser session length after successful TOTP (seconds). */
export const CMS_MFA_SESSION_TTL_SEC = 14 * 24 * 60 * 60;
