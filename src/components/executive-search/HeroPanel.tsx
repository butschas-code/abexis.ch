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
    <PageHero
      imageSrc={imageSrc}
      priority
      intro={
        <div className="space-y-4">
          <p className="font-medium text-[#1d1d1f]">{subtitle}</p>
          <p>{mainLead}</p>
          {supportingLead ? <p className="text-[16px] text-[#6e6e73] md:text-[17px]">{supportingLead}</p> : null}
        </div>
      }
      actions={
        <>
          <Link
            href={primaryHref}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand-900 px-7 text-[17px] font-medium text-white shadow-lg shadow-brand-900/25 transition-all duration-200 ease-out hover:bg-[var(--brand-900-hover)] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] sm:w-auto sm:min-h-[48px] sm:px-8"
          >
            {primaryLabel}
          </Link>
          <Link
            href={secondaryHref}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#26337c]/20 px-7 text-[17px] font-medium text-[#26337c] transition-all duration-200 ease-out hover:border-[#26337c]/40 hover:bg-[#f7f8fc] hover:-translate-y-0.5 active:translate-y-0 sm:w-auto sm:min-h-[48px] sm:px-8"
          >
            {secondaryLabel}
          </Link>
        </>
      }
    >
      {eyebrow ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">{eyebrow}</p>
      ) : null}
      <h1
        className={`max-w-[32ch] text-[clamp(1.875rem,6vw+0.65rem,2.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-white text-balance sm:text-[40px] sm:leading-[1.05] md:max-w-[40ch] md:text-[56px] md:leading-[1.02] ${eyebrow ? "mt-3" : ""}`}
      >
        {title}
      </h1>
    </PageHero>
  );
}
