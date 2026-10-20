# PLM/PDM SEO, GEO and AEO audit

Date: 20 October 2026  
Scope: German and English PLM/PDM content on abexis.ch  
Primary hub: `/fokusthemen/plm-pdm` and `/en/fokusthemen/plm-pdm`

## Executive summary

The PLM/PDM hub already has a strong service proposition, original subject-matter copy, one clear H1, visible FAQs, internal links and a relevant self-hosted hero image. The principal organic-search gap was intent coverage: one broad service URL had to answer commercial, implementation and definition queries at the same time.

This change creates a focused topic cluster with three substantive pages in German and English:

1. Siemens Teamcenter consulting in Switzerland
2. PLM/PDM implementation and project leadership
3. PLM vs PDM definitions and decision guidance

The cluster is linked from the hub and between related pages. Canonical and language-alternate metadata, FAQ structured data and sitemap entries are included.

## Audit scorecard

| Area | Before | After this change | Notes |
| --- | ---: | ---: | --- |
| Crawlability and indexation | Good | Good | Public 200 responses, permissive robots policy and XML sitemap verified on production. |
| On-page relevance | Good | Strong | Unique titles, descriptions, direct answers, headings and intent-specific copy. |
| Internal linking | Moderate | Strong | Hub-to-cluster and sibling links added in both languages. |
| Structured data | Good | Strong | Existing Organization, WebSite, WebPage, Service and Breadcrumb data retained; FAQPage added where FAQs are visible. |
| International SEO | Moderate | Strong | Canonical, `de-CH`, `en-CH` and `x-default` alternates added to the hub and cluster pages. |
| AEO readiness | Moderate | Strong | Concise answers, comparison table, question-led FAQs and scannable implementation steps. |
| GEO/entity clarity | Good | Strong | Provider, location, service, person expertise and Siemens Teamcenter context are expressed consistently. |
| Performance fundamentals | Good | Good | Existing 180 KB WebP hero is reused; no new image payload or client-side content framework added. |

Scores are qualitative implementation assessments, not rankings or traffic measurements.

## Technical findings

### Working well

- `robots.txt` and `sitemap.xml` return HTTP 200 in production.
- The German and English PLM/PDM hub pages return HTTP 200 and render their principal content server-side.
- Titles and meta descriptions are unique and aligned to the service.
- The page uses a single descriptive H1 and a logical H2/H3 hierarchy.
- Existing JSON-LD connects the page to the Abexis organisation and includes Service and Breadcrumb entities.
- The PLM/PDM hero is a self-hosted WebP image and the component provides responsive image sizing.
- The hub is linked from the home page, services overview and the Services navigation.

### Gaps addressed

- Added self-referencing canonical URLs to the PLM/PDM hub and every new topic page.
- Added reciprocal `de-CH` and `en-CH` alternates plus `x-default`.
- Added FAQPage JSON-LD only for questions and answers that are visibly present on each page.
- Added six sitemap URLs for the three bilingual topic pages.
- Added exact language-switch mappings for all new paths.
- Added a clear content cluster instead of creating thin location or keyword doorway pages.

### Remaining platform-level concern

The root Next.js layout declares `<html lang="de">` for the whole site. English pages also carry a local `lang="en"` wrapper and English schema metadata, but the document-level language remains German. Correcting this comprehensively requires a locale-aware root layout or routing architecture and should be handled as a separate site-wide internationalisation change, then regression-tested across all public and admin routes.

## Search-intent and competitor review

Current result pages for Swiss and German-language searches show four recurring themes:

- Swiss implementation expertise and local industrial context
- Siemens Teamcenter-specific consulting
- a structured journey from analysis and concept to implementation and managed operation
- clear educational comparisons between PDM and PLM

The new pages cover these themes using Abexis's actual offer and Daniel Sengstag's relevant experience. They do not claim vendor partnership, certifications or delivery capabilities that are not established in the site content.

## AEO and GEO implementation

Each new page now provides:

- a direct answer near the top that can stand alone in search or an answer engine;
- explicit definitions and entity relationships rather than keyword variants;
- short, descriptive sections based on real buyer questions;
- visible FAQs mirrored in valid JSON-LD;
- Switzerland, Siemens Teamcenter, PLM and PDM context where relevant;
- links to the broader service hub, related guidance and the consultation action.

This improves retrieval and citation readiness, but no implementation can guarantee inclusion in an AI answer or a particular ranking.

## Measurement plan

After deployment:

1. Submit or refresh the sitemap in Google Search Console and Bing Webmaster Tools.
2. Request indexing for the German hub and the three German topic pages first; repeat for English.
3. Track impressions, clicks, average position and query mix by URL for at least 8–12 weeks.
4. Watch especially for Teamcenter consulting, PLM/PDM implementation, and PLM-vs-PDM query families.
5. Improve pages from observed queries and qualified enquiries rather than publishing many near-duplicate variants.

No Search Console, analytics or CRM data was available in this audit, so traffic, conversion and ranking conclusions are intentionally excluded.
