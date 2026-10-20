import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlmSeoPage } from "@/components/public-site/PlmSeoPage";
import { ServiceGuidePage } from "@/components/public-site/ServiceGuidePage";
import { getPlmSeoPage } from "@/data/plm-seo-pages";
import { getAllServiceGuides, getServiceGuide } from "@/data/service-guide-pages";
import { executiveSearchHeroImage, fokusPageHeroImages, plmPdmHeroImage } from "@/data/site-images";
import { guidePath, guideRouteSlugs, resolveGuideSlug } from "@/lib/seo/guide-routes";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return guideRouteSlugs("de").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: routeSlug } = await params;
  const slug = resolveGuideSlug(routeSlug, "de");
  if (!slug) return {};

  const serviceGuide = getAllServiceGuides("de").find((page) => page.slug === slug);
  const plmGuide = getPlmSeoPage(slug, "de");
  const page = serviceGuide ?? plmGuide;
  if (!page) return {};

  const canonical = guidePath(slug, "de");
  const english = guidePath(slug, "en");
  const image = plmGuide
    ? plmPdmHeroImage
    : serviceGuide?.parent === "executive-search"
      ? executiveSearchHeroImage
      : fokusPageHeroImages[serviceGuide!.parent as keyof typeof fokusPageHeroImages];

  return {
    title: page.meta.title,
    description: page.meta.excerpt,
    alternates: { canonical, languages: { "de-CH": canonical, "en-CH": english, "x-default": canonical } },
    openGraph: { title: page.meta.title, description: page.meta.excerpt, url: canonical, locale: "de_CH", alternateLocale: ["en_CH"], images: [{ url: image }] },
  };
}

export default async function GermanGuidePage({ params }: Props) {
  const { slug: routeSlug } = await params;
  const slug = resolveGuideSlug(routeSlug, "de");
  if (!slug) notFound();

  const serviceGuide = getAllServiceGuides("de").find((page) => page.slug === slug);
  if (serviceGuide) return <ServiceGuidePage content={getServiceGuide(serviceGuide.parent, slug, "de")!} />;

  const plmGuide = getPlmSeoPage(slug, "de");
  if (!plmGuide) notFound();
  return <PlmSeoPage content={plmGuide} />;
}
