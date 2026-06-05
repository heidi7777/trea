'use client';

import Link from "next/link";
import { AnimatedGroup, AnimatedItem, AnimatedSection } from "@/components/ui/animated-section";
import { Badge } from "@/components/ui/badge";
import type { ProjectQuery, ProjectQueryVariables } from "@/tina/__generated__/types";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { useTina, tinaField } from "tinacms/dist/react";

type ProjectPageClientProps = {
  slug: string;
  data: ProjectQuery;
  query: string;
  variables: ProjectQueryVariables;
};

export default function ProjectPageClient(props: ProjectPageClientProps) {
  const { data } = useTina<ProjectQuery>({
    data: props.data,
    query: props.query,
    variables: props.variables,
  });
  const project = data.project;

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center font-te-40 text-4xl">Project Not Found</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-te-20 selection:bg-accent selection:text-accent-foreground pb-32">
      <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border transition-colors duration-300">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/#projects" className="text-[13px] text-foreground hover:text-accent transition-colors uppercase tracking-widest flex items-center gap-2">
            <span className="w-4 h-[1px] bg-current"></span> Back to Portfolio
          </Link>
          <div className="text-[13px] text-muted-foreground uppercase tracking-widest font-mono">SYS.PRJ.{props.slug.substring(0, 3).toUpperCase()}</div>
        </div>
      </nav>

      <AnimatedSection className="w-full bg-muted border-b border-border relative aspect-[21/9] max-h-[70vh] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-[13px] uppercase tracking-widest bg-smoke/20">Hero Image Placeholder</div>
      </AnimatedSection>

      <main className="container mx-auto px-6 pt-24">
        <AnimatedSection className="text-center max-w-4xl mx-auto mb-32">
          <h1 data-tina-field={tinaField(project, "title")} className="text-[50px] md:text-[80px] font-te-40 leading-none mb-6">{project.title}</h1>
          {project.subtitle ? <p data-tina-field={tinaField(project, "subtitle")} className="text-[24px] text-muted-foreground leading-snug">{project.subtitle}</p> : null}
          {Array.isArray(project.tags) && project.tags.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="rounded-none text-[13px] font-normal font-te-20 text-foreground border-border bg-background">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}
        </AnimatedSection>

        <AnimatedGroup className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-[66px] lg:gap-[120px] mb-32 border-t border-border pt-16">
          <div className="space-y-12">
            {project.role ? (
              <AnimatedItem>
                <h3 className="text-[13px] text-foreground uppercase tracking-widest font-bold mb-2">Role</h3>
                <p className="text-[19px] text-muted-foreground">{project.role}</p>
              </AnimatedItem>
            ) : null}

            {project.team ? (
              <AnimatedItem>
                <h3 className="text-[13px] text-foreground uppercase tracking-widest font-bold mb-2">Team</h3>
                <p className="text-[19px] text-muted-foreground">{project.team}</p>
              </AnimatedItem>
            ) : null}

            {project.tools ? (
              <AnimatedItem>
                <h3 className="text-[13px] text-foreground uppercase tracking-widest font-bold mb-2">Tools</h3>
                <p className="text-[19px] text-muted-foreground">{project.tools}</p>
              </AnimatedItem>
            ) : null}

            {project.timeline ? (
              <AnimatedItem>
                <h3 className="text-[13px] text-foreground uppercase tracking-widest font-bold mb-2">Timeline</h3>
                <p className="text-[19px] text-muted-foreground">{project.timeline}</p>
              </AnimatedItem>
            ) : null}
          </div>

          <div className="space-y-[66px]">
            {project.description ? (
              <AnimatedItem>
                <h3 className="text-[26px] font-te-40 mb-4">Description</h3>
                <p className="text-[19px] text-foreground leading-relaxed">{project.description}</p>
              </AnimatedItem>
            ) : null}

            <AnimatedItem>
              <h3 className="text-[26px] font-te-40 mb-4">Body</h3>
              <div data-tina-field={tinaField(project, "body")} className="text-[19px] leading-relaxed">
                <TinaMarkdown content={project.body as any} />
              </div>
            </AnimatedItem>
          </div>
        </AnimatedGroup>
      </main>
    </div>
  );
}
