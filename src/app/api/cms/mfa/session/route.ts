import { NextResponse } from "next/server";

import { clearedMfaSessionCookieOptions, cmsMfaSessionCookieName } from "@/cms/auth/cms-mfa-cookie";

/** Clears the CMS MFA browser cookie (call before or after Firebase sign-out). */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cmsMfaSessionCookieName(), "", clearedMfaSessionCookieOptions());
  return res;
}
