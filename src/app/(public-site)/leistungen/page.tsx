import Link from "next/link";
import { FeaturedOffersSection } from "@/components/leistungen/FeaturedOffersSection";
import { ServiceGroupsSection } from "@/components/leistungen/ServiceGroupsSection";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { HeroProjectRealityCheckCta } from "@/components/site/HeroProjectRealityCheckCta";
import { HeroHeadlineText } from "@/components/site/HeroHeadlineBrandAccent";
import { PageHero } from "@/components/site/PageHero";
import { fokusPageHeroImages } from "@/data/site-images";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { localizedAlternates } from "@/lib/seo/localized-metadata";

export const metadata = {
  title: "Leistungen",
  description:
    "Abexis: substanzielle Beratung in Führungs- und Personalthemen, präzise, diskret, konsequent. Schwerpunkte: Digitale Transformation, Strategie, Vertrieb & Marketing u. a.",
  alternates: localizedAlternates("/leistungen", "/en/leistungen", "de"),
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
      <PageHero
        imageSrc={fokusPageHeroImages["digitale-transformation"]}
        priority
        intro={
          <p>
            Unser Angebot in vier Bereichen: Strategie und Management, Transformation und Technologie, Projekte und
            Risiken sowie Menschen und Organisation.
          </p>
        }
        actions={<HeroProjectRealityCheckCta href="/kontakt" label="Unverbindliches Gespräch" />}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">Leistungen</p>
        <h1 className="mt-3 max-w-[22ch] text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-white text-balance md:max-w-[32ch] md:text-[56px] md:leading-[1.02]">
          <HeroHeadlineText>Beratung mit Substanz für Entscheidungen, die Wirkung entfalten.</HeroHeadlineText>
        </h1>
        <p className="mt-5 max-w-[48ch] text-[17px] leading-relaxed text-white/88 text-balance sm:text-[19px]">
          Strategie, Transformation und Umsetzung – dort, wo Entscheidungen Substanz brauchen.
        </p>
      </PageHero>

      <ServiceGroupsSection showAllLink={false} />

      <FeaturedOffersSection />

      <section className="bg-white">
        <div className="mx-auto max-w-[1068px] px-5 pb-16 sm:px-6 md:pb-24">
          <Link href="/ratgeber" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#26337c]/20 bg-white px-6 text-sm font-semibold text-[#26337c] transition hover:border-[#26337c]/40 hover:bg-[#f7f8fc]">
            Alle Ratgeber ansehen →
          </Link>
        </div>
      </section>
    </InteriorPageRoot>
  );
}
