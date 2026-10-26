/**
 * Virtual Management Office (VMO) page copy. German text follows the client's
 * `Abexis_VMO_Webseite.html` (Oct 2026) verbatim; English is our translation.
 * Prices are intentionally not published (client decision; the older draft listed CHF ranges).
 */
export type VmoLocale = "de" | "en";

const de = {
  meta: {
    title: "Virtual Management Office",
    seoTitle: "Virtual Management Office für KMU",
    excerpt:
      "Zusätzliche Managementkapazität ohne zusätzliche Managementstelle. Abexis unterstützt CEO und Geschäftsleitung bei Prioritäten, Entscheiden und der Umsetzung wichtiger Vorhaben.",
  },
  breadcrumbs: { home: "Startseite", services: "Leistungen", current: "Virtual Management Office" },
  hero: {
    eyebrow: "Abexis Virtual Management Office",
    titleLines: ["Zusätzliche Managementkapazität.", "Ohne zusätzliche Managementstelle."] as [string, string],
    body: "Externe Managementunterstützung für CEO und Geschäftsleitung. Wir bereiten Entscheide vor und koordinieren die Umsetzung Ihrer wichtigsten Vorhaben.",
    note: "Flexibel eingebunden. Mit klar vereinbartem Auftrag.",
    primaryCta: "VMO-Gespräch vereinbaren",
    secondaryCta: "Angebotsmodelle",
  },
  board: {
    ariaLabel: "Illustrative Managementübersicht",
    brand: "ABEXIS / VMO",
    tag: "Managementübersicht",
    title: "Das Wesentliche im Blick.",
    sub: "Prioritäten und Handlungsbedarf",
    rows: [
      { label: "ERP-Einführung", status: "Rot · Entscheid nötig", tone: "red" },
      { label: "Vertriebsentwicklung", status: "Gelb · Massnahme offen", tone: "yellow" },
      { label: "Prozessautomatisierung", status: "Grün · Im Plan", tone: "green" },
    ],
    decisionLabel: "Entscheid durch die Geschäftsleitung",
    decision: "Zusätzliche Testkapazität für die ERP-Einführung freigeben. Optionen und Empfehlung liegen vor.",
    caption: "Illustratives Beispiel, keine Kundendaten",
  },
  intro:
    "Die Themen werden bearbeitet. Doch wer hält das Gesamtbild zusammen? Wenn wichtige Vorhaben gleichzeitig laufen, braucht es jemanden, der Abhängigkeiten klärt und vereinbarte Massnahmen nachverfolgt. Das Abexis Virtual Management Office übernimmt diese Aufgabe gemeinsam mit Ihrer Geschäftsleitung.",
  localNav: {
    ariaLabel: "Auf dieser Seite",
    items: [
      { href: "#bedarf", label: "Ihr Bedarf" },
      { href: "#leistung", label: "Unsere Leistung" },
      { href: "#modelle", label: "Angebotsmodelle" },
      { href: "#setup", label: "So starten wir" },
      { href: "#fragen", label: "Häufige Fragen" },
    ],
  },
  need: {
    eyebrow: "Typische Ausgangslage",
    title: "Viele Vorhaben. Begrenzte Managementkapazität.",
    paragraphs: [
      "Eine ERP-Einführung läuft, der Vertrieb braucht neue Impulse und eine Schlüsselposition ist neu zu besetzen. Dazu kommen Investitionsentscheide oder Fragen zum Einsatz von KI.",
      "Das VMO eignet sich für KMU, deren Geschäftsleitung zusätzliche Unterstützung bei der übergreifenden Steuerung benötigt. Bestehende Fachbereiche bleiben eingebunden.",
    ],
    link: "Passenden Umfang finden",
    situations: [
      { title: "Der CEO hält alles zusammen", body: "Status abfragen und offene Punkte nachhalten beanspruchen viel persönliche Zeit." },
      { title: "Vorhaben konkurrieren um Kapazität", body: "Dieselben Schlüsselpersonen werden gleichzeitig in mehreren Initiativen benötigt." },
      { title: "Entscheide bleiben offen", body: "Grundlagen fehlen oder Zuständigkeiten sind nicht ausreichend geklärt." },
      { title: "Massnahmen verlieren an Verbindlichkeit", body: "Beschlüsse werden gefasst, doch Fortschritt und Abschluss sind nicht durchgängig sichtbar." },
    ],
  },
  principle: {
    label: "Unser Auftrag",
    text: "Wir entlasten die Geschäftsleitung bei der Koordination und halten nach, was gemeinsam vereinbart wurde.",
  },
  modules: {
    eyebrow: "Leistungsumfang",
    title: "Sechs Bausteine für eine verlässliche Steuerung.",
    paragraphs: [
      "Wir verbinden bestehende Informationen zu einer gemeinsamen Führungsübersicht. Umfang und Bearbeitungstiefe richten sich nach Ihrem Bedarf und dem vereinbarten Mandat.",
      "Das VMO nutzt vorhandene Berichte und Systeme. So bleiben Kennzahlen und Verantwortlichkeiten dort verankert, wo die fachliche Verantwortung liegt.",
    ],
    items: [
      {
        title: "Management Agenda",
        body: "Gemeinsam mit der Geschäftsleitung fokussieren wir bis zu fünf Unternehmensprioritäten. Wir halten den gewünschten Zielzustand fest und machen sichtbar, was zugunsten dieser Prioritäten zurückgestellt wird.",
        fields: "Je Priorität: Ziel und Messgrösse, verantwortliche Person, Termin und Status.",
      },
      {
        title: "Initiativen und Projektportfolio",
        body: "Strategische Vorhaben werden in einer gemeinsamen Übersicht geführt. Wir klären ihren Beitrag zu den Prioritäten und zeigen Abhängigkeiten sowie Engpässe bei internen Kapazitäten auf. Der erwartete Nutzen wird im Verlauf überprüft.",
        fields: "Je Vorhaben: Nutzen, Budget, Meilensteine und Verantwortung sowie Kapazitäten, Risiken und Abhängigkeiten.",
      },
      {
        title: "Entscheidungsmanagement",
        body: "Wir führen offene Entscheide zusammen und bereiten die erforderlichen Grundlagen auf. Optionen und eine Empfehlung helfen der zuständigen Person oder dem zuständigen Gremium zu entscheiden. Die Folgen eines Aufschubs werden sichtbar.",
        fields: "Je Entscheid: Entscheidungsbefugnis, benötigte Grundlagen und Frist sowie Beschluss und Folgeaufgaben.",
      },
      {
        title: "Risiken und Massnahmen",
        body: "Wir strukturieren die führungsrelevanten Risiken und besprechen ihre Bewertung mit den Verantwortlichen. Massnahmen erhalten eine Zuständigkeit und einen Termin. Kritische Veränderungen werden nach vereinbarten Regeln eskaliert.",
        fields: "Je Risiko: Eintrittswahrscheinlichkeit und Auswirkung, Risikoverantwortung, Massnahmen, Termine und Entwicklung.",
      },
      {
        title: "Management Cockpit",
        body: "Die Geschäftsleitung erhält eine kompakte Übersicht über ausgewählte Kennzahlen und den Handlungsbedarf. Wir stimmen Definitionen und Datenquellen mit den Fachverantwortlichen ab. Zielabweichungen werden mit ihrer Entwicklung dargestellt.",
        fields: "Je Kennzahl: Definition, Datenquelle, zuständige Person, Zielwert und Istwert sowie Aktualität und Trend.",
      },
      {
        title: "Umsetzungssteuerung",
        body: "Wir verfolgen vereinbarte Massnahmen und sprechen Blockaden mit den Verantwortlichen an. Dabei betrachten wir auch organisatorische Voraussetzungen wie geklärte Rollen oder erforderliche Schulungen. Erledigte Massnahmen werden anhand des vereinbarten Ergebnisses abgeschlossen.",
        fields: "Je Massnahme: Ergebnis, verantwortliche Person, Frist und Status sowie Blockaden und Abschlussnachweis.",
      },
    ],
  },
  cockpit: {
    sheetTitle: "CEO Management Cockpit",
    sheetTag: "Illustrative Struktur",
    groups: [
      {
        label: "Unternehmensentwicklung",
        lines: [
          { label: "Umsatz und Auftragseingang", value: "Ziel / Ist / Trend" },
          { label: "Marge und Liquidität", value: "Abweichung / Handlungsbedarf" },
        ],
      },
      {
        label: "Prioritäten und Vorhaben",
        lines: [
          { label: "ERP-Einführung", value: "Rot · Testkapazität klären" },
          { label: "Vertriebsentwicklung", value: "Gelb · Massnahme nachhalten" },
        ],
      },
      {
        label: "Risiken und Kapazitäten",
        lines: [
          { label: "Wesentliche Risiken", value: "Veränderung / Gegenmassnahmen" },
          { label: "Personelle Engpässe", value: "Auswirkung / Zuständigkeit" },
        ],
      },
    ],
    question: "Welche Entscheide muss die Geschäftsleitung jetzt treffen?",
    sheetNote: "Beispiel ohne Kundendaten. Kennzahlen und Inhalte werden unternehmensspezifisch festgelegt.",
    eyebrow: "Ihr Ergebnis",
    title: "Eine Seite für das Wesentliche.",
    body: "Das monatliche Management Cockpit verdichtet die Führungsinformationen. Es zeigt, wo ein Entscheid oder Eingreifen erforderlich ist. Die Detailnachweise bleiben in den zugrunde liegenden Übersichten.",
    benefits: [
      { title: "Weniger Koordinationsaufwand für den CEO", body: "Aktuelle Informationen werden bei den Verantwortlichen zusammengeführt." },
      { title: "Nachvollziehbare Entscheide", body: "Entscheidungsbedarf und die erforderlichen Grundlagen sind erkennbar." },
      { title: "Verbindliches Nachhalten", body: "Vereinbarte Massnahmen haben klare Zuständigkeiten und Termine." },
      { title: "Ein gemeinsames Bild", body: "Die Geschäftsleitung bespricht Fortschritt und Engpässe auf derselben Grundlage." },
    ],
  },
  models: {
    eyebrow: "Angebotsmodelle",
    title: "So viel Unterstützung, wie Ihr Unternehmen benötigt.",
    intro:
      "Die Modelle unterscheiden sich in der Intensität der Begleitung. Wir vereinbaren die betreuten Themen und den konkreten Leistungsumfang innerhalb des verfügbaren Zeitkontingents.",
    items: [
      {
        name: "VMO Light",
        title: "Führungsübersicht",
        volume: "Ca. 2 Tage pro Monat",
        body: "Für eine Geschäftsleitung, die ihre wichtigsten Themen monatlich strukturiert besprechen möchte.",
        bullets: [
          "Management Agenda und monatliches Cockpit",
          "Monatliche Besprechung mit CEO-Sparring",
          "Überprüfung der wesentlichen Risiken",
          "Dokumentation vereinbarter Massnahmen",
        ],
        cta: "VMO Light besprechen",
        featured: false,
      },
      {
        name: "VMO Core",
        title: "Aktive Koordination",
        volume: "Ca. 1 Tag pro Woche",
        body: "Für mehrere Vorhaben, die eine regelmässige bereichsübergreifende Abstimmung benötigen.",
        bullets: [
          "Leistungen aus VMO Light",
          "Pflege des Initiativen- und Projektportfolios",
          "Entscheidungsübersicht und KPI-Nachverfolgung",
          "Vorbereitung vereinbarter GL-Sitzungen",
          "Regelmässiges Nachhalten bei den Verantwortlichen",
        ],
        cta: "VMO Core besprechen",
        featured: true,
      },
      {
        name: "VMO Executive",
        title: "Erweiterte Stabsfunktion",
        volume: "Ca. 2 Tage pro Woche",
        body: "Für CEO und Geschäftsleitung mit erhöhtem Koordinationsbedarf oder einer umfassenden Veränderungsagenda.",
        bullets: [
          "Leistungen aus VMO Core",
          "Vertiefte Unterstützung bei Transformationsvorhaben",
          "Management-Workshops und Steuerungsgremien",
          "Koordination externer Partner im vereinbarten Umfang",
          "Aufbereitung von Unterlagen für den Verwaltungsrat",
        ],
        cta: "VMO Executive besprechen",
        featured: false,
      },
    ],
    finePrint:
      "Die Zeitangaben dienen der Orientierung. Umfang und Bearbeitungstiefe werden im Mandat festgelegt. VMO Light setzt aktuelle Daten und Statusmeldungen des Kunden voraus. Eine eigene Projektleitung wird ausdrücklich vereinbart und innerhalb des Kontingents eingeplant oder separat beauftragt.",
    mailSubjectPrefix: "Anfrage",
  },
  role: {
    eyebrow: "Unsere Rolle",
    title: "Nah an der Geschäftsleitung. Mit klarer Verantwortung.",
    paragraphs: [
      "Abexis arbeitet als externe Managementunterstützung mit Ihrem Führungsteam zusammen. Das Mandat schafft die Grundlage dafür, Informationen einzuholen und vereinbarte Massnahmen nachzuverfolgen.",
      "Wir klären zu Beginn die Entscheidungswege und die Zusammenarbeit mit bestehenden Funktionen.",
    ],
    points: [
      { title: "Abexis koordiniert und bereitet vor", body: "Wir verdichten Informationen, bereiten Entscheide vor und verfolgen vereinbarte Massnahmen nach." },
      { title: "Die Geschäftsleitung entscheidet", body: "Unternehmensentscheide verbleiben bei den zuständigen Personen oder Gremien. Weitergehende Befugnisse werden ausdrücklich vereinbart." },
      { title: "Fachbereiche verantworten die Umsetzung", body: "Die operative Linienführung und fachliche Verantwortung bleiben im Unternehmen. Spezialprüfungen werden bei Bedarf gesondert beauftragt." },
      { title: "Bestehende Funktionen werden eingebunden", body: "Das VMO arbeitet mit Controlling und Projektverantwortlichen zusammen und nutzt vorhandene Berichte und Systeme." },
    ],
  },
  setup: {
    eyebrow: "VMO Management Setup",
    title: "Mit einer arbeitsfähigen Übersicht starten.",
    intro:
      "Innerhalb von rund zwei Kalenderwochen erarbeiten wir mit Ihnen eine erste Managementübersicht und vereinbaren den Steuerungsrhythmus. Voraussetzung sind verfügbare Informationen und die Mitwirkung der Geschäftsleitung. Der tatsächliche Aufwand richtet sich nach der Ausgangslage.",
    steps: [
      { title: "Auftrag klären", body: "Wir besprechen die Ausgangslage und legen die betreuten Themen sowie Zuständigkeiten fest." },
      { title: "Informationen verbinden", body: "Wir sichten vorhandene Berichte und klären Datenquellen sowie offene Informationslücken." },
      { title: "Steuerung aufbauen", body: "Wir erstellen die vereinbarten Übersichten für Prioritäten und Vorhaben sowie Risiken und Entscheide." },
      { title: "Gemeinsam prüfen", body: "Wir besprechen die erste Übersicht und vereinbaren den Rhythmus der weiteren Zusammenarbeit." },
    ],
    bottom: "Nach dem Setup entscheiden Sie, ob Sie die Steuerung intern weiterführen oder Abexis mit der laufenden Begleitung beauftragen.",
    cta: "Setup besprechen",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Häufige Fragen",
    intro: "Das Mandat richtet sich nach Ihrer Organisation und den Themen, bei denen tatsächlich Unterstützung benötigt wird.",
    items: [
      { q: "Was bedeutet «Virtual»?", a: "Das VMO ist eine externe, flexibel eingebundene Managementfunktion. Es bezeichnet keine Software und keine automatisierte Geschäftsleitung. Die Zusammenarbeit wird passend zum Auftrag organisiert. Termine vor Ort und die digitale Zusammenarbeit werden gemeinsam vereinbart." },
      { q: "Wie unterscheidet sich das VMO von einer Projektleitung?", a: "Das VMO betrachtet das Zusammenspiel mehrerer Managementthemen und Vorhaben. Eine Projektleitung führt ein konkretes Projekt. Wenn Abexis zusätzlich eine Projektleitung übernehmen soll, werden Auftrag und Kapazität ausdrücklich festgelegt." },
      { q: "Wie häufig findet die Abstimmung statt?", a: "VMO Light arbeitet mit einem monatlichen Steuerungszyklus. Für Core und Executive vereinbaren wir regelmässige kurze Abstimmungen und vertiefte Themenbesprechungen. Kritische Entwicklungen werden unabhängig vom Sitzungstermin nach den vereinbarten Eskalationsregeln gemeldet." },
      { q: "Was muss unser Unternehmen beitragen?", a: "Es braucht eine verantwortliche Ansprechperson in der Geschäftsleitung sowie Zugang zu den vereinbarten Informationen. Die Fachverantwortlichen liefern aktuelle Daten und Statusmeldungen. Die Geschäftsleitung trifft die erforderlichen Entscheide und benennt die Umsetzungsverantwortlichen." },
      { q: "Brauchen wir dafür neue Software?", a: "Wir prüfen zuerst, wie Ihre bestehenden Werkzeuge und Berichte genutzt werden können. Eine neue Software ist keine Voraussetzung. Zusätzlicher Bedarf wird im Setup gemeinsam beurteilt." },
      { q: "Können wir das VMO später intern weiterführen?", a: "Ja. Die erarbeiteten Übersichten und der vereinbarte Steuerungsrhythmus können intern weitergeführt werden. Umfang und Zeitpunkt einer Übergabe werden gemeinsam festgelegt." },
    ],
  },
  closing: {
    eyebrow: "Nächster Schritt",
    title: "Wo braucht Ihre Geschäftsleitung Entlastung?",
    body: "In einem unverbindlichen Gespräch klären wir Ihre Ausgangslage und den passenden Umfang der Unterstützung.",
    primaryCta: "VMO-Gespräch vereinbaren",
    secondaryCta: "Zum Kontaktformular",
  },
};

type VmoContent = typeof de;

const en: VmoContent = {
  meta: {
    title: "Virtual Management Office",
    seoTitle: "Virtual Management Office for SMEs",
    excerpt:
      "Additional management capacity without an additional management position. Abexis supports CEOs and executive teams with priorities, decisions and the delivery of key initiatives.",
  },
  breadcrumbs: { home: "Home", services: "Services", current: "Virtual Management Office" },
  hero: {
    eyebrow: "Abexis Virtual Management Office",
    titleLines: ["Additional management capacity.", "Without an additional management position."] as [string, string],
    body: "External management support for the CEO and executive team. We prepare decisions and coordinate the delivery of your most important initiatives.",
    note: "Flexibly integrated. With a clearly agreed mandate.",
    primaryCta: "Book a VMO conversation",
    secondaryCta: "Engagement models",
  },
  board: {
    ariaLabel: "Illustrative management overview",
    brand: "ABEXIS / VMO",
    tag: "Management overview",
    title: "What matters, at a glance.",
    sub: "Priorities and required action",
    rows: [
      { label: "ERP implementation", status: "Red · Decision needed", tone: "red" },
      { label: "Sales development", status: "Amber · Action open", tone: "yellow" },
      { label: "Process automation", status: "Green · On track", tone: "green" },
    ],
    decisionLabel: "Decision by the executive team",
    decision: "Approve additional testing capacity for the ERP implementation. Options and a recommendation are ready.",
    caption: "Illustrative example, no client data",
  },
  intro:
    "The topics are being worked on. But who keeps the overall picture together? When important initiatives run in parallel, someone needs to clarify dependencies and follow up on agreed actions. The Abexis Virtual Management Office takes on this task together with your executive team.",
  localNav: {
    ariaLabel: "On this page",
    items: [
      { href: "#bedarf", label: "Your needs" },
      { href: "#leistung", label: "Our services" },
      { href: "#modelle", label: "Engagement models" },
      { href: "#setup", label: "Getting started" },
      { href: "#fragen", label: "FAQ" },
    ],
  },
  need: {
    eyebrow: "Typical situation",
    title: "Many initiatives. Limited management capacity.",
    paragraphs: [
      "An ERP implementation is under way, sales needs fresh momentum and a key position has to be filled. On top of that come investment decisions and questions about the use of AI.",
      "The VMO suits SMEs whose executive team needs additional support with cross-functional steering. Existing departments remain involved.",
    ],
    link: "Find the right scope",
    situations: [
      { title: "The CEO holds everything together", body: "Chasing status updates and following up on open points takes up a lot of personal time." },
      { title: "Initiatives compete for capacity", body: "The same key people are needed in several initiatives at once." },
      { title: "Decisions remain open", body: "The basis for deciding is missing or responsibilities are not sufficiently clear." },
      { title: "Actions lose their commitment", body: "Resolutions are passed, but progress and completion are not consistently visible." },
    ],
  },
  principle: {
    label: "Our mandate",
    text: "We relieve the executive team of coordination work and follow up on what has been jointly agreed.",
  },
  modules: {
    eyebrow: "Scope of services",
    title: "Six building blocks for reliable steering.",
    paragraphs: [
      "We connect existing information into one shared management overview. Scope and depth depend on your needs and the agreed mandate.",
      "The VMO uses existing reports and systems. This keeps metrics and responsibilities anchored where the business responsibility lies.",
    ],
    items: [
      {
        title: "Management agenda",
        body: "Together with the executive team, we focus on up to five corporate priorities. We record the desired target state and make visible what is deferred in favour of these priorities.",
        fields: "Per priority: goal and measure, owner, deadline and status.",
      },
      {
        title: "Initiatives and project portfolio",
        body: "Strategic initiatives are managed in one shared overview. We clarify their contribution to the priorities and highlight dependencies and bottlenecks in internal capacity. The expected benefit is reviewed over time.",
        fields: "Per initiative: benefit, budget, milestones and ownership, plus capacity, risks and dependencies.",
      },
      {
        title: "Decision management",
        body: "We consolidate open decisions and prepare the required basis. Options and a recommendation help the responsible person or body to decide. The consequences of postponing become visible.",
        fields: "Per decision: decision authority, required inputs and deadline, plus resolution and follow-up tasks.",
      },
      {
        title: "Risks and actions",
        body: "We structure the risks relevant to management and discuss their assessment with the owners. Actions are assigned an owner and a deadline. Critical changes are escalated according to agreed rules.",
        fields: "Per risk: likelihood and impact, risk owner, actions, deadlines and trend.",
      },
      {
        title: "Management cockpit",
        body: "The executive team receives a compact overview of selected metrics and required action. We align definitions and data sources with the business owners. Deviations from targets are shown with their trend.",
        fields: "Per metric: definition, data source, owner, target and actual value, plus currency and trend.",
      },
      {
        title: "Delivery tracking",
        body: "We track agreed actions and address blockers with the owners. We also look at organisational prerequisites such as clarified roles or required training. Completed actions are closed against the agreed outcome.",
        fields: "Per action: outcome, owner, deadline and status, plus blockers and proof of completion.",
      },
    ],
  },
  cockpit: {
    sheetTitle: "CEO Management Cockpit",
    sheetTag: "Illustrative structure",
    groups: [
      {
        label: "Business performance",
        lines: [
          { label: "Revenue and order intake", value: "Target / actual / trend" },
          { label: "Margin and liquidity", value: "Deviation / action needed" },
        ],
      },
      {
        label: "Priorities and initiatives",
        lines: [
          { label: "ERP implementation", value: "Red · Clarify testing capacity" },
          { label: "Sales development", value: "Amber · Follow up on action" },
        ],
      },
      {
        label: "Risks and capacity",
        lines: [
          { label: "Key risks", value: "Change / countermeasures" },
          { label: "Staffing bottlenecks", value: "Impact / ownership" },
        ],
      },
    ],
    question: "Which decisions does the executive team need to take now?",
    sheetNote: "Example without client data. Metrics and content are defined for each company.",
    eyebrow: "Your result",
    title: "One page for what matters.",
    body: "The monthly management cockpit condenses management information. It shows where a decision or intervention is required. The details remain in the underlying overviews.",
    benefits: [
      { title: "Less coordination effort for the CEO", body: "Current information is gathered from the people responsible." },
      { title: "Traceable decisions", body: "The need for decisions and the required basis are clearly visible." },
      { title: "Committed follow-up", body: "Agreed actions have clear owners and deadlines." },
      { title: "One shared picture", body: "The executive team discusses progress and bottlenecks on the same basis." },
    ],
  },
  models: {
    eyebrow: "Engagement models",
    title: "As much support as your company needs.",
    intro:
      "The models differ in the intensity of support. We agree on the topics covered and the specific scope of services within the available time budget.",
    items: [
      {
        name: "VMO Light",
        title: "Management overview",
        volume: "Approx. 2 days per month",
        body: "For an executive team that wants to review its key topics in a structured way every month.",
        bullets: [
          "Management agenda and monthly cockpit",
          "Monthly review with CEO sparring",
          "Review of key risks",
          "Documentation of agreed actions",
        ],
        cta: "Discuss VMO Light",
        featured: false,
      },
      {
        name: "VMO Core",
        title: "Active coordination",
        volume: "Approx. 1 day per week",
        body: "For several initiatives that need regular cross-functional alignment.",
        bullets: [
          "Everything in VMO Light",
          "Maintaining the initiative and project portfolio",
          "Decision overview and KPI tracking",
          "Preparation of agreed executive meetings",
          "Regular follow-up with the owners",
        ],
        cta: "Discuss VMO Core",
        featured: true,
      },
      {
        name: "VMO Executive",
        title: "Extended staff function",
        volume: "Approx. 2 days per week",
        body: "For CEOs and executive teams with increased coordination needs or a comprehensive change agenda.",
        bullets: [
          "Everything in VMO Core",
          "In-depth support for transformation initiatives",
          "Management workshops and steering committees",
          "Coordination of external partners within the agreed scope",
          "Preparation of documents for the board of directors",
        ],
        cta: "Discuss VMO Executive",
        featured: false,
      },
    ],
    finePrint:
      "Time figures are indicative. Scope and depth are defined in the mandate. VMO Light requires current data and status reports from the client. Dedicated project leadership is agreed explicitly and either planned within the time budget or commissioned separately.",
    mailSubjectPrefix: "Enquiry",
  },
  role: {
    eyebrow: "Our role",
    title: "Close to the executive team. With clear responsibilities.",
    paragraphs: [
      "Abexis works with your leadership team as external management support. The mandate provides the basis for gathering information and following up on agreed actions.",
      "At the start, we clarify decision paths and how we work with existing functions.",
    ],
    points: [
      { title: "Abexis coordinates and prepares", body: "We condense information, prepare decisions and follow up on agreed actions." },
      { title: "The executive team decides", body: "Corporate decisions remain with the responsible people or bodies. Any further authority is agreed explicitly." },
      { title: "Departments own delivery", body: "Line management and business responsibility remain within the company. Specialist reviews are commissioned separately if needed." },
      { title: "Existing functions are involved", body: "The VMO works with controlling and project owners and uses existing reports and systems." },
    ],
  },
  setup: {
    eyebrow: "VMO management setup",
    title: "Start with a workable overview.",
    intro:
      "Within about two calendar weeks, we work with you to create an initial management overview and agree the steering rhythm. This requires available information and the involvement of the executive team. The actual effort depends on the starting situation.",
    steps: [
      { title: "Clarify the mandate", body: "We discuss the situation and define the topics covered and responsibilities." },
      { title: "Connect information", body: "We review existing reports and clarify data sources and open information gaps." },
      { title: "Build the steering", body: "We create the agreed overviews for priorities and initiatives as well as risks and decisions." },
      { title: "Review together", body: "We discuss the first overview and agree the rhythm of further collaboration." },
    ],
    bottom: "After the setup, you decide whether to continue the steering internally or engage Abexis for ongoing support.",
    cta: "Discuss the setup",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    intro: "The mandate is shaped by your organisation and the topics where support is actually needed.",
    items: [
      { q: "What does “virtual” mean?", a: "The VMO is an external, flexibly integrated management function. It does not refer to software or an automated executive team. Collaboration is organised to suit the mandate. On-site meetings and digital collaboration are agreed together." },
      { q: "How does the VMO differ from project leadership?", a: "The VMO looks at how several management topics and initiatives interact. Project leadership runs one specific project. If Abexis is also to take on project leadership, the mandate and capacity are defined explicitly." },
      { q: "How often do we align?", a: "VMO Light works with a monthly steering cycle. For Core and Executive, we agree regular short check-ins and in-depth topic reviews. Critical developments are reported according to the agreed escalation rules, regardless of the meeting schedule." },
      { q: "What does our company need to contribute?", a: "You need a responsible contact on the executive team and access to the agreed information. Business owners provide current data and status reports. The executive team takes the required decisions and appoints those responsible for delivery." },
      { q: "Do we need new software?", a: "We first check how your existing tools and reports can be used. New software is not a prerequisite. Any additional needs are assessed together during the setup." },
      { q: "Can we continue the VMO internally later?", a: "Yes. The overviews and the agreed steering rhythm can be continued internally. The scope and timing of a handover are agreed together." },
    ],
  },
  closing: {
    eyebrow: "Next step",
    title: "Where does your executive team need relief?",
    body: "In a non-binding conversation, we clarify your situation and the right scope of support.",
    primaryCta: "Book a VMO conversation",
    secondaryCta: "Go to contact form",
  },
};

export function getVmoContent(locale: VmoLocale) {
  return locale === "en" ? en : de;
}
