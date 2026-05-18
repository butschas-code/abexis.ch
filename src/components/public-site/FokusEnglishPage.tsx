import Image from "next/image";
import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { HeroProjectRealityCheckCta } from "@/components/site/HeroProjectRealityCheckCta";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { PageHero } from "@/components/site/PageHero";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { type EnglishFocusItem, type EnglishFocusPage as EnglishFocusPageData } from "@/data/english-focus-pages";
import { siteConfig } from "@/data/pages";
import { fokusPageHeroImages } from "@/data/site-images";

function LCorner({ className = "" }: { className?: string }) {
  return (
    <span className={`pointer-events-none absolute ${className}`} aria-hidden>
      <span className="block h-4 w-px bg-current" />
      <span className="block h-px w-4 bg-current" />
    </span>
  );
}

function SpineCard({ item }: { item: EnglishFocusItem }) {
  return (
    <div className="group relative h-full overflow-hidden rounded-2xl border border-black/[0.06] bg-white px-6 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#26337c]/15 hover:shadow-[0_16px_48px_rgba(38,51,124,0.10)]">
      <LCorner className="top-3 right-3 text-[#c9a96e]/0 transition-colors duration-300 group-hover:text-[#c9a96e]" />
      <span
        className="pointer-events-none absolute -bottom-2 right-3 select-none text-[5rem] font-semibold leading-none tabular-nums text-[#c9a96e]/[0.08] transition-opacity duration-300 group-hover:opacity-50"
        aria-hidden
      >
        {item.num}
      </span>
      <h3 className="relative text-[17px] font-semibold leading-snug tracking-[-0.015em] text-[#1d1d1f]">
        {item.title}
      </h3>
      <ul className="relative mt-3 flex flex-col gap-2">
        {item.items.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2.5 text-[15px] leading-snug text-[#6e6e73]">
            <span className="mt-[5px] h-[4px] w-[4px] shrink-0 rounded-full bg-[#45b3e2]" />
            {bullet}
          </li>
        ))}
      </ul>
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#26337c] to-[#45b3e2] transition-all duration-500 group-hover:w-full" />
    </div>
  );
}

function SplitPanel({ page }: { page: EnglishFocusPageData }) {
  return (
    <MotionSection>
      <div className="overflow-hidden md:grid md:grid-cols-2">
        {[page.split.left, page.split.right].map((panel, index) => {
          const dark = panel.tone === "dark";
          return (
            <div key={panel.title} className={`relative ${dark ? "bg-[#1a2260]" : "bg-[#faf8f2]"}`}>
              <div
                className={`relative ${
                  index === 0 ? "ml-auto" : "mr-auto"
                } max-w-[534px] px-8 py-14 md:px-12 md:py-20`}
              >
                <LCorner className={`top-6 left-6 ${dark ? "text-[#45b3e2]/30" : "text-[#c9a96e]/40"}`} />
                <div className={`mb-6 h-[3px] w-10 rounded-full ${dark ? "bg-[#45b3e2]/50" : "bg-[#c9a96e]/60"}`} />
                <h2 className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${dark ? "text-white/45" : "text-[#86868b]"}`}>
                  {panel.eyebrow}
                </h2>
                <h3
                  className={`mt-3 text-[clamp(1.375rem,3vw+0.5rem,1.875rem)] font-semibold leading-[1.1] tracking-[-0.025em] ${
                    dark ? "text-white" : "text-[#1d1d1f]"
                  }`}
                >
                  {panel.title}
                </h3>
                <p className={`mt-5 text-[16px] leading-relaxed ${dark ? "text-white/65" : "text-[#6e6e73]"}`}>
                  {panel.body}
                </p>
              </div>
              <div
                className={`absolute bottom-0 left-0 right-0 h-[2px] ${
                  dark
                    ? "bg-gradient-to-r from-[#26337c] via-[#45b3e2]/60 to-transparent"
                    : "bg-gradient-to-r from-[#c9a96e]/60 via-[#c9a96e]/20 to-transparent"
                }`}
              />
            </div>
          );
        })}
      </div>
    </MotionSection>
  );
}

function FocusSpine({ page }: { page: EnglishFocusPageData }) {
  return (
    <section id={page.anchorId} className="bg-[#f5f5f7]">
      <MotionSection>
        <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.8fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                {page.focus.eyebrow}
              </p>
              <h2 className="mt-4 text-[clamp(1.625rem,3.5vw+0.5rem,2.375rem)] font-semibold leading-[1.09] tracking-[-0.03em] text-[#1d1d1f]">
                {page.focus.title}
              </h2>
              <div className="mt-7 h-px w-full bg-black/[0.06]" />
              <p className="mt-6 text-[15px] leading-relaxed text-[#6e6e73]">{page.focus.intro}</p>
              <Link
                href="/en/kontakt"
                className="mt-8 inline-flex items-center gap-3 text-[14px] font-semibold text-[#26337c] transition-all hover:gap-4"
              >
                Request a consultation
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div
                  className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(201,169,110,0.05), rgba(201,169,110,0.25) 8%, rgba(201,169,110,0.25) 92%, rgba(201,169,110,0.05))",
                  }}
                />
                <div className="space-y-8">
                  {page.focus.items.map((item, index) => (
                    <div key={item.title} className="relative grid grid-cols-2">
                      <div className="absolute left-1/2 top-5 z-10 -translate-x-1/2">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a96e]/40 bg-white text-[11px] font-semibold tabular-nums text-[#26337c] shadow-sm">
                          {item.num}
                        </span>
                      </div>
                      <div className={index % 2 === 0 ? "pr-10" : "col-start-2 pl-10"}>
                        <SpineCard item={item} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:hidden">
              {page.focus.items.map((item) => (
                <SpineCard key={item.title} item={item} />
              ))}
            </div>
          </div>
        </div>
      </MotionSection>
    </section>
  );
}

function FrameworkSection({ page }: { page: EnglishFocusPageData }) {
  if (!page.framework) return null;

  return (
    <MotionSection className="bg-white">
      <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-24">
        <div className="grid gap-8 border-b border-black/[0.06] pb-10 md:grid-cols-[1fr_1fr] md:items-end md:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
              {page.framework.eyebrow}
            </p>
            <h2 className="mt-4 text-[clamp(1.5rem,3vw+0.5rem,2.125rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#1d1d1f]">
              {page.framework.title}
            </h2>
          </div>
          <p className="text-[16px] leading-relaxed text-[#6e6e73] md:pb-1">{page.framework.body}</p>
        </div>
        <div className="mt-10 overflow-hidden rounded-2xl border border-black/[0.05] bg-[#f5f5f7] p-8 md:p-12">
          <Image
            src={page.framework.image}
            alt={page.framework.alt}
            width={1200}
            height={520}
            className="mx-auto w-full max-w-[860px] object-contain"
          />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {page.framework.cards.map((card) => (
            <article key={card.title} className="rounded-xl border border-black/[0.06] bg-white px-5 py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#45b3e2]">{card.eyebrow}</p>
              <h3 className="mt-2 text-[15px] font-semibold leading-snug tracking-[-0.01em] text-[#1d1d1f]">
                {card.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#6e6e73]">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}

function PrincipleSection({ page }: { page: EnglishFocusPageData }) {
  return (
    <section className="relative overflow-hidden bg-[#1a1f38]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 90% 60% at 50% 50%, rgba(38,51,124,0.6) 0%, transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-[800px] px-6 py-20 text-center md:py-32">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c9a96e]/60">
          {page.principle.eyebrow}
        </p>
        <blockquote className="mt-8 text-[clamp(1.375rem,3.5vw+0.5rem,2.25rem)] font-semibold leading-[1.22] tracking-[-0.025em] text-white text-balance">
          &ldquo;{page.principle.quote}&rdquo;
        </blockquote>
        <div className="mt-10 flex items-center justify-center gap-5">
          <span className="h-px w-12 bg-[#c9a96e]/35" />
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/30">{page.principle.label}</p>
          <span className="h-px w-12 bg-[#c9a96e]/35" />
        </div>
      </div>
    </section>
  );
}

function ProcessSection({ page }: { page: EnglishFocusPageData }) {
  return (
    <section className="relative overflow-hidden bg-[#1a1f38]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 15% 50%, rgba(69,179,226,0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 70% at 85% 30%, rgba(38,51,124,0.4) 0%, transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-[1068px] px-6 py-16 md:py-28">
        <div className="flex items-baseline gap-4 border-b border-white/[0.08] pb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#45b3e2]/70">
            {page.process.eyebrow}
          </p>
          <span className="text-[11px] text-white/30">{page.process.countLabel}</span>
        </div>
        <h2 className="mt-8 max-w-[28ch] text-[clamp(1.5rem,3.5vw+0.5rem,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
          {page.process.title}
        </h2>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-4">
          {page.process.phases.map((phase) => (
            <article key={phase.title} className="relative flex flex-col bg-[#1a1f38]/60 px-6 py-8 backdrop-blur-sm">
              <span className="text-[3rem] font-semibold leading-none tracking-[-0.05em] text-[#c9a96e]/20">
                {phase.num}
              </span>
              <h3 className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
                {phase.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2">
                {phase.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[13px] text-white/65">
                    <span className="mt-[5px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#45b3e2]/50" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <div className="h-px w-6 bg-[#c9a96e]/40" />
              </div>
            </article>
          ))}
        </div>
        <p className="mt-8 max-w-[60ch] text-[15px] leading-relaxed text-white/50">{page.process.intro}</p>
      </div>
    </section>
  );
}

function BenefitsSection({ page }: { page: EnglishFocusPageData }) {
  return (
    <MotionSection>
      <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.8fr] lg:items-start lg:gap-20">
          <div className="lg:sticky lg:top-28">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
              {page.benefits.eyebrow}
            </p>
            <h2 className="mt-4 text-[clamp(1.625rem,3.5vw+0.5rem,2.375rem)] font-semibold leading-[1.09] tracking-[-0.03em] text-[#1d1d1f]">
              {page.benefits.title}
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-[#6e6e73]">{page.benefits.intro}</p>
            <Link
              href="/en/kontakt"
              className="mt-8 inline-flex items-center gap-3 text-[14px] font-semibold text-[#26337c] transition-all hover:gap-4"
            >
              Non-binding conversation
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-black/[0.06] bg-black/[0.04] sm:grid-cols-2">
            {page.benefits.items.map((benefit) => (
              <article key={benefit.title} className="relative bg-white px-6 py-6">
                <LCorner className="top-3 right-3 text-[#c9a96e]/20" />
                <p className="text-[11px] font-semibold tabular-nums tracking-[0.14em] text-[#45b3e2]">
                  {benefit.num}
                </p>
                <h3 className="mt-3 text-[17px] font-semibold leading-snug tracking-[-0.015em] text-[#1d1d1f]">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#6e6e73]">{benefit.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </MotionSection>
  );
}

function RoleSection({ page }: { page: EnglishFocusPageData }) {
  return (
    <MotionSection className="bg-white">
      <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-28">
        <div className="grid gap-8 border-b border-black/[0.06] pb-12 md:grid-cols-[1fr_1fr] md:items-end md:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
              {page.role.eyebrow}
            </p>
            <h2 className="mt-4 text-[clamp(1.625rem,3.5vw+0.5rem,2.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f]">
              {page.role.title}
            </h2>
          </div>
          <p className="text-[17px] leading-relaxed text-[#6e6e73] md:pb-1">{page.role.body}</p>
        </div>
        <div className="mt-12">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
            {page.role.situationsLabel}
          </p>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-black/[0.06] bg-black/[0.04] sm:grid-cols-3">
            {page.role.situations.map((situation) => (
              <article key={situation.title} className="relative bg-white px-7 py-8">
                <LCorner className="top-4 right-4 text-[#c9a96e]/30" />
                <h3 className="mt-4 text-[17px] font-semibold leading-snug tracking-[-0.015em] text-[#1d1d1f]">
                  {situation.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#6e6e73]">{situation.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </MotionSection>
  );
}

function FinalCta({ page }: { page: EnglishFocusPageData }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,#26337c_0%,#3550a4_45%,#45b3e2_100%)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 15% 100%, rgba(201,169,110,0.14) 0%, transparent 50%), radial-gradient(ellipse 50% 60% at 90% 10%, rgba(255,255,255,0.07) 0%, transparent 45%)",
        }}
      />
      <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
              {page.cta.eyebrow}
            </p>
            <h2 className="mt-4 max-w-[30ch] text-[clamp(1.5rem,3.5vw+0.5rem,2.375rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white text-balance">
              {page.cta.title}
            </h2>
            <p className="mt-5 max-w-[50ch] text-[16px] leading-relaxed text-white/65">{page.cta.body}</p>
            <div className="mt-7 flex flex-wrap gap-4">
              {["Free", "30 minutes", "Non-binding"].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-1.5 text-[12px] font-medium text-white/70"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c9a96e]/70" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 md:shrink-0">
            <Link
              href="/en/kontakt"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 text-[14px] font-semibold text-[#26337c] shadow-lg transition-all hover:bg-white/90 hover:scale-[1.02]"
            >
              Contact Abexis
            </Link>
            <a
              href={siteConfig.bookingUrlEn}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-8 text-[14px] font-semibold text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/10"
            >
              Open online calendar
            </a>
          </div>
        </div>
        <div className="mt-16 flex items-center gap-4 opacity-20">
          <div className="h-px flex-1 bg-white" />
          <div className="relative h-4 w-4">
            <div className="absolute top-0 left-0 h-4 w-px bg-white" />
            <div className="absolute top-0 left-0 h-px w-4 bg-white" />
          </div>
          <div className="h-px flex-1 bg-white" />
        </div>
      </div>
    </section>
  );
}

export function FokusEnglishPage({ page }: { page: EnglishFocusPageData }) {
  const heroImage = fokusPageHeroImages[page.slug];

  return (
    <InteriorPageRoot>
      <SchemaMarkup
        type="Service"
        path={`/en/fokusthemen/${page.slug}`}
        name={page.title}
        data={{ title: page.title, subtitle: page.subtitle, excerpt: page.excerpt }}
        breadcrumbs={[
          { name: "Home", url: "/en/home" },
          { name: "Services", url: "/en/leistungen" },
          { name: page.title, url: `/en/fokusthemen/${page.slug}` },
        ]}
      />

      <PageHero imageSrc={heroImage} priority>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">{page.subtitle}</p>
        <h1 className="mt-3 max-w-[22ch] text-[clamp(2.25rem,7vw+0.5rem,3.875rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-white text-balance">
          {page.heroTitle}
        </h1>
        <p className="mt-6 max-w-[50ch] text-[clamp(1rem,1.5vw+0.5rem,1.175rem)] leading-relaxed text-white/80 text-balance">
          {page.heroBody}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <HeroProjectRealityCheckCta href="/en/projectrealitycheck" label="Request a Project Reality Check" />
          <Link
            href="/en/kontakt"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-[#26337c] transition-all hover:bg-white/90 hover:scale-[1.02]"
          >
            30-minute introductory call
          </Link>
          <Link
            href={`#${page.anchorId}`}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/30 px-7 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/10"
          >
            {page.anchorLabel}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M7 2v10M2 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </PageHero>

      <SplitPanel page={page} />
      <FocusSpine page={page} />
      <FrameworkSection page={page} />
      <PrincipleSection page={page} />
      <ProcessSection page={page} />
      <BenefitsSection page={page} />
      <RoleSection page={page} />
      <FinalCta page={page} />
    </InteriorPageRoot>
  );
}
