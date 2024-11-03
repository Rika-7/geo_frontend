import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
  // Allow importing CSS from node_modules
  transpilePackages: ["react-leaflet", "leaflet"],
};

export default nextConfig;
