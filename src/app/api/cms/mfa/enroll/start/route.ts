import { NextResponse } from "next/server";

import { cmsMfaTotpGenerateSecret, cmsMfaTotpOtpauthUri } from "@/cms/auth/cms-mfa-totp";
import { verifyCmsBearer } from "@/cms/auth/cms-mfa-server";
import { cmsTotpEnrollmentExists, setCmsTotpPending } from "@/cms/services/cms-mfa-firestore";
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

  if (await cmsTotpEnrollmentExists(principal.uid)) {
    return NextResponse.json({ error: "already_enrolled" }, { status: 409 });
  }

  const secretBase32 = cmsMfaTotpGenerateSecret();
  const saved = await setCmsTotpPending(principal.uid, secretBase32);
  if (!saved) return NextResponse.json({ error: "persist_failed" }, { status: 503 });

  const email = principal.email ?? principal.uid;
  const otpauthUrl = cmsMfaTotpOtpauthUri(email, secretBase32);
  return NextResponse.json({ otpauthUrl, manualKey: secretBase32 });
}
