import { createHmac, timingSafeEqual } from "node:crypto";

import { CMS_MFA_SESSION_COOKIE_NAME, CMS_MFA_SESSION_TTL_SEC } from "@/cms/auth/cms-mfa-constants";

export function requireMfaCookieSecret(): string | null {
  const s = process.env.CMS_MFA_COOKIE_SECRET?.trim();
  if (!s || s.length < 16) return null;
  return s;
}

export function cmsMfaSessionCookieName(): typeof CMS_MFA_SESSION_COOKIE_NAME {
  return CMS_MFA_SESSION_COOKIE_NAME;
}

export function signMfaSessionCookie(secret: string, uid: string): string {
  const exp = Math.floor(Date.now() / 1000) + CMS_MFA_SESSION_TTL_SEC;
  const payload = Buffer.from(JSON.stringify({ uid, exp }), "utf8").toString("base64url");
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

/** Returns true when the cookie is authentic, unexpired, and bound to `expectedUid`. */
export function isMfaSessionCookieValid(
  secret: string,
  cookieValue: string | undefined,
  expectedUid: string,
): boolean {
  if (!cookieValue || !secret) return false;
  const dot = cookieValue.lastIndexOf(".");
  if (dot <= 0) return false;
  const payloadPart = cookieValue.slice(0, dot);
  const sig = cookieValue.slice(dot + 1);
  const expectedSig = createHmac("sha256", secret).update(payloadPart).digest("base64url");
  try {
    if (sig.length !== expectedSig.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
      return false;
    }
  } catch {
    return false;
  }
  let parsed: { uid?: unknown; exp?: unknown };
  try {
    parsed = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf8")) as {
      uid?: unknown;
      exp?: unknown;
    };
  } catch {
    return false;
  }
  if (parsed.uid !== expectedUid) return false;
  if (typeof parsed.exp !== "number" || parsed.exp <= Math.floor(Date.now() / 1000)) return false;
  return true;
}

export function mfaSessionCookieOptions(): {
  httpOnly: boolean;
  sameSite: "lax";
  secure: boolean;
  path: string;
  maxAge: number;
} {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CMS_MFA_SESSION_TTL_SEC,
  };
}

export function clearedMfaSessionCookieOptions(): {
  httpOnly: boolean;
  sameSite: "lax";
  secure: boolean;
  path: string;
  maxAge: number;
} {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}
