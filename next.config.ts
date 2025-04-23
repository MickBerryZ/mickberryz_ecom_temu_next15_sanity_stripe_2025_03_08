import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["cdn.sanity.io", "images.unsplash.com", "res.cloudinary.com"],
  },
};

export default nextConfig;
