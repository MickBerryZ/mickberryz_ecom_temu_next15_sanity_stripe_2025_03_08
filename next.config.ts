import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    // Add this to stop Next from blocking the Sanity CDN locally
    dangerouslyAllowSVG: true,
  },
  experimental: {
    // This stops the Next.js local private IP blocking
    restrictImagePrivateIp: false,
  },
};
export default nextConfig;
