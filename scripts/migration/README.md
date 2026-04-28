# Legacy blog : Firestore CMS import

Import published legacy posts (e.g. from [abexis.ch/blog](https://abexis.ch/blog)) into the `posts` collection using a JSON file.

## 1. JSON format

Either:

- **Object:** `{ "version"?: number, "posts": [ … ] }`, or
- **Array:** `[ … ]` : same format as `npm run scrape:blog` → `src/data/blog-posts.json` (root-level array).

| Field      | Required | Description                          |
| ---------- | -------- | ------------------------------------ |
| `version`  | no       | Optional integer (wrapper object only). |
| `posts`    | **yes**  | Array of legacy post objects (when using wrapper). |

Each **post** supports (subset shown; see `legacyPostJsonSchema` in `src/cms/migration/legacy-post-import.ts`):

| Field            | Required | Notes |
| ---------------- | -------- | ----- |
| `slug`           | **yes**  | URL segment (e.g. from `/blog/<slug>`). Normalized to CMS rules. |
| `title`          | **yes**  | Or use `listTitle` from scrape output. |
| `bodyHtml`       | **yes**  | HTML fragment; sanitized with the same allowlist as the live blog renderer (`sanitizeBlogHtml`), then stored as the canonical JSON envelope (`serializePostBody`). |
| `publishedISO`   | no       | ISO date string; defaults to “now” if missing/invalid. |
| `tags`           | no       | String array (max 50 / 80 chars each). |
| `excerpt`        | no       | If omitted, generated from plain text of the body (truncated). |
| `heroImageUrl`   | no       | `https` URL only; invalid values become `null`. |
| `heroImageAlt`   | no       |                                     |
| `categoryIds`    | no       | Firestore category document ids.  |
| `seoTitle` / `seoDescription` | no | Optional SEO fields. |
| `featured`       | no       | Default `false`. |
| `url`, `listTitle` | no   | Compatible with `scripts/scrape-blogs.mjs` output. |
| `error`          | no       | If set, the row is **skipped** (failed scrape marker). |

**Site / status:** the importer always sets `site: "abexis"` and `status: "published"`.

**Timestamps:** `publishedAt`, `createdAt`, and `updatedAt` are set from `publishedISO` when parseable; otherwise from the import run time.

## 2. Produce JSON from the legacy site

**Recommended:** scrape directly into the CMS-ready export shape:

```bash
npm run scrape:legacy-abexis
```

Writes **`data/legacy-abexis-posts.json`** (`title`, `slug`, `excerpt`, `body`, `heroImageUrl`, `publishedAt`, `tags`, `seoTitle`, `seoDescription`). Then:

```bash
npm run cms:import:legacy -- data/legacy-abexis-posts.json
```

**Alternative:** older raw scrape (`src/data/blog-posts.json` via `npm run scrape:blog`) still works : the importer accepts `body` / `bodyHtml` and `publishedAt` / `publishedISO`. URL-encoded slugs are normalized on import.

Option B : export from Webflow / another tool into the same field names.

## 3. Prerequisites

1. **Firebase Admin** env vars (same as `npm run cms:seed:dev`):

   - `FIREBASE_PROJECT_ID` (or project id inside the JSON)
   - `FIREBASE_SERVICE_ACCOUNT_JSON` : one-line service account JSON **or** Application Default Credentials + project id.

2. **Author document** : default author id is `seed_author_editorial`. Run `npm run cms:seed:dev` once so that author exists, **or** set:

   ```bash
   export CMS_LEGACY_IMPORT_AUTHOR_ID="<your-firestore-author-doc-id>"
   ```

3. **Safety guard** : production requires an explicit flag:

   - Local: default `NODE_ENV=development` when using `npm run cms:import:legacy` is enough.
   - Production/staging: `CMS_LEGACY_IMPORT_ALLOW=1`.

## 4. Run the import locally

From the repo root, with `.env.local` containing Admin credentials (the script also loads `.env.local` / `.env` if present):

```bash
npm run cms:import:legacy -- data/migration/sample-legacy-posts.json
```

Or directly:

```bash
npx tsx scripts/import-legacy-blog-posts.ts path/to/legacy-posts.json
```

If `FIREBASE_*` is not in the shell environment, export it first or use Node 20+:

```bash
node --env-file=.env.local --import tsx scripts/import-legacy-blog-posts.ts data/migration/sample-legacy-posts.json
```

(Adjust for your Node version; `tsx` alone is usually enough when vars are exported.)

## 5. Idempotency

- Rows with the same **normalized slug** as an existing `posts` document are **skipped** (`[skip duplicate]`).
- Re-running the script does **not** create duplicate posts for the same slug.
- Rows with `error` set (scrape failures), missing title/body, or Zod validation errors are **skipped** with `[skip invalid]`.

## 6. Logging

The script prints:

- `[imported]` : new document id, slug, title preview  
- `[skip duplicate]` : slug already in Firestore  
- `[skip invalid]` : validation / legacy error  
- Final **JSON summary** with counts and up to 30 invalid samples

## 7. Body & images

- Inline images in `bodyHtml` are kept when they use **allowed** tags/attributes (`<img src="https://…">`, etc.); other markup is stripped to match `BlogBody` / `ArticleBody` behavior.
- **Hero:** set `heroImageUrl` in JSON for the cover used by `CmsBlogPostView`. For `next/image` hosts not on the allowlist, add them in `next.config.ts` under `images.remotePatterns`.` under `images.remotePatterns`.
