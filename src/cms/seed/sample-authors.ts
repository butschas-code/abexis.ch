import type { Author } from "@/cms/types/author";

/**
 * Stable seed author document ids.
 * Use `authorImageUrlPlaceholder: null` : upload portraits in **Medien** after onboarding.
 */
export const SEED_AUTHOR_DOC_IDS = {
  sampleEditorial: "seed_author_editorial",
  sampleSearch: "seed_author_search",
} as const;

/**
 * Fictitious placeholder names only : replace in CMS before go-live.
 * Do **not** map to `authUid` here; link Firebase Auth users manually if needed (see seed index comments).
 */
export const SEED_SAMPLE_AUTHORS: ReadonlyArray<{
  id: string;
  data: Omit<Author, "createdAt" | "updatedAt">;
}> = [
  {
    id: SEED_AUTHOR_DOC_IDS.sampleEditorial,
    data: {
      name: "Redaktion Beispiel",
      role: "Editorial (Beispiel)",
      imageUrl: null,
      bio: "Kurzer Platzhalter für die Autorenbox : ersetzen Sie diesen Text in «Autor:innen».",
      slug: "redaktion-beispiel",
      email: "editorial-placeholder@example.com",
      authUid: null,
    },
  },
  {
    id: SEED_AUTHOR_DOC_IDS.sampleSearch,
    data: {
      name: "Beratung Executive Search (Beispiel)",
      role: "Partner",
      imageUrl: null,
      bio: "Platzhalter für Fachautor:innen auf der Search-Site.",
      slug: "beratung-search-beispiel",
      email: "search-placeholder@example.com",
      authUid: null,
    },
  },
];
