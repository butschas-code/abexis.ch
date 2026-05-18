import type { SiteContent } from "./types";

/** English copy for Daniel Sengstag's dedicated profile page on abexis.ch */
export const danielSengstagContentEn: SiteContent = {
  meta: {
    title: "Daniel Sengstag",
    description:
      "CEO and owner of Abexis GmbH. Leadership, digital transformation, board mandates, operational and strategic assignments between SMEs and international organizations.",
    ogLocale: "en_CH",
  },
  nav: [
    { id: "profil", label: "Profile" },
    { id: "bahn", label: "Career" },
    { id: "kompetenzen", label: "Competencies" },
    { id: "schwerpunkte", label: "Focus" },
    { id: "ausbildung", label: "Education" },
    { id: "haltung", label: "Approach" },
    { id: "mandate", label: "Mandates" },
    { id: "kontakt", label: "Contact" },
  ],
  lang: { label: "EN", switchTo: "Deutsch" },
  hero: {
    name: "Daniel Sengstag",
    credentials:
      "Mechanical engineer · industrial engineer · Executive MBA · certified board director",
    line: "Leadership with substance, between strategy, technology and market.",
    lead: "More than three decades of operational and strategic responsibility, from engineering and consulting to global sales and executive management roles. Today CEO of Abexis GmbH; mandates as board member, advisor and sparring partner.",
    ctaPrimary: "Profile",
    ctaSecondary: "Contact",
    pull:
      "Judgement emerges where experience meets complexity, and execution has priority.",
  },
  intro: {
    kicker: "Positioning",
    title: "Think strategically.\nDecide clearly.\nExecute consistently.",
    body: [
      "I work at interfaces: transformation and daily business, technology and economics, people and organization. In doing so, I combine technical understanding with P&L responsibility and a clear sense of governance.",
      "My career leads from design engineering and software through professional services and global sales leadership to executive management and entrepreneurship. This breadth shapes how I read situations: discreetly, precisely and reliably.",
    ],
  },
  portraitExpand: {
    summary: "Read detailed portrait",
    paragraphs: [
      "Daniel Sengstag has more than 30 years of experience in corporate and business unit leadership, both in multinational corporations and in more compact organizations. His career began as a design engineer, later as a software developer for technical applications, before moving into consulting and project management.",
      "This was followed by leadership roles as business unit manager for services, sales director, CEO and Country Manager at Siemens Industry Software. Subsequently, he was EMEA Sales Director and Country Manager at Dassault Systèmes (PLM and CAx). He became self-employed in management consulting and executive search; was Country Sales Manager at Ansys (simulation, digital twins); and Sales Manager Manufacturing at Pegasystems (digital business transformation, BPM, CRM).",
      "In addition to degrees in engineering and business and an Executive MBA, Daniel is a certified board director, with ongoing continuing education in sustainability, digitalization and governance.",
    ],
  },
  skills: {
    kicker: "Competencies",
    title: "Experience that adds up",
    lead: "Focus areas from the classic portrait page: compactly visible, with details on one click.",
    tags: [
      "Digital transformation",
      "Leadership",
      "Change management",
      "Strategic thinking",
      "Engineering",
      "Sales & business development",
      "Project management",
      "Corporate governance",
      "Human resources",
      "Risk management",
      "Sustainability",
      "Cybersecurity",
    ],
    detailSummary: "Detailed competency list",
    detailBullets: [
      "Experience from design engineer and developer through project manager and business unit leader to sales director and managing director",
      "Operational and strategic leadership; change management in reorganizations, mergers and process optimization",
      "P&L responsibility in several roles",
      "Broad project experience; strong ability to drive decisions and implementation",
      "Many years of experience as service delivery / professional services business unit manager",
      "Sales management and business development for complex capital goods and software, including demanding contract negotiations",
      "Sales operations (S&OP), sales excellence",
      "SMEs and international corporations: confident navigation across different cultures and hierarchies",
      "Regulations, compliance, corporate governance",
      "Strong background in various IT topics",
      "Engineering background in PLM, CAx, Industry 4.0, digital twin, smart factory and process automation",
      "Industries including manufacturing, software and IT, engineering, consumer, high-tech and plant engineering",
      "Focus on sustainability and cybersecurity",
    ],
  },
  focus: {
    kicker: "Focus areas",
    title: "Selected fields",
    themes: [
      {
        title: "Strategy · market · sales",
        note: "Market and portfolio decisions, go-to-market, complex capital goods and software.",
      },
      {
        title: "Digitalization · change",
        note: "Transformation, process and organizational development, Industry 4.0, PLM, automation, AI and RPA, always linked to impact.",
      },
      {
        title: "Corporate leadership · sparring",
        note: "Leadership in matrix organizations, cultures and hierarchies, from SMEs to corporations.",
      },
    ],
  },
  experience: {
    kicker: "Career",
    title: "Experience with perspective",
    narrative: [
      "More than 30 years in corporate and business unit leadership, both multinational and compact. Starting as a design engineer and software developer for technical applications, then consulting and project management.",
      "Business unit leadership in services, sales leadership, CEO and Country Manager at Siemens Industry Software; subsequently EMEA Sales Director and Country Manager at Dassault Systèmes (PLM/CAx).",
      "Self-employment in management consulting and executive search; Country Sales Manager at Ansys (simulation, digital twins); Sales Manager Manufacturing at Pegasystems (digital transformation, BPM, CRM).",
      "Degree programs in mechanical engineering and industrial engineering, Executive MBA; board director CAS (Swiss Board School / HSG) and Sustainable Leadership certificate (HWZ).",
    ],
    highlights: [
      "More than 25 years of leadership experience; P&L in several roles",
      "Change from mergers, reorganizations and process optimization",
      "Sales and business development for complex goods, including demanding contract negotiations",
      "Sales operations, S&OP, sales excellence",
      "IT depth: PLM, CAx, CRM, ERP, process automation",
      "Network with associations and universities",
      "Project leadership according to HERMES 2022, PRINCE2; Scrum Master",
    ],
    timeline: [
      {
        period: "since 2011 / 2021",
        role: "Managing Director and Founder",
        org: "Abexis GmbH",
      },
      { period: "2019-2021", role: "Sales Manager Manufacturing CH", org: "Pegasystems" },
      { period: "2017-2019", role: "Country Sales Manager CH", org: "Ansys" },
      {
        period: "2012-2016",
        role: "Sales Director EuroCentral · Country Manager CH",
        org: "Dassault Systèmes",
      },
      {
        period: "2008-2011",
        role: "Country Manager / CEO",
        org: "Siemens Industry Software",
      },
      {
        period: "2002-2008",
        role: "Director Professional Services CH/AT · Deputy Country Manager · Board Member",
        org: "Siemens Industry Software",
      },
      {
        period: "2000-2002",
        role: "Team Lead · Senior Consultant · Program and Project Leadership",
        org: "Siemens Industry Software",
      },
      {
        period: "1995-2000",
        role: "Project Leadership · Consulting · Software Development · Design Engineering",
        org: "Dür + Partner, Strässle, Sulzer",
      },
    ],
    timelineToggle: "Professional career: all stations",
    footnote:
      "Further education and certificates are structured under Education; here is the compact overview.",
  },
  education: {
    kicker: "Formal education",
    bandTitle: "Education & credentials",
    title: "Degrees & programs",
    entries: [
      {
        period: "2023",
        title: "Board Director CAS",
        org: "Swiss Board School, cooperation HSG / University of St.Gallen",
      },
      {
        period: "2022-2023",
        title: "Certificate Sustainable Leadership",
        org: "HWZ Zurich, cooperation Sustainable Switzerland",
      },
      {
        period: "2004-2005",
        title: "Executive Master of Business Administration (MBA), General Management",
      },
      {
        period: "1997-1999",
        title: "Industrial Engineer STV",
        org: "IMAKA",
      },
      {
        period: "1991-1994",
        title: "Mechanical Engineer FH",
        org: "University of Applied Sciences Rapperswil",
      },
      {
        period: "1984-1988",
        title: "Vocational baccalaureate; apprenticeship as design engineer",
      },
    ],
  },
  furtherEducation: {
    kicker: "Further education",
    title: "Selected programs",
    entries: [
      {
        line: "2021, Driving Business Towards the Sustainable Development Goals, Erasmus University Rotterdam",
        href: "https://www.eur.nl",
      },
      {
        line: "2021, Introduction to Psychology, Yale University",
        href: "https://www.yale.edu",
      },
      {
        line: "2020, Master of Digital Transformation (LinkedIn Learning)",
        href: "https://www.linkedin.com/learning/paths/master-digital-transformation",
      },
      {
        line: "2020, Elements of Artificial Intelligence, University of Helsinki",
        href: "https://www.helsinki.fi/en",
      },
      {
        line: "2019, JAWS Leadership and Managing Performance",
        href: "https://www.london-management.com",
      },
      {
        line: "2018, JAWS Selling",
        href: "https://www.london-management.com",
      },
      { line: "2016, seminar Best Board Practice", href: "https://www.vrmanagement.ch" },
      {
        line: "2012, seminar on company succession, University of St.Gallen",
        href: "https://cfb.unisg.ch/de",
      },
    ],
  },
  certifications: {
    kicker: "Courses & certificates",
    title: "Additional credentials",
    items: [
      "The Challenger Sales Training",
      "MEDDIC Sales Training",
      "Management Trainings",
      "Sales and Communication Trainings",
      "Salesforce Training",
      "Seminar IT Law",
      "Strategic Services Management and Delivery",
      "Storytelling",
      "Project Management PMI",
      "Agile Project Management",
      "HERMES 2022 Foundation Certification",
      "PRINCE2 Foundation Certification",
      "ITIL 4 Foundation Certification",
      "SCRUM Master Certification",
      "Cybersecurity",
      "Sustainability",
      "Business Model Innovation",
      "Procurement Masterclass: Procure to Pay",
      "Decentralized Finance, Blockchain",
    ],
  },
  philosophy: {
    kicker: "Approach",
    title: "How I work",
    body: [
      "I deliberately question the status quo, not out of opposition, but to create clarity. As a sparring partner, I care about robust decisions, not volume.",
      "For me, execution strength and perseverance are not buzzwords, but the benchmark: in mandates, in transformation and in collaboration with executive management and boards.",
    ],
  },
  strengths: {
    kicker: "Competency fields",
    title: "Topics I carry",
    items: [
      "Digital transformation · leadership · change management",
      "Strategic thinking · engineering · sales & business development",
      "Project management · corporate governance · HR · risk",
      "Sustainability · cybersecurity",
      "Manufacturing · software & IT · high-tech · plant engineering",
    ],
  },
  mandates: {
    kicker: "Mandates",
    title: "Board · advisory · interim",
    body: "Are you looking for a member of a board of directors, advisory board or foundation board, or for an interim leadership role? I look forward to a factual, confidential contact by email or phone.",
    bullets: [
      "Board of directors / advisory board / foundation board",
      "Interim management",
      "Sparring for executive management and boards",
    ],
  },
  abexis: {
    kicker: "Abexis",
    title: "CEO and owner",
    body: "Abexis GmbH stands for demanding support in business and digital transformation: project management, Industry 4.0, PLM, sales consulting and change management, wherever technology and organization come together.",
  },
  contact: {
    kicker: "Contact",
    title: "Direct and discreet",
    invite:
      "A short introduction is enough; I respond personally. For business matters concerning Abexis GmbH, you can also reach me through the channels below.",
    phone: "+41 79 349 04 54",
    emails: [
      { label: "daniel.sengstag@abexis.ch", href: "mailto:daniel.sengstag@abexis.ch" },
    ],
    socialHeading: "Links",
    social: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/danielsengstag" },
    ],
    address: [],
  },
  footer: {
    rights: "Daniel Sengstag. All rights reserved.",
    impressum: "Legal notice",
    privacy: "Privacy",
  },
};
