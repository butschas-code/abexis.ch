import { redirect } from "next/navigation";

import { CMS_PATHS } from "@/admin/paths";

export default function LegacyBlogPipelineDraftsRedirectPage() {
  redirect(CMS_PATHS.adminBlogAutomationDrafts);
}
