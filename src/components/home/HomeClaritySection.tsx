import { MotionSection } from "@/components/motion/MotionSection";
import { homeClarityContent } from "@/data/home-page-content";

export function HomeClaritySection() {
  const c = homeClarityContent;
  return (
    <MotionSection className="py-20 md:py-28">
      <div className="mx-auto max-w-[1068px] px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{c.eyebrow}</p>
        <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-10">
          <div className="rounded-[24px] border border-black/[0.08] bg-[#fafbfc] p-6 sm:p-8">
            <h3 className="text-[17px] font-semibold text-[#5c5c5f]">{c.without.title}</h3>
            <ul className="mt-5 list-none space-y-2.5 text-[15px] leading-relaxed text-[#6e6e73]">
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
          <div className="rounded-[24px] border border-brand-500/20 bg-gradient-to-b from-white to-[#f0f4fa] p-6 shadow-sm sm:p-8">
            <h3 className="text-[17px] font-semibold text-[#1d1d1f]">{c.with.title}</h3>
            <ul className="mt-5 list-none space-y-2.5 text-[15px] leading-relaxed text-[#3d3d41]">
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
