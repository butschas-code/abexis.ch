/** Types for `POST /api/cms/blog-automation/dashboard-snapshot` (safe for client import). */

export type BlogPipelineRunDashboardRow = {
  id: string;
  trigger: string;
  status: string;
  startedAt: string | null;
  completedAt: string | null;
  topicsProcessed: number;
  draftsCreated: number;
  socialPostsCreated: number;
  errorCount: number;
  lastErrorMessage: string | null;
};

export type BlogPipelineLogDashboardRow = {
  id: string;
  pipelineRunId: string;
  createdAt: string | null;
  level: string;
  message: string;
};

export type BlogAutomationDashboardSnapshot = {
  runs: BlogPipelineRunDashboardRow[];
  logs: BlogPipelineLogDashboardRow[];
  draftsAwaitingReview: number;
  publishedThisMonth: number;
  nextAutomaticCheckAt: string | null;
  nextLikelyDraftAt: string | null;
};
