import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/executive-search/expertise",
        destination: "/executive-search",
        permanent: true,
      },
      {
        source: "/projectfitcheck",
        destination: "/projectrealitycheck",
        statusCode: 301,
      },
      {
        source: "/en/projectfitcheck",
        destination: "/en/projectrealitycheck",
        statusCode: 301,
      },
      {
        source: "/en/services",
        destination: "/en/leistungen",
        statusCode: 301,
      },
      {
        source: "/en/services/executive-search",
        destination: "/en/leistungen/executive-search",
        statusCode: 301,
      },
      {
        source: "/en/contact",
        destination: "/en/kontakt",
        statusCode: 301,
      },
      {
        source: "/en/about",
        destination: "/en/ueber-uns",
        statusCode: 301,
      },
      {
        source: "/en/insights",
        destination: "/en/blog",
        statusCode: 301,
      },
      {
        source: "/en/legal",
        destination: "/en/legal-policy",
        statusCode: 301,
      },
      {
        source: "/en/privacy",
        destination: "/en/privacy-policy",
        statusCode: 301,
      },
      {
        source: "/en/blog/:slug",
        destination: "/blog/:slug",
        statusCode: 301,
      },
      {
        source: "/en/executive-search/vacancies",
        destination: "/en/executive-search/vakanzen",
        statusCode: 301,
      },
      {
        source: "/en/executive-search/vacancies/:slug",
        destination: "/en/executive-search/vakanzen/:slug",
        statusCode: 301,
      },
      {
        source: "/en/topics/digital-transformation",
        destination: "/en/fokusthemen/digitale-transformation",
        statusCode: 301,
      },
      {
        source: "/en/topics/corporate-strategy",
        destination: "/en/fokusthemen/unternehmensstrategie",
        statusCode: 301,
      },
      {
        source: "/en/topics/sales-marketing",
        destination: "/en/fokusthemen/vertriebmarketing",
        statusCode: 301,
      },
      {
        source: "/en/topics/change-management",
        destination: "/en/fokusthemen/veränderungsmanagement",
        statusCode: 301,
      },
      {
        source: "/en/topics/process-optimization",
        destination: "/en/fokusthemen/prozessoptimierung",
        statusCode: 301,
      },
      {
        source: "/en/topics/project-management",
        destination: "/en/fokusthemen/projektmanagement",
        statusCode: 301,
      },
      {
        source: "/admin/settings",
        destination: "/admin",
        statusCode: 301,
      },
    ];
  },
  images: {
    /**
     * Bypass Vercel’s hosted Image Optimization (`/_next/image`) so we stay under plan limits.
     * `next/image` still gives stable layout (width/height, lazy loading); assets should be
     * compressed at upload (WebP/JPEG ~80–85 quality, sane dimensions). Alternatives: Pro tier,
     * or an external CDN loader (Imgix/Cloudinary) if we need edge resizing later.
     */
    unoptimized: true,
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
