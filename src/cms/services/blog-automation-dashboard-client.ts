"use client";

/**
 * Dashboard snapshot for Blog Automation (server-computed via Admin SDK).
 */
import type { BlogAutomationDashboardSnapshot } from "@/lib/blogAutomation/cms-dashboard-types";
import type { BlogAutomationFormState } from "@/lib/blogAutomation/editorForm";

import { apiLoadBlogAutomationDashboardSnapshot } from "@/cms/services/blog-automation-cms-api-client";

export type {
  BlogAutomationDashboardSnapshot,
  BlogPipelineLogDashboardRow,
  BlogPipelineRunDashboardRow,
} from "@/lib/blogAutomation/cms-dashboard-types";

export async function loadBlogAutomationDashboardSnapshot(
  idToken: string,
  form: BlogAutomationFormState,
): Promise<BlogAutomationDashboardSnapshot> {
  return apiLoadBlogAutomationDashboardSnapshot(idToken, form);
}
