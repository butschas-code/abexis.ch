import type { ApplicationBoardColumn } from "@/lib/cms/application-board";
import type { CmsSubmissionStatus } from "@/cms/types/enums";

/** German labels for Firestore `submissions.status` (full CRM set). */
export const submissionStatusLabelDe: Record<CmsSubmissionStatus, string> = {
  new: "Neu",
  reviewed: "Geprüft",
  accepted: "Angenommen",
  rejected: "Abgelehnt",
  done: "Erledigt",
  archived: "Archiviert",
  spam: "Spam",
  screening: "In Prüfung",
  interview: "Interview",
  offer: "Angebot",
  hired: "Eingestellt",
};

/** Kanban column titles on the Bewerbungen board. */
export const applicationBoardLabelDe: Record<ApplicationBoardColumn, string> = {
  new: "Neu",
  reviewed: "Geprüft",
  accepted: "Angenommen",
  rejected: "Abgelehnt",
  done: "Erledigt",
};
