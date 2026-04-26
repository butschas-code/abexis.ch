import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { homePrcContent } from "@/data/home-page-content";
import { siteConfig } from "@/data/pages";

export function HomePrcSection() {
  const c = homePrcContent;
  return (
    <MotionSection className="apple-animated-gradient py-20 md:py-28">
      <div className="mx-auto max-w-[1068px] px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{c.eyebrow}</p>
        <h2 className="mt-2 max-w-[32ch] text-[32px] font-semibold tracking-[-0.03em] text-[#1d1d1f] text-balance md:text-[40px]">
          {c.headline}
        </h2>
        <p className="mt-4 max-w-[60ch] text-[18px] font-medium text-[#3d3d41] sm:text-[19px]">{c.sub}</p>
        <p className="mt-6 max-w-[64ch] text-[17px] leading-relaxed text-[#6e6e73]">{c.context}</p>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="text-[15px] font-semibold text-[#1d1d1f]">{c.youGet.title}</h3>
            <ul className="mt-4 list-none space-y-2.5 text-[15px] leading-relaxed text-[#6e6e73]">
              {c.youGet.bullets.map((b) => (
                <li key={b} className="flex gap-2.5 pl-0">
                  <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-brand-900" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a1a1a6]">{c.dimensionsLabel}</p>
            <p className="mt-3 text-[16px] font-medium leading-relaxed text-[#1d1d1f]">{c.dimensions}</p>
          </div>
        </div>

        <h3 className="mt-14 text-[15px] font-semibold text-[#1d1d1f]">Pakete</h3>
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {c.packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative flex flex-col rounded-[24px] border bg-white/95 p-6 shadow-sm ring-1 ${
                "recommended" in pkg && pkg.recommended
                  ? "border-brand-500/40 ring-brand-500/20"
                  : "border-black/[0.07] ring-black/[0.04]"
              }`}
            >
              {"recommended" in pkg && pkg.recommended ? (
                <span className="absolute -top-2.5 right-4 rounded-full bg-brand-900 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                  Empfohlen
                </span>
              ) : null}
              <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-brand-900">{pkg.name}</p>
              <p className="mt-1 text-[15px] font-semibold text-[#1d1d1f]">{pkg.sub}</p>
              <p className="mt-2 text-[13px] font-medium text-[#86868b]">{pkg.duration}</p>
              <p className="mt-4 flex-1 text-[15px] leading-relaxed text-[#6e6e73]">{pkg.body}</p>
              <p className="mt-4 border-t border-black/[0.06] pt-4 text-[14px] text-[#3d3d41]">→ {pkg.outcome}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <a
            href={siteConfig.bookingUrlDe}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand-900 px-7 text-[17px] font-medium text-white shadow-lg shadow-brand-900/25 transition hover:bg-[var(--brand-900-hover)] sm:w-auto"
            rel="noreferrer"
          >
            {c.primaryCtaLabel}
          </a>
          <Link
            href={c.secondaryCta.href}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-black/[0.1] bg-white px-7 text-[17px] font-medium text-[#1d1d1f] transition hover:border-brand-500/30 hover:text-brand-900 sm:w-auto"
          >
            {c.secondaryCta.label}
          </Link>
        </div>
      </div>
    </MotionSection>
  );
}
