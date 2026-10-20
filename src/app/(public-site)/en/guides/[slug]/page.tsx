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
  return guideRouteSlugs("en").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: routeSlug } = await params;
  const slug = resolveGuideSlug(routeSlug, "en");
  if (!slug) return {};

  const serviceGuide = getAllServiceGuides("en").find((page) => page.slug === slug);
  const plmGuide = getPlmSeoPage(slug, "en");
  const page = serviceGuide ?? plmGuide;
  if (!page) return {};

  const canonical = guidePath(slug, "en");
  const german = guidePath(slug, "de");
  const image = plmGuide
    ? plmPdmHeroImage
    : serviceGuide?.parent === "executive-search"
      ? executiveSearchHeroImage
      : fokusPageHeroImages[serviceGuide!.parent as keyof typeof fokusPageHeroImages];

  return {
    title: page.meta.title,
    description: page.meta.excerpt,
    alternates: { canonical, languages: { "de-CH": german, "en-CH": canonical, "x-default": german } },
    openGraph: { title: page.meta.title, description: page.meta.excerpt, url: canonical, locale: "en_CH", alternateLocale: ["de_CH"], images: [{ url: image }] },
  };
}

export default async function EnglishGuidePage({ params }: Props) {
  const { slug: routeSlug } = await params;
  const slug = resolveGuideSlug(routeSlug, "en");
  if (!slug) notFound();

  const serviceGuide = getAllServiceGuides("en").find((page) => page.slug === slug);
  if (serviceGuide) return <ServiceGuidePage content={getServiceGuide(serviceGuide.parent, slug, "en")!} />;

  const plmGuide = getPlmSeoPage(slug, "en");
  if (!plmGuide) notFound();
  return <PlmSeoPage content={plmGuide} />;
}
