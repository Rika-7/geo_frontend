import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    PORT: process.env.PORT || "8080",
  },
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
  // Allow importing CSS from node_modules
  transpilePackages: ["react-leaflet", "leaflet"],
};

export default nextConfig;
