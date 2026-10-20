import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { RisikomanagementFaqList } from "@/components/public-site/RisikomanagementFaqList";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { HeroHeadlineText } from "@/components/site/HeroHeadlineBrandAccent";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { PageHero } from "@/components/site/PageHero";
import { getPlmPdmContent, type PlmPdmLocale } from "@/data/plm-pdm-content";
import { siteConfig } from "@/data/pages";
import { plmPdmHeroImage } from "@/data/site-images";

function SectionHeading({
  eyebrow,
  title,
  intro,
  light = false,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-[740px]">
      <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${light ? "text-white/48" : "text-[#86868b]"}`}>
        {eyebrow}
      </p>
      <h2 className={`mt-3 text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-balance md:text-[44px] ${light ? "text-white" : "text-[#1d1d1f]"}`}>
        {title}
      </h2>
      {intro ? <p className={`mt-5 text-[17px] leading-relaxed md:text-[18px] ${light ? "text-white/68" : "text-[#6e6e73]"}`}>{intro}</p> : null}
    </div>
  );
}

export function FokusPlmPdm({ locale = "de" }: { locale?: PlmPdmLocale }) {
  const c = getPlmPdmContent(locale);
  const english = locale === "en";
  const path = english ? "/en/fokusthemen/plm-pdm" : "/fokusthemen/plm-pdm";
  const homePath = english ? "/en/home" : "/";
  const servicesPath = english ? "/en/leistungen" : "/leistungen";
  const contactPath = english ? "/en/kontakt" : "/kontakt";
  const profilePath = english ? "/en/danielsengstag" : "/danielsengstag";
  const bookingUrl = english ? siteConfig.bookingUrlEn : siteConfig.bookingUrlDe;

  return (
    <div lang={english ? "en" : "de"}>
      <InteriorPageRoot>
      <SchemaMarkup
        type="Service"
        path={path}
        data={c.meta}
        breadcrumbs={[
          { name: c.breadcrumbs.home, url: homePath },
          { name: c.breadcrumbs.services, url: servicesPath },
          { name: c.breadcrumbs.current, url: path },
        ]}
      />

      <PageHero
        imageSrc={plmPdmHeroImage}
        priority
        intro={
          <div>
            <p>{c.hero.body}</p>
            <p className="mt-3 text-[14px] font-medium text-[#26337c] sm:text-[15px]">{c.hero.note}</p>
          </div>
        }
        actions={
          <>
            <a
              href={bookingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#26337c] px-7 text-sm font-semibold text-white transition hover:bg-[#3550a4]"
            >
              {c.hero.primaryCta}
            </a>
            <Link
              href="#leistungen"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#26337c]/20 px-7 text-sm font-semibold text-[#26337c] transition hover:border-[#26337c]/40 hover:bg-[#f7f8fc]"
            >
              {c.hero.secondaryCta} ↓
            </Link>
          </>
        }
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">{c.hero.eyebrow}</p>
        <h1 className="mt-3 max-w-[21ch] text-[clamp(2.2rem,7vw+0.5rem,3.875rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-white text-balance">
          <HeroHeadlineText>{c.hero.title}</HeroHeadlineText>
        </h1>
      </PageHero>

      <MotionSection className="bg-white" id="leistungen">
        <div className="mx-auto max-w-[1068px] px-5 py-16 sm:px-6 md:py-24">
          <SectionHeading eyebrow={c.services.eyebrow} title={c.services.title} intro={c.services.intro} />
          <div className="mt-10 grid gap-5 md:mt-14 md:grid-cols-2">
            {c.services.items.map((item, index) => (
              <article
                key={item.title}
                className="relative overflow-hidden rounded-[24px] border border-black/[0.06] bg-[#fbfbfd] p-6 shadow-[0_12px_40px_rgba(38,51,124,0.06)] sm:p-8"
              >
                <span className="absolute right-5 top-4 text-[54px] font-semibold leading-none text-[#26337c]/[0.06]" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="relative text-[11px] font-semibold uppercase tracking-[0.2em] text-[#26337c]">{item.label}</p>
                <h3 className="relative mt-3 text-[23px] font-semibold leading-tight tracking-[-0.025em] text-[#1d1d1f]">{item.title}</h3>
                <p className="relative mt-4 text-[15px] leading-relaxed text-[#6e6e73]">{item.body}</p>
                <p className="relative mt-6 border-t border-black/[0.07] pt-5 text-[14px] leading-relaxed text-[#4b4b50]">
                  <strong className="font-semibold text-[#26337c]">{item.outcomeLabel}: </strong>
                  {item.outcome}
                </p>
              </article>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="overflow-hidden bg-[#151d52]">
        <div className="mx-auto max-w-[1068px] px-5 py-16 sm:px-6 md:py-24">
          <SectionHeading eyebrow={c.audiences.eyebrow} title={c.audiences.title} light />
          <div className="mt-10 grid overflow-hidden rounded-[24px] border border-white/10 md:grid-cols-2">
            {c.audiences.items.map((item, index) => (
              <div key={item.title} className={`p-7 sm:p-9 ${index === 0 ? "bg-white/[0.06]" : "bg-white/[0.025]"}`}>
                <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-white">{item.title}</h3>
                <p className="mt-4 text-[16px] leading-relaxed text-white/68">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="bg-[#f5f6fa]">
        <div className="mx-auto max-w-[1068px] px-5 py-16 sm:px-6 md:py-24">
          <SectionHeading eyebrow={c.fields.eyebrow} title={c.fields.title} intro={c.fields.intro} />
          <div className="mt-10 grid gap-x-10 gap-y-3 md:mt-14 md:grid-cols-2">
            {c.fields.items.map((item, index) => (
              <article key={item.title} className="grid grid-cols-[42px_1fr] gap-4 border-b border-black/[0.07] py-6">
                <span className="text-[12px] font-semibold tabular-nums text-[#45b3e2]">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-[18px] font-semibold tracking-[-0.015em] text-[#1d1d1f]">{item.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#6e6e73]">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 rounded-[22px] border border-[#c9a96e]/30 bg-[#faf8f2] p-7 sm:p-9">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8b7045]">{c.fields.principleLabel}</p>
            <p className="mt-3 max-w-[52ch] text-[22px] font-semibold leading-snug tracking-[-0.02em] text-[#26337c] sm:text-[26px]">{c.fields.principle}</p>
          </div>
        </div>
      </MotionSection>

      <MotionSection className="bg-white">
        <div className="mx-auto max-w-[1068px] px-5 py-16 sm:px-6 md:py-24">
          <SectionHeading eyebrow={c.approach.eyebrow} title={c.approach.title} intro={c.approach.intro} />
          <ol className="mt-10 grid gap-5 md:mt-14 md:grid-cols-4">
            {c.approach.items.map((item, index) => (
              <li key={item.title} className="relative rounded-[20px] border border-black/[0.07] p-6">
                <span className="text-[12px] font-semibold text-[#45b3e2]">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-[18px] font-semibold leading-snug tracking-[-0.02em] text-[#1d1d1f]">{item.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-[#6e6e73]">{item.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-[70ch] text-[14px] leading-relaxed text-[#6e6e73]">{c.approach.note}</p>
        </div>
      </MotionSection>

      <MotionSection className="bg-[#1d1d1f]">
        <div className="mx-auto max-w-[1068px] px-5 py-16 sm:px-6 md:py-24">
          <SectionHeading eyebrow={c.benefits.eyebrow} title={c.benefits.title} light />
          <div className="mt-10 grid gap-px overflow-hidden rounded-[22px] bg-white/10 md:mt-14 md:grid-cols-2">
            {c.benefits.items.map((item) => (
              <article key={item.title} className="bg-[#1d1d1f] p-7 sm:p-9">
                <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-white">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-white/62">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="bg-white">
        <div className="mx-auto grid max-w-[1068px] gap-10 px-5 py-16 sm:px-6 md:grid-cols-[1.35fr_0.65fr] md:gap-16 md:py-24">
          <div>
            <SectionHeading eyebrow={c.role.eyebrow} title={c.role.title} />
            <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-[#6e6e73]">
              {c.role.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
          <aside className="self-start rounded-[24px] bg-[#f5f6fa] p-7 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#86868b]">{c.role.personLabel}</p>
            <h3 className="mt-3 text-[24px] font-semibold tracking-[-0.025em] text-[#1d1d1f]">{c.role.personName}</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-[#6e6e73]">{c.role.personBody}</p>
            <Link href={profilePath} className="mt-6 inline-flex min-h-11 items-center font-semibold text-[#26337c] hover:text-[#3550a4]">
              {c.role.personLink} →
            </Link>
          </aside>
        </div>
      </MotionSection>

      <MotionSection className="bg-[#f5f6fa]">
        <div className="mx-auto grid max-w-[1068px] gap-8 px-5 py-16 sm:px-6 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:py-24">
          <SectionHeading eyebrow={c.faq.eyebrow} title={c.faq.title} />
          <div className="rounded-[22px] bg-white px-6 shadow-[0_12px_40px_rgba(38,51,124,0.06)] sm:px-8">
            <RisikomanagementFaqList items={c.faq.items} />
          </div>
        </div>
      </MotionSection>

      <MotionSection className="bg-[#26337c]">
        <div className="mx-auto max-w-[1068px] px-5 py-16 sm:px-6 md:py-24">
          <SectionHeading eyebrow={c.closing.eyebrow} title={c.closing.title} intro={c.closing.body} light />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={bookingUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-[#26337c] transition hover:bg-[#eef2fb]">
              {c.closing.primaryCta}
            </a>
            <Link href={contactPath} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-7 text-sm font-semibold text-white transition hover:bg-white/10">
              {c.closing.secondaryCta}
            </Link>
          </div>
        </div>
      </MotionSection>
      </InteriorPageRoot>
    </div>
  );
}
