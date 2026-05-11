/**
 * JSON Schema for OpenAI Responses structured outputs (`text.format.type: json_schema`).
 * Keep in sync with {@link blogPipelineOutputSchema} in `src/cms/types/blog-pipeline.ts`.
 */
export const BLOG_PIPELINE_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "slug",
    "excerpt",
    "metaTitle",
    "metaDescription",
    "articleHtml",
    "researchSummary",
    "sources",
    "linkedinPost",
    "shortLinkedinPost",
    "xPost",
    "imageSearchQueries",
    "heroImageAlt",
  ],
  properties: {
    title: { type: "string" },
    slug: { type: "string", description: "URL slug: lowercase, hyphenated ASCII, no leading slash." },
    excerpt: { type: "string" },
    metaTitle: { type: "string" },
    metaDescription: { type: "string" },
    articleHtml: { type: "string", description: "Semantic HTML body only (no full document shell)." },
    researchSummary: {
      type: "string",
      description: "Short internal summary of what was researched and what is supported by sources.",
    },
    sources: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "url"],
        properties: {
          title: { type: "string" },
          url: { type: "string" },
        },
      },
    },
    linkedinPost: { type: "string" },
    shortLinkedinPost: { type: "string" },
    xPost: { type: "string" },
    imageSearchQueries: {
      type: "array",
      description:
        "Short English Unsplash search phrases (no URLs). Editorial Swiss-consulting mood: restrained architecture, texture, landscape, quiet workspace—not handshakes, laptop charts, or skyline clichés.",
      items: { type: "string" },
      minItems: 1,
      maxItems: 8,
    },
    heroImageAlt: {
      type: "string",
      description: "Concise German alt text for the hero image (accessibility); describes mood/subject, not file names.",
    },
  },
} as const;
