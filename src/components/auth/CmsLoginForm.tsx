"use client";

import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CMS_PATHS } from "@/admin/paths";
import { fetchCmsMfaState, postCmsMfaVerify } from "@/cms/auth/cms-mfa-client";
import { mapFirebaseAuthErrorToMessage } from "@/cms/auth/map-auth-error";
import { FirebaseWebEnvMissingPanel } from "@/components/cms/FirebaseWebEnvMissingPanel";
import { getCmsAuth, getCmsAuthIdTokenFresh } from "@/firebase/auth";
import { isFirebaseClientConfigured } from "@/firebase/client";

type LoginPhase = "credentials" | "totp";

export function CmsLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [phase, setPhase] = useState<LoginPhase>("credentials");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isFirebaseClientConfigured()) return;
    const auth = getCmsAuth();
    if (!auth) return;
    return onAuthStateChanged(auth, (u) => {
      if (!u || phase !== "credentials") return;
      queueMicrotask(() => {
        void (async () => {
          const token = await getCmsAuthIdTokenFresh(u);
          const state = await fetchCmsMfaState(token);
          if (state?.enrolled && !state.sessionTrusted) {
            setEmail(u.email ?? "");
            setPhase("totp");
            return;
          }
          router.replace(CMS_PATHS.adminHome);
          router.refresh();
        })();
      });
    });
  }, [router, phase]);

  if (!isFirebaseClientConfigured()) {
    return (
      <FirebaseWebEnvMissingPanel
        title="Firebase fehlt"
        footer={
          <Link href="/" className="inline-block text-sm font-medium text-[var(--brand-900)] hover:underline">
            Zur Website
          </Link>
        }
      />
    );
  }

  function resetMfaState() {
    setTotpCode("");
    setPhase("credentials");
    setError(null);
  }

  async function onSubmitCredentials(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const auth = getCmsAuth();
    if (!auth) {
      setError("Anmeldung ist gerade nicht verfügbar. Bitte Seite neu laden.");
      setBusy(false);
      return;
    }
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const token = await getCmsAuthIdTokenFresh(cred.user);
      const state = await fetchCmsMfaState(token);
      if (!state) {
        setError(
          "Der Server für die Zwei-Faktor-Prüfung antwortet nicht. Bitte Administrator:in kontaktieren (Firebase Admin, CMS_MFA_COOKIE_SECRET).",
        );
        return;
      }
      if (state.enrolled && !state.sessionTrusted) {
        setPhase("totp");
        setPassword("");
        return;
      }
      router.replace(CMS_PATHS.adminHome);
      router.refresh();
    } catch (err) {
      setError(mapFirebaseAuthErrorToMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function onSubmitTotp(e: React.FormEvent) {
    e.preventDefault();
    const auth = getCmsAuth();
    const u = auth?.currentUser;
    if (!u) {
      setError("Sitzung abgelaufen. Bitte erneut mit E-Mail und Passwort anmelden.");
      resetMfaState();
      return;
    }
    const trimmed = totpCode.replace(/\s/g, "");
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

  if (phase === "totp") {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
        <h1 className="text-lg font-semibold tracking-tight text-[var(--apple-text)]">Authenticator-Code</h1>
        <p className="mt-1 text-sm text-[var(--apple-text-secondary)]">
          Geben Sie den aktuellen Code aus Ihrer Authenticator-App für{" "}
          <span className="font-medium text-[var(--apple-text)]">{email.trim() || "Ihr Konto"}</span> ein.
        </p>
        <form className="mt-6 space-y-4" onSubmit={(e) => void onSubmitTotp(e)}>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-[var(--apple-text)]">Einmalcode</span>
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              placeholder="123456"
              className="w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm outline-none ring-[var(--brand-500)]/25 focus:ring-4"
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value.replace(/[^\d]/g, "").slice(0, 10))}
              required
            />
          </label>
          {error ? (
            <div
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-[var(--brand-900)] py-2.5 text-sm font-medium text-white hover:bg-[var(--brand-900-hover)] disabled:opacity-60"
          >
            {busy ? "Prüfen…" : "Anmelden"}
          </button>
          <button
            type="button"
            className="w-full text-center text-sm text-[var(--brand-900)] hover:underline"
            onClick={() => resetMfaState()}
          >
            Zurück zur Passwort-Anmeldung
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
      <h1 className="text-lg font-semibold tracking-tight text-[var(--apple-text)]">CMS-Anmeldung</h1>
      <p className="mt-1 text-sm text-[var(--apple-text-secondary)]">
        Melden Sie sich mit E-Mail und Passwort an. Ist eine Authenticator-App eingerichtet, geben Sie anschliessend den
        aktuellen Code ein.
      </p>
      <form className="mt-6 space-y-4" onSubmit={(e) => void onSubmitCredentials(e)}>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-[var(--apple-text)]">E-Mail</span>
          <input
            type="email"
            autoComplete="email"
            className="w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm outline-none ring-[var(--brand-500)]/25 focus:ring-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-[var(--apple-text)]">Passwort</span>
          <input
            type="password"
            autoComplete="current-password"
            className="w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm outline-none ring-[var(--brand-500)]/25 focus:ring-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error ? (
          <div
            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-[var(--brand-900)] py-2.5 text-sm font-medium text-white hover:bg-[var(--brand-900-hover)] disabled:opacity-60"
        >
          {busy ? "Anmelden…" : "Weiter"}
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-[var(--apple-text-tertiary)]">
        <Link href="/" className="hover:text-[var(--apple-text-secondary)]">
          Zurück zur Website
        </Link>
      </p>
    </div>
  );
}
