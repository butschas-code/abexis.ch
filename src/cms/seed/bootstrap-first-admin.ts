import type { AppUserRole } from "@/cms/types/enums";

/**
 * -----------------------------------------------------------------------------
 * First admin user : **manual steps in Firebase Console** (no production emails here)
 * -----------------------------------------------------------------------------
 *
 * 1) **Authentication**
 *    - Open Firebase Console → **Build** → **Authentication** → **Users**.
 *    - **Add user**: enter the real work email and a strong initial password (or send password reset later).
 *    - Copy the new user’s **User UID** (you need it for step 2).
 *
 * 2) **Firestore profile** (`users/{uid}`)
 *    - Open **Firestore Database** → collection **`users`**.
 *    - Create document **ID = exact UID** from Authentication (step 1).
 *    - Paste fields from {@link buildFirstAdminUserFirestoreFields} (merge with server timestamps when using the
 *      Admin seed script pattern, or set ISO strings if editing manually).
 *    - Field **`role`** must be **`admin`** for full CMS access (see RBAC in `src/cms/auth/permissions.ts`).
 *
 * 3) **Optional : Custom claims** (future)
 *    - If you later sync `role` to Firebase Auth custom claims for server-side checks, deploy a Cloud Function or
 *      use the Admin SDK in a trusted environment. TODO: document when implemented.
 *
 * 4) **Security rules**
 *    - Ensure Firestore rules restrict `users/{uid}` writes to admins or service accounts : editors must not
 *      edit arbitrary user documents.
 *
 * **Never** commit service account JSON or real user passwords into the repo.
 * -----------------------------------------------------------------------------
 */

export type FirstAdminUserInput = {
  /** Firebase Authentication user id (same as Firestore document id under `users`). */
  uid: string;
  /** Must match the email on the Auth user record : used for display / audit in CMS. */
  email: string;
  displayName: string;
  /**
   * Defaults to `admin` for the first bootstrap account.
   * TODO(future-roles): allow `editor` for secondary invites while keeping bootstrap admin-only flow documented here.
   */
  role?: "admin";
};

/**
 * Serializable Firestore fields for `users/{uid}` (no `FieldValue` : callers add timestamps server-side).
 * Does not write anything by itself.
 */
export function buildFirstAdminUserFirestoreFields(input: FirstAdminUserInput): {
  uid: string;
  email: string;
  displayName: string;
  role: AppUserRole;
} {
  return {
    uid: input.uid.trim(),
    email: input.email.trim(),
    displayName: input.displayName.trim(),
    role: input.role ?? "admin",
  };
}

/**
 * Human-readable checklist for README / onboarding docs : safe to log in dev tooling.
 * Still does not contain real credentials; replace placeholders in your runbook.
 */
export const FIRST_ADMIN_CONSOLE_CHECKLIST = `
[ ] Firebase Console → Authentication → create user → copy UID
[ ] Firestore → users → document id = UID → fields: email, displayName, role: admin
[ ] Confirm CMS login at /admin/login with that email
`.trim();
