/**
 * Copy for the abexis.ch home page (Hauptseite Consulting).
 * Editable in one place; components map this into existing visual patterns.
 *
 * Externe Termin-Links: in Komponenten via {@link siteConfig} aus `data/pages`, nicht hardcoden.
 */
export const homeHeroContent = {
  eyebrow: "Abexis Consulting",
  titleLines: [
    "Projekte laufen selten falsch",
    "aber oft in eine Richtung, die niemand so geplant hat.",
  ] as const,
  sub: "Abexis schafft Klarheit, wenn sie fehlt.",
  body: "Viele Projekte scheitern nicht an einem einzelnen Fehler. Sie verlieren schrittweise die Orientierung und das bleibt oft lange unklar.",
  primaryCta: { href: "/projectrealitycheck" as const, label: "Project Reality Check anfragen" },
  secondaryCta: { href: "/kontakt" as const, label: "Unverbindliches Gespräch" },
} as const;

export const homeChallengeContent = {
  eyebrow: "Die Herausforderung",
  headline: "Projekte bewegen sich, aber die Lage bleibt unklar.",
  intro:
    "Meetings finden statt. Berichte werden erstellt. Und trotzdem bleibt oft offen, wie das Projekt tatsächlich steht.",
  situationsSubline: "Vier Muster, die wir in kritischen Projekten immer wieder sehen.",
  groups: [
    {
      title: "Transparenz fehlt",
      bullets: [
        "Statusberichte zeigen nur einen Teil der Realität",
        "Probleme werden eingeordnet, aber nicht geklärt",
        "Risiken sind vorhanden, aber schwer greifbar",
      ],
    },
    {
      title: "Unterschiedliche Sichtweisen",
      lines: ["IT sieht Fortschritt", "Business erlebt Stillstand", "Im Steering fehlt ein gemeinsames Bild"],
    },
    {
      title: "Signale kommen zu spät",
      bullets: [
        "Budget entwickelt sich anders als geplant",
        "Zeitpläne bleiben optimistisch",
        "Schlüsselpersonen verlieren Vertrauen oder steigen aus",
      ],
    },
    {
      title: "Entscheidungen verzögern sich",
      bullets: [
        "Kritische Punkte werden nicht klar benannt",
        "Eskalationen erfolgen spät",
        "Zeit geht verloren, ohne dass es sichtbar wird",
      ],
    },
  ] as const,
  whatIsMissing: {
    title: "Was fehlt",
    line: "Ein klarer, unabhängiger Blick auf das Projekt",
    sub: "als Grundlage für fundierte Entscheidungen",
  },
  whenExternal: {
    title: "Wann ein externer Blick sinnvoll ist",
    bullets: ["Wenn Unsicherheit zunimmt", "Wenn der Druck steigt", "Wenn wichtige Entscheidungen offen bleiben"],
  },
  framing: "Das grösste Risiko ist nicht der Fehler, sondern fehlende Klarheit.",
} as const;

export const homeWhoWeAreContent = {
  eyebrow: "Wer wir sind",
  headline: "Erfahrung, die einordnet und Verantwortung übernimmt.",
  intro: [
    "Wir kennen diese Situationen aus eigener Praxis. Aus Linienverantwortung, aus kritischen Projekten und aus Entscheidungen unter Druck.",
    "Wir sprechen an, was ist. Klar, sachlich und ohne Umwege.",
  ] as const,
  daniel: {
    name: "Daniel Sengstag",
    role: "Gründer und Inhaber",
    body: [
      "30 Jahre Erfahrung in Industrie, Software und Technologie. Ehemaliger Country Manager bei Siemens Industry Software und EMEA Sales Director bei Dassault Systèmes.",
      "Maschinenbauingenieur, Executive MBA, zertifizierter Verwaltungsrat. Zertifiziert in HERMES, PRINCE2 und ITIL 4.",
      "Er arbeitet direkt mit Kunden und führt Mandate persönlich.",
    ] as const,
  },
} as const;

export const homePrcContent = {
  eyebrow: "Angebot",
  headline: "Klarheit über den tatsächlichen Stand Ihres Projekts.",
  sub: "In 3 Tagen bis 4 Wochen erhalten Sie eine belastbare Einschätzung und konkrete nächste Schritte.",
  context:
    "Der Project Reality Check wird eingesetzt, wenn Unsicherheit besteht oder Entscheidungen anstehen. Er schafft eine gemeinsame Grundlage, bevor sich Risiken weiter verfestigen.",
  youGet: {
    title: "Was Sie erhalten",
    bullets: [
      "Executive Summary für Geschäftsleitung und Verwaltungsrat",
      "Bewertung entlang von 6 Dimensionen",
      "Priorisierte Risiken mit Eintrittswahrscheinlichkeit",
      "Einschätzung von Governance und Entscheidungsstruktur",
      "Analyse der Umsetzungs- und Veränderungsfähigkeit",
      "Massnahmenplan für 30, 60 und 90 Tage",
      "Klare Empfehlung: Continue, Stabilize oder Reset",
    ],
  },
  dimensionsLabel: "Bewertungsdimensionen",
  dimensions: "Strategie · Governance · Umsetzung · Risiken · Veränderung · Technologie",
  packages: [
    {
      name: "LIGHT",
      sub: "Schnelle Standortbestimmung",
      duration: "3-5 Tage",
      body: "Erste strukturierte Einschätzung mit Fokus auf kritische Punkte",
      outcome: "Überblick, zentrale Risiken, erste Empfehlungen",
    },
    {
      name: "CORE",
      sub: "Management Klarheit (empfohlen)",
      duration: "1-2 Wochen",
      body: "Interviews, Dokumentenreview, vollständige Bewertung",
      outcome: "Klare Lageeinschätzung und konkrete Entscheidungsgrundlage",
      recommended: true,
    },
    {
      name: "DEEP DIVE",
      sub: "Stabilisierung und Ausrichtung",
      duration: "3-4 Wochen",
      body: "Vertiefte Analyse und Workshops",
      outcome: "Gesamtbild, klare Prioritäten und umsetzbare Roadmap",
    },
  ] as const,
  secondaryCta: { href: "/projectrealitycheck" as const, label: "Mehr erfahren" },
  /** Primär-CTA = Outlook Booking; `href` in UI aus {@link siteConfig.bookingUrlDe} */
  primaryCtaLabel: "Unverbindlichen Termin vereinbaren",
} as const;

export const homeProcessContent = {
  eyebrow: "Vorgehen",
  headline: "Drei Schritte zu einer klaren Entscheidungsgrundlage.",
  steps: [
    {
      title: "Erstgespräch",
      body: "Sie schildern die Situation. Wir stellen gezielte Fragen. Am Ende ist klar, ob eine Analyse sinnvoll ist.",
    },
    {
      title: "Analyse",
      body: "Interviews, Dokumentenreview und strukturierte Bewertung. Der Umfang richtet sich nach Situation und Paket.",
    },
    {
      title: "Ergebnis",
      body: "Sie erhalten eine klare Einschätzung, priorisierte Risiken und konkrete nächste Schritte.",
    },
  ] as const,
} as const;

export const homeLeistungenBlock = {
  eyebrow: "Leistungen",
  headline: "Unterstützung in entscheidenden Situationen.",
  intro:
    "Der Project Reality Check ist der Einstieg. Darüber hinaus arbeiten wir in folgenden Bereichen.",
  items: [
    {
      title: "Project Reality Check",
      body: "Unabhängige Beurteilung Ihres Projekts: Risiken, Lücken und konkrete Handlungsempfehlungen in kompakter Form.",
      href: "/projectrealitycheck",
    },
    {
      title: "Digitale Transformation",
      body: "Einführung und Weiterentwicklung von digitalen Lösungen, KI und Analytics. Fokus auf Nutzen, Integration und Umsetzung.",
      href: "/fokusthemen/digitale-transformation",
    },
    {
      title: "Unternehmensstrategie",
      body: "Strukturierte Strategiearbeit mit klarer Priorisierung. Grundlage für Entscheidungen und Umsetzung.",
      href: "/fokusthemen/unternehmensstrategie",
    },
    {
      title: "Vertrieb und Marketing",
      body: "Analyse und Weiterentwicklung von Marktansprache und Vertrieb. Ziel: nachvollziehbares und steuerbares Wachstum.",
      href: "/fokusthemen/vertriebmarketing",
    },
    {
      title: "Veränderungsmanagement",
      body: "Begleitung von Transformationen auf organisatorischer und menschlicher Ebene. Fokus auf Klarheit und Akzeptanz.",
      href: "/fokusthemen/veränderungsmanagement",
    },
    {
      title: "Prozessoptimierung",
      body: "Analyse und Verbesserung bestehender Abläufe. Reduktion von Komplexität und Steigerung der Effizienz.",
      href: "/fokusthemen/prozessoptimierung",
    },
    {
      title: "Projektmanagement",
      body: "Führung und Stabilisierung kritischer Projekte. Klare Struktur und transparente Steuerung.",
      href: "/fokusthemen/projektmanagement",
    },
    {
      title: "Executive Search (Abexis SEARCH)",
      body: "Besetzung von Schlüsselpositionen in anspruchsvollen Situationen. Fokus auf Persönlichkeiten mit Verantwortung.",
      href: "/executive-search",
    },
  ] as const,
} as const;

export const homeClarityContent = {
  eyebrow: "Einordnung",
  without: {
    title: "Ohne klare Einordnung:",
    bullets: [
      "Risiken werden spät erkannt",
      "Entscheidungen verzögern sich",
      "Unterschiedliche Sichtweisen im Management",
      "Fortschritt ist schwer einzuordnen",
    ],
  },
  with: {
    title: "Mit klarer Einordnung:",
    bullets: [
      "Klare Sicht auf die tatsächliche Situation",
      "Risiken sind benannt und priorisiert",
      "Gemeinsames Verständnis entsteht",
      "Entscheidungen können getroffen werden",
    ],
  },
} as const;

export const homeClosingContent = {
  headline: "Nehmen wir uns 30 Minuten.",
  body: "Im Gespräch klären wir Ihre Situation und geben eine erste Einschätzung. Danach entscheiden Sie, ob ein nächster Schritt sinnvoll ist.",
  ctaLabel: "Termin vereinbaren",
} as const;

export const homeHeroContentEn = {
  eyebrow: "Abexis Consulting",
  titleLines: [
    "Projects rarely fail outright",
    "but often drift in a direction nobody intended.",
  ] as const,
  sub: "Abexis creates clarity when it is missing.",
  body: "Many projects do not fail because of one single mistake. They gradually lose orientation, and that often remains unclear for too long.",
  primaryCta: { href: "/en/projectrealitycheck" as const, label: "Request a Project Reality Check" },
  secondaryCta: { href: "/en/kontakt" as const, label: "Non-binding conversation" },
} as const;

export const homeChallengeContentEn = {
  eyebrow: "The challenge",
  headline: "Projects keep moving, but the real situation remains unclear.",
  intro:
    "Meetings take place. Reports are written. And still it often remains unclear where the project really stands.",
  situationsSubline: "Four patterns we repeatedly see in critical projects.",
  groups: [
    {
      title: "Transparency is missing",
      bullets: [
        "Status reports show only part of reality",
        "Problems are categorized but not resolved",
        "Risks exist, but are hard to grasp",
      ],
    },
    {
      title: "Different perspectives",
      lines: ["IT sees progress", "The business experiences standstill", "Steering lacks a shared picture"],
    },
    {
      title: "Signals arrive too late",
      bullets: [
        "Budgets develop differently than planned",
        "Timelines remain optimistic",
        "Key people lose trust or leave the project",
      ],
    },
    {
      title: "Decisions are delayed",
      bullets: [
        "Critical points are not named clearly",
        "Escalations happen late",
        "Time is lost before it becomes visible",
      ],
    },
  ] as const,
  whatIsMissing: {
    title: "What is missing",
    line: "A clear, independent view of the project",
    sub: "as the basis for sound decisions",
  },
  whenExternal: {
    title: "When an external view makes sense",
    bullets: ["When uncertainty grows", "When pressure increases", "When important decisions remain open"],
  },
  framing: "The greatest risk is not the mistake, but missing clarity.",
} as const;

export const homeWhoWeAreContentEn = {
  eyebrow: "Who we are",
  headline: "Experience that classifies the situation and takes responsibility.",
  intro: [
    "We know these situations from our own practice: from line responsibility, critical projects and decisions under pressure.",
    "We address what is actually happening. Clearly, objectively and without detours.",
  ] as const,
  daniel: {
    name: "Daniel Sengstag",
    role: "Founder and owner",
    body: [
      "30 years of experience in industry, software and technology. Former Country Manager at Siemens Industry Software and EMEA Sales Director at Dassault Systèmes.",
      "Mechanical engineer, Executive MBA and certified board director. Certified in HERMES, PRINCE2 and ITIL 4.",
      "He works directly with clients and personally leads mandates.",
    ] as const,
  },
} as const;

export const homePrcContentEn = {
  eyebrow: "Offering",
  headline: "Clarity about the real status of your project.",
  sub: "Within 3 days to 4 weeks, you receive a reliable assessment and concrete next steps.",
  context:
    "The Project Reality Check is used when uncertainty exists or decisions are pending. It creates a shared basis before risks become more deeply embedded.",
  youGet: {
    title: "What you receive",
    bullets: [
      "Executive summary for management and board",
      "Assessment across 6 dimensions",
      "Prioritized risks with probability",
      "Assessment of governance and decision structures",
      "Analysis of implementation and change readiness",
      "Action plan for 30, 60 and 90 days",
      "Clear recommendation: Continue, Stabilize or Reset",
    ],
  },
  dimensionsLabel: "Assessment dimensions",
  dimensions: "Strategy · Governance · Execution · Risks · Change · Technology",
  packages: [
    {
      name: "LIGHT",
      sub: "Quick status assessment",
      duration: "3-5 days",
      body: "First structured assessment focused on critical points",
      outcome: "Overview, central risks, initial recommendations",
    },
    {
      name: "CORE",
      sub: "Management clarity (recommended)",
      duration: "1-2 weeks",
      body: "Interviews, document review and full assessment",
      outcome: "Clear situation assessment and concrete decision basis",
      recommended: true,
    },
    {
      name: "DEEP DIVE",
      sub: "Stabilization and alignment",
      duration: "3-4 weeks",
      body: "In-depth analysis and workshops",
      outcome: "Overall picture, clear priorities and actionable roadmap",
    },
  ] as const,
  secondaryCta: { href: "/en/projectrealitycheck" as const, label: "Learn more" },
  primaryCtaLabel: "Schedule a non-binding call",
} as const;

export const homeProcessContentEn = {
  eyebrow: "Approach",
  headline: "Three steps to a clear decision basis.",
  steps: [
    {
      title: "Initial conversation",
      body: "You describe the situation. We ask targeted questions. At the end, it is clear whether an assessment makes sense.",
    },
    {
      title: "Analysis",
      body: "Interviews, document review and structured assessment. The scope depends on the situation and selected phase.",
    },
    {
      title: "Result",
      body: "You receive a clear assessment, prioritized risks and concrete next steps.",
    },
  ] as const,
} as const;

export const homeLeistungenBlockEn = {
  eyebrow: "Services",
  headline: "Support in situations where decisions matter.",
  intro:
    "The Project Reality Check is the starting point. Beyond that, we work in the following areas.",
  items: [
    {
      title: "Project Reality Check",
      body: "Independent assessment of your project: risks, gaps and concrete recommendations in a compact format.",
      href: "/en/projectrealitycheck",
    },
    {
      title: "Digital Transformation",
      body: "Introduction and development of digital solutions, AI and analytics. Focused on value, integration and implementation.",
      href: "/en/fokusthemen/digitale-transformation",
    },
    {
      title: "Corporate Strategy",
      body: "Structured strategy work with clear prioritization. A basis for decisions and implementation.",
      href: "/en/fokusthemen/unternehmensstrategie",
    },
    {
      title: "Sales and Marketing",
      body: "Analysis and development of market approach and sales. Goal: understandable and manageable growth.",
      href: "/en/fokusthemen/vertriebmarketing",
    },
    {
      title: "Change Management",
      body: "Support for transformations at organizational and human level. Focused on clarity and acceptance.",
      href: "/en/fokusthemen/veränderungsmanagement",
    },
    {
      title: "Process Optimization",
      body: "Analysis and improvement of existing workflows. Reducing complexity and increasing efficiency.",
      href: "/en/fokusthemen/prozessoptimierung",
    },
    {
      title: "Project Management",
      body: "Leadership and stabilization of critical projects. Clear structure and transparent steering.",
      href: "/en/fokusthemen/projektmanagement",
    },
    {
      title: "Executive Search (Abexis SEARCH)",
      body: "Filling key positions in demanding situations. Focused on personalities who take responsibility.",
      href: "/en/executive-search",
    },
  ] as const,
} as const;

export const homeClarityContentEn = {
  eyebrow: "Perspective",
  without: {
    title: "Without clear classification:",
    bullets: [
      "Risks are recognized late",
      "Decisions are delayed",
      "Different views emerge in management",
      "Progress is hard to judge",
    ],
  },
  with: {
    title: "With clear classification:",
    bullets: [
      "Clear view of the real situation",
      "Risks are named and prioritized",
      "A shared understanding emerges",
      "Decisions can be made",
    ],
  },
} as const;

export const homeClosingContentEn = {
  headline: "Let us take 30 minutes.",
  body: "In a conversation, we clarify your situation and give an initial assessment. After that, you decide whether a next step makes sense.",
  ctaLabel: "Schedule a call",
} as const;
