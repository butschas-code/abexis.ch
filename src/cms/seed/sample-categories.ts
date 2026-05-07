import type { Category } from "@/cms/types/category";

/**
 * Stable **document ids** for seed categories : safe to reference from sample posts or docs.
 * Replace display copy in the CMS after onboarding; IDs can stay for stable URLs and relations.
 */
export const SEED_CATEGORY_DOC_IDS = {
  strategie: "seed_cat_strategie",
  digital: "seed_cat_digital",
  fuehrung: "seed_cat_fuehrung",
  /** Insights / Karriere-Themen (Beispiel). */
  shared: "seed_cat_shared",
} as const;

/**
 * Sample categories for local / staging onboarding : **not** production copy.
 * Firestore writes should use these shapes; timestamps are applied at upload time.
 */
export const SEED_SAMPLE_CATEGORIES: ReadonlyArray<{
  id: string;
  data: Omit<Category, "createdAt" | "updatedAt">;
}> = [
  {
    id: SEED_CATEGORY_DOC_IDS.strategie,
    data: {
      name: "Strategie & Wachstum",
      slug: "strategie-wachstum",
      site: "abexis",
      description: "Beispielkategorie für Strategie- und Wachstumsthemen : Text in der Redaktion anpassen.",
      sortOrder: 10,
    },
  },
  {
    id: SEED_CATEGORY_DOC_IDS.digital,
    data: {
      name: "Digitale Transformation",
      slug: "digitale-transformation",
      site: "abexis",
      description: "Platzhalter- Beschreibung für den Bereich Digitalisierung.",
      sortOrder: 20,
    },
  },
  {
    id: SEED_CATEGORY_DOC_IDS.fuehrung,
    data: {
      name: "Führung & Organisation",
      slug: "fuehrung-organisation",
      site: "abexis",
      description: "Beispielkategorie für Führungs- und Organisationsthemen.",
      sortOrder: 30,
    },
  },
  {
    id: SEED_CATEGORY_DOC_IDS.shared,
    data: {
      name: "Gemeinsame Insights",
      slug: "gemeinsame-insights",
      site: "abexis",
      description: "Beispielkategorie für übergreifende Insights-Themen.",
      sortOrder: 40,
    },
  },
];
