'use client';

import Link from "next/link";
import { AnimatedSection, AnimatedItem, AnimatedGroup } from "@/components/ui/animated-section";
import type { ThoughtQuery, ThoughtQueryVariables } from "@/tina/__generated__/types";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { useTina, tinaField } from "tinacms/dist/react";

type ThoughtPageClientProps = {
  data: ThoughtQuery;
  query: string;
  variables: ThoughtQueryVariables;
};

export default function ThoughtPageClient(props: ThoughtPageClientProps) {
  const { data } = useTina<ThoughtQuery>({
    data: props.data,
    query: props.query,
    variables: props.variables,
  });
  const thought = data.thought;

  if (!thought) {
    return <div className="min-h-screen flex items-center justify-center font-te-40 text-4xl bg-graphite text-canvas">Thought Not Found</div>;
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
          <div className="text-[13px] text-steel uppercase tracking-widest font-mono">SYS.DOC.THT</div>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-32 relative z-10">
        <article className="max-w-3xl mx-auto">
          {/* Header */}
          <AnimatedSection className="mb-24 border-b border-ink pb-16">
            <div className="flex items-center gap-4 mb-8 text-[13px] text-steel uppercase tracking-widest font-mono">
              <span className="flex items-center gap-2 text-accent">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                <span data-tina-field={tinaField(thought, "type")}>{thought.type}</span>
              </span>
              <span>|</span>
              <span data-tina-field={tinaField(thought, "date")}>{thought.date}</span>
              <span>|</span>
              <span data-tina-field={tinaField(thought, "readTime")}>{thought.readTime}</span>
            </div>
            <h1 data-tina-field={tinaField(thought, "title")} className="text-[50px] md:text-[80px] font-te-40 leading-[1.1] tracking-tight">{thought.title}</h1>
          </AnimatedSection>

          {/* Content */}
          <AnimatedGroup className="space-y-12">
            <AnimatedItem>
              <div data-tina-field={tinaField(thought, "body")} className="prose prose-invert prose-lg max-w-none">
                <TinaMarkdown content={thought.body as any} />
              </div>
            </AnimatedItem>
          </AnimatedGroup>

          {/* Footer Signature */}
          <AnimatedSection className="mt-32 pt-16 border-t border-ink flex justify-between items-center text-[13px] text-steel font-mono uppercase tracking-widest">
            <div>End of Document</div>
            <div>[ EOD ]</div>
          </AnimatedSection>
        </article>
      </main>
    </div>
  );
}
