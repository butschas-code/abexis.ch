# Incident Report: Nuelink Sync Failure

**Project:** Abexis CMS (abexis.ch)  
**Date of incident:** 14 September 2026  
**Report prepared:** 14 September 2026  
**Prepared for:** Abexis / Daniel Sengstag  
**Subject:** LinkedIn post for 22 September 2026 not visible in Nuelink

---

## Executive summary

On the morning of 14 September 2026, Daniel Sengstag approved three blog drafts for publication on 15, 22, and 29 September 2026. All three posts were **correctly scheduled in the CMS**. Two LinkedIn handoffs to **Nuelink succeeded**; the post scheduled for **22 September 2026** failed because the **Nuelink API returned HTTP 429** (“Too many requests. Please try again later.”) when three approvals were sent within approximately four minutes.

**Impact:** Blog post and CMS scheduling are unaffected. Only the LinkedIn scheduling in Nuelink is missing for the 22 September article.

**Recommended action:** Manually retry the Nuelink handoff once from CMS → Social (KI). Do **not** re-approve the draft.

---

## Client feedback (original)

Daniel reported that after releasing three posts in the CMS this morning, only two appeared in Nuelink. The post for **22 September 2026** (“Risk Management ist etwas für Langweiler”) did not transfer.

| Title | CMS status | Published (CMS) |
|-------|------------|-----------------|
| Risikomanagement kann man sich sparen… | Freigegeben | 15 Sep 2026, 06:31 |
| Risk Management ist etwas für Langweiler | Freigegeben | 22 Sep 2026, 06:31 |
| Projektstatus: Alles im Plan | Freigegeben | 29 Sep 2026, 06:31 |

---

## Root cause

**Nuelink API rate limiting (HTTP 429).**

When a draft is approved in the CMS, the system:

1. Creates or updates a **scheduled blog post** in Firestore.
2. Prepares a **LinkedIn social post** linked to that draft.
3. Calls the **Nuelink public API** to schedule the LinkedIn post for the same date/time.

On 14 September 2026, three approvals triggered three Nuelink API calls in quick succession:

| Time (UTC) | Event | Result |
|------------|-------|--------|
| 07:05:37 | Nuelink handoff — *Risikomanagement kann man sich sparen…* (15 Sep) | **Success** — Nuelink post ID **4996867** |
| 07:07:32 | Draft approved — *Risk Management ist etwas für Langweiler* (22 Sep) | CMS OK |
| 07:07:33 | Nuelink handoff for same draft | **Failed** — `Too many requests. Please try again later.` |
| 07:09:51 | Nuelink handoff — *Projektstatus: Alles im Plan* (29 Sep) | **Success** — Nuelink post ID **4996871** |

The middle request hit Nuelink’s rate limit. The third request succeeded after a short delay, which is consistent with a rolling rate-limit window.

---

## Technical evidence (Firestore)

### Failed social post

| Field | Value |
|-------|-------|
| Social document ID | `n9h4A3dTwPSfzXhRCbFi` |
| Draft ID | `tWm8Kklaxm8jsWf6kf1D` |
| Draft title | Risk Management ist etwas für Langweiler |
| CMS post ID | `n7uC2KAixe3d6CMixSfU` |
| CMS slug | `risk-management-ist-etwas-fuer-langweiler` |
| Scheduled publish | 2026-09-22T04:31:00.000Z (22 Sep 2026, 06:31 Europe/Zurich) |
| `nuelinkLastSentAt` | *null* (never sent) |
| `nuelinkLastError` | **Too many requests. Please try again later.** |
| `nuelinkLastPostId` | *null* |

### Successful social posts (same batch)

**15 September post**

| Field | Value |
|-------|-------|
| Social ID | `geaV4sGkr6iTHt0wgtJe` |
| Draft ID | `3jnGYu9M44vnG0x0vzwS` |
| Post ID | `614J0AfMkNCDPxj3kKns` |
| Nuelink post ID | 4996867 |
| Nuelink scheduled at | 2026-09-15 06:31:00 |
| Sent at (UTC) | 2026-09-14T07:05:37.160Z |

**29 September post**

| Field | Value |
|-------|-------|
| Social ID | `dQ8KMbBm07az7i2jMcAY` |
| Post ID | `2HBiibDKAMGMP5ERyam0` |
| Nuelink post ID | 4996871 |
| Nuelink scheduled at | 2026-09-29 06:31:00 |
| Sent at (UTC) | 2026-09-14T07:09:51.289Z |

---

## What did **not** fail

- Draft approval and CMS scheduling for 22 September.
- Blog post creation in Firestore (`posts` collection).
- LinkedIn copy and image preparation (stored on social document).
- Nuelink integration for the other two posts in the same session.

---

## Error logging — where to look

There is **no separate Nuelink log file** or Vercel-specific Nuelink dashboard. Errors are persisted in **Firestore**:

| Location | Fields |
|----------|--------|
| Collection `blogSocialPosts` | `nuelinkLastError`, `nuelinkLastSentAt`, `nuelinkLastPostId`, `nuelinkLastScheduledAt`, `nuelinkSends` (array) |

The approve API returns `nuelinkError` in its JSON response, but the **CMS UI currently shows a success message even when Nuelink fails**, which is why Daniel did not see a warning at approval time.

---

## Recovery procedure

### Option A — CMS UI (recommended for Daniel)

1. Log in to **CMS** at https://www.abexis.ch/admin
2. Open **Social (KI)** or the social section on the draft editor
3. Find **Risk Management ist etwas für Langweiler**
4. Click **LinkedIn an Nuelink** once
5. Confirm the post appears in Nuelink scheduled for **22 Sep 2026, 06:31**

**Do not** click “Freigeben” again — the blog post is already scheduled.

### Option B — CLI (developers)

From the abexis repo with Firebase/Nuelink env vars configured:

```bash
pnpm cms:repair-nuelink-social -- --draft tWm8Kklaxm8jsWf6kf1D --send
```

---

## Recommended improvements

| Priority | Improvement | Rationale |
|----------|-------------|-----------|
| High | Show `nuelinkLastError` in CMS when approve returns an error | Prevents silent failures |
| High | Retry Nuelink on HTTP 429 with exponential backoff (e.g. 2s, 5s, 15s) | Handles batch approvals |
| Medium | Add delay between sequential Nuelink calls when approving multiple drafts | Reduces rate-limit hits |
| Low | Admin list column: “Nuelink status” (sent / error / pending) | Faster ops visibility |

---

## Integration reference

| Component | Path / detail |
|-----------|---------------|
| Nuelink client | `src/lib/nuelink/client.ts` |
| Approve + Nuelink handoff | `src/lib/blogAutomation/cms-server/blogAutomationCmsOps.ts` → `cmsSetBlogDraftApproved` |
| Manual Nuelink send | CMS → Social (KI) → “LinkedIn an Nuelink” |
| Repair script | `scripts/repair-nuelink-social-handoff.ts` |
| Env vars | `NUELINK_API_KEY`, `NUELINK_BRAND_ID`, `NUELINK_COLLECTION_ID` (see `.env.example`) |

Nuelink API endpoint: `POST https://nuelink.com/api/public/v1/brands/{brandId}/collections/{collectionId}/posts`  
Publish mode on approve: **SCHEDULE** with `scheduledAt` formatted as `yyyy-MM-dd HH:mm:ss` in the CMS timezone (Europe/Zurich).

---

## Conclusion

The 22 September article **is correctly set up in the CMS**. The gap is solely the **Nuelink LinkedIn schedule**, caused by a **transient API rate limit** during a batch of three approvals. A **single manual retry** of the Nuelink handoff resolves the issue without re-approving the draft.

---

*Report generated from Firestore inspection and codebase analysis. Abexis CMS / blog automation pipeline.*
