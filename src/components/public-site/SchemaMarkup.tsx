import { siteConfig } from "@/data/pages";
import { logoUrl } from "@/data/site-images";

const BASE_URL = "https://www.abexis.ch";
const ORG_ID = `${BASE_URL}/#organization`;
const WEBSITE_ID = `${BASE_URL}/#website`;

type SchemaType = "Home" | "About" | "Contact" | "Service" | "Product" | "Article" | "Breadcrumb" | "Collection" | "JobPosting" | "Person";

interface SchemaMarkupProps {
  path?: string; // e.g. "/ueber-uns"
  name?: string;
  description?: string;
  type?: SchemaType;
  data?: any;
  breadcrumbs?: { name: string; url: string }[];
}

/**
 * PRODUCTION-READY STRUCTURED DATA SYSTEM
 * 
 * Implements a dual-layer entity architecture:
 * 1. Global Layer (Organization & WebSite)
 * 2. Page Layer (WebPage & MainEntity)
 * 
 * All entities are linked via stable @id values to ensure AI and Search Engine comprehension.
 */
export function SchemaMarkup({ path = "", name, description, type, data, breadcrumbs }: SchemaMarkupProps) {
  const currentUrl = `${BASE_URL}${path === "/" ? "" : path}`;
  const pageId = `${currentUrl}/#webpage`;
  const entityId = `${currentUrl}/#entity`;

  // 1. GLOBAL IDENTITY (LocalBusiness / Organization)
  const organizationSchema = {
    "@type": "LocalBusiness",
    "@id": ORG_ID,
    "name": siteConfig.company,
    "url": BASE_URL,
    "logo": {
      "@type": "ImageObject",
      "url": logoUrl,
      "width": "1200",
      "height": "630"
    },
    "image": logoUrl,
    "description": "Abexis GmbH ist eine Schweizer Managementberatung mit Fokus auf Strategie, Digitalisierung und Business Transformation.",
    "telephone": siteConfig.phoneTel,
    "email": siteConfig.emailPrimary,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Zihlstrasse 25",
      "addressLocality": "Hinwil",
      "postalCode": "8340",
      "addressCountry": "CH"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 47.301389,
      "longitude": 8.843611
    },
    "hasMap": "https://maps.app.goo.gl/S7x9L6u5hZf9Z8pC9", // Placeholder, using actual if found
    "areaServed": {
      "@type": "Country",
      "name": "CH"
    },
    "additionalType": "https://de.wikipedia.org/wiki/Unternehmensberatung",
    "sameAs": [
      siteConfig.linkedin
    ].filter(Boolean)
  };

  // 2. WEBSITE LAYER
  const webSiteSchema = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    "url": BASE_URL,
    "name": "Abexis",
    "publisher": { "@id": ORG_ID },
    "inLanguage": "de-CH"
  };

  // 3. WEBPAGE LAYER (Required on every page)
  const webPageSchema: any = {
    "@type": "WebPage",
    "@id": pageId,
    "url": currentUrl,
    "name": name || "Abexis : Managementberatung",
    "description": description || "Strategische Managementberatung und Executive Search in der Schweiz.",
    "isPartOf": { "@id": WEBSITE_ID },
    "about": { "@id": ORG_ID },
    "inLanguage": "de-CH"
  };

  const schemas: any[] = [organizationSchema, webSiteSchema, webPageSchema];

  // 4. MAIN ENTITY LAYER (Specific to page type)
  if (type === "Home") {
    webPageSchema.mainEntity = { "@id": ORG_ID };
  } else if (type === "About") {
    webPageSchema.mainEntity = { "@id": ORG_ID };
  } else if (type === "Contact") {
    webPageSchema.mainEntity = { "@id": ORG_ID };
  } else if (type === "Service" && data) {
    webPageSchema.mainEntity = { "@id": entityId };
    schemas.push({
      "@type": "Service",
      "@id": entityId,
      "name": data.title || name,
      "description": data.excerpt || description,
      "provider": { "@id": ORG_ID },
      "areaServed": "CH",
      "offers": {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": data.title || name,
          "description": data.excerpt || description
        }
      }
    });
  } else if (type === "Article" && data) {
    webPageSchema.mainEntity = { "@id": entityId };
    schemas.push({
      "@type": "BlogPosting",
      "@id": entityId,
      "headline": data.title,
      "description": data.excerpt,
      "image": data.image || logoUrl,
      "datePublished": data.publishedAt,
      "dateModified": data.updatedAt || data.publishedAt,
      "author": {
        "@type": "Person",
        "name": data.authorName || "Daniel Sengstag",
        "url": `${BASE_URL}/danielsengstag`
      },
      "publisher": { "@id": ORG_ID },
      "mainEntityOfPage": { "@id": pageId }
    });
  } else if (type === "JobPosting" && data) {
    webPageSchema.mainEntity = { "@id": entityId };
    schemas.push({
      "@type": "JobPosting",
      "@id": entityId,
      "title": data.title || name,
      "description": data.excerpt || data.hook || description,
      "datePosted": data.publishedAt || data.createdAt,
      "employmentType": data.employmentType || "FULL_TIME",
      "hiringOrganization": { "@id": ORG_ID },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": data.location || "Schweiz",
          "addressCountry": "CH"
        }
      }
    });
  } else if (type === "Person" && data) {
    webPageSchema.mainEntity = { "@id": entityId };
    schemas.push({
      "@type": "Person",
      "@id": entityId,
      "name": data.name,
      "jobTitle": data.title,
      "image": data.image,
      "description": data.body,
      "url": `${BASE_URL}/${data.slug}`,
      "sameAs": (data.links || []).map((l: any) => l.href),
      "worksFor": { "@id": ORG_ID }
    });
  } else if (type === "Breadcrumb" && Array.isArray(data)) {
    // Legacy support for Breadcrumb type
    breadcrumbs = data;
  }

  if (breadcrumbs && Array.isArray(breadcrumbs)) {
    schemas.push({
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`
      }))
    });
  }

  // Inject Ratings ONLY if valid data exists (Strict Google Rules)
  if (data?.ratingValue && data?.reviewCount) {
    const mainEntity = schemas.find(s => s["@id"] === entityId);
    if (mainEntity) {
      mainEntity.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": data.ratingValue,
        "reviewCount": data.reviewCount,
        "bestRating": "5",
        "worstRating": "1"
      };
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": schemas
        })
      }}
    />
  );
}
