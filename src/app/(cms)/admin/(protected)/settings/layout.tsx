import type { ReactNode } from "react";
import { CmsPermissionGate } from "@/cms/auth/cms-permission-gate";

/**
 * Site settings (SEO, contact, footer) : **admin** only.
 * TODO(future-roles): split `manage_site_settings` into finer permissions if needed (e.g. SEO vs legal-only).
 */
export default function AdminSettingsLayout({ children }: { children: ReactNode }) {
  return <CmsPermissionGate requireAll={["manage_site_settings"]}>{children}</CmsPermissionGate>;
}
