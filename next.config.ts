import type { NextConfig } from "next";

const legacyGuideRedirects = [
  ["/fokusthemen/digitale-transformation/digitalisierungsstrategie-kmu", "/ratgeber/digitalisierungsstrategie-kmu"],
  ["/en/fokusthemen/digitale-transformation/digitalisierungsstrategie-kmu", "/en/guides/digital-strategy-smes"],
  ["/fokusthemen/unternehmensstrategie/strategieprozess-kmu", "/ratgeber/strategieprozess-kmu"],
  ["/en/fokusthemen/unternehmensstrategie/strategieprozess-kmu", "/en/guides/strategy-process-smes"],
  ["/fokusthemen/vertriebmarketing/b2b-vertriebsstrategie", "/ratgeber/b2b-vertriebsstrategie"],
  ["/en/fokusthemen/vertriebmarketing/b2b-vertriebsstrategie", "/en/guides/b2b-sales-strategy"],
  ["/fokusthemen/veränderungsmanagement/change-management-vorgehen", "/ratgeber/change-management-vorgehen"],
  ["/en/fokusthemen/veränderungsmanagement/change-management-vorgehen", "/en/guides/change-management-approach"],
  ["/fokusthemen/prozessoptimierung/prozesse-analysieren-optimieren", "/ratgeber/prozesse-analysieren-optimieren"],
  ["/en/fokusthemen/prozessoptimierung/prozesse-analysieren-optimieren", "/en/guides/business-process-optimization"],
  ["/fokusthemen/projektmanagement/projekt-in-schieflage", "/ratgeber/projekt-in-schieflage"],
  ["/en/fokusthemen/projektmanagement/projekt-in-schieflage", "/en/guides/project-in-trouble"],
  ["/fokusthemen/risikomanagement/projektrisiken-frueh-erkennen", "/ratgeber/projektrisiken-frueh-erkennen"],
  ["/en/fokusthemen/risikomanagement/projektrisiken-frueh-erkennen", "/en/guides/identify-project-risks-early"],
  ["/executive-search/fuehrungskraefte-finden", "/ratgeber/fuehrungskraefte-finden"],
  ["/en/executive-search/fuehrungskraefte-finden", "/en/guides/finding-executives"],
  ["/fokusthemen/plm-pdm/teamcenter-beratung-schweiz", "/ratgeber/teamcenter-beratung-schweiz"],
  ["/en/fokusthemen/plm-pdm/teamcenter-beratung-schweiz", "/en/guides/teamcenter-consulting-switzerland"],
  ["/fokusthemen/plm-pdm/plm-pdm-einfuehrung", "/ratgeber/plm-pdm-einfuehrung"],
  ["/en/fokusthemen/plm-pdm/plm-pdm-einfuehrung", "/en/guides/plm-pdm-implementation"],
  ["/fokusthemen/plm-pdm/plm-vs-pdm", "/ratgeber/plm-vs-pdm"],
  ["/en/fokusthemen/plm-pdm/plm-vs-pdm", "/en/guides/plm-vs-pdm"],
].map(([source, destination]) => ({ source, destination, permanent: true }));

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...legacyGuideRedirects,
      {
        source: "/executive-search/expertise",
        destination: "/executive-search",
        permanent: true,
      },
      {
        source: "/leistungen/executive-search",
        destination: "/executive-search",
        statusCode: 301,
      },
      {
        source: "/en/leistungen/executive-search",
        destination: "/en/executive-search",
        statusCode: 301,
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
        destination: "/en/executive-search",
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
