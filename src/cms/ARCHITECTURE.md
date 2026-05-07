# CMS (Firebase) : Abexis

**One** marketing site (**abexis.ch**), **one** Firebase project, **one** admin surface and editorial pipeline.

Legacy Firestore documents may still contain multi-site `site` values (`search`, `both`, `shared`) until you run the one-shot script:

`npm run cms:migrate:single-site` (see `scripts/migrate-cms-sites-to-abexis.ts`).

---

## 1) Folder structure (this repo)

```
src/app/
  (public-site)/            ← Marketing pages (route group; URLs unchanged)
  (cms)/admin/              ← Admin UI (`/admin/...`)
  (auth)/login/             ← Optional alias (`/login` → `/admin/login`)
  api/cms/v1/               ← Route Handlers (Admin SDK)

src/firebase/               ← Web client + Admin init
src/lib/cms/                ← Server helpers (e.g. map Firestore → DTO)
src/public-site/cms/       ← Deployment site + published-post reads (no admin UI)
src/services/cms/           ← Barrel → src/cms/services/*
src/types/cms/              ← Barrel → src/cms/types/*
src/admin/                  ← Admin path constants + metadata (no secrets)
src/data/cms/               ← Optional seeds / fixtures
src/components/
  admin/                    ← Admin-only UI
  auth/                     ← Login UI
  public-site/cms/          ← Marketing components fed by CMS

src/cms/                    ← Collection ids, canonical models, Firestore service impl
  ARCHITECTURE.md
  firestore/collections.ts
  types/
  services/

firestore.rules
firestore.indexes.json
storage.rules
.env.example
```

## 2) Data architecture (high level)

- **Authors** : people who can be attributed on posts; optional link to Auth `uid`.
- **Categories** : taxonomy; `site` is always **`abexis`** in types (legacy `search` / `shared` / `siteScope` rows are merged to **`abexis`** on read and by the migration script).
- **Posts** : main editorial unit: workflow, SEO, hero, body, **`site`** (always **`abexis`** for new writes), timestamps.
- **Form submissions** : normalized inbox for contact / lead forms (`site` stored as **`abexis`**, `formId`, fields map, spam metadata later).
- **Media** : **Firebase Storage**; posts store `heroImageUrl` + `heroImagePath` (legacy `heroStoragePath` is read until migrated).

Public reads should filter:

- `status == "published"`
- `site in ["abexis"]` on **posts** / **categories** in Firestore queries (expand here if multi-site returns).

---

## 3) Firestore collections

| Collection     | Document ID        | Purpose |
| -------------- | ------------------ | ------- |
| `authors`      | auto / slug        | Name, role, image, bio (optional slug / auth link) |
| `categories`   | auto / slug        | Name, slug, `site` (legacy `siteScope` still read) |
| `posts`        | auto               | Article: tags, featured, `heroImagePath`, SEO, `site`, `status` |
| `submissions`  | auto               | Form intakes: `type`, `site`, `payload`, `fileUrls`, `status` |
| `settings`     | e.g. `global`      | Contact/footer/SEO/switch-bar (`CMS_SETTINGS_GLOBAL_DOC_ID`) |
| `users`        | Auth `uid`         | Optional role metadata for admin UI |

Optional later: `redirects`, `settings`, `media`.

---

## 4) TypeScript models

See `src/cms/types/*.ts` : single source of truth aligned with Firestore fields (snake_case in JSON optional; this codebase uses **camelCase** in TS and maps at boundaries if needed).

---

## 5) Admin pages (custom UI)

| Path               | Purpose |
| ------------------ | ------- |
| `/admin/login`     | Email/password (Firebase Auth); canonical CMS sign-in |
| `/login`           | Redirects to `/admin/login` |
| `/admin`           | Dashboard (counts, shortcuts) |
| `/admin/posts`     | List / filter |
| `/admin/posts/new` | Create (later) |
| `/admin/posts/[id]`| Edit (later) |
| `/admin/submissions` | Form inbox (later) |

v1 pass: **login + dashboard stub + posts list** (read-only list when configured).

---

## 6) Public content fetching

**Recommended (production):** Server API using **Admin SDK** so rules stay strict and the public site never needs a “public write” rule for posts.

- `GET /api/cms/v1/posts?site=abexis&limit=20` : returns published posts (query may still match pre-migration `site` values; response rows normalize to **`abexis`**).
- Optional: `GET /api/cms/v1/posts/[slug]` for detail.

**This repo today:** blog still uses static `blog-posts.json`. Swapping the blog data source to the API is a follow-up step once content is migrated.

---

## 7) Environment variables

See **`.env.example`**. Minimum:

**Client (exposed, `NEXT_PUBLIC_*`):** Firebase web app config for Auth + Firestore + Storage in the browser (admin UI).

**Server (secret):** `FIREBASE_PROJECT_ID` + `FIREBASE_SERVICE_ACCOUNT_JSON` (full JSON string) for Admin SDK on Vercel / CI.  
Alternatively use default credentials on **Firebase App Hosting** / GCP.

---

## 8) Security notes (summary)

- **Firestore rules:** editors signed in for `posts`, `authors`, `categories`, `settings`, `submissions` read/update; `submissions` create via **Admin API** only (`create: if false` for clients).
- **Storage rules:** authenticated uploads to `posts/{postId}/...`; public read for published assets path if needed, or serve via signed URLs from API.

Full rules template: `firestore.rules` in repo root (first pass : tighten before production).
