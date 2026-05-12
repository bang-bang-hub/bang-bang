import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export — generates a fully pre-rendered site in /out.
  // Run `next build` to produce the output directory.
  // Serve with any static host (Azure SWA, Netlify, Vercel static, etc.).
  output: "export",

  images: {
    unoptimized: true,
  },

  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
