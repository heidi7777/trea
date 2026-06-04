import Image from "next/image"
import Link from "next/link"
import { AnimatedSection, AnimatedItem, AnimatedGroup } from "@/components/ui/animated-section"
import { Badge } from "@/components/ui/badge"

// Mock data for projects
const projectsData: Record<string, any> = {
  "xiaoyuzhou": {
    title: "Xiaoyuzhou",
    subtitle: "Podcast player redesign focusing on minimalist interactions",
    role: "UX Research, UX/UI Design",
    team: "Independent Project",
    tools: "Figma, Framer",
    timeline: "4 weeks",
    problem: "Current podcast players are cluttered with unnecessary social features and complex navigation structures that distract from the core listening experience. Users often struggle to quickly resume their unfinished episodes.",
    solution: "A streamlined interface that prioritizes the 'Now Playing' context and uses intuitive gesture-based navigation to move between discovery and listening, stripping away all non-essential elements.",
    research: "User interviews revealed that 80% of users use the app primarily during commute or chores. The redesign focused on large touch targets and high-contrast typography to ensure usability in moving environments.",
    heroImage: "/project-xiaoyuzhou.jpg",
    tags: ["UX Research", "Figma"]
  },
  "tonghuashun": {
    title: "Tonghuashun",
    subtitle: "Financial data visualization dashboard",
    role: "Frontend Developer",
    team: "3 Developers, 1 Designer",
    tools: "React, D3.js, Tailwind CSS",
    timeline: "3 months",
    problem: "Retail investors are overwhelmed by dense tables of financial data. The existing terminal was outdated, slow to render on web, and lacked intuitive visual representations of market trends.",
    solution: "Engineered a high-performance web dashboard using React and D3.js that translates complex data streams into interactive, real-time visual charts with customizable widgets.",
    research: "Performance benchmarking showed that rendering 10,000+ data points caused significant lag. We implemented canvas-based rendering for charts and virtualized lists for tables to achieve 60fps.",
    heroImage: "/project-tonghuashun.jpg",
    tags: ["React", "Data Viz"]
  },
  "design-system": {
    title: "Personal Design System",
    subtitle: "A strictly defined design system modeled after teenage engineering",
    role: "Design Engineer",
    team: "Solo",
    tools: "Tailwind CSS, React, Storybook",
    timeline: "Ongoing",
    problem: "Inconsistent UI patterns across personal projects led to repeated code and disjointed user experiences. Needed a unified language that reflects a specific, precise aesthetic.",
    solution: "Developed a comprehensive set of design tokens and React components strictly adhering to a brutalist, engineering-focused aesthetic. Built with Tailwind CSS for rapid implementation.",
    research: "Analyzed industrial design principles and hardware interfaces to translate physical constraints (like sharp edges, monospaced typography, and high-contrast states) into web components.",
    heroImage: "/project-design-system.jpg",
    tags: ["Design System", "Tailwind CSS"]
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const project = projectsData[resolvedParams.slug]

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center font-te-40 text-4xl">Project Not Found</div>
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-te-20 selection:bg-accent selection:text-accent-foreground pb-32">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border transition-colors duration-300">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/#projects" className="text-[13px] text-foreground hover:text-accent transition-colors uppercase tracking-widest flex items-center gap-2">
            <span className="w-4 h-[1px] bg-current"></span> Back to Portfolio
          </Link>
          <div className="text-[13px] text-muted-foreground uppercase tracking-widest font-mono">SYS.PRJ.{resolvedParams.slug.substring(0, 3).toUpperCase()}</div>
        </div>
      </nav>

      {/* Hero Image Section */}
      <AnimatedSection className="w-full bg-muted border-b border-border relative aspect-[21/9] max-h-[70vh] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-[13px] uppercase tracking-widest bg-smoke/20">
          Hero Image Placeholder
        </div>
        {/* If real image exists:
        <Image src={project.heroImage} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1200px" className="object-cover" alt={project.title} /> 
        */}
      </AnimatedSection>

      <main className="container mx-auto px-6 pt-24">
        {/* Header Section */}
        <AnimatedSection className="text-center max-w-4xl mx-auto mb-32">
          <h1 className="text-[50px] md:text-[80px] font-te-40 leading-none mb-6">{project.title}</h1>
          <p className="text-[24px] text-muted-foreground leading-snug">{project.subtitle}</p>
        </AnimatedSection>

        {/* Metadata & Description Grid */}
        <AnimatedGroup className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-[66px] lg:gap-[120px] mb-32 border-t border-border pt-16">
          {/* Left Column: Metadata */}
          <div className="space-y-12">
            <AnimatedItem>
              <h3 className="text-[13px] text-foreground uppercase tracking-widest font-bold mb-2">Role</h3>
              <p className="text-[19px] text-muted-foreground">{project.role}</p>
            </AnimatedItem>
            
            <AnimatedItem>
              <h3 className="text-[13px] text-foreground uppercase tracking-widest font-bold mb-2">Team</h3>
              <p className="text-[19px] text-muted-foreground">{project.team}</p>
            </AnimatedItem>

            <AnimatedItem>
              <h3 className="text-[13px] text-foreground uppercase tracking-widest font-bold mb-2">Tools</h3>
              <p className="text-[19px] text-muted-foreground">{project.tools}</p>
            </AnimatedItem>

            <AnimatedItem>
              <h3 className="text-[13px] text-foreground uppercase tracking-widest font-bold mb-2">Timeline</h3>
              <p className="text-[19px] text-muted-foreground">{project.timeline}</p>
            </AnimatedItem>
          </div>

          {/* Right Column: Content */}
          <div className="space-y-[66px]">
            <AnimatedItem>
              <h3 className="text-[26px] font-te-40 mb-4">Problem</h3>
              <p className="text-[19px] text-foreground leading-relaxed">{project.problem}</p>
            </AnimatedItem>
            
            <AnimatedItem>
              <h3 className="text-[26px] font-te-40 mb-4">Solution</h3>
              <p className="text-[19px] text-foreground leading-relaxed">{project.solution}</p>
            </AnimatedItem>
          </div>
        </AnimatedGroup>

        {/* The Research Section */}
        <AnimatedSection className="max-w-4xl mx-auto border-t border-border pt-32">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-[66px]">
            <h2 className="text-[40px] font-te-40">The Research</h2>
            <p className="text-[19px] text-muted-foreground leading-relaxed pt-2">
              {project.research}
            </p>
          </div>
          
          {/* Placeholder for Research Images */}
          <div className="grid grid-cols-2 gap-[22px] mt-[66px]">
            <div className="aspect-[4/3] bg-muted border border-border flex items-center justify-center text-[13px] text-muted-foreground uppercase tracking-widest">
              Fig. 1
            </div>
            <div className="aspect-[4/3] bg-muted border border-border flex items-center justify-center text-[13px] text-muted-foreground uppercase tracking-widest">
              Fig. 2
            </div>
          </div>
        </AnimatedSection>
      </main>
    </div>
  )
}
