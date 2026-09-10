import type { ContactMeetingInterestId } from "@/data/contact-meeting-interests";

export type RisikomanagementLocale = "de" | "en";

export type RisikomanagementPageContent = {
  meta: { title: string; excerpt: string };
  hero: {
    title: string;
    body: string;
    primaryCta: { label: string; interest: ContactMeetingInterestId };
    secondaryCta: { label: string; href: string };
  };
  problem: { title: string; intro: string; questions: readonly string[] };
  signs: { eyebrow: string; title: string; items: readonly { num: string; title: string; body: string }[] };
  models: {
    eyebrow: string;
    title: string;
    ongoing: { title: string; intro: string; note: string; bullets: readonly string[] };
    prc: { title: string; body: string; cta: { label: string; href: string } };
  };
  deliverables: { eyebrow: string; title: string; items: readonly { title: string; body: string }[] };
  challengeAreas: { eyebrow: string; title: string; intro: string; items: readonly { title: string; body: string }[] };
  process: { eyebrow: string; title: string; steps: readonly { num: string; title: string; body: string }[] };
  positioning: { title: string; intro: string; bullets: readonly string[]; closing: string };
  outcomes: { eyebrow: string; title: string; items: readonly { title: string; body: string }[] };
  useCases: { eyebrow: string; title: string; items: readonly string[] };
  faq: { eyebrow: string; title: string; items: readonly { q: string; a: string }[] };
  closing: {
    title: string;
    body: string;
    tags: readonly string[];
    primaryCta: { label: string; interest: ContactMeetingInterestId };
    secondaryCta: { label: string; interest: ContactMeetingInterestId };
  };
  breadcrumbs: { home: string; services: string; current: string };
  contactPath: string;
  prcPath: string;
};

const de: RisikomanagementPageContent = {
  meta: {
    title: "Risikomanagement in Projekten und externer Risk Manager",
    excerpt:
      "Externer Risk Manager für anspruchsvolle Projekte: laufende Begleitung mit 10 bis 20 Prozent Pensum oder punktueller Project Reality Check.",
  },
  hero: {
    title: "Risikomanagement in Projekten",
    body:
      "Risiken verschwinden nicht, wenn niemand über sie spricht. Abexis begleitet anspruchsvolle Projekte als externer Risk Manager — laufend mit einem Pensum von etwa 10 bis 20 Prozent oder punktuell mit einem unabhängigen Project Reality Check. Wir identifizieren kritische Entwicklungen frühzeitig, hinterfragen den Projektstatus und schaffen die Entscheidungsgrundlagen, die Projektleitung, Geschäftsleitung und Steuerungsgremium benötigen.",
    primaryCta: { label: "Unverbindliches Risikogespräch", interest: "risk-management" },
    secondaryCta: { label: "Project Reality Check ansehen", href: "/projectrealitycheck" },
  },
  problem: {
    title: "Das Projekt läuft. Aber wer behält die Risiken im Blick?",
    intro:
      "Die Projektleitung konzentriert sich auf Termine, Lieferobjekte, Ressourcen und die tägliche Koordination. Teilprojektleiter kennen ihre jeweiligen Themen. Das Steuerungsgremium erhält regelmässige Statusberichte. Trotzdem fehlt häufig eine Rolle, die das Gesamtbild unabhängig betrachtet und konsequent hinterfragt:",
    questions: [
      "Welche Risiken gefährden die Projektziele?",
      "Welche Annahmen sind nicht ausreichend abgesichert?",
      "Welche Massnahmen wirken tatsächlich?",
      "Wo fehlen Verantwortliche oder Entscheidungen?",
      "Welche Entwicklung muss an die Geschäftsleitung eskaliert werden?",
    ],
  },
  signs: {
    eyebrow: "Früherkennung",
    title: "Sechs Anzeichen, dass eine externe Risikobegleitung sinnvoll ist",
    items: [
      {
        num: "01",
        title: "Risiken werden gesammelt, aber nicht aktiv gesteuert",
        body: "Das Risikoregister ist vorhanden, wird jedoch selten aktualisiert und hat kaum Einfluss auf Entscheidungen.",
      },
      {
        num: "02",
        title: "Der Projektstatus bleibt lange grün",
        body: "Probleme sind bekannt, werden im Reporting aber relativiert oder erst spät sichtbar.",
      },
      {
        num: "03",
        title: "Kritische Massnahmen bleiben offen",
        body: "Verantwortlichkeiten, Termine und Wirksamkeit der Massnahmen werden nicht konsequent verfolgt.",
      },
      {
        num: "04",
        title: "Die Projektleitung ist operativ ausgelastet",
        body: "Für eine übergreifende und unabhängige Risikobetrachtung fehlen Zeit und Abstand.",
      },
      {
        num: "05",
        title: "Entscheidungen verzögern sich",
        body: "Kritische Themen werden wiederholt diskutiert, ohne dass klare Entscheide getroffen werden.",
      },
      {
        num: "06",
        title: "Das Management möchte mehr Sicherheit",
        body: "Geschäftsleitung, Verwaltungsrat oder Steuerungsgremium benötigen eine belastbare Zweitmeinung zum tatsächlichen Projektstatus.",
      },
    ],
  },
  models: {
    eyebrow: "Einsatzformen",
    title: "Zwei Einsatzformen, passend zu Ihrer Projektsituation",
    ongoing: {
      title: "Laufende Risikobegleitung",
      intro:
        "Abexis begleitet Ihr Projekt regelmässig als externer Risk Manager. Der typische Umfang liegt je nach Projektgrösse und Risikosituation bei etwa 10 bis 20 Prozent — das entspricht beispielsweise einem halben bis einem ganzen Tag pro Woche.",
      note: "Die Begleitung eignet sich für strategisch wichtige, komplexe oder risikoreiche Vorhaben, bei denen eine kontinuierliche Früherkennung und unabhängige Beurteilung erforderlich ist.",
      bullets: [
        "Aufbau oder Überprüfung des Risikomanagements",
        "Identifikation und strukturierte Bewertung von Risiken",
        "Regelmässige Gespräche mit Projektleitung und Verantwortlichen",
        "Moderation von Risikoworkshops",
        "Priorisierung nach Eintrittswahrscheinlichkeit und Auswirkung",
        "Definition und Verfolgung wirksamer Massnahmen",
        "Überprüfung von Frühindikatoren und Veränderungen",
        "Aufbereitung der Top-Risiken für Geschäftsleitung und Steuerungsgremium",
        "Formulierung des notwendigen Entscheidungsbedarfs",
        "Eskalation kritischer Entwicklungen",
      ],
    },
    prc: {
      title: "Punktueller Project Reality Check",
      body: "Wenn zunächst eine unabhängige Standortbestimmung benötigt wird, überprüfen wir das Projekt gezielt und zeitlich begrenzt. Wir analysieren Unterlagen, führen Interviews mit Schlüsselpersonen und hinterfragen Status, Planung, Governance, Risiken, Umsetzung und Veränderungsfähigkeit. Sie erhalten eine klare Einschätzung, priorisierte Risiken und konkrete Handlungsempfehlungen.",
      cta: { label: "Mehr zum Project Reality Check", href: "/projectrealitycheck" },
    },
  },
  deliverables: {
    eyebrow: "Ergebnisse",
    title: "Was Sie konkret erhalten",
    items: [
      { title: "Risikoregister", body: "Ein strukturiertes und priorisiertes Gesamtbild der relevanten Projektrisiken." },
      { title: "Risiko-Heatmap", body: "Transparenz über Eintrittswahrscheinlichkeit, Auswirkungen und Handlungspriorität." },
      { title: "Executive Risk Report", body: "Eine kompakte Managementübersicht mit den wichtigsten Risiken, Veränderungen, Massnahmen und notwendigen Entscheidungen." },
      { title: "Massnahmencontrolling", body: "Klare Verantwortlichkeiten, Termine und regelmässige Überprüfung der Wirksamkeit." },
      { title: "Frühindikatoren", body: "Messbare Signale, die kritische Entwicklungen sichtbar machen, bevor sie zu Projektproblemen werden." },
      { title: "Unabhängige Einschätzung", body: "Eine sachliche Aussensicht auf Status, Annahmen und verbleibenden Handlungsspielraum." },
    ],
  },
  challengeAreas: {
    eyebrow: "Blickwinkel",
    title: "Was wir im Projekt hinterfragen",
    intro: "Risikomanagement betrachtet nicht nur technische Risiken. Wir beurteilen das Projekt gesamthaft:",
    items: [
      { title: "Ziele und Umfang", body: "Sind Ziele, Erfolgskriterien und Projektumfang klar und weiterhin realistisch?" },
      { title: "Termine und Meilensteine", body: "Sind Zeitplan, Abhängigkeiten und kritischer Pfad belastbar?" },
      { title: "Ressourcen", body: "Stehen die erforderlichen Kapazitäten und Kompetenzen tatsächlich zur Verfügung?" },
      { title: "Governance", body: "Funktionieren Rollen, Entscheidungswege und Eskalationsprozesse?" },
      { title: "Lieferanten und Partner", body: "Werden externe Abhängigkeiten, Leistungen und Verpflichtungen aktiv gesteuert?" },
      { title: "Daten und Technologie", body: "Sind Datenqualität, Migration, Schnittstellen und technische Entscheidungen ausreichend abgesichert?" },
      { title: "Tests und Qualität", body: "Reichen Testumfang, Qualitätssicherung und Abnahmeverfahren für die nächste Projektphase aus?" },
      { title: "Organisation und Veränderung", body: "Sind Anwender, Führungskräfte und betroffene Organisationseinheiten auf die Veränderung vorbereitet?" },
      { title: "Einführung und Übergabe", body: "Sind Cutover, Ausbildung, Support, Hypercare und betriebliche Übernahme realistisch geplant?" },
    ],
  },
  process: {
    eyebrow: "Ablauf",
    title: "So funktioniert die laufende Begleitung",
    steps: [
      { num: "01", title: "Auftrag und Risikoprofil klären", body: "Wir besprechen Projektziele, Ausgangslage, bestehende Governance und Erwartungen des Auftraggebers." },
      { num: "02", title: "Ausgangslage beurteilen", body: "Wir prüfen vorhandene Risiken, Massnahmen, Berichte und Entscheidungswege. Fehlende Risiken und Schwachstellen werden gemeinsam identifiziert." },
      { num: "03", title: "Risikoprozess etablieren", body: "Bewertungslogik, Verantwortlichkeiten, Berichtsformate, Sitzungsrhythmus und Eskalationswege werden verbindlich festgelegt." },
      { num: "04", title: "Risiken laufend überwachen", body: "Wir hinterfragen Veränderungen, verfolgen Massnahmen und überprüfen regelmässig, ob neue Risiken entstehen." },
      { num: "05", title: "Management informieren", body: "Geschäftsleitung und Steuerungsgremium erhalten eine kompakte Übersicht über die wichtigsten Risiken, Veränderungen und notwendigen Entscheidungen." },
    ],
  },
  positioning: {
    title: "Keine Projektpolizei, sondern ein unabhängiger Sparringspartner",
    intro:
      "Der externe Risk Manager ersetzt weder den Projektleiter noch die Verantwortung des Auftraggebers. Er ergänzt die bestehende Projektorganisation mit einer unabhängigen Perspektive. Dabei geht es nicht darum, möglichst viele Risiken aufzulisten oder zusätzliche Administration zu verursachen. Es geht darum:",
    bullets: [
      "die wirklich relevanten Risiken sichtbar zu machen",
      "unbequeme Fragen frühzeitig zu stellen",
      "Massnahmen konsequent nachzuverfolgen",
      "kritische Entwicklungen sachlich zu eskalieren",
      "die Entscheidungsfähigkeit des Managements zu sichern",
    ],
    closing: "",
  },
  outcomes: {
    eyebrow: "Nutzen",
    title: "Was professionelles Risikomanagement bewirkt",
    items: [
      { title: "Weniger Überraschungen", body: "Kritische Entwicklungen werden erkannt, bevor sie sich zu akuten Problemen entwickeln." },
      { title: "Frühere Entscheidungen", body: "Das Management weiss, wo Handlungsbedarf besteht und welche Folgen ein Aufschub haben kann." },
      { title: "Schutz von Terminen und Budget", body: "Gegenmassnahmen können eingeleitet werden, solange noch Handlungsspielraum besteht." },
      { title: "Entlastung der Projektleitung", body: "Die Projektleitung erhält einen erfahrenen Sparringspartner für kritische Situationen." },
      { title: "Höhere Transparenz", body: "Projektteam, Steuerungsgremium und Geschäftsleitung arbeiten mit einem gemeinsamen Risikobild." },
      { title: "Mehr Vertrauen", body: "Ein nachvollziehbarer Risikoprozess erhöht die Glaubwürdigkeit des Projektstatus." },
    ],
  },
  useCases: {
    eyebrow: "Einsatzgebiete",
    title: "Typische Einsatzgebiete",
    items: [
      "Software-Einführungen und Systemablösungen (ERP, DMS, PLM, MES, QMS, HCM, CRM)",
      "Digitale Transformationen",
      "Organisationsveränderungen",
      "Strategische Investitionsprojekte",
      "Produkteinführungen",
      "Integrationsprojekte",
      "Programme mit mehreren Lieferanten",
      "Projekte mit regulatorischen oder qualitativen Anforderungen",
      "Vorhaben mit hohem Zeitdruck oder kritischem Einführungstermin",
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Häufige Fragen",
    items: [
      {
        q: "Benötigt jedes Projekt einen externen Risk Manager?",
        a: "Nein. Bei kleinen und überschaubaren Vorhaben kann die Projektleitung das Risikomanagement selbst übernehmen. Bei strategisch wichtigen, komplexen oder bereits belasteten Projekten erhöht eine unabhängige Risikobegleitung jedoch die Transparenz und Entscheidungssicherheit.",
      },
      {
        q: "Ersetzt der Risk Manager die Projektleitung?",
        a: "Nein. Die Projektleitung bleibt für die operative Steuerung und Zielerreichung verantwortlich. Der Risk Manager ergänzt sie als unabhängiger Sparringspartner und schafft Transparenz über Risiken, Massnahmen und Entscheidungsbedarf.",
      },
      {
        q: "Wie gross ist der zeitliche Aufwand?",
        a: "Die laufende Begleitung umfasst typischerweise etwa ein paar Stunden bis zu einem Tag pro Woche. Intensität und Rhythmus richten sich nach Projektgrösse, Projektphase und Risikosituation.",
      },
      {
        q: "Muss zuerst ein Project Reality Check durchgeführt werden?",
        a: "Nicht zwingend. Bei unklarer Ausgangslage bietet der Project Reality Check jedoch eine fundierte Grundlage für die anschliessende Risikobegleitung.",
      },
      {
        q: "Kann die Begleitung später intern übernommen werden?",
        a: "Ja. Wir können den Risikoprozess aufbauen, etablieren und anschliessend strukturiert an eine interne Person oder Organisationseinheit übergeben.",
      },
    ],
  },
  closing: {
    title: "Welches Modell passt zu Ihrem Projekt?",
    body: "Manchmal genügt eine unabhängige Standortbestimmung. In anderen Situationen ist eine kontinuierliche Begleitung sinnvoll. In einem unverbindlichen Gespräch klären wir, wo Ihr Projekt steht und welche Form der Unterstützung einen konkreten Mehrwert schafft.",
    tags: ["Kostenlos", "30 Minuten", "Unverbindlich", "Flexibler Umfang"],
    primaryCta: { label: "Risikogespräch vereinbaren", interest: "risk-management" },
    secondaryCta: { label: "Project Reality Check anfragen", interest: "project-reality-check" },
  },
  breadcrumbs: { home: "Startseite", services: "Leistungen", current: "Risikomanagement" },
  contactPath: "/kontakt",
  prcPath: "/projectrealitycheck",
};

const en: RisikomanagementPageContent = {
  meta: {
    title: "Project risk management and external risk manager",
    excerpt:
      "External risk manager for demanding projects: ongoing support at roughly 10 to 20 percent capacity, or a focused Project Reality Check.",
  },
  hero: {
    title: "Project risk management",
    body:
      "Risks do not disappear when nobody talks about them. Abexis supports demanding projects as an external risk manager — on an ongoing basis at roughly 10 to 20 percent capacity, or through an independent Project Reality Check. We identify critical developments early, challenge project status and create the decision basis that project leadership, executive management and steering committees need.",
    primaryCta: { label: "Request a non-binding risk conversation", interest: "risk-management" },
    secondaryCta: { label: "View Project Reality Check", href: "/en/projectrealitycheck" },
  },
  problem: {
    title: "The project is running. But who keeps an eye on the risks?",
    intro:
      "Project leadership focuses on deadlines, deliverables, resources and daily coordination. Sub-project leads know their respective topics. The steering committee receives regular status reports. Yet one role is often missing: someone who views the overall picture independently and asks the hard questions:",
    questions: [
      "Which risks threaten project objectives?",
      "Which assumptions are not sufficiently secured?",
      "Which measures are actually working?",
      "Where are owners or decisions missing?",
      "Which development must be escalated to executive management?",
    ],
  },
  signs: {
    eyebrow: "Early signals",
    title: "Six signs that external risk support makes sense",
    items: [
      {
        num: "01",
        title: "Risks are collected but not actively managed",
        body: "The risk register exists but is rarely updated and has little influence on decisions.",
      },
      {
        num: "02",
        title: "Project status stays green for too long",
        body: "Problems are known but softened in reporting or only become visible late.",
      },
      {
        num: "03",
        title: "Critical measures remain open",
        body: "Ownership, deadlines and effectiveness of measures are not tracked consistently.",
      },
      {
        num: "04",
        title: "Project leadership is operationally overloaded",
        body: "There is no time or distance for an independent, cross-cutting risk view.",
      },
      {
        num: "05",
        title: "Decisions are delayed",
        body: "Critical topics are discussed repeatedly without clear decisions being made.",
      },
      {
        num: "06",
        title: "Management wants more certainty",
        body: "Executive management, the board or steering committee need a credible second opinion on actual project status.",
      },
    ],
  },
  models: {
    eyebrow: "Engagement models",
    title: "Two models for your project situation",
    ongoing: {
      title: "Ongoing risk support",
      intro:
        "Abexis supports your project regularly as an external risk manager. Typical scope is roughly 10 to 20 percent depending on project size and risk profile — for example half a day to one full day per week.",
      note: "This model suits strategically important, complex or high-risk initiatives that require continuous early detection and independent assessment.",
      bullets: [
        "Build or review the risk management approach",
        "Identify and assess risks in a structured way",
        "Regular conversations with project leadership and owners",
        "Facilitate risk workshops",
        "Prioritize by probability and impact",
        "Define and track effective measures",
        "Review early indicators and changes",
        "Prepare top risks for executive management and steering committees",
        "Formulate required decisions clearly",
        "Escalate critical developments",
      ],
    },
    prc: {
      title: "Focused Project Reality Check",
      body: "When an independent status assessment is needed first, we review the project in a focused and time-bound way. We analyse documents, interview key people and challenge status, planning, governance, risks, execution and change readiness. You receive a clear assessment, prioritized risks and concrete recommendations.",
      cta: { label: "More about the Project Reality Check", href: "/en/projectrealitycheck" },
    },
  },
  deliverables: {
    eyebrow: "Deliverables",
    title: "What you receive in practice",
    items: [
      { title: "Risk register", body: "A structured and prioritized overview of relevant project risks." },
      { title: "Risk heat map", body: "Transparency on probability, impact and action priority." },
      { title: "Executive risk report", body: "A compact management view of key risks, changes, measures and required decisions." },
      { title: "Measure tracking", body: "Clear ownership, deadlines and regular review of effectiveness." },
      { title: "Early indicators", body: "Measurable signals that reveal critical developments before they become project problems." },
      { title: "Independent assessment", body: "An external view on status, assumptions and remaining room to act." },
    ],
  },
  challengeAreas: {
    eyebrow: "Perspective",
    title: "What we challenge in the project",
    intro: "Risk management is not only about technical risks. We assess the project as a whole:",
    items: [
      { title: "Objectives and scope", body: "Are objectives, success criteria and scope still clear and realistic?" },
      { title: "Schedule and milestones", body: "Are timeline, dependencies and critical path robust?" },
      { title: "Resources", body: "Are required capacity and skills actually available?" },
      { title: "Governance", body: "Do roles, decision paths and escalation work reliably?" },
      { title: "Suppliers and partners", body: "Are external dependencies, deliverables and obligations actively managed?" },
      { title: "Data and technology", body: "Are data quality, migration, interfaces and technical decisions sufficiently secured?" },
      { title: "Testing and quality", body: "Are test scope, quality assurance and acceptance sufficient for the next phase?" },
      { title: "Organization and change", body: "Are users, leaders and affected units prepared for the change?" },
      { title: "Go-live and handover", body: "Are cutover, training, support, hypercare and operational takeover realistically planned?" },
    ],
  },
  process: {
    eyebrow: "Process",
    title: "How ongoing support works",
    steps: [
      { num: "01", title: "Clarify mandate and risk profile", body: "We discuss project objectives, starting point, existing governance and sponsor expectations." },
      { num: "02", title: "Assess the starting point", body: "We review existing risks, measures, reports and decision paths. Gaps are identified jointly." },
      { num: "03", title: "Establish the risk process", body: "Rating logic, ownership, reporting formats, meeting rhythm and escalation paths are agreed." },
      { num: "04", title: "Monitor risks continuously", body: "We challenge changes, track measures and check regularly for emerging risks." },
      { num: "05", title: "Inform management", body: "Executive management and steering committees receive a compact view of key risks, changes and required decisions." },
    ],
  },
  positioning: {
    title: "Not project policing — an independent sparring partner",
    intro:
      "The external risk manager neither replaces project leadership nor the sponsor's accountability. The role adds an independent perspective to the existing project organization. The goal is not to list as many risks as possible or create extra administration. It is to:",
    bullets: [
      "make the truly relevant risks visible",
      "ask uncomfortable questions early",
      "follow up on measures consistently",
      "escalate critical developments factually",
      "protect management's ability to decide",
    ],
    closing: "",
  },
  outcomes: {
    eyebrow: "Benefits",
    title: "What professional risk management achieves",
    items: [
      { title: "Fewer surprises", body: "Critical developments are recognized before they become acute problems." },
      { title: "Earlier decisions", body: "Management knows where action is needed and what delay would mean." },
      { title: "Protection of schedule and budget", body: "Countermeasures can be initiated while there is still room to act." },
      { title: "Relief for project leadership", body: "Project leadership gains an experienced sparring partner for critical situations." },
      { title: "Higher transparency", body: "Project team, steering committee and executive management share one risk picture." },
      { title: "More trust", body: "A traceable risk process increases credibility of project status." },
    ],
  },
  useCases: {
    eyebrow: "Use cases",
    title: "Typical situations",
    items: [
      "Software rollouts and system replacements (ERP, DMS, PLM, MES, QMS, HCM, CRM)",
      "Digital transformations",
      "Organizational change",
      "Strategic investment projects",
      "Product launches",
      "Integration projects",
      "Multi-vendor programmes",
      "Projects with regulatory or quality requirements",
      "Initiatives with high time pressure or critical go-live dates",
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    items: [
      {
        q: "Does every project need an external risk manager?",
        a: "No. For small and manageable initiatives, project leadership can handle risk management internally. For strategically important, complex or already strained projects, independent risk support increases transparency and decision confidence.",
      },
      {
        q: "Does the risk manager replace project leadership?",
        a: "No. Project leadership remains accountable for operational steering and delivery. The risk manager complements it as an independent sparring partner and creates transparency on risks, measures and decisions required.",
      },
      {
        q: "How much time is required?",
        a: "Ongoing support typically ranges from a few hours to about one day per week. Intensity and rhythm depend on project size, phase and risk profile.",
      },
      {
        q: "Must a Project Reality Check come first?",
        a: "Not necessarily. When the starting point is unclear, the Project Reality Check provides a solid basis for subsequent risk support.",
      },
      {
        q: "Can support be handed over internally later?",
        a: "Yes. We can build and establish the risk process and then transfer it in a structured way to an internal owner or unit.",
      },
    ],
  },
  closing: {
    title: "Which model fits your project?",
    body: "Sometimes an independent status assessment is enough. In other situations, continuous support makes sense. In a non-binding conversation we clarify where your project stands and which form of support creates concrete value.",
    tags: ["Free", "30 minutes", "Non-binding", "Flexible scope"],
    primaryCta: { label: "Schedule a risk conversation", interest: "risk-management" },
    secondaryCta: { label: "Request a Project Reality Check", interest: "project-reality-check" },
  },
  breadcrumbs: { home: "Home", services: "Services", current: "Risk management" },
  contactPath: "/en/kontakt",
  prcPath: "/en/projectrealitycheck",
};

export function getRisikomanagementContent(locale: RisikomanagementLocale): RisikomanagementPageContent {
  return locale === "en" ? en : de;
}
