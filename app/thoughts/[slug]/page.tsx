import Link from "next/link"
import { AnimatedSection, AnimatedItem, AnimatedGroup } from "@/components/ui/animated-section"

const thoughtsData: Record<string, any> = {
  "empty-space": {
    title: "The Value of Empty Space",
    date: "Oct 12, 2023",
    type: "Essay",
    readTime: "4 min read",
    content: [
      "In modern interface design, silence is as important as the notes. Embracing void areas allows critical information to breathe and establishes a natural hierarchy without relying on heavy borders or explicit dividers.",
      "When we look at the history of typography and print design, margins were not merely the absence of ink; they were the framing device that gave the ink its power. The same principle applies to digital interfaces. A component surrounded by generous padding commands more attention and feels inherently more premium than one crammed into a dense grid.",
      "The fear of empty space—horror vacui—often drives stakeholders to request that we 'fill the white space' with more features, more links, or more visual noise. However, this fundamentally misunderstands human cognition. Cognitive load increases exponentially with every new element introduced to a screen.",
      "To design with precision means to make deliberate choices about what to omit. It is an act of curation. By stripping away the non-essential, we don't diminish the interface; we amplify its core utility."
    ]
  },
  "engineering-precision": {
    title: "Engineering Precision",
    date: "Nov 04, 2023",
    type: "Note",
    readTime: "2 min read",
    content: [
      "Treating software like hardware.",
      "There is a distinct satisfaction in interacting with a well-machined physical object—the satisfying click of a mechanical switch, the smooth resistance of a metal dial. In software, we often lose this tactility, settling for 'good enough' interactions built on generic component libraries.",
      "What happens when we apply industrial design principles to frontend engineering? We begin to care about the micro-interactions: the exact bezier curve of an easing function, the sub-pixel alignment of borders, the consistent application of a highly constrained color palette.",
      "Rigid constraints do not stifle creativity; they channel it. When you only have two font weights and four colors to work with, you are forced to solve hierarchy problems through layout, spacing, and rhythm rather than relying on superficial decoration. This is the essence of engineering precision in UI design."
    ]
  }
}

export default async function ThoughtPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const thought = thoughtsData[resolvedParams.slug]

  if (!thought) {
    return <div className="min-h-screen flex items-center justify-center font-te-40 text-4xl bg-graphite text-canvas">Document Not Found</div>
  }

  return (
    <div className="min-h-screen bg-graphite text-canvas font-te-20 selection:bg-accent selection:text-accent-foreground pb-32">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0" 
           style={{ 
             backgroundImage: `linear-gradient(to right, var(--color-ink) 1px, transparent 1px), linear-gradient(to bottom, var(--color-ink) 1px, transparent 1px)`,
             backgroundSize: '40px 40px',
             opacity: 0.1,
             maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)'
           }}>
      </div>

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-graphite/80 border-b border-ink transition-colors duration-300">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/#thoughts" className="text-[13px] text-steel hover:text-accent transition-colors uppercase tracking-widest flex items-center gap-2">
            <span className="w-4 h-[1px] bg-current"></span> Back to Thoughts
          </Link>
          <div className="text-[13px] text-steel uppercase tracking-widest font-mono">SYS.DOC.{resolvedParams.slug.substring(0, 3).toUpperCase()}</div>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-32 relative z-10">
        <article className="max-w-3xl mx-auto">
          {/* Header */}
          <AnimatedSection className="mb-24 border-b border-ink pb-16">
            <div className="flex items-center gap-4 mb-8 text-[13px] text-steel uppercase tracking-widest font-mono">
              <span className="flex items-center gap-2 text-accent">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                {thought.type}
              </span>
              <span>|</span>
              <span>{thought.date}</span>
              <span>|</span>
              <span>{thought.readTime}</span>
            </div>
            <h1 className="text-[50px] md:text-[80px] font-te-40 leading-[1.1] tracking-tight">{thought.title}</h1>
          </AnimatedSection>

          {/* Content */}
          <AnimatedGroup className="space-y-12">
            {thought.content.map((paragraph: string, index: number) => (
              <AnimatedItem key={index}>
                <p className={`text-[24px] md:text-[26px] leading-relaxed text-steel ${index === 0 ? "first-letter:text-[80px] first-letter:font-te-40 first-letter:float-left first-letter:mr-4 first-letter:leading-[0.8] first-letter:text-canvas" : ""}`}>
                  {paragraph}
                </p>
              </AnimatedItem>
            ))}
          </AnimatedGroup>

          {/* Footer Signature */}
          <AnimatedSection className="mt-32 pt-16 border-t border-ink flex justify-between items-center text-[13px] text-steel font-mono uppercase tracking-widest">
            <div>End of Document</div>
            <div>[ EOD ]</div>
          </AnimatedSection>
        </article>
      </main>
    </div>
  )
}
