export type SiteLocale = "de" | "en";

const germanToEnglish: Record<string, string> = {
  "/": "/en/home",
  "/leistungen": "/en/leistungen",
  "/projectfitcheck": "/en/projectrealitycheck",
  "/projectrealitycheck": "/en/projectrealitycheck",
  "/kontakt": "/en/kontakt",
  "/ueber-uns": "/en/ueber-uns",
  "/executive-search": "/en/executive-search",
  "/executive-search/vakanzen": "/en/executive-search/vakanzen",
  "/leistungen/executive-search": "/en/leistungen/executive-search",
  "/fokusthemen/digitale-transformation": "/en/fokusthemen/digitale-transformation",
  "/fokusthemen/unternehmensstrategie": "/en/fokusthemen/unternehmensstrategie",
  "/fokusthemen/vertriebmarketing": "/en/fokusthemen/vertriebmarketing",
  "/fokusthemen/veränderungsmanagement": "/en/fokusthemen/veränderungsmanagement",
  "/fokusthemen/prozessoptimierung": "/en/fokusthemen/prozessoptimierung",
  "/fokusthemen/projektmanagement": "/en/fokusthemen/projektmanagement",
};

const englishAliasesToCanonical: Record<string, string> = {
  "/en": "/en/home",
  "/en/services": "/en/leistungen",
  "/en/contact": "/en/kontakt",
  "/en/about": "/en/ueber-uns",
  "/en/executive-search/vacancies": "/en/executive-search/vakanzen",
  "/en/services/executive-search": "/en/leistungen/executive-search",
  "/en/topics/digital-transformation": "/en/fokusthemen/digitale-transformation",
  "/en/topics/corporate-strategy": "/en/fokusthemen/unternehmensstrategie",
  "/en/topics/sales-marketing": "/en/fokusthemen/vertriebmarketing",
  "/en/topics/change-management": "/en/fokusthemen/veränderungsmanagement",
  "/en/topics/process-optimization": "/en/fokusthemen/prozessoptimierung",
  "/en/topics/project-management": "/en/fokusthemen/projektmanagement",
};

const teamProfileSlugs = new Set([
  "danielsengstag",
  "christophwainig",
  "katrinyuan",
  "sergegarazi",
  "williamdemaeyer",
  "sachamoeller",
  "renatesengstag",
]);

const englishToGerman: Record<string, string> = Object.fromEntries(
  Object.entries(germanToEnglish).map(([de, en]) => [en, de === "/projectfitcheck" ? "/projectrealitycheck" : de]),
);

englishToGerman["/en"] = "/";
englishToGerman["/en/home"] = "/";
englishToGerman["/en/services"] = "/leistungen";
englishToGerman["/en/contact"] = "/kontakt";
englishToGerman["/en/about"] = "/ueber-uns";
englishToGerman["/en/executive-search/vacancies"] = "/executive-search/vakanzen";
englishToGerman["/en/services/executive-search"] = "/leistungen/executive-search";
englishToGerman["/en/topics/digital-transformation"] = "/fokusthemen/digitale-transformation";
englishToGerman["/en/topics/corporate-strategy"] = "/fokusthemen/unternehmensstrategie";
englishToGerman["/en/topics/sales-marketing"] = "/fokusthemen/vertriebmarketing";
englishToGerman["/en/topics/change-management"] = "/fokusthemen/veränderungsmanagement";
englishToGerman["/en/topics/process-optimization"] = "/fokusthemen/prozessoptimierung";
englishToGerman["/en/topics/project-management"] = "/fokusthemen/projektmanagement";

export function isEnglishPath(pathname: string) {
  return pathname === "/en" || pathname.startsWith("/en/");
}

export function localizedPath(pathname: string, locale: SiteLocale) {
  const cleanPath = normalizePath(pathname);

  if (locale === "en") {
    if (isEnglishPath(cleanPath)) return canonicalEnglishPath(cleanPath);
    if (cleanPath.startsWith("/executive-search/vakanzen/")) return `/en${cleanPath}`;
    if (isGermanTeamProfilePath(cleanPath)) return `/en${cleanPath}`;
    return germanToEnglish[cleanPath] ?? "/en/home";
  }

  if (!isEnglishPath(cleanPath)) return cleanPath === "/projectfitcheck" ? "/projectrealitycheck" : cleanPath;
  if (cleanPath.startsWith("/en/executive-search/vakanzen/")) return cleanPath.replace(/^\/en/, "");
  if (cleanPath.startsWith("/en/executive-search/vacancies/")) {
    return cleanPath.replace(/^\/en\/executive-search\/vacancies/, "/executive-search/vakanzen");
  }
  if (isEnglishTeamProfilePath(cleanPath)) return cleanPath.replace(/^\/en/, "");
  return englishToGerman[cleanPath] ?? "/";
}

function canonicalEnglishPath(pathname: string) {
  if (pathname.startsWith("/en/executive-search/vacancies/")) {
    return pathname.replace(/^\/en\/executive-search\/vacancies/, "/en/executive-search/vakanzen");
  }
  return englishAliasesToCanonical[pathname] ?? pathname;
}

function normalizePath(pathname: string) {
  const pathOnly = pathname.split(/[?#]/, 1)[0] || "/";
  if (pathOnly.length > 1 && pathOnly.endsWith("/")) return pathOnly.slice(0, -1);
  return pathOnly;
}

function isGermanTeamProfilePath(pathname: string) {
  const slug = pathname.slice(1);
  return !slug.includes("/") && teamProfileSlugs.has(slug);
}

function isEnglishTeamProfilePath(pathname: string) {
  const slug = pathname.replace(/^\/en\//, "");
  return Boolean(slug) && !slug.includes("/") && teamProfileSlugs.has(slug);
}
