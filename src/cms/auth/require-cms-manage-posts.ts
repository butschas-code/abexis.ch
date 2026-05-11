import "server-only";

import { NextResponse } from "next/server";

import { verifyCmsBearer } from "@/cms/auth/cms-mfa-server";
import { roleHasPermission } from "@/cms/auth/permissions";
import { COLLECTIONS } from "@/cms/firestore/collections";
import type { AppUserRole } from "@/cms/types/enums";
import { adminDb } from "@/lib/firebaseAdmin";

/**
 * Requires `Authorization: Bearer <Firebase ID token>` and `manage_posts` on `users/{uid}`.
 * Mirrors CMS RBAC defaults : missing `users/{uid}` falls back to `editor`.
 */
export async function requireCmsManagePosts(req: Request): Promise<{ uid: string } | NextResponse> {
  const principal = await verifyCmsBearer(req);
  if (!principal) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Anmeldung erforderlich oder Token ungültig." },
      { status: 401 },
    );
  }

  let snap;
  try {
    snap = await adminDb.collection(COLLECTIONS.users).doc(principal.uid).get();
  } catch {
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Benutzerprofil konnte nicht geladen werden." },
      { status: 500 },
    );
  }

  const raw = snap.data()?.role;
  const role: AppUserRole = raw === "admin" || raw === "editor" || raw === "viewer" ? raw : "editor";
  if (!roleHasPermission(role, "manage_posts")) {
    return NextResponse.json({ error: "FORBIDDEN", message: "Keine Berechtigung." }, { status: 403 });
  }

  return { uid: principal.uid };
}
