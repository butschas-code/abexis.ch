"use client";

import { useEffect, useId, useRef, useState } from "react";

const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Turnstile konnte nicht geladen werden.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Turnstile konnte nicht geladen werden."));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export function isTurnstileConfigured(): boolean {
  return Boolean(SITE_KEY);
}

export function TurnstileField({
  onVerify,
  resetSignal,
  error,
}: {
  onVerify: (token: string | null) => void;
  resetSignal: number;
  error?: string | null;
}) {
  const id = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onVerifyRef = useRef(onVerify);
  const [loadError, setLoadError] = useState<string | null>(() =>
    SITE_KEY ? null : "Bot-Schutz ist nicht konfiguriert.",
  );

  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  useEffect(() => {
    let cancelled = false;

    if (!SITE_KEY) {
      return;
    }

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile || widgetIdRef.current) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          callback: (token) => {
            setLoadError(null);
            onVerifyRef.current(token);
          },
          "expired-callback": () => onVerifyRef.current(null),
          "error-callback": () => {
            onVerifyRef.current(null);
            setLoadError("Bot-Schutz konnte nicht bestätigt werden.");
          },
        });
      })
      .catch((err) => {
        onVerifyRef.current(null);
        setLoadError(err instanceof Error ? err.message : "Turnstile konnte nicht geladen werden.");
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!widgetIdRef.current || !window.turnstile) return;
    window.turnstile.reset(widgetIdRef.current);
    onVerifyRef.current(null);
  }, [resetSignal]);

  const message = error ?? loadError;

  return (
    <div>
      <div
        ref={containerRef}
        id={id}
        className="min-h-[65px]"
        aria-describedby={message ? `${id}-error` : undefined}
      />
      {message ? (
        <p id={`${id}-error`} className="mt-2 text-[13px] text-red-700" role="alert">
          {message}
        </p>
      ) : null}
    </div>
  );
}
