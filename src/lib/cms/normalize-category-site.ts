import type { CategorySiteKey } from "@/cms/types/category-site";

/** Maps Firestore / legacy values to the single canonical `CategorySiteKey`. */
export function normalizeCategorySite(_raw: string | undefined | null): CategorySiteKey {
  return "abexis";
}

export function categorySiteLabel(_key: CategorySiteKey): string {
  return "abexis";
}
