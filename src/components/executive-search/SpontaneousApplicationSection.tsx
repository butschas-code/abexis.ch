"use client";

import { MotionSection } from "@/components/motion/MotionSection";
import { VacancyApplicationForm } from "@/components/executive-search/VacancyApplicationForm";
import { PublicContentWidth } from "@/components/site/PublicContentWidth";
import type { PublishedVacancy } from "@/public-site/cms/vacancy";

const CHIPS = [
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

type Props = {
  cmsVacancy: PublishedVacancy | null;
  /** Keep ids unique when this block appears on multiple routes (e.g. Executive Search + Vakanzen). */
  applicationFormIdPrefix?: string;
};

export function SpontaneousApplicationSection({ cmsVacancy, applicationFormIdPrefix = "spontan-search-home" }: Props) {
  const vacancyId = cmsVacancy?.slug?.trim() || "spontan";
  const vacancyTitle = cmsVacancy?.title?.trim() || "Spontanbewerbung";

  return (
    <MotionSection className="border-b border-black/[0.06] bg-[#fbfbfd] py-14 sm:py-16 md:py-20">
      <PublicContentWidth>
        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,420px)] lg:gap-14 lg:items-start">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Spontanbewerbung</p>
            <h2 className="mt-3 max-w-[40ch] text-[26px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f] sm:text-[30px] md:text-[34px]">
              Nicht jede passende Position ist öffentlich sichtbar.
            </h2>
            <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-[#6e6e73] sm:text-[17px]">
              <p>
                Abexis SEARCH arbeitet regelmässig an vertraulichen Suchmandaten, die nicht auf der Website veröffentlicht werden. Wenn Sie offen für eine neue Führungs- oder Schlüsselposition sind, können Sie uns Ihr Profil auch ohne konkrete Vakanz übermitteln.
              </p>
              <p>
                Wir prüfen vertraulich, ob Ihr Hintergrund zu aktuellen oder künftigen Mandaten passt — insbesondere in Rollen wie Sales Director, Projektleiter, Projekt-/Programmleiter oder Executive Positions.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {CHIPS.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center rounded-full border border-black/[0.06] bg-white px-3 py-1.5 text-[12px] font-medium leading-snug text-[#3c3c43] shadow-[0_1px_2px_rgba(38,51,124,0.06)] sm:text-[13px]"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div id="spontanbewerbung-form" className="min-w-0 scroll-mt-28">
            <VacancyApplicationForm
              vacancyId={vacancyId}
              vacancyTitle={vacancyTitle}
              jobType="spontanbewerbung"
              isSpontaneous
              heading="Spontanbewerbung"
              intro="Übermitteln Sie uns Ihr Profil vertraulich. Wir prüfen, ob Ihr Hintergrund zu aktuellen oder künftigen verdeckten Mandaten passt."
              submitButtonLabel="Spontanbewerbung einreichen"
              formIdPrefix={applicationFormIdPrefix}
            />
          </div>
        </div>
      </PublicContentWidth>
    </MotionSection>
  );
}
