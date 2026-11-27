import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The browser (web and Mini App) calls /api on its own origin; Next forwards it to the backend.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${process.env.BACKEND_URL}/api/:path*` }];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
