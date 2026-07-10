import type { NextConfig } from "next";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async rewrites() {
    return [
      {
        // garde la route ia montée avec son préfixe api côté express
        source: "/api/ai/:path*",
        destination: `${apiBaseUrl}/api/ai/:path*`,
      },
      {
        // relaie les appels frontend vers le serveur express local
        source: "/api/:path*",
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;