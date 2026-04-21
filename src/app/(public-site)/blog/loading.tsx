/**
 * Shown immediately on client navigation while the blog index RSC loads.
 * Avoids the “dead click” feeling when Firestore / CMS data is slow.
 */
export default function BlogIndexLoading() {
  return (
    <div className="mx-auto max-w-[1068px] px-4 pb-20 pt-10 sm:px-6 md:pt-14" aria-busy="true" aria-label="Insights werden geladen">
      <div className="animate-pulse">
        <div className="h-3 w-24 rounded-full bg-black/[0.08]" />
        <div className="mt-4 h-10 max-w-md rounded-lg bg-black/[0.08]" />
        <div className="mt-4 h-4 max-w-xl rounded bg-black/[0.06]" />
        <div className="mt-3 h-4 max-w-lg rounded bg-black/[0.06]" />
      </div>

      <div className="mt-14 grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        <div className="aspect-[16/11] w-full animate-pulse rounded-[32px] bg-black/[0.06] md:min-h-[320px] lg:min-h-[380px]" />
        <div className="flex flex-col gap-4">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-4 rounded-2xl border border-black/[0.06] bg-white/80 p-3">
              <div className="h-[104px] w-[120px] shrink-0 animate-pulse rounded-xl bg-black/[0.06]" />
              <div className="flex flex-1 flex-col justify-center gap-2 py-1">
                <div className="h-2.5 w-20 animate-pulse rounded bg-black/[0.06]" />
                <div className="h-4 w-full animate-pulse rounded bg-black/[0.06]" />
                <div className="h-4 w-[85%] animate-pulse rounded bg-black/[0.06]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <div className="mb-8 h-7 w-48 animate-pulse rounded-lg bg-black/[0.08]" />
        <ul className="grid list-none gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <li key={i} className="h-full">
              <div className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-[27px] bg-white shadow-sm ring-1 ring-black/[0.05]">
                <div className="aspect-[16/10] w-full animate-pulse bg-black/[0.06]" />
                <div className="flex flex-1 flex-col gap-3 px-7 pb-8 pt-6">
                  <div className="h-2.5 w-24 animate-pulse rounded bg-black/[0.06]" />
                  <div className="h-6 w-full animate-pulse rounded bg-black/[0.08]" />
                  <div className="h-4 w-full animate-pulse rounded bg-black/[0.06]" />
                  <div className="h-4 w-[92%] animate-pulse rounded bg-black/[0.06]" />
                  <div className="mt-auto h-3 w-32 animate-pulse rounded bg-black/[0.05]" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
