/**
 * The four service groups from the client's homepage draft (Oct 2026). One source for the
 * homepage list and the Leistungen image grid; header nav (`mainNav`) and footer follow the same order.
 * Client asked for no "Neu" labels, so items carry no badge field.
 */
import type { serviceCardImages } from "@/data/site-images";

export type ServiceGroupsLocale = "de" | "en";

type ServiceItem = {
  title: string;
  body: string;
  href: string;
  imageKey: keyof typeof serviceCardImages;
  /** Client artwork has text at the top; keep it in frame when cropped. */
  imagePosition?: "object-top";
};
type ServiceGroup = { title: string; body: string; items: readonly ServiceItem[] };

const groupsDe: readonly ServiceGroup[] = [
  {
    title: "Strategie und Management",
    body: "Richtung festlegen und die Geschäftsleitung entlasten.",
    items: [
      {
        title: "Virtual Management Office",
        body: "Der verlängerte Arm Ihrer Geschäftsleitung. Prioritäten steuern und Entscheidungen nachhalten.",
        href: "/fokusthemen/virtual-management-office",
        imageKey: "virtual-management-office",
        imagePosition: "object-top",
      },
      {
        title: "Unternehmensstrategie",
        body: "Eine gemeinsame Richtung festlegen und in konkrete Unternehmensprioritäten übersetzen.",
        href: "/fokusthemen/unternehmensstrategie",
        imageKey: "unternehmensstrategie",
      },
      {
        title: "Vertrieb und Marketing",
        body: "Zielkunden fokussieren und Vertriebsorganisation, Prozesse und Steuerung weiterentwickeln.",
        href: "/fokusthemen/vertriebmarketing",
        imageKey: "vertriebmarketing",
      },
    ],
  },
  {
    title: "Transformation und Technologie",
    body: "Neue Möglichkeiten in funktionierende Abläufe übersetzen.",
    items: [
      {
        title: "Digitale Transformation",
        body: "Digitale Vorhaben am Unternehmensnutzen ausrichten. Von KI bis zur Systemeinführung.",
        href: "/fokusthemen/digitale-transformation",
        imageKey: "digitale-transformation",
      },
      {
        title: "PLM/PDM Beratung und Projektleitung",
        body: "Fachliche Vorbereitung und Projektführung. Schwerpunkt Siemens Teamcenter.",
        href: "/fokusthemen/plm-pdm",
        imageKey: "plm-pdm",
      },
      {
        title: "Prozessoptimierung",
        body: "Schnittstellen klären, unnötige Arbeit reduzieren und geeignete Abläufe automatisieren.",
        href: "/fokusthemen/prozessoptimierung",
        imageKey: "prozessoptimierung",
      },
    ],
  },
  {
    title: "Projekte und Risiken",
    body: "Verantwortung übernehmen und Vorhaben verlässlich steuern.",
    items: [
      {
        title: "Projektmanagement",
        body: "Projektleitung übernehmen, Teams verstärken und anspruchsvolle Vorhaben stabilisieren.",
        href: "/fokusthemen/projektmanagement",
        imageKey: "projektmanagement",
      },
      {
        title: "Risikomanagement",
        body: "Risiken beurteilen und wirksame Massnahmen nachhalten. Punktuell oder als laufende Begleitung.",
        href: "/fokusthemen/risikomanagement",
        imageKey: "risikomanagement",
      },
      {
        title: "Project Reality Check",
        body: "Den tatsächlichen Projektstand beurteilen und anstehende Entscheidungen fundiert vorbereiten.",
        href: "/projectrealitycheck",
        imageKey: "projectrealitycheck",
        imagePosition: "object-top",
      },
    ],
  },
  {
    title: "Menschen und Organisation",
    body: "Veränderung begleiten und Schlüsselpositionen besetzen.",
    items: [
      {
        title: "Veränderungsmanagement",
        body: "Führungskräfte und Mitarbeitende auf neue Aufgaben vorbereiten und Veränderungen verankern.",
        href: "/fokusthemen/veränderungsmanagement",
        imageKey: "veränderungsmanagement",
      },
      {
        title: "Executive Search",
        body: "Führungs- und Schlüsselpositionen besetzen. Mit diskreter Direktansprache und Branchenverständnis.",
        href: "/executive-search",
        imageKey: "executive-search",
      },
    ],
  },
];

const groupsEn: readonly ServiceGroup[] = [
  {
    title: "Strategy and management",
    body: "Set the direction and relieve the executive team.",
    items: [
      {
        title: "Virtual Management Office",
        body: "The extended arm of your executive team. Steer priorities and follow up on decisions.",
        href: "/en/fokusthemen/virtual-management-office",
        imageKey: "virtual-management-office",
        imagePosition: "object-top",
      },
      {
        title: "Corporate strategy",
        body: "Agree on a shared direction and translate it into concrete corporate priorities.",
        href: "/en/fokusthemen/unternehmensstrategie",
        imageKey: "unternehmensstrategie",
      },
      {
        title: "Sales and marketing",
        body: "Focus on target customers and develop sales organisation, processes and steering.",
        href: "/en/fokusthemen/vertriebmarketing",
        imageKey: "vertriebmarketing",
      },
    ],
  },
  {
    title: "Transformation and technology",
    body: "Turn new possibilities into working processes.",
    items: [
      {
        title: "Digital transformation",
        body: "Align digital initiatives with business value. From AI to system implementation.",
        href: "/en/fokusthemen/digitale-transformation",
        imageKey: "digitale-transformation",
      },
      {
        title: "PLM/PDM consulting and project leadership",
        body: "Business preparation and project leadership. Focus on Siemens Teamcenter.",
        href: "/en/fokusthemen/plm-pdm",
        imageKey: "plm-pdm",
      },
      {
        title: "Process optimisation",
        body: "Clarify interfaces, reduce unnecessary work and automate suitable processes.",
        href: "/en/fokusthemen/prozessoptimierung",
        imageKey: "prozessoptimierung",
      },
    ],
  },
  {
    title: "Projects and risks",
    body: "Take responsibility and steer initiatives reliably.",
    items: [
      {
        title: "Project management",
        body: "Take over project leadership, strengthen teams and stabilise demanding initiatives.",
        href: "/en/fokusthemen/projektmanagement",
        imageKey: "projektmanagement",
      },
      {
        title: "Risk management",
        body: "Assess risks and follow up on effective actions. As a one-off review or ongoing support.",
        href: "/en/fokusthemen/risikomanagement",
        imageKey: "risikomanagement",
      },
      {
        title: "Project Reality Check",
        body: "Assess the actual project status and prepare upcoming decisions on a sound basis.",
        href: "/en/projectrealitycheck",
        imageKey: "projectrealitycheck",
        imagePosition: "object-top",
      },
    ],
  },
  {
    title: "People and organisation",
    body: "Support change and fill key positions.",
    items: [
      {
        title: "Change management",
        body: "Prepare leaders and employees for new tasks and embed change.",
        href: "/en/fokusthemen/veränderungsmanagement",
        imageKey: "veränderungsmanagement",
      },
      {
        title: "Executive Search",
        body: "Fill leadership and key positions. With discreet direct search and industry understanding.",
        href: "/en/executive-search",
        imageKey: "executive-search",
      },
    ],
  },
];

const de = {
  services: {
    eyebrow: "Unser Angebot",
    title: "Was Ihr Unternehmen jetzt weiterbringt.",
    intro:
      "Eine strategische Frage, ein konkretes Vorhaben oder zusätzliche Managementkapazität: Wir richten unseren Beitrag an Ihrer Aufgabe aus.",
    groups: groupsDe,
  },
};

type ServiceGroupsContent = typeof de;

const en: ServiceGroupsContent = {
  services: {
    eyebrow: "Our services",
    title: "What moves your company forward now.",
    intro:
      "A strategic question, a specific initiative or additional management capacity: we shape our contribution around your task.",
    groups: groupsEn,
  },
};

export function getServiceGroupsContent(locale: ServiceGroupsLocale) {
  return locale === "en" ? en : de;
}
