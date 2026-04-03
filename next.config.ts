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
    // Add this to stop Next.js from blocking the Sanity CDN locally
    dangerouslyAllowLocalIP: true,
    unoptimized: true, // Disable Next.js's built-in image optimization to allow all external images without issues
  },
};
export default nextConfig;
