import type { DeploymentSiteKey } from "./site";
import type { CmsSubmissionStatus, CmsSubmissionType } from "./enums";

/**
 * Well-known `payload` keys for lead forms (all optional strings in `Record`).
 * Additional custom keys are allowed up to schema limits.
 */
export type SubmissionPayloadKnownFields = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  message?: string;
  formId?: string;
};

/**
 * `submissions/{submissionId}` : form / upload intakes (Admin API or trusted server).
 */
export type Submission = {
  type: CmsSubmissionType;
  site: DeploymentSiteKey;
  payload: Record<string, string>;
  fileUrls: string[];
  status: CmsSubmissionStatus;
  createdAt: string;
  /** Set when status (or other fields) are updated in admin. */
  updatedAt: string | null;
  sourceUrl: string | null;
  userAgent: string | null;
};

export type CmsSubmission = Submission;
