import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { RisikomanagementFaqList } from "@/components/public-site/RisikomanagementFaqList";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { HeroHeadlineBrandAccent } from "@/components/site/HeroHeadlineBrandAccent";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { siteConfig } from "@/data/pages";
import { getVmoContent, type VmoLocale } from "@/data/vmo-content";

const toneClass = {
  red: "bg-[#fdecec] text-[#b42318]",
  yellow: "bg-[#fdf4dc] text-[#8a5a00]",
  green: "bg-[#e7f6ee] text-[#17663a]",
} as const;

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

function mailtoFor(subject: string) {
  return `mailto:${siteConfig.emailPrimary}?subject=${encodeURIComponent(subject)}`;
}

export function FokusVirtualManagementOffice({ locale = "de" }: { locale?: VmoLocale }) {
  const c = getVmoContent(locale);
  const english = locale === "en";
  const path = english ? "/en/fokusthemen/virtual-management-office" : "/fokusthemen/virtual-management-office";
  const homePath = english ? "/en/home" : "/";
  const servicesPath = english ? "/en/leistungen" : "/leistungen";
  const contactPath = english ? "/en/kontakt" : "/kontakt";
  const bookingUrl = english ? siteConfig.bookingUrlEn : siteConfig.bookingUrlDe;

  return (
    <div lang={english ? "en" : "de"}>
      <InteriorPageRoot>
        <SchemaMarkup
          type="Service"
          path={path}
          data={c.meta}
          faqItems={c.faq.items}
          breadcrumbs={[
            { name: c.breadcrumbs.home, url: homePath },
            { name: c.breadcrumbs.services, url: servicesPath },
            { name: c.breadcrumbs.current, url: path },
          ]}
        />

        {/* Dark hero instead of PageHero: the client's VMO artwork carries baked-in text, so the hero shows the board illustration from the brief. */}
        <section className="relative isolate overflow-hidden bg-[#151d52] pb-16 pt-28 md:pb-24 md:pt-36">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_85%_10%,rgba(69,179,226,0.22),transparent_60%),radial-gradient(ellipse_60%_60%_at_0%_100%,rgba(58,104,184,0.25),transparent_60%)]"
          />
          <div className="mx-auto grid max-w-[1068px] items-center gap-12 px-5 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">{c.hero.eyebrow}</p>
              <h1 className="mt-4 text-[clamp(1.9rem,5vw+0.4rem,3.1rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-white text-balance">
                {c.hero.titleLines[0]}
                <br />
                <HeroHeadlineBrandAccent>{c.hero.titleLines[1]}</HeroHeadlineBrandAccent>
              </h1>
              <p className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-white/80 sm:text-[19px]">{c.hero.body}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#45b3e2] px-7 text-sm font-semibold text-[#0f1640] transition hover:bg-[#6cc4ea]"
                >
                  {c.hero.primaryCta} ↗
                </a>
                <Link
                  href="#modelle"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-7 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  {c.hero.secondaryCta} ↓
                </Link>
              </div>
              <p className="mt-6 text-[14px] font-medium text-white/55">{c.hero.note}</p>
            </div>

            <aside aria-label={c.board.ariaLabel} className="overflow-hidden rounded-[24px] bg-white shadow-[0_40px_100px_rgba(0,0,0,0.35)]">
              <div className="flex items-center justify-between border-b border-black/[0.06] px-6 py-4">
                <span className="text-[11px] font-bold tracking-[0.18em] text-[#26337c]">{c.board.brand}</span>
                <span className="rounded-full bg-[#eef2fb] px-3 py-1 text-[11px] font-semibold text-[#26337c]">{c.board.tag}</span>
              </div>
              <div className="px-6 py-6">
                <p className="text-[22px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">{c.board.title}</p>
                <p className="mt-1 text-[13px] text-[#86868b]">{c.board.sub}</p>
                <ul className="mt-5 divide-y divide-black/[0.06] border-y border-black/[0.06]">
                  {c.board.rows.map((row) => (
                    <li key={row.label} className="flex flex-wrap items-center justify-between gap-2 py-3.5">
                      <strong className="text-[14px] font-semibold text-[#1d1d1f]">{row.label}</strong>
                      <span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${toneClass[row.tone as keyof typeof toneClass]}`}>
                        {row.status}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 rounded-[16px] bg-[#f5f6fa] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#26337c]">{c.board.decisionLabel}</p>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#3d3d41]">{c.board.decision}</p>
                </div>
              </div>
              <p className="border-t border-black/[0.06] px-6 py-3 text-[11px] text-[#a1a1a6]">{c.board.caption}</p>
            </aside>
          </div>
        </section>

        <section className="border-b border-black/[0.06] bg-white">
          <div className="mx-auto max-w-[1068px] px-5 py-12 sm:px-6 md:py-16">
            <p className="max-w-[62ch] text-[19px] leading-relaxed text-[#3d3d41] md:text-[22px]">{c.intro}</p>
            <nav aria-label={c.localNav.ariaLabel} className="mt-8 flex flex-wrap gap-2">
              {c.localNav.items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="inline-flex min-h-10 items-center rounded-full border border-black/[0.08] px-4 text-[13px] font-medium text-[#3d3d41] transition hover:border-[#26337c]/30 hover:text-[#26337c]"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </section>

        <MotionSection className="scroll-mt-24 bg-white" id="bedarf">
          <div className="mx-auto grid max-w-[1068px] gap-10 px-5 py-16 sm:px-6 md:grid-cols-[0.9fr_1.1fr] md:gap-16 md:py-24">
            <div>
              <SectionHeading eyebrow={c.need.eyebrow} title={c.need.title} />
              <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-[#6e6e73]">
                {c.need.paragraphs.map((p) => <p key={p}>{p}</p>)}
              </div>
              <a href="#modelle" className="mt-6 inline-flex min-h-11 items-center font-semibold text-[#26337c] hover:text-[#3550a4]">
                {c.need.link} →
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {c.need.situations.map((s, i) => (
                <article key={s.title} className="rounded-[20px] border border-black/[0.07] bg-[#fbfbfd] p-6">
                  <span className="text-[12px] font-semibold tabular-nums text-[#45b3e2]">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 text-[18px] font-semibold leading-snug tracking-[-0.015em] text-[#1d1d1f]">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#6e6e73]">{s.body}</p>
                </article>
              ))}
            </div>
          </div>
        </MotionSection>

        <section className="bg-[#26337c]">
          <div className="mx-auto max-w-[1068px] px-5 py-14 sm:px-6 md:py-20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">{c.principle.label}</p>
            <p className="mt-4 max-w-[34ch] text-[26px] font-semibold leading-snug tracking-[-0.025em] text-white md:text-[34px]">{c.principle.text}</p>
          </div>
        </section>

        <MotionSection className="scroll-mt-24 bg-[#f5f6fa]" id="leistung">
          <div className="mx-auto grid max-w-[1068px] gap-10 px-5 py-16 sm:px-6 md:grid-cols-[0.85fr_1.15fr] md:gap-16 md:py-24">
            <div>
              <SectionHeading eyebrow={c.modules.eyebrow} title={c.modules.title} />
              <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-[#6e6e73]">
                {c.modules.paragraphs.map((p) => <p key={p}>{p}</p>)}
              </div>
            </div>
            <div className="rounded-[22px] bg-white px-6 shadow-[0_12px_40px_rgba(38,51,124,0.06)] sm:px-8">
              {c.modules.items.map((m, i) => (
                <details key={m.title} open={i === 0} className="group border-b border-black/[0.06] last:border-0">
                  <summary className="flex cursor-pointer list-none items-center gap-4 py-5 [&::-webkit-details-marker]:hidden">
                    <span className="text-[12px] font-semibold tabular-nums text-[#45b3e2]">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 text-[17px] font-semibold tracking-[-0.015em] text-[#1d1d1f]">{m.title}</span>
                    <span className="text-[18px] leading-none text-[#86868b] transition group-open:rotate-45" aria-hidden>+</span>
                  </summary>
                  <div className="pb-6 pl-8">
                    <p className="text-[15px] leading-relaxed text-[#6e6e73]">{m.body}</p>
                    <p className="mt-4 rounded-[12px] bg-[#f5f6fa] px-4 py-3 text-[13px] leading-relaxed text-[#3d3d41]">{m.fields}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </MotionSection>

        <MotionSection className="bg-white" id="cockpit">
          <div className="mx-auto grid max-w-[1068px] items-center gap-10 px-5 py-16 sm:px-6 md:grid-cols-2 md:gap-16 md:py-24">
            <div className="order-2 rounded-[24px] border border-black/[0.07] bg-[#fbfbfd] p-6 shadow-[0_24px_60px_rgba(38,51,124,0.08)] sm:p-8 md:order-1">
              <div className="flex items-baseline justify-between gap-4 border-b border-black/[0.08] pb-4">
                <h3 className="text-[17px] font-semibold tracking-[-0.015em] text-[#1d1d1f]">{c.cockpit.sheetTitle}</h3>
                <span className="text-[11px] font-medium text-[#a1a1a6]">{c.cockpit.sheetTag}</span>
              </div>
              {c.cockpit.groups.map((g) => (
                <div key={g.label} className="mt-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#26337c]">{g.label}</p>
                  {g.lines.map((line) => (
                    <div key={line.label} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-black/[0.05] py-2.5">
                      <strong className="text-[14px] font-semibold text-[#1d1d1f]">{line.label}</strong>
                      <span className="text-[13px] text-[#6e6e73]">{line.value}</span>
                    </div>
                  ))}
                </div>
              ))}
              <p className="mt-6 rounded-[14px] bg-[#26337c] px-4 py-3.5 text-[14px] font-semibold text-white">{c.cockpit.question}</p>
              <p className="mt-4 text-[12px] leading-relaxed text-[#a1a1a6]">{c.cockpit.sheetNote}</p>
            </div>
            <div className="order-1 md:order-2">
              <SectionHeading eyebrow={c.cockpit.eyebrow} title={c.cockpit.title} intro={c.cockpit.body} />
              <ul className="mt-8 space-y-5">
                {c.cockpit.benefits.map((b) => (
                  <li key={b.title} className="border-l-2 border-[#45b3e2] pl-4">
                    <p className="text-[16px] font-semibold text-[#1d1d1f]">{b.title}</p>
                    <p className="mt-1 text-[15px] leading-relaxed text-[#6e6e73]">{b.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </MotionSection>

        <MotionSection className="scroll-mt-24 bg-[#f5f6fa]" id="modelle">
          <div className="mx-auto max-w-[1068px] px-5 py-16 sm:px-6 md:py-24">
            <SectionHeading eyebrow={c.models.eyebrow} title={c.models.title} intro={c.models.intro} />
            <div className="mt-10 grid gap-5 md:mt-14 lg:grid-cols-3">
              {c.models.items.map((m) => (
                <article
                  key={m.name}
                  className={`flex flex-col rounded-[24px] p-7 sm:p-8 ${
                    m.featured
                      ? "bg-[#151d52] text-white shadow-[0_24px_60px_rgba(21,29,82,0.25)]"
                      : "border border-black/[0.07] bg-white"
                  }`}
                >
                  <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${m.featured ? "text-[#45b3e2]" : "text-[#26337c]"}`}>{m.name}</p>
                  <h3 className={`mt-3 text-[24px] font-semibold tracking-[-0.025em] ${m.featured ? "text-white" : "text-[#1d1d1f]"}`}>{m.title}</h3>
                  <p className={`mt-2 text-[14px] font-semibold ${m.featured ? "text-white/70" : "text-[#26337c]"}`}>{m.volume}</p>
                  <p className={`mt-4 text-[15px] leading-relaxed ${m.featured ? "text-white/70" : "text-[#6e6e73]"}`}>{m.body}</p>
                  <ul className={`mt-6 flex-1 space-y-2.5 border-t pt-6 text-[14px] leading-relaxed ${m.featured ? "border-white/15 text-white/85" : "border-black/[0.07] text-[#3d3d41]"}`}>
                    {m.bullets.map((b) => (
                      <li key={b} className="flex gap-2.5">
                        <span className={`mt-2 h-1 w-1 shrink-0 rounded-full ${m.featured ? "bg-[#45b3e2]" : "bg-[#26337c]"}`} />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={mailtoFor(`${c.models.mailSubjectPrefix} ${m.name}`)}
                    className={`mt-8 inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-semibold transition ${
                      m.featured
                        ? "bg-white text-[#26337c] hover:bg-[#eef2fb]"
                        : "border border-[#26337c]/20 text-[#26337c] hover:border-[#26337c]/40 hover:bg-[#f7f8fc]"
                    }`}
                  >
                    {m.cta} ↗
                  </a>
                </article>
              ))}
            </div>
            <p className="mt-8 max-w-[80ch] text-[13px] leading-relaxed text-[#86868b]">{c.models.finePrint}</p>
          </div>
        </MotionSection>

        <MotionSection className="bg-white" id="rolle">
          <div className="mx-auto grid max-w-[1068px] gap-10 px-5 py-16 sm:px-6 md:grid-cols-2 md:gap-16 md:py-24">
            <div>
              <SectionHeading eyebrow={c.role.eyebrow} title={c.role.title} />
              <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-[#6e6e73]">
                {c.role.paragraphs.map((p) => <p key={p}>{p}</p>)}
              </div>
            </div>
            <ul className="divide-y divide-black/[0.07] border-y border-black/[0.07]">
              {c.role.points.map((p) => (
                <li key={p.title} className="py-5">
                  <p className="text-[17px] font-semibold tracking-[-0.015em] text-[#1d1d1f]">{p.title}</p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-[#6e6e73]">{p.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </MotionSection>

        <MotionSection className="scroll-mt-24 bg-[#f5f6fa]" id="setup">
          <div className="mx-auto max-w-[1068px] px-5 py-16 sm:px-6 md:py-24">
            <SectionHeading eyebrow={c.setup.eyebrow} title={c.setup.title} intro={c.setup.intro} />
            <ol className="mt-10 grid gap-5 md:mt-14 md:grid-cols-4">
              {c.setup.steps.map((step, i) => (
                <li key={step.title} className="rounded-[20px] border border-black/[0.07] bg-white p-6">
                  <span className="text-[12px] font-semibold text-[#45b3e2]">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-4 text-[18px] font-semibold leading-snug tracking-[-0.02em] text-[#1d1d1f]">{step.title}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-[#6e6e73]">{step.body}</p>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-col gap-5 rounded-[22px] bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <p className="max-w-[60ch] text-[16px] leading-relaxed text-[#3d3d41]">{c.setup.bottom}</p>
              <a
                href={bookingUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-[#26337c] px-7 text-sm font-semibold text-white transition hover:bg-[#3550a4]"
              >
                {c.setup.cta} ↗
              </a>
            </div>
          </div>
        </MotionSection>

        <MotionSection className="scroll-mt-24 bg-white" id="fragen">
          <div className="mx-auto grid max-w-[1068px] gap-8 px-5 py-16 sm:px-6 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:py-24">
            <SectionHeading eyebrow={c.faq.eyebrow} title={c.faq.title} intro={c.faq.intro} />
            <div className="rounded-[22px] bg-[#fbfbfd] px-6 ring-1 ring-black/[0.05] sm:px-8">
              <RisikomanagementFaqList items={c.faq.items} />
            </div>
          </div>
        </MotionSection>

        <MotionSection className="bg-[#26337c]" id="kontakt">
          <div className="mx-auto max-w-[1068px] px-5 py-16 sm:px-6 md:py-24">
            <SectionHeading eyebrow={c.closing.eyebrow} title={c.closing.title} intro={c.closing.body} light />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a href={bookingUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-[#26337c] transition hover:bg-[#eef2fb]">
                {c.closing.primaryCta} ↗
              </a>
              <Link href={contactPath} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-7 text-sm font-semibold text-white transition hover:bg-white/10">
                {c.closing.secondaryCta}
              </Link>
              <a href={`tel:${siteConfig.phoneTel}`} className="inline-flex min-h-12 items-center justify-center px-3 text-sm font-semibold text-white/80 hover:text-white">
                {siteConfig.phoneDisplay}
              </a>
            </div>
          </div>
        </MotionSection>
      </InteriorPageRoot>
    </div>
  );
}
