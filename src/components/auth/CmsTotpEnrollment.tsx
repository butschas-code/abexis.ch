"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { CMS_PATHS } from "@/admin/paths";
import {
  fetchCmsMfaState,
  postCmsMfaEnrollComplete,
  postCmsMfaEnrollStart,
} from "@/cms/auth/cms-mfa-client";
import { useCmsAuth } from "@/cms/auth/cms-auth-context";
import { getCmsAuth, getCmsAuthIdTokenFresh } from "@/firebase/auth";
import { AdminPageContainer, AdminPageHeader, AdminPageSection } from "@/components/admin/AdminPageContainer";
import { adminBtnPrimary, adminInput } from "@/components/admin/admin-ui";
import { LogoutButton } from "@/components/admin/LogoutButton";

function messageForEnrollStartFailure(errorCode: string): string {
  const known: Record<string, string> = {
    email_not_verified:
      "Die E-Mail-Bestätigung ist für den Server noch nicht sichtbar (veraltetes Anmelde-Ticket). Bitte «QR-Code anzeigen» erneut klicken oder die Seite neu laden. Falls das weiter nicht hilft: auf «E-Mail bestätigen» zurück und «Status prüfen».",
    admin_not_configured:
      "Server-Konfiguration unvollständig (Firebase Admin). Bitte Administrator:in kontaktieren.",
    mfa_secret_missing:
      "Server-Konfiguration unvollständig (CMS_MFA_COOKIE_SECRET). Bitte Administrator:in kontaktieren.",
    persist_failed:
      "Die Einrichtung konnte nicht gespeichert werden (Firestore). Bitte Administrator:in kontaktieren.",
    unauthorized: "Sitzung ungültig. Bitte abmelden und erneut anmelden.",
  };
  return (
    known[errorCode] ??
    "Einrichtung konnte nicht gestartet werden. Bitte später erneut versuchen oder Administrator:in kontaktieren."
  );
}

/**
 * One-time TOTP enrollment (custom server verification + Firestore secret; no Firebase Identity Platform).
 */
export function CmsTotpEnrollment() {
  const router = useRouter();
  const { user } = useCmsAuth();
  const [serverEnrolled, setServerEnrolled] = useState<boolean | null>(null);
  const [payload, setPayload] = useState<{ otpauthUrl: string; manualKey: string } | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const auth = getCmsAuth();
      const u = auth?.currentUser ?? user ?? null;
      if (!u || !u.emailVerified) return;
      const token = await getCmsAuthIdTokenFresh(u);
      const st = await fetchCmsMfaState(token);
      setServerEnrolled(!!st?.enrolled);
    })();
  }, [user]);

  const startEnrollment = useCallback(async () => {
    const auth = getCmsAuth();
    const u = auth?.currentUser ?? user;
    if (!u?.emailVerified) {
      setError("Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const token = await getCmsAuthIdTokenFresh(u);
      const res = await postCmsMfaEnrollStart(token);
      if (!res.ok) {
        if (res.errorCode === "already_enrolled") {
          setServerEnrolled(true);
          setError(null);
          return;
        }
        setError(messageForEnrollStartFailure(res.errorCode));
        return;
      }
      setPayload({ otpauthUrl: res.otpauthUrl, manualKey: res.manualKey });
    } finally {
      setBusy(false);
    }
  }, [user]);

  const completeEnrollment = useCallback(async () => {
    const auth = getCmsAuth();
    const u = auth?.currentUser ?? user;
    if (!u || !payload) return;
    const trimmed = code.replace(/\s/g, "");
    if (trimmed.length < 6) {
      setError("Bitte den 6-stelligen Code aus der Authenticator-App eingeben.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const token = await getCmsAuthIdTokenFresh(u);
      const ok = await postCmsMfaEnrollComplete(token, trimmed);
      if (!ok) {
        setError("Der Code ist ungültig. Bitte erneut eingeben oder neuen QR-Code anfordern.");
        return;
      }
      router.replace(CMS_PATHS.adminHome);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }, [code, router, payload, user]);

  if (serverEnrolled === true) {
    return (
      <AdminPageContainer>
        <AdminPageHeader title="Zwei-Faktor-Authentifizierung" description="Dieses Konto ist bereits mit einer Authenticator-App geschützt." />
        <AdminPageSection>
          <Link href={CMS_PATHS.adminHome} className="text-sm font-medium text-[var(--brand-900)] hover:underline">
            Zur Übersicht
          </Link>
        </AdminPageSection>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Authenticator einrichten"
        description="Der zweite Faktor schützt das CMS, auch wenn ein Passwort bekannt wird. Installieren Sie z. B. Google Authenticator oder Microsoft Authenticator auf dem Smartphone."
      />
      <AdminPageSection>
        <div className="max-w-xl space-y-6 rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
          {!payload ? (
            <div className="space-y-4">
              <p className="text-sm text-[var(--apple-text-secondary)]">
                Sie erhalten einen QR-Code und einen Einrichtungscode. Danach geben Sie zum Abschluss einen Einmalcode aus der App ein.
              </p>
              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
                  {error}
                </div>
              ) : null}
              <button type="button" disabled={busy} className={adminBtnPrimary} onClick={() => void startEnrollment()}>
                {busy ? "Wird vorbereitet…" : "QR-Code anzeigen"}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <div className="rounded-xl border border-black/10 bg-white p-3">
                  <QRCode value={payload.otpauthUrl} size={176} />
                </div>
                <div className="min-w-0 space-y-2 text-sm">
                  <p className="font-medium text-[var(--apple-text)]">Manuelle Eingabe</p>
                  <p className="break-all font-mono text-[13px] text-[var(--apple-text-secondary)]">{payload.manualKey}</p>
                </div>
              </div>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-[var(--apple-text)]">Code aus der App</span>
                <input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="123456"
                  className={adminInput}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^\d]/g, "").slice(0, 10))}
                />
              </label>
              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
                  {error}
                </div>
              ) : null}
              <button type="button" disabled={busy} className={adminBtnPrimary} onClick={() => void completeEnrollment()}>
                {busy ? "Wird gespeichert…" : "Authenticator aktivieren"}
              </button>
            </div>
          )}
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
