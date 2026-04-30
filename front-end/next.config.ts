import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      // next-intl plugin normally injects this via experimental.turbo (invalid in Next.js 16).
      // Turbopack requires relative paths (no absolute Windows paths).
      "next-intl/config": "./i18n.ts",
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ui-avatars.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "http",  hostname: "localhost", port: "5000" },
    ],
  },
};

export default nextConfig;
