'use client';

import { TinaAdmin, TinaCloudProvider } from "tinacms";
import config from "@/tina/config";
import staticMedia from "@/tina/__generated__/static-media.json";

export default function AdminPage() {
  return (
    <TinaCloudProvider
      schema={config.schema as any}
      branch={config.branch ?? "main"}
      clientId={config.clientId ?? undefined}
      isLocalClient={true}
      tinaGraphQLVersion=""
      staticMedia={staticMedia}
    >
      <TinaAdmin config={config} />
    </TinaCloudProvider>
  );
}
