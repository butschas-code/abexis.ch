"use client";

/**
 * Public-site form intake: uploads files via Admin API, then saves structured row via JSON API.
 * Use from `executive_search` briefs, contact forms, etc.
 */

const SUBMIT_URL = "/api/cms/v1/form-submissions";
const UPLOAD_URL = "/api/cms/v1/form-submissions/upload";

export type SubmissionPayloadInput = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  message?: string;
  /** Extra string fields merged into payload (keys max 80 chars). */
  extra?: Record<string, string>;
  /** Stored with payload as `formId`. */
  formId?: string;
};

export type SubmitFormOptions = {
  site: "abexis" | "search";
  type: "contact" | "executive_search" | "application" | "newsletter" | "generic";
  payload: SubmissionPayloadInput;
  files?: File[];
  formId?: string;
  turnstileToken?: string;
};

async function uploadFiles(files: File[]): Promise<string[]> {
  if (files.length === 0) return [];
  const fd = new FormData();
  for (const f of files) {
    fd.append("files", f, f.name);
  }
  const res = await fetch(UPLOAD_URL, { method: "POST", body: fd });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
    throw new Error(err.message ?? err.error ?? `Upload failed (${res.status})`);
  }
  const data = (await res.json()) as { urls?: string[] };
  return data.urls ?? [];
}

function buildPayload(o: SubmitFormOptions): Record<string, string> {
  const p: Record<string, string> = {};
  const add = (k: string, v: string | undefined) => {
    const t = v?.trim();
    if (t) p[k] = t;
  };
  add("name", o.payload.name);
  add("company", o.payload.company);
  add("email", o.payload.email);
  add("phone", o.payload.phone);
  add("message", o.payload.message);
  const formId = o.formId ?? o.payload.formId;
  if (formId?.trim()) p.formId = formId.trim();
  if (o.payload.extra) {
    for (const [k, v] of Object.entries(o.payload.extra)) {
      const key = k.slice(0, 80);
      if (v?.trim()) p[key] = v.trim().slice(0, 8000);
    }
  }
  return p;
}

/**
 * Full flow: optional Storage upload, then Firestore row via `POST /api/cms/v1/form-submissions`.
 * Returns created document id.
 */
export async function submitPublicForm(options: SubmitFormOptions): Promise<{ id: string }> {
  const fileUrls = options.files?.length ? await uploadFiles(options.files) : [];
  const payload = buildPayload(options);
  if (Object.keys(payload).length === 0) {
    throw new Error("Mindestens ein Feldfeld ist erforderlich.");
  }

  const body = {
    site: options.site,
    type: options.type,
    formId: options.formId ?? payload.formId ?? `${options.type}-form`,
    payload,
    fileUrls,
    sourceUrl: typeof window !== "undefined" ? window.location.href : null,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    turnstileToken: options.turnstileToken,
  };

  const res = await fetch(SUBMIT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
    throw new Error(err.message ?? err.error ?? `Submit failed (${res.status})`);
  }
  const data = (await res.json()) as { id?: string };
  if (!data.id) throw new Error("Keine Submission-ID zurückgegeben.");
  return { id: data.id };
}
