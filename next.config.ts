import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.pandascore.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn-api.pandascore.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.pandascore.co",
        pathname: "/**",
      },
    ],
    minimumCacheTTL: 3600,
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
