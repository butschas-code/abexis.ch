import Link from "next/link";
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

export function ConfidentialMandatesNotice() {
  return (
    <section aria-labelledby="spontan-heading" className="border-b border-black/[0.06] bg-gradient-to-b from-[#f8faff] via-white to-[#fbfbfd] py-12 sm:py-14 md:py-16">
      <PublicContentWidth>
        <div className="relative overflow-hidden rounded-[1.35rem] border border-[#26337c]/12 bg-white/90 p-7 shadow-[0_16px_48px_rgba(38,51,124,0.08)] ring-1 ring-black/[0.04] sm:p-8 md:p-10">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_100%_0%,rgba(69,179,226,0.09),transparent_55%),radial-gradient(ellipse_70%_60%_at_0%_100%,rgba(38,51,124,0.06),transparent_50%)]"
            aria-hidden
          />
          <div className="relative max-w-3xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#26337c]/85">Spontanbewerbung</p>
            <h2 id="spontan-heading" className="mt-3 text-[21px] font-semibold leading-snug tracking-[-0.025em] text-[#1d1d1f] sm:text-[24px]">
              Nicht jede passende Position ist öffentlich sichtbar.
            </h2>
            <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-[#6e6e73] sm:text-[16px]">
              <p>
                Abexis SEARCH arbeitet regelmässig an vertraulichen Suchmandaten, die nicht auf der Website veröffentlicht werden. Wenn Sie offen für eine neue Führungs- oder Schlüsselposition sind, können Sie uns Ihr Profil auch ohne konkrete Vakanz übermitteln.
              </p>
              <p>
                Wir prüfen vertraulich, ob Ihr Hintergrund zu aktuellen oder künftigen Mandaten passt — insbesondere in folgenden Bereichen:
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2">
              {ROLE_AREAS.map((area) => (
                <span
                  key={area}
                  className="text-[13px] font-medium text-[#6e6e73] before:mr-2 before:text-[#b0b0b5] before:content-['·']"
                >
                  {area}
                </span>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/executive-search/vakanzen/spontanbewerbung"
                className="inline-flex items-center gap-2 rounded-full bg-brand-900 px-6 py-3 text-[15px] font-medium text-white shadow-sm transition-opacity hover:opacity-90"
              >
                Spontanbewerbung einreichen
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </PublicContentWidth>
    </section>
  );
}
