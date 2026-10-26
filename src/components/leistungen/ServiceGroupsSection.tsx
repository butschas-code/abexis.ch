import Link from "next/link";
import { LeistungenBentoGrid } from "@/components/leistungen/LeistungenBentoGrid";
import { MotionSection } from "@/components/motion/MotionSection";
import { getServiceGroupsContent, type ServiceGroupsLocale } from "@/data/service-groups";

/** Homepage services: same grouped image cards as the Leistungen page (client feedback, Oct 2026). */
export function ServiceGroupsSection({ locale = "de", id }: { locale?: ServiceGroupsLocale; id?: string }) {
  const c = getServiceGroupsContent(locale).services;

  return (
    <MotionSection className="scroll-mt-24 bg-white" id={id}>
      <div className="mx-auto max-w-[1068px] px-5 py-16 sm:px-6 md:py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[640px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{c.eyebrow}</p>
            <h2 className="mt-3 text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f] text-balance md:text-[44px]">
              {c.title}
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-[#6e6e73] md:text-[18px]">{c.intro}</p>
          </div>
          <Link href={c.allHref} className="inline-flex min-h-11 shrink-0 items-center font-semibold text-[#26337c] hover:text-[#3550a4]">
            {c.allLabel} ↗
          </Link>
        </div>

        <div className="mt-12 md:mt-16">
          <LeistungenBentoGrid locale={locale} moreLabel={locale === "en" ? "Learn more" : "Mehr erfahren"} headingLevel="h3" />
        </div>
      </div>
    </MotionSection>
  );
}
