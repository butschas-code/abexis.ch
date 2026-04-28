/**
 * Mock sample documents for Firestore seeding / tests : **not** loaded at runtime by the app.
 * Copy shapes into Emulator UI, seed scripts, or unit tests.
 */
import { CMS_SETTINGS_GLOBAL_DOC_ID } from "@/cms/types/settings";
import type { CmsAuthor } from "@/cms/types/author";
import type { CmsCategory } from "@/cms/types/category";
import type { CmsPost } from "@/cms/types/post";
import type { CmsSettings } from "@/cms/types/settings";
import type { CmsSubmission } from "@/cms/types/submission";
import type { CmsUser } from "@/cms/types/user";

/** ISO strings as stored after client/API mapping (in Firestore use Timestamp instead). */
export const mockPostSample: CmsPost = {
  title: "Strategische Klarheit in unsicheren Märkten",
  slug: "strategische-klarheit",
  excerpt: "Wie Führungsteams Entscheidungsfähigkeit stärken, ohne den operativen Alltag zu vernachlässigen.",
  body: "<p>Beispielinhalt …</p>",
  heroImageUrl: "https://example.com/hero.jpg",
  heroImageAlt: "Beispiel-Titelbild",
  heroImagePath: null,
  authorId: "author_anna_muster",
  categoryIds: ["cat_strategy"],
  tags: ["Strategie", "Führung"],
  site: "abexis",
  status: "published",
  publishedAt: "2026-01-15T10:00:00.000Z",
  createdAt: "2026-01-10T08:00:00.000Z",
  updatedAt: "2026-01-15T10:00:00.000Z",
  seoTitle: "Strategische Klarheit | Abexis",
  seoDescription: "Kurzbeschreibung für Suchmaschinen …",
  featured: true,
};

export const mockAuthorSample: CmsAuthor = {
  name: "Anna Muster",
  role: "Partnerin, Strategie",
  imageUrl: "https://example.com/anna.jpg",
  bio: "Beratungsschwerpunkt: Wachstum und Organisation.",
  slug: "anna-muster",
  email: "anna@example.com",
  authUid: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

export const mockCategorySample: CmsCategory = {
  name: "Strategie",
  slug: "strategie",
  site: "abexis",
  description: "Beiträge zur Unternehmensstrategie",
  sortOrder: 10,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

export const mockSettingsSample: CmsSettings = {
  contactBySite: {
    abexis: {
      businessName: "Abexis AG",
      email: "kontakt@abexis.ch",
      phone: "+41 44 000 00 00",
      addressLines: ["Musterstrasse 1", "8000 Zürich"],
      headline: "Kontakt",
    },
    search: {
      businessName: "Abexis Executive Search",
      email: "talent@abexis-search.ch",
      phone: "+41 44 000 00 01",
      addressLines: ["Musterstrasse 1", "8000 Zürich"],
      headline: null,
    },
  },
  footer: {
    copyrightHtml: "© 2026 Abexis AG",
    legalLinks: [
      { label: "Datenschutz", href: "/privacy-policy" },
      { label: "Impressum", href: "/legal-policy" },
    ],
    columns: [],
  },
  defaultSeo: {
    titleSuffix: " | Abexis",
    defaultDescription: "Managementberatung und Executive Search.",
    ogType: "website",
  },
  seoBySite: {
    abexis: {
      defaultTitle: "Abexis : Managementberatung",
      defaultMetaDescription: "Strategie, Transformation und Leadership in Schweizer KMU.",
      titleSuffix: " | Abexis",
      ogType: "website",
    },
    search: {
      defaultTitle: "Executive Search",
      defaultMetaDescription: "Führungskräfte finden und binden.",
      titleSuffix: " | Abexis Search",
      ogType: "website",
    },
  },
  socialLinks: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/example", order: 0 },
  ],
  switchBarLinks: [
    { label: "Executive Search", href: "/leistungen/executive-search", site: "abexis", order: 1 },
    { label: "Kontakt", href: "/kontakt", site: "both", order: 2 },
  ],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

export const mockSubmissionSample: CmsSubmission = {
  type: "contact",
  site: "abexis",
  payload: {
    name: "Max Beispiel",
    message: "Wir möchten ein Erstgespräch vereinbaren.",
  },
  fileUrls: [],
  status: "new",
  createdAt: "2026-02-01T12:30:00.000Z",
  updatedAt: null,
  sourceUrl: "https://www.abexis.ch/kontakt",
  userAgent: "Mozilla/5.0 …",
};

export const mockUserSample: CmsUser = {
  uid: "firebaseAuthUidExample123",
  email: "editor@abexis.ch",
  role: "editor",
  displayName: "Redaktion Abexis",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

/** Document id for singleton settings row. */
export const mockSettingsDocId = CMS_SETTINGS_GLOBAL_DOC_ID;
