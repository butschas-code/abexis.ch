import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { PageHero } from "@/components/site/PageHero";
import { PublicContentWidth } from "@/components/site/PublicContentWidth";
import { getPublishedVacancyBySlug, listPublishedVacancies } from "@/public-site/cms/vacancy";
import { parsePostBody } from "@/lib/cms/post-body-storage";
import { sanitizeBlogHtml } from "@/lib/cms/sanitize-blog-html";
import { unsplash } from "@/executive-search/lib/images/unsplash";
import { VacancyApplicationForm } from "@/components/executive-search/VacancyApplicationForm";

export const revalidate = 120;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const vacancies = await listPublishedVacancies(100);
  return vacancies.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const v = await getPublishedVacancyBySlug(slug);
  if (!v) return {};
  return {
    title: v.title,
    description: v.excerpt || v.hook || `${v.title} : Abexis Executive Search`,
    openGraph: {
      title: `${v.title} | Vakanzen | Abexis`,
      description: v.excerpt || v.hook || "",
    },
  };
}

export default async function VacancyDetailPage({ params }: Props) {
  const { slug } = await params;
  const v = await getPublishedVacancyBySlug(slug);
  if (!v) notFound();

  const { html: bodyHtml } = parsePostBody(v.body);
  const safeBody = sanitizeBlogHtml(bodyHtml);

  return (
    <InteriorPageRoot>
      <SchemaMarkup
        type="JobPosting"
        path={`/executive-search/vakanzen/${v.slug}`}
        data={v}
        breadcrumbs={[
          { name: "Startseite", url: "/" },
          { name: "Executive Search", url: "/executive-search" },
          { name: "Vakanzen", url: "/executive-search/vakanzen" },
          { name: v.title, url: `/executive-search/vakanzen/${v.slug}` },
        ]}
      />

      <PageHero imageSrc={unsplash.vakanzen} priority>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">Aktuelles Mandat</p>
        <h1 className="mt-3 max-w-[36ch] text-[clamp(1.875rem,6vw+0.65rem,2.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-white text-balance sm:text-[40px] sm:leading-[1.05] md:text-[56px] md:leading-[1.02]">
          {v.title}
        </h1>
        {(v.sector || v.location || v.employmentType) && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {v.sector && (
              <span className="rounded-full bg-white/15 px-3 py-1 text-[12px] font-medium text-white/90 backdrop-blur-sm">
                {v.sector}
              </span>
            )}
            {v.location && (
              <span className="rounded-full bg-white/15 px-3 py-1 text-[12px] font-medium text-white/90 backdrop-blur-sm">
                {v.location}
              </span>
            )}
            {v.employmentType && (
              <span className="rounded-full bg-white/15 px-3 py-1 text-[12px] font-medium text-white/90 backdrop-blur-sm">
                {v.employmentType}
              </span>
            )}
          </div>
        )}
        {v.hook && (
          <p className="mt-5 max-w-2xl text-[17px] font-normal leading-relaxed text-white/88 sm:text-[19px] md:text-[21px]">
            {v.hook}
          </p>
        )}
      </PageHero>

      {/* Back link */}
      <div className="border-b border-black/[0.05] bg-white">
        <PublicContentWidth>
          <div className="py-3.5">
            <Link
              href="/executive-search/vakanzen"
              className="text-[13px] font-medium text-[#86868b] transition-colors hover:text-brand-900"
            >
              ← Alle Vakanzen
            </Link>
          </div>
        </PublicContentWidth>
      </div>

      {/* Body */}
      {safeBody && safeBody !== "<p></p>" && (
        <MotionSection>
          <section className="apple-section-mesh py-20 sm:py-24">
            <PublicContentWidth>
              <div
                className="legacy-prose max-w-3xl"
                dangerouslySetInnerHTML={{ __html: safeBody }}
              />
            </PublicContentWidth>
          </section>
        </MotionSection>
      )}

      {/* Downloadable files */}
      {v.files.length > 0 && (
        <MotionSection>
          <section className="apple-section-mesh py-10 sm:py-14">
            <PublicContentWidth>
              <div className="max-w-3xl space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">
                  Dokumente
                </p>
                {v.files.map((file) => (
                  <a
                    key={file.url}
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-white px-4 py-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition hover:border-brand-500/30 hover:shadow-md"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-900/[0.08] text-[13px] font-semibold text-brand-900">
                      PDF
                    </span>
                    <span className="text-[15px] font-medium text-[#1d1d1f]">{file.label}</span>
                    <span className="ml-auto text-[13px] text-[#86868b]">↓</span>
                  </a>
                ))}
              </div>
            </PublicContentWidth>
          </section>
        </MotionSection>
      )}

      {/* Apply / CTA */}
      <MotionSection>
        <section className="apple-section-mesh py-16 sm:py-20" id="bewerbung">
          <PublicContentWidth>
            <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
              <div className="max-w-3xl">
                <h2 className="text-[24px] font-semibold text-[#1d1d1f] mb-4">Interesse geweckt?</h2>
                {v.apply && (
                  <p className="mb-8 text-[15px] leading-relaxed text-[#6e6e73]">{v.apply}</p>
                )}
                {!v.apply && (
                  <p className="mb-8 text-[15px] leading-relaxed text-[#6e6e73]">
                    Reichen Sie Ihre Bewerbung direkt über unser Formular ein oder kontaktieren Sie uns für ein unverbindliches Erstgespräch.
                  </p>
                )}
                <div className="flex flex-wrap gap-4 mb-10">
                  <Link
                    href="/executive-search/vakanzen"
                    className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-black/[0.10] bg-white px-8 text-[17px] font-medium text-[#1d1d1f] transition-all duration-200 hover:bg-[#f5f5f7] hover:-translate-y-0.5"
                  >
                    Alle Vakanzen
                  </Link>
                </div>
              </div>

              <div>
                <VacancyApplicationForm vacancyId={v.slug} vacancyTitle={v.title} />
              </div>
            </div>
          </PublicContentWidth>
        </section>
      </MotionSection>
    </InteriorPageRoot>
  );
}
