import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Fix workspace root inference for deterministic builds across environments
  turbopack: {
    root: path.resolve(__dirname),
  },
  // GitHub Pages usually serves from a subpath (e.g. /QuizzMe)
  // If the user uses a custom domain at root, basePath is not needed.
  // If serving from https://DYAI2025.github.io/QuizzMe/, we need basePath: '/QuizzMe'.
  // We will assume root for now or user will configure custom domain.
  // Safest for standard GH Pages repo deployment is often to set basePath, but let's stick to standard export first.
};

export default nextConfig;
