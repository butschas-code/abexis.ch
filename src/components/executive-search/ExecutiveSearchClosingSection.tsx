"use client";

import Link from "next/link";
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
              Gerne besprechen wir mit Ihnen das Mandat, den Kontext und das gesuchte Profil in einem ersten vertraulichen
              Austausch. Gemeinsam klären wir, welche Persönlichkeit Ihre Organisation nicht nur ergänzt, sondern
              wirksam stärkt.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                href="/kontakt"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brand-900 px-7 text-[17px] font-medium text-white shadow-lg shadow-brand-900/35 transition-all duration-200 ease-out hover:bg-[var(--brand-900-hover)] hover:shadow-xl sm:w-auto sm:min-h-[48px] sm:px-8"
              >
                Suchmandat anfragen
              </Link>
              <Link
                href="/kontakt"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-black/[0.12] bg-white px-7 text-[17px] font-medium text-[#1d1d1f] shadow-sm transition-all duration-200 ease-out hover:border-brand-500/40 hover:bg-[#fbfbfd] sm:w-auto sm:min-h-[48px] sm:px-8"
              >
                Kontakt aufnehmen
              </Link>
            </div>
          </div>
        </PublicContentWidth>
      </section>
    </MotionSection>
  );
}
