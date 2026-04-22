/** Immediate shell while a single article RSC loads (matches hero + column rhythm). */
export default function BlogPostLoading() {
  return (
    <div className="apple-section-mesh min-h-screen" aria-busy="true" aria-label="Artikel wird geladen">
      <div className="relative min-h-[min(100dvh,560px)] w-full animate-pulse bg-gradient-to-br from-[#1a2454] via-[#26337c] to-[#3d4d8a]" />
      <div className="mx-auto max-w-[1068px] px-4 pb-16 pt-10 sm:px-6 sm:pb-20 md:pt-12">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-44 rounded bg-black/[0.08]" />
          <div className="h-5 w-full max-w-2xl rounded bg-black/[0.08]" />
          <div className="h-5 w-[96%] max-w-2xl rounded bg-black/[0.08]" />
          <div className="h-4 w-full max-w-3xl rounded bg-black/[0.06]" />
          <div className="h-4 w-full max-w-3xl rounded bg-black/[0.06]" />
          <div className="h-4 w-[92%] max-w-3xl rounded bg-black/[0.06]" />
        </div>
      </div>
    </div>
  );
}
