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
  const page = getServiceGuide(decodeURIComponent(slug), guide, "en");
  if (!page) return {};
  const canonical = `/en/fokusthemen/${page.parent}/${page.slug}`;
  const german = `/fokusthemen/${page.parent}/${page.slug}`;
  return {
    title: page.meta.title,
    description: page.meta.excerpt,
    alternates: { canonical, languages: { "de-CH": german, "en-CH": canonical, "x-default": german } },
    openGraph: { title: page.meta.title, description: page.meta.excerpt, url: canonical, locale: "en_CH", alternateLocale: ["de_CH"], images: [{ url: fokusPageHeroImages[page.parent as keyof typeof fokusPageHeroImages] }] },
  };
}

export default async function EnglishFocusGuidePage({ params }: Props) {
  const { slug, guide } = await params;
  const page = getServiceGuide(decodeURIComponent(slug), guide, "en");
  if (!page || page.parent === "executive-search") notFound();
  return <ServiceGuidePage content={page} />;
}
