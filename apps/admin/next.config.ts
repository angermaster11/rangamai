import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudinary-hosted media renders in previews (list + upload results).
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
