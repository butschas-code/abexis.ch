/**
 * Source: sengstag.ch (homepage copy) + Hoststar image URLs from that project.
 */
export type { SiteContent, Locale, TimelineEntry, EducationEntry, FurtherEducationEntry, NavItem } from "./types";
export { danielSengstagContent } from "./content-de";

export const danielSengstagImages = {
  /** Full-bleed editorial hero */
  hero: "https://files.designer.hoststar.ch/56/36/5636ffb9-2636-451c-8223-8c7c3e7fc0a3.jpeg",
  /** Profile column image */
  editorial: "https://files.designer.hoststar.ch/af/40/af4050bf-87e6-40e3-a083-4c7c42a6db9a.jpeg",
} as const;
