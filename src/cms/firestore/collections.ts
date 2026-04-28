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
} as const;

export type CmsCollectionId = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
