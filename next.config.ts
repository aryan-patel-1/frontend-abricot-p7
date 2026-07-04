import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async rewrites() {
    return [
      {
        // garde la route ia montée avec son préfixe api côté express
        source: "/api/ai/:path*",
        destination: "http://localhost:8000/api/ai/:path*",
      },
      {
        // relaie les appels frontend vers le serveur express local
        source: "/api/:path*",
        destination: "http://localhost:8000/:path*",
      },
    ];
  },
};

export default nextConfig;
