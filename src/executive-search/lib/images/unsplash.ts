const base = "https://firebasestorage.googleapis.com/v0/b/abexis-cms.firebasestorage.app/o/cms%2Fmedia%2Fsite%2F";
const img = (key: string) => `${base}${key}.jpg?alt=media`;

/** Curated editorial images (Firebase Storage) : leadership / Swiss business atmosphere */
export const unsplash = {
  hero:     img("editorial-services"),
  process:  img("editorial-team"),
  focus:    img("editorial-hero"),
  about:    img("editorial-about"),
  contact:  img("editorial-contact"),
  insights: img("editorial-insights-desk"),
  vakanzen: img("editorial-vakanzen"),
} as const;
