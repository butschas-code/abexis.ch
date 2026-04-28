import type { PostUpsertInput } from "./dto";

/**
 * Controlled state for the post editor : aligned with `PostUpsertInput`.
 * Tags are stored as a string array; the UI may use a comma-separated text field and map via `tagsFromCommaText`.
 */
export type PostEditorFormValues = PostUpsertInput;

export function tagsFromCommaText(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 50);
}

export function commaTextFromTags(tags: string[]): string {
  return tags.join(", ");
}
