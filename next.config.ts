import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    PORT: process.env.PORT || "8080",
    NEXT_PUBLIC_API_URL:
      "https://tech0-gen-7-step4-student-finalproject-4-exeabgd9eyekb7c2.canadacentral-01.azurewebsites.net",
  },
  reactStrictMode: false,
  // Allow importing CSS from node_modules
  transpilePackages: ["react-leaflet", "leaflet"],

  experimental: {
    // Configure Turbopack options properly
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },

  // Configure build cache directory
  distDir: ".next",
  // Enable gzip compression for better performance
  compress: true,
};

export default nextConfig;
