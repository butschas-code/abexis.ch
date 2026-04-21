"use client";

import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CMS_PATHS } from "@/admin/paths";
import { mapFirebaseAuthErrorToMessage } from "@/cms/auth/map-auth-error";
import { FirebaseWebEnvMissingPanel } from "@/components/cms/FirebaseWebEnvMissingPanel";
import { getCmsAuth } from "@/firebase/auth";
import { isFirebaseClientConfigured } from "@/firebase/client";

export function CmsLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isFirebaseClientConfigured()) return;
    const auth = getCmsAuth();
    if (!auth) return;
    return onAuthStateChanged(auth, (u) => {
      if (u) {
        router.replace(CMS_PATHS.adminHome);
        router.refresh();
      }
    });
  }, [router]);

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

  async function onSubmit(e: React.FormEvent) {
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
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace(CMS_PATHS.adminHome);
      router.refresh();
    } catch (err) {
      setError(mapFirebaseAuthErrorToMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
      <h1 className="text-lg font-semibold tracking-tight text-[var(--apple-text)]">CMS-Anmeldung</h1>
      <p className="mt-1 text-sm text-[var(--apple-text-secondary)]">
        Melden Sie sich mit Ihrer E-Mail und Ihrem Passwort an. Bei Problemen hilft Ihre Ansprechperson bei Abexis.
      </p>
      <form className="mt-6 space-y-4" onSubmit={(e) => void onSubmit(e)}>
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
          {busy ? "Anmelden…" : "Anmelden"}
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
