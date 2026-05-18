import type { Metadata } from "next";
import Link from "next/link";
import { ConfidentialMandatesNotice } from "@/components/executive-search/ConfidentialMandatesNotice";
import { MotionSection } from "@/components/motion/MotionSection";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { PageHero } from "@/components/site/PageHero";
import { PublicContentWidth } from "@/components/site/PublicContentWidth";
import { unsplash } from "@/executive-search/lib/images/unsplash";
import { listPublishedVacancies } from "@/public-site/cms/vacancy";

const DESCRIPTION =
  "Current Executive Search mandates: Abexis SEARCH fills leadership and key positions discreetly and precisely.";

const CONFIDENTIAL_COPY = {
  eyebrow: "Unsolicited application",
  title: "Not every suitable position is publicly visible.",
  paragraphs: [
    "Abexis SEARCH regularly works on confidential search mandates that are not published on the website. If you are open to a new leadership or key position, you can also submit your profile without applying for a specific vacancy.",
    "We review confidentially whether your background fits current or future mandates, especially in the following areas:",
  ],
  roleAreas: [
    "Sales positions",
    "Project and program leadership",
    "Executive positions",
    "Digital and innovation leadership",
    "Business unit leadership",
  ],
  ctaLabel: "Submit your profile",
} as const;

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Vacancies | Executive Search | Abexis",
  description: DESCRIPTION,
  openGraph: {
    title: "Vacancies | Executive Search | Abexis",
    description: "Current leadership and key positions in Executive Search.",
  },
};

export default async function EnglishExecutiveSearchVacanciesPage() {
  const vacancies = await listPublishedVacancies(20);

  return (
    <InteriorPageRoot>
      <SchemaMarkup
        type="Collection"
        path="/en/executive-search/vakanzen"
        name="Vacancies | Executive Search | Abexis"
        description={DESCRIPTION}
        breadcrumbs={[
          { name: "Home", url: "/en/home" },
          { name: "Executive Search", url: "/en/executive-search" },
          { name: "Vacancies", url: "/en/executive-search/vakanzen" },
        ]}
      />
      <PageHero imageSrc={unsplash.vakanzen} priority>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">Executive Search</p>
        <h1 className="mt-3 max-w-[32ch] text-[clamp(1.875rem,6vw+0.65rem,2.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-white text-balance sm:text-[40px] sm:leading-[1.05] md:max-w-[40ch] md:text-[56px] md:leading-[1.02]">
          Current vacancies
        </h1>
        <p className="mt-6 max-w-2xl text-[17px] font-normal leading-relaxed text-white/88 sm:text-[19px] md:text-[21px]">
          On behalf of our clients, we search for personalities for leadership and key positions: discreetly,
          precisely and at eye level.
        </p>
      </PageHero>

      <MotionSection>
        <section className="apple-section-mesh py-20 sm:py-28">
          <PublicContentWidth>
            {vacancies.length === 0 ? (
              <div className="rounded-[1.5rem] border border-black/[0.06] bg-white px-8 py-16 text-center shadow-[var(--apple-shadow)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Vacancies</p>
                <p className="mx-auto mt-4 max-w-[36ch] text-[21px] font-semibold leading-snug tracking-[-0.02em] text-[#1d1d1f]">
                  No open positions at the moment
                </p>
                <p className="mx-auto mt-4 max-w-[48ch] text-[17px] leading-relaxed text-[#6e6e73]">
                  We continuously accept new mandates. Contact us and we will let you know when suitable positions
                  become available.
                </p>
                <Link
                  href="/en/kontakt"
                  className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-full bg-brand-900 px-8 text-[17px] font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--brand-900-hover)]"
                >
                  Contact Abexis
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                      Current mandates
                    </p>
                    <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-[#1d1d1f] sm:text-[32px]">
                      {vacancies.length === 1 ? "1 open position" : `${vacancies.length} open positions`}
                    </h2>
                  </div>
                  <Link href="/en/kontakt" className="shrink-0 text-[14px] font-medium text-brand-900 hover:underline">
                    Discuss a mandate →
                  </Link>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  {vacancies.map((v) => (
                    <Link
                      key={v.id}
                      href={`/en/executive-search/vakanzen/${v.slug}`}
                      className="group flex flex-col justify-between overflow-hidden rounded-[1.5rem] border border-black/[0.05] bg-white p-7 shadow-[var(--apple-shadow)] ring-1 ring-transparent transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--apple-shadow-lg)] hover:ring-brand-500/20"
                    >
                      <div>
                        {(v.sector || v.location || v.employmentType) && (
                          <div className="mb-3 flex flex-wrap items-center gap-2">
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
                            {v.employmentType && (
                              <span className="rounded-full bg-[#f5f5f7] px-2.5 py-0.5 text-[11px] font-medium text-[#6e6e73]">
                                {v.employmentType}
                              </span>
                            )}
                          </div>
                        )}
                        <h3 className="text-[19px] font-semibold leading-snug tracking-[-0.02em] text-[#1d1d1f] transition-colors duration-200 group-hover:text-brand-900">
                          {v.title}
                        </h3>
                        {v.hook && <p className="mt-2 text-[15px] leading-relaxed text-[#6e6e73]">{v.hook}</p>}
                        {v.excerpt && <p className="mt-3 text-[14px] leading-relaxed text-[#86868b]">{v.excerpt}</p>}
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        {v.publishedAt && (
                          <time className="text-[11px] font-medium uppercase tracking-widest text-[#86868b]">
                            {new Date(v.publishedAt).toLocaleDateString("en-GB")}
                          </time>
                        )}
                        <span className="ml-auto text-[14px] font-medium text-brand-900 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-brand-500">
                          View position →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </PublicContentWidth>
        </section>
      </MotionSection>

      <ConfidentialMandatesNotice
        copy={CONFIDENTIAL_COPY}
        spontaneousFallbackHref="/en/executive-search/vakanzen"
        linkToSpontaneousVacancy={false}
      />

      <MotionSection className="border-t border-black/[0.05] bg-[#f5f5f7] py-16 md:py-20">
        <PublicContentWidth>
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">For companies</p>
              <h2 className="mt-2 max-w-[28ch] text-[24px] font-semibold tracking-[-0.02em] text-[#1d1d1f] sm:text-[28px]">
                Discuss a search mandate
              </h2>
              <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-[#6e6e73]">
                Are you filling a leadership or key position? We lead the search process discreetly, precisely and with
                genuine advisory competence.
              </p>
            </div>
            <Link
              href="/en/kontakt"
              className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-full bg-brand-900 px-8 text-[17px] font-medium text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--brand-900-hover)]"
            >
              Contact Abexis
            </Link>
          </div>
        </PublicContentWidth>
      </MotionSection>
    </InteriorPageRoot>
  );
}
