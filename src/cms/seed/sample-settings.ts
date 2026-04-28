import { CMS_SETTINGS_GLOBAL_DOC_ID } from "@/cms/types/settings";
import type { SiteSettings } from "@/cms/types/settings";

/** Singleton document id for site settings (`settings/global`). */
export const SEED_SETTINGS_DOC_ID = CMS_SETTINGS_GLOBAL_DOC_ID;

/**
 * Starter **SiteSettings** payload for dev/staging : all contact emails are `example.com` placeholders.
 *
 * Manual follow-up in Firebase Console or CMS **Einstellungen**:
 * - Replace `example.com` addresses and phone numbers with real values before production.
 * - Confirm `switchBarLinks` hrefs match your routes.
 *
 * This object uses ISO date strings; the seed runner converts `createdAt` / `updatedAt` to server timestamps on write.
 */
export const SEED_SAMPLE_SITE_SETTINGS: Pick<SiteSettings, "contactBySite" | "footer" | "seoBySite" | "socialLinks" | "switchBarLinks"> & {
  defaultSeo?: SiteSettings["defaultSeo"];
} = {
  contactBySite: {
    abexis: {
      businessName: "Abexis GmbH (Beispiel)",
      email: "kontakt-placeholder@example.com",
      phone: "+41 43 000 00 00",
      addressLines: ["Musterstrasse 1", "8000 Zürich", "Schweiz"],
      headline: "Kontakt",
    },
    search: {
      businessName: "Abexis Executive Search (Beispiel)",
      email: "search-placeholder@example.com",
      phone: "+41 43 000 00 01",
      addressLines: ["Musterstrasse 1", "8000 Zürich", "Schweiz"],
      headline: "Kontakt Executive Search",
    },
  },
  footer: {
    copyrightHtml: "© {year} Abexis GmbH : Beispieltext".replace("{year}", String(new Date().getFullYear())),
    legalLinks: [
      { label: "Datenschutz", href: "/privacy-policy" },
      { label: "Impressum", href: "/legal-policy" },
    ],
    columns: [],
  },
  defaultSeo: {
    titleSuffix: " | Abexis",
    defaultDescription: "Managementberatung : Platzhalterbeschreibung für Suchmaschinen.",
    ogType: "website",
  },
  seoBySite: {
    abexis: {
      defaultTitle: "Abexis : Managementberatung (Beispiel)",
      defaultMetaDescription: "Platzhalter Meta-Beschreibung für die Beratungsseite.",
      titleSuffix: " | Abexis",
      ogType: "website",
    },
    search: {
      defaultTitle: "Executive Search : Beispiel",
      defaultMetaDescription: "Platzhalter für die Search-Auffindbarkeit.",
      titleSuffix: " | Abexis Search",
      ogType: "website",
    },
  },
  socialLinks: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/example-placeholder", order: 0 },
  ],
  switchBarLinks: [
    { label: "Leistungen", href: "/leistungen", site: "abexis", order: 1 },
    { label: "Kontakt", href: "/kontakt", site: "both", order: 2 },
  ],
};
