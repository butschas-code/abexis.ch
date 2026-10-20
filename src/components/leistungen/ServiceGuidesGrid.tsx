import Link from "next/link";
import { getAllServiceGuides, type ServiceGuideLocale } from "@/data/service-guide-pages";

export function ServiceGuidesGrid({ locale }: { locale: ServiceGuideLocale }) {
  const english = locale === "en";
  return (
    <section className="border-t border-black/[0.06] bg-white">
      <div className="mx-auto max-w-[1140px] px-5 py-16 sm:px-6 md:py-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{english ? "Decision guides" : "Entscheidungshilfen"}</p>
        <h2 className="mt-3 max-w-[22ch] text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f] md:text-[44px]">{english ? "Practical answers before the next important decision." : "Praxisnahe Antworten vor der nächsten wichtigen Entscheidung."}</h2>
        <p className="mt-5 max-w-[70ch] text-[17px] leading-relaxed text-[#6e6e73]">{english ? "Concise guidance on strategy, transformation, projects, processes, risk, sales and executive appointments." : "Kompakte Orientierung zu Strategie, Transformation, Projekten, Prozessen, Risiken, Vertrieb und Schlüsselbesetzungen."}</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {getAllServiceGuides(locale).map((guide) => {
            const href = guide.parent === "executive-search" ? `${english ? "/en" : ""}/executive-search/${guide.slug}` : `${english ? "/en" : ""}/fokusthemen/${guide.parent}/${guide.slug}`;
            return <Link key={guide.parent} href={href} className="group flex min-h-[190px] flex-col rounded-[20px] border border-black/[0.07] bg-[#fbfbfd] p-6 transition hover:-translate-y-0.5 hover:border-[#26337c]/20 hover:shadow-[0_12px_32px_rgba(38,51,124,0.08)]"><h3 className="text-[18px] font-semibold leading-snug tracking-[-0.02em] text-[#1d1d1f] group-hover:text-[#26337c]">{guide.meta.title}</h3><p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-[#6e6e73]">{guide.meta.excerpt}</p><span className="mt-auto pt-4 text-sm font-semibold text-[#26337c]">{english ? "Read guide" : "Ratgeber lesen"} →</span></Link>;
          })}
        </div>
      </div>
    </section>
  );
}
