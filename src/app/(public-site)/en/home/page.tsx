import type { Metadata } from "next";
import Link from "next/link";
import { HomeBlogTeasers } from "@/components/home/HomeBlogTeasers";
import { HomeChallengeSection } from "@/components/home/HomeChallengeSection";
import { HomeClaritySection } from "@/components/home/HomeClaritySection";
import { HomeFinalCtaSection } from "@/components/home/HomeFinalCtaSection";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeLeistungenGridSection } from "@/components/home/HomeLeistungenGridSection";
import { HomePrcSection } from "@/components/home/HomePrcSection";
import { HomeProcessSection } from "@/components/home/HomeProcessSection";
import { HomeVacancyTeasers } from "@/components/home/HomeVacancyTeasers";
import { HomeWhoWeAreSection } from "@/components/home/HomeWhoWeAreSection";
import { WelcomeSection } from "@/components/home/WelcomeSection";
import { PartnershipsMarquee, partnershipsIntroEn } from "@/components/home/PartnershipsMarquee";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { MotionSection } from "@/components/motion/MotionSection";
import { HeroHeadlineBrandAccent } from "@/components/site/HeroHeadlineBrandAccent";
import { HeroProjectRealityCheckCta } from "@/components/site/HeroProjectRealityCheckCta";
import {
  homeChallengeContentEn,
  homeClarityContentEn,
  homeClosingContentEn,
  homeHeroContentEn,
  homeLeistungenBlockEn,
  homePrcContentEn,
  homeProcessContentEn,
  homeWhoWeAreContentEn,
} from "@/data/home-page-content";
import { homeTestimonialsEn } from "@/data/home-testimonials";
import { homeWelcomeSectionEn, siteConfig } from "@/data/pages";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";

export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: "Abexis : Clarity when it is missing" },
  description:
    "Abexis creates clarity when projects lose orientation: with Project Reality Check, consulting and executive search. Switzerland.",
};

export default function EnglishHomePage() {
  const h = homeHeroContentEn;
  return (
    <>
      <SchemaMarkup type="Home" path="/en/home" />
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

      <WelcomeSection content={homeWelcomeSectionEn} contactHref="/en/kontakt" contactLabel="Contact Abexis" />

      <HomeChallengeSection
        content={homeChallengeContentEn}
        situationsLabel="Typical situations"
        situationsAriaLabel="Typical project situations"
      />

      <HomePrcSection
        content={homePrcContentEn}
        bookingUrl={siteConfig.bookingUrlEn}
        packagesLabel="Packages"
        recommendedLabel="Recommended"
      />

      <HomeProcessSection content={homeProcessContentEn} />

      <HomeWhoWeAreSection
        content={homeWhoWeAreContentEn}
        profileHref="/en/ueber-uns"
        profileLabel="About Abexis"
        teamProfileLabel="Profile"
      />

      <HomeLeistungenGridSection content={homeLeistungenBlockEn} startLabel="Start here" moreLabel="Learn more" />

      <HomeBlogTeasers heading="From the blog" allLabel="All articles" dateLocale="en-GB" />

      <HomeVacancyTeasers
        heading="Current vacancies"
        allLabel="All vacancies"
        allHref="/en/executive-search/vakanzen"
        actionLabel="View position"
      />

      <MotionSection>
        <TestimonialsSection
          eyebrow="References"
          headline="Results from practice."
          intro="Voices from executives and partners, published with permission."
          items={homeTestimonialsEn}
        />
      </MotionSection>

      <HomeClaritySection content={homeClarityContentEn} />

      <MotionSection>
        <PartnershipsMarquee eyebrow="Partnerships" headline="Partnerships" intro={partnershipsIntroEn} />
      </MotionSection>

      <HomeFinalCtaSection content={homeClosingContentEn} bookingUrl={siteConfig.bookingUrlEn} />
    </>
  );
}
