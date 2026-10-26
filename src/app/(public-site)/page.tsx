import type { Metadata } from "next";
import Link from "next/link";
import { HomeBlogTeasers } from "@/components/home/HomeBlogTeasers";
import { HomeFinalCtaSection } from "@/components/home/HomeFinalCtaSection";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeProcessSection } from "@/components/home/HomeProcessSection";
import { HomeVacancyTeasers } from "@/components/home/HomeVacancyTeasers";
import { HomeWhoWeAreSection } from "@/components/home/HomeWhoWeAreSection";
import { PartnershipsMarquee } from "@/components/home/PartnershipsMarquee";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { WelcomeSection } from "@/components/home/WelcomeSection";
import { ServiceGroupsSection } from "@/components/leistungen/ServiceGroupsSection";
import { MotionSection } from "@/components/motion/MotionSection";
import { HeroHeadlineBrandAccent } from "@/components/site/HeroHeadlineBrandAccent";
import { HeroProjectRealityCheckCta } from "@/components/site/HeroProjectRealityCheckCta";
import { homeHeroContent } from "@/data/home-page-content";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { localizedAlternates } from "@/lib/seo/localized-metadata";

/**
 * Home teasers use cached `getPublishedCmsPosts` (see `get-published-posts.ts`). Short ISR keeps
 * the shell fast while new posts show up within a couple of minutes.
 */
export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: "Abexis : Management stärken. Veränderung umsetzen." },
  description:
    "Managementberatung und Umsetzung für Geschäftsleitungen in der Schweiz: Strategie, Virtual Management Office, Transformation, Projekte, Veränderung und Executive Search.",
  alternates: localizedAlternates("/", "/en/home", "de"),
};
export default function HomePage() {
  const h = homeHeroContent;
  return (
    <>
      <SchemaMarkup type="Home" path="/" />
      <HomeHero>
        <div className="min-w-0 max-w-[40rem] md:max-w-[44rem]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">{h.eyebrow}</p>
          <h1 className="hero-home-title-shadow mt-3 text-[clamp(1.6rem,5.2vw+0.4rem,2.5rem)] font-semibold leading-none tracking-[-0.03em] text-balance break-words sm:text-[38px] md:text-[52px]">
            <span className="text-white">{h.titleLines[0]}</span>
            <br />
            <HeroHeadlineBrandAccent>{h.titleLines[1]}</HeroHeadlineBrandAccent>
          </h1>
          <p className="hero-home-body-shadow mt-5 text-[17px] font-medium leading-relaxed text-white/92 sm:mt-6 sm:text-[20px] md:text-[22px]">
            {h.sub}
          </p>
          <p className="hero-home-body-shadow mt-4 text-[15px] font-normal leading-[1.65] text-white/84 sm:mt-5 sm:text-[17px] sm:leading-relaxed md:text-[19px]">
            {h.body}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <HeroProjectRealityCheckCta href={h.primaryCta.href} label={h.primaryCta.label} />
            <Link
              href={h.secondaryCta.href}
              className="inline-flex min-h-12 w-full touch-manipulation items-center justify-center rounded-full border border-white/35 bg-white/10 px-5 text-[16px] font-medium text-white backdrop-blur-sm transition-all duration-200 ease-out hover:border-white/60 hover:bg-white/22 hover:shadow-lg hover:shadow-black/15 hover:-translate-y-0.5 active:translate-y-0 sm:w-auto sm:min-h-[48px] sm:px-8 sm:text-[17px]"
            >
              {h.secondaryCta.label}
            </Link>
          </div>
        </div>
      </HomeHero>

      <WelcomeSection />

      <ServiceGroupsSection id="leistungen" />

      <HomeProcessSection />

      <HomeWhoWeAreSection />

      <HomeBlogTeasers />

      <HomeVacancyTeasers />

      <MotionSection>
        <TestimonialsSection />
      </MotionSection>

      <MotionSection>
        <PartnershipsMarquee />
      </MotionSection>

      <HomeFinalCtaSection />
    </>
  );
}
