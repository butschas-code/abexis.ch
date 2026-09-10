import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { RisikomanagementFaqList } from "@/components/public-site/RisikomanagementFaqList";
import { HeroProjectRealityCheckCta } from "@/components/site/HeroProjectRealityCheckCta";
import { PageHero } from "@/components/site/PageHero";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { contactHrefWithInterests } from "@/data/contact-meeting-interests";
import { fokusthemenMeta, siteConfig } from "@/data/pages";
import { getRisikomanagementContent, type RisikomanagementLocale } from "@/data/risikomanagement-content";
import { fokusPageHeroImages } from "@/data/site-images";

function LCorner({ className = "" }: { className?: string }) {
  return (
    <span className={`pointer-events-none absolute ${className}`} aria-hidden>
      <span className="block h-4 w-px bg-current" />
      <span className="block h-px w-4 bg-current" />
    </span>
  );
}

type SpineItem = { num: string; title: string; items: readonly string[] };

function SpineCard({ item }: { item: SpineItem }) {
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

function SpineTimeline({ items }: { items: SpineItem[] }) {
  return (
    <>
      <div className="hidden lg:block">
        <div className="relative">
          <div
            className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
            style={{
              background:
                "linear-gradient(to bottom, rgba(201,169,110,0.05), rgba(201,169,110,0.25) 8%, rgba(201,169,110,0.25) 92%, rgba(201,169,110,0.05))",
            }}
          />
          <div className="space-y-8">
            {items.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={item.num} className="relative grid grid-cols-2">
                  <div className="absolute left-1/2 top-5 z-10 -translate-x-1/2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a96e]/40 bg-white text-[11px] font-semibold tabular-nums text-[#26337c] shadow-sm">
                      {item.num}
                    </div>
                  </div>
                  <div className="pr-10">{isLeft ? <SpineCard item={item} /> : null}</div>
                  <div className="pl-10">{!isLeft ? <SpineCard item={item} /> : null}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 lg:hidden">
        {items.map((item) => (
          <SpineCard key={item.num} item={item} />
        ))}
      </div>
    </>
  );
}

function QuestionRail({ questions }: { questions: readonly string[] }) {
  return (
    <div className="relative">
      <div
        className="absolute bottom-4 left-5 top-4 w-px md:left-6"
        style={{
          background:
            "linear-gradient(to bottom, rgba(69,179,226,0.15), rgba(201,169,110,0.35) 50%, rgba(38,51,124,0.15))",
        }}
        aria-hidden
      />
      <div className="space-y-4">
        {questions.map((q, i) => {
          const num = String(i + 1).padStart(2, "0");
          const isLead = i === 0;
          const isLinen = i % 2 === 1;
          return (
            <div key={q} className="relative flex gap-4 md:gap-5">
              <div
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold tabular-nums shadow-sm md:h-11 md:w-11 ${
                  isLead
                    ? "border-[#45b3e2]/50 bg-[#26337c] text-white"
                    : "border-[#c9a96e]/40 bg-white text-[#26337c]"
                }`}
              >
                {num}
              </div>
              <div
                className={`group relative min-w-0 flex-1 overflow-hidden rounded-2xl px-5 py-5 transition-all duration-300 md:px-6 md:py-6 ${
                  isLead
                    ? "bg-[#1a2260] text-white shadow-[0_12px_40px_rgba(38,51,124,0.18)]"
                    : isLinen
                      ? "border border-black/[0.06] bg-[#faf8f2] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(38,51,124,0.08)]"
                      : "border border-black/[0.06] bg-white hover:-translate-y-0.5 hover:border-[#26337c]/15 hover:shadow-[0_12px_32px_rgba(38,51,124,0.08)]"
                }`}
              >
                {!isLead ? <LCorner className="top-3 right-3 text-[#c9a96e]/25" /> : null}
                <p
                  className={`relative text-[15px] font-semibold leading-snug tracking-[-0.01em] md:text-[16px] ${
                    isLead ? "text-white" : "text-[#1d1d1f]"
                  }`}
                >
                  {q}
                </p>
                {!isLead ? (
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#26337c] to-[#45b3e2] transition-all duration-500 group-hover:w-full" />
                ) : (
                  <div className="mt-4 h-px w-10 bg-[#45b3e2]/40" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const useCaseAccents = ["from-[#26337c] to-[#45b3e2]", "from-[#c9a96e] to-[#45b3e2]", "from-[#45b3e2] to-[#26337c]"] as const;

type Props = { locale?: RisikomanagementLocale };

export function FokusRisikomanagement({ locale = "de" }: Props) {
  const c = getRisikomanagementContent(locale);
  const meta = fokusthemenMeta.find((m) => m.slug === "risikomanagement")!;
  const heroImage = fokusPageHeroImages.risikomanagement;
  const path = locale === "en" ? "/en/fokusthemen/risikomanagement" : "/fokusthemen/risikomanagement";
  const servicesPath = locale === "en" ? "/en/leistungen" : "/leistungen";
  const homePath = locale === "en" ? "/en/home" : "/";
  const contactHref = contactHrefWithInterests("risk-management", locale);
  const bookingUrl = locale === "en" ? siteConfig.bookingUrlEn : siteConfig.bookingUrlDe;

  const handlungsfelder: SpineItem[] = c.signs.items.map((sign) => ({
    num: sign.num,
    title: sign.title,
    items: [sign.body],
  }));

  const blickwinkelSpine: SpineItem[] = c.challengeAreas.items.map((item, i) => ({
    num: String(i + 1).padStart(2, "0"),
    title: item.title,
    items: [item.body],
  }));

  const labels = {
    handlungsfelderAnchor: locale === "en" ? "Early signals" : "Früherkennung",
    leistung1: locale === "en" ? "Model 1" : "Einsatzform 1",
    leistung2: locale === "en" ? "Model 2" : "Einsatzform 2",
    leistungsumfang: locale === "en" ? "Scope of ongoing support" : "Leistungsumfang laufende Begleitung",
    grundsatz: locale === "en" ? "Principle" : "Grundsatz",
    grundsatzTag: locale === "en" ? "Abexis risk principle" : "Abexis Risiko-Prinzip",
    phasen: locale === "en" ? "steps" : "Schritte",
    unsereRolle: locale === "en" ? "Our role" : "Unsere Rolle",
    typischeFragen: locale === "en" ? "Key questions" : "Leitfragen",
    gespraech: locale === "en" ? "Request a conversation" : "Beratungsgespräch anfragen",
    naechsterSchritt: locale === "en" ? "Next step" : "Nächster Schritt",
    termin: locale === "en" ? "Book a conversation" : "Jetzt Termin buchen",
    kalender: locale === "en" ? "Open online calendar" : "Online-Kalender öffnen",
  };

  return (
    <InteriorPageRoot>
      <SchemaMarkup
        type="Service"
        path={path}
        data={meta}
        breadcrumbs={[
          { name: c.breadcrumbs.home, url: homePath },
          { name: c.breadcrumbs.services, url: servicesPath },
          { name: c.breadcrumbs.current, url: path },
        ]}
      />

      {/* ── 1. HERO ──────────────────────────────────────────────────────── */}
      <PageHero imageSrc={heroImage} priority>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">{meta.subtitle}</p>
        <h1 className="mt-3 max-w-[22ch] text-[clamp(2.25rem,7vw+0.5rem,3.875rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-white text-balance">
          {c.hero.title}
        </h1>
        <p className="mt-6 max-w-[50ch] text-[clamp(1rem,1.5vw+0.5rem,1.175rem)] leading-relaxed text-white/80 text-balance">
          {c.hero.body}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <HeroProjectRealityCheckCta href={c.prcPath} />
          <Link
            href={contactHref}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-[#26337c] transition-all hover:scale-[1.02] hover:bg-white/90"
          >
            {c.hero.primaryCta.label}
          </Link>
          <Link
            href="#handlungsfelder"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/30 px-7 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/10"
          >
            {labels.handlungsfelderAnchor}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M7 2v10M2 7l5 5 5-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </PageHero>

      {/* ── 2. SPLIT PANEL : Laufend vs. PRC ───────────────────────────── */}
      <MotionSection>
        <div className="overflow-hidden md:grid md:grid-cols-2">
          <div className="relative bg-[#faf8f2]">
            <div className="relative ml-auto max-w-[534px] px-8 py-14 md:px-12 md:py-20">
              <div className="mb-6 h-[3px] w-10 rounded-full bg-[#c9a96e]/60" />
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                {labels.leistung1}
              </h2>
              <h3 className="mt-3 text-[clamp(1.375rem,3vw+0.5rem,1.875rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-[#1d1d1f]">
                {c.models.ongoing.title}
              </h3>
              <p className="mt-5 text-[16px] leading-relaxed text-[#6e6e73]">{c.models.ongoing.intro}</p>
              <p className="mt-4 text-[16px] leading-relaxed text-[#6e6e73]">{c.models.ongoing.note}</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#c9a96e]/60 via-[#c9a96e]/20 to-transparent" />
          </div>

          <div className="relative bg-[#1a2260]">
            <div className="relative mr-auto max-w-[534px] px-8 py-14 md:px-12 md:py-20">
              <div className="mb-6 h-[3px] w-10 rounded-full bg-[#45b3e2]/50" />
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
                {labels.leistung2}
              </h2>
              <h3 className="mt-3 text-[clamp(1.375rem,3vw+0.5rem,1.875rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-white">
                {c.models.prc.title}
              </h3>
              <p className="mt-5 text-[16px] leading-relaxed text-white/65">{c.models.prc.body}</p>
              <Link
                href={c.models.prc.cta.href}
                className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 text-[14px] font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
              >
                {c.models.prc.cta.label}
                <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#26337c] via-[#45b3e2]/60 to-transparent" />
          </div>
        </div>
      </MotionSection>

      {/* ── 2b. LEISTUNGSUMFANG (Bullets) ──────────────────────────────── */}
      <section className="bg-white">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-24">
            <div className="grid gap-8 border-b border-black/[0.06] pb-10 md:grid-cols-[1fr_1fr] md:gap-16 md:items-end">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                  {labels.leistungsumfang}
                </p>
                <h2 className="mt-4 text-[clamp(1.5rem,3vw+0.5rem,2.125rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#1d1d1f]">
                  {c.models.title}
                </h2>
              </div>
              <p className="text-[16px] leading-relaxed text-[#6e6e73] md:pb-1">{c.positioning.intro}</p>
            </div>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {c.models.ongoing.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-2.5 rounded-2xl border border-black/[0.06] bg-[#fafafa] px-5 py-4 text-[15px] leading-relaxed text-[#1d1d1f]"
                >
                  <span className="mt-2 h-[4px] w-[4px] shrink-0 rounded-full bg-[#45b3e2]" aria-hidden />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </MotionSection>
      </section>

      {/* ── 3. HANDLUNGSFELDER (Früherkennung) ──────────────────────────── */}
      <section id="handlungsfelder" className="bg-[#f5f5f7]">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-24">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.8fr] lg:gap-16">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                  {c.signs.eyebrow}
                </p>
                <h2 className="mt-4 text-[clamp(1.625rem,3.5vw+0.5rem,2.375rem)] font-semibold leading-[1.09] tracking-[-0.03em] text-[#1d1d1f]">
                  {c.signs.title}
                </h2>
                <div className="mt-7 h-px w-full bg-black/[0.06]" />
                <p className="mt-6 text-[15px] leading-relaxed text-[#6e6e73]">{c.problem.intro}</p>
                <Link
                  href={contactHref}
                  className="mt-8 inline-flex items-center gap-3 text-[14px] font-semibold text-[#26337c] transition-all hover:gap-4"
                >
                  {labels.gespraech}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path
                      d="M3 8h10M8 3l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>

              <div>
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
                      {handlungsfelder.map((item, i) => {
                        const isLeft = i % 2 === 0;
                        return (
                          <div key={item.num} className="relative grid grid-cols-2">
                            <div className="absolute left-1/2 top-5 z-10 -translate-x-1/2">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a96e]/40 bg-white text-[11px] font-semibold tabular-nums text-[#26337c] shadow-sm">
                                {item.num}
                              </div>
                            </div>
                            <div className="pr-10">{isLeft ? <SpineCard item={item} /> : null}</div>
                            <div className="pl-10">{!isLeft ? <SpineCard item={item} /> : null}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 lg:hidden">
                  {handlungsfelder.map((item) => (
                    <SpineCard key={item.num} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </MotionSection>
      </section>

      {/* ── 4+5. GRUNDSATZ + PROZESS (single dark band) ───────────────────── */}
      <section className="relative overflow-hidden bg-[#1a1f38]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 90% 60% at 50% 35%, rgba(38,51,124,0.6) 0%, transparent 70%), radial-gradient(ellipse 70% 60% at 15% 75%, rgba(69,179,226,0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 70% at 85% 80%, rgba(38,51,124,0.4) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-[800px] px-6 pt-16 pb-10 text-center md:pt-28 md:pb-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c9a96e]/60">
            {labels.grundsatz}
          </p>
          <blockquote className="mt-6 text-[clamp(1.375rem,3.5vw+0.5rem,2.25rem)] font-semibold leading-[1.22] tracking-[-0.025em] text-white text-balance md:mt-8">
            &ldquo;{c.positioning.title}&rdquo;
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-5 md:mt-10">
            <div className="h-px w-12 bg-[#c9a96e]/35" />
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/30">
              {labels.grundsatzTag}
            </span>
            <div className="h-px w-12 bg-[#c9a96e]/35" />
          </div>
        </div>
        <MotionSection>
          <div className="relative mx-auto max-w-[1068px] px-6 pt-10 pb-16 md:pt-14 md:pb-28">
            <div className="flex items-baseline gap-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#45b3e2]/70">
                {c.process.eyebrow}
              </p>
              <span className="text-[11px] text-white/30">
                {c.process.steps.length} {labels.phasen}
              </span>
            </div>
            <h2 className="mt-8 max-w-[36ch] text-[clamp(1.5rem,3.5vw+0.5rem,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
              {c.process.title}
            </h2>
            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {c.process.steps.map((step, i) => (
                <div key={step.num} className="relative flex flex-col bg-[#1a1f38]/60 px-6 py-8 backdrop-blur-sm">
                  <p
                    className="text-[3rem] font-semibold leading-none tracking-[-0.05em]"
                    style={{ color: `rgba(201,169,110,${0.35 + i * 0.12})` }}
                  >
                    {step.num}
                  </p>
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
                    {step.title}
                  </p>
                  <p className="mt-4 text-[13px] leading-relaxed text-white/65">{step.body}</p>
                  <div className="mt-auto pt-8">
                    <div className="h-px w-6 bg-[#c9a96e]/40" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </MotionSection>
      </section>

      {/* ── 6. NUTZEN ────────────────────────────────────────────────────── */}
      <section className="bg-[#f5f5f7]">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-28">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.8fr] lg:gap-20 lg:items-start">
              <div className="lg:sticky lg:top-28">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                  {c.outcomes.eyebrow}
                </p>
                <h2 className="mt-4 text-[clamp(1.625rem,3.5vw+0.5rem,2.375rem)] font-semibold leading-[1.09] tracking-[-0.03em] text-[#1d1d1f]">
                  {c.outcomes.title}
                </h2>
                <div className="mt-7 h-px w-full bg-black/[0.06]" />
                <ul className="mt-6 space-y-2.5">
                  {c.positioning.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-[#6e6e73]">
                      <span className="mt-2 h-[4px] w-[4px] shrink-0 rounded-full bg-[#c9a96e]" aria-hidden />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <Link
                  href={contactHref}
                  className="mt-8 inline-flex items-center gap-3 text-[14px] font-semibold text-[#26337c] transition-all hover:gap-4"
                >
                  {labels.gespraech}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path
                      d="M3 8h10M8 3l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
              <div className="grid gap-px overflow-hidden rounded-2xl border border-black/[0.06] bg-black/[0.04] sm:grid-cols-2">
                {c.outcomes.items.map((item, i) => (
                  <div key={item.title} className="relative bg-white px-6 py-6">
                    <LCorner className="top-3 right-3 text-[#c9a96e]/20" />
                    <p className="text-[11px] font-semibold tabular-nums tracking-[0.14em] text-[#45b3e2]">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-3 text-[17px] font-semibold leading-snug tracking-[-0.015em] text-[#1d1d1f]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-[#6e6e73]">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </MotionSection>
      </section>

      {/* ── 7. UNSERE ROLLE + LEITFRAGEN ─────────────────────────────────── */}
      <section className="bg-white">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-28">
            <div className="grid gap-8 border-b border-black/[0.06] pb-12 md:grid-cols-[1fr_1fr] md:gap-20 md:items-end">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                  {labels.unsereRolle}
                </p>
                <h2 className="mt-4 text-[clamp(1.625rem,3.5vw+0.5rem,2.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f]">
                  {c.problem.title}
                </h2>
              </div>
              <p className="text-[17px] leading-relaxed text-[#6e6e73] md:pb-1">{c.problem.intro}</p>
            </div>

            <div className="mt-12 rounded-2xl border border-black/[0.06] bg-[#f5f5f7] p-6 md:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                  {labels.typischeFragen}
                </p>
                <span className="text-[11px] tabular-nums text-[#86868b]">
                  {c.problem.questions.length}{" "}
                  {locale === "en" ? "questions" : "Fragen"}
                </span>
              </div>
              <div className="mt-6">
                <QuestionRail questions={c.problem.questions} />
              </div>
            </div>
          </div>
        </MotionSection>
      </section>

      {/* ── 8. ERGEBNISSE ────────────────────────────────────────────────── */}
      <section className="bg-[#f5f5f7]">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-28">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.8fr] lg:gap-20 lg:items-start">
              <div className="lg:sticky lg:top-28">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                  {c.deliverables.eyebrow}
                </p>
                <h2 className="mt-4 text-[clamp(1.625rem,3.5vw+0.5rem,2.375rem)] font-semibold leading-[1.09] tracking-[-0.03em] text-[#1d1d1f]">
                  {c.deliverables.title}
                </h2>
                <div className="mt-7 h-px w-full bg-black/[0.06]" />
                <p className="mt-6 text-[15px] leading-relaxed text-[#6e6e73]">
                  {locale === "en"
                    ? "Structured artefacts and reporting formats that make risks, measures and decisions visible."
                    : "Strukturierte Artefakte und Berichtsformate, die Risiken, Massnahmen und Entscheidungen sichtbar machen."}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {c.deliverables.items.map((item, i) => {
                  const num = String(i + 1).padStart(2, "0");
                  const isLead = i === 0;
                  const isExecutive = i === 2;
                  if (isLead) {
                    return (
                      <div
                        key={item.title}
                        className="group relative overflow-hidden rounded-2xl border border-black/[0.06] bg-[#faf8f2] px-7 py-8 sm:col-span-2"
                      >
                        <LCorner className="top-4 left-4 text-[#c9a96e]/40" />
                        <span
                          className="pointer-events-none absolute -bottom-3 right-4 select-none text-[6rem] font-semibold leading-none tabular-nums text-[#c9a96e]/[0.12]"
                          aria-hidden
                        >
                          {num}
                        </span>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#86868b]">
                          {locale === "en" ? "Foundation" : "Grundlage"}
                        </p>
                        <h3 className="relative mt-3 max-w-[28ch] text-[clamp(1.25rem,2.5vw+0.5rem,1.625rem)] font-semibold leading-snug tracking-[-0.02em] text-[#1d1d1f]">
                          {item.title}
                        </h3>
                        <p className="relative mt-3 max-w-[52ch] text-[15px] leading-relaxed text-[#6e6e73]">
                          {item.body}
                        </p>
                        <div className="absolute bottom-0 left-0 h-[2px] w-16 bg-gradient-to-r from-[#c9a96e]/70 to-transparent" />
                      </div>
                    );
                  }
                  if (isExecutive) {
                    return (
                      <div
                        key={item.title}
                        className="relative overflow-hidden rounded-2xl bg-[#1a2260] px-7 py-8 sm:col-span-2"
                      >
                        <div
                          className="pointer-events-none absolute inset-0"
                          aria-hidden
                          style={{
                            background:
                              "radial-gradient(ellipse 70% 80% at 100% 0%, rgba(69,179,226,0.12) 0%, transparent 55%)",
                          }}
                        />
                        <LCorner className="top-4 right-4 text-[#45b3e2]/30" />
                        <p className="relative text-[11px] font-semibold uppercase tracking-[0.16em] text-[#45b3e2]/70">
                          {locale === "en" ? "For management" : "Für die Geschäftsleitung"}
                        </p>
                        <h3 className="relative mt-3 text-[clamp(1.125rem,2vw+0.5rem,1.5rem)] font-semibold leading-snug tracking-[-0.02em] text-white">
                          {item.title}
                        </h3>
                        <p className="relative mt-3 max-w-[52ch] text-[15px] leading-relaxed text-white/70">
                          {item.body}
                        </p>
                        <p
                          className="pointer-events-none absolute bottom-2 right-4 select-none text-[4rem] font-semibold leading-none tabular-nums text-white/[0.06]"
                          aria-hidden
                        >
                          {num}
                        </p>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={item.title}
                      className="group relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white px-6 py-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#26337c]/15 hover:shadow-[0_12px_32px_rgba(38,51,124,0.08)]"
                    >
                      <LCorner className="top-3 right-3 text-[#c9a96e]/20" />
                      <span
                        className="pointer-events-none absolute -bottom-2 right-3 select-none text-[4rem] font-semibold leading-none tabular-nums text-[#c9a96e]/[0.08] transition-opacity duration-300 group-hover:opacity-60"
                        aria-hidden
                      >
                        {num}
                      </span>
                      <h3 className="relative text-[17px] font-semibold leading-snug tracking-[-0.015em] text-[#1d1d1f]">
                        {item.title}
                      </h3>
                      <p className="relative mt-2 text-[15px] leading-relaxed text-[#6e6e73]">{item.body}</p>
                      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#26337c] to-[#45b3e2] transition-all duration-500 group-hover:w-full" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </MotionSection>
      </section>

      {/* ── 9. BLICKWINKEL ───────────────────────────────────────────────── */}
      <section className="bg-white">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-28">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.8fr] lg:gap-20 lg:items-start">
              <div className="lg:sticky lg:top-28">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                  {c.challengeAreas.eyebrow}
                </p>
                <h2 className="mt-4 text-[clamp(1.625rem,3.5vw+0.5rem,2.375rem)] font-semibold leading-[1.09] tracking-[-0.03em] text-[#1d1d1f]">
                  {c.challengeAreas.title}
                </h2>
                <div className="mt-7 h-px w-full bg-black/[0.06]" />
                <p className="mt-6 text-[15px] leading-relaxed text-[#6e6e73]">{c.challengeAreas.intro}</p>
                <Link
                  href={contactHref}
                  className="mt-8 inline-flex items-center gap-3 text-[14px] font-semibold text-[#26337c] transition-all hover:gap-4"
                >
                  {labels.gespraech}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path
                      d="M3 8h10M8 3l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
              <SpineTimeline items={blickwinkelSpine} />
            </div>
          </div>
        </MotionSection>
      </section>

      {/* ── 10. EINSATZGEBIETE ─────────────────────────────────────────────── */}
      <section className="bg-[#f5f5f7]">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-28">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.8fr] lg:gap-20 lg:items-start">
              <div className="lg:sticky lg:top-28">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                  {c.useCases.eyebrow}
                </p>
                <h2 className="mt-4 text-[clamp(1.625rem,3.5vw+0.5rem,2.375rem)] font-semibold leading-[1.09] tracking-[-0.03em] text-[#1d1d1f]">
                  {c.useCases.title}
                </h2>
                <div className="mt-7 h-px w-full bg-black/[0.06]" />
                <p className="mt-6 text-[15px] leading-relaxed text-[#6e6e73]">
                  {locale === "en"
                    ? "From ERP rollouts to multi-vendor programmes — wherever independent risk oversight adds value."
                    : "Von ERP-Einführungen bis zu Multi-Lieferanten-Programmen — überall dort, wo unabhängige Risikobegleitung Mehrwert schafft."}
                </p>
              </div>
              <div className="grid gap-px overflow-hidden rounded-2xl border border-black/[0.08] bg-black/[0.06] sm:grid-cols-2">
                {c.useCases.items.map((item, i) => {
                  const num = String(i + 1).padStart(2, "0");
                  const isWide = item.length > 44 || i === 0 || i === c.useCases.items.length - 1;
                  const accent = useCaseAccents[i % useCaseAccents.length];
                  return (
                    <div
                      key={item}
                      className={`group relative bg-white ${isWide ? "sm:col-span-2" : ""}`}
                    >
                      <div className={`h-[2px] bg-gradient-to-r ${accent} opacity-80`} aria-hidden />
                      <div className="flex items-start gap-3 px-5 py-5 md:gap-4 md:px-6 md:py-6">
                        <span className="mt-0.5 shrink-0 text-[11px] font-semibold tabular-nums tracking-[0.14em] text-[#45b3e2]">
                          {num}
                        </span>
                        <p className="min-w-0 flex-1 text-[15px] leading-relaxed text-[#1d1d1f]">{item}</p>
                      </div>
                      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#26337c] to-[#45b3e2] transition-all duration-500 group-hover:w-full" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </MotionSection>
      </section>

      {/* ── 11. FAQ ──────────────────────────────────────────────────────── */}
      <section className="bg-[#f5f5f7]">
        <MotionSection>
          <div className="mx-auto max-w-[820px] px-6 py-16 md:py-24">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{c.faq.eyebrow}</p>
            <h2 className="mt-4 text-[clamp(1.625rem,3.5vw+0.5rem,2.375rem)] font-semibold tracking-[-0.03em] text-[#1d1d1f]">
              {c.faq.title}
            </h2>
            <div className="mt-10 rounded-2xl border border-black/[0.06] bg-white px-6 md:px-8">
              <RisikomanagementFaqList items={c.faq.items} />
            </div>
          </div>
        </MotionSection>
      </section>

      {/* ── 12. CTA ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          aria-hidden
          style={{ background: "linear-gradient(115deg, #26337c 0%, #3550a4 45%, #45b3e2 100%)" }}
        />
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 80% at 15% 100%, rgba(201,169,110,0.14) 0%, transparent 50%), radial-gradient(ellipse 50% 60% at 90% 10%, rgba(255,255,255,0.07) 0%, transparent 45%)",
          }}
        />
        <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
                {labels.naechsterSchritt}
              </p>
              <h2 className="mt-4 max-w-[34ch] text-[clamp(1.5rem,3.5vw+0.5rem,2.375rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white text-balance">
                {c.closing.title}
              </h2>
              <p className="mt-5 max-w-[50ch] text-[16px] leading-relaxed text-white/65">{c.closing.body}</p>
              <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
                {c.closing.tags.map((tag) => (
                  <li key={tag} className="flex items-center gap-2 text-[13px] font-medium text-white/70">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9a96e]/70" aria-hidden />
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3 md:shrink-0">
              <Link
                href={contactHrefWithInterests(c.closing.primaryCta.interest, locale)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 text-[14px] font-semibold text-[#26337c] shadow-lg transition-all hover:scale-[1.02] hover:bg-white/90"
              >
                {c.closing.primaryCta.label}
              </Link>
              <Link
                href={contactHrefWithInterests(c.closing.secondaryCta.interest, locale)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-8 text-[14px] font-semibold text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/10"
              >
                {c.closing.secondaryCta.label}
              </Link>
              <Link
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-8 text-[14px] font-semibold text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/10"
              >
                {labels.kalender}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </InteriorPageRoot>
  );
}
