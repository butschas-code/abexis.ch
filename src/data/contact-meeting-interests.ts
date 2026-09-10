/** Meeting scope options shown on `/kontakt` — aligned with Abexis service lines. */
export type ContactMeetingInterestId =
  | "project-reality-check"
  | "risk-management"
  | "project-management"
  | "digital-transformation"
  | "corporate-strategy"
  | "sales-marketing"
  | "change-management"
  | "process-optimization"
  | "executive-search";

export type ContactMeetingInterest = {
  id: ContactMeetingInterestId;
  labelDe: string;
  labelEn: string;
};

export const contactMeetingInterests: readonly ContactMeetingInterest[] = [
  {
    id: "project-reality-check",
    labelDe: "Project Reality Check",
    labelEn: "Project Reality Check",
  },
  {
    id: "risk-management",
    labelDe: "Risikomanagement / externer Risk Manager",
    labelEn: "Risk management / external risk manager",
  },
  {
    id: "project-management",
    labelDe: "Projektmanagement & Projektleitung",
    labelEn: "Project management & project leadership",
  },
  {
    id: "digital-transformation",
    labelDe: "Digitale Transformation",
    labelEn: "Digital transformation",
  },
  {
    id: "corporate-strategy",
    labelDe: "Unternehmensstrategie",
    labelEn: "Corporate strategy",
  },
  {
    id: "sales-marketing",
    labelDe: "Vertrieb & Marketing",
    labelEn: "Sales & marketing",
  },
  {
    id: "change-management",
    labelDe: "Veränderungsmanagement",
    labelEn: "Change management",
  },
  {
    id: "process-optimization",
    labelDe: "Prozessoptimierung",
    labelEn: "Process optimization",
  },
  {
    id: "executive-search",
    labelDe: "Executive Search",
    labelEn: "Executive Search",
  },
] as const;

const interestIdSet = new Set<string>(contactMeetingInterests.map((i) => i.id));

export function parseContactInterestParam(raw: string | null | undefined): ContactMeetingInterestId[] {
  if (!raw?.trim()) return [];
  return raw
    .split(/[,;]+/)
    .map((part) => part.trim())
    .filter((part): part is ContactMeetingInterestId => interestIdSet.has(part));
}

export function contactHrefWithInterests(
  interests: ContactMeetingInterestId | ContactMeetingInterestId[],
  locale: "de" | "en" = "de",
): string {
  const base = locale === "en" ? "/en/kontakt" : "/kontakt";
  const list = Array.isArray(interests) ? interests : [interests];
  if (!list.length) return base;
  return `${base}?interest=${list.join(",")}`;
}
