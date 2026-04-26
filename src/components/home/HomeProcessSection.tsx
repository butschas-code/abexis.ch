import Image from "next/image";
import { MotionSection } from "@/components/motion/MotionSection";
import { homeProcessContent } from "@/data/home-page-content";
import { fokusPageHeroImages } from "@/data/site-images";

export function HomeProcessSection() {
  const c = homeProcessContent;
  return (
    <MotionSection className="py-14 sm:py-20 md:py-28">
      <div className="mx-auto grid max-w-[1068px] items-center gap-8 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:gap-10 sm:pl-6 sm:pr-6 md:gap-12 lg:grid-cols-[1fr_1.05fr]">
        <div className="relative aspect-[4/3] order-2 overflow-hidden rounded-[22px] bg-[#f5f5f7] shadow-[var(--apple-shadow-lg)] ring-1 ring-black/[0.05] sm:rounded-[28px] lg:order-1 lg:rounded-[32px]">
          <Image
            src={fokusPageHeroImages.prozessoptimierung}
            alt=""
            fill
            className="object-cover saturate-[0.78] contrast-[1.08]"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
          <div className="abexis-tint-overlay" />
        </div>
        <div className="order-1 min-w-0 lg:order-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{c.eyebrow}</p>
          <h2 className="mt-2 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-[#1d1d1f] text-balance sm:text-[32px] md:text-[40px]">
            {c.headline}
          </h2>
          <ol className="mt-8 space-y-6 sm:mt-10 sm:space-y-8">
            {c.steps.map((step, i) => (
              <li key={step.title} className="flex gap-3.5 sm:gap-5">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f5f5f7] text-[12px] font-semibold text-[#1d1d1f] ring-1 ring-black/[0.06] sm:h-9 sm:w-9 sm:text-[13px]">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-[17px] font-semibold leading-snug tracking-[-0.02em] text-[#1d1d1f] sm:text-[19px]">{step.title}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-[#6e6e73] sm:text-[15px]">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </MotionSection>
  );
}
