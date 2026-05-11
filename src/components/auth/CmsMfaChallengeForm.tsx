"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CMS_PATHS } from "@/admin/paths";
import { postCmsMfaVerify } from "@/cms/auth/cms-mfa-client";
import { useCmsAuth } from "@/cms/auth/cms-auth-context";
import { getCmsAuth, getCmsAuthIdTokenFresh } from "@/firebase/auth";
import { AdminPageContainer, AdminPageHeader, AdminPageSection } from "@/components/admin/AdminPageContainer";
import { adminBtnPrimary, adminInput } from "@/components/admin/admin-ui";
import { LogoutButton } from "@/components/admin/LogoutButton";

/** Second step after password when the MFA session cookie expired (custom TOTP). */
export function CmsMfaChallengeForm() {
  const router = useRouter();
  const { user } = useCmsAuth();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const auth = getCmsAuth();
    const u = auth?.currentUser ?? user;
    if (!u) {
      setError("Sitzung ungültig. Bitte erneut anmelden.");
      return;
    }
    const trimmed = code.replace(/\s/g, "");
    if (trimmed.length < 6) {
      setError("Bitte den 6-stelligen Code aus der Authenticator-App eingeben.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const token = await getCmsAuthIdTokenFresh(u);
      const ok = await postCmsMfaVerify(token, trimmed);
      if (!ok) {
        setError("Der Code ist ungültig oder abgelaufen. Bitte erneut versuchen.");
        return;
      }
      router.replace(CMS_PATHS.adminHome);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Authenticator bestätigen"
        description="Aus Sicherheitsgründen ist die zweite Anmeldung nötig. Geben Sie den aktuellen Code aus Ihrer Authenticator-App ein."
      />
      <AdminPageSection>
        <form
          className="mx-auto max-w-md space-y-4 rounded-2xl border border-black/10 bg-white p-8 shadow-sm"
          onSubmit={(e) => void onSubmit(e)}
        >
          <p className="text-sm text-[var(--apple-text-secondary)]">
            Angemeldet als <span className="font-medium text-[var(--apple-text)]">{user?.email ?? ""}</span>
          </p>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-[var(--apple-text)]">Einmalcode</span>
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              placeholder="123456"
              className={adminInput}
              value={code}
              onChange={(ev) => setCode(ev.target.value.replace(/[^\d]/g, "").slice(0, 10))}
              required
            />
          </label>
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
              {error}
            </div>
          ) : null}
          <button type="submit" disabled={busy} className={`${adminBtnPrimary} w-full`}>
            {busy ? "Prüfen…" : "Weiter zum CMS"}
          </button>
          <div className="flex flex-wrap items-center gap-4 border-t border-black/[0.06] pt-6 text-sm">
            <LogoutButton label="Abmelden" variant="secondary" />
            <Link href="/" className="text-[var(--apple-text-tertiary)] hover:text-[var(--apple-text-secondary)]">
              Zur Website
            </Link>
          </div>
        </form>
      </AdminPageSection>
    </AdminPageContainer>
  );
}
