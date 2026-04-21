"use client";

import type { ReactNode } from "react";
import { FIREBASE_WEB_PUBLIC_KEYS } from "@/firebase/env.schema";
import { getFirebaseClientConfigMissingKeys } from "@/firebase/client";

type Props = {
  title?: string;
  footer?: ReactNode;
};

/**
 * Shown when `parseFirebaseWebEnv()` fails (missing/empty `NEXT_PUBLIC_FIREBASE_*`).
 * Copy distinguishes local dev (`.env.local`) from production (e.g. Vercel env + redeploy).
 */
export function FirebaseWebEnvMissingPanel({ title = "CMS nicht konfiguriert", footer }: Props) {
  const missing = getFirebaseClientConfigMissingKeys();
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
      <h1 className="text-lg font-semibold text-[var(--apple-text)]">{title}</h1>
      {isDev ? (
        <p className="mt-2 text-sm text-[var(--apple-text-secondary)]">
          Lokal: Datei <code className="rounded bg-black/[0.06] px-1 py-0.5 text-[13px]">.env.local</code> aus{" "}
          <code className="rounded bg-black/[0.06] px-1 py-0.5 text-[13px]">.env.example</code> anlegen und alle
          Firebase-Web-Variablen setzen (siehe Kommentare in der Example-Datei). Anschliessend den Dev-Server neu
          starten.
        </p>
      ) : (
        <p className="mt-2 text-sm text-[var(--apple-text-secondary)]">
          Auf dem Server (z.&nbsp;B. Vercel) gibt es keine <code className="rounded bg-black/[0.06] px-1 py-0.5 text-[13px]">.env.local</code>. Im
          Vercel-Dashboard unter{" "}
          <strong className="text-[var(--apple-text)]">Project → Settings → Environment Variables</strong> dieselben{" "}
          <code className="rounded bg-black/[0.06] px-1 py-0.5 text-[13px]">NEXT_PUBLIC_FIREBASE_*</code>-Werte wie
          lokal eintragen (für <strong className="text-[var(--apple-text)]">Production</strong> und ggf.{" "}
          <strong className="text-[var(--apple-text)]">Preview</strong>), dann eine{" "}
          <strong className="text-[var(--apple-text)]">neue Deployment</strong> auslösen — die Werte werden beim Build
          ins Client-Bundle übernommen.
        </p>
      )}
      <p className="mt-4 text-sm text-[var(--apple-text-secondary)]">
        In der{" "}
        <a
          className="font-medium text-[var(--brand-900)] underline-offset-2 hover:underline"
          href="https://console.firebase.google.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          Firebase Console
        </a>{" "}
        → Projekteinstellungen → Ihre Web-App finden Sie die passenden Werte.
      </p>
      {missing.length > 0 ? (
        <div className="mt-5 rounded-xl border border-amber-200/80 bg-amber-50/90 px-3 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-950/80">Aktuell fehlend oder leer</p>
          <ul className="mt-2 space-y-1 font-mono text-[12px] leading-relaxed text-amber-950">
            {missing.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <p className="mt-4 text-xs leading-relaxed text-[var(--apple-text-tertiary)]">
        Erforderliche Variablennamen:{" "}
        <span className="font-mono text-[11px] text-[var(--apple-text-secondary)]">
          {FIREBASE_WEB_PUBLIC_KEYS.join(", ")}
        </span>
      </p>
      <p className="mt-4 text-xs leading-relaxed text-[var(--apple-text-tertiary)]">
        Wenn die Anmeldung nach dem Setzen der Variablen mit «Unauthorized domain» abbricht: unter{" "}
        <strong className="text-[var(--apple-text-secondary)]">Authentication → Settings → Authorized domains</strong>{" "}
        Ihre Vercel-Domain (z.&nbsp;B. <code className="rounded bg-black/[0.06] px-1">abexisch.vercel.app</code>) und
        die Produktionsdomain ergänzen.
      </p>
      {footer ? <div className="mt-6">{footer}</div> : null}
    </div>
  );
}
