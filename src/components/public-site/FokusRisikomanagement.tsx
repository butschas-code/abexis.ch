import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { RisikomanagementFaqList } from "@/components/public-site/RisikomanagementFaqList";
import { HeroProjectRealityCheckCta } from "@/components/site/HeroProjectRealityCheckCta";
import { PageHero } from "@/components/site/PageHero";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { contactHrefWithInterests } from "@/data/contact-meeting-interests";
import { fokusthemenMeta } from "@/data/pages";
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

type SignItem = { num: string; title: string; body: string };

function SignSpineCard({ item }: { item: SignItem }) {
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
      <p className="relative mt-3 text-[15px] leading-relaxed text-[#6e6e73]">{item.body}</p>
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#26337c] to-[#45b3e2] transition-all duration-500 group-hover:w-full" />
    </div>
  );
}

type Props = { locale?: RisikomanagementLocale };

export function FokusRisikomanagement({ locale = "de" }: Props) {
  const c = getRisikomanagementContent(locale);
  const meta = fokusthemenMeta.find((m) => m.slug === "risikomanagement")!;
  const heroImage = fokusPageHeroImages.risikomanagement;
  const path = locale === "en" ? "/en/fokusthemen/risikomanagement" : "/fokusthemen/risikomanagement";
  const servicesPath = locale === "en" ? "/en/leistungen" : "/leistungen";
  const homePath = locale === "en" ? "/en/home" : "/";
  const prcHref = c.prcPath;
  const prcHeroLabel =
    locale === "en" ? "Request a Project Reality Check" : "Project Reality Check anfragen";
  const earlySignalsLabel = locale === "en" ? "Early signals" : "Früherkennung";

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

      <PageHero imageSrc={heroImage} priority>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">{meta.subtitle}</p>
        <h1 className="mt-3 max-w-[22ch] text-[clamp(2.25rem,7vw+0.5rem,3.875rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-white text-balance">
          {c.hero.title}
        </h1>
        <p className="mt-6 max-w-[56ch] text-[clamp(1rem,1.5vw+0.5rem,1.175rem)] leading-relaxed text-white/80 text-balance">
          {c.hero.body}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href={contactHrefWithInterests(c.hero.primaryCta.interest, locale)}
            className="inline-flex h-11 items-center rounded-full bg-white px-7 text-sm font-semibold text-[#26337c] transition-all hover:scale-[1.02] hover:bg-white/90"
          >
            {c.hero.primaryCta.label}
          </Link>
          <HeroProjectRealityCheckCta href={prcHref} label={prcHeroLabel} />
          <Link
            href="#frueherkennung"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/30 px-7 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/10"
          >
            {earlySignalsLabel}
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

      <MotionSection>
        <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-28">
          <div className="grid gap-8 border-b border-black/[0.06] pb-12 md:grid-cols-[1fr_1fr] md:items-end md:gap-20">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                {locale === "en" ? "Situation" : "Ausgangslage"}
              </p>
              <h2 className="mt-4 text-[clamp(1.625rem,3.5vw+0.5rem,2.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f]">
                {c.problem.title}
              </h2>
            </div>
            <p className="text-[17px] leading-relaxed text-[#6e6e73] md:pb-1">{c.problem.intro}</p>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-black/[0.06] bg-black/[0.04] sm:grid-cols-2">
            {c.problem.questions.map((q, i) => (
              <div key={q} className="relative bg-white px-6 py-6">
                <LCorner className="top-3 right-3 text-[#c9a96e]/20" />
                <p className="text-[11px] font-semibold tabular-nums tracking-[0.14em] text-[#45b3e2]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-[#1d1d1f]">{q}</p>
              </div>
            ))}
          </div>
        </div>
      </MotionSection>

      <section id="frueherkennung" className="bg-[#f5f5f7]">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-28">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.8fr] lg:items-start lg:gap-20">
              <div className="lg:sticky lg:top-28">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{c.signs.eyebrow}</p>
                <h2 className="mt-4 text-[clamp(1.625rem,3.5vw+0.5rem,2.375rem)] font-semibold leading-[1.09] tracking-[-0.03em] text-[#1d1d1f]">
                  {c.signs.title}
                </h2>
                <div className="mt-7 h-px w-full bg-black/[0.06]" />
                <Link
                  href={contactHrefWithInterests("risk-management", locale)}
                  className="mt-8 inline-flex items-center gap-3 text-[14px] font-semibold text-[#26337c] transition-all hover:gap-4"
                >
                  {locale === "en" ? "Request a risk conversation" : "Risikogespräch anfragen"}
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
              <div className="grid gap-4 sm:grid-cols-2">
                {c.signs.items.map((item) => (
                  <SignSpineCard key={item.num} item={item} />
                ))}
              </div>
            </div>
          </div>
        </MotionSection>
      </section>

      <MotionSection>
        <div id="einsatzformen" className="overflow-hidden md:grid md:grid-cols-2">
          <div className="relative bg-[#faf8f2]">
            <div className="relative ml-auto max-w-[534px] px-8 py-14 md:px-12 md:py-20">
              <LCorner className="top-6 left-6 text-[#c9a96e]/40" />
              <div className="mb-6 h-[3px] w-10 rounded-full bg-[#c9a96e]/60" />
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                {locale === "en" ? "Mode 1" : "Einsatzform 1"}
              </h2>
              <h3 className="mt-3 text-[clamp(1.375rem,3vw+0.5rem,1.875rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-[#1d1d1f]">
                {c.models.ongoing.title}
              </h3>
              <p className="mt-5 text-[16px] leading-relaxed text-[#6e6e73]">{c.models.ongoing.intro}</p>
              <p className="mt-4 text-[16px] leading-relaxed text-[#6e6e73]">{c.models.ongoing.note}</p>
              <ul className="mt-6 space-y-2.5">
                {c.models.ongoing.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-[#6e6e73]">
                    <span className="mt-[6px] h-[4px] w-[4px] shrink-0 rounded-full bg-[#45b3e2]" aria-hidden />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#c9a96e]/60 via-[#c9a96e]/20 to-transparent" />
          </div>

          <div className="relative bg-[#1a2260]">
            <div className="relative mr-auto max-w-[534px] px-8 py-14 md:px-12 md:py-20">
              <LCorner className="top-6 left-6 text-[#45b3e2]/30" />
              <div className="mb-6 h-[3px] w-10 rounded-full bg-[#45b3e2]/50" />
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
                {locale === "en" ? "Mode 2" : "Einsatzform 2"}
              </h2>
              <h3 className="mt-3 text-[clamp(1.375rem,3vw+0.5rem,1.875rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-white">
                {c.models.prc.title}
              </h3>
              <p className="mt-5 text-[16px] leading-relaxed text-white/65">{c.models.prc.body}</p>
              <Link
                href={c.models.prc.cta.href}
                className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 text-[14px] font-semibold text-white backdrop-blur-sm transition hover:bg-white/15 hover:gap-3"
              >
                {c.models.prc.cta.label}
                <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#26337c] via-[#45b3e2]/60 to-transparent" />
          </div>
        </div>
      </MotionSection>

      <section className="bg-white">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-28">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{c.deliverables.eyebrow}</p>
            <h2 className="mt-4 text-[clamp(1.625rem,3.5vw+0.5rem,2.375rem)] font-semibold tracking-[-0.03em] text-[#1d1d1f]">
              {c.deliverables.title}
            </h2>
            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-black/[0.06] bg-black/[0.04] sm:grid-cols-2 lg:grid-cols-3">
              {c.deliverables.items.map((item, i) => (
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
        </MotionSection>
      </section>

      <section className="relative overflow-hidden bg-[#1a1f38]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 15% 50%, rgba(69,179,226,0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 70% at 85% 30%, rgba(38,51,124,0.4) 0%, transparent 60%)",
          }}
        />
        <MotionSection>
          <div className="relative mx-auto max-w-[1068px] px-6 py-16 md:py-28">
            <div className="flex items-baseline gap-4 border-b border-white/[0.08] pb-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#45b3e2]/70">
                {c.challengeAreas.eyebrow}
              </p>
              <span className="text-[11px] text-white/30">{c.challengeAreas.items.length} {locale === "en" ? "perspectives" : "Blickwinkel"}</span>
            </div>
            <h2 className="mt-8 max-w-[36ch] text-[clamp(1.5rem,3.5vw+0.5rem,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
              {c.challengeAreas.title}
            </h2>
            <p className="mt-5 max-w-[62ch] text-[16px] leading-relaxed text-white/55">{c.challengeAreas.intro}</p>
            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-3">
              {c.challengeAreas.items.map((item, i) => (
                <div key={item.title} className="relative flex flex-col bg-[#1a1f38]/60 px-6 py-7 backdrop-blur-sm">
                  <p
                    className="text-[2.5rem] font-semibold leading-none tracking-[-0.05em]"
                    style={{ color: `rgba(201,169,110,${0.25 + (i % 3) * 0.12})` }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-[16px] font-semibold leading-snug text-white">{item.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-white/60">{item.body}</p>
                  <div className="mt-auto pt-6">
                    <div className="h-px w-6 bg-[#c9a96e]/40" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </MotionSection>
      </section>

      <section className="relative overflow-hidden bg-[#1a1f38]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 90% 60% at 50% 50%, rgba(38,51,124,0.6) 0%, transparent 70%)",
          }}
        />
        <MotionSection>
          <div className="relative mx-auto max-w-[1068px] px-6 py-16 md:py-28">
            <div className="flex items-baseline gap-4 border-b border-white/[0.08] pb-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#45b3e2]/70">{c.process.eyebrow}</p>
              <span className="text-[11px] text-white/30">
                {c.process.steps.length} {locale === "en" ? "steps" : "Schritte"}
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
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">{step.title}</p>
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

      <section className="relative overflow-hidden bg-[#1a1f38]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 90% 60% at 50% 50%, rgba(38,51,124,0.6) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-[800px] px-6 py-20 text-center md:py-32">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c9a96e]/60">
            {locale === "en" ? "Principle" : "Grundsatz"}
          </p>
          <blockquote className="mt-8 text-[clamp(1.375rem,3.5vw+0.5rem,2.25rem)] font-semibold leading-[1.22] tracking-[-0.025em] text-white text-balance">
            &ldquo;{c.positioning.title}&rdquo;
          </blockquote>
          <div className="mt-10 flex items-center justify-center gap-5">
            <div className="h-px w-12 bg-[#c9a96e]/35" />
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/30">Abexis</span>
            <div className="h-px w-12 bg-[#c9a96e]/35" />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-28">
            <p className="max-w-[62ch] text-[17px] leading-relaxed text-[#6e6e73]">{c.positioning.intro}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {c.positioning.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 rounded-2xl border border-black/[0.06] bg-[#fafafa] px-5 py-4 text-[15px] leading-relaxed text-[#1d1d1f]"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9a96e]" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </MotionSection>
      </section>

      <section className="bg-[#f5f5f7]">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-28">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.8fr] lg:items-start lg:gap-20">
              <div className="lg:sticky lg:top-28">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{c.outcomes.eyebrow}</p>
                <h2 className="mt-4 text-[clamp(1.625rem,3.5vw+0.5rem,2.375rem)] font-semibold leading-[1.09] tracking-[-0.03em] text-[#1d1d1f]">
                  {c.outcomes.title}
                </h2>
                <div className="mt-7 h-px w-full bg-black/[0.06]" />
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

      <section className="bg-white">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-28">
            <div className="grid gap-8 border-b border-black/[0.06] pb-12 md:grid-cols-[1fr_1fr] md:items-end md:gap-20">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{c.useCases.eyebrow}</p>
                <h2 className="mt-4 text-[clamp(1.625rem,3.5vw+0.5rem,2.375rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f]">
                  {c.useCases.title}
                </h2>
              </div>
            </div>
            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-black/[0.06] bg-black/[0.04] sm:grid-cols-2 lg:grid-cols-3">
              {c.useCases.items.map((item, i) => (
                <div key={item} className="relative bg-white px-6 py-6">
                  <LCorner className="top-3 right-3 text-[#c9a96e]/20" />
                  <p className="text-[11px] font-semibold tabular-nums tracking-[0.14em] text-[#45b3e2]">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#1d1d1f]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </MotionSection>
      </section>

      <section className="bg-[#f5f5f7]">
        <MotionSection>
          <div className="mx-auto max-w-[820px] px-6 py-16 md:py-28">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{c.faq.eyebrow}</p>
            <h2 className="mt-4 text-[clamp(1.625rem,3.5vw+0.5rem,2.375rem)] font-semibold tracking-[-0.03em] text-[#1d1d1f]">
              {c.faq.title}
            </h2>
            <div className="mt-10 rounded-2xl border border-black/[0.06] bg-white px-6 shadow-[var(--apple-shadow)] md:px-8">
              <RisikomanagementFaqList items={c.faq.items} />
            </div>
          </div>
        </MotionSection>
      </section>

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
                {locale === "en" ? "Next step" : "Nächster Schritt"}
              </p>
              <h2 className="mt-4 max-w-[34ch] text-[clamp(1.5rem,3.5vw+0.5rem,2.375rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white text-balance">
                {c.closing.title}
              </h2>
              <p className="mt-5 max-w-[56ch] text-[16px] leading-relaxed text-white/65">{c.closing.body}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                {c.closing.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-1.5 text-[12px] font-medium text-white/70"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c9a96e]/70" aria-hidden />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 md:shrink-0">
              <Link
                href={contactHrefWithInterests(c.closing.primaryCta.interest, locale)}
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-[14px] font-semibold text-[#26337c] shadow-lg transition-all hover:scale-[1.02] hover:bg-white/90"
              >
                {c.closing.primaryCta.label}
              </Link>
              <Link
                href={contactHrefWithInterests(c.closing.secondaryCta.interest, locale)}
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-8 text-[14px] font-semibold text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/10"
              >
                {c.closing.secondaryCta.label}
              </Link>
            </div>
          </div>
          <div className="mt-16 flex items-center gap-4 opacity-20">
            <div className="h-px flex-1 bg-white" />
            <div className="relative h-4 w-4">
              <div className="absolute top-0 left-0 h-4 w-px bg-white" />
              <div className="absolute top-0 left-0 h-px w-4 bg-white" />
            </div>
          </div>
        </div>
      </section>
    </InteriorPageRoot>
  );
}
