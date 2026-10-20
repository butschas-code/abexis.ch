import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { HeroHeadlineText } from "@/components/site/HeroHeadlineBrandAccent";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { PageHero } from "@/components/site/PageHero";
import { getPlmSeoCards } from "@/data/plm-seo-pages";
import { getAllServiceGuides, type ServiceGuideLocale } from "@/data/service-guide-pages";
import { fokusPageHeroImages } from "@/data/site-images";
import { guidePath, guideHubPath } from "@/lib/seo/guide-routes";

export function GuideHubPage({ locale }: { locale: ServiceGuideLocale }) {
  const english = locale === "en";
  const serviceGuides = getAllServiceGuides(locale).map((guide) => ({
    slug: guide.slug,
    title: guide.meta.title,
    excerpt: guide.meta.excerpt,
    eyebrow: guide.eyebrow,
  }));
  const plmGuides = getPlmSeoCards(locale).map((guide) => ({ ...guide, eyebrow: "PLM/PDM" }));
  const guides = [...serviceGuides, ...plmGuides];
  const path = guideHubPath(locale);

  return (
    <div lang={english ? "en" : "de"}>
      <InteriorPageRoot>
        <SchemaMarkup
          type="Collection"
          path={path}
          name={english ? "Abexis Guides" : "Abexis Ratgeber"}
          description={english ? "Practical guidance for important management, project and technology decisions." : "Praxisnahe Orientierung für wichtige Management-, Projekt- und Technologieentscheidungen."}
          breadcrumbs={[
            { name: english ? "Home" : "Startseite", url: english ? "/en/home" : "/" },
            { name: english ? "Guides" : "Ratgeber", url: path },
          ]}
        />
        <PageHero
          imageSrc={fokusPageHeroImages["digitale-transformation"]}
          priority
          intro={<p>{english ? "Clear, practical answers for leaders preparing important decisions and initiatives." : "Klare, praxisnahe Antworten für Führungskräfte, die wichtige Entscheidungen und Vorhaben vorbereiten."}</p>}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">{english ? "Knowledge and guidance" : "Wissen und Orientierung"}</p>
          <h1 className="mt-3 max-w-[23ch] text-[clamp(2.15rem,7vw+0.5rem,3.875rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-white text-balance">
            <HeroHeadlineText>{english ? "Guides for decisions with lasting impact." : "Ratgeber für Entscheidungen mit nachhaltiger Wirkung."}</HeroHeadlineText>
          </h1>
        </PageHero>

        <MotionSection className="bg-white">
          <div className="mx-auto max-w-[1140px] px-5 py-16 sm:px-6 md:py-24">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{english ? "All guides" : "Alle Ratgeber"}</p>
            <h2 className="mt-3 max-w-[24ch] text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f] md:text-[44px]">
              {english ? "Practical orientation, grouped in one clear knowledge area." : "Praxisnahe Orientierung in einem klaren Wissensbereich gebündelt."}
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {guides.map((guide) => (
                <Link key={guide.slug} href={guidePath(guide.slug, locale)} className="group flex min-h-[210px] flex-col rounded-[20px] border border-black/[0.07] bg-[#fbfbfd] p-6 transition hover:-translate-y-0.5 hover:border-[#26337c]/20 hover:shadow-[0_12px_32px_rgba(38,51,124,0.08)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">{guide.eyebrow}</p>
                  <h3 className="mt-3 text-[19px] font-semibold leading-snug tracking-[-0.02em] text-[#1d1d1f] group-hover:text-[#26337c]">{guide.title}</h3>
                  <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-[#6e6e73]">{guide.excerpt}</p>
                  <span className="mt-auto pt-4 text-sm font-semibold text-[#26337c]">{english ? "Read guide" : "Ratgeber lesen"} →</span>
                </Link>
              ))}
            </div>
          </div>
        </MotionSection>
      </InteriorPageRoot>
    </div>
  );
}
