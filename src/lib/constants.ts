export const NAV_LINKS = [
  { label: "Work", href: "#projects" },
  { label: "Writing", href: "/blog" },
  { label: "About", href: "#about" },
] as const;

export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/in/prakhar--kothari/",
  github: "https://github.com/kothariprakhar",
  email: "kothariprakhar@gmail.com",
  resume: "/resume.pdf",
} as const;

export const STATS = [
  { value: "5", suffix: "M", label: "ARR we steered from 0 in 10 months", prefix: "$" },
  { value: "1.5", suffix: "M", label: "people using AI we had a hand in shipping", prefix: "" },
  { value: "100+", suffix: "", label: "user interviews before any PRD we write", prefix: "" },
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
      "Electives: Deep Learning, Applied AI for Business, Data-Intensive Systems, AI Agents, Strategy, Tech Product Management",
      "Projects: Built AI products including a codebase intelligence platform, an API batching engine to cut costs, a multi-agent research pipeline leveraging A2A protocol and harness, internal AI tooling, and LLM-based applications — deepening expertise in prompt engineering, context management, agent orchestration, model evaluation, AI workflows, and developer tools",
      "Active member of Kellogg Technology Club, AI Club, Social Impact and Sustainability Club",
    ],
    technologies: ["Deep Learning", "NLP", "Agent Orchestration", "Strategy", "Product Management"],
    type: "education" as const,
  },
  {
    id: "consultant",
    role: "Product Consultant",
    company: "Zetwerk · $3B+ Manufacturing Marketplace",
    companyShort: "Zetwerk",
    period: "May 2023 – May 2025",
    location: "India & UK",
    contextNote: "Contract-only by design: UK post-study visa restricted full-time employment.",
    summary:
      "Shipped production AI retrieval and matching systems for a $3B+ manufacturing marketplace, owning product discovery through delivery across document intelligence, supplier matching, and observability.",
    details: [
      "Shipped a production AI retrieval system across 500K+ unstructured documents — PDFs, CAD drawings, technical specs, and supplier records — owning extraction, enrichment, and indexing workflows that powered LLM search and RAG across supplier data",
      "Owned delivery of supplier matching and ranking engine with a 5-person Engineering/ML team, combining vector embeddings, comparable-job retrieval, and ranking signals to cut supplier shortlisting time by 32% and lift quote-to-award conversion by 28%",
      "Led zero-to-one product discovery in enterprise procurement, conducting 35+ user interviews to identify high-value opportunities across document intelligence, retrieval, and ML recommendations, shaping a roadmap that generated $8M in incremental revenue",
      "Developed project observability platform unifying procurement, inventory, and delivery signals into a single real-time view, enabling just-in-time inventory orchestration; drove adoption to 40+ enterprise clients and cut average lead times by 25%",
    ],
    technologies: ["RAG", "Vector Embeddings", "LLM Search", "AI/ML", "Product Strategy", "Enterprise AI"],
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
      "Co-founded an EdTech venture at Imperial College London. Led product strategy, discovery, and pilot across 10+ primary schools.",
    details: [
      "Co-founded an EdTech venture incubated at Imperial College London; led market research, competitive analysis, user journey mapping, and 50+ user interviews to define product strategy, MVP scope, and success metrics for a play-based learning platform",
      "Led pilots across 10+ primary schools serving 700 students, using user feedback loops and A/B testing to prioritize features across peer learning and progress tracking, achieving 45% DAU/MAU and improving math proficiency by 35%",
    ],
    technologies: ["React", "Node.js", "EdTech", "User Research", "A/B Testing"],
    type: "work" as const,
  },
  {
    id: "leenaai",
    role: "Product Manager (transitioned from Senior Software Developer)",
    company: "Leena AI — Series B, Bessemer-backed B2B HR-Tech Startup, Gartner Leader",
    companyShort: "Leena AI",
    period: "Jan 2021 – Oct 2022",
    location: "Delhi NCR, India",
    summary:
      "Transitioned from Senior Software Developer to PM. Led flagship products from 0→1 and 1→N, scaling to $5M ARR and 90+ enterprise clients globally.",
    details: [
      "Led product discovery, competitive analysis, roadmap definition, and go-to-market strategy for Employee Engagement and Surveys, presenting recommendations for executive buy-in and scaling the product to $2M ARR in 10 months across 90+ global enterprises",
      "Owned roadmap prioritization for the flagship HR virtual assistant v2.0, leading a 10-member cross-functional team across Engineering, Design, and Business and authoring PRDs for 25+ features that drove $3M in annual revenue and added 1.5M new users",
      "Defined the business case and ML roadmap for an NLP-driven attrition prediction offering for 2 Fortune 500 clients, translating workforce data and employee feedback into a retention-focused solution projected to deliver $15M+ in savings",
      "Identified onboarding friction through 25+ customer discovery sessions and prototyped new employee onboarding flows that reduced completion time by 48%, securing executive buy-in for roadmap prioritization",
      "Re-architected the platform into scalable microservices to support 250% user growth, introducing caching and database performance improvements that cut API response times by 40% and maintained 99.9% uptime during peak demand",
      "Developed an enterprise-grade design system with 150+ reusable components in collaboration with UX research, speeding up feature development by 60% while standardizing user experience across products",
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
      "Full-stack development supporting subscriber growth from 40K to 500K. Built analytics features driving 120% engagement increase.",
    details: [
      "Built and iterated end-to-end features to enhance core web and mobile product experiences across authentication, content, onboarding, and payments; automated CI/CD pipelines supporting subscriber growth from 40K to 500K in 6 months",
      "Led user research, SQL-based product analytics, and data pipeline development to define use cases and launch a progress analytics dashboard, increasing student engagement by 120%",
    ],
    technologies: ["TypeScript", "React", "CI/CD", "Analytics", "Full-Stack"],
    type: "work" as const,
  },
] as const;

export const PROJECTS = [
  {
    id: "ai-procurement",
    title: "AI-Powered Procurement Automation",
    subtitle: "Multimodal AI for Zetwerk — $3B Manufacturing Marketplace",
    type: "AI" as const,
    description:
      "Led product strategy for an AI engine that automates buyer-vendor matching using 3D CAD parsing and multimodal transformers.",
    problem: "Procurement cycles were slow and manual, costing the marketplace millions in inefficiency.",
    approach: "Led stakeholder interviews, built the business case, and prioritized a B-Rep Transformer based approach for 3D CAD analysis.",
    outcome: "Pilot delivered 32% cycle-time reduction; $80M+ efficiency unlock projected at full rollout.",
    technologies: ["AI/ML", "Computer Vision", "3D CAD", "Product Strategy"],
    featured: true,
    caseStudy: {
      heroMetrics: [
        { value: "32%", label: "Cycle Time Reduction (Pilot)" },
        { value: "15%", label: "Matching Accuracy vs. Manual" },
        { value: "$3B", label: "Marketplace Volume" },
      ],
      sections: [
        {
          heading: "Context",
          content: "Zetwerk, a manufacturing marketplace processing $3B+ in annual transactions, relied on manual procurement workflows. Buyers uploaded 3D CAD files and specifications, then human operators manually matched them with vendors — a process taking days per RFQ and costing the platform millions in operational overhead. I was engaged as a product consultant to lead the AI automation initiative.",
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
          content: "In the pilot cohort, the AI engine delivered a 32% reduction in procurement cycle time and improved matching accuracy by 15% over human operators on standardized part categories. Average RFQ turnaround dropped from 3 days to 1. Based on pilot performance, full-scale rollout was modeled to unlock $80M+ in annual efficiency gains. The system now processes the majority of incoming RFQs with minimal human review.",
          metrics: [
            { value: "32%", label: "Cycle time reduction (delivered, pilot)" },
            { value: "15%", label: "Matching accuracy gain (delivered)" },
            { value: "3→1 day", label: "RFQ turnaround (delivered)" },
            { value: "$80M+", label: "Annual savings (modeled at full rollout)" },
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
    id: "codevision",
    title: "CodeVision",
    subtitle: "AI-Powered Codebase Intelligence Platform",
    type: "AI" as const,
    description:
      "Built an AI platform that makes any GitHub codebase instantly legible — for developers onboarding to unfamiliar repos, and for non-technical stakeholders who need to verify what they've been delivered.",
    problem: "Non-technical clients can't verify code matches requirements. Developers waste hours exploring unfamiliar codebases with no map.",
    approach: "Designed and shipped end-to-end: smart file selection within Claude's context window, structured analysis pipeline, 6 visualization views, version diff with breaking-change detection, and an AI chat assistant grounded in live repo context.",
    outcome: "Deployed to Northwestern University (Kellogg + McCormick). 124 commits across 5 months. Live at code-vision-inky.vercel.app.",
    technologies: ["Claude API", "Next.js 14", "TypeScript", "Supabase", "Vitest", "Playwright"],
    featured: true,
    liveUrl: "https://code-vision-inky.vercel.app",
    githubUrl: "https://github.com/kothariprakhar/CodeVision",
    caseStudy: {
      heroMetrics: [
        { value: "6", label: "Analysis Views Built" },
        { value: "124", label: "Commits Shipped" },
        { value: "5 mo", label: "MVP to Production" },
      ],
      sections: [
        {
          heading: "The Problem",
          content: "Two groups face the same opaque codebase problem. Developers joining a new project spend days reading source code with no high-level map of how modules connect. Non-technical stakeholders — clients, PMs, executives — who contracted a development team have no way to verify that what was delivered actually matches what they asked for, without hiring another engineer to audit the first. I built CodeVision to solve both.",
        },
        {
          heading: "Product Design",
          content: "The core design challenge was fitting the analysis of an entire repository inside Claude's context window while producing structured, actionable output — not a wall of text. I built a smart file selector that uses keyword matching and structural analysis to prioritize the most signal-dense files, then engineered a prompt pipeline that extracts a structured JSON schema: modules, data flows, tech stack, risks by severity (Critical / High / Medium / Low), and user journey steps. This JSON then powers six distinct visualization views, each designed for a specific audience.",
          bullets: [
            "Architecture Diagram: 5–12 high-level, business-named module cards with type indicators (UI, API, service, database, external)",
            "User Flow View: how real users move through the product, with friction points surfaced",
            "Tech Stack Dashboard: languages, frameworks, dependencies at a glance",
            "Risk Panel: delivery and reliability risks with estimated remediation effort",
            "Version Diff: branch/PR/commit-aware diff with breaking-change alerts and stakeholder-facing narratives",
            "AI Chat: Q&A assistant with live repo context baked in for grounded answers",
          ],
        },
        {
          heading: "Technical Architecture",
          content: "I built the full stack: Next.js 14 App Router, TypeScript, Supabase (migrated from SQLite), JWT auth in HttpOnly cookies, async job processing with WebSocket status updates, and a 19-service pipeline covering ingestion, analysis, chunking, diffing, narrative generation, and export. Analysis is async — users see real-time progress via WebSocket, and results are persisted for re-viewing without re-running. Tests cover unit (Vitest) and E2E (Playwright).",
        },
        {
          heading: "Go-to-Market: University Distribution",
          content: "Rather than launching publicly and fighting for attention, I designed access controls for a high-value, captive audience: Northwestern University students and faculty (@northwestern.edu and @kellogg.northwestern.edu). This gave CodeVision real users with genuine pain — MBA students reviewing technical deliverables from engineering classmates, CS students onboarding to group project repos — without requiring any marketing spend. A waitlist form captures external demand for future expansion.",
        },
        {
          heading: "Version Diff: The Flagship Feature",
          content: "The most complex feature, shipped in April 2026, was version-aware diffing. Given a branch, PR, or commit, CodeVision detects breaking changes, generates a capability-change summary, a user journey storyboard (how the product experience changed), and a ship-readiness verdict. This directly serves the non-technical stakeholder use case: a client can see exactly what changed between deliverable v1 and v2 in plain English, without reading a git diff.",
        },
        {
          heading: "Results",
          content: "CodeVision is live in production at Northwestern University. 124 commits were shipped across 5 months with two collaborators, driven by 17 phased design documents in a /docs/plans directory that mirrors how I run professional product work — PRDs first, then engineering.",
          metrics: [
            { value: "19", label: "Service modules in analysis pipeline" },
            { value: "124", label: "Commits shipped" },
            { value: "17", label: "Product design docs (PRDs)" },
            { value: "6", label: "Visualization views for different stakeholders" },
          ],
        },
        {
          heading: "Key Learnings",
          content: "The hardest part wasn't the LLM integration — it was the UX of structured uncertainty. When Claude isn't confident about a module's purpose, the UI needs to communicate that gracefully rather than hallucinating confidence. I built confidence indicators into every card and made 'I don't know' a first-class state.",
          bullets: [
            "Structured JSON extraction from LLMs is the hardest part of any AI product to make robust",
            "Design for the non-technical audience first — if they can read it, engineers definitely can",
            "Async with real-time progress is table stakes for any AI feature with >5s latency",
            "University-gated distribution created a focused early user base with genuine pain",
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
    subtitle: "0 → $2M ARR in 10 months",
    type: "Product" as const,
    description:
      "Led the full product lifecycle from conception to launch and scale of an enterprise engagement platform.",
    problem: "Organizations lacked real-time insight into employee sentiment and engagement drivers.",
    approach: "Drove customer discovery, competitive analysis, roadmap definition, and go-to-market strategy.",
    outcome: "$2M ARR in 10 months, adopted by 90+ enterprises globally.",
    technologies: ["Product Strategy", "Analytics", "Enterprise SaaS"],
    featured: false,
    caseStudy: {
      heroMetrics: [
        { value: "$2M", label: "ARR in 10 Months" },
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
            "Prototyped NLP-based attrition prediction with 2 Fortune 500 clients",
            "Defined 3-phase roadmap: Launch → Grow → Differentiate",
          ],
        },
        {
          heading: "Solution",
          content: "I defined the product vision, authored the roadmap, and managed execution across engineering, design, and go-to-market teams. The platform featured customizable pulse surveys, real-time sentiment dashboards, manager action plans, and integration with the existing virtual assistant for conversational check-ins. I personally led the sales engineering process for the first 10 enterprise deals.",
        },
        {
          heading: "Results & Impact",
          content: "The platform reached $2M ARR within 10 months of launch, adopted by 90+ enterprises. Response rates averaged 72% — nearly double the industry benchmark — driven by the conversational survey format via the virtual assistant.",
          metrics: [
            { value: "$2M", label: "ARR achieved in 10 months (delivered)" },
            { value: "90+", label: "Enterprise clients onboarded (delivered)" },
            { value: "72%", label: "Survey response rate (vs. 35% industry avg)" },
            { value: "$15M", label: "Attrition savings (modeled with Fortune 500 partner)" },
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

