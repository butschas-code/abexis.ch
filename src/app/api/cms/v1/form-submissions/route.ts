import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { COLLECTIONS } from "@/cms/firestore/collections";
import { parseSubmissionCreate } from "@/cms/schema";
import { CMS_SUBMISSION_TYPES, type CmsSubmissionType } from "@/cms/types/enums";
import { getAdminFirestore } from "@/firebase/server";
import { notifySiteContactInbox } from "@/lib/notify-site-contact-inbox";

type Body = {
  site?: unknown;
  formId?: unknown;
  type?: unknown;
  fields?: unknown;
  payload?: unknown;
  sourceUrl?: unknown;
  userAgent?: unknown;
  fileUrls?: unknown;
  turnstileToken?: unknown;
};

function isDeploymentSite(v: unknown): v is "abexis" | "search" {
  return v === "abexis" || v === "search";
}

function sanitizePayload(raw: unknown): Record<string, string> | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    const key = k.slice(0, 80);
    if (typeof v === "string") out[key] = v.slice(0, 8000);
    else if (v == null) out[key] = "";
    else out[key] = String(v).slice(0, 8000);
    if (Object.keys(out).length >= 40) break;
  }
  return Object.keys(out).length ? out : null;
}

function sanitizeFileUrls(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((u): u is string => typeof u === "string" && u.length > 0)
    .map((u) => u.slice(0, 2000))
    .slice(0, 20);
}

function resolveSubmissionType(typeUnknown: unknown, formId: string): CmsSubmissionType {
  if (typeof typeUnknown === "string" && (CMS_SUBMISSION_TYPES as readonly string[]).includes(typeUnknown)) {
    return typeUnknown as CmsSubmissionType;
  }
  const fid = formId.toLowerCase();
  if (fid.includes("search") || fid.includes("executive")) return "executive_search";
  if (fid.includes("newsletter")) return "newsletter";
  if (fid.includes("application") || fid.includes("bewerb")) return "application";
  if (fid.includes("contact") || fid.includes("kontakt")) return "contact";
  return "generic";
}

/**
 * Server-side intake → `submissions` collection (Admin SDK).
 *
 * Accepts either:
 * - Legacy: `{ site, formId, fields, sourceUrl?, userAgent? }`
 * - New: `{ site, type?, formId?, payload | fields, fileUrls?, sourceUrl?, userAgent? }`
 *
 * Env: `FIREBASE_PROJECT_ID` + service account or ADC (`@/firebase/server`).
 */
export async function POST(req: Request) {
  const db = getAdminFirestore();
  if (!db) {
    return NextResponse.json(
      { error: "CMS_ADMIN_NOT_CONFIGURED", message: "Set FIREBASE_PROJECT_ID and FIREBASE_SERVICE_ACCOUNT_JSON." },
      { status: 503 },
    );
  }

  let json: Body;
  try {
    json = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  if (!isDeploymentSite(json.site)) {
    return NextResponse.json({ error: "INVALID_SITE" }, { status: 400 });
  }

  const formId =
    typeof json.formId === "string" && json.formId.trim() ? json.formId.trim().slice(0, 80) : "generic";
  const rawPayload = json.payload ?? json.fields;
  const payload = sanitizePayload(rawPayload);
  if (!payload) {
    return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const sourceUrl = typeof json.sourceUrl === "string" ? json.sourceUrl.slice(0, 2000) : null;
  const userAgent = typeof json.userAgent === "string" ? json.userAgent.slice(0, 500) : null;
  const fileUrls = sanitizeFileUrls(json.fileUrls);
  const turnstileToken = typeof json.turnstileToken === "string" ? json.turnstileToken.trim().slice(0, 4096) : "";
  const type = resolveSubmissionType(json.type, formId);
  if ((type === "contact" || type === "application") && !turnstileToken) {
    return NextResponse.json({ error: "TURNSTILE_REQUIRED" }, { status: 400 });
  }

  const candidate = {
    type,
    site: json.site,
    payload: { ...payload, formId },
    fileUrls,
    status: "new" as const,
    sourceUrl,
    userAgent,
  };
  const parsed = parseSubmissionCreate(candidate);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_SUBMISSION", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    if (parsed.data.type === "application") {
      const formsparkId = process.env.FORMSPARK_APPLICATION_FORM_ID || "WJ0NX6MXO";
      if (formsparkId) {
        const res = await fetch(`https://submit-form.com/${formsparkId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            "Job": parsed.data.payload.jobTitle || "Unknown Job",
            "Job ID": parsed.data.payload.jobId || "N/A",
            "Job type": parsed.data.payload.jobType || "",
            "Spontaneous": parsed.data.payload.isSpontaneous || "",
            "Name": parsed.data.payload.name || "",
            "Email": parsed.data.payload.email || "",
            "Phone": parsed.data.payload.phone || "",
            "Message": parsed.data.payload.message || "",
            "CV / Files": parsed.data.fileUrls?.join("\n") || "Keine Dateien hochgeladen",
            ...(turnstileToken ? { "cf-turnstile-response": turnstileToken } : {}),
            "_email.from": parsed.data.payload.name || "",
            "_email.subject": `Neue Bewerbung: ${parsed.data.payload.jobTitle || "Vakanz"}`,
          }),
        });
        if (!res.ok) {
          const err = await res.text().catch(() => "");
          console.error("Formspark send error:", res.status, err);
          throw new Error("FORMSPARK_APPLICATION_FAILED");
        }
      }
    }

    if (parsed.data.type === "contact" || parsed.data.type === "executive_search") {
      try {
        await notifySiteContactInbox({
          type: parsed.data.type,
          payload: parsed.data.payload as Record<string, string>,
          fileUrls: parsed.data.fileUrls ?? [],
          turnstileToken,
        });
      } catch (err) {
        console.error("Contact inbox notify error:", err);
        throw err;
      }
    }

    const ref = await db.collection(COLLECTIONS.submissions).add({
      ...parsed.data,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: ref.id }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: "CMS_WRITE_FAILED", message }, { status: 500 });
  }
}
