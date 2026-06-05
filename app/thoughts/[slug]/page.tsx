import client from "@/tina/__generated__/client";
import ThoughtPageClient from "./thought-page-client";

export default async function ThoughtPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const res = await client.queries.thought({ relativePath: `${resolvedParams.slug}.md` });
  return <ThoughtPageClient {...res} />;
}
