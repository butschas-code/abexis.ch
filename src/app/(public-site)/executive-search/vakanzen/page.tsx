import type { Metadata } from "next";
import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { PageHero } from "@/components/site/PageHero";
import { PublicContentWidth } from "@/components/site/PublicContentWidth";
import { ConfidentialMandatesNotice } from "@/components/executive-search/ConfidentialMandatesNotice";
import { listPublishedVacancies } from "@/public-site/cms/vacancy";
import { unsplash } from "@/executive-search/lib/images/unsplash";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Vakanzen",
  description: "Aktuelle Executive Search Mandate : Abexis SEARCH besetzt Führungs- und Schlüsselpositionen diskret und präzise.",
  openGraph: {
    title: "Vakanzen | Executive Search | Abexis",
    description: "Aktuelle Führungs- und Schlüsselpositionen im Executive Search.",
  },
};

export default async function ExecutiveSearchVakanzenPage() {
  const vacancies = await listPublishedVacancies(20);

  return (
    <InteriorPageRoot>
      <SchemaMarkup
        type="Collection"
        path="/executive-search/vakanzen"
        name="Vakanzen | Executive Search | Abexis"
        description="Aktuelle Executive Search Mandate : Abexis SEARCH besetzt Führungs- und Schlüsselpositionen diskret und präzise."
        breadcrumbs={[
          { name: "Startseite", url: "/" },
          { name: "Executive Search", url: "/executive-search" },
          { name: "Vakanzen", url: "/executive-search/vakanzen" },
        ]}
      />
      <PageHero imageSrc={unsplash.vakanzen} priority>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">Executive Search</p>
        <h1 className="mt-3 max-w-[32ch] text-[clamp(1.875rem,6vw+0.65rem,2.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-white text-balance sm:text-[40px] sm:leading-[1.05] md:max-w-[40ch] md:text-[56px] md:leading-[1.02]">
          Aktuelle Vakanzen
        </h1>
        <p className="mt-6 max-w-2xl text-[17px] font-normal leading-relaxed text-white/88 sm:text-[19px] md:text-[21px]">
          Im Auftrag unserer Mandant:innen suchen wir Persönlichkeiten für Führungs- und Schlüsselpositionen : diskret, präzise und auf Augenhöhe.
        </p>
      </PageHero>

      <MotionSection>
        <section className="apple-section-mesh py-20 sm:py-28">
          <PublicContentWidth>
            {vacancies.length === 0 ? (
              <div className="rounded-[1.5rem] border border-black/[0.06] bg-white px-8 py-16 text-center shadow-[var(--apple-shadow)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Vakanzen</p>
                <p className="mx-auto mt-4 max-w-[36ch] text-[21px] font-semibold leading-snug tracking-[-0.02em] text-[#1d1d1f]">
                  Aktuell keine offenen Stellen
                </p>
                <p className="mx-auto mt-4 max-w-[48ch] text-[17px] leading-relaxed text-[#6e6e73]">
                  Wir nehmen neue Mandate laufend an. Nehmen Sie gerne Kontakt auf : wir informieren Sie sobald passende Positionen verfügbar sind.
                </p>
                <Link
                  href="/kontakt"
                  className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-full bg-brand-900 px-8 text-[17px] font-medium text-white shadow-sm transition-all duration-200 hover:bg-[var(--brand-900-hover)] hover:-translate-y-0.5"
                >
                  Kontakt aufnehmen
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Aktuelle Mandate</p>
                    <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-[#1d1d1f] sm:text-[32px]">
                      {vacancies.length === 1 ? "1 offene Position" : `${vacancies.length} offene Positionen`}
                    </h2>
                  </div>
                  <Link
                    href="/kontakt"
                    className="shrink-0 text-[14px] font-medium text-brand-900 hover:underline"
                  >
                    Mandat anfragen →
                  </Link>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  {vacancies.map((v) => (
                    <Link
                      key={v.id}
                      href={`/executive-search/vakanzen/${v.slug}`}
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
                        <h3 className="text-[19px] font-semibold leading-snug tracking-[-0.02em] text-[#1d1d1f] group-hover:text-brand-900 transition-colors duration-200">
                          {v.title}
                        </h3>
                        {v.hook && (
                          <p className="mt-2 text-[15px] leading-relaxed text-[#6e6e73]">{v.hook}</p>
                        )}
                        {v.excerpt && (
                          <p className="mt-3 text-[14px] leading-relaxed text-[#86868b]">{v.excerpt}</p>
                        )}
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        {v.publishedAt && (
                          <time className="text-[11px] font-medium uppercase tracking-widest text-[#86868b]">
                            {new Date(v.publishedAt).toLocaleDateString("de-CH")}
                          </time>
                        )}
                        <span className="ml-auto text-[14px] font-medium text-brand-900 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-brand-500">
                          Position ansehen →
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

      <ConfidentialMandatesNotice />


      {/* CTA strip */}
      <MotionSection className="border-t border-black/[0.05] bg-[#f5f5f7] py-16 md:py-20">
        <PublicContentWidth>
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Für Unternehmen</p>
              <h2 className="mt-2 max-w-[28ch] text-[24px] font-semibold tracking-[-0.02em] text-[#1d1d1f] sm:text-[28px]">
                Suchmandat anfragen
              </h2>
              <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-[#6e6e73]">
                Sie besetzen eine Führungs- oder Schlüsselposition? Wir führen den Suchprozess diskret, präzise und mit echter Beratungskompetenz.
              </p>
            </div>
            <Link
              href="/kontakt"
              className="shrink-0 inline-flex min-h-[48px] items-center justify-center rounded-full bg-brand-900 px-8 text-[17px] font-medium text-white shadow-sm transition-all duration-200 hover:bg-[var(--brand-900-hover)] hover:-translate-y-0.5"
            >
              Kontakt aufnehmen
            </Link>
          </div>
        </PublicContentWidth>
      </MotionSection>
    </InteriorPageRoot>
  );
}
