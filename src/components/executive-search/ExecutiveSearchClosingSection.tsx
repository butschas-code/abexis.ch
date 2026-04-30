import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { PublicContentWidth } from "@/components/site/PublicContentWidth";
import { site } from "@/executive-search/data/search-site";

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
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href={site.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-brand-900 px-6 py-3 text-[15px] font-medium text-white shadow-sm transition-opacity hover:opacity-90"
              >
                Termin buchen
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 rounded-full border border-black/[0.12] bg-white px-6 py-3 text-[15px] font-medium text-[#1d1d1f] shadow-sm transition-colors hover:bg-[#f5f5f7]"
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
