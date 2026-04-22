import fokusthemenMain from "./fokusthemen-main.json";
import blogPosts from "./blog-posts.json";

/**
 * ## Style DNA / Art Direction (Abexis Consulting)
 *
 * **Stimmung:** präzise, diskret, hochwertig.
 *
 * **Typografie:** Playfair Display (Überschriften — editorial, ruhig) + DM Sans (Fliesstext — klar, modern).
 *
 * **Layout-Rhythmus:** grosszügiger Hero, viel Luft, alternierende editorial breite Sektionen, langsames visuelles «Pacing».
 *
 * **Marken-Cues:** feine Linien, dezente Akzentfarbe (Brass auf Navy), kleine Sektionslabels in Kapitälchen, keine lauten Illustrationen.
 *
 * **Signatur-Motiv:** 1-px-Linien und «Rahmenlicht» — L-förmige Ecken / dezente Kantenführung (siehe Komponenten), kein Tech-Grid.
 *
 * **Gesamtfühle:** Senior Advisory Boutique, Schweizer Präzision, hohe Vertrauenswirkung — bewusst nicht «SaaS» oder Startup.
 */
export const ART_DIRECTION = `Mood: präzise, diskret, hochwertig · Serif + Sans · Linienmotiv · ruhige Motion`;

export const siteConfig = {
  company: "Abexis GmbH",
  /** Wie auf der bisherigen Startseite / Kontaktbereich ausgewiesen */
  footerAddressHinwil: "Zihlstrasse 25, 8340 Hinwil, Schweiz",
  emailPrimary: "contact@abexis.ch",
  phoneDisplay: "+41 43 535 84 34",
  phoneTel: "+41435358434",
  bookingUrlDe:
    "https://outlook.office.com/bookwithme/user/e725b81719d74d9fad11b791fafc6f6d@abexis.ch?anonymous&ismsaljsauthenabled=true",
  bookingUrlEn: "https://calendly.com/abexis-sengstag/",
  linkedin: "https://www.linkedin.com/company/abexis-gmbh",
  xing: "https://www.xing.com/pages/abexis-gmbh",
  searchSite: "https://abexis-search.ch",
} as const;

/** Google Maps Einbettung für {@link siteConfig.footerAddressHinwil} (`output=embed`, kein API-Key). */
export const hinwilGoogleMapsEmbedSrc =
  "https://maps.google.com/maps?q=Abexis+GmbH%2C+Zihlstrasse+25%2C+8340+Hinwil%2C+Schweiz&z=16&ie=UTF8&iwloc=&output=embed";

export const mainNav = [
  { href: "/leistungen", label: "Leistungen" },
  { href: "/blog", label: "Insights" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export const footerPartners = [
  { label: "Abexis Search", href: "https://abexis-search.ch/" },
  { label: "Swiss Institute of Directors", href: "https://boardfoundation.org/en/institution/swiss-institute-of-directors/" },
  { label: "Sustainable Leaders", href: "https://www.sustainableleaders.ch/de/" },
  { label: "Digital Winterthur", href: "https://www.digital-winterthur.ch/" },
  { label: "Swiss Leaders", href: "https://swissleaders.ch/" },
  { label: "SwissICT", href: "https://www.swissict.ch/" },
  { label: "Ausbildung & Weiterbildung", href: "https://www.ausbildung-weiterbildung.ch/" },
  { label: "UFZ", href: "https://www.ufz.ch/" },
  { label: "AVZO", href: "https://avzo.ch/" },
  { label: "Zürcher Oberland", href: "https://www.zuerioberland.ch/" },
  { label: "SVC", href: "https://svc.swiss/de" },
  { label: "Future Institute", href: "https://www.futureinstitute.ch/" },
  { label: "Valueon", href: "https://www.valueon.ch/" },
  { label: "Swiss MBAs", href: "https://swissmbas.com/" },
  { label: "Leverage Experts", href: "https://leverage-experts.com/de/" },
] as const;

export const homeIntroLines = [
  "BUSINESS TRANSFORMATION, DIGITALISIERUNG",
  "UNTERNEHMENSSTRATEGIE & -FÜHRUNG",
  "ORGANISATORISCHES VERÄNDERUNGSMANAGEMENT",
  "VERTRIEB & MARKETING, BUSINESS DEVELOPMENT",
  "PROZESS-MANAGEMENT",
  "PROJEKTMANAGEMENT",
] as const;

export const homeLeadParagraph =
  "Als gefragte Managementberatung helfen wir Ihrem Unternehmen strategisch voranzukommen, Wachstumspotenziale konsequent zu nutzen, Umsatz- und Ertragsziele zu erreichen, wirksame Strukturen und Prozesse zu etablieren und Ihr Unternehmen noch fitter für die Zukunft zu gestalten.";

/** Begrüssung unter dem Hero (ersetzt den früheren «Impulse»-Block mit Blog-Titeln) */
export const homeWelcomeSection = {
  eyebrow: "Willkommen",
  title: "Schön, dass Sie zu uns finden — ",
  titleAccent: "herzlich willkommen.",
  paragraphs: [
    "Bei Abexis begleiten wir Unternehmen und Führungsteams dort, wo es zählt: Strategie, Digitalisierung, Veränderung, Vertrieb und Projekte — immer mit dem Fokus auf greifbare Resultate und eine Zusammenarbeit auf Augenhöhe.",
    "Schauen Sie sich unsere Schwerpunkte an, lesen Sie einen Beitrag im Blog oder nehmen Sie Kontakt auf, wenn Sie den Austausch suchen. Wir freuen uns, von Ihnen zu hören.",
  ],
} as const;

export const homeAboutTeaser =
  "Wir begleiten Sie auf Ihrem Weg zum Erfolg und übernehmen gemeinsam mit Ihnen Verantwortung. Unsere Kompetenzen in den Themen Strategie, Vertrieb & Marketing, Digitalisierung, Change Management und Unternehmensführung sind der Schlüssel zum Erfolg Ihres Unternehmens. Auch stehen wir Unternehmern und Führungspersonen als Sparringspartner zur Verfügung. In einem offenen Dialog diskutieren wir mit unserem Gegenüber aktuelle Herausforderungen des Unternehmens.";

export type TeamSlug = "danielsengstag" | "christophwainig" | "katrinyuan" | "sergegarazi" | "williamdemaeyer";

export const teamOrder: TeamSlug[] = [
  "danielsengstag",
  "christophwainig",
  "katrinyuan",
  "sergegarazi",
  "williamdemaeyer",
];

export const teamProfiles: Record<
  TeamSlug,
  { name: string; title: string; image: string; body: string; phone?: string; email?: string; links?: { label: string; href: string }[] }
> = {
  danielsengstag: {
    name: "Daniel Sengstag",
    title:
      "Troubleshooter für Business Units und Projekte, Digitale Transformation, Projektleitung, Interim Manager, Change Agent",
    image: "https://files.designer.hoststar.ch/4f/9e/4f9e368c-3919-4b65-8c73-ad8c8f493d75.jpg",
    body: `Daniel Sengstag hat nicht nur mehr als 20 Jahre Erfahrung in der Unternehmens- und Bereichsleitung in multinationalen wie auch kleineren Unternehmen, sondern bringt auch eine breite Erfahrung im Bereich der Technik mit, die er in verschiedenen Industrien, auch in der Software- und IT-Branche gesammelt hat.

Mit seinem ingenieurwissenschaftlichen und IT-Hintergrund kann er seinen technischen mit seinem betriebswirtschaftlichen Erfahrungsschatz kombinieren, um die unterschiedlichen Situationen in Unternehmen schnell und ganzheitlich zu verstehen.

Daniel Sengstag war unter anderem bei Siemens Industry Software, Dassault Systèmes und Ansys als Country Manager und Sales Director tätig und bringt eine breite Erfahrung mit. Aufgrund seiner langjährigen Erfahrung in Prozessmanagement, PLM, CAx, Industrie 4.0, Digital Twin, CRM, Plattformen, Cloud, uvm. begleitet er Transformationsprojekte, unterstützt Unternehmen bei der Optimierung der Prozess und trägt zur Steigerung der Margen bei.

Mit einem pragmatischen Ansatz werden umsetzungsorientierte Lösungen entwickelt, sowie Ziele erreicht und weiterverfolgt. Dabei agiert Daniel Sengstag nicht nur auf der Basis der Theorie, sondern schöpft aus seinem langjährigen praktischen Erfahrungsschatz als Geschäftsführer, Verkaufsleiter, Verwaltungsrat, Aftersales Leiter, Projektleiter, Entwickler und Consultant in kleinen und grossen Unternehmen.

Daniel Sengstag ist Ingenieur und hat einen Executive MBA erarbeitet. Er interessiert sich auch stark für Nachhaltigkeitsthemen und Cybersecurity.

Zertifizierungen: HERMES 2022, PRINCE2, ITIL 4, SCRUM Master

Weitergehende Information zu Daniel Sengstag finden Sie unter: https://sengstag.ch/`,
    phone: "+41 79 349 04 54",
    email: "daniel.sengstag@abexis.ch",
    links: [{ label: "LinkedIn", href: "https://linkedin.com/in/danielsengstag/" }],
  },
  christophwainig: {
    name: "Christoph Wainig",
    title:
      "Experte für Unternehmenswachstum, Vertriebsoptimierung, Business Development, Change Management und Coaching",
    image: "https://files.designer.hoststar.ch/7c/5e/7c5eb14e-4f16-428a-a581-c4cb4ee8185d.jpg",
    body: `Christoph Wainig ist ein leidenschaftlicher Vertriebsleiter mit nachgewiesenen Fähigkeiten, Wachstumspotenziale zu analysieren, Geschäftsmodelle weiterzuentwickeln und funktionsübergreifende Teams effektiv durch Change Management zu führen. Er leitet multinational Vertriebsteams strategisch und lösungsorientiert, mit einem klaren Fokus auf die Umsetzung von Wachstumsstrategien, insbesondere auf Quick Wins. Darüber hinaus engagiert er sich intensiv in der Personalentwicklung, um nachhaltigen Erfolg sicherzustellen.

Seine Erfahrung sammelte er bei Unternehmen wie Adobe, Pegasystems, Kingston Technology, DELL Computer, in den Rollen Vertriebsleitung, Global Account Management, Business Development, strategische Allianzen, Channel Management, sowie auch als Managing Director mit über 100 TeleSales-Fachpersonen. Zusätzlich baute er eine eigene Unternehmensberatung Rainmaker Consulting auf.

Expertise:
• Entwicklung und Umsetzung von Hypergrowth-Initiativen
• Allianzen und Vertriebspartner-Programme
• Geschäftsentwicklung
• Vertriebsoptimierung
• Leistungsmanagement
• Führen von Veränderungen
• Coaching`,
    phone: "+41 76 824 00 81",
    email: "contact@abexis.ch",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/cwainig/" },
      { label: "Xing", href: "https://www.xing.com/profile/Christoph_Wainig" },
    ],
  },
  katrinyuan: {
    name: "Katrin J. Yuan",
    title:
      "Expertin für AI Transformation, kulturelle Transformation, New Work, Digital Leadership, Data Management und Taxonomie, Executive Coaching",
    image: "https://files.designer.hoststar.ch/b7/ce/b7ce050b-82b4-4acb-905f-bda7e0b119c5.jpg",
    body: `Katrin J. Yuan ist eine preisgekrönte Führungskraft mit Erfahrung in den Bereichen Technologie, Strategie und Digitaler Transformation in internationalen Unternehmen, im Mittelstand und Startups. Katrin hat einen Master of Business Administration mit Schwerpunkt IT und Finanzen und spricht sechs Sprachen. Sie ist Aufsichtsrätin und Beirätin von mehreren KI-, IoT- und IT-Mandaten, hält Vorträge an renommierten Universitäten und ist Jury Mitglied für Digital Shapers.

Mit ihrem Hintergrund Leitung von acht Abteilungen im obersten Management ist Katrin eine einflussreiche Führungspersönlichkeit, Gründerin, Investorin und Keynote Speaker auf einflussreichen Branchenkonferenzen wie für Vodafone Enterprise, St. Gallen Symposium und Richmondsevents. Sie gehört zu den Top 120 Female DACH Leaders.

Ihre Expertise erstreckt sich auf die Beratung von AI und Mensch, New Work, Data Analytics, Cybersecurity, Good Governance, Leadership und Finanzen. Sie setzt sich für die Förderung von responsible AI, Innovation, Digital Leadership und einen diversen Daten gesteuerten Ansatz ein.`,
    phone: "+41 79 522 76 13",
    email: "contact@abexis.ch",
    links: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/katrin-j-yuan/" }],
  },
  sergegarazi: {
    name: "Serge Garazi",
    title:
      "Senior Projekt- & Operations-Manager in Business und Informatik, Digitale Transformation, CRM, Compliance, Banking",
    image: "https://files.designer.hoststar.ch/cd/d4/cdd4878d-fb8f-4d27-94c2-1aaa97bb1697.jpg",
    body: `Serge ist ein Senior Projekt- & Operations-Manager in Business und Informatik, mit besonderem Fokus auf Digitale Transformation, Customer-Relationship Management (CRM), Compliance, Banking.

Auf Projektseite verfügt er über Erfahrung in
• Projekt-Governance
• Projektmanagement
• Change-Management
• Business- & IT-Analyse

Im Bereich Operations liegen seine Kompetenzen in
• Business-Kontinuität
• Prozessverbesserungen

Serge besitzt mehr als 20 Jahre Erfahrung in der Kombination «Business und Informatik», in verschiedenen Rollen, von Junior Programmierer auf Business Analyst auf Projekt- & Programmleiter auf Management Consultant und COO (Fintech).

Seine Hauptstärke sind:
• Eintauchen in die spezifischen Denkweisen der Stakeholder (Business & Informatik) dank der Kombination aus umfassender Erfahrung und exzellenter Ausbildung
• Informationen auf einer höheren Ebene aggregieren und sowohl das Gesamtbild als auch Details berücksichtigen
• Arbeiten in internationalen Kontexten mit schneller Anpassung an spezifische interkulturelle Rahmenbedingungen; mehrsprachig (EN, DE, FR, IT)

Ausbildung:
• Informatik: Informatik-Ing. ETH Zürich, ITIL® 4 Foundation
• Projektmanagement: PMP®, Product Owner PSPO® I, Scrum Master PSM® I, HERMES 2022 Foundation
• Business: MBA, CFA®`,
    phone: "+41 79 766 85 24",
    email: "contact@abexis.ch",
    links: [{ label: "LinkedIn", href: "https://linkedin.com/in/sergegarazi/" }],
  },
  williamdemaeyer: {
    name: "William De Maeyer",
    title:
      "Senior Solution Architect & Projektleiter in Bereich PLM, MES bzw. sehr anspruchsvollen technischen Software-Lösungen / -projekten, im Maschinenbau, in MedTech, Fertigung, Transport, Luft- & Raumfahrt und Verteidigung.",
    image: "https://files.designer.hoststar.ch/0b/4b/0b4b171f-3d10-4947-af9f-4bea14040a25.jpg",
    body: `William De Maeyer ist Gründer von Valcore Sagl und seit über 30 Jahren in der PLM-Branche tätig. Er verfügt über umfassende Erfahrung in der Leitung und Umsetzung komplexer Projekte in verschiedenen Industrien, darunter Luft- und Raumfahrt, Verteidigung, Maschinenbau, Transport und Fertigung.

Seine Laufbahn ist eng mit der Implementierung und Integration von Siemens PLM Software-Lösungen, insbesondere Teamcenter, verbunden. William hat in zahlreichen Projekten Organisationen in unterschiedlichen Regionen und Strukturen erfolgreich bei der digitalen Transformation unterstützt.

Erfahrung & Projekte (Auszug):
• Lead Solution Architect in mehreren PLM-Neueinführungsprojekten, unter anderem bei einem Luft- und Raumfahrtunternehmen, einem Medizintechnikunternehmen und einem Hightech-Elektronikunternehmen: Einführung von Teamcenter für Design und Manufacturing Organisation mit Schwerpunkt auf Change- und Konfigurationsmanagement
• Projektleiter bei einem Schweizer Maschinenlieferanten: Implementierung der Teamcenter SAP-Schnittstelle (T4S) zur Optimierung der Datensynchronisation und operativen Abläufe
• Projektleiter MES-Einführung in der Schweiz: Verbesserung der Produktionsverfolgung durch Implementierung eines Manufacturing Execution Systems
• Solution Architect Konfigurations- & Änderungsmanagement bei einem Luft- und Raumfahrt- und Verteidigungs-OEM in Frankreich: Optimierung von Ingenieur- und Fertigungsprozessen
• Projektleiter Teamcenter-Implementierung bei einem Luft- und Raumfahrtzulieferer in Belgien: Anpassung der Lösung an geschäftliche Anforderungen
• Implementierung des Teamcenter Requirement Managers bei einem Transportunternehmen in der Schweiz: Stärkung von Projektüberwachung und Nachverfolgbarkeit`,
    phone: "+41 79 828 24 40",
    email: "contact@abexis.ch",
    links: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/william-de-maeyer-47060a17/" }],
  },
};

export const fokusthemenMeta = [
  {
    slug: "digitale-transformation",
    href: "/fokusthemen/digitale-transformation",
    title: "Digitale Transformation",
    subtitle: "Digitalisierung",
    excerpt:
      "Themen wie Künstliche Intelligenz, Business Analytics, Industrie 4.0 / 5.0 und Cloud Transformation verändern unsere Gesellschaft. Nicht alle Themen bringen jedem Unternehmen und deren Kunden dieselben Vorteile. Deshalb ist es wichtig zuerst die Ziele und Erwartungen festzulegen und dann die Strategie zu erarbeiten.",
  },
  {
    slug: "unternehmensstrategie",
    href: "/fokusthemen/unternehmensstrategie",
    title: "Unternehmensstrategie, Strategieprozess",
    subtitle: "Strategie",
    excerpt:
      "Mit umfassender Branchenexpertise entwickeln und implementieren wir individuelle Unternehmensstrategien und unterstützen Sie auch bei der Definition des Strategieprozesses. Unser kundenzentrierter Ansatz sichert passgenaue Lösungen, die Ihren spezifischen Bedürfnissen entsprechen.",
  },
  {
    slug: "vertriebmarketing",
    href: "/fokusthemen/vertriebmarketing",
    title: "Vertrieb & Marketing",
    subtitle: "Go-to-Market",
    excerpt:
      "Wir helfen Ihnen, effiziente Vertriebsstrukturen aufzubauen, bestehende Vertriebsorganisationen zu transformieren und Prozesse weiterzuentwickeln.",
  },
  {
    slug: "veränderungsmanagement",
    href: "/fokusthemen/veränderungsmanagement",
    title: "Organisatorisches Veränderungsmanagement",
    subtitle: "Change",
    excerpt:
      "Unser Beratungsansatz für organisatorische Veränderungen ist iterativ, setzt auf Agilität und bezieht Mitarbeiter auf allen Ebenen in die Anpassung mit ein, um Geschäftsrisiken und Auswirkungen zu minimieren.",
  },
  {
    slug: "prozessoptimierung",
    href: "/fokusthemen/prozessoptimierung",
    title: "Prozessoptimierung, Kostenoptimierung, Prozessautomatisierung",
    subtitle: "Operative Exzellenz",
    excerpt:
      "Bei der Prozessoptimierung werden alle Prozesse kontinuierlich überprüft und Entscheidungen getroffen, um Prozesse anzupassen bzw. zu optimieren, durch neue Prozesse zu ersetzen oder zu eliminieren.",
  },
  {
    slug: "projektmanagement",
    href: "/fokusthemen/projektmanagement",
    title: "Projektmanagement, Projektassessments",
    subtitle: "Umsetzung",
    excerpt:
      "Wir unterstützen Sie bei Projektumsetzungen, sollten Sie Ressourcenengpässen haben. Fachkompetenz, Methodenwissen und die Erfahrung aus verschiedensten erfolgreich durchgeführten Projekten machen uns zu einem starken Partner für Sie und Ihr Unternehmen.",
  },
] as const;

const fokusHtml = fokusthemenMain as Record<string, string>;

export function getFokusthemaHtml(slug: string): string | null {
  const n = normalizeFokusSlug(slug);
  return fokusHtml[n] ?? null;
}

export function normalizeFokusSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export type BlogPost = (typeof blogPosts)[number];

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts as BlogPost[];
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const decoded = safeDecode(slug);
  return (blogPosts as BlogPost[]).find(
    (p) => p.slug === slug || safeDecode(p.slug) === decoded,
  );
}

function safeDecode(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export const homeServiceTeasers = fokusthemenMeta;
