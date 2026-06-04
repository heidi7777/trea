import Image from "next/image"
import Link from "next/link"
import {
  AnimatedSection,
  AnimatedItem,
  AnimatedGroup,
} from "@/components/ui/animated-section"
import { LocalContentEditor } from "@/components/content/local-content-editor"
import { MarkdownRenderer } from "@/components/content/markdown-renderer"
import { getProjectContent } from "@/lib/content"

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params
  const project = await getProjectContent(resolvedParams.slug)

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center font-te-40 text-4xl">
        Project Not Found
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-32 font-te-20 text-foreground selection:bg-accent selection:text-accent-foreground">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors duration-300">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link
            href="/#projects"
            className="flex items-center gap-2 text-[13px] tracking-widest text-foreground uppercase transition-colors hover:text-accent"
          >
            <span className="h-[1px] w-4 bg-current"></span> Back to Portfolio
          </Link>
          <div className="font-mono text-[13px] tracking-widest text-muted-foreground uppercase">
            SYS.PRJ.{resolvedParams.slug.substring(0, 3).toUpperCase()}
          </div>
        </div>
      </nav>

      {/* Hero Image Section */}
      <AnimatedSection className="relative aspect-[21/9] max-h-[70vh] w-full overflow-hidden border-b border-border bg-muted">
        <div className="absolute inset-0 flex items-center justify-center bg-smoke/20 text-[13px] tracking-widest text-muted-foreground uppercase">
          Hero Image Placeholder
        </div>
        {project.heroImage ? (
          <Image
            src={project.heroImage}
            fill
            className="object-cover"
            alt={project.title}
          />
        ) : null}
      </AnimatedSection>

      <main className="container mx-auto px-6 pt-24">
        {/* Header Section */}
        <AnimatedSection className="mx-auto mb-32 max-w-4xl text-center">
          <h1 className="mb-6 font-te-40 text-[50px] leading-none md:text-[80px]">
            {project.title}
          </h1>
          <p className="text-[24px] leading-snug text-muted-foreground">
            {project.subtitle}
          </p>
        </AnimatedSection>

        {/* Metadata & Description Grid */}
        <AnimatedGroup className="mb-32 grid grid-cols-1 gap-[66px] border-t border-border pt-16 lg:grid-cols-[1fr_2fr] lg:gap-[120px]">
          {/* Left Column: Metadata */}
          <div className="space-y-12">
            <AnimatedItem>
              <h3 className="mb-2 text-[13px] font-bold tracking-widest text-foreground uppercase">
                Role
              </h3>
              <p className="text-[19px] text-muted-foreground">
                {project.role}
              </p>
            </AnimatedItem>

            <AnimatedItem>
              <h3 className="mb-2 text-[13px] font-bold tracking-widest text-foreground uppercase">
                Team
              </h3>
              <p className="text-[19px] text-muted-foreground">
                {project.team}
              </p>
            </AnimatedItem>

            <AnimatedItem>
              <h3 className="mb-2 text-[13px] font-bold tracking-widest text-foreground uppercase">
                Tools
              </h3>
              <p className="text-[19px] text-muted-foreground">
                {project.tools}
              </p>
            </AnimatedItem>

            <AnimatedItem>
              <h3 className="mb-2 text-[13px] font-bold tracking-widest text-foreground uppercase">
                Timeline
              </h3>
              <p className="text-[19px] text-muted-foreground">
                {project.timeline}
              </p>
            </AnimatedItem>
          </div>

          {/* Right Column: Content */}
          <div className="space-y-[66px]">
            <AnimatedItem>
              <h3 className="mb-4 font-te-40 text-[26px]">Problem</h3>
              <p className="text-[19px] leading-relaxed text-foreground">
                {project.problem}
              </p>
            </AnimatedItem>

            <AnimatedItem>
              <h3 className="mb-4 font-te-40 text-[26px]">Solution</h3>
              <p className="text-[19px] leading-relaxed text-foreground">
                {project.solution}
              </p>
            </AnimatedItem>
          </div>
        </AnimatedGroup>

        {/* The Research Section */}
        <AnimatedSection className="mx-auto max-w-4xl border-t border-border pt-32">
          <div className="grid grid-cols-1 gap-[66px] md:grid-cols-[1fr_2fr]">
            <h2 className="font-te-40 text-[40px]">The Research</h2>
            <p className="pt-2 text-[19px] leading-relaxed text-muted-foreground">
              {project.research}
            </p>
          </div>

          <div className="mt-[66px] grid grid-cols-1 gap-[22px] md:grid-cols-2">
            {project.researchImages.length > 0 ? (
              project.researchImages.map((image, index) => (
                <div
                  key={image}
                  className="relative aspect-[4/3] overflow-hidden border border-border bg-muted"
                >
                  <Image
                    src={image}
                    fill
                    className="object-cover"
                    alt={`${project.title} research image ${index + 1}`}
                  />
                </div>
              ))
            ) : (
              <>
                <div className="flex aspect-[4/3] items-center justify-center border border-border bg-muted text-[13px] tracking-widest text-muted-foreground uppercase">
                  Fig. 1
                </div>
                <div className="flex aspect-[4/3] items-center justify-center border border-border bg-muted text-[13px] tracking-widest text-muted-foreground uppercase">
                  Fig. 2
                </div>
              </>
            )}
          </div>
        </AnimatedSection>

        <AnimatedSection className="mx-auto mt-24 max-w-4xl border-t border-border pt-24">
          <MarkdownRenderer content={project.body} />
        </AnimatedSection>
      </main>

      <LocalContentEditor
        kind="project"
        id={resolvedParams.slug}
        initialContent={project}
      />
    </div>
  )
}
