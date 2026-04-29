const base = "https://firebasestorage.googleapis.com/v0/b/abexis-cms.firebasestorage.app/o/cms%2Fmedia%2Fsite%2F";
const img = (key: string) => `${base}${key}.jpg?alt=media`;

/**
 * Editorial images (Firebase Storage) — consistent crop, no Unsplash dependency.
 */
export const editorialImages = {
  hero:     img("editorial-hero"),
  services: img("editorial-services"),
  process:  img("editorial-process"),
  insights: img("editorial-insights"),
  about:    img("editorial-about"),
} as const;
