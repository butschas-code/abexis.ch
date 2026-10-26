import Link from "next/link";
import { FeaturedOffersSection } from "@/components/leistungen/FeaturedOffersSection";
import { ServiceGroupsSection } from "@/components/leistungen/ServiceGroupsSection";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { HeroProjectRealityCheckCta } from "@/components/site/HeroProjectRealityCheckCta";
import { HeroHeadlineText } from "@/components/site/HeroHeadlineBrandAccent";
import { PageHero } from "@/components/site/PageHero";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { fokusPageHeroImages } from "@/data/site-images";
import { localizedAlternates } from "@/lib/seo/localized-metadata";

export const metadata = {
  title: "Services",
  description:
    "Abexis: substantive consulting for leadership and people topics, precise, discreet and implementation-focused.",
  alternates: localizedAlternates("/leistungen", "/en/leistungen", "en"),
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
        path="/en/leistungen"
        breadcrumbs={[
          { name: "Home", url: "/en/home" },
          { name: "Services", url: "/en/leistungen" },
        ]}
      />
      <PageHero
        imageSrc={fokusPageHeroImages["digitale-transformation"]}
        priority
        intro={
          <p>
            Our services in four areas: strategy and management, transformation and technology, projects and risks, and
            people and organisation.
          </p>
        }
        actions={<HeroProjectRealityCheckCta href="/en/kontakt" label="Non-binding conversation" />}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">Services</p>
        <h1 className="mt-3 max-w-[22ch] text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-white text-balance md:max-w-[32ch] md:text-[56px] md:leading-[1.02]">
          <HeroHeadlineText>Consulting with substance for decisions that create lasting impact.</HeroHeadlineText>
        </h1>
        <p className="mt-5 max-w-[48ch] text-[17px] leading-relaxed text-white/88 text-balance sm:text-[19px]">
          Strategy, transformation and execution – where important decisions need substance.
        </p>
      </PageHero>

      <ServiceGroupsSection locale="en" showAllLink={false} />

      <FeaturedOffersSection locale="en" />

      <section className="bg-white">
        <div className="mx-auto max-w-[1068px] px-5 pb-16 sm:px-6 md:pb-24">
          <Link href="/en/guides" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#26337c]/20 bg-white px-6 text-sm font-semibold text-[#26337c] transition hover:border-[#26337c]/40 hover:bg-[#f7f8fc]">
            View all guides →
          </Link>
        </div>
      </section>
    </InteriorPageRoot>
  );
}
