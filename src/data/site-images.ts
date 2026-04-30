/**
 * Bild-URLs von abexis.ch (files.designer.hoststar.ch), per Scrape der Live-Seiten ermittelt.
 * Rohdaten: `src/data/scraped-images-raw.json` (z. B. mit `node scripts/scrape-images.mjs` erneuern).
 */
import scrapedRaw from "./scraped-images-raw.json";

const scraped = scrapedRaw as Record<string, string[]>;
const HOME = scraped["https://www.abexis.ch/"]!;
const BLOG_PAGE = scraped["https://www.abexis.ch/blog"]!;

/** Logo oben links (Original-Website) */
export const logoUrl = HOME[0];

/** Dekoratives Element von der Startseite (optional als Textur) */
export const homeTextureBar = HOME[1];

/** Kachel-Bilder der sechs Fokusthemen, Reihenfolge wie auf der alten Startseite */
export const serviceCardImages = {
  projectfitcheck: "https://firebasestorage.googleapis.com/v0/b/abexis-cms.firebasestorage.app/o/cms%2Fmedia%2Fsite%2Feditorial-insights.jpg?alt=media",
  "executive-search": "https://firebasestorage.googleapis.com/v0/b/abexis-cms.firebasestorage.app/o/cms%2Fmedia%2Fsite%2Fexecutive-unsplash.jpg?alt=media",
  "digitale-transformation": HOME[2],
  unternehmensstrategie: HOME[3],
  vertriebmarketing: HOME[4],
  veränderungsmanagement: HOME[5],
  prozessoptimierung: HOME[6],
  projektmanagement: HOME[7],
} as const;

/** Breites Teaser-Bild unter der Blog-Liste (nicht HOME[8] / 68671b2e : dort früheres Blog-Teaser) */
export const homeBlogTeaserImage = HOME[29];

/** Team-Portraits (Reihenfolge wie auf der alten Startseite) */
export const teamPortraitOrder = HOME.slice(15, 21);

/** Partner-Logos (Reihenfolge wie `footerPartners`): `HOME[22..36]` (nach Entfernen des lokalen Executive-Search-Links in der Liste). */
export const partnershipBannerLogos = HOME.slice(22, 37);

/** Grosse Hero-Fotos aus den Fokusthemen-Detailseiten (ohne Logo) */
export const fokusPageHeroImages = {
  "digitale-transformation": (scraped["https://www.abexis.ch/fokusthemen/digitale-transformation"] as string[])[1],
  unternehmensstrategie: (scraped["https://www.abexis.ch/fokusthemen/unternehmensstrategie"] as string[])[1],
  vertriebmarketing: (scraped["https://www.abexis.ch/fokusthemen/vertriebmarketing"] as string[])[1],
  veränderungsmanagement: (scraped["https://www.abexis.ch/fokusthemen/ver%C3%A4nderungsmanagement"] as string[])[1],
  prozessoptimierung: (scraped["https://www.abexis.ch/fokusthemen/prozessoptimierung"] as string[])[1],
  projektmanagement: (scraped["https://www.abexis.ch/fokusthemen/projektmanagement"] as string[])[1],
} as const;

/** Startseiten-Hero: eigenes Bild, in Firebase Storage hochgeladen (site/hero/home-hero.png) */
export const homeHeroImage = "https://storage.googleapis.com/abexis-cms.firebasestorage.app/site/hero/home-hero.png";

/** Project Reality Check : Infografik «Warum Projekte selten scheitern aber oft entgleisen» (Warnsignale-Sektion) */
export const prcChallengesInfographic = "https://storage.googleapis.com/abexis-cms.firebasestorage.app/site/prc/prc-challenges-infographic.png";

/** Project Reality Check : Hexagonales 6-Dimensionen-Modell (Dimensionen-Sektion) */
export const prcDimensionenModell = "https://storage.googleapis.com/abexis-cms.firebasestorage.app/site/prc/prc-6-dimensionen-modell.png";

/** Project Reality Check : Ablauf-Timeline Tag 1-5 (Ablauf-Sektion) */
export const prcAblaufTimeline = "https://storage.googleapis.com/abexis-cms.firebasestorage.app/site/prc/prc-ablauf-timeline.jpg";

/** Kontaktseite : separates Hero-Motiv (nicht Startseiten-Hero). */
export const kontaktPageHeroImage = fokusPageHeroImages.unternehmensstrategie;

/** Blog-Übersicht: Cover-Thumbnails in Listenreihenfolge (ohne Logo) */
const blogCovers = BLOG_PAGE.filter((u) => !u.includes("9fa6de2e-48f4-4837-8a9b-43f06f5ecc7f"));

export function getBlogListCoverByIndex(index: number): string {
  return blogCovers[index % blogCovers.length] ?? homeBlogTeaserImage;
}
