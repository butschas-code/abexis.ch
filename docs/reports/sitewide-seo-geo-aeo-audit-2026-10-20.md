# Abexis site-wide SEO, GEO and AEO audit

Date: 20 October 2026  
Scope: the complete public Abexis website, German and English  
Validation set after implementation: 208 unique sitemap URLs

## Executive summary

Abexis already had strong foundations: server-rendered pages, clear service architecture, one H1 per core page, a public sitemap, permissive crawler rules, useful first-party content and structured Organization, Service, Article, Person, Breadcrumb and JobPosting entities.

The main weakness was consistency. Most pages did not declare a canonical URL or language counterpart, English titles often received the Abexis suffix twice, two Executive Search referral URLs duplicated the primary offer, filtered blog query URLs appeared in the sitemap, and several utility pages inherited generic descriptions. The existing service pages also had little evergreen content addressing the questions prospects search before contacting a consultancy.

This implementation corrects the technical gaps and adds an intentional bilingual knowledge layer across every service pillar.

## Changes implemented

### Technical SEO

- Added self-referencing canonical URLs to every sitemap-listed page.
- Added reciprocal `de-CH`, `en-CH` and `x-default` alternates to all bilingual core, service, profile, vacancy and guide pages.
- Removed duplicated `| Abexis | Abexis` document titles by allowing the root title template to add the brand once.
- Added specific descriptions to booking, legal and privacy pages instead of the generic site description.
- Added missing Contact and Insights structured-data coverage.
- Expanded the Organization entity with founder and verified areas of expertise.
- Defined the WebSite entity as bilingual rather than changing its language on every page.
- Represented the Service area served as a Country entity.
- Added FAQPage data only where the same questions and answers are visibly rendered.
- Added permanent redirects from duplicate Executive Search referral paths to the primary Executive Search pages.
- Removed referral URLs and filter query URLs from the sitemap.
- Deduplicated sitemap output by final URL.
- Added exact language-switch mappings for all new guide URLs.

### Content architecture

The site now has one distinct evergreen guide in German and English for every principal service area:

| Service pillar | Search and decision intent |
| --- | --- |
| Digital transformation | Digital strategy for Swiss SMEs |
| Corporate strategy | Strategy process for SMEs |
| Sales and marketing | Developing a B2B sales strategy |
| Change management | A practical change-management approach |
| Process optimization | Analysing and improving business processes |
| Project management | Stabilising a project in trouble |
| Risk management | Identifying project risks early |
| Executive Search | Finding executives through Executive Search in Switzerland |
| PLM/PDM | Teamcenter consulting, PLM/PDM implementation and PLM vs PDM |

The eight new guide pairs add 16 pages. Together with the six PLM/PDM topic pages, the evergreen layer now contains 22 focused URLs. Each guide contains a direct answer, practical sections, visible FAQs, Service/Breadcrumb/FAQ schema, links to the parent service and links to related management questions.

Service pages link directly to their relevant guide, while the Services overview provides a complete guide index. This creates a clear hub-and-spoke structure without putting all guide links into the primary navigation.

## Audit results after implementation

An automated local crawl read every unique URL emitted by the XML sitemap.

| Check | Result |
| --- | ---: |
| Unique sitemap URLs | 208 |
| HTTP 200 pages | 208 |
| Pages with a title | 208 |
| Pages with a meta description | 208 |
| Pages with a canonical URL | 208 |
| Pages with exactly one H1 | 208 |
| Core bilingual pages missing three language alternates | 0 |
| New guide pages missing FAQPage schema | 0 |

The crawl also confirmed that the new umlaut route for Veränderungsmanagement resolves correctly in both languages.

## GEO and answer-engine readiness

The site now gives search and answer systems clearer passages and relationships:

- direct answers appear near the start of every evergreen guide;
- definitions, process stages and decision criteria are expressed explicitly;
- Abexis, Daniel Sengstag, Switzerland and each service are connected through stable schema identifiers;
- related questions use visible question-and-answer language;
- parent services and guides link to each other with descriptive anchor text;
- service-specific claims remain grounded in the supplied site content and do not invent clients, outcomes, awards or certifications.

These changes improve retrieval and citation readiness. They cannot guarantee a ranking or inclusion in a generated answer.

## Content and market observations

Current Swiss search results reward pages that combine a clear local proposition with practical detail: process, role definition, market or industry context, direct answers and evidence of real expertise. Large competitors often cover these elements across many disconnected pages. Abexis can compete more credibly by keeping its smaller content set specific, personal and decision-oriented.

The new guides deliberately avoid location-page multiplication and near-duplicate keyword pages. Future pages should only be added where Search Console data or repeated client questions reveal a genuinely different intent.

## Remaining limitation

The shared Next.js root layout still emits `<html lang="de">` for English routes. English pages contain English content, English schema language and local `lang="en"` wrappers, but the document-level attribute remains German. A complete correction requires splitting the routing tree into locale-aware root layouts or an equivalent architectural migration. It should be handled separately because it affects public, authentication and admin layouts and can change rendering behaviour across the whole application.

## Measurement plan

1. Submit the refreshed sitemap in Google Search Console and Bing Webmaster Tools.
2. Request indexing for the Services overview and the highest-priority German guides first.
3. Monitor coverage, impressions, clicks, query families and qualified enquiries by landing page.
4. Review results after 8–12 weeks; consolidate pages if Google treats two intents as the same.
5. Expand only from observed demand, client questions and credible Abexis expertise.

No Search Console, analytics or CRM access was available during this audit. The report therefore makes no claims about current traffic, conversion rate or ranking position.
