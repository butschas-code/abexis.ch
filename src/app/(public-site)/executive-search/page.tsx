import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ConfidentialMandatesNotice } from "@/components/executive-search/ConfidentialMandatesNotice";
import { ExecutiveSearchClosingSection } from "@/components/executive-search/ExecutiveSearchClosingSection";
import { ExecutiveSearchIndustryStrip } from "@/components/executive-search/ExecutiveSearchIndustryStrip";
import { ExecutiveSearchStatementParallax } from "@/components/executive-search/ExecutiveSearchStatementParallax";
import { HeroPanel } from "@/components/executive-search/HeroPanel";
import { HomeIntroBand } from "@/components/executive-search/HomeIntroBand";
import { ParallaxBlock } from "@/components/executive-search/ParallaxBlock";
import { SectionShell } from "@/components/executive-search/SectionShell";
import { SpontaneousApplicationSection } from "@/components/executive-search/SpontaneousApplicationSection";
import { HomeVacancyTeasers } from "@/components/home/HomeVacancyTeasers";
import { MotionSection } from "@/components/motion/MotionSection";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { InsightPostCard } from "@/components/public-site/insights/InsightPostCard";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { PublicContentWidth } from "@/components/site/PublicContentWidth";
import { legacySiteImages } from "@/executive-search/data/legacy-site-images";
import { homeImagery } from "@/executive-search/lib/images/homeImagery";
import { listSearchSitePublishedPosts } from "@/public-site/cms";
import { getPublishedSpontaneousVacancy } from "@/public-site/cms/vacancy";

const HERO_LEAD =
  "Abexis SEARCH besetzt Führungs- und Schlüsselpositionen diskret, präzise und mit echter Beratungskompetenz. Viele unserer Mandate werden bewusst nicht öffentlich ausgeschrieben. Deshalb arbeiten wir mit vertraulicher Direktansprache, einem klar geführten Suchprozess und einem tiefen Verständnis für Rolle, Markt und Organisation. Wir bringen Unternehmen mit Persönlichkeiten zusammen, die fachlich überzeugen, menschlich passen und strategisch Wirkung entfalten.";

const INTRO_BODY =
  "Executive Search ist für uns mehr als die Suche nach passenden Profilen. Es geht darum, Persönlichkeiten zu identifizieren, die Verantwortung übernehmen können, kulturell anschlussfähig sind und in ihrer Rolle Wirkung entfalten, mit Präzision in der Ansprache, Klarheit in der Einschätzung und Sorgfalt in der Besetzung.";

const BLOCK1_PARAS = [
  "Wir unterstützen Unternehmen bei der Besetzung von Führungs- und Schlüsselpositionen dort, wo Standardprozesse nicht ausreichen. Unsere Arbeit verbindet diskrete Direktansprache mit einem klar strukturierten Suchprozess und echtem Verständnis für Rollen, Märkte und Organisationen.",
  "Wir suchen nicht nur nach Qualifikationen, sondern nach Persönlichkeiten, die in einem konkreten Umfeld wirksam werden können. Entscheidend ist, ob Erfahrung, Haltung, Führungsverständnis und kulturelle Passung zur Aufgabe und zur strategischen Situation des Unternehmens passen.",
  "Das Ergebnis sind Besetzungen, die fachlich überzeugen, menschlich tragen und langfristig Wirkung entfalten.",
];

const BLOCK2_TITLE = "Beratungskompetenz statt reiner Vermittlung";

const BLOCK2a =
  "Abexis SEARCH versteht Executive Search nicht als operative Personalvermittlung, sondern als hochwertige Beratungsleistung. Im Mittelpunkt steht die Frage, wer in einer konkreten Rolle wirklich Wirkung entfalten kann: nicht nur auf dem Papier, sondern im Zusammenspiel mit Führung, Team, Kultur und Markt.";

const BLOCK2b =
  "Deshalb bringen wir unternehmerisches Verständnis, strukturiertes Vorgehen und ein feines Gespür für Kontexte zusammen. Unsere Mandant:innen schätzen diese Verbindung aus analytischer Schärfe, diskreter Ansprache und belastbarer Begleitung in einem Suchprozess, der klar geführt ist und Vertrauen schafft.";

const BLOCK3_TITLE = "Branchenschwerpunkte als Qualitätsvorteil";

const BLOCK3_PARAS = [
  "Passgenauigkeit entsteht dort, wo Rollentiefe und Marktverständnis zusammenkommen. Unsere Schwerpunkte liegen in Informationstechnologie & Digitalisierung, Industrie, Finanzen, Banking & Risk Management, öffentlichem Sektor & Verwaltung sowie Beratung.",
  "Diese Fokussierung ermöglicht eine präzise Ansprache, eine fundierte Einschätzung und eine Suche, die nicht nur sorgfältig, sondern auch effizient ist. Wer Funktionen, Branchenlogiken und unternehmerische Realitäten versteht, kann schneller die richtigen Persönlichkeiten identifizieren und ihre Eignung belastbarer beurteilen.",
];

const DESCRIPTION =
  "Abexis SEARCH: diskrete Executive Search und Beratung für Führungs- und Schlüsselpositionen, verdeckte Mandate, Direktansprache, Branchentiefe.";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Executive Search",
  description: DESCRIPTION,
  openGraph: {
    title: "Executive Search | Abexis",
    description: DESCRIPTION,
  },
};

export default async function ExecutiveSearchPage() {
  const searchPosts = await listSearchSitePublishedPosts(6);
  const cmsSpontaneous = await getPublishedSpontaneousVacancy();

  return (
    <InteriorPageRoot>
      <SchemaMarkup
        type="Service"
        path="/executive-search"
        name="Executive Search | Abexis"
        description={DESCRIPTION}
        breadcrumbs={[
          { name: "Startseite", url: "/" },
          { name: "Executive Search", url: "/executive-search" },
        ]}
      />
      <HeroPanel
        title="Executive Search"
        subtitle="Wir finden Persönlichkeiten, nicht nur Profile."
        mainLead={HERO_LEAD}
        imageSrc={legacySiteImages.homeHero}
        primaryHref="#suchmandat"
        primaryLabel="Suchmandat anfragen"
        secondaryHref="/kontakt"
        secondaryLabel="Vertraulich Kontakt aufnehmen"
      />

      <ExecutiveSearchIndustryStrip />

      <ParallaxBlock yRange={[32, -32]}>
        <HomeIntroBand
          title="Executive Search mit Kontext und Urteil"
          imageSrc={homeImagery.intro}
          imageAlt="Beratungsintensive Auswahl im Suchprozess"
        >
          <p className="max-w-3xl text-[17px] leading-relaxed text-[#6e6e73]">{INTRO_BODY}</p>
        </HomeIntroBand>
      </ParallaxBlock>

      <MotionSection>
        <div className="py-10 sm:py-14">
          <PublicContentWidth>
            <div className="relative overflow-hidden rounded-[1.5rem] bg-[#dfe6f5] shadow-[0_20px_60px_rgba(38,51,124,0.12)] ring-1 ring-black/[0.05] sm:rounded-[1.75rem]">
              <div className="relative isolate aspect-[21/9] min-h-[200px] w-full sm:min-h-[240px] md:aspect-[2.4/1] md:min-h-[280px]">
                <Image
                  src={homeImagery.sectors}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="(max-width:768px) 100vw, 1068px"
                />
                <div className="abexis-tint-overlay" aria-hidden />
              </div>
            </div>
          </PublicContentWidth>
        </div>
      </MotionSection>

      <MotionSection>
        <SectionShell id="diskrete-suche" title="Diskrete Suche. Klare Führung. Hohe Passung.">
          <div className="max-w-3xl space-y-6">
            {BLOCK1_PARAS.map((p, i) => (
              <p key={`diskret-${i}`} className="text-[17px] leading-relaxed text-[#6e6e73]">
                {p}
              </p>
            ))}
          </div>
        </SectionShell>
      </MotionSection>

      <MotionSection>
        <ExecutiveSearchStatementParallax
          imageSrc={homeImagery.trust}
          imageAlt="Vertrauliche Zusammenarbeit im Executive Search"
          title={BLOCK2_TITLE}
          body={BLOCK2a}
          bodyParagraph2={BLOCK2b}
        />
      </MotionSection>

      <MotionSection>
        <SectionShell title={BLOCK3_TITLE} density="tight">
          <div className="max-w-3xl space-y-6">
            {BLOCK3_PARAS.map((p, i) => (
              <p key={`branch-${i}`} className="text-[17px] leading-relaxed text-[#6e6e73]">
                {p}
              </p>
            ))}
          </div>
        </SectionShell>
      </MotionSection>

      <ConfidentialMandatesNotice />

      <HomeVacancyTeasers />

      {searchPosts.length > 0 && (
        <MotionSection>
          <section className="apple-section-mesh py-20 sm:py-28">
            <PublicContentWidth>
              <div className="mb-10 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Executive Search · Insights</p>
                  <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-[#1d1d1f] sm:text-[32px]">
                    Perspektiven & Beiträge
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="shrink-0 text-[14px] font-medium text-brand-900 hover:underline"
                >
                  Alle Insights →
                </Link>
              </div>
              <ul className="grid list-none gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
                {searchPosts.map((post) => (
                  <li key={post.id} className="h-full">
                    <InsightPostCard
                      post={post}
                      href={`/executive-search/blog/${encodeURIComponent(post.slug)}`}
                      density="compact"
                    />
                  </li>
                ))}
              </ul>
            </PublicContentWidth>
          </section>
        </MotionSection>
      )}

      <SpontaneousApplicationSection cmsVacancy={cmsSpontaneous} />

      <ExecutiveSearchClosingSection />
    </InteriorPageRoot>
  );
}
