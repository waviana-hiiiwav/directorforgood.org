import type { NextConfig } from "next";
import fs from 'node:fs'

const redirectsFile = './redirects.json'

const nextConfig: NextConfig = {
  typescript: {
    // Allow production builds with TypeScript errors (dev files not yet cleaned up)
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'directorforgood.org' },
      { protocol: 'https', hostname: 'i0.wp.com' },
      { protocol: 'https', hostname: 'secure.gravatar.com' }
    ]
  },
  async redirects() {
    if (fs.existsSync(redirectsFile)) {
      const rules = JSON.parse(fs.readFileSync(redirectsFile, 'utf8'))
      return rules
    }
    return []
  }
};

export default nextConfig;
