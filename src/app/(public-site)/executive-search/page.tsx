import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HomeVacancyTeasers } from "@/components/home/HomeVacancyTeasers";
import { MotionSection } from "@/components/motion/MotionSection";
import { ParallaxBlock } from "@/components/executive-search/ParallaxBlock";
import { ExecutiveSearchClosingSection } from "@/components/executive-search/ExecutiveSearchClosingSection";
import { ExecutiveSearchStatementParallax } from "@/components/executive-search/ExecutiveSearchStatementParallax";
import { HeroPanel } from "@/components/executive-search/HeroPanel";
import { HomeIntroBand } from "@/components/executive-search/HomeIntroBand";
import { SectionShell } from "@/components/executive-search/SectionShell";
import { legacySiteImages } from "@/executive-search/data/legacy-site-images";
import { homeImagery } from "@/executive-search/lib/images/homeImagery";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { PublicContentWidth } from "@/components/site/PublicContentWidth";
import { InsightPostCard } from "@/components/public-site/insights/InsightPostCard";
import { SearchBriefContactForm } from "@/components/site/search/SearchBriefContactForm";
import { listSearchSitePublishedPosts } from "@/public-site/cms";

const HERO_LEAD =
  "Abexis SEARCH besetzt Führungs- und Schlüsselpositionen diskret, präzise und mit echter Beratungskompetenz. Wir bringen Organisationen mit Persönlichkeiten zusammen, die nicht nur fachlich passen, sondern auch menschlich und strategisch Wirkung entfalten. Unsere Mandant:innen schätzen die Verbindung aus strukturierter Direktansprache, unternehmerischem Verständnis und einem klar geführten Suchprozess : für Besetzungen, die nachhaltig tragen.";

const INTRO_BODY =
  "Executive Search ist für uns mehr als die Suche nach passenden Profilen. Es geht darum, Persönlichkeiten zu identifizieren, die Verantwortung übernehmen können, kulturell anschlussfähig sind und in ihrer Rolle Wirkung entfalten. Entscheidend ist nicht allein, ob ein Lebenslauf passt, sondern ob ein Mensch in einem bestimmten unternehmerischen Umfeld tragfähig führen, gestalten und entwickeln kann. Genau deshalb verstehen wir Executive Search als beratungsintensiven Prozess : mit Präzision in der Ansprache, Klarheit in der Einschätzung und Sorgfalt in der Besetzung.";

const BLOCK1 =
  "Wir unterstützen Unternehmen bei der Besetzung von Führungs- und Schlüsselpositionen dort, wo Standardprozesse nicht ausreichen. Unsere Arbeit verbindet diskrete Direktansprache mit einem klar geführten Suchprozess und echtem Verständnis für Rollen, Märkte und Organisationen. So identifizieren wir nicht nur qualifizierte Kandidat:innen, sondern Persönlichkeiten, die der Aufgabe, dem Umfeld und der strategischen Situation eines Unternehmens wirklich entsprechen. Das Ergebnis sind Besetzungen, die fachlich überzeugen, menschlich passen und langfristig Wirkung entfalten.";

const BLOCK2_TITLE = "Beratungskompetenz statt reiner Vermittlung";

const BLOCK2 =
  "Abexis SEARCH versteht Executive Search nicht als operative Personalvermittlung, sondern als hochwertige Beratungsleistung. Im Mittelpunkt steht die Frage, wer in einer konkreten Rolle wirksam werden kann : nicht nur auf dem Papier, sondern im realen Zusammenspiel mit Führung, Team, Kultur und Markt. Deshalb bringen wir unternehmerisches Verständnis, strukturiertes Vorgehen und ein feines Gespür für Kontexte zusammen. Unsere Mandant:innen schätzen genau diese Verbindung: analytische Schärfe, diskrete Ansprache und belastbare Begleitung in einem Suchprozess, der klar geführt ist und Vertrauen schafft.";

const BLOCK3 =
  "Passgenauigkeit entsteht dort, wo Rollentiefe und Marktverständnis zusammenkommen. Unsere Branchenfokussierung ermöglicht eine präzise Ansprache, eine fundierte Einschätzung und eine Suche, die nicht nur sorgfaltig, sondern auch effizient ist. Wer Funktionen, Branchenlogiken und unternehmerische Realitäten versteht, kann schneller die richtigen Persönlichkeiten identifizieren und ihre Eignung belastbarer beurteilen. Genau daraus entsteht der Anspruch, für den Abexis SEARCH steht: passgenau, schnell und verlässlich : ohne Kompromisse bei Qualität und Diskretion.";

const DESCRIPTION =
  "Executive Search, Personalvermittlung: Führungspositionen diskret und präzise besetzen. Beratungsintensiver Suchprozess, Branchenfokussierung, Abexis SEARCH.";

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
        secondaryLabel="Kontakt aufnehmen"
      />

      <section className="bg-white py-14 sm:py-16">
        <PublicContentWidth>
          <p className="mb-9 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
            Unsere Branchenschwerpunkte
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-8">
            {[
              "Informationstechnologie & Digitalisierung",
              "Industrie",
              "Finanzen, Banking & Risk Management",
              "Öffentlicher Sektor & Verwaltung",
              "Beratung",
            ].map((sector) => (
              <div key={sector} className="border-t-2 border-[#26337c] pt-4">
                <p className="text-[15px] font-medium leading-[1.35] tracking-[-0.01em] text-[#1d1d1f]">
                  {sector}
                </p>
              </div>
            ))}
          </div>
        </PublicContentWidth>
      </section>

      <ParallaxBlock yRange={[32, -32]}>
        <HomeIntroBand
          title="Besetzung mit Urteil, Kontext und Substanz"
          imageSrc={homeImagery.intro}
          imageAlt="Gezielte Auswahl und Fokus im Suchprozess"
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
        <SectionShell title="Diskrete Suche. Klare Führung. Hohe Passung.">
          <p className="max-w-3xl text-[17px] leading-relaxed text-[#6e6e73]">{BLOCK1}</p>
        </SectionShell>
      </MotionSection>

      <MotionSection>
        <ExecutiveSearchStatementParallax
          imageSrc={homeImagery.trust}
          imageAlt="Vertrauensvolle Zusammenarbeit im Executive-Search-Mandat"
          title={BLOCK2_TITLE}
          body={BLOCK2}
        />
      </MotionSection>

      <MotionSection>
        <SectionShell title="Branchenfokussierung als Qualitätsvorteil" density="tight">
          <p className="max-w-3xl text-[17px] leading-relaxed text-[#6e6e73]">{BLOCK3}</p>
        </SectionShell>
      </MotionSection>

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

      <MotionSection>
        <section id="suchmandat" className="scroll-mt-28 bg-[#f5f5f7] py-16 sm:py-20 md:py-24">
          <PublicContentWidth>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
              <div className="max-w-xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Suchmandat</p>
                <h2 className="mt-3 text-[28px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f] sm:text-[34px]">
                  Besetzung vertraulich anfragen
                </h2>
                <p className="mt-5 text-[17px] leading-relaxed text-[#6e6e73]">
                  Skizzieren Sie Rolle, Kontext und Zeitrahmen. Wir prüfen Ihre Anfrage vertraulich und melden uns mit
                  einer ersten Einschätzung zum passenden Suchvorgehen.
                </p>
              </div>
              <SearchBriefContactForm />
            </div>
          </PublicContentWidth>
        </section>
      </MotionSection>

      <ExecutiveSearchClosingSection />
    </InteriorPageRoot>
  );
}
