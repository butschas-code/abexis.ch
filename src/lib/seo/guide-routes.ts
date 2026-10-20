export type GuideLocale = "de" | "en";

const englishSlugs: Record<string, string> = {
  "digitalisierungsstrategie-kmu": "digital-strategy-smes",
  "strategieprozess-kmu": "strategy-process-smes",
  "b2b-vertriebsstrategie": "b2b-sales-strategy",
  "change-management-vorgehen": "change-management-approach",
  "prozesse-analysieren-optimieren": "business-process-optimization",
  "projekt-in-schieflage": "project-in-trouble",
  "projektrisiken-frueh-erkennen": "identify-project-risks-early",
  "fuehrungskraefte-finden": "finding-executives",
  "teamcenter-beratung-schweiz": "teamcenter-consulting-switzerland",
  "plm-pdm-einfuehrung": "plm-pdm-implementation",
  "plm-vs-pdm": "plm-vs-pdm",
};

const germanSlugs = Object.fromEntries(Object.entries(englishSlugs).map(([de, en]) => [en, de]));

export function guidePath(internalSlug: string, locale: GuideLocale) {
  if (locale === "en") return `/en/guides/${englishSlugs[internalSlug] ?? internalSlug}`;
  return `/ratgeber/${internalSlug}`;
}

export function guideHubPath(locale: GuideLocale) {
  return locale === "en" ? "/en/guides" : "/ratgeber";
}

export function resolveGuideSlug(routeSlug: string, locale: GuideLocale) {
  if (locale === "en") return germanSlugs[routeSlug];
  return Object.hasOwn(englishSlugs, routeSlug) ? routeSlug : undefined;
}

export function guideRouteSlugs(locale: GuideLocale) {
  return locale === "en" ? Object.values(englishSlugs) : Object.keys(englishSlugs);
}
