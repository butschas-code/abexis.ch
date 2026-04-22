"use client";

/**
 * Article-level error boundary. Surfaces the digest so we can correlate with
 * Vercel function logs instead of the generic Next 500 screen.
 */
import Link from "next/link";
import { useEffect } from "react";

export default function BlogPostError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[blog/[slug]] client-caught render error", error);
  }, [error]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-20 text-[#1d1d1f]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Insights</p>
      <h1 className="mt-3 font-serif text-[28px] font-medium tracking-[-0.02em]">
        Dieser Beitrag konnte leider nicht geladen werden.
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-[#6e6e73]">
        Ein kurzer Serverfehler ist aufgetreten. Bitte versuchen Sie es gleich noch einmal.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-[var(--brand-900)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--brand-900-hover)]"
        >
          Erneut versuchen
        </button>
        <Link
          href="/blog"
          className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium text-[#1d1d1f] hover:bg-[#f5f5f7]"
        >
          Alle Beiträge
        </Link>
      </div>

      {error.digest ? (
        <p className="mt-10 text-[12px] text-[#a1a1a6]">
          Ref: <code className="rounded bg-black/[0.06] px-1.5 py-0.5 font-mono text-[11px]">{error.digest}</code>
        </p>
      ) : null}
    </main>
  );
}
