import client from "@/tina/__generated__/client";
import HomePageClient from "./home-page-client";

export default async function Page() {
  const res = await client.queries.home({ relativePath: "home.json" });
  return <HomePageClient {...res} />;
}
