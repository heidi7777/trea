export type HomeExperienceItem = {
  period: string
  title: string
  organization: string
  description: string
}

export type HomeProjectCard = {
  slug: string
  previewLabel: string
  title: string
  index: string
  tags: string[]
  description: string
  wide?: boolean
}

export type HomeThoughtCard = {
  slug: string
  type: string
  date: string
  title: string
  description: string
  featured?: boolean
}

export type HomeLink = {
  label: string
  href: string
}

export type HomeContent = {
  nav: string[]
  mobileSystemLabel: string
  hero: {
    status: string
    latitude: string
    longitude: string
    headline: string[]
    intro: string
    ctaLabel: string
    version: string
    updated: string
    avatarImage: string
    avatarAlt: string
  }
  experienceTitle: string
  experiences: HomeExperienceItem[]
  projectsTitle: string
  projectsKicker: string
  projects: HomeProjectCard[]
  thoughtsTitle: string
  thoughts: HomeThoughtCard[]
  contact: {
    title: string
    description: string
    links: HomeLink[]
    qrImage: string
    qrAlt: string
    qrCaption: string
    copyright: string
  }
}

export type ProjectContent = {
  title: string
  subtitle: string
  role: string
  team: string
  tools: string
  timeline: string
  problem: string
  solution: string
  research: string
  heroImage: string
  researchImages: string[]
  tags: string[]
  body: string
}

export type ThoughtContent = {
  title: string
  date: string
  type: string
  readTime: string
  body: string
}

export const defaultProjects: Record<string, ProjectContent> = {
  xiaoyuzhou: {
    title: "Xiaoyuzhou",
    subtitle: "Podcast player redesign focusing on minimalist interactions",
    role: "UX Research, UX/UI Design",
    team: "Independent Project",
    tools: "Figma, Framer",
    timeline: "4 weeks",
    problem:
      "Current podcast players are cluttered with unnecessary social features and complex navigation structures that distract from the core listening experience. Users often struggle to quickly resume their unfinished episodes.",
    solution:
      "A streamlined interface that prioritizes the 'Now Playing' context and uses intuitive gesture-based navigation to move between discovery and listening, stripping away all non-essential elements.",
    research:
      "User interviews revealed that 80% of users use the app primarily during commute or chores. The redesign focused on large touch targets and high-contrast typography to ensure usability in moving environments.",
    heroImage: "/project-xiaoyuzhou.jpg",
    researchImages: [],
    tags: ["UX Research", "Figma"],
    body: `## Project Notes\n\nUse this Markdown section for detailed content below the project introduction. You can document design decisions, research notes, product constraints, and launch reflections here.\n\n- Keep the listening context visible.\n- Reduce navigation depth.\n- Make resume actions obvious during commute scenarios.`,
  },
  tonghuashun: {
    title: "Tonghuashun",
    subtitle: "Financial data visualization dashboard",
    role: "Frontend Developer",
    team: "3 Developers, 1 Designer",
    tools: "React, D3.js, Tailwind CSS",
    timeline: "3 months",
    problem:
      "Retail investors are overwhelmed by dense tables of financial data. The existing terminal was outdated, slow to render on web, and lacked intuitive visual representations of market trends.",
    solution:
      "Engineered a high-performance web dashboard using React and D3.js that translates complex data streams into interactive, real-time visual charts with customizable widgets.",
    research:
      "Performance benchmarking showed that rendering 10,000+ data points caused significant lag. We implemented canvas-based rendering for charts and virtualized lists for tables to achieve 60fps.",
    heroImage: "/project-tonghuashun.jpg",
    researchImages: [],
    tags: ["React", "Data Viz"],
    body: `## Implementation Details\n\nThe content below the project introduction is editable as Markdown. Use it to capture dashboard architecture, visualization experiments, and performance tradeoffs.\n\n1. Normalize incoming market data.\n2. Render dense views with virtualization.\n3. Reserve canvas rendering for high-volume chart layers.`,
  },
  "design-system": {
    title: "Personal Design System",
    subtitle:
      "A strictly defined design system modeled after teenage engineering",
    role: "Design Engineer",
    team: "Solo",
    tools: "Tailwind CSS, React, Storybook",
    timeline: "Ongoing",
    problem:
      "Inconsistent UI patterns across personal projects led to repeated code and disjointed user experiences. Needed a unified language that reflects a specific, precise aesthetic.",
    solution:
      "Developed a comprehensive set of design tokens and React components strictly adhering to a brutalist, engineering-focused aesthetic. Built with Tailwind CSS for rapid implementation.",
    research:
      "Analyzed industrial design principles and hardware interfaces to translate physical constraints (like sharp edges, monospaced typography, and high-contrast states) into web components.",
    heroImage: "/project-design-system.jpg",
    researchImages: [],
    tags: ["Design System", "Tailwind CSS"],
    body: `## System Principles\n\nMarkdown content lives below the project introduction so longer documentation can be edited locally without changing source files.\n\n- Sharp corners over soft decoration.\n- Explicit tokens over one-off values.\n- Layout rhythm before ornamental hierarchy.`,
  },
}

export const defaultThoughts: Record<string, ThoughtContent> = {
  "empty-space": {
    title: "The Value of Empty Space",
    date: "Oct 12, 2023",
    type: "Essay",
    readTime: "4 min read",
    body: `In modern interface design, silence is as important as the notes. Embracing void areas allows critical information to breathe and establishes a natural hierarchy without relying on heavy borders or explicit dividers.\n\nWhen we look at the history of typography and print design, margins were not merely the absence of ink; they were the framing device that gave the ink its power. The same principle applies to digital interfaces. A component surrounded by generous padding commands more attention and feels inherently more premium than one crammed into a dense grid.\n\nThe fear of empty space—horror vacui—often drives stakeholders to request that we 'fill the white space' with more features, more links, or more visual noise. However, this fundamentally misunderstands human cognition. Cognitive load increases exponentially with every new element introduced to a screen.\n\nTo design with precision means to make deliberate choices about what to omit. It is an act of curation. By stripping away the non-essential, we don't diminish the interface; we amplify its core utility.`,
  },
  "engineering-precision": {
    title: "Engineering Precision",
    date: "Nov 04, 2023",
    type: "Note",
    readTime: "2 min read",
    body: `Treating software like hardware.\n\nThere is a distinct satisfaction in interacting with a well-machined physical object—the satisfying click of a mechanical switch, the smooth resistance of a metal dial. In software, we often lose this tactility, settling for 'good enough' interactions built on generic component libraries.\n\nWhat happens when we apply industrial design principles to frontend engineering? We begin to care about the micro-interactions: the exact bezier curve of an easing function, the sub-pixel alignment of borders, the consistent application of a highly constrained color palette.\n\nRigid constraints do not stifle creativity; they channel it. When you only have two font weights and four colors to work with, you are forced to solve hierarchy problems through layout, spacing, and rhythm rather than relying on superficial decoration. This is the essence of engineering precision in UI design.`,
  },
}

export const defaultHomeContent: HomeContent = {
  nav: ["Intro", "Experience", "Projects", "Thoughts", "Contact"],
  mobileSystemLabel: "SYS.OP",
  hero: {
    status: "SYS_ONLINE",
    latitude: "LAT: 31.2304 N",
    longitude: "LON: 121.4737 E",
    headline: ["DESIGNER", "&", "DEVELOPER"],
    intro:
      "I build minimalist, functional interfaces bridging the gap between rigorous design and robust engineering.",
    ctaLabel: "Download Resume",
    version: "Version 2.4.1",
    updated: "Updated 2024",
    avatarImage: "/avatar.jpg",
    avatarAlt: "Avatar",
  },
  experienceTitle: "Experience",
  experiences: [
    {
      period: "2024 — Present",
      title: "Frontend Intern",
      organization: "Tech Corp · Internship",
      description:
        "Developed core UI components and improved performance for the main dashboard application. Implemented strict design system guidelines.",
    },
    {
      period: "2023 — 2024",
      title: "UI/UX Intern",
      organization: "Design Studio · Internship",
      description:
        "Assisted in creating design systems and prototyping interactions for client projects. Conducted user research and usability testing.",
    },
    {
      period: "2021 — 2025",
      title: "Computer Science",
      organization: "University Name · Campus",
      description:
        "Focus on human-computer interaction and software engineering. Led the university tech club and organized multiple hackathons.",
    },
  ],
  projectsTitle: "Projects",
  projectsKicker: "Selected Works (3)",
  projects: [
    {
      slug: "xiaoyuzhou",
      previewLabel: "Xiaoyuzhou Preview",
      title: "Xiaoyuzhou",
      index: "01",
      tags: ["UX Research", "Figma"],
      description:
        "A complete conceptual redesign of the podcast player focusing on minimalist interactions.",
    },
    {
      slug: "tonghuashun",
      previewLabel: "Tonghuashun Preview",
      title: "Tonghuashun",
      index: "02",
      tags: ["React", "Data Viz"],
      description:
        "Financial data visualization dashboard for retail investors.",
    },
    {
      slug: "design-system",
      previewLabel: "Design System Preview",
      title: "Personal Design System",
      index: "03",
      tags: ["Design System", "Tailwind CSS"],
      description:
        "A strictly defined design system modeled after teenage engineering's aesthetic. Features custom typography scales, rigid spacing variables, and high-contrast components.",
      wide: true,
    },
  ],
  thoughtsTitle: "Thoughts",
  thoughts: [
    {
      slug: "empty-space",
      type: "Essay",
      date: "Oct 12, 2023",
      title: "The Value of Empty Space",
      description:
        "In modern interface design, silence is as important as the notes. Embracing void areas allows critical information to breathe and establishes a natural hierarchy without relying on heavy borders or explicit dividers.",
      featured: true,
    },
    {
      slug: "engineering-precision",
      type: "Note",
      date: "Nov 04, 2023",
      title: "Engineering Precision",
      description:
        "Treating software like hardware. Why rigid constraints lead to better creative outcomes in frontend development.",
    },
  ],
  contact: {
    title: "Let's connect.",
    description:
      "Currently open for new opportunities and interesting collaborations.",
    links: [
      { label: "Email", href: "mailto:hello@example.com" },
      { label: "Xiaohongshu", href: "https://xiaohongshu.com" },
      { label: "GitHub", href: "https://github.com" },
    ],
    qrImage: "/wechat-qr.jpg",
    qrAlt: "WeChat QR Code",
    qrCaption: "Scan to add",
    copyright: "All rights reserved.",
  },
}
