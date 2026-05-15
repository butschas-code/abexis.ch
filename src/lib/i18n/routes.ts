export type SiteLocale = "de" | "en";

const germanToEnglish: Record<string, string> = {
  "/": "/en/home",
  "/leistungen": "/en/services",
  "/projectfitcheck": "/en/projectrealitycheck",
  "/projectrealitycheck": "/en/projectrealitycheck",
  "/kontakt": "/en/contact",
  "/ueber-uns": "/en/about",
  "/executive-search": "/en/executive-search",
  "/executive-search/vakanzen": "/en/executive-search/vacancies",
  "/leistungen/executive-search": "/en/executive-search",
  "/fokusthemen/digitale-transformation": "/en/topics/digital-transformation",
  "/fokusthemen/unternehmensstrategie": "/en/topics/corporate-strategy",
  "/fokusthemen/vertriebmarketing": "/en/topics/sales-marketing",
  "/fokusthemen/veränderungsmanagement": "/en/topics/change-management",
  "/fokusthemen/prozessoptimierung": "/en/topics/process-optimization",
  "/fokusthemen/projektmanagement": "/en/topics/project-management",
};

const englishToGerman: Record<string, string> = Object.fromEntries(
  Object.entries(germanToEnglish).map(([de, en]) => [en, de === "/projectfitcheck" ? "/projectrealitycheck" : de]),
);

englishToGerman["/en"] = "/";
englishToGerman["/en/home"] = "/";
englishToGerman["/en/services/executive-search"] = "/executive-search";

export function isEnglishPath(pathname: string) {
  return pathname === "/en" || pathname.startsWith("/en/");
}

export function localizedPath(pathname: string, locale: SiteLocale) {
  const cleanPath = normalizePath(pathname);

  if (locale === "en") {
    if (isEnglishPath(cleanPath)) return cleanPath;
    return germanToEnglish[cleanPath] ?? "/en/home";
  }

  if (!isEnglishPath(cleanPath)) return cleanPath === "/projectfitcheck" ? "/projectrealitycheck" : cleanPath;
  return englishToGerman[cleanPath] ?? "/";
}

function normalizePath(pathname: string) {
  const pathOnly = pathname.split(/[?#]/, 1)[0] || "/";
  if (pathOnly.length > 1 && pathOnly.endsWith("/")) return pathOnly.slice(0, -1);
  return pathOnly;
}
