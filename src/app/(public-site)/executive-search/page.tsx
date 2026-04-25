import type { Metadata } from "next";
import Image from "next/image";
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

const HERO_LEAD =
  "Abexis SEARCH besetzt Führungs- und Schlüsselpositionen diskret, präzise und mit echter Beratungskompetenz. Wir bringen Organisationen mit Persönlichkeiten zusammen, die nicht nur fachlich passen, sondern auch menschlich und strategisch Wirkung entfalten. Unsere Mandant:innen schätzen die Verbindung aus strukturierter Direktansprache, unternehmerischem Verständnis und einem klar geführten Suchprozess — für Besetzungen, die nachhaltig tragen.";

const INTRO_BODY =
  "Executive Search ist für uns mehr als die Suche nach passenden Profilen. Es geht darum, Persönlichkeiten zu identifizieren, die Verantwortung übernehmen können, kulturell anschlussfähig sind und in ihrer Rolle Wirkung entfalten. Entscheidend ist nicht allein, ob ein Lebenslauf passt, sondern ob ein Mensch in einem bestimmten unternehmerischen Umfeld tragfähig führen, gestalten und entwickeln kann. Genau deshalb verstehen wir Executive Search als beratungsintensiven Prozess — mit Präzision in der Ansprache, Klarheit in der Einschätzung und Sorgfalt in der Besetzung.";

const BLOCK1 =
  "Wir unterstützen Unternehmen bei der Besetzung von Führungs- und Schlüsselpositionen dort, wo Standardprozesse nicht ausreichen. Unsere Arbeit verbindet diskrete Direktansprache mit einem klar geführten Suchprozess und echtem Verständnis für Rollen, Märkte und Organisationen. So identifizieren wir nicht nur qualifizierte Kandidat:innen, sondern Persönlichkeiten, die der Aufgabe, dem Umfeld und der strategischen Situation eines Unternehmens wirklich entsprechen. Das Ergebnis sind Besetzungen, die fachlich überzeugen, menschlich passen und langfristig Wirkung entfalten.";

const BLOCK2_TITLE = "Beratungskompetenz statt reiner Vermittlung";

const BLOCK2 =
  "Abexis SEARCH versteht Executive Search nicht als operative Personalvermittlung, sondern als hochwertige Beratungsleistung. Im Mittelpunkt steht die Frage, wer in einer konkreten Rolle wirksam werden kann — nicht nur auf dem Papier, sondern im realen Zusammenspiel mit Führung, Team, Kultur und Markt. Deshalb bringen wir unternehmerisches Verständnis, strukturiertes Vorgehen und ein feines Gespür für Kontexte zusammen. Unsere Mandant:innen schätzen genau diese Verbindung: analytische Schärfe, diskrete Ansprache und belastbare Begleitung in einem Suchprozess, der klar geführt ist und Vertrauen schafft.";

const BLOCK3 =
  "Passgenauigkeit entsteht dort, wo Rollentiefe und Marktverständnis zusammenkommen. Unsere Branchenfokussierung ermöglicht eine präzise Ansprache, eine fundierte Einschätzung und eine Suche, die nicht nur sorgfaltig, sondern auch effizient ist. Wer Funktionen, Branchenlogiken und unternehmerische Realitäten versteht, kann schneller die richtigen Persönlichkeiten identifizieren und ihre Eignung belastbarer beurteilen. Genau daraus entsteht der Anspruch, für den Abexis SEARCH steht: passgenau, schnell und verlässlich — ohne Kompromisse bei Qualität und Diskretion.";

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

export default function ExecutiveSearchPage() {
  return (
    <InteriorPageRoot>
      <SchemaMarkup
        type="BreadcrumbList"
        data={[
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

      <ExecutiveSearchClosingSection />
    </InteriorPageRoot>
  );
}
