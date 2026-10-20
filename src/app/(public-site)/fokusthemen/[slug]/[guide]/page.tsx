import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceGuidePage } from "@/components/public-site/ServiceGuidePage";
import { focusGuidePages, getServiceGuide } from "@/data/service-guide-pages";
import { fokusPageHeroImages } from "@/data/site-images";

type Props = { params: Promise<{ slug: string; guide: string }> };

export function generateStaticParams() {
  return focusGuidePages.map((page) => ({ slug: page.parent, guide: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, guide } = await params;
  const page = getServiceGuide(decodeURIComponent(slug), guide, "de");
  if (!page) return {};
  const canonical = `/fokusthemen/${page.parent}/${page.slug}`;
  const english = `/en/fokusthemen/${page.parent}/${page.slug}`;
  return {
    title: page.meta.title,
    description: page.meta.excerpt,
    alternates: { canonical, languages: { "de-CH": canonical, "en-CH": english, "x-default": canonical } },
    openGraph: { title: page.meta.title, description: page.meta.excerpt, url: canonical, locale: "de_CH", alternateLocale: ["en_CH"], images: [{ url: fokusPageHeroImages[page.parent as keyof typeof fokusPageHeroImages] }] },
  };
}

export default async function FocusGuidePage({ params }: Props) {
  const { slug, guide } = await params;
  const page = getServiceGuide(decodeURIComponent(slug), guide, "de");
  if (!page || page.parent === "executive-search") notFound();
  return <ServiceGuidePage content={page} />;
}
