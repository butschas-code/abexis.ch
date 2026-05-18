export type EnglishFocusSlug =
  | "digitale-transformation"
  | "unternehmensstrategie"
  | "vertriebmarketing"
  | "veränderungsmanagement"
  | "prozessoptimierung"
  | "projektmanagement";

export type EnglishFocusItem = {
  num: string;
  title: string;
  items: readonly string[];
};

export type EnglishFocusBenefit = {
  num: string;
  title: string;
  body: string;
};

export type EnglishFocusPage = {
  slug: EnglishFocusSlug;
  title: string;
  subtitle: string;
  excerpt: string;
  heroTitle: string;
  heroBody: string;
  anchorLabel: string;
  anchorId: string;
  split: {
    left: { eyebrow: string; title: string; body: string; tone: "light" | "dark" };
    right: { eyebrow: string; title: string; body: string; tone: "light" | "dark" };
  };
  focus: {
    eyebrow: string;
    title: string;
    intro: string;
    items: readonly EnglishFocusItem[];
  };
  framework?: {
    eyebrow: string;
    title: string;
    body: string;
    image: string;
    alt: string;
    cards: readonly { eyebrow: string; title: string; body: string }[];
  };
  principle: {
    eyebrow: string;
    quote: string;
    label: string;
  };
  process: {
    eyebrow: string;
    countLabel: string;
    title: string;
    intro: string;
    phases: readonly EnglishFocusItem[];
  };
  benefits: {
    eyebrow: string;
    title: string;
    intro: string;
    items: readonly EnglishFocusBenefit[];
  };
  role: {
    eyebrow: string;
    title: string;
    body: string;
    situationsLabel: string;
    situations: readonly { title: string; body: string }[];
  };
  cta: {
    eyebrow: string;
    title: string;
    body: string;
  };
};

const salesFrameworkImage =
  "https://firebasestorage.googleapis.com/v0/b/abexis-cms.firebasestorage.app/o/cms%2Fmedia%2Fmigrated%2F5e9dd04f-ea8b-4c80-9830-7579ef4024df.png?alt=media";

export const englishFocusPages: readonly EnglishFocusPage[] = [
  {
    slug: "digitale-transformation",
    title: "Digital Transformation",
    subtitle: "Digitalization",
    excerpt:
      "We help leadership teams translate digital opportunities into clear business goals, practical roadmaps and measurable implementation steps.",
    heroTitle: "Digital transformation is not an IT project. It is a leadership task.",
    heroBody:
      "When boards and management interpret digitalization differently, investments lose focus and opportunities are missed. We help you turn technology into real business value: structured, strategic and implementable.",
    anchorLabel: "Fields of action",
    anchorId: "fields",
    split: {
      left: {
        eyebrow: "Level 1",
        title: "Digitalization",
        body:
          "This is the tactical level: individual processes, tools and workflows are digitized or automated. Important, but not sufficient on its own, because it does not change the business model.",
        tone: "dark",
      },
      right: {
        eyebrow: "Level 2",
        title: "Digital Transformation",
        body:
          "This is the strategic level: business models, customer experiences, culture and leadership are rethought. It creates sustainable advantage and requires entrepreneurial commitment.",
        tone: "light",
      },
    },
    focus: {
      eyebrow: "Fields of action",
      title: "Seven dimensions of digital transformation.",
      intro:
        "Digitalization touches every part of the company. We help you look at these dimensions as a whole and develop them deliberately.",
      items: [
        {
          num: "01",
          title: "Customer orientation & experience",
          items: [
            "Optimize digital touchpoints across the customer journey",
            "Build self-service portals and personalized experiences",
            "Feed customer feedback systematically into product development",
          ],
        },
        {
          num: "02",
          title: "Digital strategies & business models",
          items: [
            "Sharpen competitive positioning in digital markets",
            "Develop new revenue streams and platform models",
            "Build partnerships and digital ecosystems strategically",
          ],
        },
        {
          num: "03",
          title: "Leadership, culture & organization",
          items: [
            "Introduce digital leadership and agile management models",
            "Strengthen digital capabilities and innovation culture",
            "Adapt structures to new ways of working",
          ],
        },
        {
          num: "04",
          title: "Process optimization & automation",
          items: [
            "Analyze and redesign end-to-end processes",
            "Identify and realize automation potential",
            "Create data-based foundations for decisions",
          ],
        },
        {
          num: "05",
          title: "Platforms & sales channels",
          items: [
            "Build digital sales and communication channels",
            "Develop and integrate an omnichannel strategy",
            "Use marketplaces and digital ecosystems effectively",
          ],
        },
        {
          num: "06",
          title: "Technology: AI, IoT, Industry 4.0",
          items: [
            "Identify use cases for AI and machine learning",
            "Integrate IoT and Industry 4.0 solutions into existing operations",
            "Select technology according to strategic criteria",
          ],
        },
        {
          num: "07",
          title: "IT infrastructure & data foundation",
          items: [
            "Plan and implement cloud migration strategically",
            "Establish data architecture and governance",
            "Replace legacy systems step by step with scalable solutions",
          ],
        },
      ],
    },
    principle: {
      eyebrow: "Principle",
      quote:
        "Digital transformation provides a foundation for renewing a company and preparing it more effectively for the future: as a strategic initiative, not a side project.",
      label: "Abexis transformation principle",
    },
    process: {
      eyebrow: "Approach",
      countLabel: "04 phases",
      title: "From kick-off to a living strategy: structured, iterative, measurable.",
      intro:
        "The approach stays flexible. Depending on the starting point, you can begin with one focused aspect or set up a broader transformation program, always with clear measurable steps.",
      phases: [
        {
          num: "01",
          title: "Preparation",
          items: [
            "Define objectives, scope and priorities",
            "Assemble the team and clarify responsibilities",
            "Plan budget and timeline realistically",
            "Involve relevant stakeholders early",
          ],
        },
        {
          num: "02",
          title: "Analysis",
          items: [
            "Analyze customers, competitors and technology trends",
            "Review products and services critically",
            "Assess employee ideas and feasibility",
            "Compare the current situation with the target picture",
          ],
        },
        {
          num: "03",
          title: "Planning",
          items: [
            "Define vision, strategy and business model implications",
            "Redesign processes, organization and culture",
            "Define the ecosystem with customers and partners",
            "Choose technology and measurable implementation steps",
          ],
        },
        {
          num: "04",
          title: "Implementation",
          items: [
            "Implement the strategy with suitable methods",
            "Set up continuous review and monitoring",
            "Make adjustments and integrate learnings",
            "Measure, communicate and consolidate results",
          ],
        },
      ],
    },
    benefits: {
      eyebrow: "Benefits",
      title: "What well-executed digitalization creates.",
      intro: "Successful digital transformation creates value at several levels: operational, strategic and cultural.",
      items: [
        { num: "01", title: "Cost & revenue", body: "Reduce costs while increasing productivity, revenue and profit." },
        { num: "02", title: "Data quality", body: "Better data, fewer errors and stronger insight through automation." },
        { num: "03", title: "Customer experience", body: "A better purchasing and service experience increases customer satisfaction." },
        { num: "04", title: "Transparency", body: "Clearer information flows for customers, suppliers and internal teams." },
        { num: "05", title: "New markets", body: "New products and services open up additional customer potential." },
        { num: "06", title: "Collaboration", body: "Shared platforms improve collaboration and communication." },
        { num: "07", title: "Speed", body: "Efficient automated processes shorten cycle times." },
        { num: "08", title: "Future readiness", body: "Targeted investment in transformation protects competitiveness." },
      ],
    },
    role: {
      eyebrow: "Our role",
      title: "The difference between transformation and buying technology.",
      body:
        "Many companies buy software and call it transformation. We help you ask the right questions first, then take the right steps in the right order.",
      situationsLabel: "Typical starting situations",
      situations: [
        {
          title: "Missing internal transformation expertise",
          body:
            "Knowledge, capacity and distance from day-to-day business are missing internally, so a structured process cannot gain traction.",
        },
        {
          title: "Urgency from market change",
          body:
            "New competitors, technological disruption or changing customer expectations require fast, focused action without losing orientation.",
        },
        {
          title: "High investment, high risk",
          body:
            "Digital transformation ties up capital and energy. A structured external view reduces the risk of costly misinvestment.",
        },
      ],
    },
    cta: {
      eyebrow: "Next step",
      title: "It is better to start digital transformation early than late.",
      body:
        "In a free 30-minute introductory conversation, we clarify where your company stands, what you want to achieve and how we can support you.",
    },
  },
  {
    slug: "unternehmensstrategie",
    title: "Corporate Strategy",
    subtitle: "Strategy process",
    excerpt:
      "We support companies in sharpening strategic priorities, developing resilient plans and translating them into operational decisions.",
    heroTitle: "Strategy is created where perspectives diverge.",
    heroBody:
      "When the board and leadership team see the future differently, methodology, structure and an external perspective are needed. We support you from the first analysis to a strategy that is actually lived.",
    anchorLabel: "Process",
    anchorId: "process-spine",
    split: {
      left: {
        eyebrow: "Level 1",
        title: "Corporate strategy",
        body:
          "Concerns the whole organization. It defines how the company is led and which strategic decisions are needed to create sustainable competitive advantage.",
        tone: "light",
      },
      right: {
        eyebrow: "Level 2",
        title: "Owner strategy",
        body:
          "Focuses on the goals and preferences of the owners: return expectations, risk tolerance and long-term vision. It has to align with corporate strategy.",
        tone: "dark",
      },
    },
    focus: {
      eyebrow: "Strategy spine",
      title: "Seven steps from analysis to implementation.",
      intro:
        "A useful strategy gives orientation and creates a basis for decisions. We combine analysis, alignment and implementation planning.",
      items: [
        {
          num: "01",
          title: "Preparation & analysis",
          items: [
            "Analyze strengths, weaknesses and financial position",
            "Assess market opportunities, risks, trends and customer value",
            "Understand competitive conditions",
            "Combine internal and external factors in a SWOT view",
          ],
        },
        {
          num: "02",
          title: "Define vision & mission",
          items: [
            "Formulate a clear and inspiring company vision",
            "Describe long-term goals and the desired future state",
            "Clarify purpose and commitments to stakeholders",
          ],
        },
        {
          num: "03",
          title: "Derive strategic goals",
          items: [
            "Translate vision and mission into measurable objectives",
            "Consider the interests of different stakeholder groups",
          ],
        },
        {
          num: "04",
          title: "Develop strategic options",
          items: [
            "Identify different strategic options",
            "Evaluate feasibility, profitability and strategic fit",
          ],
        },
        {
          num: "05",
          title: "Select the best strategy",
          items: [
            "Integrate analysis and evaluation findings",
            "Choose the most suitable strategic path",
            "Communicate clearly to relevant stakeholders",
          ],
        },
        {
          num: "06",
          title: "Implement strategy",
          items: [
            "Develop concrete action plans",
            "Assign responsibilities and resources",
            "Set up monitoring and progress controls",
          ],
        },
        {
          num: "07",
          title: "Monitor & adjust",
          items: [
            "Establish continuous review routines",
            "Adapt the strategy when internal or external conditions change",
          ],
        },
      ],
    },
    principle: {
      eyebrow: "Principle",
      quote:
        "Strategy is not a document. It is a shared decision logic that helps management make better choices under uncertainty.",
      label: "Abexis strategy principle",
    },
    process: {
      eyebrow: "Approach",
      countLabel: "04 phases",
      title: "From orientation to execution discipline.",
      intro:
        "Each mandate is adapted to the situation, but the work always connects strategic thinking with decisions, ownership and operational translation.",
      phases: [
        {
          num: "01",
          title: "Orientation",
          items: [
            "Clarify the strategic question",
            "Review market, financial and organizational facts",
            "Define decision criteria and scope",
          ],
        },
        {
          num: "02",
          title: "Strategic design",
          items: [
            "Develop options and scenarios",
            "Evaluate implications and risks",
            "Align leadership assumptions",
          ],
        },
        {
          num: "03",
          title: "Decision",
          items: [
            "Prepare a decision-ready recommendation",
            "Clarify priorities, trade-offs and ownership",
            "Translate strategy into concrete initiatives",
          ],
        },
        {
          num: "04",
          title: "Implementation",
          items: [
            "Set milestones and governance",
            "Anchor responsibilities and resources",
            "Track progress and adjust when needed",
          ],
        },
      ],
    },
    benefits: {
      eyebrow: "Benefits",
      title: "What a clear strategy changes.",
      intro: "A good strategy reduces ambiguity and gives leadership teams a practical basis for action.",
      items: [
        { num: "01", title: "Direction", body: "Management and teams work from a shared picture of the future." },
        { num: "02", title: "Focus", body: "Resources are concentrated on priorities that matter." },
        { num: "03", title: "Decision quality", body: "Important decisions become easier to compare and justify." },
        { num: "04", title: "Resilience", body: "Scenarios and risks are considered before pressure increases." },
        { num: "05", title: "Alignment", body: "Owners, board and management can discuss the same strategic logic." },
        { num: "06", title: "Execution", body: "Strategy becomes initiatives, responsibilities and measurable progress." },
      ],
    },
    role: {
      eyebrow: "Our role",
      title: "The difference between strategy workshops and strategic clarity.",
      body:
        "We bring method, market perspective and implementation experience into the room so the result is not only aligned, but usable for real decisions.",
      situationsLabel: "Typical starting situations",
      situations: [
        {
          title: "Direction is unclear",
          body:
            "Growth, profitability, investments or succession questions are being discussed, but no shared strategic frame exists.",
        },
        {
          title: "Many options, little prioritization",
          body:
            "The company has opportunities, but too many initiatives compete for attention, budget and leadership capacity.",
        },
        {
          title: "Implementation stalls",
          body:
            "A strategy exists on paper, but responsibilities, governance and operational translation remain unclear.",
        },
      ],
    },
    cta: {
      eyebrow: "Next step",
      title: "Strategic clarity starts with an honest conversation.",
      body:
        "In a free 30-minute introductory conversation, we clarify the strategic question and whether an external perspective is useful.",
    },
  },
  {
    slug: "vertriebmarketing",
    title: "Sales & Marketing",
    subtitle: "Go-to-market",
    excerpt:
      "We help organizations develop sales structures, sharpen market development and improve how growth potential is converted into revenue.",
    heroTitle: "Sales without strategy is expensive noise.",
    heroBody:
      "When sales and marketing work against each other, target customers are unclear and processes depend on chance, revenue and market share are lost. We help you bring structure, focus and impact into your go-to-market work.",
    anchorLabel: "Growth levers",
    anchorId: "fields",
    split: {
      left: {
        eyebrow: "Function 1",
        title: "Sales",
        body:
          "Sales creates direct customer relationships, qualifies opportunities and closes business. Its impact depends on clear target segments, structured processes and focused resources.",
        tone: "light",
      },
      right: {
        eyebrow: "Function 2",
        title: "Marketing",
        body:
          "Marketing creates visibility, trust and demand. It positions the company, pre-qualifies prospects and gives sales the foundation for effective conversations.",
        tone: "dark",
      },
    },
    focus: {
      eyebrow: "Growth levers",
      title: "Seven levers for effective growth.",
      intro:
        "Sales and marketing create impact on several levels. We help you set the right priorities and implement them consistently.",
      items: [
        {
          num: "01",
          title: "Sales strategy & go-to-market",
          items: [
            "Identify market potential and set priorities",
            "Develop and sharpen the go-to-market model",
            "Define competitive positioning clearly",
          ],
        },
        {
          num: "02",
          title: "Sales structure & organization",
          items: [
            "Assign roles, responsibilities and territories clearly",
            "Connect inside and field sales effectively",
            "Build channel management and partner structures",
          ],
        },
        {
          num: "03",
          title: "Customer segmentation & targeting",
          items: [
            "Define and prioritize ideal customer profiles",
            "Evaluate segments by potential, fit and effort",
            "Focus acquisition on markets that can be won",
          ],
        },
        {
          num: "04",
          title: "Positioning & messaging",
          items: [
            "Formulate a clear value proposition for each segment",
            "Sharpen differentiation against competitors",
            "Ensure consistent communication across channels",
          ],
        },
        {
          num: "05",
          title: "Sales enablement & processes",
          items: [
            "Standardize and document sales processes",
            "Build materials, tools and arguments for the team",
            "Structure onboarding and development",
          ],
        },
        {
          num: "06",
          title: "Performance management & KPIs",
          items: [
            "Define relevant metrics across the funnel",
            "Make reporting and forecasting reliable",
            "Establish a leadership rhythm with data-based reviews",
          ],
        },
        {
          num: "07",
          title: "Digital sales & channels",
          items: [
            "Build digital acquisition and nurturing channels",
            "Use CRM as a strategic management instrument",
            "Apply marketing automation where it adds value",
          ],
        },
      ],
    },
    framework: {
      eyebrow: "Thinking frame",
      title: "From problem to solution: methodical and customer-oriented.",
      body:
        "Before measures are defined, understanding comes first. We work in the problem space before moving into the solution space. That prevents expensive answers to the wrong questions.",
      image: salesFrameworkImage,
      alt: "Design thinking process: problem space and solution space",
      cards: [
        {
          eyebrow: "Problem space",
          title: "Understand & observe",
          body:
            "Deeply understand customer needs, market dynamics and sales reality before designing solutions.",
        },
        {
          eyebrow: "Synthesis",
          title: "Recognize patterns",
          body:
            "Condense insights, formulate hypotheses and separate the real levers from symptoms.",
        },
        {
          eyebrow: "Solution space",
          title: "Develop & test",
          body:
            "Develop ideas in a structured way, prioritize and validate them in practice: iterative instead of all at once.",
        },
      ],
    },
    principle: {
      eyebrow: "Principle",
      quote:
        "Sales and marketing are not separate worlds. They are two sides of the same growth lever. Align them and you grow; separate them and you fight yourself.",
      label: "Abexis go-to-market principle",
    },
    process: {
      eyebrow: "Approach",
      countLabel: "04 phases",
      title: "From diagnosis to a high-performing sales organization: structured and measurable.",
      intro:
        "Every engagement begins with an honest assessment. Depending on the starting point, we work on focused levers or support a broader go-to-market setup.",
      phases: [
        {
          num: "01",
          title: "Analysis & diagnosis",
          items: [
            "Capture the current sales and marketing situation",
            "Analyze pipeline quality, conversion rates and contribution margins",
            "Identify bottlenecks, friction and blind spots",
            "Include customer perspective and competitive environment",
          ],
        },
        {
          num: "02",
          title: "Strategy & concept",
          items: [
            "Define target customers, value proposition and positioning",
            "Set go-to-market model and channel strategy",
            "Clarify organization structure and roles",
            "Agree measurable goals and milestones",
          ],
        },
        {
          num: "03",
          title: "Implementation",
          items: [
            "Build processes, tools and materials",
            "Enable the team and introduce leadership routines",
            "Launch pilots and capture first learnings",
            "Coordinate marketing and sales activities",
          ],
        },
        {
          num: "04",
          title: "Performance & optimization",
          items: [
            "Measure and interpret KPIs continuously",
            "Feed learnings back into the process",
            "Prepare scaling and activate growth levers",
          ],
        },
      ],
    },
    benefits: {
      eyebrow: "Benefits",
      title: "What professional sales and marketing create.",
      intro: "The effect is not only visible in revenue, but in how a company appears, grows and retains customers.",
      items: [
        { num: "01", title: "Revenue growth", body: "Clear strategy, better targeting and structured processes lead to more closed business." },
        { num: "02", title: "Efficiency", body: "Less scatter: the team focuses on the right customers with the right offer." },
        { num: "03", title: "Customer loyalty", body: "Consistent communication and true customer understanding strengthen loyalty." },
        { num: "04", title: "Market position", body: "Differentiated positioning makes you more visible and stronger in negotiations." },
        { num: "05", title: "Planning reliability", body: "Reliable pipeline data and forecasts support better resource and investment decisions." },
        { num: "06", title: "Scalability", body: "Documented processes and clear structures enable growth without losing quality." },
        { num: "07", title: "Team performance", body: "Clear roles, good tools and regular coaching increase motivation and win rates." },
        { num: "08", title: "Alignment", body: "Marketing and sales pull in the same direction: shared goals, shared language, shared impact." },
      ],
    },
    role: {
      eyebrow: "Our role",
      title: "The difference between activity and growth.",
      body:
        "Many companies have active sales teams and ongoing marketing measures, but growth still does not follow. We help identify the real levers and support implementation.",
      situationsLabel: "Typical starting situations",
      situations: [
        {
          title: "Stagnation despite activity",
          body:
            "The team is busy, but revenue is not growing. Targets are missed without a clear reason. Diagnosis and realignment are needed.",
        },
        {
          title: "Sales and marketing in silos",
          body:
            "Both functions work with different goals, language and metrics. That costs impact and energy that should be in the market.",
        },
        {
          title: "Growth without foundation",
          body:
            "Fast growth has outpaced structures. Processes, roles and steering need stabilization and scalable foundations.",
        },
      ],
    },
    cta: {
      eyebrow: "Next step",
      title: "More impact in the market starts with the right conversation.",
      body:
        "In a free 30-minute introductory conversation, we clarify where sales and marketing stand today and where the biggest levers are.",
    },
  },
  {
    slug: "veränderungsmanagement",
    title: "Organizational Change",
    subtitle: "Change management",
    excerpt:
      "We guide change initiatives with an iterative, people-conscious approach that keeps risks visible and implementation realistic.",
    heroTitle: "Change succeeds when people understand why it matters.",
    heroBody:
      "New structures, systems and processes only create impact when people can follow the direction and act differently. We help make change clear, manageable and credible.",
    anchorLabel: "Change levers",
    anchorId: "fields",
    split: {
      left: {
        eyebrow: "Dimension 1",
        title: "Organizational change",
        body:
          "Structures, responsibilities, processes and governance change. The organization needs a clear target picture and practical implementation logic.",
        tone: "light",
      },
      right: {
        eyebrow: "Dimension 2",
        title: "Human adoption",
        body:
          "People need orientation, involvement and visible leadership. Without adoption, even well-designed change remains theoretical.",
        tone: "dark",
      },
    },
    focus: {
      eyebrow: "Change levers",
      title: "Seven levers for change that lands.",
      intro:
        "Change management combines structure and people. We help make the impact visible and the implementation realistic.",
      items: [
        {
          num: "01",
          title: "Target picture & case for change",
          items: [
            "Clarify why change is needed",
            "Define the future state in language people understand",
            "Connect business goals with practical implications",
          ],
        },
        {
          num: "02",
          title: "Stakeholder alignment",
          items: [
            "Identify affected groups and decision makers",
            "Understand interests, risks and resistance",
            "Create alignment among sponsors and leadership",
          ],
        },
        {
          num: "03",
          title: "Impact analysis",
          items: [
            "Assess changes to roles, processes and behavior",
            "Prioritize critical adoption points",
            "Make hidden dependencies visible early",
          ],
        },
        {
          num: "04",
          title: "Communication",
          items: [
            "Develop clear messages and communication rhythms",
            "Address uncertainty directly",
            "Use feedback channels actively",
          ],
        },
        {
          num: "05",
          title: "Leadership routines",
          items: [
            "Enable managers to lead through ambiguity",
            "Define visible leadership actions",
            "Create routines for progress and escalation",
          ],
        },
        {
          num: "06",
          title: "Enablement & adoption",
          items: [
            "Build training, support and practical guidance",
            "Anchor new behaviors in daily work",
            "Measure adoption and adjust interventions",
          ],
        },
        {
          num: "07",
          title: "Stabilization",
          items: [
            "Secure momentum after go-live",
            "Resolve friction quickly",
            "Transfer ownership into the organization",
          ],
        },
      ],
    },
    principle: {
      eyebrow: "Principle",
      quote:
        "Change is not accepted because it is announced. It becomes real when direction, leadership and daily behavior point the same way.",
      label: "Abexis change principle",
    },
    process: {
      eyebrow: "Approach",
      countLabel: "04 phases",
      title: "From uncertainty to adoption: structured and human.",
      intro:
        "The process combines clear analysis with practical communication, leadership support and continuous adjustment.",
      phases: [
        {
          num: "01",
          title: "Clarify",
          items: [
            "Understand context, goals and constraints",
            "Map stakeholders and change impacts",
            "Identify adoption risks early",
          ],
        },
        {
          num: "02",
          title: "Align",
          items: [
            "Create leadership alignment",
            "Define messages, routines and responsibilities",
            "Prepare communication and enablement plan",
          ],
        },
        {
          num: "03",
          title: "Activate",
          items: [
            "Communicate in waves",
            "Support leaders and teams in concrete situations",
            "Track feedback, resistance and progress",
          ],
        },
        {
          num: "04",
          title: "Stabilize",
          items: [
            "Anchor new routines",
            "Resolve remaining friction",
            "Transfer ownership and measure adoption",
          ],
        },
      ],
    },
    benefits: {
      eyebrow: "Benefits",
      title: "What professional change management creates.",
      intro: "Good change work reduces friction and helps people move from understanding to action.",
      items: [
        { num: "01", title: "Orientation", body: "People understand what is changing, why, and what it means for them." },
        { num: "02", title: "Trust", body: "Transparent communication reduces uncertainty and rumors." },
        { num: "03", title: "Leadership impact", body: "Managers know how to lead the change in daily work." },
        { num: "04", title: "Adoption", body: "New processes, tools and roles are actually used." },
        { num: "05", title: "Risk visibility", body: "Resistance, dependencies and overload become visible earlier." },
        { num: "06", title: "Momentum", body: "The organization keeps moving instead of waiting for perfect certainty." },
      ],
    },
    role: {
      eyebrow: "Our role",
      title: "The difference between imposed and supported change.",
      body:
        "Changes rarely fail because of the idea. They fail in implementation. We bring methodology, external perspective and experience from many transformations.",
      situationsLabel: "Typical starting situations",
      situations: [
        {
          title: "Transformation is at risk",
          body:
            "A running initiative faces resistance, delays or fading support. It needs an honest diagnosis and targeted countermeasures.",
        },
        {
          title: "Missing internal change competence",
          body:
            "The company faces a major change, but lacks the experience, method or capacity to guide it professionally.",
        },
        {
          title: "Complex stakeholder landscape",
          body:
            "Different groups pull in different directions. Neutral external support creates credibility and alignment.",
        },
      ],
    },
    cta: {
      eyebrow: "Next step",
      title: "Change succeeds when it is well guided.",
      body:
        "In a free 30-minute introductory conversation, we clarify where your organization stands, what change is ahead and how we can support it.",
    },
  },
  {
    slug: "prozessoptimierung",
    title: "Process Optimization",
    subtitle: "Operational excellence",
    excerpt:
      "We analyze processes, costs and automation potential to improve efficiency, quality and transparency across the organization.",
    heroTitle: "Processes show where strategy becomes reality.",
    heroBody:
      "Inefficient processes cost time, quality and management attention every day. We help you identify the real bottlenecks, reduce complexity and create processes that can be steered.",
    anchorLabel: "Optimization levers",
    anchorId: "fields",
    split: {
      left: {
        eyebrow: "Perspective 1",
        title: "Efficiency",
        body:
          "Efficiency means using resources deliberately: fewer unnecessary steps, clearer handovers and better use of systems and data.",
        tone: "light",
      },
      right: {
        eyebrow: "Perspective 2",
        title: "Effectiveness",
        body:
          "Effectiveness means the process creates the intended result: quality, transparency and customer value, not just speed.",
        tone: "dark",
      },
    },
    focus: {
      eyebrow: "Optimization levers",
      title: "Seven levers for better processes.",
      intro:
        "Optimization is not paperwork. It is the disciplined search for what slows decisions, handovers, quality and cost.",
      items: [
        {
          num: "01",
          title: "Process transparency",
          items: [
            "Map core processes and interfaces",
            "Identify ownership and decision points",
            "Make dependencies and bottlenecks visible",
          ],
        },
        {
          num: "02",
          title: "Cost and effort drivers",
          items: [
            "Analyze where time and cost are created",
            "Separate value-adding work from waste",
            "Prioritize improvement areas by impact",
          ],
        },
        {
          num: "03",
          title: "Quality and control points",
          items: [
            "Clarify quality requirements and control logic",
            "Reduce rework and errors",
            "Build meaningful management checkpoints",
          ],
        },
        {
          num: "04",
          title: "Automation potential",
          items: [
            "Identify repetitive and rule-based work",
            "Assess tool and data readiness",
            "Implement automation where it creates measurable value",
          ],
        },
        {
          num: "05",
          title: "Roles and responsibilities",
          items: [
            "Clarify process ownership",
            "Define decision rights and escalation paths",
            "Align responsibilities across departments",
          ],
        },
        {
          num: "06",
          title: "Systems and data",
          items: [
            "Check system breaks and data quality",
            "Improve information flows",
            "Connect process logic with reporting needs",
          ],
        },
        {
          num: "07",
          title: "Continuous improvement",
          items: [
            "Create routines for review and adjustment",
            "Measure process performance",
            "Anchor improvements in daily management",
          ],
        },
      ],
    },
    principle: {
      eyebrow: "Principle",
      quote:
        "A good process is not the most detailed one. It is the one that makes the right work easier, the wrong work visible and decisions faster.",
      label: "Abexis process principle",
    },
    process: {
      eyebrow: "Approach",
      countLabel: "04 phases",
      title: "From process reality to measurable improvement.",
      intro:
        "We combine analysis, prioritization and implementation so improvements do not stay on workshop walls.",
      phases: [
        {
          num: "01",
          title: "Capture",
          items: [
            "Document the actual process, not only the target version",
            "Collect data, observations and stakeholder input",
            "Identify pain points and handover issues",
          ],
        },
        {
          num: "02",
          title: "Analyze",
          items: [
            "Assess cost, quality, time and risk drivers",
            "Identify automation and simplification potential",
            "Prioritize improvement options",
          ],
        },
        {
          num: "03",
          title: "Design",
          items: [
            "Define target process and control points",
            "Clarify ownership, roles and system needs",
            "Create an implementation roadmap",
          ],
        },
        {
          num: "04",
          title: "Implement",
          items: [
            "Pilot improvements",
            "Train teams and adjust routines",
            "Measure impact and stabilize the new process",
          ],
        },
      ],
    },
    benefits: {
      eyebrow: "Benefits",
      title: "What better processes create.",
      intro: "The value shows in lower friction, better quality and more transparent management.",
      items: [
        { num: "01", title: "Efficiency", body: "Less duplicated work, fewer delays and better use of resources." },
        { num: "02", title: "Quality", body: "Clear handovers and control points reduce errors and rework." },
        { num: "03", title: "Transparency", body: "Management sees where work stands and where decisions are needed." },
        { num: "04", title: "Cost control", body: "Cost drivers become visible and can be actively addressed." },
        { num: "05", title: "Scalability", body: "Processes support growth instead of becoming a bottleneck." },
        { num: "06", title: "Automation readiness", body: "Automation is based on clear logic and usable data." },
      ],
    },
    role: {
      eyebrow: "Our role",
      title: "The difference between process documentation and process improvement.",
      body:
        "We do not optimize for diagrams. We identify where decisions, handovers, systems or incentives slow the business down and turn that into practical improvements.",
      situationsLabel: "Typical starting situations",
      situations: [
        {
          title: "Costs are too high",
          body:
            "Processes have grown over time and now create avoidable effort, rework and coordination cost.",
        },
        {
          title: "Responsibilities are unclear",
          body:
            "Work crosses departments, but ownership, decision rights and escalation paths are not clear enough.",
        },
        {
          title: "Automation should start",
          body:
            "The organization wants to automate, but first needs clear process logic, clean data and realistic priorities.",
        },
      ],
    },
    cta: {
      eyebrow: "Next step",
      title: "Better processes start with seeing reality clearly.",
      body:
        "In a free 30-minute introductory conversation, we clarify which processes create friction and where a focused improvement effort would help.",
    },
  },
  {
    slug: "projektmanagement",
    title: "Project Management",
    subtitle: "Execution",
    excerpt:
      "We support project execution, project assessments and recovery situations with experienced, methodical and business-oriented leadership.",
    heroTitle: "Projects rarely fail because of the idea. They fail because of leadership.",
    heroBody:
      "Unclear goals, missing resources, weak governance and late escalation cost companies time and money every day. We bring expertise, method and experience so projects deliver what they promise.",
    anchorLabel: "Project levers",
    anchorId: "fields",
    split: {
      left: {
        eyebrow: "Mode 1",
        title: "Project leadership",
        body:
          "Clear goals, governance, roles and decisions keep a project moving. Leadership gives structure and turns complexity into manageable work.",
        tone: "light",
      },
      right: {
        eyebrow: "Mode 2",
        title: "Project recovery",
        body:
          "When projects drift, an independent view helps separate symptoms from causes and creates a basis for stabilization or reset.",
        tone: "dark",
      },
    },
    focus: {
      eyebrow: "Project levers",
      title: "Seven levers for reliable delivery.",
      intro:
        "Good project management combines clear structure with business judgement, communication and the courage to escalate early.",
      items: [
        {
          num: "01",
          title: "Project setup & governance",
          items: [
            "Define mandate, scope and success criteria",
            "Establish governance and decision paths",
            "Clarify roles, responsibilities and authority",
          ],
        },
        {
          num: "02",
          title: "Planning & structure",
          items: [
            "Develop a realistic project plan with milestones",
            "Plan dependencies, critical path and buffers",
            "Secure and align resource needs early",
          ],
        },
        {
          num: "03",
          title: "Stakeholder management",
          items: [
            "Map project participants and affected groups",
            "Design communication by stakeholder group",
            "Manage expectations actively, not just passively",
          ],
        },
        {
          num: "04",
          title: "Risk management",
          items: [
            "Identify, assess and prioritize risks early",
            "Define actions and escalation paths",
            "Review and communicate risk status regularly",
          ],
        },
        {
          num: "05",
          title: "Steering & reporting",
          items: [
            "Measure progress regularly and transparently",
            "Identify deviations early and counteract them",
            "Prepare decision inputs clearly and concisely",
          ],
        },
        {
          num: "06",
          title: "Project assessments",
          items: [
            "Independently assess running or stopped projects",
            "Analyze causes of delay, cost overrun or quality issues",
            "Recommend realignment, recovery or termination",
          ],
        },
        {
          num: "07",
          title: "Methodology & agility",
          items: [
            "Use classic and agile methods situationally",
            "Develop hybrid models for complex projects",
            "Transfer and anchor method knowledge in the team",
          ],
        },
      ],
    },
    principle: {
      eyebrow: "Principle",
      quote:
        "A project is not controlled by reporting. It is controlled by clear decisions, visible risks and disciplined leadership.",
      label: "Abexis project principle",
    },
    process: {
      eyebrow: "Approach",
      countLabel: "04 phases",
      title: "From initialization to transfer: clear, pragmatic, controlled.",
      intro:
        "We support projects where structure, governance or leadership capacity is missing, and where progress has to become visible again.",
      phases: [
        {
          num: "01",
          title: "Initialization",
          items: [
            "Clarify mandate and objectives",
            "Identify and involve stakeholders",
            "Align resources, budget and timeframe",
            "Set up governance and communication structure",
          ],
        },
        {
          num: "02",
          title: "Planning",
          items: [
            "Plan scope, time, cost and quality",
            "Identify risks and plan measures",
            "Assign responsibilities and deliverables",
            "Approve and communicate the baseline plan",
          ],
        },
        {
          num: "03",
          title: "Execution & steering",
          items: [
            "Coordinate implementation and monitor progress",
            "Identify deviations and intervene early",
            "Inform stakeholders regularly",
            "Manage changes in a structured way",
          ],
        },
        {
          num: "04",
          title: "Closure & transfer",
          items: [
            "Accept and hand over project results",
            "Document and share lessons learned",
            "Close the project organization cleanly",
          ],
        },
      ],
    },
    benefits: {
      eyebrow: "Benefits",
      title: "What professional project management creates.",
      intro: "The value is visible in delivery, transparency, cost control and confidence among stakeholders.",
      items: [
        { num: "01", title: "Goal achievement", body: "Professionally led projects are more likely to deliver on time and within budget." },
        { num: "02", title: "Cost control", body: "Early detection of deviations prevents expensive escalations and rework." },
        { num: "03", title: "Transparency", body: "Clear reporting builds trust and enables better decisions." },
        { num: "04", title: "Risk control", body: "Structured risk management reduces surprises and preserves room to act." },
        { num: "05", title: "Team performance", body: "Clear roles, coordination and feedback improve motivation and delivery quality." },
        { num: "06", title: "Resource efficiency", body: "Planned and steered projects use resources more deliberately." },
        { num: "07", title: "Organizational learning", body: "Lessons learned strengthen internal competence for future projects." },
        { num: "08", title: "Stakeholder trust", body: "Professional project leadership strengthens credibility internally and externally." },
      ],
    },
    role: {
      eyebrow: "Our role",
      title: "The difference between administration and project leadership.",
      body:
        "We do not only maintain plans. We create clarity on goals, governance, risks and decisions, and we bring senior judgement into critical project moments.",
      situationsLabel: "Typical starting situations",
      situations: [
        {
          title: "Project loses direction",
          body:
            "Goals, scope or priorities have shifted and the project team no longer works from one shared picture.",
        },
        {
          title: "Escalations come too late",
          body:
            "Risks are known, but not translated into decisions quickly enough. Time and trust are being lost.",
        },
        {
          title: "Recovery is needed",
          body:
            "A project has stopped, overrun or lost support. An independent assessment creates the basis for the next decision.",
        },
      ],
    },
    cta: {
      eyebrow: "Next step",
      title: "Project clarity starts before the next escalation.",
      body:
        "In a free 30-minute introductory conversation, we clarify where the project stands and whether leadership, assessment or recovery support is useful.",
    },
  },
];

export function getEnglishFocusPage(slug: string): EnglishFocusPage | undefined {
  return englishFocusPages.find((page) => page.slug === decodeFocusSlug(slug));
}

function decodeFocusSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}
