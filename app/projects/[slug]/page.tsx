import client from "@/tina/__generated__/client";
import ProjectPageClient from "./project-page-client";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const res = await client.queries.project({ relativePath: `${resolvedParams.slug}.md` });
  return <ProjectPageClient slug={resolvedParams.slug} {...res} />;
}
