import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { PublicContentWidth } from "@/components/site/PublicContentWidth";

const ROLE_AREAS = [
  "Sales Director",
  "Projektleiter",
  "Projekt-/Programmleiter",
  "Executive Positions",
  "IT & Digitalisierung",
  "Industrie",
  "Finanzen, Banking & Risk Management",
  "Öffentlicher Sektor",
  "Beratung",
] as const;

export function SpontaneousApplicationSection() {
  return (
    <MotionSection className="border-b border-black/[0.06] bg-[#fbfbfd] py-14 sm:py-16 md:py-20">
      <PublicContentWidth>
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Spontanbewerbung</p>
          <h2 className="mt-3 text-[26px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f] sm:text-[30px] md:text-[34px]">
            Nicht jede passende Position ist öffentlich sichtbar.
          </h2>
          <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-[#6e6e73] sm:text-[17px]">
            <p>
              Abexis SEARCH arbeitet regelmässig an vertraulichen Suchmandaten, die nicht auf der Website veröffentlicht werden. Wenn Sie offen für eine neue Führungs- oder Schlüsselposition sind, können Sie uns Ihr Profil auch ohne konkrete Vakanz übermitteln.
            </p>
            <p>
              Wir prüfen vertraulich, ob Ihr Hintergrund zu aktuellen oder künftigen Mandaten passt — insbesondere in folgenden Bereichen:
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-3 gap-y-2">
            {ROLE_AREAS.map((area) => (
              <span
                key={area}
                className="text-[13px] font-medium text-[#6e6e73] before:mr-2 before:text-[#b0b0b5] before:content-['·']"
              >
                {area}
              </span>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/executive-search/vakanzen/spontanbewerbung"
              className="inline-flex items-center gap-2 rounded-full bg-brand-900 px-6 py-3 text-[15px] font-medium text-white shadow-sm transition-opacity hover:opacity-90"
            >
              Spontanbewerbung einreichen
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </PublicContentWidth>
    </MotionSection>
  );
}
