import type { ReactNode } from "react";
import { CmsPermissionGate } from "@/cms/auth/cms-permission-gate";

/**
 * Form intakes / PII : **admin** only in v1.
 * TODO(future-roles): allow `manage_submissions` for a dedicated lead-reviewer role without full admin.
 */
export default function AdminSubmissionsLayout({ children }: { children: ReactNode }) {
  return <CmsPermissionGate requireAll={["manage_submissions"]}>{children}</CmsPermissionGate>;
}
