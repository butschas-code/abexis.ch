import Image from "next/image";
import { MotionSection } from "@/components/motion/MotionSection";
import { homeProcessContent } from "@/data/home-page-content";
import { fokusPageHeroImages } from "@/data/site-images";

export function HomeProcessSection() {
  const c = homeProcessContent;
  return (
    <MotionSection className="py-20 md:py-28">
      <div className="mx-auto grid max-w-[1068px] items-center gap-10 px-6 sm:gap-12 lg:grid-cols-[1fr_1.05fr]">
        <div className="relative aspect-[4/3] order-2 overflow-hidden rounded-[32px] bg-[#f5f5f7] shadow-[var(--apple-shadow-lg)] ring-1 ring-black/[0.05] lg:order-1">
          <Image
            src={fokusPageHeroImages.prozessoptimierung}
            alt=""
            fill
            className="object-cover saturate-[0.78] contrast-[1.08]"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
          <div className="abexis-tint-overlay" />
        </div>
        <div className="order-1 lg:order-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{c.eyebrow}</p>
          <h2 className="mt-2 text-[32px] font-semibold tracking-[-0.03em] text-[#1d1d1f] text-balance md:text-[40px]">
            {c.headline}
          </h2>
          <ol className="mt-10 space-y-8">
            {c.steps.map((step, i) => (
              <li key={step.title} className="flex gap-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5f5f7] text-[13px] font-semibold text-[#1d1d1f] ring-1 ring-black/[0.06]">
                  {i + 1}
                </span>
                <div>
                  <p className="text-[19px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">{step.title}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-[#6e6e73]">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </MotionSection>
  );
}
