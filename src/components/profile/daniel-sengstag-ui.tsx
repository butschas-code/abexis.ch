"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import type { SiteContent } from "@/data/daniel-sengstag/types";
import { MotionSection } from "@/components/motion/MotionSection";
import { PageHero } from "@/components/site/PageHero";
import { siteConfig } from "@/data/pages";

const ease = [0.25, 0.1, 0.25, 1] as const;

function CountUp({
  to,
  from = 0,
  duration = 1.6,
  pad = 0,
  suffix = "",
  prefix = "",
}: {
  to: number;
  from?: number;
  duration?: number;
  pad?: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState<number>(reduce ? to : from);

  useEffect(() => {
    if (!isInView || reduce) return;
    const controls = animate(from, to, {
      duration,
      ease,
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, to, from, duration, reduce]);

  const rendered = pad > 0 ? String(value).padStart(pad, "0") : String(value);
  return (
    <span ref={ref}>
      {prefix}
      {rendered}
      {suffix}
    </span>
  );
}

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${dark ? "text-white/60" : "text-[#86868b]"}`}
    >
      {children}
    </p>
  );
}

export function DanielSengstagProfilePage({ copy, images }: { copy: SiteContent; images: { hero: string; editorial: string } }) {
  return (
    <>
      <PageHero imageSrc={images.hero} priority imageObjectClassName="object-[center_22%]">
        <div className="max-w-[40rem]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">{copy.hero.credentials}</p>
          <h1 className="mt-3 text-[clamp(1.875rem,6.5vw+0.6rem,2.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-white text-balance sm:text-[40px] sm:leading-[1.05] md:text-[52px] md:leading-[1.02]">
            {copy.hero.name}
          </h1>
          <p className="mt-6 text-[17px] font-normal leading-relaxed text-white/88 sm:text-[19px] md:text-[21px]">{copy.hero.line}</p>
          <p className="mt-4 text-[15px] leading-relaxed text-white/75 sm:text-[16px]">{copy.hero.lead}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <a
              href="#kontakt"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/35 bg-white/10 px-7 text-[17px] font-medium text-white backdrop-blur-sm transition-all duration-200 ease-out hover:border-white/60 hover:bg-white/22 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 sm:w-auto sm:min-h-[48px] sm:px-8"
            >
              {copy.hero.ctaSecondary}
            </a>
          </div>
        </div>
      </PageHero>

      <MotionSection className="border-b border-black/[0.06] bg-white py-3">
        <nav
          className="mx-auto flex max-w-[1068px] flex-wrap justify-center gap-1 px-4 sm:gap-2 sm:px-6"
          aria-label="Abschnitte"
        >
          {copy.nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="rounded-full px-3 py-2 text-[13px] font-medium text-[#6e6e73] transition-colors hover:bg-black/[0.04] hover:text-brand-900"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </MotionSection>

      <MotionSection className="border-b border-black/[0.06] bg-gradient-to-b from-white via-[#fafbfd] to-white py-16 md:py-24">
        <p className="mx-auto max-w-[22ch] text-center text-[clamp(1.5rem,3.5vw,2.25rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-[#1d1d1f]">
          {copy.hero.pull}
        </p>
      </MotionSection>

      <MotionSection className="bg-[#26337c] py-16 text-white md:py-24">
        <div className="mx-auto max-w-[1068px] px-4 sm:px-6">
          <Eyebrow dark>Im Profil</Eyebrow>
          <h2 className="mt-4 max-w-[20ch] text-[clamp(2rem,8vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
            {copy.hero.name}
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-12">
            <p className="text-[clamp(1.05rem,1.6vw,1.25rem)] font-normal leading-relaxed text-white/90">{copy.hero.line}</p>
            <p className="text-[15px] leading-relaxed text-white/70">{copy.hero.lead}</p>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-white/15 pt-12 sm:gap-x-10 md:mt-16 md:grid-cols-4 md:pt-14">
            <div>
              <p className="text-[clamp(2.25rem,6vw,3.5rem)] font-semibold leading-none tabular-nums">
                <CountUp to={30} suffix="+" duration={1.4} />
              </p>
              <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55">Jahre Führung</p>
              <p className="mt-1 text-[13px] text-white/40">seit 1995</p>
            </div>
            <div>
              <p className="text-[clamp(2.25rem,6vw,3.5rem)] font-semibold leading-none tabular-nums">
                <CountUp to={copy.experience.timeline.length} pad={2} duration={1.3} />
              </p>
              <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55">Stationen</p>
              <p className="mt-1 text-[13px] text-white/40">Siemens → Abexis</p>
            </div>
            <div>
              <p className="text-[clamp(2.25rem,6vw,3.5rem)] font-semibold leading-none tabular-nums">
                <CountUp to={5} pad={2} duration={1.2} />
              </p>
              <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55">Marken</p>
              <p className="mt-1 text-[13px] text-white/40">CEO · EMEA · Founder</p>
            </div>
            <div>
              <p className="text-[clamp(2.25rem,6vw,3.5rem)] font-semibold leading-none tabular-nums">
                <CountUp to={2023} from={2000} duration={2} />
              </p>
              <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55">Verwaltungsrat CAS</p>
              <p className="mt-1 text-[13px] text-white/40">Swiss Board School · HSG</p>
            </div>
          </div>
          <div className="mt-14 border-t border-white/15 pt-8 md:mt-16 md:pt-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">Stationen</p>
            <p className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-center text-[clamp(0.95rem,2vw,1.25rem)] font-medium leading-snug text-white/88 sm:justify-start sm:text-left">
              {["Siemens Industry Software", "Dassault Systèmes", "Ansys", "Pegasystems", "Abexis"].map((name, i, arr) => (
                <span key={name} className="inline-flex flex-wrap items-center gap-x-2">
                  <span>{name}</span>
                  {i < arr.length - 1 ? (
                    <span className="text-[#45b3e2] max-sm:hidden" aria-hidden>
                      ·
                    </span>
                  ) : null}
                </span>
              ))}
            </p>
          </div>
        </div>
      </MotionSection>

      <MotionSection id="profil" className="scroll-mt-28 py-16 md:py-24">
        <div className="mx-auto max-w-[1068px] px-4 sm:px-6">
          <div className="grid items-start gap-12 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-5">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-[#f5f5f7] shadow-[var(--apple-shadow)] ring-1 ring-black/[0.06]">
                <Image
                  src={images.editorial}
                  alt={copy.hero.name}
                  fill
                  className="object-cover object-[center_22%]"
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  quality={90}
                />
              </div>
            </div>
            <div className="md:col-span-7 md:pl-2">
              <Eyebrow>{copy.intro.kicker}</Eyebrow>
              <h2 className="mt-4 text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f]">
                {copy.intro.title}
              </h2>
              <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-[#6e6e73] sm:text-[16px]">
                {copy.intro.body.map((para, i) => (
                  <p key={`intro-${i}`}>{para}</p>
                ))}
              </div>
              <details className="group mt-10 border-t border-black/[0.08] pt-6">
                <summary className="flex cursor-pointer list-none items-baseline justify-between gap-4 marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="text-[15px] font-medium text-[#1d1d1f] transition-colors group-open:text-brand-900 sm:text-[16px]">
                    {copy.portraitExpand.summary}
                  </span>
                  <span className="text-[13px] text-[#86868b]">
                    <span className="group-open:hidden">→</span>
                    <span className="hidden group-open:inline">×</span>
                  </span>
                </summary>
                <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-[#6e6e73]">
                  {copy.portraitExpand.paragraphs.map((p, i) => (
                    <p key={`pe-${i}`}>{p}</p>
                  ))}
                </div>
              </details>
            </div>
          </div>
        </div>
      </MotionSection>

      <MotionSection id="bahn" className="scroll-mt-28 bg-[#26337c] py-16 text-white md:py-24">
        <div className="mx-auto max-w-[1068px] px-4 sm:px-6">
          <div className="grid gap-12 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-4">
              <Eyebrow dark>{copy.experience.kicker}</Eyebrow>
              <h2 className="mt-4 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
                {copy.experience.title}
              </h2>
              <p className="mt-8 max-w-sm text-[15px] leading-relaxed text-white/70">{copy.experience.narrative[0]}</p>
              <p className="mt-6 text-[15px] font-medium leading-relaxed text-white/60">{copy.experience.narrative[1]}</p>
              <ul className="mt-8 space-y-2 text-[14px] leading-relaxed text-white/75">
                {copy.experience.highlights.slice(0, 5).map((h) => (
                  <li key={h} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#45b3e2]" aria-hidden />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
            <ol className="md:col-span-8">
              {copy.experience.timeline.map((row, i) => {
                const activeDot = i === 0;
                return (
                  <li key={`${row.period}-${row.org}`} className="group border-b border-white/10 py-6 sm:py-7 md:py-8">
                    <div className="grid grid-cols-[auto_1fr] items-start gap-x-4 sm:grid-cols-[10rem_1fr] sm:gap-x-8 md:grid-cols-[12rem_1fr]">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${
                            activeDot ? "bg-[#45b3e2] shadow-[0_0_12px_2px_rgba(69,179,226,0.5)]" : "bg-white/35"
                          }`}
                          aria-hidden
                        />
                        <span className="text-[15px] font-medium tabular-nums text-white/75">{row.period}</span>
                      </div>
                      <div>
                        <p className="text-[clamp(1.1rem,2.2vw,1.35rem)] font-semibold leading-snug text-white transition-colors group-hover:text-[#b8e8f7]">
                          {row.role}
                        </p>
                        <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/45">{row.org}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </MotionSection>

      <MotionSection id="schwerpunkte" className="scroll-mt-28 py-16 md:py-24">
        <div className="mx-auto max-w-[1068px] px-4 sm:px-6">
          <Eyebrow>{copy.focus.kicker}</Eyebrow>
          <h2 className="mt-3 max-w-[32ch] text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#1d1d1f]">
            {copy.focus.title}
          </h2>
          <div className="mt-12 grid gap-4 md:mt-14 md:grid-cols-3">
            {copy.focus.themes.map((t) => (
              <article
                key={t.title}
                className="flex flex-col rounded-[28px] bg-white p-6 shadow-[var(--apple-shadow)] ring-1 ring-black/[0.04] transition-shadow duration-300 hover:shadow-[var(--apple-shadow-lg)] hover:ring-brand-500/20 sm:p-8"
              >
                <h3 className="text-[19px] font-semibold leading-snug tracking-[-0.02em] text-[#1d1d1f]">{t.title}</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-[#6e6e73]">{t.note}</p>
                <span className="mt-6 inline-block h-px w-10 bg-[#1d1d1f]/15" aria-hidden />
              </article>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection id="kompetenzen" className="scroll-mt-28 border-t border-black/[0.06] bg-[#fbfbfd] py-16 md:py-24">
        <div className="mx-auto max-w-[1068px] px-4 sm:px-6">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <Eyebrow>{copy.skills.kicker}</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#1d1d1f]">
                {copy.skills.title}
              </h2>
              <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-[#6e6e73]">{copy.skills.lead}</p>
            </div>
            <div className="md:col-span-8">
              <ul className="flex flex-wrap gap-2">
                {copy.skills.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-black/[0.1] bg-white px-4 py-1.5 text-[13px] text-[#424245] shadow-sm sm:text-[14px]"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">Felder</p>
              <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-[#6e6e73]">
                {copy.strengths.items.map((line) => (
                  <li key={line} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-900/80" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <details className="group mt-10 border-t border-black/[0.08] pt-6">
                <summary className="flex cursor-pointer list-none items-baseline justify-between gap-4 marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="text-[15px] font-medium text-[#1d1d1f] sm:text-[16px]">{copy.skills.detailSummary}</span>
                  <span className="text-[13px] text-[#86868b]">
                    <span className="group-open:hidden">→</span>
                    <span className="hidden group-open:inline">×</span>
                  </span>
                </summary>
                <ul className="mt-6 grid gap-2 text-[14px] leading-snug text-[#6e6e73] sm:grid-cols-2">
                  {copy.skills.detailBullets.map((line) => (
                    <li key={line} className="flex gap-2 border-b border-black/[0.04] py-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-500/90" aria-hidden />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          </div>
        </div>
      </MotionSection>

      <MotionSection id="haltung" className="relative scroll-mt-28 overflow-hidden bg-[#26337c] py-16 text-white md:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_50%,rgba(69,179,226,0.12),transparent_70%)]"
        />
        <div className="relative mx-auto max-w-[1068px] px-4 text-center sm:px-6">
          <Eyebrow dark>{copy.philosophy.kicker}</Eyebrow>
          <h3 className="mt-2 text-[15px] font-medium text-white/80 sm:text-[16px]">{copy.philosophy.title}</h3>
          <p className="mx-auto mt-6 max-w-[60ch] text-[clamp(1.25rem,2.2vw,1.85rem)] font-semibold leading-[1.25] text-white">
            <span className="text-[#8fdcf0]">“</span>
            {copy.philosophy.body[0]}
            <span className="text-[#8fdcf0]">”</span>
          </p>
          {copy.philosophy.body[1] ? <p className="mx-auto mt-6 max-w-[54ch] text-[15px] leading-relaxed text-white/60 sm:text-[16px]">{copy.philosophy.body[1]}</p> : null}
        </div>
      </MotionSection>

      <MotionSection id="ausbildung" className="scroll-mt-28 py-16 md:py-24">
        <div className="mx-auto max-w-[1068px] px-4 sm:px-6">
          <Eyebrow>{copy.education.kicker}</Eyebrow>
          <h2 className="mt-3 max-w-[32ch] text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#1d1d1f]">
            {copy.education.bandTitle}
          </h2>
          <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-3 md:gap-10">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#86868b]">{copy.education.title}</p>
              <ol className="mt-6 space-y-6">
                {copy.education.entries.map((e) => (
                  <li key={e.period + e.title}>
                    <p className="text-[12px] font-medium tabular-nums text-[#86868b] sm:text-[13px]">{e.period}</p>
                    <p className="mt-1 text-[16px] font-semibold leading-snug text-[#1d1d1f]">{e.title}</p>
                    {e.org ? <p className="mt-0.5 text-[13px] text-[#6e6e73]">{e.org}</p> : null}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#86868b]">{copy.furtherEducation.title}</p>
              <ul className="mt-6 space-y-3 text-[14px] leading-snug text-[#6e6e73]">
                {copy.furtherEducation.entries.map((row) => (
                  <li key={row.line}>
                    {row.href ? (
                      <a href={row.href} target="_blank" rel="noreferrer" className="text-brand-900 underline-offset-2 transition-colors hover:text-brand-500 hover:underline">
                        {row.line} ↗
                      </a>
                    ) : (
                      row.line
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#86868b]">{copy.certifications.title}</p>
              <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-1 text-[13px] leading-snug text-[#6e6e73]">
                {copy.certifications.items.map((c, i) => (
                  <li key={c} className="flex items-baseline gap-1.5">
                    <span>{c}</span>
                    {i < copy.certifications.items.length - 1 ? <span className="text-[#d2d2d7]">·</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </MotionSection>

      <MotionSection id="mandate" className="scroll-mt-28 border-t border-black/[0.06] bg-white py-16 md:py-24">
        <div className="mx-auto max-w-[1068px] px-4 sm:px-6">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <Eyebrow>{copy.mandates.kicker}</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#1d1d1f]">
                {copy.mandates.title}
              </h2>
            </div>
            <div className="md:col-span-7">
              <p className="text-[16px] leading-relaxed text-[#6e6e73]">{copy.mandates.body}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {copy.mandates.bullets.map((b) => (
                  <li key={b} className="rounded-full border border-black/[0.1] bg-[#f5f5f7] px-4 py-1.5 text-[13px] text-[#424245] sm:text-[14px]">
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <a
                  href={`mailto:daniel.sengstag@abexis.ch`}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-brand-900 px-6 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[var(--brand-900-hover)]"
                >
                  Per E-Mail kontaktieren →
                </a>
                <a
                  href={`tel:${copy.contact.phone.replace(/\s/g, "")}`}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-black/[0.12] bg-white px-6 py-3 text-[14px] font-medium text-[#1d1d1f] transition-colors hover:border-brand-500 hover:text-brand-900"
                >
                  {copy.contact.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </MotionSection>

      <MotionSection className="border-t border-black/[0.06] bg-gradient-to-b from-[#f8faff] to-white py-14 md:py-18">
        <div className="mx-auto max-w-[1068px] px-4 sm:px-6">
          <div className="max-w-2xl">
            <Eyebrow>{copy.abexis.kicker}</Eyebrow>
            <h2 className="mt-3 text-[clamp(1.4rem,2.5vw,2rem)] font-semibold leading-tight tracking-[-0.02em] text-[#1d1d1f]">
              {copy.abexis.title}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[#6e6e73] sm:text-[16px]">{copy.abexis.body}</p>
          </div>
        </div>
      </MotionSection>

      <MotionSection id="kontakt" className="scroll-mt-28 border-t border-black/[0.06] py-16 md:py-24">
        <div className="mx-auto max-w-[1068px] px-4 text-center sm:px-6">
          <Eyebrow>{copy.contact.kicker}</Eyebrow>
          <h2 className="mx-auto mt-3 max-w-[18ch] text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#1d1d1f]">
            {copy.contact.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-[#6e6e73] sm:text-[16px]">{copy.contact.invite}</p>
          <div className="mx-auto mt-10 grid max-w-2xl gap-8 text-left sm:grid-cols-2 md:mt-12">
            <div className="border-t border-black/[0.08] pt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#86868b]">Telefon</p>
              <a
                href={`tel:${copy.contact.phone.replace(/\s/g, "")}`}
                className="mt-2 block text-[clamp(1.25rem,2.4vw,1.75rem)] font-semibold tracking-[-0.02em] text-[#1d1d1f] transition-colors hover:text-brand-900"
              >
                {copy.contact.phone}
              </a>
            </div>
            <div className="border-t border-black/[0.08] pt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#86868b]">E-Mail</p>
              <div className="mt-2 flex flex-col gap-1">
                {copy.contact.emails.map((e) => (
                  <a key={e.href} href={e.href} className="text-[16px] font-medium text-brand-900 transition-colors hover:underline">
                    {e.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center gap-6">
            {copy.contact.social.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-[#0077b5] px-6 py-3 text-[15px] font-medium text-white shadow-md transition-all hover:bg-[#006097] hover:shadow-lg hover:-translate-y-0.5"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5 transition-transform group-hover:scale-110"
                  aria-hidden="true"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                {s.label}
              </a>
            ))}
          </div>
          <a
            href={siteConfig.bookingUrlDe}
            className="mt-10 inline-flex min-h-[48px] items-center justify-center rounded-full bg-brand-900 px-8 text-[16px] font-medium text-white shadow-lg shadow-brand-900/25 transition-all hover:bg-[var(--brand-900-hover)] hover:shadow-xl hover:-translate-y-0.5"
            rel="noreferrer"
          >
            Termin planen
          </a>
        </div>
      </MotionSection>

    </>
  );
}
