import type { Metadata } from "next";
import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { SectionShell } from "@/components/executive-search/SectionShell";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { PageHero } from "@/components/site/PageHero";
import { vacancies } from "@/executive-search/data/search-site";
import { unsplash } from "@/executive-search/lib/images/unsplash";

export const metadata: Metadata = {
  title: "Vakanzen",
  description: vacancies.titleLines.join(" "),
  openGraph: {
    title: "Vakanzen | Executive Search | Abexis",
    description: vacancies.titleLines.join(" "),
  },
};

export default function ExecutiveSearchVakanzenPage() {
  return (
    <InteriorPageRoot>
      <SchemaMarkup
        type="BreadcrumbList"
        data={[
          { name: "Startseite", url: "/" },
          { name: "Executive Search", url: "/executive-search" },
          { name: "Vakanzen", url: "/executive-search/vakanzen" },
        ]}
      />
      <PageHero imageSrc={unsplash.vakanzen} priority>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">Aktuelles Mandat</p>
        <h1 className="mt-3 max-w-[32ch] text-[clamp(1.875rem,6vw+0.65rem,2.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-white text-balance sm:text-[40px] sm:leading-[1.05] md:max-w-[40ch] md:text-[56px] md:leading-[1.02]">
          Vakanzen
        </h1>
        <p className="mt-6 max-w-3xl text-[17px] font-normal leading-relaxed text-white/88 sm:text-[19px] md:text-[21px]">
          {vacancies.titleLines.join(" ")}
        </p>
        <p className="mt-4 max-w-2xl text-[17px] font-normal leading-relaxed text-white/82 sm:text-[19px]">
          {vacancies.hook} {vacancies.hookFollow}
        </p>
      </PageHero>

      <MotionSection>
        <SectionShell eyebrow="Aktuelles Mandat" title="Ausgangslage">
          {vacancies.intro.map((p, i) => (
            <p
              key={p.slice(0, 24)}
              className={`max-w-3xl text-[17px] leading-relaxed text-[#6e6e73] ${i > 0 ? "mt-6" : ""}`}
            >
              {p}
            </p>
          ))}
        </SectionShell>
      </MotionSection>

      <MotionSection>
        <SectionShell title={vacancies.roleHeading} density="tight">
          <p className="text-[17px] text-[#6e6e73]">{vacancies.roleLead}</p>
          <p className="mt-2 font-semibold text-[#1d1d1f]">{vacancies.roleSub}</p>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#86868b]">{vacancies.roleBulletsIntro}</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-[15px] text-[#6e6e73]">
            {vacancies.roleBullets.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </SectionShell>
      </MotionSection>

      <MotionSection>
        <SectionShell title={vacancies.requirementsHeading} density="tight">
          <ul className="list-disc space-y-1 pl-5 text-[15px] text-[#6e6e73]">
            {vacancies.requirements.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </SectionShell>
      </MotionSection>

      <MotionSection>
        <SectionShell title={vacancies.offerHeading} density="tight">
          <ul className="list-disc space-y-1 pl-5 text-[15px] text-[#6e6e73]">
            {vacancies.offer.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </SectionShell>
      </MotionSection>

      <MotionSection>
        <SectionShell title={vacancies.whyHeading} density="tight">
          {vacancies.why.map((p) => (
            <p key={p} className="max-w-3xl text-[17px] leading-relaxed text-[#6e6e73]">
              {p}
            </p>
          ))}
          <div className="mt-8 rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">Stellenbeschrieb (PDF)</p>
            <a
              href={vacancies.pdfUrl}
              className="mt-2 inline-flex text-[15px] font-medium text-brand-900 underline-offset-4 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {vacancies.pdfLabel}
            </a>
          </div>
          <p className="mt-8 max-w-3xl text-[15px] text-[#6e6e73]">{vacancies.apply}</p>
          <p className="mt-4 text-[15px]">
            <Link href="/kontakt" className="font-medium text-brand-900 underline-offset-4 hover:underline">
              Kontaktformular
            </Link>
          </p>
        </SectionShell>
      </MotionSection>
    </InteriorPageRoot>
  );
}
