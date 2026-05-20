import type { ReactNode } from "react";
import { CmsPermissionGate } from "@/cms/auth/cms-permission-gate";

/** Bewerbungen : PII — same gate as all submissions. */
export default function AdminApplicationsLayout({ children }: { children: ReactNode }) {
  return <CmsPermissionGate requireAll={["manage_submissions"]}>{children}</CmsPermissionGate>;
}
