import { siteConfig } from "@/data/pages";
import { logoUrl } from "@/data/site-images";

type SchemaType = "Organization" | "Person" | "Service" | "Article" | "BreadcrumbList" | "WebSite";

interface SchemaMarkupProps {
  type?: SchemaType;
  data?: any;
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

  const schemas: any[] = [organizationSchema];

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

  if (type === "Person" && data) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Person",
      "name": data.name,
      "jobTitle": data.title,
      "description": data.body.substring(0, 200) + "...",
      "image": data.image,
      "worksFor": { "@id": `${baseUrl}/#organization` },
      "url": `${baseUrl}/${data.slug}`,
      "sameAs": data.links?.map((l: any) => l.href) || []
    });
  }

  if (type === "Service" && data) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Service",
      "name": data.title,
      "description": data.excerpt,
      "provider": { "@id": `${baseUrl}/#organization` },
      "areaServed": "CH",
      "serviceType": "Consulting"
    });
  }

  if (type === "Article" && data) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": data.title,
      "description": data.excerpt,
      "image": data.image || logoUrl,
      "datePublished": data.publishedAt,
      "author": {
        "@type": "Person",
        "name": data.authorName || "Abexis Team"
      },
      "publisher": { "@id": `${baseUrl}/#organization` }
    });
  }

  if (type === "BreadcrumbList" && data) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": data.map((item: any, index: number) => ({
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
