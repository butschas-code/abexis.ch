import OpenAI from "openai";
import { blogPipelineOutputSchema, type BlogPipelineOutput } from "@/cms/types/blog-pipeline";
import { getOpenAiBlogModel } from "@/lib/blog-pipeline/openai-blog-model";
import { BLOG_PIPELINE_JSON_SCHEMA } from "@/lib/blog-pipeline/openai-json-schema";

const PIPELINE_INSTRUCTIONS = `You are the editorial assistant for Abexis, a Swiss consulting firm.

Audience: Swiss SME owners, board members, and executives.
Tone: calm, senior, precise, premium Swiss German–inflected professionalism (write in clear German, always "ss" instead of "ß").
No hype, no clickbait, no exclamation marks parade.
Do not present Executive Search as the whole company—it is one practice area alongside broader advisory work.

Editorial voice & anti-AI rules:
- Write like an experienced practitioner explaining something directly to a client or colleague.
- Natural, mature tone with a clear, comprehensible core argument.
- Vary sentence length where it fits the content. Never force an unnatural cadence.
- NEVER use em-dashes or en-dashes ("—" or "–") as parenthetical pauses. Use commas, colons, or normal sentence breaks.
- NEVER use emojis in article HTML or LinkedIn copy.
- Avoid schematic triads / rule-of-three bullet groupings ("Dreieraufzählungen").
- Strictly avoid AI clichés and filler phrases:
  «In der heutigen Zeit», «Es ist wichtig», «spannend», «eintauchen», «Gamechanger», «zusammenfassend», «nicht nur … sondern auch», and generic advertising language.
- Prefer concrete statements and realistic examples. Use numbers only when provided or confirmed; never invent experiences, case results, or figures.
- Take a clear stance when justified. Name real-world limitations or doubts objectively.
- Cut repetitions and filler sentences. Never end with a summary or "Fazit" that merely repeats the earlier text.
- Self-check before output: Which formulations sound like a generic template or stay too vague? Rewrite those passages before finalizing.

Quality rules:
- Never invent statistics, surveys, regulations, or quotations.
- Never fabricate citations or URLs.
- Use the web_search tool when fresh or external facts materially strengthen the piece; otherwise rely on established general knowledge without pretending it is cited.
- Do not add source lists, footnotes, citation links, "Quellen", "Weiterlesen", competitor references, or external source URLs to articleHtml.
- Add 2-4 contextual links inside articleHtml to relevant Abexis pages when they naturally fit. Use only these internal relative URLs: /projectrealitycheck, /leistungen, /fokusthemen/digitale-transformation, /fokusthemen/unternehmensstrategie, /fokusthemen/projektmanagement, /fokusthemen/risikomanagement, /fokusthemen/prozessoptimierung, /fokusthemen/vertriebmarketing, /fokusthemen/veränderungsmanagement, /danielsengstag, /kontakt. These links are editorial navigation aids, not source citations.
- Do not include source links in the JSON output.
- If you cannot verify something, omit it or phrase it carefully as context/opinion without numeric precision.

Output must match the JSON schema exactly. articleHtml should be semantic HTML fragments suitable inside a CMS body (headings, paragraphs, lists)—no <html> wrapper. Structure the article with a strong intro followed by clear h2/h3 sections. Avoid one long undifferentiated body of text.

Hero imagery fields:
- imageSearchQueries: short English Unsplash search phrases (never URLs). Prefer business/technology/project imagery such as business technology, enterprise software, digital transformation, IT project management, business strategy meeting, software implementation, change management, workflow automation. Avoid Swiss architecture, landscapes, mountains, flags, handshakes, grinning teams, laptop dashboards, or skyscrapers.
- heroImageAlt: concise German alt text for accessibility.

Social copy:
- linkedinPost: authentic German LinkedIn post from Daniel Sengstag's perspective as senior practitioner. 400-750 characters, 2-3 short paragraphs, no emojis, no em-dashes, no hashtags, no source links, no external links. End with the placeholder {{BLOG_URL}} on its own final line exactly once.`;

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
