export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
] as const;

export const SOCIAL_LINKS = {
  linkedin: "https://linkedin.com/in/prakharkothari",
  github: "https://github.com/prakharkothari",
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
  },
] as const;

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

export const BLOG_POSTS = [
  {
    id: "ai-product-management",
    title: "Why AI Product Management is Different",
    description: "Exploring the unique challenges of building AI-powered products vs. traditional software.",
    tags: ["AI Strategy", "Product Thinking"],
    published: false,
  },
  {
    id: "from-engineer-to-pm",
    title: "From Engineer to PM: What Changes",
    description: "Reflections on transitioning from building products to defining what gets built.",
    tags: ["Career", "Product Management"],
    published: false,
  },
  {
    id: "building-at-intersection",
    title: "Building at the Intersection of AI & Business",
    description: "How the Kellogg + AI joint degree shapes my approach to product development.",
    tags: ["AI", "MBA", "Building"],
    published: false,
  },
] as const;
