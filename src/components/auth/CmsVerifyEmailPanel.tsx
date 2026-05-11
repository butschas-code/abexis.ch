"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { reload, sendEmailVerification } from "firebase/auth";
import { useCallback, useState } from "react";
import { CMS_PATHS } from "@/admin/paths";
import { useCmsAuth } from "@/cms/auth/cms-auth-context";
import { mapFirebaseAuthErrorToMessage } from "@/cms/auth/map-auth-error";
import { getCmsAuth, getCmsAuthIdTokenFresh } from "@/firebase/auth";
import { AdminPageContainer, AdminPageHeader, AdminPageSection } from "@/components/admin/AdminPageContainer";
import { adminBtnPrimary, adminBtnSecondary } from "@/components/admin/admin-ui";
import { LogoutButton } from "@/components/admin/LogoutButton";

/**
 * Shown until Firebase marks the account email as verified (required for TOTP MFA enrollment).
 */
export function CmsVerifyEmailPanel() {
  const router = useRouter();
  const { user } = useCmsAuth();
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendAgain = useCallback(async () => {
    const auth = getCmsAuth();
    const u = auth?.currentUser ?? user;
    if (!u) return;
    setBusy(true);
    setError(null);
    setFeedback(null);
    try {
      await sendEmailVerification(u);
      setFeedback("Wir haben eine neue Bestätigungs-E-Mail gesendet. Bitte Posteingang und Spam prüfen.");
    } catch (e) {
      setError(mapFirebaseAuthErrorToMessage(e));
    } finally {
      setBusy(false);
    }
  }, [user]);

  const refreshStatus = useCallback(async () => {
    const auth = getCmsAuth();
    const u = auth?.currentUser ?? user;
    if (!u) return;
    setBusy(true);
    setError(null);
    try {
      await reload(u);
      await getCmsAuthIdTokenFresh(u);
      if (u.emailVerified) {
        router.replace(CMS_PATHS.adminMfaSetup);
        router.refresh();
      } else {
        setFeedback("Die E-Mail ist noch nicht bestätigt. Bitte auf den Link in der E-Mail klicken und erneut prüfen.");
      }
    } catch (e) {
      setError(mapFirebaseAuthErrorToMessage(e));
    } finally {
      setBusy(false);
    }
  }, [router, user]);

  const email = user?.email ?? "—";

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="E-Mail bestätigen"
        description="Zur Einrichtung der Zwei-Faktor-Authentifizierung muss Ihre E-Mail-Adresse einmalig bestätigt sein."
      />
      <AdminPageSection>
        <div className="max-w-lg space-y-4 rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
          <p className="text-sm text-[var(--apple-text-secondary)]">
            Gesendet an <span className="font-medium text-[var(--apple-text)]">{email}</span>
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-[var(--apple-text-secondary)]">
            <li>Posteingang öffnen und auf den Bestätigungslink klicken.</li>
            <li>Hier auf «Status prüfen» klicken — anschliessend richten wir die Authenticator-App ein.</li>
          </ol>
          {feedback ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{feedback}</div>
          ) : null}
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
              {error}
            </div>
          ) : null}
          <div className="flex flex-wrap gap-3 pt-2">
            <button type="button" disabled={busy} className={adminBtnPrimary} onClick={() => void refreshStatus()}>
              {busy ? "…" : "Status prüfen"}
            </button>
            <button type="button" disabled={busy} className={adminBtnSecondary} onClick={() => void sendAgain()}>
              E-Mail erneut senden
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-4 border-t border-black/[0.06] pt-6 text-sm">
            <LogoutButton label="Abmelden" variant="secondary" />
            <Link href="/" className="text-[var(--apple-text-tertiary)] hover:text-[var(--apple-text-secondary)]">
              Zur Website
            </Link>
          </div>
        </div>
      </AdminPageSection>
    </AdminPageContainer>
  );
}
