import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlmSeoPage } from "@/components/public-site/PlmSeoPage";
import { getPlmSeoPage, plmSeoSlugs } from "@/data/plm-seo-pages";
import { plmPdmHeroImage } from "@/data/site-images";

type Props = { params: Promise<{ topic: string }> };

export function generateStaticParams() {
  return plmSeoSlugs.map((topic) => ({ topic }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const page = getPlmSeoPage(topic, "de");
  if (!page) return {};

  const canonical = `/fokusthemen/plm-pdm/${page.slug}`;
  const english = `/en/fokusthemen/plm-pdm/${page.slug}`;
  return {
    title: page.meta.title,
    description: page.meta.excerpt,
    alternates: { canonical, languages: { "de-CH": canonical, "en-CH": english, "x-default": canonical } },
    openGraph: {
      title: `${page.meta.title} | Abexis`,
      description: page.meta.excerpt,
      url: canonical,
      locale: "de_CH",
      alternateLocale: ["en_CH"],
      images: [{ url: plmPdmHeroImage }],
    },
  };
}

export default async function GermanPlmTopicPage({ params }: Props) {
  const { topic } = await params;
  const page = getPlmSeoPage(topic, "de");
  if (!page) notFound();
  return <PlmSeoPage content={page} />;
}
