import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { RisikomanagementFaqList } from "@/components/public-site/RisikomanagementFaqList";
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

type Props = { locale?: RisikomanagementLocale };

export function FokusRisikomanagement({ locale = "de" }: Props) {
  const c = getRisikomanagementContent(locale);
  const meta = fokusthemenMeta.find((m) => m.slug === "risikomanagement")!;
  const heroImage = fokusPageHeroImages.risikomanagement;
  const path = locale === "en" ? "/en/fokusthemen/risikomanagement" : "/fokusthemen/risikomanagement";
  const servicesPath = locale === "en" ? "/en/leistungen" : "/leistungen";
  const homePath = locale === "en" ? "/en/home" : "/";

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
            className="inline-flex h-11 items-center rounded-full bg-white px-7 text-sm font-semibold text-[#26337c] transition-all hover:bg-white/90 hover:scale-[1.02]"
          >
            {c.hero.primaryCta.label}
          </Link>
          <Link
            href={c.hero.secondaryCta.href}
            className="inline-flex h-11 items-center rounded-full border border-white/30 px-7 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/10"
          >
            {c.hero.secondaryCta.label}
          </Link>
        </div>
      </PageHero>

      <MotionSection>
        <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-24">
          <h2 className="max-w-[40ch] text-[clamp(1.5rem,3.2vw+0.5rem,2.25rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-[#1d1d1f]">
            {c.problem.title}
          </h2>
          <p className="mt-6 max-w-[62ch] text-[17px] leading-relaxed text-[#6e6e73]">{c.problem.intro}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {c.problem.questions.map((q) => (
              <li key={q} className="flex items-start gap-3 rounded-2xl border border-black/[0.06] bg-white px-5 py-4 text-[15px] leading-relaxed text-[#1d1d1f]">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#45b3e2]" aria-hidden />
                {q}
              </li>
            ))}
          </ul>
        </div>
      </MotionSection>

      <section className="bg-[#1a2260]">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-24">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#45b3e2]/85">{c.signs.eyebrow}</p>
            <h2 className="mt-4 max-w-[34ch] text-[clamp(1.375rem,3.2vw+0.5rem,2.25rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-white">
              {c.signs.title}
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {c.signs.items.map((item) => (
                <div key={item.num} className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-7">
                  <p className="text-[11px] font-semibold tabular-nums tracking-[0.14em] text-[#45b3e2]">{item.num}</p>
                  <h3 className="mt-3 text-[17px] font-semibold leading-snug text-white">{item.title}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-white/60">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </MotionSection>
      </section>

      <section className="bg-[#f5f5f7]">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-24">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{c.models.eyebrow}</p>
            <h2 className="mt-4 max-w-[36ch] text-[clamp(1.5rem,3.2vw+0.5rem,2.25rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-[#1d1d1f]">
              {c.models.title}
            </h2>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-black/[0.06] bg-white p-7 md:p-8">
                <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">{c.models.ongoing.title}</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-[#6e6e73]">{c.models.ongoing.intro}</p>
                <p className="mt-4 text-[15px] leading-relaxed text-[#6e6e73]">{c.models.ongoing.note}</p>
                <ul className="mt-6 space-y-2.5">
                  {c.models.ongoing.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-[#6e6e73]">
                      <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-[#26337c]" aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-[#26337c]/15 bg-[#1a2260] p-7 text-white md:p-8">
                <h3 className="text-[22px] font-semibold tracking-[-0.02em]">{c.models.prc.title}</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-white/70">{c.models.prc.body}</p>
                <Link
                  href={c.models.prc.cta.href}
                  className="mt-8 inline-flex min-h-11 items-center gap-2 text-[14px] font-semibold text-[#7dd3fc] transition hover:gap-3"
                >
                  {c.models.prc.cta.label}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </MotionSection>
      </section>

      <MotionSection>
        <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{c.deliverables.eyebrow}</p>
          <h2 className="mt-4 text-[clamp(1.5rem,3.2vw+0.5rem,2.25rem)] font-semibold tracking-[-0.03em] text-[#1d1d1f]">
            {c.deliverables.title}
          </h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-black/[0.06] bg-black/[0.04] sm:grid-cols-2 lg:grid-cols-3">
            {c.deliverables.items.map((item) => (
              <div key={item.title} className="relative bg-white px-6 py-6">
                <LCorner className="top-3 right-3 text-[#c9a96e]/20" />
                <h3 className="text-[17px] font-semibold leading-snug text-[#1d1d1f]">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#6e6e73]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </MotionSection>

      <section className="bg-[#f5f5f7]">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-24">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{c.challengeAreas.eyebrow}</p>
            <h2 className="mt-4 max-w-[36ch] text-[clamp(1.5rem,3.2vw+0.5rem,2.25rem)] font-semibold tracking-[-0.03em] text-[#1d1d1f]">
              {c.challengeAreas.title}
            </h2>
            <p className="mt-4 max-w-[62ch] text-[16px] leading-relaxed text-[#6e6e73]">{c.challengeAreas.intro}</p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {c.challengeAreas.items.map((item) => (
                <div key={item.title} className="rounded-2xl border border-black/[0.06] bg-white px-5 py-5">
                  <h3 className="text-[16px] font-semibold text-[#1d1d1f]">{item.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#6e6e73]">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </MotionSection>
      </section>

      <MotionSection>
        <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{c.process.eyebrow}</p>
          <h2 className="mt-4 text-[clamp(1.5rem,3.2vw+0.5rem,2.25rem)] font-semibold tracking-[-0.03em] text-[#1d1d1f]">
            {c.process.title}
          </h2>
          <div className="mt-10 space-y-4">
            {c.process.steps.map((step) => (
              <div key={step.num} className="grid gap-4 rounded-2xl border border-black/[0.06] bg-white p-6 md:grid-cols-[72px_1fr] md:items-start">
                <p className="text-[13px] font-semibold tabular-nums tracking-[0.14em] text-[#45b3e2]">{step.num}</p>
                <div>
                  <h3 className="text-[18px] font-semibold text-[#1d1d1f]">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#6e6e73]">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MotionSection>

      <section className="bg-white">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-24">
            <h2 className="max-w-[40ch] text-[clamp(1.5rem,3.2vw+0.5rem,2.25rem)] font-semibold tracking-[-0.03em] text-[#1d1d1f]">
              {c.positioning.title}
            </h2>
            <p className="mt-6 max-w-[62ch] text-[17px] leading-relaxed text-[#6e6e73]">{c.positioning.intro}</p>
            <ul className="mt-8 space-y-3">
              {c.positioning.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[15px] leading-relaxed text-[#1d1d1f]">
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
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-24">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{c.outcomes.eyebrow}</p>
            <h2 className="mt-4 text-[clamp(1.5rem,3.2vw+0.5rem,2.25rem)] font-semibold tracking-[-0.03em] text-[#1d1d1f]">
              {c.outcomes.title}
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {c.outcomes.items.map((item) => (
                <div key={item.title} className="rounded-2xl border border-black/[0.06] bg-white px-6 py-6">
                  <h3 className="text-[17px] font-semibold text-[#1d1d1f]">{item.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#6e6e73]">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </MotionSection>
      </section>

      <MotionSection>
        <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{c.useCases.eyebrow}</p>
          <h2 className="mt-4 text-[clamp(1.5rem,3.2vw+0.5rem,2.25rem)] font-semibold tracking-[-0.03em] text-[#1d1d1f]">
            {c.useCases.title}
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {c.useCases.items.map((item) => (
              <li key={item} className="rounded-xl border border-black/[0.06] bg-[#fafafa] px-5 py-4 text-[15px] leading-relaxed text-[#1d1d1f]">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </MotionSection>

      <section className="bg-[#f5f5f7]">
        <MotionSection>
          <div className="mx-auto max-w-[820px] px-6 py-16 md:py-24">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{c.faq.eyebrow}</p>
            <h2 className="mt-4 text-[clamp(1.5rem,3.2vw+0.5rem,2.25rem)] font-semibold tracking-[-0.03em] text-[#1d1d1f]">
              {c.faq.title}
            </h2>
            <div className="mt-8 rounded-2xl border border-black/[0.06] bg-white px-6 md:px-8">
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
        <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-24">
          <h2 className="max-w-[34ch] text-[clamp(1.5rem,3.2vw+0.5rem,2.375rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
            {c.closing.title}
          </h2>
          <p className="mt-5 max-w-[56ch] text-[16px] leading-relaxed text-white/70">{c.closing.body}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {c.closing.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-1.5 text-[12px] font-medium text-white/75"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#c9a96e]/70" aria-hidden />
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={contactHrefWithInterests(c.closing.primaryCta.interest, locale)}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-8 text-[14px] font-semibold text-[#26337c] shadow-lg transition hover:bg-white/90"
            >
              {c.closing.primaryCta.label}
            </Link>
            <Link
              href={contactHrefWithInterests(c.closing.secondaryCta.interest, locale)}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-8 text-[14px] font-semibold text-white transition hover:bg-white/10"
            >
              {c.closing.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>
    </InteriorPageRoot>
  );
}
