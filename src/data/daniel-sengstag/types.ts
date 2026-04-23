export type Locale = "de" | "en";

export type NavItem = { id: string; label: string };

export type TimelineEntry = { period: string; role: string; org: string };

export type EducationEntry = { period: string; title: string; org?: string };

export type FurtherEducationEntry = { line: string; href?: string };

export type SiteContent = {
  meta: { title: string; description: string; ogLocale: string };
  nav: NavItem[];
  lang: { label: string; switchTo: string };
  hero: {
    name: string;
    credentials: string;
    line: string;
    lead: string;
    ctaPrimary: string;
    ctaSecondary: string;
    pull: string;
  };
  intro: { kicker: string; title: string; body: string[] };
  portraitExpand: { summary: string; paragraphs: string[] };
  skills: {
    kicker: string;
    title: string;
    lead: string;
    tags: string[];
    detailSummary: string;
    detailBullets: string[];
  };
  focus: {
    kicker: string;
    title: string;
    themes: { title: string; note: string }[];
  };
  experience: {
    kicker: string;
    title: string;
    narrative: string[];
    highlights: string[];
    timeline: TimelineEntry[];
    timelineToggle: string;
    footnote: string;
  };
  education: { kicker: string; bandTitle: string; title: string; entries: EducationEntry[] };
  furtherEducation: {
    kicker: string;
    title: string;
    entries: FurtherEducationEntry[];
  };
  certifications: { kicker: string; title: string; items: string[] };
  philosophy: { kicker: string; title: string; body: string[] };
  strengths: { kicker: string; title: string; items: string[] };
  mandates: {
    kicker: string;
    title: string;
    body: string;
    bullets: string[];
  };
  abexis: {
    kicker: string;
    title: string;
    body: string;
    linkLabel: string;
  };
  contact: {
    kicker: string;
    title: string;
    invite: string;
    phone: string;
    emails: { label: string; href: string }[];
    socialHeading: string;
    social: { label: string; href: string }[];
    address: string[];
  };
  footer: {
    rights: string;
    impressum: string;
    privacy: string;
  };
};
