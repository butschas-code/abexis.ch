/**
 * The four service groups from the client's homepage draft (Oct 2026). One source for the
 * homepage and the Leistungen overview; header nav (`mainNav` in `data/pages`) follows the same order.
 * Client asked for no "Neu" labels, so items carry no badge field.
 */
import { projectRealityCheckTeaserImage, vmoTeaserImage } from "@/data/site-images";

export type ServiceGroupsLocale = "de" | "en";

type ServiceItem = { title: string; body: string; href: string };
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
      },
      {
        title: "Unternehmensstrategie",
        body: "Eine gemeinsame Richtung festlegen und in konkrete Unternehmensprioritäten übersetzen.",
        href: "/fokusthemen/unternehmensstrategie",
      },
      {
        title: "Vertrieb und Marketing",
        body: "Zielkunden fokussieren und Vertriebsorganisation, Prozesse und Steuerung weiterentwickeln.",
        href: "/fokusthemen/vertriebmarketing",
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
      },
      {
        title: "PLM/PDM Beratung und Projektleitung",
        body: "Fachliche Vorbereitung und Projektführung. Schwerpunkt Siemens Teamcenter.",
        href: "/fokusthemen/plm-pdm",
      },
      {
        title: "Prozessoptimierung",
        body: "Schnittstellen klären, unnötige Arbeit reduzieren und geeignete Abläufe automatisieren.",
        href: "/fokusthemen/prozessoptimierung",
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
      },
      {
        title: "Risikomanagement",
        body: "Risiken beurteilen und wirksame Massnahmen nachhalten. Punktuell oder als laufende Begleitung.",
        href: "/fokusthemen/risikomanagement",
      },
      {
        title: "Project Reality Check",
        body: "Den tatsächlichen Projektstand beurteilen und anstehende Entscheidungen fundiert vorbereiten.",
        href: "/projectrealitycheck",
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
      },
      {
        title: "Executive Search",
        body: "Führungs- und Schlüsselpositionen besetzen. Mit diskreter Direktansprache und Branchenverständnis.",
        href: "/executive-search",
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
      },
      {
        title: "Corporate strategy",
        body: "Agree on a shared direction and translate it into concrete corporate priorities.",
        href: "/en/fokusthemen/unternehmensstrategie",
      },
      {
        title: "Sales and marketing",
        body: "Focus on target customers and develop sales organisation, processes and steering.",
        href: "/en/fokusthemen/vertriebmarketing",
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
      },
      {
        title: "PLM/PDM consulting and project leadership",
        body: "Business preparation and project leadership. Focus on Siemens Teamcenter.",
        href: "/en/fokusthemen/plm-pdm",
      },
      {
        title: "Process optimisation",
        body: "Clarify interfaces, reduce unnecessary work and automate suitable processes.",
        href: "/en/fokusthemen/prozessoptimierung",
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
      },
      {
        title: "Risk management",
        body: "Assess risks and follow up on effective actions. As a one-off review or ongoing support.",
        href: "/en/fokusthemen/risikomanagement",
      },
      {
        title: "Project Reality Check",
        body: "Assess the actual project status and prepare upcoming decisions on a sound basis.",
        href: "/en/projectrealitycheck",
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
      },
      {
        title: "Executive Search",
        body: "Fill leadership and key positions. With discreet direct search and industry understanding.",
        href: "/en/executive-search",
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
    allLabel: "Alle Leistungen im Überblick",
    allHref: "/leistungen",
    groups: groupsDe,
  },
  featured: {
    eyebrow: "Im Fokus",
    title: "Gezielt mehr Unterstützung.",
    intro: "Zwei Angebote für Aufgaben, die zusätzliche Kapazität und einen klaren Blick verlangen.",
    items: [
      {
        eyebrow: "Virtual Management Office",
        title: "Der verlängerte Arm Ihrer Geschäftsleitung.",
        body: "Ihre Managementagenda in einem klaren System. Das VMO verbindet Unternehmensprioritäten mit Entscheidungen und konsequenter Nachverfolgung.",
        cta: "Das VMO kennenlernen",
        href: "/fokusthemen/virtual-management-office",
        image: vmoTeaserImage,
        imageAlt: "Virtual Management Office: Bildschirm mit Prioritäten, Vorhaben, Entscheiden und Risiken",
        imagePosition: "object-center",
      },
      {
        eyebrow: "Project Reality Check",
        title: "Wissen, wo Ihr Projekt wirklich steht.",
        body: "Wir beurteilen den tatsächlichen Stand Ihres Projekts und bereiten anstehende Entscheidungen fundiert vor. In drei Tagen bis vier Wochen.",
        cta: "Zum Project Reality Check",
        href: "/projectrealitycheck",
        image: projectRealityCheckTeaserImage,
        imageAlt: "Project Reality Check: Projektstatus entlang von Strategie, Governance, Execution, Risiken, Change und Technologie",
        imagePosition: "object-top",
      },
    ],
  },
};

type ServiceGroupsContent = typeof de;

const en: ServiceGroupsContent = {
  services: {
    eyebrow: "Our services",
    title: "What moves your company forward now.",
    intro:
      "A strategic question, a specific initiative or additional management capacity: we shape our contribution around your task.",
    allLabel: "All services at a glance",
    allHref: "/en/leistungen",
    groups: groupsEn,
  },
  featured: {
    eyebrow: "In focus",
    title: "Targeted additional support.",
    intro: "Two offerings for tasks that call for additional capacity and a clear view.",
    items: [
      {
        eyebrow: "Virtual Management Office",
        title: "The extended arm of your executive team.",
        body: "Your management agenda in one clear system. The VMO connects corporate priorities with decisions and consistent follow-up.",
        cta: "Discover the VMO",
        href: "/en/fokusthemen/virtual-management-office",
        image: vmoTeaserImage,
        imageAlt: "Virtual Management Office: screen showing priorities, initiatives, decisions and risks",
        imagePosition: "object-center",
      },
      {
        eyebrow: "Project Reality Check",
        title: "Know where your project really stands.",
        body: "We assess the actual status of your project and prepare upcoming decisions on a sound basis. In three days to four weeks.",
        cta: "Go to Project Reality Check",
        href: "/en/projectrealitycheck",
        image: projectRealityCheckTeaserImage,
        imageAlt: "Project Reality Check: project status across strategy, governance, execution, risks, change and technology",
        imagePosition: "object-top",
      },
    ],
  },
};

export function getServiceGroupsContent(locale: ServiceGroupsLocale) {
  return locale === "en" ? en : de;
}
