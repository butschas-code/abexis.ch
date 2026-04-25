/** Legacy /expertise page — sector depth & process (abexis-search.ch), preserved in structure. */

/** Original page imagery (Hoststar / legacy BaseKit), see https://abexis-search.ch/expertise */
const IMG = {
  hero: "https://firebasestorage.googleapis.com/v0/b/abexis-cms.firebasestorage.app/o/cms%2Fmedia%2Fmigrated%2Fa05683af-f767-4db4-b511-993653fd686c.jpg?alt=media",
  it: "https://firebasestorage.googleapis.com/v0/b/abexis-cms.firebasestorage.app/o/cms%2Fmedia%2Fmigrated%2Fa05683af-f767-4db4-b511-993653fd686c.jpg?alt=media",
  industrie: "https://firebasestorage.googleapis.com/v0/b/abexis-cms.firebasestorage.app/o/cms%2Fmedia%2Fmigrated%2F1b5d0ac2-fa65-4ce8-9270-4d2b3cd6b9f5.png?alt=media",
  finanzen: "https://firebasestorage.googleapis.com/v0/b/abexis-cms.firebasestorage.app/o/cms%2Fmedia%2Fmigrated%2F40809267-3f10-4b8f-bd09-6106ef88446f.jpg?alt=media",
  /** Legacy BaseKit placeholder used on the published expertise page */
  oeffentlich:
    "https://firebasestorage.googleapis.com/v0/b/abexis-cms.firebasestorage.app/o/cms%2Fmedia%2Fmigrated%2Fdefault_image-4.jpg?alt=media",
  briefing: "https://firebasestorage.googleapis.com/v0/b/abexis-cms.firebasestorage.app/o/cms%2Fmedia%2Fmigrated%2Fe2f858d8-02d7-41c5-84d2-d88cbc649fc4.png?alt=media",
  research: "https://firebasestorage.googleapis.com/v0/b/abexis-cms.firebasestorage.app/o/cms%2Fmedia%2Fmigrated%2F355c10e6-c2b2-4afe-85e7-bbbbab0b85c9.png?alt=media",
  direktansprache: "https://firebasestorage.googleapis.com/v0/b/abexis-cms.firebasestorage.app/o/cms%2Fmedia%2Fmigrated%2F60fbdaad-b5ee-4071-ba66-bd30ad7f32a0.png?alt=media",
  praesentation: "https://firebasestorage.googleapis.com/v0/b/abexis-cms.firebasestorage.app/o/cms%2Fmedia%2Fmigrated%2F7d3b6996-3660-42d2-b1df-fcd05b02efa4.png?alt=media",
  interviews: "https://firebasestorage.googleapis.com/v0/b/abexis-cms.firebasestorage.app/o/cms%2Fmedia%2Fmigrated%2Fd5b68620-6619-4833-a381-337787fc52f9.png?alt=media",
  coaching: "https://firebasestorage.googleapis.com/v0/b/abexis-cms.firebasestorage.app/o/cms%2Fmedia%2Fmigrated%2F4b8db16d-d119-46ea-8c55-e024eeae6452.png?alt=media",
} as const;

export type ExpertiseSector = {
  id: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  /** Optional `object-*` overrides — e.g. IT stock has the person on the right of the frame. */
  imageObjectClass?: string;
  intro: string[];
  specializationHeading: string;
  specializationItems: string[];
  rolesHeading: string;
  roles: string[];
};

export const expertiseHero = {
  kicker: "Passgenau. Schnell. Verlässlich.",
  title: "Unsere Branchenfokussierung",
  backdropSrc: IMG.hero,
} as const;

export const expertiseSectors: ExpertiseSector[] = [
  {
    id: "informationstechnologie",
    title: "Informationstechnologie",
    imageSrc: IMG.it,
    imageAlt: "Technologie und digitale Zusammenarbeit — Executive Search im IT-Umfeld",
    imageObjectClass: "object-[82%_46%] sm:object-[78%_44%] lg:object-[74%_48%]",
    intro: [
      "Die IT-Branche ist Treiberin der digitalen Transformation – gleichzeitig ist der Wettbewerb um Fach- und Führungskräfte in kaum einem Bereich so intensiv. Gefragt sind Persönlichkeiten, die Technologie nicht nur beherrschen, sondern Innovation ermöglichen, Teams führen und Strukturen skalieren können.",
      "Wir unterstützen IT-Unternehmen sowie technologiegetriebene Organisationen bei der gezielten Besetzung von Schlüsselrollen – von Tech-Startups bis zu etablierten Konzernen.",
    ],
    specializationHeading: "Unsere Spezialisierung im IT-Umfeld umfasst:",
    specializationItems: [
      "Software- & Plattformunternehmen",
      "IT-Consulting & Systemintegration",
      "SaaS- und Cloud-basierte Geschäftsmodelle",
      "Cybersecurity & Data Privacy",
      "AI, Data Science & Machine Learning",
      "Digital Units in klassischen Unternehmen",
    ],
    rolesHeading: "Typische Positionen:",
    roles: [
      "CTO / CIO / CDO",
      "Head of Software Engineering / Development",
      "IT-Architekt:innen & Solution Leads",
      "Leiter:innen Infrastruktur, IT-Security, Cloud",
      "Projekt- und Programmleiter",
      "Agile Coaches & Scrum Masters",
      "Digital- und Innovationsverantwortliche",
    ],
  },
  {
    id: "industrie",
    title: "Industrie",
    imageSrc: IMG.industrie,
    imageAlt: "Industrie und Engineering — Führungspositionen in der Fertigung",
    intro: [
      "Die Industrie steht im Spannungsfeld zwischen Digitalisierung, Nachhaltigkeit und globalem Wettbewerbsdruck. Unternehmen benötigen Führungspersönlichkeiten, die operative Exzellenz mit strategischem Weitblick verbinden – sei es in der Produktion, Supply Chain, Entwicklung oder Geschäftsführung.",
      "Als Executive Search Partner mit tiefem Industrieverständnis identifizieren wir genau jene Talente, die nicht nur Expertise mitbringen, sondern auch Veränderung gestalten und Teams zu Spitzenleistungen führen.",
    ],
    specializationHeading: "Unsere Spezialisierung in der Industrie umfasst:",
    specializationItems: [
      "Maschinen- & Anlagenbau",
      "Automatisierung & Robotik",
      "Elektrotechnik & Mechatronik",
      "Industrie-4.0-Transformation & Digitalisierung (CAx, PLM, XR, ...)",
    ],
    rolesHeading: "Typische Positionen:",
    roles: [
      "Geschäftsführung & Werksleitung",
      "Bereichs- & Produktionsleiter:innen",
      "Leiter:innen Technik, F&E, Qualität, Logistik",
      "C-Level Rollen (z. B. COO, CTO, CPO)",
      "Transformationsverantwortliche",
      "Projekt- und Programmleiter:innen",
      "Entwicklungsingenieur:innen",
    ],
  },
  {
    id: "finanzen",
    title: "Finanzen, Banking & Risk Management",
    imageSrc: IMG.finanzen,
    imageAlt: "Finanz- und Bankenumfeld — Executive Search in Finance und Risk",
    intro: [
      "Die Finanzwelt bewegt sich zwischen Stabilität, Regulatorik und technologischem Wandel. Fach- und Führungspersönlichkeiten in diesem Umfeld benötigen sowohl unternehmerisches Denken als auch höchste Präzision und müssen in dynamischen Märkten souverän agieren.",
      "Wir unterstützen Banken, Versicherungen, Finanzdienstleister und FinTech-Unternehmen bei der gezielten Besetzung kritischer Schlüsselpositionen – von etablierten Finanzinstituten bis hin zu innovationsgetriebenen Akteuren der Branche.",
    ],
    specializationHeading: "Unsere Spezialisierung im Finanzbereich umfasst:",
    specializationItems: [
      "Universal- und Privatbanken",
      "Risk, Audit & Compliance Units",
      "Corporate Finance & Treasury",
      "FinTech & InsurTech",
      "Asset Management & Family Offices",
      "ESG- und Regulatorik-Initiativen",
    ],
    rolesHeading: "Typische Positionen:",
    roles: [
      "CFO / Head of Finance / Leiter:in Controlling",
      "CRO / Head of Risk & Compliance",
      "Leiter:in Internal Audit",
      "Treasury- & Cash-Management-Verantwortliche",
      "ESG-/Sustainability-Officer",
      "RegTech-/FinTech-Verantwortliche",
      "Risk-, Credit- oder Compliance-Spezialist:innen",
    ],
  },
  {
    id: "oeffentlicher-sektor",
    title: "Öffentlicher Sektor & Verwaltung",
    imageSrc: IMG.oeffentlich,
    imageAlt: "Öffentliche Verwaltung und Institutionen — Führungsrollen im öffentlichen Sektor",
    intro: [
      "Der öffentliche Sektor befindet sich im Wandel: Digitalisierung, demografischer Druck, Fachkräftemangel und steigende Ansprüche an Effizienz und Bürgernähe fordern neue Kompetenzen – gerade in Schlüsselpositionen. Erfolgreiche Führung in der Verwaltung verlangt heute Managementfähigkeit, Kommunikationsstärke und ein tiefes Verständnis für politische und gesellschaftliche Zusammenhänge.",
      "Wir begleiten öffentliche Institutionen, Körperschaften und staatsnahe Betriebe bei der gezielten Besetzung von Führungs- und Fachfunktionen – mit Fingerspitzengefühl, Transparenz und Erfahrung.",
    ],
    specializationHeading: "Unsere Spezialisierung im öffentlichen Umfeld umfasst:",
    specializationItems: [
      "Bundes-, Kantons- und Kommunalverwaltungen",
      "Öffentliche Unternehmen & staatsnahe Betriebe",
      "Verbände & Aufsichtsorganisationen",
      "Bildungs- & Gesundheitsinstitutionen",
      "Regulierungs-, Infrastruktur- & Förderbehörden",
    ],
    rolesHeading: "Typische Positionen:",
    roles: [
      "Amts- & Bereichsleitungen",
      "Direktor:innen / Geschäftsführungen",
      "Fachverantwortliche in Bildung, IT, Infrastruktur",
      "Stabsstellen für Strategie",
    ],
  },
];

export type ProcessStep = {
  id: string;
  label: string;
  title: string;
  body: string;
  /** Illustration from legacy expertise page (optional — e.g. home uses same steps without visuals). */
  imageSrc?: string;
  imageAlt?: string;
};

export const expertiseProcessIntro = {
  title: "Unser Suchprozess – in 6 Schritten zum nachhaltigen Besetzungserfolg",
  lead:
    "Bei der Direktansprache von Führungspersönlichkeiten arbeiten wir mit einem strukturierten, bewährten Prozess. Er verbindet methodische Exzellenz, Marktverständnis und persönliche Betreuung – für ein Ergebnis, das langfristig trägt.",
} as const;

export const expertiseProcessSteps: ProcessStep[] = [
  {
    id: "briefing",
    label: "Briefing",
    title: "Briefing – Der Schlüssel zum Erfolg",
    body: "In einem ausführlichen Startgespräch analysieren wir gemeinsam Ihre unternehmerische Ausgangslage: Strategie, Marktposition, Kultur, Führungsstruktur und Anforderungsprofil. Diese Tiefe ist entscheidend – denn eine klare Zieldefinition bildet die Grundlage für eine treffsichere Suche.",
    imageSrc: IMG.briefing,
    imageAlt: "Illustration: Briefing und Zieldefinition",
  },
  {
    id: "research",
    label: "Research",
    title: "Research – Marktanalyse mit strategischem Fokus",
    body: "Unser internes Research-Team sondiert systematisch den relevanten Kandidatenmarkt: branchenübergreifend, anonymisiert, datenbasiert. Wir analysieren Zielgruppenpotenziale und liefern wertvolle Insights – z. B. zur Realisierbarkeit des Wunschprofils oder zu alternativen Denkansätzen bei der Besetzung.",
    imageSrc: IMG.research,
    imageAlt: "Illustration: Research und Marktanalyse",
  },
  {
    id: "direktansprache",
    label: "Direktansprache",
    title: "Direktansprache – Zugang zu den richtigen Persönlichkeiten",
    body: "Ausgewählte Kandidat:innen werden persönlich und diskret von unseren erfahrenen Berater:innen kontaktiert. Wir evaluieren in ersten Gesprächen sowohl Qualifikation als auch Motivation und Wechselbereitschaft. Nur Profile mit echter Relevanz werden weiterverfolgt.",
    imageSrc: IMG.direktansprache,
    imageAlt: "Illustration: Direktansprache von Kandidatinnen und Kandidaten",
  },
  {
    id: "praesentation",
    label: "Präsentation & Vorauswahl",
    title: "Präsentation & Vorauswahl – Strukturierter Dialog auf Augenhöhe",
    body: "Wir stellen Ihnen eine Longlist mit geeigneten Persönlichkeiten vor – transparent, anonymisiert, klar begründet. Gemeinsam definieren wir daraus eine Shortlist, mit der wir in die vertiefte Interviewphase gehen. Ihre Rückmeldungen fliessen kontinuierlich in die Feinjustierung des Profils ein.",
    imageSrc: IMG.praesentation,
    imageAlt: "Illustration: Präsentation und Vorauswahl",
  },
  {
    id: "interviews",
    label: "Interviews & Entscheidungsfindung",
    title: "Interviews & Entscheidungsfindung – Präzise Auswahl, klar dokumentiert",
    body: "In strukturierten Gesprächen bewerten wir die Shortlist-Kandidat:innen hinsichtlich Führungsverhalten, Persönlichkeitsprofil und kultureller Passung. Sie erhalten zu jedem Finalisten ein fundiertes Dossier mit unserer Einschätzung. Wir koordinieren die Kundengespräche diskret und effizient – bei Bedarf in unseren Räumlichkeiten.",
    imageSrc: IMG.interviews,
    imageAlt: "Illustration: Interviews und Entscheidungsfindung",
  },
  {
    id: "coaching",
    label: "Coaching & Abschluss",
    title: "Coaching & Abschluss – Wir bleiben an Ihrer Seite",
    body: "Auch nach erfolgreicher Auswahl begleiten wir den finalen Entscheidungs- und Vertragsprozess aktiv mit. Referenzeinholung, Zweitmeinung über Assessment oder Moderation sensibler Punkte – wir unterstützen Sie mit Erfahrung und Fingerspitzengefühl.",
    imageSrc: IMG.coaching,
    imageAlt: "Illustration: Coaching und Abschluss",
  },
];

export const expertiseProcessFooter =
  "Unser Ziel: Nicht nur eine Besetzung, sondern ein nachhaltiger Führungserfolg. Ergebnis: Eine fundierte, vertrauliche und partnerschaftlich geführte Suche mit messbarer Wirkung.";
