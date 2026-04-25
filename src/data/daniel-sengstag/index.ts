/**
 * Source: sengstag.ch (homepage copy) + Hoststar image URLs from that project.
 */
export type { SiteContent, Locale, TimelineEntry, EducationEntry, FurtherEducationEntry, NavItem } from "./types";
export { danielSengstagContent } from "./content-de";

export const danielSengstagImages = {
  /** Full-bleed editorial hero */
  hero: "https://firebasestorage.googleapis.com/v0/b/abexis-cms.firebasestorage.app/o/cms%2Fmedia%2Fmigrated%2F5636ffb9-2636-451c-8223-8c7c3e7fc0a3.jpeg?alt=media",
  /** Profile column image */
  editorial: "https://firebasestorage.googleapis.com/v0/b/abexis-cms.firebasestorage.app/o/cms%2Fmedia%2Fmigrated%2Faf4050bf-87e6-40e3-a083-4c7c42a6db9a.jpeg?alt=media",
} as const;
