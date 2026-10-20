import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceGuidePage } from "@/components/public-site/ServiceGuidePage";
import { executiveSearchGuide, getServiceGuide } from "@/data/service-guide-pages";
import { executiveSearchHeroImage } from "@/data/site-images";

type Props = { params: Promise<{ guide: string }> };
export function generateStaticParams() { return [{ guide: executiveSearchGuide.slug }]; }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { guide } = await params; const page = getServiceGuide("executive-search", guide, "en"); if (!page) return {};
  const canonical = `/en/executive-search/${page.slug}`; const german = `/executive-search/${page.slug}`;
  return { title: page.meta.title, description: page.meta.excerpt, alternates: { canonical, languages: { "de-CH": german, "en-CH": canonical, "x-default": german } }, openGraph: { title: page.meta.title, description: page.meta.excerpt, url: canonical, locale: "en_CH", alternateLocale: ["de_CH"], images: [{ url: executiveSearchHeroImage }] } };
}
export default async function EnglishExecutiveSearchGuidePage({ params }: Props) { const { guide } = await params; const page = getServiceGuide("executive-search", guide, "en"); if (!page) notFound(); return <ServiceGuidePage content={page} />; }
