<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes : APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Abexis : CMS & site architecture (non‑negotiables)

- **Two public sites, one shared backend:** Marketing sites stay strategically separate (e.g. Abexis vs search deployment). There is **one** Firebase project, **one** admin surface, **one** editorial pipeline. Do not merge unrelated product CMS patterns into this repo.
- **Not a generic CMS:** Prefer small, purpose-built flows (posts, authors, categories, settings, submissions) over pluggable blocks, theme systems, or abstraction layers nobody asked for.
- **Editor UX:** Assume a **non-technical** client : clear labels, minimal chrome, few decisions per screen. Avoid developer-centric toggles in the default path.
- **Firebase:** Use **Auth**, **Firestore**, and **Storage** in line with existing modules : `@/firebase/client` (browser), `@/firebase/server` + `src/firebase/admin.ts` (server only). Console steps and **env vars** are documented in `src/firebase/client.ts` (header comment) and **`.env.example`**; keep those comments updated when adding variables. **Bulk raster compression** for Storage + syncing `media` metadata : `pnpm cms:optimize-storage-media` (see script header).
- **Image Optimization & Asset Pipeline (Strict):**
  - `images.unoptimized: true` is enabled in `next.config.ts` to stay within Vercel plan limits. Images are served raw by `<Image>` without runtime edge downscaling.
  - **Static cards & team portraits:** New card or portrait images must have ~500 px WebP thumbnails generated in `public/images/thumbs/` via `pnpm run thumbnails` (`scripts/build-thumbnails.mjs`). Use `serviceCardThumbs[key]` and `teamPortraitThumb(slug)` on card/listing surfaces.
  - **Blog post thumbnails:** `BlogThumbnail` and `resolvePostHeroImageUrl` resolve through `@/lib/images/resolve-thumbnail-url`. Known legacy assets use prebuilt `public/images/thumbs/blog/<uuid>.webp`, and Unsplash URLs automatically get dynamic `&w=600&q=80` query parameters.
  - **CMS admin uploads:** `AdminFileUpload` handles client-side downscaling (max 1600px, WebP 82%) before files reach Firebase Storage. Do not bypass this upload helper.
- **Site-aware filtering:** Centralize public visibility in `@/public-site/site` (`getResolvedPublicDeploymentSite`, `visiblePostSitesInClause`, category helpers). Do not scatter ad-hoc `site ===` checks : extend the shared helpers if a new case appears.
- **Quality bar:** Modular files, production-oriented error handling, no speculative features. Comments explain *why* and *where to configure*, not obvious code.
- **Admin UI:** Preserve a **premium editorial** feel : restrained typography, calm spacing, consistent with the brand language already in admin components; avoid “default dashboard” clutter.

When unsure, favor **less** surface area and **clearer** data shapes over clever abstractions.
