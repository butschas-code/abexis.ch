import type { PlmPdmLocale } from "@/data/plm-pdm-content";

export type PlmSeoSlug = "teamcenter-beratung-schweiz" | "plm-pdm-einfuehrung" | "plm-vs-pdm";

type TopicSection = {
  title: string;
  body: string;
  points?: readonly string[];
};

export type PlmSeoPageContent = {
  slug: PlmSeoSlug;
  locale: PlmPdmLocale;
  meta: { title: string; excerpt: string };
  eyebrow: string;
  title: string;
  lead: string;
  directAnswer: { label: string; title: string; body: string };
  sections: readonly TopicSection[];
  comparison?: {
    title: string;
    columns: readonly [string, string, string];
    rows: readonly (readonly [string, string, string])[];
  };
  sources?: { label: string; links: readonly { title: string; href: string }[] };
  faq: { eyebrow: string; title: string; items: readonly { q: string; a: string }[] };
  related: { eyebrow: string; title: string };
  closing: { eyebrow: string; title: string; body: string; primaryCta: string; secondaryCta: string };
};

const de: Record<PlmSeoSlug, PlmSeoPageContent> = {
  "teamcenter-beratung-schweiz": {
    slug: "teamcenter-beratung-schweiz",
    locale: "de",
    meta: {
      title: "Siemens Teamcenter Beratung Schweiz",
      excerpt: "Unabhängige Teamcenter Beratung und Projektleitung in der Schweiz – von Fachkonzept, Evaluation und Lösungsarchitektur bis Einführung und produktiver Nutzung.",
    },
    eyebrow: "Siemens Teamcenter",
    title: "Teamcenter Beratung und Projektleitung in der Schweiz",
    lead: "Abexis begleitet Schweizer Industrieunternehmen, Reseller und Implementierungspartner bei Teamcenter-Vorhaben – mit fachlicher Klarheit, verbindlicher Projektführung und einem realistischen ersten Umfang.",
    directAnswer: {
      label: "Kurzantwort",
      title: "Was leistet eine Teamcenter Beratung?",
      body: "Eine gute Teamcenter Beratung verbindet die künftigen Engineering- und Produktprozesse mit einer umsetzbaren Systemlösung. Sie klärt Anforderungen, Datenmodell, Rollen, Schnittstellen und Einführung, bevor Konfiguration und Migration unnötig teuer werden. Abexis kann dabei auf Kunden- oder Anbieterseite beraten und die Projektleitung übernehmen.",
    },
    sections: [
      {
        title: "Teamcenter beginnt nicht mit der Konfiguration",
        body: "Teamcenter kann Produktdaten, Dokumente, Stücklisten, Änderungen und Freigaben über den Lebenszyklus verbinden. Der Nutzen entsteht jedoch erst, wenn fachliche Regeln und Systemgrenzen geklärt sind. Wir beschreiben deshalb zuerst die künftige Arbeitsweise und übersetzen sie anschliessend gemeinsam mit den technischen Spezialisten in eine tragfähige Lösung.",
        points: ["Prozesse, Rollen und Freigaben", "Datenmodell, Dokumente und Produktstrukturen", "CAx-, ERP- und weitere Systemübergänge", "Einführungsumfang, Pilot und Rollout"],
      },
      {
        title: "Unabhängige Unterstützung für Anwenderunternehmen",
        body: "Auf Kundenseite vertreten wir die vereinbarten Ziele gegenüber dem Implementierungspartner. Wir machen Anforderungen prüfbar, bereiten Entscheidungen vor und sorgen dafür, dass Fachbereiche, IT und Umsetzungsteam mit demselben Zielbild arbeiten. Ist Teamcenter noch nicht gesetzt, unterstützen wir eine systemneutrale Evaluation.",
      },
      {
        title: "Zusätzliche Kapazität für Reseller und Implementierungspartner",
        body: "Auf Anbieterseite ergänzen wir Beratung und Projektleitung, wenn Fachkonzeption, Kundenschnittstelle oder Projektsteuerung zusätzliche Kapazität benötigen. Rollen und Entscheidungswege werden zu Beginn klar abgegrenzt. So bleibt transparent, wessen Interessen wir im Mandat vertreten.",
      },
      {
        title: "Wann ein Teamcenter Reality Check sinnvoll ist",
        body: "Ein unabhängiger Blick hilft vor der Ausschreibung, vor dem Projektstart oder wenn Umfang und Entscheidungsbedarf unklar werden. Interviews und Dokumentenreview zeigen, welche Voraussetzungen fehlen, welche Risiken priorisiert werden sollten und welcher nächste Schritt belastbar ist.",
      },
    ],
    faq: {
      eyebrow: "Häufige Fragen",
      title: "Teamcenter Beratung passend zu Ihrer Situation.",
      items: [
        { q: "Berät Abexis ausschliesslich zu Siemens Teamcenter?", a: "Nein. Analyse, Fachkonzept und Evaluation können systemneutral erfolgen. Bei Teamcenter bringt Abexis besondere Erfahrung aus Engineering, Beratung und früheren Führungsrollen bei Siemens Digital Industries Software ein." },
        { q: "Kann Abexis die Teamcenter-Projektleitung übernehmen?", a: "Ja. Möglich sind die Projektleitung auf Kunden- oder Anbieterseite sowie die gezielte Verstärkung einer bestehenden Projektleitung. Auftrag, Verantwortungen und Entscheidungswege werden vorab festgelegt." },
        { q: "Unterstützen Sie auch eine bestehende Teamcenter-Umgebung?", a: "Ja. Typische Anlässe sind neue Standorte, zusätzliche Prozesse, Integrationen, Datenbereinigung, ein Versionswechsel oder die Vorbereitung eines weiteren Rollouts." },
        { q: "Arbeiten Sie in der ganzen Schweiz?", a: "Ja. Abexis hat seinen Sitz in Hinwil und begleitet Mandate in der Schweiz je nach Aufgabe vor Ort, remote oder in einer kombinierten Zusammenarbeit." },
      ],
    },
    sources: {
      label: "Weiterführende Herstellerinformation",
      links: [{ title: "Siemens: Teamcenter Product Lifecycle Management", href: "https://www.siemens.com/de-ch/products/teamcenter/" }],
    },
    related: { eyebrow: "Weiterführend", title: "Das Thema im Zusammenhang verstehen." },
    closing: {
      eyebrow: "Erster Schritt",
      title: "Klären wir Ihr Teamcenter-Vorhaben in 30 Minuten.",
      body: "Wir ordnen Ausgangslage, Handlungsbedarf und eine sinnvolle Form der Unterstützung gemeinsam ein.",
      primaryCta: "Teamcenter-Gespräch vereinbaren",
      secondaryCta: "PLM/PDM-Leistungsübersicht",
    },
  },
  "plm-pdm-einfuehrung": {
    slug: "plm-pdm-einfuehrung",
    locale: "de",
    meta: {
      title: "PLM/PDM Einführung: Vorgehen und Projektleitung",
      excerpt: "PLM/PDM erfolgreich einführen: Vorgehen von Fachkonzept und Systemauswahl über Daten, Pilot und Tests bis zur produktiven Nutzung.",
    },
    eyebrow: "Einführung und Transformation",
    title: "PLM/PDM erfolgreich einführen",
    lead: "Eine PLM/PDM-Einführung ist kein reines IT-Projekt. Sie verändert Produktdaten, Verantwortlichkeiten und Abläufe über mehrere Bereiche hinweg. Ein klarer fachlicher Rahmen hält Umfang, Entscheidungen und Umsetzung steuerbar.",
    directAnswer: {
      label: "Kurzantwort",
      title: "Wie läuft eine PLM/PDM-Einführung ab?",
      body: "Eine belastbare Einführung beginnt mit Zielen, Prozessen, Rollen und Daten – nicht mit der Softwarekonfiguration. Danach folgen System- und Lösungskonzept, Datenvorbereitung, Pilot, fachliche Tests, Umstellung und geregelter Betrieb. Der erste Umfang sollte klein genug für eine sichere Einführung und gross genug für einen messbaren Nutzen sein.",
    },
    sections: [
      {
        title: "1. Ausgangslage und Zielbild klären",
        body: "Zu Beginn werden Geschäftsziele, betroffene Produkte, Standorte, Systeme und bekannte Schwachstellen aufgenommen. Daraus entsteht ein gemeinsames Zielbild: Welche Arbeitsweise soll sich verändern, welche Ergebnisse müssen verlässlich vorliegen und wer entscheidet?",
        points: ["Ziele und messbarer Nutzen", "Betroffene Prozesse und Organisationseinheiten", "Projektorganisation und Entscheidungswege", "Abgrenzung des ersten Einführungsumfangs"],
      },
      {
        title: "2. Fachkonzept vor Systementscheidungen",
        body: "Das Fachkonzept beschreibt künftige Prozesse, Rollen, Datenobjekte, Produktstrukturen sowie Änderungs- und Freigaberegeln. Es schafft eine systemneutrale Referenz für Evaluation oder Lösungsdesign und verhindert, dass heutige Unklarheiten lediglich digitalisiert werden.",
      },
      {
        title: "3. Lösung, Integrationen und Daten vorbereiten",
        body: "Das gewählte System wird auf das Fachkonzept abgebildet. Gleichzeitig müssen CAx-, ERP- und weitere Schnittstellen, Datenverantwortung, Bereinigung und Migration konkret geplant werden. Stammdaten sind kein später Nebenschauplatz, sondern ein eigener Arbeitsstrang ab Projektbeginn.",
      },
      {
        title: "4. Mit echten Fällen pilotieren und testen",
        body: "Ein Pilot mit repräsentativen Produktdaten prüft vollständige Abläufe statt isolierter Funktionen. Fachbereiche testen Änderungen, Freigaben, Varianten und Systemübergänge. Abweichungen werden vor dem Rollout sichtbar, wenn Korrekturen noch beherrschbar sind.",
      },
      {
        title: "5. Produktive Nutzung und Betrieb absichern",
        body: "Vor der Umstellung werden Anwender anhand ihrer künftigen Aufgaben befähigt. Cutover, Support, Zuständigkeiten und Eskalation sind geklärt. Nach dem Start werden Erkenntnisse ausgewertet und weitere Ausbauschritte nach Nutzen und Abhängigkeiten priorisiert.",
      },
    ],
    faq: {
      eyebrow: "Häufige Fragen",
      title: "Die wichtigsten Entscheidungen vor dem Start.",
      items: [
        { q: "Wie lange dauert eine PLM/PDM-Einführung?", a: "Das hängt von Umfang, Datenlage, Integrationen und Anzahl der Standorte ab. Statt einer pauschalen Dauer empfiehlt sich ein abgegrenzter erster Umfang mit klaren Abnahmekriterien und einer realistischen Planung für Folgeetappen." },
        { q: "Sollten wir zuerst die Software auswählen?", a: "Nicht zwingend. Prozesse, Rollen und Datenorganisation sollten zumindest so weit geklärt sein, dass Lösungen anhand realer Anforderungen bewertet werden können. Ist ein System bereits gesetzt, dient das Fachkonzept als Referenz für das Lösungsdesign." },
        { q: "Wer muss im Projekt beteiligt sein?", a: "Neben Projektleitung und IT braucht es verantwortliche Vertreter aus Engineering, Produktmanagement, Fertigung oder weiteren Folgeprozessen. Key User und Entscheider sollten früh eingebunden sein, nicht erst zur Abnahme." },
        { q: "Wann ist ein externer Projektleiter sinnvoll?", a: "Wenn interne Führungskapazität fehlt, mehrere Parteien koordiniert werden müssen oder eine neutrale Steuerung zwischen Fachbereichen und Implementierungspartner benötigt wird. Die Entscheidungshoheit bleibt beim Auftraggeber." },
      ],
    },
    related: { eyebrow: "Weiterführend", title: "Vertiefen Sie die relevanten Entscheidungen." },
    closing: {
      eyebrow: "Projektstart",
      title: "Machen wir den nächsten Schritt konkret.",
      body: "In einem unverbindlichen Gespräch klären wir, wo Ihr Vorhaben steht und welche Vorbereitung oder Projektführung jetzt sinnvoll ist.",
      primaryCta: "Einführung besprechen",
      secondaryCta: "PLM/PDM-Leistungsübersicht",
    },
  },
  "plm-vs-pdm": {
    slug: "plm-vs-pdm",
    locale: "de",
    meta: {
      title: "PLM vs. PDM: Unterschied einfach erklärt",
      excerpt: "Was ist der Unterschied zwischen PLM und PDM? Klare Definitionen, Vergleich und Entscheidungshilfe für Industrieunternehmen.",
    },
    eyebrow: "Grundlagen und Entscheidungshilfe",
    title: "PLM vs. PDM: Was ist der Unterschied?",
    lead: "PDM organisiert technische Produktdaten und Dokumente. PLM steuert Informationen und Prozesse über den gesamten Produktlebenszyklus. In der Praxis ist PDM häufig die technische Basis, während PLM den grösseren organisatorischen Rahmen bildet.",
    directAnswer: {
      label: "Direkte Antwort",
      title: "PDM ist enger, PLM ist umfassender.",
      body: "Product Data Management (PDM) sorgt für kontrollierte CAD-Daten, Dokumente, Versionen und Freigaben. Product Lifecycle Management (PLM) verbindet diese Produktinformationen zusätzlich mit bereichsübergreifenden Prozessen – von der Idee und Entwicklung über Änderungen und Industrialisierung bis zum Betrieb oder Auslauf.",
    },
    comparison: {
      title: "PLM und PDM im direkten Vergleich",
      columns: ["Kriterium", "PDM", "PLM"],
      rows: [
        ["Schwerpunkt", "Technische Produktdaten und Dokumente", "Produktinformationen und Prozesse über den Lebenszyklus"],
        ["Typische Nutzer", "Konstruktion und Engineering", "Engineering, Produktmanagement, Fertigung, Service und weitere Bereiche"],
        ["Typische Aufgaben", "Versionen, Check-in/out, Dokumente, CAD-Beziehungen", "Änderungen, Freigaben, Produktstrukturen, Varianten und Zusammenarbeit"],
        ["Reichweite", "Häufig innerhalb des Engineerings", "Bereichs- und systemübergreifend"],
        ["Zusammenspiel", "Kann eigenständig starten", "Baut häufig auf kontrollierten Produktdaten auf"],
      ],
    },
    sections: [
      {
        title: "Wann reicht PDM aus?",
        body: "PDM kann der richtige erste Schritt sein, wenn vor allem CAD-Dateien, technische Dokumente, Versionen und Freigaben zuverlässig organisiert werden müssen. Entscheidend ist, ob die Herausforderung tatsächlich im Engineering bleibt oder bereits Übergaben an ERP, Fertigung, Einkauf oder Service betrifft.",
      },
      {
        title: "Wann braucht ein Unternehmen PLM?",
        body: "PLM wird relevant, wenn mehrere Funktionen mit unterschiedlichen Sichten auf dasselbe Produkt arbeiten, Änderungen über Systemgrenzen hinweg gesteuert werden oder Varianten und Produktstrukturen durchgängig beherrscht werden müssen. Dann reicht eine reine Dokumentenverwaltung meist nicht aus.",
      },
      {
        title: "Warum die Begriffe allein nicht entscheiden",
        body: "Produkte am Markt verwenden PLM und PDM unterschiedlich. Eine sinnvolle Entscheidung beginnt deshalb bei den Anwendungsfällen: Welche Information wird von wem erzeugt, geprüft, freigegeben und weiterverwendet? Erst daraus folgen Funktionsumfang, Systemgrenzen und eine passende Roadmap.",
        points: ["Konkrete End-to-End-Anwendungsfälle beschreiben", "Daten- und Prozessverantwortung klären", "Systemführerschaft und Übergaben definieren", "Ersten Umfang nach Nutzen und Risiko abgrenzen"],
      },
    ],
    faq: {
      eyebrow: "Häufige Fragen",
      title: "PLM und PDM richtig einordnen.",
      items: [
        { q: "Ist PDM ein Teil von PLM?", a: "In vielen Architekturen ja. PDM stellt kontrollierte technische Produktdaten bereit, auf denen umfassendere PLM-Prozesse aufbauen. Die genaue Abgrenzung hängt jedoch vom eingesetzten System und dem organisatorischen Umfang ab." },
        { q: "Kann ein Unternehmen mit PDM beginnen und später PLM ausbauen?", a: "Ja. Ein schrittweiser Ausbau ist oft sinnvoll, wenn Datenmodell, Verantwortlichkeiten und Integrationskonzept spätere Prozesse berücksichtigen. Ein isolierter Start ohne Zielbild kann dagegen teure Nacharbeiten verursachen." },
        { q: "Ist ERP eine Alternative zu PLM?", a: "Nein. ERP und PLM haben unterschiedliche Schwerpunkte. PLM führt produktbezogene Entwicklungs- und Änderungsinformationen; ERP plant und steuert betriebliche Ressourcen und Ausführung. Entscheidend sind klare Systemgrenzen und definierte Übergaben." },
        { q: "Wie wählen wir zwischen PDM und PLM?", a: "Nicht anhand des Produktnamens, sondern anhand Ihrer Anwendungsfälle, beteiligten Bereiche, Datenobjekte und Übergaben. Ein systemneutrales Fachkonzept macht den tatsächlich benötigten Umfang prüfbar." },
      ],
    },
    sources: {
      label: "Begriffe aus erster Hand vertiefen",
      links: [
        { title: "PTC: PDM vs. PLM", href: "https://www.ptc.com/de/blogs/plm/pdm-vs-plm" },
        { title: "Autodesk: Product Lifecycle Management", href: "https://www.autodesk.com/de/solutions/plm-product-lifecycle-management" },
      ],
    },
    related: { eyebrow: "Nächste Schritte", title: "Von der Einordnung zur Umsetzung." },
    closing: {
      eyebrow: "Entscheidungshilfe",
      title: "Klären Sie den passenden Umfang vor der Systementscheidung.",
      body: "Abexis macht Prozesse, Daten und Anforderungen so konkret, dass PDM-, PLM- und Systementscheidungen nachvollziehbar werden.",
      primaryCta: "Ausgangslage besprechen",
      secondaryCta: "PLM/PDM-Leistungsübersicht",
    },
  },
};

const en: Record<PlmSeoSlug, PlmSeoPageContent> = {
  "teamcenter-beratung-schweiz": {
    ...de["teamcenter-beratung-schweiz"],
    locale: "en",
    meta: { title: "Siemens Teamcenter Consulting Switzerland", excerpt: "Independent Teamcenter consulting and project leadership in Switzerland—from business concept and solution architecture to implementation and productive use." },
    eyebrow: "Siemens Teamcenter",
    title: "Teamcenter Consulting and Project Leadership in Switzerland",
    lead: "Abexis supports Swiss industrial companies, resellers and implementation partners with Teamcenter initiatives—combining business clarity, accountable project leadership and a realistic first scope.",
    directAnswer: { label: "In brief", title: "What does Teamcenter consulting cover?", body: "Effective Teamcenter consulting connects future engineering and product processes with an implementable system solution. It clarifies requirements, data model, roles, interfaces and adoption before configuration and migration become unnecessarily expensive. Abexis can advise and lead the project on either the customer or provider side." },
    sections: [
      { title: "Teamcenter does not start with configuration", body: "Teamcenter can connect product data, documents, bills of materials, changes and releases across the lifecycle. Value only emerges when business rules and system boundaries are clear. We therefore describe the future way of working first, then translate it into a viable solution with the technical specialists.", points: ["Processes, roles and releases", "Data model, documents and product structures", "CAx, ERP and other system handovers", "Implementation scope, pilot and rollout"] },
      { title: "Independent support for user organisations", body: "On the customer side, we represent the agreed objectives in dealings with the implementation partner. We make requirements testable, prepare decisions and align business teams, IT and delivery around the same target state. If Teamcenter has not yet been selected, we can support a system-neutral evaluation." },
      { title: "Additional capacity for resellers and implementation partners", body: "On the provider side, we reinforce consulting and project leadership when business design, the customer interface or project steering need additional capacity. Roles and decision paths are agreed at the outset, keeping it clear whose interests we represent." },
      { title: "When a Teamcenter reality check helps", body: "An independent view is useful before a tender, ahead of project launch or when scope and decision needs become unclear. Interviews and document review reveal missing prerequisites, priority risks and the next defensible step." },
    ],
    faq: { eyebrow: "Frequently asked questions", title: "Teamcenter consulting for your situation.", items: [
      { q: "Does Abexis consult exclusively on Siemens Teamcenter?", a: "No. Analysis, business design and evaluation can be system-neutral. For Teamcenter, Abexis brings particular experience from engineering, consulting and former leadership roles at Siemens Digital Industries Software." },
      { q: "Can Abexis lead a Teamcenter project?", a: "Yes. We can lead on the customer or provider side or reinforce an existing project lead. Mandate, responsibilities and decision paths are agreed in advance." },
      { q: "Do you support existing Teamcenter environments?", a: "Yes. Typical triggers include new sites, added processes, integrations, data cleansing, an upgrade or preparation for a further rollout." },
      { q: "Do you work throughout Switzerland?", a: "Yes. Abexis is based in Hinwil and supports engagements across Switzerland on site, remotely or in a hybrid model depending on the assignment." },
    ] },
    sources: { label: "Further vendor information", links: [{ title: "Siemens: Teamcenter Product Lifecycle Management", href: "https://www.siemens.com/de-ch/products/teamcenter/" }] },
    related: { eyebrow: "Related guidance", title: "See the topic in context." },
    closing: { eyebrow: "First step", title: "Let’s clarify your Teamcenter initiative in 30 minutes.", body: "Together, we will frame your starting point, priorities and the most useful form of support.", primaryCta: "Arrange a Teamcenter conversation", secondaryCta: "PLM/PDM service overview" },
  },
  "plm-pdm-einfuehrung": {
    ...de["plm-pdm-einfuehrung"],
    locale: "en",
    meta: { title: "PLM/PDM Implementation: Approach and Project Leadership", excerpt: "Implement PLM/PDM successfully: from business concept and system selection through data, pilot and testing to productive use." },
    eyebrow: "Implementation and transformation",
    title: "How to Implement PLM/PDM Successfully",
    lead: "A PLM/PDM implementation is not simply an IT project. It changes product data, responsibilities and workflows across functions. A clear business framework keeps scope, decisions and delivery manageable.",
    directAnswer: { label: "In brief", title: "What are the stages of a PLM/PDM implementation?", body: "A robust implementation starts with objectives, processes, roles and data—not software configuration. This is followed by the system and solution concept, data preparation, pilot, business testing, cutover and organised operations. The first scope should be small enough to launch safely and large enough to deliver measurable value." },
    sections: [
      { title: "1. Clarify the starting point and target state", body: "Start by capturing business objectives, affected products, sites, systems and known pain points. This creates a shared target state: which way of working should change, which results must be reliable and who makes each decision?", points: ["Objectives and measurable value", "Affected processes and organisational units", "Project governance and decision paths", "Boundaries of the first implementation scope"] },
      { title: "2. Establish the business concept before system decisions", body: "The business concept describes future processes, roles, data objects, product structures, changes and release rules. It becomes a system-neutral reference for evaluation or solution design and prevents today’s ambiguities from merely being digitised." },
      { title: "3. Prepare the solution, integrations and data", body: "Map the selected system to the business concept. At the same time, define CAx, ERP and other interfaces, data ownership, cleansing and migration. Master data is not a late side issue; it is a dedicated workstream from the beginning." },
      { title: "4. Pilot and test with real scenarios", body: "A pilot using representative product data tests complete workflows rather than isolated features. Business teams exercise changes, releases, variants and system handovers. Gaps surface before rollout, while corrections remain manageable." },
      { title: "5. Secure productive use and operations", body: "Before cutover, users are enabled around their future tasks. Cutover, support, responsibilities and escalation are agreed. After launch, lessons are reviewed and subsequent stages prioritised by value and dependency." },
    ],
    faq: { eyebrow: "Frequently asked questions", title: "The key decisions before you start.", items: [
      { q: "How long does a PLM/PDM implementation take?", a: "It depends on scope, data quality, integrations and number of sites. Rather than use a generic duration, define a bounded first scope with clear acceptance criteria and a realistic plan for subsequent stages." },
      { q: "Should we select the software first?", a: "Not necessarily. Processes, roles and data organisation should be clear enough to assess solutions against real requirements. If a system is already selected, the business concept becomes the reference for solution design." },
      { q: "Who needs to be involved?", a: "Alongside project leadership and IT, include accountable representatives from engineering, product management, manufacturing or other downstream processes. Key users and decision-makers should be involved early, not only at acceptance." },
      { q: "When does an external project lead make sense?", a: "When internal leadership capacity is limited, several parties must be coordinated or neutral steering is needed between business teams and the implementation partner. Decision authority remains with the client." },
    ] },
    related: { eyebrow: "Related guidance", title: "Explore the decisions that shape implementation." },
    closing: { eyebrow: "Project start", title: "Turn the next step into a concrete decision.", body: "In an initial conversation, we clarify where your initiative stands and what preparation or project leadership is useful now.", primaryCta: "Discuss your implementation", secondaryCta: "PLM/PDM service overview" },
  },
  "plm-vs-pdm": {
    ...de["plm-vs-pdm"],
    locale: "en",
    meta: { title: "PLM vs PDM: The Difference Explained", excerpt: "What is the difference between PLM and PDM? Clear definitions, a practical comparison and decision guidance for industrial companies." },
    eyebrow: "Definitions and decision guidance",
    title: "PLM vs PDM: What Is the Difference?",
    lead: "PDM organises technical product data and documents. PLM governs information and processes across the whole product lifecycle. In practice, PDM is often the technical foundation while PLM provides the broader organisational framework.",
    directAnswer: { label: "Direct answer", title: "PDM is narrower; PLM is broader.", body: "Product Data Management (PDM) controls CAD data, documents, versions and releases. Product Lifecycle Management (PLM) additionally connects that product information with cross-functional processes—from idea and development through change and industrialisation to operation or phase-out." },
    comparison: { title: "PLM and PDM compared", columns: ["Criterion", "PDM", "PLM"], rows: [
      ["Focus", "Technical product data and documents", "Product information and processes across the lifecycle"],
      ["Typical users", "Design and engineering", "Engineering, product management, manufacturing, service and other functions"],
      ["Typical tasks", "Versions, check-in/out, documents and CAD relationships", "Changes, releases, product structures, variants and collaboration"],
      ["Reach", "Often within engineering", "Cross-functional and cross-system"],
      ["Relationship", "Can start independently", "Often builds on controlled product data"],
    ] },
    sections: [
      { title: "When is PDM enough?", body: "PDM can be the right first step when the main need is to organise CAD files, technical documents, versions and releases reliably. The key question is whether the challenge truly stays within engineering or already affects handovers to ERP, manufacturing, procurement or service." },
      { title: "When does a business need PLM?", body: "PLM becomes relevant when several functions use different views of the same product, changes must be governed across system boundaries, or variants and product structures need end-to-end control. A document-management focus is then usually too narrow." },
      { title: "Why terminology alone cannot decide", body: "Vendors use PLM and PDM labels differently. A sound decision therefore starts with use cases: which information is created, reviewed, released and reused by whom? From that follow the functional scope, system boundaries and a suitable roadmap.", points: ["Describe concrete end-to-end use cases", "Clarify data and process ownership", "Define system ownership and handovers", "Bound the first scope by value and risk"] },
    ],
    faq: { eyebrow: "Frequently asked questions", title: "Put PLM and PDM in the right context.", items: [
      { q: "Is PDM part of PLM?", a: "In many architectures, yes. PDM provides controlled technical product data on which broader PLM processes build. The exact boundary depends on the chosen system and organisational scope." },
      { q: "Can a company start with PDM and expand to PLM later?", a: "Yes. A phased expansion often makes sense if the data model, responsibilities and integration concept anticipate later processes. An isolated start without a target state can create expensive rework." },
      { q: "Is ERP an alternative to PLM?", a: "No. ERP and PLM have different centres of gravity. PLM leads product-related development and change information; ERP plans and controls operational resources and execution. Clear boundaries and defined handovers are essential." },
      { q: "How do we choose between PDM and PLM?", a: "Decide from your use cases, participating functions, data objects and handovers—not the product label. A system-neutral business concept makes the required scope testable." },
    ] },
    sources: { label: "Explore the definitions at source", links: [
      { title: "PTC: PDM vs PLM", href: "https://www.ptc.com/en/blogs/plm/pdm-vs-plm" },
      { title: "Autodesk: Product Lifecycle Management", href: "https://www.autodesk.com/solutions/plm-product-lifecycle-management" },
    ] },
    related: { eyebrow: "Next steps", title: "Move from definition to implementation." },
    closing: { eyebrow: "Decision support", title: "Clarify the right scope before selecting a system.", body: "Abexis makes processes, data and requirements concrete enough for defensible PDM, PLM and system decisions.", primaryCta: "Discuss your starting point", secondaryCta: "PLM/PDM service overview" },
  },
};

export const plmSeoSlugs = Object.keys(de) as PlmSeoSlug[];

export function getPlmSeoPage(slug: string, locale: PlmPdmLocale): PlmSeoPageContent | undefined {
  if (!plmSeoSlugs.includes(slug as PlmSeoSlug)) return undefined;
  return (locale === "en" ? en : de)[slug as PlmSeoSlug];
}

export function getPlmSeoCards(locale: PlmPdmLocale) {
  return plmSeoSlugs.map((slug) => {
    const page = getPlmSeoPage(slug, locale)!;
    return { slug, title: page.meta.title, excerpt: page.meta.excerpt };
  });
}
