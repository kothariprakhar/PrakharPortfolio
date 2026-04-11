export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "#contact" },
] as const;

export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/in/prakhar-kothari-sde/",
  github: "https://github.com/kothariprakhar",
  email: "prakhar.kothari@kellogg.northwestern.edu",
} as const;

export const HERO_ROLES = [
  "Product Manager",
  "AI Engineer",
  "Technical Leader",
  "Builder",
] as const;

export const STATS = [
  { value: "0.3", suffix: "%", label: "Top percentile — Indian Civil Services", prefix: "Top " },
  { value: "3.89", suffix: "", label: "GPA at Kellogg (Dean's List)", prefix: "" },
  { value: "3", suffix: "+", label: "Products launched to scale", prefix: "" },
  { value: "7", suffix: "+", label: "Organizations consulted", prefix: "" },
] as const;

export const JOURNEY = [
  {
    id: "iit",
    icon: "Cpu",
    title: "From Circuits to Code",
    description:
      "Started with Electrical Engineering at IIT Patna, where I discovered the power of software to scale impact. Built a foundation in systems thinking that shapes my product instincts today.",
  },
  {
    id: "startup",
    icon: "Rocket",
    title: "Building from Zero",
    description:
      "Co-founded Club Khel, an EdTech venture at Imperial College London. Led 100+ user interviews, built the product from scratch, and piloted across 10+ schools reaching 700 students.",
  },
  {
    id: "enterprise",
    icon: "Building2",
    title: "Scaling AI Products",
    description:
      "At Leena AI, transitioned from engineer to PM. Launched an Employee Engagement product to $5M ARR in 10 months, owned the HR virtual assistant roadmap, and partnered with Fortune 500 clients.",
  },
  {
    id: "kellogg",
    icon: "GraduationCap",
    title: "The Next Chapter",
    description:
      "Pursuing a joint MBA + AI degree at Kellogg and McCormick, Northwestern. Combining business strategy with deep technical AI skills to build products that matter.",
  },
] as const;

export const EXPERIENCE = [
  {
    id: "kellogg",
    role: "MBA + AI Joint Degree Candidate",
    company: "Kellogg School of Management | McCormick School of Engineering, Northwestern University",
    companyShort: "Northwestern University",
    period: "2025 – Present",
    location: "Evanston, IL",
    summary:
      "Pursuing joint MBA and AI degree with a 3.89 GPA (Dean's List). Coursework in Strategy, Applied AI, Deep Learning, and Data-Intensive Systems.",
    details: [
      "Coursework: Strategy, Marketing, Applied AI for Business, Data-Intensive Systems, Deep Learning",
      "Active member of Kellogg Technology Club, AI Club, Social Impact and Sustainability Club",
    ],
    technologies: ["Deep Learning", "NLP", "Strategy", "Product Management"],
    type: "education" as const,
  },
  {
    id: "consultant",
    role: "Product Management Consultant",
    company: "Independent Consultant",
    companyShort: "Independent",
    period: "May 2023 – May 2025",
    location: "India & UK",
    summary:
      "Collaborated with 7+ organizations on AI-powered product strategy, procurement automation, and fintech features.",
    details: [
      "Led 30+ stakeholder interviews for AI procurement automation on a $3B manufacturing marketplace",
      "Built business case for multimodal AI engine-based buyer-vendor matching with B-Rep Transformer based 3D CAD parsing",
      "Reduced procurement cycle time by 32%, unlocking $80M+ in efficiency gains",
      "Architected smart salary allocation feature for $4.5B digital bank, increasing MAU by 22% in first quarter",
    ],
    technologies: ["AI/ML", "Product Strategy", "3D CAD Parsing", "Fintech"],
    type: "work" as const,
  },
  {
    id: "clubkhel",
    role: "Founding Member | Head of Product & Lead Developer",
    company: "Club Khel — EdTech Venture (Imperial College London)",
    companyShort: "Club Khel",
    period: "Jan 2023 – May 2025",
    location: "London, UK",
    summary:
      "Co-founded a play-based learning platform. Led product strategy, development, and pilot across 10+ schools.",
    details: [
      "Led market research and 100+ user interviews to define product strategy",
      "Built play-based learning platform with peer networks and personalized progress tracking",
      "Piloted across 10+ primary schools (700 students), achieving 45% DAU/MAU and 35% improvement in math proficiency",
    ],
    technologies: ["React", "Node.js", "EdTech", "User Research"],
    type: "work" as const,
  },
  {
    id: "leenaai",
    role: "Product Manager (transitioned from Senior Software Developer)",
    company: "Leena AI — Series B, Bessemer-backed HR-Tech Startup",
    companyShort: "Leena AI",
    period: "Jan 2021 – Oct 2022",
    location: "Gurugram, India",
    summary:
      "Led flagship products from 0→1 and 1→N, scaling to $5M ARR and 90+ enterprise clients globally.",
    details: [
      "Led Employee Engagement product from conception to $5M ARR in 10 months across 90+ enterprises",
      "Owned HR virtual assistant v2.0 roadmap, shipping 25+ features for $3M new annual revenue and 1.5M users",
      "Partnered with 4 Fortune 500 clients on NLP-based attrition prediction tool, projecting $15M in savings",
      "Prototyped onboarding flows that cut completion time by 48%",
      "Architected microservices for 250% user growth; reduced API response times by 40%, 99.9% uptime",
      "Built enterprise component library of 150+ reusable components, accelerating development by 60%",
    ],
    technologies: ["NLP", "Python", "React", "Microservices", "AWS", "Product Strategy"],
    type: "work" as const,
  },
  {
    id: "unacademy",
    role: "Software Developer",
    company: "Unacademy — Series H EdTech ($3.44B valuation)",
    companyShort: "Unacademy",
    period: "Dec 2018 – Dec 2020",
    location: "Bengaluru, India",
    summary:
      "Full-stack development supporting growth from 40K to 500K subscribers. Built analytics features driving 120% engagement increase.",
    details: [
      "Developed end-to-end features across authentication, content, onboarding, and payments",
      "Automated CI/CD pipelines supporting 12x subscriber growth in 6 months",
      "Built progress analytics dashboard increasing student engagement by 120%",
    ],
    technologies: ["TypeScript", "React", "CI/CD", "Analytics", "Full-Stack"],
    type: "work" as const,
  },
] as const;

export const PROJECTS = [
  {
    id: "ai-procurement",
    title: "AI-Powered Procurement Automation",
    subtitle: "Multimodal AI for $3B Manufacturing Marketplace",
    type: "AI" as const,
    description:
      "Led product strategy for an AI engine that automates buyer-vendor matching using 3D CAD parsing and multimodal transformers.",
    problem: "Procurement cycles were slow and manual, costing the marketplace millions in inefficiency.",
    approach: "Led stakeholder interviews, built the business case, and prioritized a B-Rep Transformer based approach for 3D CAD analysis.",
    outcome: "32% reduction in cycle time, $80M+ in projected efficiency gains.",
    technologies: ["AI/ML", "Computer Vision", "3D CAD", "Product Strategy"],
    featured: true,
    caseStudy: {
      heroMetrics: [
        { value: "32%", label: "Cycle Time Reduction" },
        { value: "$80M+", label: "Projected Savings" },
        { value: "$3B", label: "Marketplace Volume" },
      ],
      sections: [
        {
          heading: "Context",
          content: "A leading manufacturing marketplace processing $3B+ in annual transactions relied on manual procurement workflows. Buyers uploaded 3D CAD files and specifications, then human operators manually matched them with vendors — a process taking days per RFQ and costing the platform millions in operational overhead.",
        },
        {
          heading: "The Problem",
          content: "The manual buyer-vendor matching process was the single largest bottleneck in the procurement pipeline. With thousands of RFQs per month and a growing vendor network, the platform couldn't scale without fundamentally rethinking how parts were analyzed and matched. Key pain points included: inconsistent matching quality across operators, 3-5 day average cycle time per RFQ, and inability to leverage the rich geometric data embedded in CAD files.",
        },
        {
          heading: "Discovery & Research",
          content: "I led 30+ stakeholder interviews across procurement teams, engineering managers, and vendor partners to map the end-to-end workflow. The critical insight was that 80% of matching decisions could be predicted from CAD geometry + historical transaction data alone. I conducted a competitive analysis of existing solutions and identified that no platform was using 3D geometry understanding at the feature extraction level — everyone was relying on text metadata.",
          bullets: [
            "30+ stakeholder interviews across buyers, vendors, and internal ops",
            "Mapped 47 decision variables in the manual matching workflow",
            "Identified 3D geometry as the untapped data source for automated matching",
            "Evaluated 5 technical approaches with the ML engineering team",
          ],
        },
        {
          heading: "Solution",
          content: "I built the business case and product strategy for a multimodal AI engine that combines B-Rep Transformer-based 3D CAD parsing with historical transaction data to automate buyer-vendor matching. The system extracts manufacturing features (tolerances, materials, complexity) directly from CAD geometry, then matches against vendor capabilities using a learned similarity model. I authored the PRD, defined success metrics, and managed the phased rollout starting with the highest-volume part categories.",
        },
        {
          heading: "Results & Impact",
          content: "The AI engine reduced procurement cycle time by 32% in the pilot cohort and projected $80M+ in efficiency gains at full scale. Matching accuracy exceeded human operators by 15% on standardized part categories. The system now processes the majority of incoming RFQs with minimal human review, freeing the operations team to focus on complex, non-standard requests.",
          metrics: [
            { value: "32%", label: "Reduction in procurement cycle time" },
            { value: "$80M+", label: "Projected annual efficiency gains" },
            { value: "15%", label: "Improvement in matching accuracy vs. manual" },
            { value: "3→1 day", label: "Average RFQ turnaround" },
          ],
        },
        {
          heading: "Key Learnings",
          content: "The biggest lesson was that domain expertise matters more than model architecture. The breakthrough came from understanding how procurement engineers think about parts — not from a better transformer. Spending weeks on stakeholder interviews before writing a single spec saved months of engineering rework.",
          bullets: [
            "Domain depth > model sophistication for enterprise AI products",
            "Phased rollout by part category reduced risk and built internal confidence",
            "Defining clear fallback to human review was critical for stakeholder buy-in",
          ],
        },
      ],
    },
  },
  {
    id: "hr-virtual-assistant",
    title: "HR Virtual Assistant v2.0",
    subtitle: "Enterprise NLP-Powered Employee Experience",
    type: "Product" as const,
    description:
      "Owned the roadmap for an AI-powered HR chatbot serving 1.5M+ users across 90+ enterprises globally.",
    problem: "Enterprise HR teams were overwhelmed with repetitive employee queries.",
    approach: "Managed a 10-member cross-functional team, authored PRDs, and shipped 25+ features iteratively.",
    outcome: "$3M new annual revenue, 1.5M new users, adopted across North America, Europe, and Asia.",
    technologies: ["NLP", "Python", "React", "AWS", "Enterprise SaaS"],
    featured: true,
    caseStudy: {
      heroMetrics: [
        { value: "1.5M", label: "Users Served" },
        { value: "$3M", label: "New Annual Revenue" },
        { value: "25+", label: "Features Shipped" },
      ],
      sections: [
        {
          heading: "Context",
          content: "Leena AI's flagship product was an AI-powered HR virtual assistant deployed across 90+ enterprise clients globally. The v1.0 product handled basic HR queries but had limited understanding of complex, multi-turn conversations and lacked the enterprise-grade features needed by Fortune 500 clients.",
        },
        {
          heading: "The Problem",
          content: "Enterprise HR departments were drowning in repetitive queries — leave policies, benefits enrollment, payroll questions — consuming 40-60% of HR team bandwidth. While v1.0 addressed basic FAQ-style queries, customers demanded more: multi-turn conversations, policy-aware responses tailored to their organization, and integrations with their HRIS systems. Churn risk was rising as competitors caught up on basic chatbot features.",
        },
        {
          heading: "Discovery & Research",
          content: "I partnered with 4 Fortune 500 clients to deeply understand their pain points. The key finding: it wasn't just about answering questions — it was about understanding context. An employee asking about 'leave' at 3 PM on a Friday has a different intent than one asking at 9 AM on a Monday. I mapped 200+ intent patterns across client organizations and identified the top 25 features that would cover 80% of unresolved queries.",
          bullets: [
            "Partnered with 4 Fortune 500 clients for deep discovery",
            "Mapped 200+ intent patterns across organizations",
            "Identified context-aware responses as the key differentiator",
            "Prioritized 25 features using RICE scoring framework",
          ],
        },
        {
          heading: "Solution",
          content: "I managed a 10-member cross-functional team (NLP engineers, frontend, backend, QA) to rebuild the conversational AI pipeline. Key architectural decisions included moving from rule-based to transformer-based intent classification, adding organization-specific policy embedding, and building a self-service admin portal for HR teams to customize responses without engineering support. I authored PRDs for each feature wave, ran weekly sprint planning, and personally demoed progress to C-suite stakeholders at client organizations.",
        },
        {
          heading: "Results & Impact",
          content: "The v2.0 launch drove $3M in new annual revenue and expanded the user base to 1.5M across North America, Europe, and Asia. Resolution rates improved from 60% to 85%, and the self-service admin portal reduced implementation time from 6 weeks to 2 weeks.",
          metrics: [
            { value: "$3M", label: "New annual recurring revenue" },
            { value: "1.5M", label: "Active users globally" },
            { value: "85%", label: "Query resolution rate (up from 60%)" },
            { value: "6→2 wk", label: "Implementation time reduction" },
          ],
        },
        {
          heading: "Key Learnings",
          content: "Building for enterprises taught me that the product is only 50% of the value — the other 50% is the implementation and ongoing customization experience. The self-service admin portal drove more expansion revenue than any individual chatbot feature.",
          bullets: [
            "Enterprise products need implementation excellence, not just features",
            "Self-service customization tools > professional services at scale",
            "Weekly stakeholder demos built trust and prevented scope creep",
          ],
        },
      ],
    },
  },
  {
    id: "employee-engagement",
    title: "Employee Engagement & Surveys Platform",
    subtitle: "0 → $5M ARR in 10 months",
    type: "Product" as const,
    description:
      "Led the full product lifecycle from conception to launch and scale of an enterprise engagement platform.",
    problem: "Organizations lacked real-time insight into employee sentiment and engagement drivers.",
    approach: "Drove customer discovery, competitive analysis, roadmap definition, and go-to-market strategy.",
    outcome: "$5M ARR in 10 months, adopted by 90+ enterprises globally.",
    technologies: ["Product Strategy", "Analytics", "Enterprise SaaS"],
    featured: false,
    caseStudy: {
      heroMetrics: [
        { value: "$5M", label: "ARR in 10 Months" },
        { value: "90+", label: "Enterprise Clients" },
        { value: "0→1", label: "Built from Scratch" },
      ],
      sections: [
        {
          heading: "Context",
          content: "Leena AI had established product-market fit with its HR virtual assistant but needed a second growth vector. Employee engagement and pulse surveys represented a $2B+ market with incumbent players like Culture Amp and Glint, but none were integrated with an AI assistant that could act on survey insights in real-time.",
        },
        {
          heading: "The Problem",
          content: "Organizations invested heavily in annual engagement surveys but struggled to translate results into action. Survey fatigue was high (30-40% response rates), insights arrived months late, and there was no closed-loop system to address individual employee concerns. The market opportunity was clear: an engagement platform that combined real-time pulse surveys with AI-driven action recommendations.",
        },
        {
          heading: "Discovery & Research",
          content: "I led the 0→1 initiative: customer discovery interviews with 20+ CHROs, competitive teardowns of 6 incumbents, and collaboration with data science to prototype an NLP-based attrition prediction model. The unique differentiator: integrating survey insights directly into the virtual assistant, so employees could surface concerns conversationally, and HR teams could see aggregated sentiment in real-time.",
          bullets: [
            "20+ CHRO interviews across industries",
            "Competitive teardown of Culture Amp, Glint, Peakon, Lattice, 15Five, Officevibe",
            "Prototyped NLP-based attrition prediction with Fortune 500 partner",
            "Defined 3-phase roadmap: Launch → Grow → Differentiate",
          ],
        },
        {
          heading: "Solution",
          content: "I defined the product vision, authored the roadmap, and managed execution across engineering, design, and go-to-market teams. The platform featured customizable pulse surveys, real-time sentiment dashboards, manager action plans, and integration with the existing virtual assistant for conversational check-ins. I personally led the sales engineering process for the first 10 enterprise deals.",
        },
        {
          heading: "Results & Impact",
          content: "The platform reached $5M ARR within 10 months of launch, adopted by 90+ enterprises. Response rates averaged 72% — nearly double the industry benchmark — driven by the conversational survey format via the virtual assistant.",
          metrics: [
            { value: "$5M", label: "ARR achieved in 10 months" },
            { value: "90+", label: "Enterprise clients onboarded" },
            { value: "72%", label: "Survey response rate (vs. 35% industry avg)" },
            { value: "$15M", label: "Projected savings from attrition prediction" },
          ],
        },
        {
          heading: "Key Learnings",
          content: "The fastest path to PMF for a second product is leveraging distribution from the first. Our existing virtual assistant install base gave us warm leads and a unique integration story that pure-play engagement tools couldn't match.",
          bullets: [
            "Second products win when they leverage first-product distribution",
            "Conversational survey format was the key differentiator, not analytics depth",
            "Sales engineering involvement in first 10 deals built critical feedback loop",
          ],
        },
      ],
    },
  },
  {
    id: "play-based-learning",
    title: "Play-Based Learning Platform",
    subtitle: "EdTech Venture at Imperial College London",
    type: "Engineering" as const,
    description:
      "Co-founded and built a platform combining sports and academics for primary school learning.",
    problem: "Traditional teaching methods failed to engage young students in STEM subjects.",
    approach: "100+ user interviews, built MVP with peer learning networks and progress tracking, piloted in 10+ schools.",
    outcome: "45% DAU/MAU ratio, 35% improvement in math proficiency across 700 students.",
    technologies: ["React", "Node.js", "EdTech", "User Research"],
    featured: false,
    caseStudy: {
      heroMetrics: [
        { value: "45%", label: "DAU/MAU Ratio" },
        { value: "35%", label: "Math Proficiency Gain" },
        { value: "700", label: "Students Reached" },
      ],
      sections: [
        {
          heading: "Context",
          content: "Club Khel was born at Imperial College London's entrepreneurship program from a simple observation: primary school students in underserved communities learn better through play than through lectures. We set out to build a platform that integrates physical activity with academic learning, starting with mathematics.",
        },
        {
          heading: "The Problem",
          content: "In the UK and India, primary school students — especially in underserved communities — were disengaged from traditional STEM instruction. Dropout rates in math were rising, and teachers lacked tools to make learning experiential. Existing EdTech solutions focused on screen-based gamification, which didn't address the physical engagement gap.",
        },
        {
          heading: "Discovery & Research",
          content: "As Head of Product, I led 100+ interviews with teachers, parents, students, and education researchers across 15 schools. The key insight: children who participated in structured play-based activities showed 2-3x better knowledge retention versus passive learning. The challenge was designing a platform that teachers could adopt without additional training.",
          bullets: [
            "100+ user interviews across teachers, parents, and students",
            "Observed 30+ classroom sessions to understand engagement patterns",
            "Partnered with education researchers at Imperial College",
            "Identified teacher adoption (not student engagement) as the critical risk",
          ],
        },
        {
          heading: "Solution",
          content: "I led product strategy and development: a web platform with play-based lesson plans mapped to the national curriculum, peer learning networks where students collaborate on challenges, and personalized progress tracking for teachers. The technical stack was React + Node.js with real-time collaboration features. I designed the UX to require zero training — teachers could run a session within 5 minutes of first login.",
        },
        {
          heading: "Results & Impact",
          content: "We piloted across 10+ primary schools, reaching 700 students. The platform achieved a 45% DAU/MAU ratio — exceptional for EdTech — and students showed a 35% improvement in math proficiency scores over one academic term. Teachers reported saving 3+ hours per week on lesson planning.",
          metrics: [
            { value: "45%", label: "DAU/MAU ratio (vs. 15% EdTech avg)" },
            { value: "35%", label: "Improvement in math proficiency" },
            { value: "700", label: "Students across 10+ schools" },
            { value: "3+ hrs", label: "Weekly teacher time saved" },
          ],
        },
        {
          heading: "Key Learnings",
          content: "Building for education taught me the importance of designing for the buyer (teacher/admin), not just the user (student). The simplest product wins when your users are time-constrained professionals. Every feature that added setup complexity was a barrier to adoption.",
          bullets: [
            "Design for the buyer (teacher), not just the end user (student)",
            "Zero-training-required UX was the single biggest adoption driver",
            "Physical + digital hybrid experiences create deeper engagement than either alone",
          ],
        },
      ],
    },
  },
];

export const SKILLS = {
  "Product Management": [
    { name: "Product Strategy", icon: "Target" },
    { name: "User Research", icon: "Users" },
    { name: "A/B Testing", icon: "FlaskConical" },
    { name: "Roadmapping", icon: "Map" },
    { name: "PRDs & Specs", icon: "FileText" },
    { name: "Go-to-Market", icon: "Megaphone" },
    { name: "Agile / Scrum", icon: "IterationCw" },
    { name: "Stakeholder Mgmt", icon: "Handshake" },
  ],
  "AI / ML": [
    { name: "RAG Systems", icon: "Database" },
    { name: "NLP", icon: "MessageSquare" },
    { name: "Computer Vision", icon: "Eye" },
    { name: "LLM Prompting", icon: "Sparkles" },
    { name: "Deep Learning", icon: "Brain" },
    { name: "Data Analysis", icon: "BarChart3" },
  ],
  Engineering: [
    { name: "Python", icon: "Code" },
    { name: "TypeScript", icon: "Code" },
    { name: "React / Next.js", icon: "Code" },
    { name: "Node.js", icon: "Server" },
    { name: "SQL", icon: "Database" },
    { name: "Docker", icon: "Container" },
    { name: "AWS", icon: "Cloud" },
    { name: "REST APIs", icon: "Plug" },
  ],
  "Tools & Platforms": [
    { name: "Figma", icon: "Palette" },
    { name: "Jira", icon: "KanbanSquare" },
    { name: "Notion", icon: "BookOpen" },
    { name: "Mixpanel", icon: "BarChart3" },
    { name: "Tableau", icon: "PieChart" },
    { name: "Git", icon: "GitBranch" },
  ],
} as const;
