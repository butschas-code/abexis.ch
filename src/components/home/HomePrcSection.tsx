import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { homePrcContent } from "@/data/home-page-content";
import { siteConfig } from "@/data/pages";

export function HomePrcSection() {
  const c = homePrcContent;
  return (
    <MotionSection className="apple-animated-gradient relative isolate overflow-x-hidden py-14 sm:py-20 md:py-28">
      <div className="mx-auto min-w-0 max-w-[1068px] pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:pl-6 sm:pr-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{c.eyebrow}</p>
        <h2 className="mt-2 max-w-full text-balance break-words text-[28px] font-semibold leading-none tracking-[-0.03em] text-[#1d1d1f] hyphens-auto sm:max-w-[32ch] sm:text-[32px] md:text-[40px]">
          {c.headline}
        </h2>
        <p className="mt-3 max-w-[60ch] text-[17px] font-medium text-[#3d3d41] sm:mt-4 sm:text-[18px] md:text-[19px]">{c.sub}</p>
        <p className="mt-5 max-w-[64ch] text-[16px] leading-relaxed text-[#6e6e73] sm:mt-6 sm:text-[17px]">{c.context}</p>

        <div className="mt-8 grid gap-8 sm:mt-12 sm:gap-10 lg:grid-cols-2">
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
            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              {c.dimensions.split(" · ").map((dim) => (
                <div key={dim} className="border-t border-brand-900/20 pt-3">
                  <dt className="text-[13px] font-semibold tracking-[0.04em] text-[#3d3d41]">{dim}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <h3 className="mt-10 text-[15px] font-semibold text-[#1d1d1f] sm:mt-14">Pakete</h3>
        <div className="mt-5 grid gap-4 sm:mt-6 sm:gap-5 lg:grid-cols-3">
          {c.packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative flex flex-col rounded-[20px] border bg-white/95 p-5 shadow-sm ring-1 sm:rounded-[24px] sm:p-6 ${
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
              <p className="mt-4 border-t border-black/[0.06] pt-4 text-[14px] leading-snug text-[#3d3d41] break-words">
                → {pkg.outcome}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <a
            href={siteConfig.bookingUrlDe}
            className="inline-flex min-h-[48px] w-full touch-manipulation items-center justify-center rounded-full bg-brand-900 px-6 text-[16px] font-medium text-white shadow-lg shadow-brand-900/25 transition hover:bg-[var(--brand-900-hover)] active:scale-[0.99] sm:w-auto sm:px-7 sm:text-[17px]"
            rel="noreferrer"
          >
            {c.primaryCtaLabel}
          </a>
          <Link
            href={c.secondaryCta.href}
            className="inline-flex min-h-[48px] w-full touch-manipulation items-center justify-center rounded-full border border-black/[0.1] bg-white px-6 text-[16px] font-medium text-[#1d1d1f] transition hover:border-brand-500/30 hover:text-brand-900 active:scale-[0.99] sm:w-auto sm:px-7 sm:text-[17px]"
          >
            {c.secondaryCta.label}
          </Link>
        </div>
      </div>
    </MotionSection>
  );
}
