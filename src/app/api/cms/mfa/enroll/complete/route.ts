import { NextResponse } from "next/server";

import { cmsMfaTotpVerify } from "@/cms/auth/cms-mfa-totp";
import {
  cmsMfaSessionCookieName,
  mfaSessionCookieOptions,
  requireMfaCookieSecret,
  signMfaSessionCookie,
} from "@/cms/auth/cms-mfa-cookie";
import { verifyCmsBearer } from "@/cms/auth/cms-mfa-server";
import {
  cmsTotpEnrollmentExists,
  commitCmsTotpEnrollment,
  getCmsTotpPendingSecret,
} from "@/cms/services/cms-mfa-firestore";
import { isFirebaseAdminConfigured } from "@/firebase/admin";

export async function POST(req: Request) {
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ error: "admin_not_configured" }, { status: 503 });
  }
  const principal = await verifyCmsBearer(req);
  if (!principal) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!principal.emailVerified) {
    return NextResponse.json({ error: "email_not_verified" }, { status: 403 });
  }
  const cookieSecret = requireMfaCookieSecret();
  if (!cookieSecret) return NextResponse.json({ error: "mfa_secret_missing" }, { status: 503 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }
  const codeRaw =
    typeof body === "object" && body !== null && "code" in body
      ? String((body as { code: unknown }).code ?? "")
      : "";
  const code = codeRaw.replace(/\s/g, "");
  if (code.length < 6) return NextResponse.json({ error: "invalid_code" }, { status: 400 });

  if (await cmsTotpEnrollmentExists(principal.uid)) {
    return NextResponse.json({ error: "already_enrolled" }, { status: 409 });
  }

  const pending = await getCmsTotpPendingSecret(principal.uid);
  if (!pending) {
    return NextResponse.json({ error: "enrollment_not_started" }, { status: 400 });
  }

  const ok = cmsMfaTotpVerify(pending, code);
  if (!ok) return NextResponse.json({ error: "totp_mismatch" }, { status: 401 });

  const committed = await commitCmsTotpEnrollment(principal.uid, pending);
  if (!committed) return NextResponse.json({ error: "persist_failed" }, { status: 503 });

  const res = NextResponse.json({ ok: true });
  const sessionVal = signMfaSessionCookie(cookieSecret, principal.uid);
  res.cookies.set(cmsMfaSessionCookieName(), sessionVal, mfaSessionCookieOptions());
  return res;
}
