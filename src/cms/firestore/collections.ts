/** Firestore top-level collection ids : keep in sync with `firestore.rules` and indexes. */
export const COLLECTIONS = {
  authors: "authors",
  categories: "categories",
  posts: "posts",
  /** Form / file intakes (replaces legacy `formSubmissions`). */
  submissions: "submissions",
  /** Singleton-style config; prefer doc id `global` (`CMS_SETTINGS_GLOBAL_DOC_ID`). */
  settings: "settings",
  /** Optional CMS role metadata; doc id = Auth uid. */
  users: "users",
  /** CMS library uploads + registered hero/body/submission assets (metadata + Storage path). */
  media: "media",
  /** Executive Search job postings : each doc is one vacancy/mandate. */
  vacancies: "vacancies",
  /** Singleton-style automation prefs for the blog pipeline (`blogAutomationSettings/default`). */
  blogAutomationSettings: "blogAutomationSettings",
  /** Editorial queue for automated blog research/drafts (cron pipeline). */
  blogTopics: "blogTopics",
  /** AI-generated article drafts pending human review (never auto-published). */
  blogDrafts: "blogDrafts",
  /** AI-generated social copy linked to a draft; pending human review. */
  blogSocialPosts: "blogSocialPosts",
  /** One record per cron/manual pipeline batch for auditing. */
  blogPipelineRuns: "blogPipelineRuns",
  /** Structured log lines linked to {@link COLLECTIONS.blogPipelineRuns}. */
  blogPipelineLogs: "blogPipelineLogs",
} as const;

export type CmsCollectionId = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
