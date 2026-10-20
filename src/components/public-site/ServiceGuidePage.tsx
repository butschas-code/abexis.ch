import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { RisikomanagementFaqList } from "@/components/public-site/RisikomanagementFaqList";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { HeroHeadlineText } from "@/components/site/HeroHeadlineBrandAccent";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { PageHero } from "@/components/site/PageHero";
import { type ServiceGuideLocale, type ServiceGuidePage as Guide, getAllServiceGuides } from "@/data/service-guide-pages";
import { siteConfig } from "@/data/pages";
import { executiveSearchHeroImage, fokusPageHeroImages } from "@/data/site-images";
import { guideHubPath, guidePath } from "@/lib/seo/guide-routes";

const parentLabels: Record<string, { de: string; en: string }> = {
  "digitale-transformation": { de: "Digitale Transformation", en: "Digital Transformation" },
  unternehmensstrategie: { de: "Unternehmensstrategie", en: "Corporate Strategy" },
  vertriebmarketing: { de: "Vertrieb & Marketing", en: "Sales & Marketing" },
  "veränderungsmanagement": { de: "Veränderungsmanagement", en: "Change Management" },
  prozessoptimierung: { de: "Prozessoptimierung", en: "Process Optimization" },
  projektmanagement: { de: "Projektmanagement", en: "Project Management" },
  risikomanagement: { de: "Risikomanagement", en: "Risk Management" },
  "executive-search": { de: "Executive Search", en: "Executive Search" },
};

function Heading({ eyebrow, title, light = false }: { eyebrow: string; title: string; light?: boolean }) {
  return <div className="max-w-[760px]"><p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${light ? "text-white/50" : "text-[#86868b]"}`}>{eyebrow}</p><h2 className={`mt-3 text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] text-balance md:text-[44px] ${light ? "text-white" : "text-[#1d1d1f]"}`}>{title}</h2></div>;
}

export function ServiceGuidePage({ content: c }: { content: Guide }) {
  const english = c.locale === "en";
  const localeKey = english ? "en" : "de";
  const focusParent = c.parent !== "executive-search";
  const parentPath = focusParent ? `${english ? "/en" : ""}/fokusthemen/${c.parent}` : `${english ? "/en" : ""}/executive-search`;
  const path = guidePath(c.slug, c.locale);
  const hubPath = guideHubPath(c.locale);
  const heroImage = focusParent ? fokusPageHeroImages[c.parent as keyof typeof fokusPageHeroImages] : executiveSearchHeroImage;
  const bookingUrl = english ? siteConfig.bookingUrlEn : siteConfig.bookingUrlDe;
  const related = getAllServiceGuides(c.locale).filter((page) => page.parent !== c.parent).slice(0, 3);

  return (
    <div lang={localeKey}>
      <InteriorPageRoot>
        <SchemaMarkup type="Service" path={path} data={c.meta} faqItems={c.faq} breadcrumbs={[
          { name: english ? "Home" : "Startseite", url: english ? "/en/home" : "/" },
          { name: english ? "Guides" : "Ratgeber", url: hubPath },
          { name: c.meta.title, url: path },
        ]} />

        <PageHero imageSrc={heroImage} priority intro={<p>{c.lead}</p>} actions={<>
          <a href={bookingUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#26337c] px-7 text-sm font-semibold text-white transition hover:bg-[#3550a4]">{c.closing.cta}</a>
          <Link href={parentPath} className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#26337c]/20 px-7 text-sm font-semibold text-[#26337c] transition hover:border-[#26337c]/40 hover:bg-[#f7f8fc]">{parentLabels[c.parent][localeKey]} →</Link>
        </>}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">{c.eyebrow}</p>
          <h1 className="mt-3 max-w-[23ch] text-[clamp(2.15rem,7vw+0.5rem,3.875rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-white text-balance"><HeroHeadlineText>{c.title}</HeroHeadlineText></h1>
        </PageHero>

        <MotionSection className="bg-white"><div className="mx-auto max-w-[1068px] px-5 py-16 sm:px-6 md:py-24"><div className="rounded-[26px] border border-[#26337c]/10 bg-[#f5f6fa] p-7 sm:p-10 md:p-12"><p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#26337c]">{english ? "Direct answer" : "Direkte Antwort"}</p><h2 className="mt-3 max-w-[25ch] text-[28px] font-semibold leading-[1.12] tracking-[-0.03em] text-[#1d1d1f] sm:text-[36px]">{c.answer.title}</h2><p className="mt-5 max-w-[78ch] text-[17px] leading-relaxed text-[#4b4b50]">{c.answer.body}</p></div></div></MotionSection>

        <MotionSection className="bg-[#f5f6fa]"><div className="mx-auto max-w-[1068px] px-5 py-16 sm:px-6 md:py-24"><Heading eyebrow={english ? "Practical guidance" : "Praxisorientierung"} title={english ? "What matters in practice" : "Worauf es in der Praxis ankommt"} /><div className="mt-10 grid gap-5 md:mt-14 md:grid-cols-3">{c.sections.map((section, index) => <article key={section.title} className="rounded-[22px] border border-black/[0.07] bg-white p-7 shadow-[0_12px_40px_rgba(38,51,124,0.05)] sm:p-8"><span className="text-[12px] font-semibold text-[#45b3e2]">{String(index + 1).padStart(2, "0")}</span><h3 className="mt-4 text-[22px] font-semibold leading-tight tracking-[-0.025em] text-[#1d1d1f]">{section.title}</h3><p className="mt-4 text-[15px] leading-relaxed text-[#6e6e73]">{section.body}</p>{section.points ? <ul className="mt-5 space-y-2 border-t border-black/[0.07] pt-5">{section.points.map((point) => <li key={point} className="flex gap-3 text-[14px] leading-relaxed text-[#4b4b50]"><span className="mt-[0.62em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#45b3e2]" aria-hidden />{point}</li>)}</ul> : null}</article>)}</div></div></MotionSection>

        <MotionSection className="bg-[#151d52]"><div className="mx-auto grid max-w-[1068px] gap-8 px-5 py-16 sm:px-6 md:grid-cols-[0.78fr_1.22fr] md:gap-16 md:py-24"><Heading eyebrow={english ? "Frequently asked questions" : "Häufige Fragen"} title={english ? "Useful answers for your next decision." : "Klare Antworten für Ihre nächste Entscheidung."} light /><div className="rounded-[22px] bg-white px-6 sm:px-8"><RisikomanagementFaqList items={c.faq} /></div></div></MotionSection>

        <MotionSection className="bg-white"><div className="mx-auto max-w-[1068px] px-5 py-16 sm:px-6 md:py-24"><Heading eyebrow={english ? "Related guidance" : "Weitere Entscheidungshilfen"} title={english ? "Explore connected management questions." : "Vertiefen Sie zusammenhängende Managementfragen."} /><div className="mt-10 grid gap-5 md:grid-cols-3">{related.map((page) => {
          const href = guidePath(page.slug, c.locale);
          return <Link key={page.parent} href={href} className="group rounded-[22px] border border-black/[0.07] bg-[#fbfbfd] p-7 transition hover:-translate-y-0.5 hover:border-[#26337c]/20"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">{parentLabels[page.parent][localeKey]}</p><h3 className="mt-3 text-[20px] font-semibold leading-tight tracking-[-0.02em] text-[#1d1d1f] group-hover:text-[#26337c]">{page.meta.title}</h3><span className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-[#26337c]">{english ? "Read guide" : "Ratgeber lesen"} →</span></Link>;
        })}</div></div></MotionSection>

        <MotionSection className="bg-[#26337c]"><div className="mx-auto max-w-[1068px] px-5 py-16 sm:px-6 md:py-24"><Heading eyebrow={english ? "Next step" : "Nächster Schritt"} title={c.closing.title} light /><p className="mt-5 max-w-[62ch] text-[17px] leading-relaxed text-white/68">{c.closing.body}</p><a href={bookingUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-[#26337c] transition hover:bg-[#eef2fb]">{c.closing.cta}</a></div></MotionSection>
      </InteriorPageRoot>
    </div>
  );
}

export function ServiceGuidePromo({ parent, locale }: { parent: string; locale: ServiceGuideLocale }) {
  const guide = getAllServiceGuides(locale).find((page) => page.parent === parent);
  if (!guide) return null;
  const english = locale === "en";
  const href = guidePath(guide.slug, locale);
  return <section className="border-t border-black/[0.06] bg-[#f5f6fa]"><div className="mx-auto max-w-[1068px] px-5 py-12 sm:px-6 md:py-16"><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#86868b]">{english ? "Decision guide" : "Entscheidungshilfe"}</p><div className="mt-3 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div className="max-w-[720px]"><h2 className="text-[27px] font-semibold leading-tight tracking-[-0.025em] text-[#1d1d1f]">{guide.meta.title}</h2><p className="mt-3 text-[15px] leading-relaxed text-[#6e6e73]">{guide.meta.excerpt}</p></div><Link href={href} className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-[#26337c] px-6 text-sm font-semibold text-white transition hover:bg-[#3550a4]">{english ? "Read guide" : "Ratgeber lesen"} →</Link></div></div></section>;
}
