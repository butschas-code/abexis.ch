"use client";

import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";

export function HeroPanel({
  title,
  subtitle,
  mainLead,
  supportingLead = "",
  eyebrow = "",
  imageSrc,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  title: string;
  subtitle: string;
  mainLead: string;
  supportingLead?: string;
  eyebrow?: string;
  imageSrc: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}) {
  return (
    <PageHero imageSrc={imageSrc} priority>
      {eyebrow ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">{eyebrow}</p>
      ) : null}
      <h1
        className={`max-w-[32ch] text-[clamp(1.875rem,6vw+0.65rem,2.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-white text-balance sm:text-[40px] sm:leading-[1.05] md:max-w-[40ch] md:text-[56px] md:leading-[1.02] ${eyebrow ? "mt-3" : ""}`}
      >
        {title}
      </h1>
      <p className="mt-6 max-w-xl text-pretty text-[17px] font-medium leading-relaxed text-white/88 sm:text-[19px] md:text-[21px]">
        {subtitle}
      </p>
      <div className="mt-5 max-w-[min(100%,42rem)] rounded-3xl border border-white/25 bg-white/[0.12] px-6 py-6 shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-2xl backdrop-saturate-150 sm:mt-6 sm:px-8 sm:py-7 md:max-w-[54ch] md:py-8">
        <p className="text-pretty text-[16px] font-normal leading-[1.72] tracking-[-0.01em] text-white sm:text-[17px] md:text-[18px] md:leading-[1.75]">
          {mainLead}
        </p>
        {supportingLead ? (
          <p className="mt-4 text-pretty text-[15px] font-normal leading-[1.72] tracking-[-0.008em] text-white/85 sm:mt-5 sm:text-[16px] md:text-[17px] md:leading-[1.75]">
            {supportingLead}
          </p>
        ) : null}
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        <Link
          href={primaryHref}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand-900 px-7 text-[17px] font-medium text-white shadow-lg shadow-brand-900/35 transition-all duration-200 ease-out hover:bg-[var(--brand-900-hover)] hover:shadow-xl hover:shadow-brand-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] sm:w-auto sm:min-h-[48px] sm:px-8"
        >
          {primaryLabel}
        </Link>
        <Link
          href={secondaryHref}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/35 bg-white/10 px-7 text-[17px] font-medium text-white backdrop-blur-sm transition-all duration-200 ease-out hover:border-white/60 hover:bg-white/22 hover:shadow-lg hover:shadow-black/15 hover:-translate-y-0.5 active:translate-y-0 sm:w-auto sm:min-h-[48px] sm:px-8"
        >
          {secondaryLabel}
        </Link>
      </div>
    </PageHero>
  );
}
