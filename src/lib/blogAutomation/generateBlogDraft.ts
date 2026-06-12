import "server-only";

import OpenAI from "openai";
import { z } from "zod";

import { normalizeEscapedBlogHtml } from "@/lib/cms/sanitize-blog-html";
import { BLOG_PIPELINE_JSON_SCHEMA } from "@/lib/blog-pipeline/openai-json-schema";
import type { BlogAutomationSettings, BlogTopic } from "@/lib/blogAutomation/types";

const BLOG_DRAFT_MAX_OUTPUT_TOKENS = 14_000;
const BLOG_DRAFT_RETRY_MAX_OUTPUT_TOKENS = 18_000;
const DIRECT_PROMPT_ARTICLE_MAX_OUTPUT_TOKENS = 16_000;
const DIRECT_PROMPT_METADATA_MAX_OUTPUT_TOKENS = 7_000;
const BLOG_URL_PLACEHOLDER = "{{BLOG_URL}}";
const BUSINESS_TECH_IMAGE_QUERIES = [
  "business technology",
  "enterprise software",
  "digital transformation",
  "IT project management",
  "business strategy meeting",
  "software implementation",
] as const;

/** Strict output shape after OpenAI Responses + web_search (matches structured JSON schema). */
export const blogAutomationDraftOutputSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string(),
  metaTitle: z.string(),
  metaDescription: z.string(),
  articleHtml: z.string(),
  researchSummary: z.string(),
  linkedinPost: z.string(),
  imageSearchQueries: z.array(z.string().min(1)).min(1).max(8),
  heroImageAlt: z.string(),
});

export type BlogAutomationDraftOutput = z.infer<typeof blogAutomationDraftOutputSchema>;

const directPromptMetadataSchema = blogAutomationDraftOutputSchema.omit({ articleHtml: true });

type DirectPromptMetadata = z.infer<typeof directPromptMetadataSchema>;

const DIRECT_PROMPT_METADATA_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "slug",
    "excerpt",
    "metaTitle",
    "metaDescription",
    "researchSummary",
    "linkedinPost",
    "imageSearchQueries",
    "heroImageAlt",
  ],
  properties: {
    title: { type: "string" },
    slug: { type: "string" },
    excerpt: { type: "string" },
    metaTitle: { type: "string" },
    metaDescription: { type: "string" },
    researchSummary: { type: "string" },
    linkedinPost: { type: "string" },
    imageSearchQueries: {
      type: "array",
      minItems: 3,
      maxItems: 6,
      items: { type: "string" },
    },
    heroImageAlt: { type: "string" },
  },
} as const;

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
For German text, always use Swiss spelling: write "ss", never "ß".
No hype, no clickbait, no breathless marketing.
Executive Search is one practice area at Abexis, not the definition of the entire firm.

Research & honesty:
- Use the web_search tool to ground non-obvious or time-sensitive facts where helpful.
- Never invent statistics, surveys, regulations, or quotations.
- Never fabricate citations or URLs.
- Do not add source lists, footnotes, citation links, "Quellen", "Weiterlesen", or external source URLs to articleHtml.
- Do not include source links in the JSON output.
- If something cannot be verified, omit it or phrase carefully without numeric precision.

Output:
- Respond with exactly one JSON object matching the schema (no markdown outside JSON).
- articleHtml: semantic HTML fragments for a CMS body (headings, paragraphs, lists, links) — no outer <html> document.
- Draft quality must be suitable for human editorial review before any publishing step.
- linkedinPost: one short German LinkedIn teaser for Daniel Sengstag's LinkedIn profile. 500-800 characters, 2-4 short paragraphs, no hashtags unless the editor prompt explicitly asks for them, no source links, no external links. End with the placeholder {{BLOG_URL}} on its own final line exactly once.

Hero imagery (no URLs — server selects licensed photos separately):
- imageSearchQueries: 3–6 short English phrases suitable for stock photo search (Unsplash). Prefer business/technology/project imagery such as business technology, enterprise software, digital transformation, IT project management, business strategy meeting, software implementation, change management, workflow automation. Avoid Swiss architecture, landscapes, mountains, flags, grinning teams, handshakes, laptop dashboards, or skyscraper clichés.
- heroImageAlt: concise German alt text describing the intended visual for accessibility (not filenames).

Automation parameters (respect these):
- defaultLanguage / locale hint: ${settings.defaultLanguage}
- targetAudience (settings): ${settings.targetAudience}
- tone (settings): ${settings.tone}
- articleLength: ${settings.articleLength}. ${articleLengthHint}
- forbiddenTopics / exclusions (do not centre the piece on these): ${settings.forbiddenTopics?.trim() || "(none)"}

Direct CMS prompts:
- If the editor notes say "Direkter CMS-Prompt", treat the notes as the primary writing brief.
- Follow concrete structure, thesis, examples, language, and length requests from that prompt unless they conflict with factual accuracy, brand safety, or forbidden topics.
- Do not dilute a direct prompt into a generic Abexis article.

Brand & editorial instructions from settings:
${mergedBrand || "(none beyond defaults)"}`;
}

function buildUserPrompt(topic: BlogTopic, retryNote = false): string {
  const retryInstruction = retryNote
    ? "\n\nImportant retry instruction: the previous draft response could not be parsed as complete JSON. Regenerate the full draft as one valid JSON object. Keep the article focused enough that the JSON closes completely."
    : "";

  return `Produce one blog draft as JSON.

Topic title: ${topic.title}
Target keyword / SEO focus: ${topic.targetKeyword}
Audience (topic-level override if any): ${topic.audience || "(use settings default)"}
Angle / thesis: ${topic.angle || "(none)"}
Editor notes: ${topic.notes || "(none)"}
Priority (numeric): ${topic.priority}
Scheduled for (ISO timestamp if set): ${formatScheduledFor(topic)}

Use web_search where it materially improves factual grounding for Swiss / SME-relevant context. Then write the article and social snippets.${retryInstruction}`;
}

function isDirectCmsPrompt(topic: BlogTopic): boolean {
  return topic.notes.includes("Direkter CMS-Prompt");
}

function extractDirectCmsPrompt(topic: BlogTopic): string {
  const notes = topic.notes.trim();
  const firstBlankLine = notes.search(/\n\s*\n/);
  if (firstBlankLine >= 0) {
    const afterHeader = notes.slice(firstBlankLine).replace(/^\s+/, "");
    if (afterHeader.trim()) return afterHeader.trim();
  }
  return (notes || topic.title).trim();
}

function stripHtmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function countWords(html: string): number {
  return stripHtmlToText(html).match(/[\p{L}\p{N}][\p{L}\p{N}'’.-]*/gu)?.length ?? 0;
}

function extractRequestedWordRange(prompt: string): { min: number; max: number } | null {
  const normalized = prompt
    .replace(/[’']/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const match = normalized.match(/(\d{3,5})\s*[–—-]\s*(\d{3,5})\s*W[öo]rter/i);
  if (!match) return null;
  const min = Number.parseInt(match[1] ?? "", 10);
  const max = Number.parseInt(match[2] ?? "", 10);
  if (!Number.isFinite(min) || !Number.isFinite(max) || min <= 0 || max < min) return null;
  return { min, max };
}

function normalizeGeneratedHtml(text: string): string {
  return cleanGeneratedArticleHtml(text
    .trim()
    .replace(/^```(?:html)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .replace(/^<article[^>]*>/i, "")
    .replace(/<\/article>$/i, "")
    .trim());
}

function toSwissGerman(value: string): string {
  return value.replace(/ß/g, "ss").replace(/ẞ/g, "SS");
}

function stripModelCodeFences(value: string): string {
  return value
    .trim()
    .replace(/^```(?:html|json|markdown|md)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

function cleanGeneratedArticleHtml(value: string): string {
  let html = toSwissGerman(normalizeEscapedBlogHtml(stripModelCodeFences(value)));
  html = html.replace(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi, (_m, text) => `<h2>${String(text).trim()}</h2>`);

  const stopHeadingPattern =
    /<h[2-6]\b[^>]*>\s*(?:Bildersuche(?:[-\s]Anfragen)?|Alt[-\s]?Text(?:\s+für\s+das\s+Titelbild)?|LinkedIn|Social(?:\s*Media)?|Meta(?:daten)?|SEO|Quellen|Sources)\s*<\/h[2-6]>/i;
  const stopMatch = html.search(stopHeadingPattern);
  if (stopMatch >= 0) {
    html = html.slice(0, stopMatch).trim();
  }

  html = html
    .replace(/<p\b[^>]*>[\s\S]*?(?:\{\{BLOG_URL\}\}|BLOG_URL|Für weitere Informationen|besuchen Sie unsere Webseite|Bildersuche|Unsplash|Alt[-\s]?Text)[\s\S]*?<\/p>/gi, "")
    .replace(/<li\b[^>]*>[\s\S]*?(?:\{\{BLOG_URL\}\}|BLOG_URL|Bildersuche|Unsplash|Alt[-\s]?Text)[\s\S]*?<\/li>/gi, "")
    .replace(/\{\{BLOG_URL\}\}/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return html;
}

function buildDirectArticleInstructions(params: GenerateBlogDraftParams): string {
  const { settings } = params;
  const extra = params.abexisBrandInstructions?.trim();
  const mergedBrand = [settings.brandInstructions?.trim(), extra].filter(Boolean).join("\n\n");

  return `You are the senior editorial writer for Abexis, a Swiss consulting firm.

Write the article from the editor prompt as the binding brief.
Default language is ${settings.defaultLanguage}; for German use Swiss German conventions and avoid "ß".
Tone: ${settings.tone || "analytical, precise, experienced, not academic"}.
Audience: ${settings.targetAudience || "Swiss SME executives, boards, sponsors, CIOs, CFOs, and project leaders"}.

Non-negotiables:
- Follow the editor prompt closely: thesis, structure, keywords, exclusions, tone, and requested length.
- Do not turn the prompt into a generic explanation if it asks for a specific argument.
- Use semantic HTML fragments only: paragraphs, h2/h3 headings, ul/ol/li, strong where useful.
- Do not output JSON, Markdown, code fences, <html>, <body>, or an <h1>.
- Do not add source lists, footnotes, citation links, "Quellen", "Weiterlesen", or external source URLs.
- Do not add a CTA paragraph with a blog URL placeholder; the article is already the blog post.
- Do not include image-search terms, alt text, metadata, SEO notes, LinkedIn text, or any implementation notes in the article body.
- Never invent statistics, surveys, regulations, quotations, or named references.
- If a factual point is uncertain, phrase it as experienced project judgement rather than as a sourced fact.
- Keep Abexis positioned as a practical advisor for project implementation, project steering, risk management, and transformation work.

Forbidden topics / exclusions from settings:
${settings.forbiddenTopics?.trim() || "(none)"}

Brand & editorial instructions from settings:
${mergedBrand || "(none beyond defaults)"}`;
}

function buildDirectArticlePrompt(params: GenerateBlogDraftParams, retryInstruction?: string): string {
  const prompt = extractDirectCmsPrompt(params.topic);
  return `Write the complete blog article for abexis.ch from this editor prompt.

Topic title: ${params.topic.title}
SEO focus: ${params.topic.targetKeyword || "(use the editor prompt)"}

Editor prompt:
${prompt}

${retryInstruction ? `Revision instruction:\n${retryInstruction}\n\n` : ""}Return only the article HTML fragment.`;
}

async function createDirectArticleResponse(params: {
  client: OpenAI;
  generationParams: GenerateBlogDraftParams;
  retryInstruction?: string;
}): Promise<BlogDraftResponse> {
  const response = await params.client.responses.create({
    model: resolveModel(),
    instructions: buildDirectArticleInstructions(params.generationParams),
    input: buildDirectArticlePrompt(params.generationParams, params.retryInstruction),
    max_output_tokens: DIRECT_PROMPT_ARTICLE_MAX_OUTPUT_TOKENS,
  });

  return response as BlogDraftResponse;
}

function parseTextResponse(response: BlogDraftResponse, fallbackMessage: string): string {
  if (response.status === "incomplete" || response.incomplete_details?.reason) {
    const reason = response.incomplete_details?.reason ?? "unknown";
    throw new Error(
      reason === "max_output_tokens"
        ? fallbackMessage
        : `[blogAutomation] Der KI-Text wurde unvollständig zurückgegeben (${reason}). Bitte erneut versuchen.`,
    );
  }

  const text = response.output_text?.trim();
  if (!text) {
    throw new Error("[blogAutomation] Der KI-Text war leer. Bitte erneut versuchen.");
  }
  return text;
}

async function generateDirectArticleHtml(client: OpenAI, params: GenerateBlogDraftParams): Promise<{ articleHtml: string; responseId: string }> {
  const directPrompt = extractDirectCmsPrompt(params.topic);
  const requestedRange = extractRequestedWordRange(directPrompt);
  let response = await createDirectArticleResponse({ client, generationParams: params });
  let articleHtml = normalizeGeneratedHtml(
    parseTextResponse(response, "[blogAutomation] Der Artikel wurde zu lang und unvollständig zurückgegeben. Er wird erneut erstellt."),
  );

  if (requestedRange) {
    const words = countWords(articleHtml);
    const tooShort = words < Math.floor(requestedRange.min * 0.9);
    const tooLong = words > Math.ceil(requestedRange.max * 1.15);
    if (tooShort || tooLong) {
      response = await createDirectArticleResponse({
        client,
        generationParams: params,
        retryInstruction: `The previous article had ${words} words. The editor requested ${requestedRange.min}-${requestedRange.max} words. Regenerate the full article within that range while keeping the exact requested structure and argument.`,
      });
      articleHtml = normalizeGeneratedHtml(
        parseTextResponse(response, "[blogAutomation] Der Artikel wurde erneut zu lang und unvollständig zurückgegeben. Bitte den Prompt etwas enger fassen."),
      );
    }
  }

  return { articleHtml, responseId: response.id };
}

function buildDirectMetadataInstructions(params: GenerateBlogDraftParams): string {
  const { settings } = params;
  return `Create CMS metadata for an Abexis blog article.

Return exactly one JSON object matching the schema.
Do not include articleHtml.
Default language: ${settings.defaultLanguage}. For German, use Swiss German conventions and avoid "ß".
LinkedIn: create one short German LinkedIn teaser for Daniel Sengstag's profile. 500-800 characters, 2-4 short paragraphs, no source links, no external links, no citation parentheses. End with {{BLOG_URL}} on its own final line exactly once.
Image search: return 3-6 short English Unsplash search phrases. Prefer business/technology/project imagery: business technology, enterprise software, digital transformation, IT project management, business strategy meeting, software implementation, change management, workflow automation. Avoid Swiss architecture, Swiss landscapes, mountains, flags, handshakes, grinning teams, laptop dashboards, and skyscrapers.
No source links, citations, or fabricated facts.`;
}

function buildDirectMetadataPrompt(params: GenerateBlogDraftParams, articleHtml: string): string {
  const prompt = extractDirectCmsPrompt(params.topic);
  return `Create title, slug, excerpt, SEO metadata, researchSummary, LinkedIn post, and image fields for this article.

Original editor prompt:
${prompt}

Generated article HTML:
${articleHtml}`;
}

function normalizeLinkedinPlaceholder(post: string): string {
  const withoutLinks = toSwissGerman(post)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, "$1")
    .replace(/https?:\/\/(?!www\.abexis\.ch\/blog\/)[^\s)]+/gi, "")
    .replace(/\(\s*\)/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  const placeholderEscaped = BLOG_URL_PLACEHOLDER.replace(/[{}]/g, "\\$&");
  const placeholderRegex = new RegExp(placeholderEscaped, "g");
  const stripped = withoutLinks.replace(placeholderRegex, "").trim();
  if (!stripped) {
    return BLOG_URL_PLACEHOLDER;
  }
  return `${stripped}\n\n${BLOG_URL_PLACEHOLDER}`;
}

function normalizeImageSearchQueries(queries: string[]): string[] {
  const bad = /\b(swiss|schweiz|switzerland|architecture|architectural|landschaft|landscape|mountain|alps|flag|handshake|skyscraper)\b/i;
  const cleaned = queries
    .map((q) => toSwissGerman(q).trim())
    .filter(Boolean)
    .filter((q) => !bad.test(q));
  return [...new Set([...cleaned, ...BUSINESS_TECH_IMAGE_QUERIES])].slice(0, 6);
}

function normalizeDraftOutput(output: BlogAutomationDraftOutput): BlogAutomationDraftOutput {
  return {
    title: toSwissGerman(output.title).trim(),
    slug: output.slug.trim().toLowerCase(),
    excerpt: toSwissGerman(output.excerpt).trim(),
    metaTitle: toSwissGerman(output.metaTitle).trim(),
    metaDescription: toSwissGerman(output.metaDescription).trim(),
    articleHtml: cleanGeneratedArticleHtml(output.articleHtml),
    researchSummary: toSwissGerman(output.researchSummary).trim(),
    linkedinPost: normalizeLinkedinPlaceholder(output.linkedinPost),
    imageSearchQueries: normalizeImageSearchQueries(output.imageSearchQueries),
    heroImageAlt: toSwissGerman(output.heroImageAlt).trim(),
  };
}

async function createDirectMetadataResponse(params: {
  client: OpenAI;
  generationParams: GenerateBlogDraftParams;
  articleHtml: string;
}): Promise<BlogDraftResponse> {
  const response = await params.client.responses.create({
    model: resolveModel(),
    instructions: buildDirectMetadataInstructions(params.generationParams),
    input: buildDirectMetadataPrompt(params.generationParams, params.articleHtml),
    max_output_tokens: DIRECT_PROMPT_METADATA_MAX_OUTPUT_TOKENS,
    text: {
      format: {
        type: "json_schema",
        name: "abexis_direct_prompt_metadata_v1",
        strict: true,
        schema: DIRECT_PROMPT_METADATA_JSON_SCHEMA as unknown as Record<string, unknown>,
      },
    },
  });

  return response as BlogDraftResponse;
}

async function generateDirectMetadata(
  client: OpenAI,
  params: GenerateBlogDraftParams,
  articleHtml: string,
): Promise<{ metadata: DirectPromptMetadata; responseId: string }> {
  let response = await createDirectMetadataResponse({ client, generationParams: params, articleHtml });
  let raw: unknown;
  try {
    raw = parseBlogDraftResponse(response);
  } catch (e) {
    if (!isRetryableDraftJsonError(e)) throw e;
    response = await createDirectMetadataResponse({ client, generationParams: params, articleHtml });
    raw = parseBlogDraftResponse(response);
  }

  const parsed = directPromptMetadataSchema.safeParse(raw);
  if (!parsed.success) {
    const detail = parsed.error.flatten().fieldErrors;
    throw new Error(`[blogAutomation] Invalid prompt metadata JSON: ${JSON.stringify(detail)}`);
  }

  return {
    metadata: {
      ...parsed.data,
      linkedinPost: normalizeLinkedinPlaceholder(parsed.data.linkedinPost),
      imageSearchQueries: normalizeImageSearchQueries(parsed.data.imageSearchQueries),
    },
    responseId: response.id,
  };
}

async function generateDirectPromptBlogDraft(
  client: OpenAI,
  params: GenerateBlogDraftParams,
): Promise<GenerateBlogDraftResult> {
  const article = await generateDirectArticleHtml(client, params);
  const metadata = await generateDirectMetadata(client, params, article.articleHtml);

  return {
    output: normalizeDraftOutput({
      ...metadata.metadata,
      articleHtml: article.articleHtml,
    }),
    responseId: `${article.responseId}:${metadata.responseId}`,
  };
}

type BlogDraftResponse = {
  id: string;
  output_text?: string;
  status?: string;
  incomplete_details?: { reason?: string } | null;
};

async function createBlogDraftResponse(params: {
  client: OpenAI;
  generationParams: GenerateBlogDraftParams;
  maxOutputTokens: number;
  retryNote?: boolean;
}): Promise<BlogDraftResponse> {
  const { client, generationParams, maxOutputTokens, retryNote = false } = params;

  const response = await client.responses.create({
    model: resolveModel(),
    tools: [
      {
        type: "web_search",
        user_location: { type: "approximate", country: "CH", city: "Zürich", region: "Zürich" },
      },
    ],
    tool_choice: "auto",
    include: ["web_search_call.action.sources"],
    instructions: buildDeveloperInstructions(generationParams),
    input: buildUserPrompt(generationParams.topic, retryNote),
    max_output_tokens: maxOutputTokens,
    text: {
      format: {
        type: "json_schema",
        name: "abexis_blog_automation_draft_v2",
        strict: true,
        schema: BLOG_PIPELINE_JSON_SCHEMA as unknown as Record<string, unknown>,
      },
    },
  });

  return response as BlogDraftResponse;
}

function parseBlogDraftResponse(response: BlogDraftResponse): unknown {
  if (response.status === "incomplete" || response.incomplete_details?.reason) {
    const reason = response.incomplete_details?.reason ?? "unknown";
    throw new Error(
      reason === "max_output_tokens"
        ? "[blogAutomation] Der KI-Entwurf wurde zu lang und unvollständig zurückgegeben. Bitte den Prompt etwas enger fassen oder den Entwurf erneut erstellen."
        : `[blogAutomation] Der KI-Entwurf wurde unvollständig zurückgegeben (${reason}). Bitte erneut versuchen.`,
    );
  }

  return safeParseOutputText(response);
}

function isRetryableDraftJsonError(e: unknown): boolean {
  if (!(e instanceof Error)) return false;
  return (
    e.message.includes("[blogAutomation] Der KI-Entwurf konnte nicht als vollständiges JSON gelesen werden.") ||
    e.message.includes("[blogAutomation] Der KI-Entwurf wurde zu lang und unvollständig zurückgegeben.")
  );
}

/**
 * Server-only: calls OpenAI Responses API with web_search and validates output with Zod.
 */
export async function generateBlogDraft(params: GenerateBlogDraftParams): Promise<GenerateBlogDraftResult> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("[blogAutomation] Missing OPENAI_API_KEY.");
  }

  const client = new OpenAI({ apiKey });

  if (isDirectCmsPrompt(params.topic)) {
    return generateDirectPromptBlogDraft(client, params);
  }

  let response = await createBlogDraftResponse({
    client,
    generationParams: params,
    maxOutputTokens: BLOG_DRAFT_MAX_OUTPUT_TOKENS,
  });

  let raw: unknown;
  try {
    raw = parseBlogDraftResponse(response);
  } catch (e) {
    if (!isRetryableDraftJsonError(e)) {
      throw e;
    }
    response = await createBlogDraftResponse({
      client,
      generationParams: params,
      maxOutputTokens: BLOG_DRAFT_RETRY_MAX_OUTPUT_TOKENS,
      retryNote: true,
    });
    raw = parseBlogDraftResponse(response);
  }

  const parsed = blogAutomationDraftOutputSchema.safeParse(raw);
  if (!parsed.success) {
    const detail = parsed.error.flatten().fieldErrors;
    throw new Error(`[blogAutomation] Invalid model JSON: ${JSON.stringify(detail)}`);
  }

  return {
    output: normalizeDraftOutput(parsed.data),
    responseId: response.id,
  };
}

function safeParseOutputText(response: BlogDraftResponse): unknown {
  const text = response.output_text?.trim();
  if (!text) {
    throw new Error("[blogAutomation] Empty Responses output (no JSON).");
  }
  try {
    return JSON.parse(text) as unknown;
  } catch (e) {
    const detail = e instanceof Error ? e.message : "unknown parser error";
    throw new Error(
      `[blogAutomation] Der KI-Entwurf konnte nicht als vollständiges JSON gelesen werden. Bitte erneut erstellen. Technisches Detail: ${detail}`,
    );
  }
}
