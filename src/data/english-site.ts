export const englishTopics = [
  {
    slug: "digital-transformation",
    deSlug: "digitale-transformation",
    title: "Digital Transformation",
    subtitle: "Digitalization",
    excerpt:
      "We help leadership teams translate digital opportunities into clear business goals, practical roadmaps and measurable implementation steps.",
    sections: [
      {
        title: "Where we create clarity",
        body: "Digital transformation can range from focused process improvement to business model renewal. Abexis starts with the strategic intent, then aligns customer experience, organization, data, technology and execution.",
      },
      {
        title: "Typical focus areas",
        bullets: [
          "Digital strategy and business models",
          "Customer interaction and channels",
          "Process automation and data quality",
          "Cloud, platforms, AI and Industry 4.0 topics",
        ],
      },
    ],
  },
  {
    slug: "corporate-strategy",
    deSlug: "unternehmensstrategie",
    title: "Corporate Strategy",
    subtitle: "Strategy process",
    excerpt:
      "We support companies in sharpening strategic priorities, developing resilient plans and translating them into operational decisions.",
    sections: [
      {
        title: "Strategy with operational grip",
        body: "A useful strategy gives management orientation and helps teams make better decisions. We combine market perspective, business model thinking and pragmatic implementation planning.",
      },
      {
        title: "Typical work",
        bullets: ["Strategic positioning", "Growth and portfolio options", "Operating model and governance", "Decision-ready implementation roadmaps"],
      },
    ],
  },
  {
    slug: "sales-marketing",
    deSlug: "vertriebmarketing",
    title: "Sales & Marketing",
    subtitle: "Go-to-market",
    excerpt:
      "We help organizations develop sales structures, sharpen market development and improve the way growth potential is converted into revenue.",
    sections: [
      {
        title: "From ambition to pipeline",
        body: "Abexis reviews markets, segments, sales processes and leadership routines so sales and marketing work from the same commercial reality.",
      },
      {
        title: "Typical work",
        bullets: ["Sales strategy", "Business development", "Channel and partner models", "Performance management and coaching"],
      },
    ],
  },
  {
    slug: "change-management",
    deSlug: "veränderungsmanagement",
    title: "Organizational Change",
    subtitle: "Change management",
    excerpt:
      "We guide change initiatives with an iterative, people-conscious approach that keeps risks visible and implementation realistic.",
    sections: [
      {
        title: "Change that lands",
        body: "Successful change needs more than communication. We clarify goals, stakeholders, readiness, leadership routines and the practical moments where new behavior has to become real.",
      },
      {
        title: "Typical work",
        bullets: ["Change impact analysis", "Stakeholder alignment", "Leadership sparring", "Communication and adoption planning"],
      },
    ],
  },
  {
    slug: "process-optimization",
    deSlug: "prozessoptimierung",
    title: "Process Optimization",
    subtitle: "Operational excellence",
    excerpt:
      "We analyze processes, costs and automation potential to improve efficiency, quality and transparency across the organization.",
    sections: [
      {
        title: "Practical improvement",
        body: "The goal is not process documentation for its own sake. We identify where decisions, handovers, systems or incentives slow the business down, then prioritize improvements that can be implemented.",
      },
      {
        title: "Typical work",
        bullets: ["Process analysis", "Cost and efficiency improvement", "Automation potential", "Management reporting and control points"],
      },
    ],
  },
  {
    slug: "project-management",
    deSlug: "projektmanagement",
    title: "Project Management",
    subtitle: "Execution",
    excerpt:
      "We support project execution, project assessments and recovery situations with experienced, methodical and business-oriented leadership.",
    sections: [
      {
        title: "Delivery with perspective",
        body: "Projects rarely fail because people do not work hard enough. They drift when goals, governance, risks or decisions are unclear. Abexis brings structure and senior judgement into those moments.",
      },
      {
        title: "Typical work",
        bullets: ["Project leadership", "Project assessments", "Risk and governance reviews", "Recovery and stabilization plans"],
      },
    ],
  },
] as const;

export type EnglishTopic = (typeof englishTopics)[number];

export function getEnglishTopic(slug: string): EnglishTopic | undefined {
  return englishTopics.find((topic) => topic.slug === slug);
}
