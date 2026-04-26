import { MotionSection } from "@/components/motion/MotionSection";
import { homeClarityContent } from "@/data/home-page-content";

export function HomeClaritySection() {
  const c = homeClarityContent;
  return (
    <MotionSection className="py-14 sm:py-20 md:py-28">
      <div className="mx-auto max-w-[1068px] pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:pl-6 sm:pr-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{c.eyebrow}</p>
        <div className="mt-6 grid gap-5 sm:mt-8 sm:gap-6 md:mt-10 md:grid-cols-2 md:gap-10">
          <div className="rounded-[20px] border border-black/[0.08] bg-[#fafbfc] p-5 sm:rounded-[24px] sm:p-8">
            <h3 className="text-[17px] font-semibold text-[#5c5c5f]">{c.without.title}</h3>
            <ul className="mt-4 list-none space-y-2.5 text-[14px] leading-relaxed text-[#6e6e73] sm:mt-5 sm:text-[15px]">
              {c.without.bullets.map((b) => (
                <li key={b} className="flex gap-2.5">
                  <span className="text-[#c4c4c4]" aria-hidden>
                    ·
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[20px] border border-brand-500/20 bg-gradient-to-b from-white to-[#f0f4fa] p-5 shadow-sm sm:rounded-[24px] sm:p-8">
            <h3 className="text-[17px] font-semibold text-[#1d1d1f]">{c.with.title}</h3>
            <ul className="mt-4 list-none space-y-2.5 text-[14px] leading-relaxed text-[#3d3d41] sm:mt-5 sm:text-[15px]">
              {c.with.bullets.map((b) => (
                <li key={b} className="flex gap-2.5">
                  <span className="text-brand-500" aria-hidden>
                    ✓
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
