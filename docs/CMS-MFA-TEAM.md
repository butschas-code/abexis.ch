# CMS two-factor login — team notes (custom TOTP)

Simple overview for editors and people who deploy the site.

## What changed (in plain language)

- **Signing in** is still **email + password** (Firebase).
- **Second factor** is an **authenticator app** on the phone (Google Authenticator, Microsoft Authenticator, etc.).
- That second factor is **handled by our app**, not by “Firebase paid MFA”. Secrets are stored in **Firestore** in special collections the website **never** reads directly—only the **server** does.

So: **no Firebase Identity Platform upgrade** is required for this MFA.

## What each CMS user needs once

1. **Verified email** (Firebase sends the link).
2. **One-time setup** of the authenticator under **`/admin/mfa-setup`** (QR code + confirm with a code).
3. After that, **login** = password, then **code from the app** when asked.

If someone changed phones or lost the authenticator, an admin must clear their MFA data and they enroll again (same `/admin/mfa-setup` flow)—contact whoever maintains Firebase/CMS access.

---

## For deployers: publish the new Firestore rules (required)

The repo contains rules that **block all browser access** to:

- `cms_totp`
- `cms_totp_pending`

Those documents hold TOTP secrets. **Only the server (Firebase Admin SDK)** may read/write them. If you skip this step, authenticator secrets could be readable by any logged-in Firebase user—**do not skip**.

### Deploy in 30 seconds — copy/paste (Firebase CLI)

This updates **only** Firestore security rules in Firebase. It does **not** deploy your Next.js site (Vercel etc.).

**One-time per computer:** install the Firebase CLI:

```bash
npm install -g firebase-tools
```

**Every time you deploy rules:** run these in Terminal **top to bottom**.

1. Go to the repo folder (adjust the path if yours is different):

```bash
cd "/Users/sascha/CH Websites/abexis"
```

2. Log in (browser opens; only needed again if you switch computers or logout):

```bash
firebase login
```

3. Point the CLI at the Firebase project. This repo defaults to **`abexis-cms`** (see `.firebaserc`):

```bash
firebase use abexis-cms
```

If that fails, list projects your account can see, then pick the right id:

```bash
firebase projects:list
firebase use YOUR_PROJECT_ID_HERE
```

4. Upload `firestore.rules` to Firebase:

```bash
firebase deploy --only firestore:rules
```

Wait until you see a success message (e.g. **Deploy complete**). If you get permission errors, the Google account from `firebase login` needs **Owner** or **Editor** on that Firebase project.

### No Terminal? Use the Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com) → your CMS project.
2. **Build** → **Firestore Database** → **Rules**.
3. On your computer, open this repo’s file **`firestore.rules`** in an editor → select all → copy.
4. Paste into the Rules editor in the Console → **Publish**.

### Quick sanity check after deploy

In the Console → Firestore → **Rules**, you should see rule blocks that contain **`cms_totp`** and **`cms_totp_pending`** with **`allow read, write: if false;`** (deny everyone from the client SDK).

---

## For ops: environment variables

Production (and local dev for MFA to work) needs at least:

| Variable | Purpose |
|----------|---------|
| `CMS_MFA_COOKIE_SECRET` | Long random string (minimum **16** characters). Signs the “you passed the authenticator step” browser cookie. **Keep secret.** If you rotate it, everyone must enter an app code again. |

Firebase Admin must be configured as already documented (service account / env vars) so API routes can talk to Firestore.

See **`.env.example`** in the repo for names and comments.

### Production (Vercel): add the same secret

The CLI on this machine must be logged in (`vercel login`). Then from the repo folder:

```bash
cd "/Users/sascha/CH Websites/abexis"
vercel env add CMS_MFA_COOKIE_SECRET production
```

When prompted for the value, **paste the line from `.env.local`** (everything after `CMS_MFA_COOKIE_SECRET=`).  
Repeat for **Preview** if you want MFA on preview deployments:

```bash
vercel env add CMS_MFA_COOKIE_SECRET preview
```

Redeploy the site after adding variables so new builds pick them up.

### Verify locally

```bash
npm run cms:check-mfa-env
```

Should report OK for `CMS_MFA_COOKIE_SECRET`, Firebase Admin, and `firestore.rules` snippets.

---

## Rollout: editors who used old Firebase MFA

Older setups might have used **Firebase’s own MFA** (Identity Platform). That is **no longer** used.

**Every CMS account must enroll again** with our flow:

1. Sign in with email + password at **`/admin/login`**.
2. Complete **email verification** if prompted (`/admin/verify-email`).
3. Open **`/admin/mfa-setup`**, scan the QR code (or enter the manual key), enter the **6-digit code** to finish.
4. Then the rest of **`/admin`** works as usual.

Tell the team: **one short setup per person**; nothing extra for “Google Workspace vs not”—same authenticator flow for everyone.

---

## Short checklist before go-live

- [ ] `firestore.rules` deployed (contains locked-down `cms_totp*` paths).
- [ ] `CMS_MFA_COOKIE_SECRET` set in production (and kept private).
- [ ] Firebase Admin env vars correct on the host (e.g. Vercel).
- [ ] Each editor completed **`/admin/mfa-setup`** once after this change.

Questions about access or locked accounts: whoever manages Firebase users and this codebase.

---

## Slow walkthrough (beginners): Vercel secret + editors

### Part A — Put `CMS_MFA_COOKIE_SECRET` on Vercel (why?)

Your laptop has this value in **`.env.local`**. The **live website** on Vercel does **not** read that file. You must copy **the same secret** into Vercel so production can sign the MFA cookie.

You can use **either** the website (easier for many people) **or** the Terminal.

#### Path 1 — Vercel website (no Terminal)

1. Open **`https://vercel.com`** and sign in (same account that owns the Abexis project).
2. Click your **team** (if asked), then click the **project** that hosts this Next.js site (often named like the repo).
3. Open **Settings** (top tabs on the project).
4. In the left sidebar, click **Environment Variables**.
5. Under **Key**, type exactly: `CMS_MFA_COOKIE_SECRET`
6. Under **Value**, paste **only the secret string** — not the name `CMS_MFA_COOKIE_SECRET`.
   - On your Mac, open the Abexis project folder in Cursor/Finder.
   - Open the file **`.env.local`** (it may be hidden; in Cursor it appears in the file tree).
   - Find the line that starts with `CMS_MFA_COOKIE_SECRET=`
   - Copy **everything after the `=`** on that line (one long string). Paste it into Vercel’s **Value** field.
7. Under **Environments**, enable **Production** (and **Preview** too if editors test on preview URLs).
8. Click **Save**.
9. **Redeploy** so the running app sees the new variable:
   - Go to the project **Deployments** tab.
   - Open the latest production deployment’s **⋯** menu → **Redeploy** (confirm).  
   Or push any small commit to the branch Vercel deploys from — that also triggers a new build.

#### Path 2 — Terminal (`vercel` CLI)

1. Install the Vercel CLI once:

   ```bash
   npm install -g vercel
   ```
2. In Terminal:

   ```bash
   cd "/Users/sascha/CH Websites/abexis"
   vercel login
   ```

   A browser window opens; approve login.

3. Link this folder to the right Vercel project (only if `vercel link` was never done):

   ```bash
   vercel link
   ```

   Answer the prompts and pick the Abexis site project.

4. Add the variable for production:

   ```bash
   vercel env add CMS_MFA_COOKIE_SECRET production
   ```

5. When it asks for the value, paste **only** the part after `=` from `.env.local` (same as Path 1, step 6). Press Enter.

6. Optional — previews:

   ```bash
   vercel env add CMS_MFA_COOKIE_SECRET preview
   ```

   Paste the **same** value again.

7. Redeploy (Deployments → Redeploy, or push to git).

---

### Part B — Tell each editor to finish MFA once (you cannot do this for them)

Each person uses **their own** login and **their own** phone app.

1. Send them the **real** website address (e.g. `https://www.abexis.ch` — use yours).
2. They open **`https://YOUR-DOMAIN/admin/login`** (replace with your domain).
3. They sign in with **their** email + password (Firebase account).
4. If the site asks to verify email — they click the link in the email Firebase sends, then return to the site.
5. The site should take them to **`/admin/mfa-setup`** (or they open **`https://YOUR-DOMAIN/admin/mfa-setup`**).
6. They install **Google Authenticator** or **Microsoft Authenticator** (or similar) on their phone.
7. On the computer they click to show the **QR code**, then scan it with the phone app **or** type the **manual key** if scanning fails.
8. They enter the **6-digit code** from the app into the site and confirm.
9. Done — next logins will ask for password **and** a new code from the app when needed.

**One sentence you can paste to the team:**  
“Please log into the CMS once and complete **Authenticator setup** at **`/admin/mfa-setup`** after verifying your email; you’ll need an authenticator app on your phone.”
