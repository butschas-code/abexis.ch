export type PlmPdmLocale = "de" | "en";

const de = {
  meta: {
    title: "PLM/PDM Beratung und Projektleitung",
    excerpt:
      "Wir begleiten die Einführung und Weiterentwicklung von PLM/PDM von der fachlichen Vorbereitung bis zur produktiven Nutzung.",
  },
  breadcrumbs: { home: "Startseite", services: "Leistungen", current: "PLM/PDM Beratung" },
  hero: {
    eyebrow: "Product Lifecycle Management",
    title: "PLM/PDM Beratung und Projektleitung",
    body:
      "Wir begleiten die Einführung und Weiterentwicklung von PLM/PDM von der fachlichen Vorbereitung bis zur produktiven Nutzung.",
    note: "Für Endkunden sowie Reseller und Implementierungspartner. Schwerpunkt: Siemens Teamcenter.",
    primaryCta: "PLM-Gespräch vereinbaren",
    secondaryCta: "Leistungen ansehen",
  },
  services: {
    eyebrow: "Leistungen",
    title: "Unterstützung, die zu Ihrem PLM-Vorhaben passt.",
    intro:
      "Sie planen eine Einführung, lösen ein PDM-System ab oder erweitern eine bestehende Umgebung? Abexis übernimmt Beratung und Projektleitung auf Kunden- oder Anbieterseite. Das Angebot gilt für PLM/PDM generell, mit besonderem Schwerpunkt auf Siemens Teamcenter.",
    items: [
      {
        label: "Vorbereitung",
        title: "Fachkonzeption und Evaluation",
        body: "Wir analysieren Ihre Ausgangslage und beschreiben die künftige Arbeits- und Datenorganisation. Daraus leiten wir Anforderungen ab und unterstützen die Systemauswahl. Ist Teamcenter bereits gesetzt, prüfen wir die Abdeckung und offenen Punkte.",
        outcomeLabel: "Sie erhalten",
        outcome: "Ein nachvollziehbares Fachkonzept, prüfbare Anforderungen und eine Grundlage für Ihre Systementscheidung.",
      },
      {
        label: "Projektführung",
        title: "Projektleitung auf Zeit",
        body: "Wir übernehmen die Projektleitung auf Kunden- oder Anbieterseite oder entlasten Ihre bestehende Projektleitung. Wir stimmen Fachbereiche und Umsetzungsteam ab, bereiten Entscheidungen vor und verfolgen die vereinbarten Lieferobjekte.",
        outcomeLabel: "Sie gewinnen",
        outcome: "Zusätzliche Führungskapazität und transparente Steuerung – auch wenn Ihr Projekt planmässig läuft.",
      },
      {
        label: "Lösungsarchitektur",
        title: "Fachliche Lösungsarchitektur",
        body: "Wir übersetzen das Fachkonzept gemeinsam mit den technischen Spezialisten in ein umsetzbares Lösungskonzept. Im Mittelpunkt stehen Datenmodell, Systemgrenzen sowie die fachlichen Regeln für Änderungen und Freigaben.",
        outcomeLabel: "Sie schaffen",
        outcome: "Eine abgestimmte Grundlage für Konfiguration, Integration und Tests.",
      },
      {
        label: "Unabhängige Beurteilung",
        title: "PLM Project Reality Check",
        body: "Wir beurteilen die Vorbereitung oder den Stand Ihres Vorhabens. Interviews und Dokumentenreview zeigen, wo Voraussetzungen fehlen, Risiken entstehen oder Entscheidungen nötig sind.",
        outcomeLabel: "Sie erhalten",
        outcome: "Eine klare Einschätzung mit priorisierten Risiken und konkreten nächsten Schritten.",
      },
    ],
  },
  audiences: {
    eyebrow: "Mandatsmodelle",
    title: "Für Unternehmen und PLM-Anbieter.",
    items: [
      {
        title: "Auf Kundenseite",
        body: "Wir begleiten Ihr Unternehmen von der fachlichen Vorbereitung bis zur produktiven Nutzung. Als kundenseitige Projektleitung vertreten wir die vereinbarten Projektziele und koordinieren die Zusammenarbeit mit dem Implementierungspartner.",
      },
      {
        title: "Für Reseller und Implementierungspartner",
        body: "Wir ergänzen Ihre Beratung und übernehmen Projektleitungsaufgaben auf Anbieterseite. Je nach Mandat erarbeiten wir fachliche Konzepte mit Ihrem Kunden, koordinieren das Umsetzungsteam oder führen das Einführungsprojekt.",
      },
    ],
  },
  fields: {
    eyebrow: "Handlungsfelder",
    title: "Die fachlichen Grundlagen müssen zusammenpassen.",
    intro:
      "Der benötigte Funktionsumfang ergibt sich aus Ihrem Geschäftsmodell. Wir klären, was zum ersten Einführungsschritt gehört und welche Voraussetzungen für spätere Erweiterungen stehen müssen.",
    items: [
      { title: "Prozesse und Verantwortung", body: "Künftige Abläufe für Entwicklung, Änderung und Freigabe sowie Verantwortlichkeiten, Entscheidungswege und Übergaben." },
      { title: "Datenmodell und Stammdaten", body: "Eindeutige Begriffe, Identitäten und Beziehungen zwischen Teilen und Dokumenten – inklusive Verantwortung für Bereinigung und Pflege." },
      { title: "Produktstrukturen und Varianten", body: "Abstimmung von CAx-Daten und fachlichen Stücklisten sowie Merkmale und zulässige Kombinationen im Produktbaukasten." },
      { title: "CAx, ERP und Folgeprozesse", body: "Klare Systemführerschaft, definierte Übergaben sowie Freigaberegeln und Fehlerbehandlung im Integrationskonzept." },
      { title: "Anwender und Veränderung", body: "Frühe Einbindung von Key Usern und Prozessverantwortlichen; Schulung anhand der neuen Arbeitsabläufe und konkreter Systemaufgaben." },
      { title: "Tests und produktive Nutzung", body: "Fachliche Abnahme vollständiger Abläufe, erprobte Migration und Umstellung sowie geregelter Support und Betrieb." },
    ],
    principleLabel: "Unser Grundsatz",
    principle:
      "Die künftige Arbeitsweise bestimmt das Fachkonzept. Das Fachkonzept bestimmt die Anforderungen an die Software.",
  },
  approach: {
    eyebrow: "Vorgehensmodell",
    title: "Von der fachlichen Klarheit zur nutzbaren Lösung.",
    intro:
      "Wir verbinden die Gesamtsicht mit einem abgegrenzten, realisierbaren ersten Umfang. Anwendungsfälle helfen, Anforderungen zu konkretisieren und das Konzept zu überprüfen.",
    items: [
      { title: "Analyse und Fachkonzept", body: "Ziele und Ausgangslage klären. Künftige Prozesse, Rollen und Datenorganisation systemneutral beschreiben." },
      { title: "System und Lösungskonzept", body: "Anforderungen mit konkreten Fällen prüfen. Die gewählte Lösung auf das Fachkonzept abbilden und notwendige Anpassungen entscheiden." },
      { title: "Daten und Pilot", body: "Den vorgesehenen Datenumfang aufbereiten. Mit echten Produktdaten Freigaben, Änderungen und Systemübergänge testen." },
      { title: "Einführung und Übergabe", body: "Nach fachlicher Abnahme umstellen. Anwender und Support befähigen, den Betrieb übergeben und weitere Schritte priorisieren." },
    ],
    note: "Die Stammdatenorganisation beginnt bereits mit der Bestandsanalyse und läuft als eigener Arbeitsstrang parallel.",
  },
  benefits: {
    eyebrow: "Nutzen",
    title: "Worauf Sie sich im Projekt verlassen können.",
    items: [
      { title: "Entscheidungen mit fachlicher Grundlage", body: "Anforderungen und offene Punkte sind nachvollziehbar. Die Geschäftsleitung erkennt, welche Entscheidungen und Ressourcen benötigt werden." },
      { title: "Eindeutige Datenstände und Freigaben", body: "Es ist erkennbar, welcher Produktstand für welchen Prozess verwendet werden darf. Das schafft verlässliche Übergaben." },
      { title: "Ein steuerbarer Projektumfang", body: "Prioritäten und Abhängigkeiten sind sichtbar. Erweiterungen werden hinsichtlich Aufwand und Terminen beurteilt." },
      { title: "Vorbereitete Anwender und geregelter Betrieb", body: "Neue Aufgaben werden vor der Einführung geübt. Nach der Umstellung sind Ansprechpartner und Zuständigkeiten geklärt." },
    ],
  },
  role: {
    eyebrow: "Unsere Rolle",
    title: "Fachliches Verständnis und klare Projektführung.",
    paragraphs: [
      "Product Lifecycle Management verbindet Engineering mit den nachfolgenden Wertschöpfungsprozessen. Dafür braucht es eine gemeinsame Sicht auf das Produkt und eine Projektorganisation, die Entscheidungen verbindlich umsetzt.",
      "Abexis führt die fachlichen und organisatorischen Themen zusammen. Wir arbeiten je nach Mandat im Auftrag des Anwenderunternehmens oder des PLM-Anbieters und stimmen die Umsetzung mit Fachbereichen und technischen Spezialisten ab.",
      "Der Auftrag kann die Vorbereitung, eine gezielte Beurteilung oder die Projektleitung umfassen. Zu Beginn vereinbaren wir, auf welcher Seite wir tätig sind, welche Aufgaben wir übernehmen und wer verbindlich entscheidet.",
    ],
    personLabel: "Ihr Ansprechpartner",
    personName: "Daniel Sengstag",
    personBody:
      "Ingenieur und Executive MBA. Erfahrung aus Engineering, Beratung und Führungsrollen bei Siemens Digital Industries Software und Dassault Systèmes.",
    personLink: "Mehr zu Daniel Sengstag",
  },
  faq: {
    eyebrow: "Häufige Fragen",
    title: "Passend zu Ihrer Ausgangslage.",
    items: [
      { q: "Muss die Software bereits ausgewählt sein?", a: "Nein. Wir können die fachliche Grundlage erarbeiten und die Evaluation unterstützen. Ist Teamcenter oder eine andere Lösung gesetzt, prüfen wir die Abdeckung und klären die verbleibenden Entscheidungen." },
      { q: "Unterstützen Sie auch bestehende PLM/PDM-Lösungen?", a: "Ja. Anlass kann ein zusätzlicher Standort, ein neuer Prozess oder eine geplante Ablösung sein. Wir beurteilen die Ausgangslage, klären den benötigten Umfang und begleiten die Weiterentwicklung." },
      { q: "Ist eine externe Projektleitung auch bei einem gut laufenden Projekt sinnvoll?", a: "Ja, wenn das Vorhaben mehr Kapazität benötigt als intern verfügbar ist. Auftrag und Zusammenarbeit mit den Fachverantwortlichen werden klar abgegrenzt." },
      { q: "Ist das Angebot auf Siemens Teamcenter beschränkt?", a: "Nein. Das Angebot gilt für PLM/PDM generell. Unser besonderer Schwerpunkt liegt auf Siemens Teamcenter; Analyse und Evaluation erfolgen systemneutral." },
      { q: "Können Reseller und Implementierungspartner Abexis beauftragen?", a: "Ja. Wir unterstützen bei der Beratung ihrer Kunden und übernehmen Projektleitungsaufgaben auf Anbieterseite." },
    ],
  },
  closing: {
    eyebrow: "Nächster Schritt",
    title: "30 Minuten, um den nächsten Schritt zu klären.",
    body: "Sie planen oder führen ein PLM/PDM-Vorhaben als Unternehmen, Reseller oder Implementierungspartner? Gemeinsam klären wir, wo Unterstützung sinnvoll ist und welche Aufgaben Abexis übernehmen kann.",
    primaryCta: "Unverbindliches Erstgespräch buchen",
    secondaryCta: "Kontakt aufnehmen",
  },
} as const;

const en = {
  meta: {
    title: "PLM/PDM Consulting and Project Leadership",
    excerpt:
      "We support the implementation and further development of PLM/PDM, from business preparation through to productive use.",
  },
  breadcrumbs: { home: "Home", services: "Services", current: "PLM/PDM consulting" },
  hero: {
    eyebrow: "Product Lifecycle Management",
    title: "PLM/PDM Consulting and Project Leadership",
    body:
      "We support the implementation and further development of PLM/PDM, from business preparation through to productive use.",
    note: "For end customers, resellers and implementation partners. Focus: Siemens Teamcenter.",
    primaryCta: "Arrange a PLM conversation",
    secondaryCta: "Explore services",
  },
  services: {
    eyebrow: "Services",
    title: "Support tailored to your PLM initiative.",
    intro:
      "Are you planning an implementation, replacing a PDM system or developing an existing environment? Abexis provides consulting and project leadership on the customer or provider side. Our work covers PLM/PDM generally, with particular expertise in Siemens Teamcenter.",
    items: [
      {
        label: "Preparation",
        title: "Business concept and evaluation",
        body: "We analyse your starting point and describe the future working and data organisation. From this, we derive requirements and support system selection. If Teamcenter is already selected, we assess coverage and open points.",
        outcomeLabel: "You receive",
        outcome: "A coherent business concept, testable requirements and a sound basis for your system decision.",
      },
      {
        label: "Project leadership",
        title: "Interim project leadership",
        body: "We lead the project on the customer or provider side, or reinforce your existing project management. We align business teams and the implementation team, prepare decisions and track agreed deliverables.",
        outcomeLabel: "You gain",
        outcome: "Additional leadership capacity and transparent steering – even when your project is progressing to plan.",
      },
      {
        label: "Solution architecture",
        title: "Business solution architecture",
        body: "Together with technical specialists, we translate the business concept into an implementable solution. The focus is on the data model, system boundaries and business rules for changes and releases.",
        outcomeLabel: "You create",
        outcome: "An aligned foundation for configuration, integration and testing.",
      },
      {
        label: "Independent assessment",
        title: "PLM Project Reality Check",
        body: "We assess the preparation or current state of your initiative. Interviews and document reviews reveal missing prerequisites, emerging risks and decisions that need to be made.",
        outcomeLabel: "You receive",
        outcome: "A clear assessment with prioritised risks and concrete next steps.",
      },
    ],
  },
  audiences: {
    eyebrow: "Engagement models",
    title: "For businesses and PLM providers.",
    items: [
      {
        title: "On the customer side",
        body: "We support your organisation from business preparation through to productive use. As customer-side project leadership, we represent the agreed project objectives and coordinate collaboration with the implementation partner.",
      },
      {
        title: "For resellers and implementation partners",
        body: "We complement your consulting capabilities and take on provider-side project leadership. Depending on the mandate, we develop business concepts with your customer, coordinate the implementation team or lead the introduction project.",
      },
    ],
  },
  fields: {
    eyebrow: "Key areas",
    title: "The business foundations need to work together.",
    intro:
      "The required functionality follows from your business model. We clarify what belongs in the first implementation step and which foundations must support later extensions.",
    items: [
      { title: "Processes and responsibilities", body: "Future development, change and release workflows, including responsibilities, decision paths and handovers." },
      { title: "Data model and master data", body: "Clear terms, identities and relationships between parts and documents, with ownership for cleansing and maintenance." },
      { title: "Product structures and variants", body: "Alignment of CAx data and business bills of materials, including features and permitted combinations in the product architecture." },
      { title: "CAx, ERP and downstream processes", body: "Clear system ownership, defined transfers, release rules and error handling within the integration concept." },
      { title: "Users and change", body: "Early involvement of key users and process owners, with training based on new workflows and concrete system tasks." },
      { title: "Testing and productive use", body: "Business acceptance across complete workflows, proven migration and cutover, and clearly organised support and operations." },
    ],
    principleLabel: "Our principle",
    principle:
      "The future way of working determines the business concept. The business concept determines the software requirements.",
  },
  approach: {
    eyebrow: "Approach",
    title: "From business clarity to a usable solution.",
    intro:
      "We combine the overall perspective with a clearly bounded, achievable first scope. Use cases make requirements concrete and help validate the concept.",
    items: [
      { title: "Analysis and business concept", body: "Clarify objectives and the starting point. Describe future processes, roles and data organisation independently of any system." },
      { title: "System and solution concept", body: "Test requirements with concrete cases. Map the selected solution to the business concept and decide necessary adaptations." },
      { title: "Data and pilot", body: "Prepare the intended data scope. Test releases, changes and system handovers with real product data." },
      { title: "Implementation and handover", body: "Move into production after business acceptance. Enable users and support, hand over operations and prioritise next steps." },
    ],
    note: "Master data organisation starts with the current-state analysis and continues as a dedicated workstream in parallel.",
  },
  benefits: {
    eyebrow: "Benefits",
    title: "What you can rely on throughout the project.",
    items: [
      { title: "Decisions grounded in business needs", body: "Requirements and open points are traceable. Management can see which decisions and resources are needed." },
      { title: "Clear data states and releases", body: "It is clear which product state may be used for each process, creating reliable handovers." },
      { title: "A manageable project scope", body: "Priorities and dependencies are visible. Extensions are assessed for their impact on effort and timing." },
      { title: "Prepared users and organised operations", body: "New tasks are practised before launch. Contacts and responsibilities are clear after cutover." },
    ],
  },
  role: {
    eyebrow: "Our role",
    title: "Business understanding and clear project leadership.",
    paragraphs: [
      "Product Lifecycle Management connects engineering with downstream value-creation processes. It requires a shared view of the product and a project organisation that turns decisions into action.",
      "Abexis brings the business and organisational topics together. Depending on the mandate, we work for the user organisation or the PLM provider and coordinate delivery with business teams and technical specialists.",
      "The engagement may cover preparation, a focused assessment or project leadership. At the outset, we agree which side we represent, which responsibilities we take on and who makes binding decisions.",
    ],
    personLabel: "Your contact",
    personName: "Daniel Sengstag",
    personBody:
      "Engineer and Executive MBA with experience in engineering, consulting and leadership roles at Siemens Digital Industries Software and Dassault Systèmes.",
    personLink: "More about Daniel Sengstag",
  },
  faq: {
    eyebrow: "Frequently asked questions",
    title: "Matched to your starting point.",
    items: [
      { q: "Does the software need to be selected already?", a: "No. We can develop the business foundation and support the evaluation. If Teamcenter or another solution has already been selected, we assess its coverage and clarify the remaining decisions." },
      { q: "Do you also support existing PLM/PDM solutions?", a: "Yes. The trigger may be an additional site, a new process or a planned replacement. We assess the situation, define the required scope and support further development." },
      { q: "Does external project leadership make sense for a project that is running well?", a: "Yes, when the initiative needs more capacity than is available internally. The mandate and collaboration with internal owners are clearly defined." },
      { q: "Is the service limited to Siemens Teamcenter?", a: "No. The service covers PLM/PDM generally. We have particular expertise in Siemens Teamcenter, while analysis and evaluation remain system-neutral." },
      { q: "Can resellers and implementation partners engage Abexis?", a: "Yes. We support your customer consulting and take on project leadership responsibilities on the provider side." },
    ],
  },
  closing: {
    eyebrow: "Next step",
    title: "30 minutes to clarify the next step.",
    body: "Are you planning or leading a PLM/PDM initiative as a business, reseller or implementation partner? Together, we will clarify where support would be useful and which responsibilities Abexis can take on.",
    primaryCta: "Book a non-binding first conversation",
    secondaryCta: "Contact us",
  },
};

export function getPlmPdmContent(locale: PlmPdmLocale) {
  return locale === "en" ? en : de;
}
