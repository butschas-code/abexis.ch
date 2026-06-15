import OpenAI from "openai";
import { blogPipelineOutputSchema, type BlogPipelineOutput } from "@/cms/types/blog-pipeline";
import { getOpenAiBlogModel } from "@/lib/blog-pipeline/openai-blog-model";
import { BLOG_PIPELINE_JSON_SCHEMA } from "@/lib/blog-pipeline/openai-json-schema";

const PIPELINE_INSTRUCTIONS = `You are the editorial assistant for Abexis, a Swiss consulting firm.

Audience: Swiss SME owners, board members, and executives.
Tone: calm, senior, precise, premium Swiss German–inflected professionalism (write in clear German).
No hype, no clickbait, no exclamation marks parade.
Do not present Executive Search as the whole company—it is one practice area alongside broader advisory work.

Quality rules:
- Never invent statistics, surveys, regulations, or quotations.
- Never fabricate citations or URLs.
- Use the web_search tool when fresh or external facts materially strengthen the piece; otherwise rely on established general knowledge without pretending it is cited.
- Do not add source lists, footnotes, citation links, "Quellen", "Weiterlesen", competitor references, or external source URLs to articleHtml.
- Do not include source links in the JSON output.
- If you cannot verify something, omit it or phrase it carefully as context/opinion without numeric precision.

Output must match the JSON schema exactly. articleHtml should be semantic HTML fragments suitable inside a CMS body (headings, paragraphs, lists)—no <html> wrapper. Structure the article with a strong intro followed by clear h2/h3 sections. Avoid one long undifferentiated body of text.

Hero imagery fields:
- imageSearchQueries: short English Unsplash search phrases (never URLs). Prefer business/technology/project imagery such as business technology, enterprise software, digital transformation, IT project management, business strategy meeting, software implementation, change management, workflow automation. Avoid Swiss architecture, landscapes, mountains, flags, handshakes, grinning teams, laptop dashboards, or skyscrapers.
- heroImageAlt: concise German alt text for accessibility.

Social copy:
- linkedinPost: one short German LinkedIn teaser for Daniel Sengstag's profile. 500-800 characters, 2-4 short paragraphs, no source links, no external links, no citation parentheses. End with the placeholder {{BLOG_URL}} on its own final line exactly once.`;

function buildUserPrompt(topic: { title: string; brief?: string | null }): string {
  const brief = topic.brief?.trim() || "(Keine zusätzliche Briefing-Zusammenfassung.)";
  return `Recherchiere (falls sinnvoll mit Websuche) und verfasse einen professionellen Blogartikel für Abexis.

Thema (Titel): ${topic.title}

Briefing / Angle:
${brief}

Liefer genau ein JSON-Objekt gemäß Schema (kein Markdown außerhalb des JSON).`;
}

export type GenerateBlogDraftResult = {
  output: BlogPipelineOutput;
  responseId: string;
};

/**
 * Calls OpenAI Responses API with web_search and structured JSON output.
 */
export async function generateBlogDraftFromTopic(topic: {
  title: string;
  brief?: string | null;
}): Promise<GenerateBlogDraftResult> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("[blog-pipeline] Missing OPENAI_API_KEY.");
  }

  const model = getOpenAiBlogModel();

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
    instructions: PIPELINE_INSTRUCTIONS,
    input: buildUserPrompt(topic),
    text: {
      format: {
        type: "json_schema",
        name: "abexis_blog_pipeline_v2",
        strict: true,
        schema: BLOG_PIPELINE_JSON_SCHEMA as unknown as Record<string, unknown>,
      },
    },
  });

  const raw = response.output_parsed ?? safeParseOutputText(response);

  const parsed = blogPipelineOutputSchema.safeParse(raw);
  if (!parsed.success) {
    const detail = parsed.error.flatten().fieldErrors;
    throw new Error(`[blog-pipeline] Invalid model JSON: ${JSON.stringify(detail)}`);
  }

  return {
    output: parsed.data,
    responseId: response.id,
  };
}

function safeParseOutputText(response: { output_text?: string }): unknown {
  const text = response.output_text?.trim();
  if (!text) {
    throw new Error("[blog-pipeline] Empty Responses output (no JSON).");
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error("[blog-pipeline] Responses output_text is not valid JSON.");
  }
}
