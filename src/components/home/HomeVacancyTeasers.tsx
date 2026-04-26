import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { listPublishedVacancies } from "@/public-site/cms/vacancy";

export async function HomeVacancyTeasers() {
  let vacancies: Awaited<ReturnType<typeof listPublishedVacancies>> = [];
  try {
    vacancies = await listPublishedVacancies(3);
  } catch {
    return null;
  }

  if (vacancies.length === 0) return null;

  return (
    <MotionSection className="pt-8 pb-8 sm:pt-10 sm:pb-10 md:pt-12 md:pb-12">
      <div className="mx-auto max-w-[1068px] pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:pl-6 sm:pr-6">
        <div className="flex flex-col justify-between gap-4 sm:gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Executive Search</p>
            <h2 className="mt-2 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-[#1d1d1f] sm:text-[32px] md:text-[40px]">
              Aktuelle Vakanzen
            </h2>
          </div>
          <Link
            href="/executive-search/vakanzen"
            className="min-h-11 shrink-0 self-start text-[15px] font-medium text-brand-900 transition-colors duration-200 hover:text-brand-500 hover:underline md:self-auto"
          >
            Alle Vakanzen
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {vacancies.map((v) => (
            <Link
              key={v.id}
              href={`/executive-search/vakanzen/${v.slug}`}
              className="group flex flex-col justify-between overflow-hidden rounded-[1.25rem] border border-black/[0.05] bg-white p-5 shadow-[var(--apple-shadow)] ring-1 ring-transparent transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--apple-shadow-lg)] hover:ring-brand-500/20 sm:rounded-[1.5rem] sm:p-6 active:scale-[0.99]"
            >
              <div>
                {(v.sector || v.location) && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {v.sector && (
                      <span className="rounded-full bg-[#f5f5f7] px-2.5 py-0.5 text-[11px] font-medium text-[#6e6e73]">
                        {v.sector}
                      </span>
                    )}
                    {v.location && (
                      <span className="rounded-full bg-[#f5f5f7] px-2.5 py-0.5 text-[11px] font-medium text-[#6e6e73]">
                        {v.location}
                      </span>
                    )}
                  </div>
                )}
                <h3 className="text-[17px] font-semibold leading-snug tracking-[-0.02em] text-[#1d1d1f] group-hover:text-brand-900 transition-colors duration-200">
                  {v.title}
                </h3>
                {v.excerpt && (
                  <p className="mt-2 text-[14px] leading-relaxed text-[#86868b] line-clamp-2">{v.excerpt}</p>
                )}
                {!v.excerpt && v.hook && (
                  <p className="mt-2 text-[14px] leading-relaxed text-[#86868b] line-clamp-2">{v.hook}</p>
                )}
              </div>
              <p className="mt-5 text-[13px] font-medium text-brand-900 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-brand-500">
                Position ansehen →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
