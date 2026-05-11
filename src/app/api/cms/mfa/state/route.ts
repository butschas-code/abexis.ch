import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  cmsMfaSessionCookieName,
  isMfaSessionCookieValid,
  requireMfaCookieSecret,
} from "@/cms/auth/cms-mfa-cookie";
import { verifyCmsBearer } from "@/cms/auth/cms-mfa-server";
import { cmsTotpEnrollmentExists } from "@/cms/services/cms-mfa-firestore";
import { isFirebaseAdminConfigured } from "@/firebase/admin";

export async function GET(req: Request) {
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ error: "admin_not_configured" }, { status: 503 });
  }
  const principal = await verifyCmsBearer(req);
  if (!principal) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const cookieSecret = requireMfaCookieSecret();
  if (!cookieSecret) {
    return NextResponse.json({ error: "mfa_secret_missing" }, { status: 503 });
  }

  const jar = await cookies();
  const raw = jar.get(cmsMfaSessionCookieName())?.value;
  const enrolled = await cmsTotpEnrollmentExists(principal.uid);
  const sessionTrusted = enrolled && isMfaSessionCookieValid(cookieSecret, raw, principal.uid);

  return NextResponse.json({ enrolled, sessionTrusted });
}
