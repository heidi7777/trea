import Link from "next/link"
import { AnimatedSection } from "@/components/ui/animated-section"

import { LocalContentEditor } from "@/components/content/local-content-editor"
import { MarkdownRenderer } from "@/components/content/markdown-renderer"
import { getThoughtContent } from "@/lib/content"

export default async function ThoughtPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params
  const thought = await getThoughtContent(resolvedParams.slug)

  if (!thought) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-graphite font-te-40 text-4xl text-canvas">
        Document Not Found
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-graphite pb-32 font-te-20 text-canvas selection:bg-accent selection:text-accent-foreground">
      {/* Background Grid Pattern */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(to right, var(--color-ink) 1px, transparent 1px), linear-gradient(to bottom, var(--color-ink) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          opacity: 0.1,
          maskImage: "linear-gradient(to bottom, black 20%, transparent 100%)",
        }}
      ></div>

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full border-b border-ink bg-graphite/80 backdrop-blur-md transition-colors duration-300">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link
            href="/#thoughts"
            className="flex items-center gap-2 text-[13px] tracking-widest text-steel uppercase transition-colors hover:text-accent"
          >
            <span className="h-[1px] w-4 bg-current"></span> Back to Thoughts
          </Link>
          <div className="font-mono text-[13px] tracking-widest text-steel uppercase">
            SYS.DOC.{resolvedParams.slug.substring(0, 3).toUpperCase()}
          </div>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 pt-32">
        <article className="mx-auto max-w-3xl">
          {/* Header */}
          <AnimatedSection className="mb-24 border-b border-ink pb-16">
            <div className="mb-8 flex items-center gap-4 font-mono text-[13px] tracking-widest text-steel uppercase">
              <span className="flex items-center gap-2 text-accent">
                <span className="h-2 w-2 rounded-full bg-accent"></span>
                {thought.type}
              </span>
              <span>|</span>
              <span>{thought.date}</span>
              <span>|</span>
              <span>{thought.readTime}</span>
            </div>
            <h1 className="font-te-40 text-[50px] leading-[1.1] tracking-tight md:text-[80px]">
              {thought.title}
            </h1>
          </AnimatedSection>

          {/* Content */}
          <AnimatedSection>
            <MarkdownRenderer
              content={thought.body}
              tone="dark"
              className="text-[24px] md:text-[26px]"
            />
          </AnimatedSection>

          {/* Footer Signature */}
          <AnimatedSection className="mt-32 flex items-center justify-between border-t border-ink pt-16 font-mono text-[13px] tracking-widest text-steel uppercase">
            <div>End of Document</div>
            <div>[ EOD ]</div>
          </AnimatedSection>
        </article>
      </main>

      <LocalContentEditor
        kind="thought"
        id={resolvedParams.slug}
        initialContent={thought}
      />
    </div>
  )
}
