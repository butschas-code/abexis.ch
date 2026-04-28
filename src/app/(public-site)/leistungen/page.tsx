import { LeistungenBentoGrid } from "@/components/leistungen/LeistungenBentoGrid";
import { MotionSection } from "@/components/motion/MotionSection";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { HeroProjectRealityCheckCta } from "@/components/site/HeroProjectRealityCheckCta";
import { PageHero } from "@/components/site/PageHero";
import { fokusPageHeroImages } from "@/data/site-images";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";

export const metadata = {
  title: "Leistungen",
  description:
    "Abexis: substanzielle Beratung in Führungs- und Personalthemen : präzise, diskret, konsequent. Schwerpunkte: Digitale Transformation, Strategie, Vertrieb & Marketing u. a.",
  openGraph: {
    title: "Leistungen | Abexis",
    description:
      "Wenn Entscheidungen Tragweite haben, braucht es mehr als Standardlösungen. Beratung mit Substanz : unsere Schwerpunkte im Überblick.",
    images: [{ url: fokusPageHeroImages["digitale-transformation"] }],
  },
};

export default function LeistungenPage() {
  return (
    <InteriorPageRoot>
      <SchemaMarkup
        type="Collection"
        path="/leistungen"
        breadcrumbs={[
          { name: "Startseite", url: "/" },
          { name: "Leistungen", url: "/leistungen" },
        ]}
      />
      <PageHero imageSrc={fokusPageHeroImages["digitale-transformation"]}>
        <h1 className="max-w-[22ch] text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-white text-balance md:max-w-[32ch] md:text-[56px] md:leading-[1.02]">
          Beratung mit Substanz
        </h1>
        <p className="mt-6 max-w-2xl text-[19px] font-normal leading-relaxed text-white/88 md:text-[21px]">
          Wenn Entscheidungen Tragweite haben, braucht es mehr als Standardlösungen. Abexis steht für substanzielle
          Beratung in zentralen Führungs- und Personalthemen : präzise in der Analyse, diskret in der Begleitung und
          konsequent in der Umsetzung.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <HeroProjectRealityCheckCta />
        </div>
      </PageHero>

      <MotionSection className="relative overflow-hidden py-16 md:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_-10%,rgba(38,51,124,0.11),transparent_50%),radial-gradient(ellipse_60%_50%_at_100%_50%,rgba(69,179,226,0.1),transparent_45%),linear-gradient(180deg,#fbfbfd_0%,#f0f3fb_40%,#fbfbfd_100%)]"
        />
        <div className="relative mx-auto max-w-[1140px] px-5 sm:px-6">
          <div className="mb-10 max-w-[52ch] md:mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Schwerpunkte</p>
            <h2 className="mt-2 text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f] md:text-[40px]">
              Beratungsfelder im Überblick
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[#6e6e73] md:text-[16px]">
              Jedes Feld verweist auf die vollständige Themenseite mit Originalinhalt : hier als kompakte Orientierung.
            </p>
          </div>
          <LeistungenBentoGrid />
        </div>
      </MotionSection>
    </InteriorPageRoot>
  );
}
