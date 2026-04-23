import { siteConfig } from "@/data/pages";
import { logoUrl } from "@/data/site-images";

type SchemaType = "Organization" | "Person" | "Service" | "Article" | "BreadcrumbList" | "WebSite";

type PersonData = { name: string; title?: string; body: string; image?: string; slug: string; links?: Array<{ href: string }> };
type ServiceData = { title: string; excerpt?: string };
type ArticleData = { title: string; excerpt?: string | null; image?: string | null; publishedAt?: string | null; authorName?: string | null };
type BreadcrumbItem = { name: string; url: string };

type SchemaData = PersonData | ServiceData | ArticleData | BreadcrumbItem[];

interface SchemaMarkupProps {
  type?: SchemaType;
  data?: SchemaData;
}

export function SchemaMarkup({ type, data }: SchemaMarkupProps) {
  const baseUrl = "https://www.abexis.ch";

  // Global Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    "name": siteConfig.company,
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": logoUrl,
      "width": "128",
      "height": "44"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Zihlstrasse 25",
      "addressLocality": "Hinwil",
      "postalCode": "8340",
      "addressCountry": "CH"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": siteConfig.phoneTel,
      "contactType": "customer service",
      "email": siteConfig.emailPrimary,
      "areaServed": "CH",
      "availableLanguage": ["German", "English", "French", "Italian"]
    },
    "sameAs": [
      siteConfig.linkedin,
      siteConfig.xing
    ].filter(Boolean)
  };

  const schemas: Record<string, unknown>[] = [organizationSchema];

  if (type === "WebSite") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      "url": baseUrl,
      "name": "Abexis",
      "publisher": { "@id": `${baseUrl}/#organization` },
      "inLanguage": "de-CH"
    });
  }

  if (type === "Person" && data && !Array.isArray(data) && "slug" in data) {
    const d = data as PersonData;
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Person",
      "name": d.name,
      "jobTitle": d.title,
      "description": d.body.substring(0, 200) + "...",
      "image": d.image,
      "worksFor": { "@id": `${baseUrl}/#organization` },
      "url": `${baseUrl}/${d.slug}`,
      "sameAs": d.links?.map((l) => l.href) ?? []
    });
  }

  if (type === "Service" && data && !Array.isArray(data) && "title" in data) {
    const d = data as ServiceData;
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Service",
      "name": d.title,
      "description": d.excerpt,
      "provider": { "@id": `${baseUrl}/#organization` },
      "areaServed": "CH",
      "serviceType": "Consulting"
    });
  }

  if (type === "Article" && data && !Array.isArray(data) && "title" in data) {
    const d = data as ArticleData;
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": d.title,
      "description": d.excerpt,
      "image": d.image || logoUrl,
      "datePublished": d.publishedAt,
      "author": {
        "@type": "Person",
        "name": d.authorName || "Abexis Team"
      },
      "publisher": { "@id": `${baseUrl}/#organization` }
    });
  }

  if (type === "BreadcrumbList" && Array.isArray(data)) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": data.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`
      }))
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.length === 1 && !type ? schemas[0] : schemas) }}
    />
  );
}
