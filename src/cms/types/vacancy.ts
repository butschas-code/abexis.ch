import type { PostStatus } from "./enums";
import type { SiteKey } from "./site";

export type { PostStatus } from "./enums";

/** Downloadable file attached to a vacancy (PDF, brief, etc.). */
export type VacancyFile = {
  label: string;
  url: string;
};

/**
 * `vacancies/{vacancyId}` : Executive Search job postings.
 * Body is stored in the same JSON envelope as blog posts (see `post-body-storage.ts`).
 */
export type VacancyJobKind = "vacancy" | "spontanbewerbung";

export type Vacancy = {
  title: string;
  slug: string;
  /** Short teaser shown on listing cards and homepage strip. */
  excerpt: string;
  sector: string;
  location: string;
  employmentType: string;
  /** Classifies the posting for applications and CMS (general spontaneous entry vs. a concrete mandate). */
  jobType: VacancyJobKind;
  /** When true, the posting is excluded from public vacancy listings (general spontaneous application). */
  isSpontaneous: boolean;
  /** Attention-grabbing hook shown in the hero. */
  hook: string;
  /** Rich text body : JSON envelope `{ format, version, html }`. */
  body: string;
  /** Downloadable attachments (PDF briefs, etc.). */
  files: VacancyFile[];
  /** Short call-to-action / application instructions shown below the body. */
  apply: string;
  site: SiteKey;
  status: PostStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
