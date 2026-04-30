const base = "https://firebasestorage.googleapis.com/v0/b/abexis-cms.firebasestorage.app/o/cms%2Fmedia%2Fsite%2F";
const img = (key: string) => `${base}${key}.jpg?alt=media`;

/** Editorial photography for homepage sections (Firebase Storage, executive / Swiss business tone). */
export const homeImagery = {
  intro: "https://firebasestorage.googleapis.com/v0/b/abexis-cms.firebasestorage.app/o/cms%2Fmedia%2Fmigrated%2Fe44da72a-1261-48e6-aa49-17b2d7ae5cd5.jpg?alt=media",
  /** Self-hosted : avoids remote 404s / ad blockers on pillar cards */
  pillarCustomer: "/images/home-pillars/customer.jpg",
  pillarNetwork:  "/images/home-pillars/network.jpg",
  pillarQuality:  "/images/home-pillars/quality.jpg",
  sectors:        img("editorial-hero"),
  projectFitCheck: img("editorial-insights"),
  process:        img("editorial-team"),
  trust:          img("executive-unsplash"),
  contact:        img("editorial-contact"),
} as const;
