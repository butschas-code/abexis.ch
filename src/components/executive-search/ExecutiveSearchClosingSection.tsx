"use client";

import { SearchBriefForm } from "@/components/executive-search/SearchBriefForm";
import { MotionSection } from "@/components/motion/MotionSection";
import { PublicContentWidth } from "@/components/site/PublicContentWidth";

export function ExecutiveSearchClosingSection() {
  return (
    <MotionSection>
      <section className="apple-section-mesh bg-gradient-to-b from-[#f8faff] via-white to-[#fbfbfd] py-16 sm:py-20 md:py-24">
        <PublicContentWidth>
          <div className="max-w-3xl">
            <h2 className="text-[26px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f] sm:text-[30px] md:text-[32px]">
              Sie möchten eine Führungs- oder Schlüsselposition neu besetzen?
            </h2>
            <p className="mt-6 text-[17px] leading-relaxed text-[#6e6e73]">
              Gerne besprechen wir mit Ihnen das Mandat, den Kontext und das gesuchte Profil in einem ersten vertraulichen Austausch.
              Gemeinsam klären wir, welche Persönlichkeit Ihre Organisation nicht nur ergänzt, sondern wirksam stärkt.
            </p>
            <div className="mt-10 rounded-2xl border border-black/[0.06] bg-[#fbfbfd]/90 p-5 shadow-inner sm:p-6 md:p-7">
              <SearchBriefForm id="suchmandat" />
            </div>
          </div>
        </PublicContentWidth>
      </section>
    </MotionSection>
  );
}
