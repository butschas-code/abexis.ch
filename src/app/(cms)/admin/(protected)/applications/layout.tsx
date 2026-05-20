import type { ReactNode } from "react";
import { CmsPermissionGate } from "@/cms/auth/cms-permission-gate";

/** Bewerbungen : PII — editors and admins; full «Eingänge» inbox remains `manage_submissions` (admin). */
export default function AdminApplicationsLayout({ children }: { children: ReactNode }) {
  return <CmsPermissionGate requireAll={["manage_job_applications"]}>{children}</CmsPermissionGate>;
}
