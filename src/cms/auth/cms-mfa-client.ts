export type CmsMfaApiState = {
  enrolled: boolean;
  sessionTrusted: boolean;
};

export async function fetchCmsMfaState(idToken: string): Promise<CmsMfaApiState | null> {
  const res = await fetch("/api/cms/mfa/state", {
    headers: { Authorization: `Bearer ${idToken}` },
    credentials: "include",
  });
  if (!res.ok) return null;
  try {
    const j = (await res.json()) as Partial<CmsMfaApiState>;
    if (typeof j.enrolled !== "boolean" || typeof j.sessionTrusted !== "boolean") return null;
    return { enrolled: j.enrolled, sessionTrusted: j.sessionTrusted };
  } catch {
    return null;
  }
}

export async function postCmsMfaVerify(idToken: string, code: string): Promise<boolean> {
  const res = await fetch("/api/cms/mfa/verify", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ code }),
  });
  return res.ok;
}

export type CmsMfaEnrollStartResult =
  | { ok: true; otpauthUrl: string; manualKey: string }
  | { ok: false; errorCode: string };

export async function postCmsMfaEnrollStart(idToken: string): Promise<CmsMfaEnrollStartResult> {
  const res = await fetch("/api/cms/mfa/enroll/start", {
    method: "POST",
    headers: { Authorization: `Bearer ${idToken}` },
    credentials: "include",
  });
  const j = (await res.json().catch(() => ({}))) as { error?: string; otpauthUrl?: string; manualKey?: string };
  if (!res.ok) return { ok: false, errorCode: j.error ?? "request_failed" };
  if (typeof j.otpauthUrl !== "string" || typeof j.manualKey !== "string") {
    return { ok: false, errorCode: "bad_response" };
  }
  return { ok: true, otpauthUrl: j.otpauthUrl, manualKey: j.manualKey };
}

export async function postCmsMfaEnrollComplete(idToken: string, code: string): Promise<boolean> {
  const res = await fetch("/api/cms/mfa/enroll/complete", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ code }),
  });
  return res.ok;
}
