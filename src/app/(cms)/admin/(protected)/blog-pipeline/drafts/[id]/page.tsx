import { redirect } from "next/navigation";

import { CMS_PATHS } from "@/admin/paths";

type Props = { params: Promise<{ id: string }> };

export default async function LegacyBlogPipelineDraftDetailRedirectPage({ params }: Props) {
  const { id } = await params;
  redirect(CMS_PATHS.adminBlogAutomationDraft(id));
}
