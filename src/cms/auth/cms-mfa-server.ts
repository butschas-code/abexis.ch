import { getAdminAuth } from "@/firebase/admin";

export type CmsVerifiedPrincipal = {
  uid: string;
  email?: string;
  emailVerified: boolean;
};

/** Validates `Authorization: Bearer <Firebase ID token>` via Admin SDK. */
export async function verifyCmsBearer(req: Request): Promise<CmsVerifiedPrincipal | null> {
  const raw = req.headers.get("authorization");
  const m = raw?.match(/^Bearer\s+(.+)$/i);
  if (!m?.[1]) return null;
  const auth = getAdminAuth();
  if (!auth) return null;
  try {
    const d = await auth.verifyIdToken(m[1]);
    return {
      uid: d.uid,
      email: typeof d.email === "string" ? d.email : undefined,
      emailVerified: !!d.email_verified,
    };
  } catch {
    return null;
  }
}
