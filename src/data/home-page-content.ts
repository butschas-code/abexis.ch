/**
 * Copy for the abexis.ch home page (Hauptseite Consulting).
 * Editable in one place; components map this into existing visual patterns.
 *
 * Externe Termin-Links: in Komponenten via {@link siteConfig} aus `data/pages`, nicht hardcoden.
 */
export const homeHeroContent = {
  eyebrow: "Abexis · Managementberatung und Umsetzung",
  titleLines: ["Management stärken.", "Veränderung umsetzen."] as const,
  sub: "Wenn wichtige Vorhaben mehr Erfahrung oder Kapazität brauchen, ist Abexis an Ihrer Seite.",
  body: "Wir beraten Geschäftsleitungen und übernehmen Verantwortung in der Umsetzung.",
  primaryCta: { href: "#leistungen" as const, label: "Leistungen entdecken" },
  secondaryCta: { href: "/kontakt" as const, label: "Unverbindliches Gespräch" },
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

export const homeProcessContent = {
  eyebrow: "Zusammenarbeit",
  headline: "Ein klarer Auftrag. Eine verbindliche Zusammenarbeit.",
  steps: [
    { title: "Ausgangslage verstehen", body: "Wir hören zu und klären, welche Aufgabe tatsächlich gelöst werden soll." },
    { title: "Auftrag abgrenzen", body: "Sie wissen, welche Verantwortung Abexis übernimmt und wer entscheidet." },
    { title: "Umsetzung führen", body: "Wir arbeiten mit Ihren Verantwortlichen zusammen und machen Fortschritte sichtbar." },
    { title: "Ergebnisse nachhalten", body: "Wir überprüfen die vereinbarten Ziele und regeln die Übergabe." },
  ] as const,
} as const;

export const homeClosingContent = {
  headline: "Nehmen wir uns 30 Minuten.",
  body: "Im Gespräch klären wir Ihre Situation und geben eine erste Einschätzung. Danach entscheiden Sie, ob ein nächster Schritt sinnvoll ist.",
  ctaLabel: "Termin vereinbaren",
} as const;

export const homeHeroContentEn = {
  eyebrow: "Abexis · Management consulting and delivery",
  titleLines: ["Strengthen management.", "Deliver change."] as const,
  sub: "When important initiatives need more experience or capacity, Abexis is at your side.",
  body: "We advise executive teams and take responsibility for delivery.",
  primaryCta: { href: "#leistungen" as const, label: "Explore our services" },
  secondaryCta: { href: "/en/kontakt" as const, label: "Non-binding conversation" },
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

export const homeProcessContentEn = {
  eyebrow: "Working together",
  headline: "A clear mandate. A committed collaboration.",
  steps: [
    { title: "Understand the situation", body: "We listen and clarify which task actually needs to be solved." },
    { title: "Define the mandate", body: "You know which responsibilities Abexis takes on and who decides." },
    { title: "Lead delivery", body: "We work with your people in charge and make progress visible." },
    { title: "Follow through on results", body: "We review the agreed goals and organise the handover." },
  ] as const,
} as const;

export const homeClosingContentEn = {
  headline: "Let us take 30 minutes.",
  body: "In a conversation, we clarify your situation and give an initial assessment. After that, you decide whether a next step makes sense.",
  ctaLabel: "Schedule a call",
} as const;
