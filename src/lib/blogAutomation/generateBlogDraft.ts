import "server-only";

import OpenAI from "openai";
import { z } from "zod";

import { BLOG_PIPELINE_JSON_SCHEMA } from "@/lib/blog-pipeline/openai-json-schema";
import type { BlogAutomationSettings, BlogTopic } from "@/lib/blogAutomation/types";

const blogDraftSourceSchema = z.object({
  title: z.string(),
  url: z.string(),
});

/** Strict output shape after OpenAI Responses + web_search (matches structured JSON schema). */
export const blogAutomationDraftOutputSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string(),
  metaTitle: z.string(),
  metaDescription: z.string(),
  articleHtml: z.string(),
  researchSummary: z.string(),
  sources: z.array(blogDraftSourceSchema),
  linkedinPost: z.string(),
  shortLinkedinPost: z.string(),
  xPost: z.string(),
  imageSearchQueries: z.array(z.string().min(1)).min(1).max(8),
  heroImageAlt: z.string(),
});

export type BlogAutomationDraftOutput = z.infer<typeof blogAutomationDraftOutputSchema>;

export type GenerateBlogDraftParams = {
  settings: BlogAutomationSettings;
  topic: BlogTopic;
  /** Optional extra brand voice / constraints (e.g. global marketing guidelines). */
  abexisBrandInstructions?: string;
};

export type GenerateBlogDraftResult = {
  output: BlogAutomationDraftOutput;
  responseId: string;
};

function resolveModel(): string {
  return process.env.OPENAI_BLOG_MODEL?.trim() || "gpt-4.1-mini";
}

function formatScheduledFor(topic: BlogTopic): string {
  const ts = topic.scheduledFor;
  if (!ts || typeof ts.toDate !== "function") return "(nicht gesetzt)";
  try {
    return ts.toDate().toISOString();
  } catch {
    return "(nicht gesetzt)";
  }
}

function buildDeveloperInstructions(params: GenerateBlogDraftParams): string {
  const { settings } = params;
  const extra = params.abexisBrandInstructions?.trim();

  const mergedBrand = [settings.brandInstructions?.trim(), extra].filter(Boolean).join("\n\n");

  const articleLengthHint =
    settings.articleLength === "short"
      ? "Kürzerer Artikel: kompakt, weniger Absätze, keine Fülltexte."
      : settings.articleLength === "long"
        ? "Längerer Artikel: dürfen mehr Tiefe und Struktur haben, weiterhin präzise."
        : "Mittlere Länge: ausgewogen zwischen Tiefe und Lesbarkeit.";

  return `You are the editorial assistant for Abexis, a Swiss consulting firm.

Default audience: Swiss SME owners, board members, and executives — unless the automation settings or topic explicitly specify otherwise.
Default tone: calm, senior, precise, premium (professional German appropriate for Switzerland, e.g. de-CH unless settings say otherwise).
No hype, no clickbait, no breathless marketing.
Executive Search is one practice area at Abexis, not the definition of the entire firm.

Research & honesty:
- Use the web_search tool to ground non-obvious or time-sensitive facts where helpful.
- Never invent statistics, surveys, regulations, or quotations.
- Never fabricate citations or URLs.
- Every URL in "sources" must be a real URL returned from web_search results (or clearly tied to retrieved sources). If you did not use web search, sources may be empty.
- If something cannot be verified, omit it or phrase carefully without numeric precision.

Output:
- Respond with exactly one JSON object matching the schema (no markdown outside JSON).
- articleHtml: semantic HTML fragments for a CMS body (headings, paragraphs, lists, links) — no outer <html> document.
- Draft quality must be suitable for human editorial review before any publishing step.

Hero imagery (no URLs — server selects licensed photos separately):
- imageSearchQueries: 3–6 short English phrases suitable for stock photo search (Unsplash). Aim for calm Swiss-editorial mood: architecture detail, natural texture, lakes/alps restraint, minimal workspace still-life — never literal handshakes, grinning «teams», laptop dashboards, or skyscraper hero clichés.
- heroImageAlt: concise German alt text describing the intended visual for accessibility (not filenames).

Automation parameters (respect these):
- defaultLanguage / locale hint: ${settings.defaultLanguage}
- targetAudience (settings): ${settings.targetAudience}
- tone (settings): ${settings.tone}
- articleLength: ${settings.articleLength}. ${articleLengthHint}
- forbiddenTopics / exclusions (do not centre the piece on these): ${settings.forbiddenTopics?.trim() || "(none)"}

Brand & editorial instructions from settings:
${mergedBrand || "(none beyond defaults)"}`;
}

function buildUserPrompt(topic: BlogTopic): string {
  return `Produce one blog draft as JSON.

Topic title: ${topic.title}
Target keyword / SEO focus: ${topic.targetKeyword}
Audience (topic-level override if any): ${topic.audience || "(use settings default)"}
Angle / thesis: ${topic.angle || "(none)"}
Editor notes: ${topic.notes || "(none)"}
Priority (numeric): ${topic.priority}
Scheduled for (ISO timestamp if set): ${formatScheduledFor(topic)}

Use web_search where it materially improves factual grounding for Swiss / SME-relevant context. Then write the article and social snippets.`;
}

/**
 * Server-only: calls OpenAI Responses API with web_search and validates output with Zod.
 */
export async function generateBlogDraft(params: GenerateBlogDraftParams): Promise<GenerateBlogDraftResult> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("[blogAutomation] Missing OPENAI_API_KEY.");
  }

  const model = resolveModel();
  const client = new OpenAI({ apiKey });

  const response = await client.responses.parse({
    model,
    tools: [
      {
        type: "web_search",
        user_location: { type: "approximate", country: "CH", city: "Zürich", region: "Zürich" },
      },
    ],
    tool_choice: "auto",
    include: ["web_search_call.action.sources"],
    instructions: buildDeveloperInstructions(params),
    input: buildUserPrompt(params.topic),
    text: {
      format: {
        type: "json_schema",
        name: "abexis_blog_automation_draft_v2",
        strict: true,
        schema: BLOG_PIPELINE_JSON_SCHEMA as unknown as Record<string, unknown>,
      },
    },
  });

  const raw = response.output_parsed ?? safeParseOutputText(response);

  const parsed = blogAutomationDraftOutputSchema.safeParse(raw);
  if (!parsed.success) {
    const detail = parsed.error.flatten().fieldErrors;
    throw new Error(`[blogAutomation] Invalid model JSON: ${JSON.stringify(detail)}`);
  }

  return {
    output: parsed.data,
    responseId: response.id,
  };
}

function safeParseOutputText(response: { output_text?: string }): unknown {
  const text = response.output_text?.trim();
  if (!text) {
    throw new Error("[blogAutomation] Empty Responses output (no JSON).");
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error("[blogAutomation] Responses output_text is not valid JSON.");
  }
}
