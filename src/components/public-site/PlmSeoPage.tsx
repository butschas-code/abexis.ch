import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { RisikomanagementFaqList } from "@/components/public-site/RisikomanagementFaqList";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { HeroHeadlineText } from "@/components/site/HeroHeadlineBrandAccent";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { PageHero } from "@/components/site/PageHero";
import { getPlmSeoCards, type PlmSeoPageContent } from "@/data/plm-seo-pages";
import { siteConfig } from "@/data/pages";
import { plmPdmHeroImage } from "@/data/site-images";

function Heading({ eyebrow, title, intro, light = false }: { eyebrow: string; title: string; intro?: string; light?: boolean }) {
  return (
    <div className="max-w-[760px]">
      <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${light ? "text-white/50" : "text-[#86868b]"}`}>{eyebrow}</p>
      <h2 className={`mt-3 text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] text-balance md:text-[44px] ${light ? "text-white" : "text-[#1d1d1f]"}`}>{title}</h2>
      {intro ? <p className={`mt-5 text-[17px] leading-relaxed md:text-[18px] ${light ? "text-white/68" : "text-[#6e6e73]"}`}>{intro}</p> : null}
    </div>
  );
}

export function PlmSeoPage({ content: c }: { content: PlmSeoPageContent }) {
  const english = c.locale === "en";
  const basePath = english ? "/en/fokusthemen/plm-pdm" : "/fokusthemen/plm-pdm";
  const path = `${basePath}/${c.slug}`;
  const homePath = english ? "/en/home" : "/";
  const servicesPath = english ? "/en/leistungen" : "/leistungen";
  const contactPath = english ? "/en/kontakt" : "/kontakt";
  const bookingUrl = english ? siteConfig.bookingUrlEn : siteConfig.bookingUrlDe;
  const cards = getPlmSeoCards(c.locale).filter((card) => card.slug !== c.slug);

  return (
    <div lang={english ? "en" : "de"}>
      <InteriorPageRoot>
        <SchemaMarkup
          type="Service"
          path={path}
          data={c.meta}
          faqItems={c.faq.items}
          breadcrumbs={[
            { name: english ? "Home" : "Startseite", url: homePath },
            { name: english ? "Services" : "Leistungen", url: servicesPath },
            { name: "PLM/PDM", url: basePath },
            { name: c.meta.title, url: path },
          ]}
        />

        <PageHero
          imageSrc={plmPdmHeroImage}
          priority
          intro={<p>{c.lead}</p>}
          actions={
            <>
              <a href={bookingUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#26337c] px-7 text-sm font-semibold text-white transition hover:bg-[#3550a4]">
                {c.closing.primaryCta}
              </a>
              <Link href={basePath} className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#26337c]/20 px-7 text-sm font-semibold text-[#26337c] transition hover:border-[#26337c]/40 hover:bg-[#f7f8fc]">
                {c.closing.secondaryCta} →
              </Link>
            </>
          }
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">{c.eyebrow}</p>
          <h1 className="mt-3 max-w-[22ch] text-[clamp(2.2rem,7vw+0.5rem,3.875rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-white text-balance">
            <HeroHeadlineText>{c.title}</HeroHeadlineText>
          </h1>
        </PageHero>

        <MotionSection className="bg-white">
          <div className="mx-auto max-w-[1068px] px-5 py-16 sm:px-6 md:py-24">
            <div className="rounded-[26px] border border-[#26337c]/10 bg-[#f5f6fa] p-7 sm:p-10 md:p-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#26337c]">{c.directAnswer.label}</p>
              <h2 className="mt-3 max-w-[24ch] text-[28px] font-semibold leading-[1.12] tracking-[-0.03em] text-[#1d1d1f] sm:text-[36px]">{c.directAnswer.title}</h2>
              <p className="mt-5 max-w-[78ch] text-[17px] leading-relaxed text-[#4b4b50]">{c.directAnswer.body}</p>
            </div>
          </div>
        </MotionSection>

        {c.comparison ? (
          <MotionSection className="bg-[#f5f6fa]">
            <div className="mx-auto max-w-[1068px] px-5 py-16 sm:px-6 md:py-24">
              <Heading eyebrow={english ? "Comparison" : "Vergleich"} title={c.comparison.title} />
              <div className="mt-10 overflow-x-auto rounded-[22px] border border-black/[0.07] bg-white">
                <table className="w-full min-w-[700px] border-collapse text-left text-[15px] leading-relaxed">
                  <thead className="bg-[#26337c] text-white">
                    <tr>{c.comparison.columns.map((column) => <th key={column} className="px-6 py-4 font-semibold">{column}</th>)}</tr>
                  </thead>
                  <tbody>
                    {c.comparison.rows.map((row) => (
                      <tr key={row[0]} className="border-t border-black/[0.07]">
                        {row.map((cell, index) => <td key={cell} className={`px-6 py-4 align-top ${index === 0 ? "font-semibold text-[#1d1d1f]" : "text-[#5f5f64]"}`}>{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </MotionSection>
        ) : null}

        <MotionSection className={c.comparison ? "bg-white" : "bg-[#f5f6fa]"}>
          <div className="mx-auto max-w-[1068px] px-5 py-16 sm:px-6 md:py-24">
            <Heading eyebrow={english ? "Practical guidance" : "Praxisorientierung"} title={english ? "What matters in practice" : "Worauf es in der Praxis ankommt"} />
            <div className="mt-10 grid gap-5 md:mt-14 md:grid-cols-2">
              {c.sections.map((section, index) => (
                <article key={section.title} className="rounded-[22px] border border-black/[0.07] bg-white p-7 shadow-[0_12px_40px_rgba(38,51,124,0.05)] sm:p-8">
                  <span className="text-[12px] font-semibold text-[#45b3e2]">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-4 text-[23px] font-semibold leading-tight tracking-[-0.025em] text-[#1d1d1f]">{section.title}</h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-[#6e6e73]">{section.body}</p>
                  {section.points ? (
                    <ul className="mt-5 space-y-2 border-t border-black/[0.07] pt-5">
                      {section.points.map((point) => <li key={point} className="flex gap-3 text-[14px] leading-relaxed text-[#4b4b50]"><span className="mt-[0.62em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#45b3e2]" aria-hidden />{point}</li>)}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
            {c.sources ? (
              <aside className="mt-10 border-t border-black/[0.07] pt-7 text-[13px] leading-relaxed text-[#6e6e73]">
                <span className="font-semibold text-[#4b4b50]">{c.sources.label}: </span>
                {c.sources.links.map((source, index) => (
                  <span key={source.href}>
                    {index > 0 ? " · " : null}
                    <a href={source.href} target="_blank" rel="noreferrer" className="underline decoration-black/20 underline-offset-4 transition hover:text-[#26337c]">{source.title}</a>
                  </span>
                ))}
              </aside>
            ) : null}
          </div>
        </MotionSection>

        <MotionSection className="bg-[#151d52]">
          <div className="mx-auto grid max-w-[1068px] gap-8 px-5 py-16 sm:px-6 md:grid-cols-[0.78fr_1.22fr] md:gap-16 md:py-24">
            <Heading eyebrow={c.faq.eyebrow} title={c.faq.title} light />
            <div className="rounded-[22px] bg-white px-6 sm:px-8">
              <RisikomanagementFaqList items={c.faq.items} />
            </div>
          </div>
        </MotionSection>

        <MotionSection className="bg-white">
          <div className="mx-auto max-w-[1068px] px-5 py-16 sm:px-6 md:py-24">
            <Heading eyebrow={c.related.eyebrow} title={c.related.title} />
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {cards.map((card) => (
                <Link key={card.slug} href={`${basePath}/${card.slug}`} className="group rounded-[22px] border border-black/[0.07] bg-[#fbfbfd] p-7 transition hover:-translate-y-0.5 hover:border-[#26337c]/20 hover:shadow-[0_16px_45px_rgba(38,51,124,0.08)] sm:p-8">
                  <h3 className="text-[21px] font-semibold tracking-[-0.02em] text-[#1d1d1f] group-hover:text-[#26337c]">{card.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#6e6e73]">{card.excerpt}</p>
                  <span className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-[#26337c]">{english ? "Read more" : "Mehr erfahren"} →</span>
                </Link>
              ))}
            </div>
          </div>
        </MotionSection>

        <MotionSection className="bg-[#26337c]">
          <div className="mx-auto max-w-[1068px] px-5 py-16 sm:px-6 md:py-24">
            <Heading eyebrow={c.closing.eyebrow} title={c.closing.title} intro={c.closing.body} light />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={bookingUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-[#26337c] transition hover:bg-[#eef2fb]">{c.closing.primaryCta}</a>
              <Link href={contactPath} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-7 text-sm font-semibold text-white transition hover:bg-white/10">{english ? "Contact us" : "Kontakt aufnehmen"}</Link>
            </div>
          </div>
        </MotionSection>
      </InteriorPageRoot>
    </div>
  );
}
