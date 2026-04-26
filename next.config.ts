import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/executive-search/expertise",
        destination: "/executive-search",
        permanent: true,
      },
    ];
  },
  images: {
    qualities: [75, 90, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "files.designer.hoststar.ch",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "basekit-product.s3-eu-west-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "files.designer.hoststar.ch",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.firebasestorage.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
