/**
 * Canonical copy & metadata migrated from legacy abexis-search.ch (scraped 2026-04-21).
 * Substance preserved; IA labels updated for executive-search focus where noted.
 */

export {
  expertiseHero,
  expertiseProcessFooter,
  expertiseProcessIntro,
  expertiseProcessSteps,
  expertiseSectors,
} from "./expertise-content";

export const site = {
  name: "Abexis Search",
  legalName: "Abexis GmbH",
  domain: "https://abexis-search.ch",
  consultingUrl: "https://abexis.ch",
  consultingLabel: "Abexis Consulting",
  searchLabel: "Abexis Search",
  email: "contact@abexis.ch",
  phoneDisplay: "+41 43 535 84 34",
  phoneTel: "+41435358434",
  addressLines: ["Abexis GmbH", "Zihlstrasse 25", "8340 Hinwil", "Schweiz"] as const,
  linkedIn: "https://www.linkedin.com/company/abexis-gmbh",
  bookingUrl:
    "https://outlook.office.com/bookwithme/user/e725b81719d74d9fad11b791fafc6f6d@abexis.ch?anonymous&ep=plink",
  /** Legacy logo asset (Hoststar CDN) */
  logoUrl: "https://files.designer.hoststar.ch/b5/d1/b5d116da-151c-434e-bf74-a7e296e5a9e0.JPG",
  seoDefaults: {
    title: "Abexis Search",
    description:
      "Abexis SEARCH ist spezialisiert auf die gezielte Besetzung von Führungs- und Schlüsselpositionen in anspruchsvollen Branchen – diskret, methodisch fundiert und mit echter Beratungskompetenz.",
    keywords: [
      "Stellen",
      "Vakanzen",
      "Jobs",
      "Personalvermittlung",
      "Executive Search",
      "Herausforderungen",
      "Rollen",
      "Account Manager",
      "Sales",
      "Verkauf",
      "CAD",
      "PLM",
      "Product Lifecycle Management",
      "CAx",
      "Vertrieb",
      "Sales manager",
    ],
  },
} as const;

export type NavItem = { href: string; label: string };

export const mainNav: NavItem[] = [
  { href: "/expertise", label: "Executive Search" },
  { href: "/unternehmen", label: "Über uns" },
  { href: "/blog", label: "Insights" },
  { href: "/vakanzen", label: "Vakanzen" },
  { href: "/kontakt", label: "Kontakt" },
];

export const home = {
  heroTitle: "Executive Search",
  heroSubtitle: "Wir finden Persönlichkeiten, nicht nur Profile",
  heroEyebrow: "Executive Search, Personalvermittlung",
  heroMainLead:
    "Abexis SEARCH besetzt Führungs- und Schlüsselpositionen diskret, präzise und mit echter Beratungskompetenz. Wir bringen Organisationen mit Persönlichkeiten zusammen, die nicht nur passen, sondern Wirkung entfalten.",
  heroSupportingLead:
    "Unsere Mandant:innen schätzen die Verbindung aus strukturierter Direktansprache, unternehmerischem Verständnis und einem klar geführten Suchprozess — für Besetzungen, die fachlich, menschlich und strategisch tragen.",
  introTitle: "Executive Search, Personalvermittlung",
  introLead:
    "Eine erfolgreiche und schnelle Besetzung von Schlüsselpositionen in Unternehmen ist aufwendig, Fehlentscheide resultieren fast immer in einer hohen Kostenfolge. Aus diesem Grund verlassen sich Entscheidungsträger oft auf spezialisierte Unternehmen wie die Abexis, welche den Rekrutierungsprozess neutral, effizient und professionell gestalten.",
  sectorsEyebrow: "Branchenexpertise",
  sectorsTitle: "Nur wer die Branchen kennt, versteht die Bedürfnisse der Unternehmen und kann sie gezielt beraten.",
  sectorsBody: [
    "Bei Abexis Search setzen wir auf Tiefe statt Breite. Unsere Berater:innen sind in ausgewählten Branchen zu Hause – sie kennen die Dynamiken, sprechen die Sprache der Entscheider und verstehen, worauf es wirklich ankommt. Diese Fokussierung erlaubt es uns, Entwicklungen frühzeitig zu erkennen und tragfähige Beziehungen zu gefragten Talenten aufzubauen.",
  ],
  sectorsListHeading: "Unsere Branchenschwerpunkte:",
  sectorsList: [
    "Informationstechnologie & Digitalisierung",
    "Industrie",
    "Finanzen, Banking & Risk Management",
    "Öffentlicher Sektor & Verwaltung",
    "Beratung",
  ],
  customerTitle: "Unser Kundenfokus, Ihr Gewinn",
  customerBody: [
    "Ihre Bedürfnisse stehen bei uns im Mittelpunkt. Wir nehmen uns Zeit, um Ihre Anforderungen genau zu verstehen. Wir arbeiten eng mit Ihnen zusammen, um die perfekte Lösung für Ihr Unternehmen zu finden. Gerade bei Führungspositionen ist Diskretion entscheidend. Unser Prozess gewährleistet, dass sowohl die Identität des Unternehmens als auch der Kandidaten vertraulich behandelt wird.",
  ],
  networkTitle: "Unser Netzwerk, Ihr Vorteil",
  networkBody: [
    "Durch unser grosses Netzwerk qualifizierter Fach- und Führungskräfte profitieren Sie von einer gezielten und effektiven Suche nach den besten Talenten. Mit modernsten Recherchemethoden gewährleisten wir, dass Sie Zugang zu Top-Kandidaten erhalten, die perfekt auf Ihre Anforderungen abgestimmt sind. Unsere Mitgliedschaften in verschiedenen Branchenverbänden erweitern dieses Netzwerk zusätzlich und bieten Ihnen noch mehr Möglichkeiten. Besonders wertvoll: Durch die Direktansprache erreichen wir potenzielle Kandidaten, die auf herkömmlichen Jobplattformen nicht zu finden sind – ein entscheidender Vorteil für Ihre Besetzung von Schlüsselpositionen.",
  ],
  qualityTitle: "Unser Qualitätsanspruch, Ihre Sicherheit für Zuverlässigkeit",
  qualityBody: [
    "Wir legen höchste Qualitätsstandards bei der Personalsuche an und prüfen Kandidaten gründlich auf Fachkompetenz, persönliche Eigenschaften und kulturelle Passung. Mit unseren Assessmentverfahren – darunter Fachgespräche, Potenzialanalysen und Persönlichkeitstests – sichern Sie sich die besten Talente. So minimieren Sie Fehlbesetzungen und stärken Ihr Unternehmen nachhaltig.",
  ],
  ctaBand:
    "Sie wollen mehr über unsere Leistungen erfahren? Wir freuen uns auf Ihre unverbindliche Kontaktaufnahme.",
  ctaBookingLine:
    "Gerne können Sie auch einen Termin für einen unverbindlichen Austausch vereinbaren:",
  ctaBookingLabel: "Termin planen",
  /** Embedded profile text from legacy BaseKit `window.Profile` — preserved verbatim. */
  profileExtended: `Abexis SEARCH ist spezialisiert auf die gezielte Besetzung von Führungs- und Schlüsselpositionen in anspruchsvollen Branchen – diskret, methodisch fundiert und mit echter Beratungskompetenz. Wir bringen Organisationen mit Persönlichkeiten zusammen, die nicht nur passen, sondern gestalten.
Unsere Mandant:innen schätzen unsere Kombination aus unternehmerischem Denken, strukturierter Direktansprache und tiefem Verständnis für Märkte, Geschäftsmodelle und Unternehmenskulturen.

Unser Leistungsversprechen:
•	Executive Search auf Augenhöhe – von C-Level bis zur strategisch wichtigen Fachrolle
•	Personalvermittlung mit Tiefe – schnelle, fundierte Besetzungen auf Basis klarer Anforderungen
•	Prozessklarheit & Verbindlichkeit – strukturierte Suche mit ehrlicher Beratung
•	Candidate Experience auf Top-Niveau – wertschätzende, persönliche Betreuung aller Beteiligten
•	Branchenfokus: Industrie, Technologie, MedTech, öffentlicher Sektor u. a.

Wir sind überzeugt: Der richtige Mensch in der richtigen Rolle macht den Unterschied. Deshalb setzen wir auf Qualität vor Quantität – und auf Partnerschaften, die langfristig tragen.
`,
  consultingCrosslink: {
    title: "Abexis Consulting",
    body: "Abexis unterstützt darüber hinaus auch in ausgewählten Beratungsmandaten — getrennt organisiert unter abexis.ch.",
    cta: "Zu Abexis Consulting",
  },
} as const;

/** Copy for `/blog` (intro above cards). */
export const insightsLanding = {
  articlesIntro:
    "Unten finden Sie unsere aktuellen Beiträge — kompakte Impulse zu Führung, Karriere und Markt, für Kandidatinnen, Kandidaten und alle, die Executive Search aus der Praxis verstehen wollen.",
} as const;

export const organization = {
  heroTitle: "Wir besetzen Vertrauen",
  heroSubtitle: "Menschen. Methode. Wirkung.",
  intro: [
    "Hinter Abexis stehen Personen, die sich mit Überzeugung für Qualität, Verantwortung und nachhaltige Besetzungserfolge einsetzen. Wir verbinden fundierte Erfahrung in Executive Search, Branchenkenntnis und eine klare Haltung: Wir begleiten Führungspersönlichkeiten und Organisationen mit echter Aufmerksamkeit, methodischer Exzellenz und dem Blick für das, was langfristig wirkt.",
  ],
  valuesHeading: "Abexis SEARCH steht für:",
  values: [
    {
      title: "Verbindlichkeit in der Partnerschaft",
      text: "– wir denken und handeln unternehmerisch im Sinne unserer Mandant:innen.",
    },
    {
      title: "Tiefe im Prozess",
      text: "– wir arbeiten analytisch, diskret und strukturiert.",
    },
    {
      title: "Wertschätzung im Dialog",
      text: "– ob Kandidat:in oder Auftraggeber: Für uns zählen Mensch, Kontext und Wirkung.",
    },
    {
      title: "Klarheit im Anspruch",
      text: "– wir übernehmen nur Mandate, von denen wir überzeugt sind.",
    },
  ],
  closing:
    "Unsere Arbeitsweise ist persönlich, professionell und geprägt vom Ziel, den entscheidenden Unterschied zu machen – für Menschen, Organisationen und Zukunftsthemen.",
  teamHeading: "Über uns",
  team: [
    {
      name: "Daniel Sengstag",
      role: "Mitgründer und Geschäftsführer",
      bio: [
        "Daniel Sengstag ist Mitgründer und Geschäftsführer von Abexis SEARCH mit über 25 Jahren Führungserfahrung in der Industrie, IT und Beratung. Zusätzlich zu leitenden Positionen bei internationalen Technologiekonzernen war er als Partner in einer renommierten Executive-Search-Boutique tätig. Seine Leidenschaft gilt der Besetzung von Schlüsselpositionen mit nachhaltiger Wirkung, strukturiert, diskret und auf Augenhöhe mit Unternehmen und Kandidat:innen. Bei Abexis SEARCH verantwortet er insbesondere die strategische Entwicklung und das Mandats-management im Executive-Bereich.",
      ],
      phone: "+41 79 349 04 54",
      email: "daniel.sengstag@abexis.ch",
      linkedIn: "https://www.linkedin.com/in/danielsengstag/",
      photoUrl: "https://files.designer.hoststar.ch/93/38/9338eeab-feb5-462b-ad73-6de0c7df9d65.jpg",
    },
    {
      name: "Renate Sengstag",
      role: "Miteigentümerin",
      bio: [
        "Renate Sengstag ist Miteigentümerin und bringt über 20 Jahre Erfahrung im Executive Management mit, unter anderem in der direkten Zusammenarbeit mit Geschäftsleitungen und CEOs international tätiger Unternehmen. Sie verfügt über exzellente Organisationsfähigkeiten, ein feines Gespür für Menschen sowie höchste Diskretion im Umgang mit sensiblen Informationen. Bei Abexis SEARCH leitet sie das Backoffice, koordiniert den operativen Ablauf und unterstützt Mandatsprozesse in administrativer Hinsicht. Ihre strukturierte Arbeitsweise sorgt für Stabilität und Effizienz im Tagesgeschäft.",
      ],
      phone: "+41 79 417 77 58",
      email: "contact@abexis.ch",
      linkedIn: "https://www.linkedin.com/in/renate-sengstag-64a540254/",
      photoUrl: "https://files.designer.hoststar.ch/d9/de/d9de5400-785e-47ca-b6c6-fd49b25ba2f8.jpg",
    },
    {
      name: "Sacha Moeller",
      role: "Partner",
      bio: [
        "Sacha Moeller ist Partner bei Abexis SEARCH und verfügt über mehr als 20 Jahre Führungserfahrung in der Finanzindustrie und im Family Office, unter anderem in leitenden Funktionen bei UBS. Seine Expertise umfasst Business-, Risk- und Change-Management sowie komplexe Transformations- und Digitalisierungsprojekte. Er verbindet analytische Kompetenz mit empathischer Führung und fördert werteorientierte Kulturen. Bei Abexis SEARCH begleitet er Mandate in Finance, Risk, IT-Transformation und Human Capital – mit Fokus auf Wirkung und nachhaltigen Mehrwert.",
      ],
      phone: "+41 78 604 87 65",
      email: "sacha.moeller@abexis.ch",
      linkedIn: "https://www.linkedin.com/in/sacha-moeller/",
      photoUrl: "https://files.designer.hoststar.ch/6b/a6/6ba66ce4-e338-42a5-9363-9bde653084c3.JPG",
    },
    {
      name: "Wird bald bekannt gegeben",
      role: "Team",
      bio: ["Hier könnte bald ihr Bild stehen", "Wir freuen uns auf Ihre Kontaktaufnahme"],
      phone: "",
      email: "",
      linkedIn: "",
      photoUrl: "https://files.designer.hoststar.ch/85/20/8520c46b-8b22-4ed3-935b-f1418979f85e.jpg",
    },
  ],
  partnersHeading: "Partnerschaften und Verbände",
  partners: [
    "Wir arbeiten mit verschiedenen namhaften Unternehmen zusammen und haben strategische Partnerschaften aufgebaut. Wir sind Mitglied und aktiv in folgenden Verbänden und Fachvereinen.",
    "Starke Partnerschaften und tragfähige Verbände entstehen dort, wo gemeinsame Werte auf klare Ziele treffen – und Vertrauen der verbindende Faktor ist.",
  ],
  /** Logo strip as published on legacy Unternehmen page (links + Hoststar assets). */
  partnerLogos: [
    { href: "https://abexis.ch/", logoUrl: "https://files.designer.hoststar.ch/d5/32/d5329da5-b14a-4e9a-9f91-5a61e79d1ab9.png" },
    { href: "https://avzo.ch/", logoUrl: "https://files.designer.hoststar.ch/75/c3/75c3aead-c3e6-494f-ae21-6943aaac9727.jpg" },
    { href: "https://swissmbas.com/", logoUrl: "https://files.designer.hoststar.ch/53/5c/535c231a-2828-4250-920f-6e038a9dd3e4.jpg" },
    { href: "https://boardfoundation.org/de/", logoUrl: "https://files.designer.hoststar.ch/84/aa/84aaedab-3687-4156-84cb-2829378c5a2a.png" },
    {
      href: "https://www.ausbildung-weiterbildung.ch/",
      logoUrl: "https://files.designer.hoststar.ch/6c/0c/6c0c4075-7d01-408f-991f-9ce87dae43ff.jpg",
    },
    { href: "https://www.ufz.ch/", logoUrl: "https://files.designer.hoststar.ch/79/57/7957308c-ae46-48ae-91b3-5496541f38ef.jpg" },
    {
      href: "https://www.digital-winterthur.ch/",
      logoUrl: "https://files.designer.hoststar.ch/d8/c2/d8c2a5c5-22b8-47a5-901c-6609ec3afc98.png",
    },
    { href: "https://www.swissict.ch/", logoUrl: "https://files.designer.hoststar.ch/85/53/8553e772-bfe9-48b7-927c-2cc22b5eee97.jpg" },
    { href: "https://svc.swiss/de", logoUrl: "https://files.designer.hoststar.ch/11/16/11160c10-f01d-4876-953c-2ecab10f4177.jpg" },
    {
      href: "https://www.sustainableleaders.ch/de/",
      logoUrl: "https://files.designer.hoststar.ch/6c/7c/6c7c409f-efcc-48d9-afea-2f3b8f3fc5ee.png",
    },
    {
      href: "https://www.futureinstitute.ch/",
      logoUrl: "https://files.designer.hoststar.ch/c3/dd/c3dd9085-52bd-4a2c-a8b8-e89659ba8093.png",
    },
    {
      href: "https://www.zuerioberland.ch/",
      logoUrl: "https://files.designer.hoststar.ch/ce/fc/cefc61ab-d52c-4e1f-b674-5101917a25ff.jpg",
    },
  ],
} as const;

export const vacancies = {
  titleLines: ["Im Auftrag einer Mandantin suchen wir einen", "Account Manager Industrie & Digitalisierung (m/w/d)"],
  hook: "Du willst nicht einfach Software verkaufen, sondern echten Impact schaffen?",
  hookFollow: "Dann könnte diese Rolle genau das Richtige für Dich sein.",
  intro: [
    "In dieser Position gestaltest Du aktiv die digitale Weiterentwicklung von Industrieunternehmen in der Schweiz. Du arbeitest an der Schnittstelle zwischen Business, Engineering und Technologie und begleitest Kunden dabei, ihre Prozesse nachhaltig zu verbessern.",
    "Bei unserer Mandantin handelt es sich um ein erfolgreiches Unternehmen, das hochwertige Engineering‑Software vertreibt und umfassende Beratungsdienstleistungen für anspruchsvolle Kunden erbringt.",
  ],
  roleHeading: "Deine Rolle",
  roleLead:
    "Du verantwortest den Aufbau und die Weiterentwicklung von Kundenbeziehungen in einem anspruchsvollen B2B Umfeld.",
  roleSub:
    "Dabei geht es nicht nur um Vertrieb, sondern um echte Beratung auf Augenhöhe.",
  roleBulletsIntro: "Konkret bedeutet das:",
  roleBullets: [
    "Du identifizierst neue Geschäftsmöglichkeiten und entwickelst bestehende Kunden strategisch weiter",
    "Du verstehst die Herausforderungen deiner Kunden und übersetzt sie in passende Lösungsansätze",
    "Du führst Gespräche auf Fach und Management Ebene und baust langfristiges Vertrauen auf",
    "Du orchestrierst den gesamten Sales Prozess von der ersten Idee bis zum Abschluss",
    "Du arbeitest eng mit internen Spezialisten aus Beratung und Umsetzung zusammen",
    "Du bringst Marktimpulse aktiv ein und hilfst, das Geschäft weiterzuentwickeln",
  ],
  requirementsHeading: "Was du mitbringst",
  requirements: [
    "Erfahrung im Vertrieb von erklärungsbedürftigen Software-Lösungen oder Dienstleistungen im B2B Umfeld",
    "Verständnis für industrielle Wertschöpfung, Produktentwicklung, oder Produktionsprozesse",
    "Erfahrung im Umfeld Engineering Software, Digitalisierung oder Prozessoptimierung",
    "Fähigkeit, komplexe Themen einfach und überzeugend zu vermitteln",
    "Souveränes Auftreten und echte Freude an Kundeninteraktion",
    "Strukturierte Arbeitsweise kombiniert mit unternehmerischem Denken",
    "Eigenverantwortung und der Wille, Dinge voranzutreiben",
  ],
  offerHeading: "Was dich erwartet",
  offer: [
    "Eine Rolle mit viel Gestaltungsspielraum und direktem Einfluss auf den Geschäftserfolg",
    "Anspruchsvolle Kundenprojekte mit echter Relevanz",
    "Ein Umfeld, in dem Vertrieb, Beratung und Umsetzung eng zusammenarbeiten",
    "Kurze Entscheidungswege und eine klare Ausrichtung",
    "Die Möglichkeit, Dich fachlich und persönlich weiterzuentwickeln",
  ],
  whyHeading: "Warum diese Rolle spannend ist",
  why: [
    "Hier verkaufst du keine Standardlösung.",
    "Du arbeitest an Themen, die für Deine Kunden geschäftskritisch sind.",
    "Und genau deshalb zählt nicht nur, was Du verkaufst sondern, wie Du denkst, verstehst und berätst.",
    "Ein wertschätzendes Arbeitsumfeld sowie zahlreiche attraktive Benefits runden das Angebot ab.",
  ],
  pdfLabel: "Abexis SEARCH - Account Manager I&D.pdf",
  pdfUrl: "https://files.designer.hoststar.ch/9e/d8/9ed818b8-6df9-4549-a501-eb744e1546ed.pdf",
  apply:
    "Interesse geweckt? Dann sende uns Deine aussagekräftigen Unterlagen an contact@abexis.ch Oder nimm mit uns unverbindlich Kontakt auf. Per Email an contact@abexis.ch oder Telefon +41 43 535 84 34",
} as const;

/** URL migration notes: primary public routes match legacy paths (`/expertise`, `/unternehmen`, `/blog`, …). */
export const redirectNotes =
  "No mandatory public URL changes in this release; canonical paths mirror legacy slugs for SEO continuity.";
