import { LeistungenBentoGrid } from "@/components/leistungen/LeistungenBentoGrid";
import { MotionSection } from "@/components/motion/MotionSection";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { HeroProjectRealityCheckCta } from "@/components/site/HeroProjectRealityCheckCta";
import { PageHero } from "@/components/site/PageHero";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { englishServiceTeasers } from "@/data/english-site";
import { fokusPageHeroImages } from "@/data/site-images";

export const metadata = {
  title: "Services | Abexis",
  description:
    "Abexis: substantive consulting for leadership and people topics, precise, discreet and implementation-focused.",
  openGraph: {
    title: "Services | Abexis",
    description:
      "When decisions have weight, standard solutions are not enough. Consulting with substance: our areas of focus.",
    images: [{ url: fokusPageHeroImages["digitale-transformation"] }],
  },
};

export default function EnglishServicesPage() {
  return (
    <InteriorPageRoot>
      <SchemaMarkup
        type="Collection"
        path="/en/services"
        breadcrumbs={[
          { name: "Home", url: "/en/home" },
          { name: "Services", url: "/en/services" },
        ]}
      />
      <PageHero imageSrc={fokusPageHeroImages["digitale-transformation"]}>
        <h1 className="max-w-[22ch] text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-white text-balance md:max-w-[32ch] md:text-[56px] md:leading-[1.02]">
          Consulting with substance
        </h1>
        <p className="mt-6 max-w-2xl text-[19px] font-normal leading-relaxed text-white/88 md:text-[21px]">
          When decisions have weight, standard solutions are not enough. Abexis stands for substantive consulting in
          central leadership and people topics, precise in analysis, discreet in support and consistent in implementation.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <HeroProjectRealityCheckCta href="/en/projectrealitycheck" label="Request a Project Reality Check" />
        </div>
      </PageHero>

      <MotionSection className="relative overflow-hidden py-16 md:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_-10%,rgba(38,51,124,0.11),transparent_50%),radial-gradient(ellipse_60%_50%_at_100%_50%,rgba(69,179,226,0.1),transparent_45%),linear-gradient(180deg,#fbfbfd_0%,#f0f3fb_40%,#fbfbfd_100%)]"
        />
        <div className="relative mx-auto max-w-[1140px] px-5 sm:px-6">
          <div className="mb-10 max-w-[52ch] md:mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Focus areas</p>
            <h2 className="mt-2 text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f] md:text-[40px]">
              Consulting areas at a glance
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[#6e6e73] md:text-[16px]">
              Each area leads to its full topic page, shown here as a compact orientation.
            </p>
          </div>
          <LeistungenBentoGrid
            items={englishServiceTeasers}
            lang="en"
            startLabel="Start here"
            moreLabel="Learn more"
          />
        </div>
      </MotionSection>
    </InteriorPageRoot>
  );
}
