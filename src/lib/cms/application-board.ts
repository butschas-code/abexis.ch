import type { CmsSubmissionStatus } from "@/cms/types/enums";

/** Kanban columns shown on the Bewerbungen board (maps legacy CRM statuses into one column). */
export const APPLICATION_BOARD_COLUMNS = ["new", "reviewed", "accepted", "rejected", "done"] as const;
export type ApplicationBoardColumn = (typeof APPLICATION_BOARD_COLUMNS)[number];

/**
 * Places a submission into a board column. Technical statuses (`screening` … `offer`) roll up to
 * `accepted`; `hired` / `archived` close as `done`.
 */
export function applicationBoardColumn(status: CmsSubmissionStatus): ApplicationBoardColumn {
  switch (status) {
    case "new":
      return "new";
    case "reviewed":
      return "reviewed";
    case "rejected":
    case "spam":
      return "rejected";
    case "done":
    case "archived":
    case "hired":
      return "done";
    case "accepted":
    case "screening":
    case "interview":
    case "offer":
      return "accepted";
  }
}
