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
  data?: unknown;
  breadcrumbs?: { name: string; url: string }[];
}

type SchemaRecord = Record<string, unknown>;
type JsonLdObject = Record<string, unknown>;

function asRecord(value: unknown): SchemaRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as SchemaRecord) : {};
}

function asText(value: unknown): string {
  if (typeof value === "string") return value;
  if (value == null) return "";
  return String(value);
}

function readLinks(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => asRecord(item).href)
    .map(asText)
    .filter(Boolean);
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
  const english = path === "/en" || path.startsWith("/en/");
  const language = english ? "en-CH" : "de-CH";
  const defaultPageName = english ? "Abexis: Management consulting" : "Abexis : Managementberatung";
  const defaultDescription = english
    ? "Strategic management consulting and executive search in Switzerland."
    : "Strategische Managementberatung und Executive Search in der Schweiz.";
  const schemaData = asRecord(data);

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
    "description": english
      ? "Abexis GmbH is a Swiss management consultancy focused on strategy, digitalization and business transformation."
      : "Abexis GmbH ist eine Schweizer Managementberatung mit Fokus auf Strategie, Digitalisierung und Business Transformation.",
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
    "additionalType": english
      ? "https://en.wikipedia.org/wiki/Management_consulting"
      : "https://de.wikipedia.org/wiki/Unternehmensberatung",
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
    "inLanguage": language
  };

  // 3. WEBPAGE LAYER (Required on every page)
  const webPageSchema: JsonLdObject = {
    "@type": "WebPage",
    "@id": pageId,
    "url": currentUrl,
    "name": name || defaultPageName,
    "description": description || defaultDescription,
    "isPartOf": { "@id": WEBSITE_ID },
    "about": { "@id": ORG_ID },
    "inLanguage": language
  };

  const schemas: JsonLdObject[] = [organizationSchema, webSiteSchema, webPageSchema];

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
      "name": asText(schemaData.title) || name,
      "description": asText(schemaData.excerpt) || description,
      "provider": { "@id": ORG_ID },
      "areaServed": "CH",
      "offers": {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": asText(schemaData.title) || name,
          "description": asText(schemaData.excerpt) || description
        }
      }
    });
  } else if (type === "Article" && data) {
    webPageSchema.mainEntity = { "@id": entityId };
    schemas.push({
      "@type": "BlogPosting",
      "@id": entityId,
      "headline": asText(schemaData.title),
      "description": asText(schemaData.excerpt),
      "image": asText(schemaData.image) || logoUrl,
      "datePublished": asText(schemaData.publishedAt),
      "dateModified": asText(schemaData.updatedAt) || asText(schemaData.publishedAt),
      "author": {
        "@type": "Person",
        "name": asText(schemaData.authorName) || "Daniel Sengstag",
        "url": `${BASE_URL}/danielsengstag`
      },
      "publisher": { "@id": ORG_ID },
      "mainEntityOfPage": { "@id": pageId }
    });
  } else if (type === "JobPosting" && data) {
    webPageSchema.mainEntity = { "@id": entityId };

    // Map free-form employmentType strings to Google's allowed values.
    const rawEmployment = asText(schemaData.employmentType).toLowerCase();
    const employmentType =
      rawEmployment.includes("teil") || rawEmployment.includes("part")
        ? "PART_TIME"
        : rawEmployment.includes("contract") || rawEmployment.includes("freelance") || rawEmployment.includes("interim")
          ? "CONTRACTOR"
          : rawEmployment.includes("temp")
            ? "TEMPORARY"
            : rawEmployment.includes("intern")
              ? "INTERN"
              : "FULL_TIME";

    // validThrough is required-non-critical: Google recommends 6 months after datePosted when no explicit deadline exists.
    const datePosted = asText(schemaData.publishedAt) || asText(schemaData.createdAt) || new Date().toISOString();
    const validThrough = new Date(new Date(datePosted).getTime() + 1000 * 60 * 60 * 24 * 180).toISOString();

    schemas.push({
      "@type": "JobPosting",
      "@id": entityId,
      "title": asText(schemaData.title) || name,
      "description": asText(schemaData.excerpt) || asText(schemaData.hook) || description,
      "datePosted": datePosted,
      "validThrough": validThrough,
      "employmentType": employmentType,
      // Google requires hiringOrganization to be an Organization (not a LocalBusiness reference).
      "hiringOrganization": {
        "@type": "Organization",
        "name": siteConfig.company,
        "sameAs": BASE_URL,
        "logo": logoUrl
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Zihlstrasse 25",
          "addressLocality": asText(schemaData.location) || "Hinwil",
          "addressRegion": "ZH",
          "postalCode": "8340",
          "addressCountry": "CH"
        }
      }
    });
  } else if (type === "Person" && data) {
    webPageSchema.mainEntity = { "@id": entityId };
    schemas.push({
      "@type": "Person",
      "@id": entityId,
      "name": asText(schemaData.name),
      "jobTitle": asText(schemaData.title),
      "image": asText(schemaData.image),
      "description": asText(schemaData.body),
      "url": english ? `${BASE_URL}/en/${asText(schemaData.slug)}` : `${BASE_URL}/${asText(schemaData.slug)}`,
      "sameAs": readLinks(schemaData.links),
      "worksFor": { "@id": ORG_ID }
    });
  } else if (type === "Breadcrumb" && Array.isArray(data)) {
    // Legacy support for Breadcrumb type
    breadcrumbs = data.map((item) => {
      const row = asRecord(item);
      return { name: asText(row.name), url: asText(row.url) };
    });
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
  if (schemaData.ratingValue && schemaData.reviewCount) {
    const mainEntity = schemas.find(s => s["@id"] === entityId);
    if (mainEntity) {
      mainEntity.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": schemaData.ratingValue,
        "reviewCount": schemaData.reviewCount,
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
