import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudinary-hosted media (project covers, galleries) rendered via next/image.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
