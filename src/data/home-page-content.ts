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
  primaryCta: { href: "/projectfitcheck" as const, label: "Project Reality Check anfragen" },
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
      duration: "3–5 Tage",
      body: "Erste strukturierte Einschätzung mit Fokus auf kritische Punkte",
      outcome: "Überblick, zentrale Risiken, erste Empfehlungen",
    },
    {
      name: "CORE",
      sub: "Management Klarheit (empfohlen)",
      duration: "1–2 Wochen",
      body: "Interviews, Dokumentenreview, vollständige Bewertung",
      outcome: "Klare Lageeinschätzung und konkrete Entscheidungsgrundlage",
      recommended: true,
    },
    {
      name: "DEEP DIVE",
      sub: "Stabilisierung und Ausrichtung",
      duration: "3–4 Wochen",
      body: "Vertiefte Analyse und Workshops",
      outcome: "Gesamtbild, klare Prioritäten und umsetzbare Roadmap",
    },
  ] as const,
  secondaryCta: { href: "/projectfitcheck" as const, label: "Mehr erfahren" },
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
