/**
 * Default: cheapest model OpenAI documents for Responses API `web_search` (see “Limitations” on the web search guide).
 * Override anytime — model availability and pricing change; pin a snapshot (e.g. `gpt-4.1-mini-2025-04-14`) if you need stability.
 */
export function getOpenAiBlogModel(): string {
  return process.env.OPENAI_BLOG_MODEL?.trim() || "gpt-4.1-mini";
}
