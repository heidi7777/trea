import { resolve } from "path"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  turbopack: {
    root: resolve(__dirname),
  },
}

export default nextConfig
