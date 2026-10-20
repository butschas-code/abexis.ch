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
  const page = getPlmSeoPage(topic, "en");
  if (!page) return {};

  const canonical = `/en/fokusthemen/plm-pdm/${page.slug}`;
  const german = `/fokusthemen/plm-pdm/${page.slug}`;
  return {
    title: page.meta.title,
    description: page.meta.excerpt,
    alternates: { canonical, languages: { "de-CH": german, "en-CH": canonical, "x-default": german } },
    openGraph: {
      title: `${page.meta.title} | Abexis`,
      description: page.meta.excerpt,
      url: canonical,
      locale: "en_CH",
      alternateLocale: ["de_CH"],
      images: [{ url: plmPdmHeroImage }],
    },
  };
}

export default async function EnglishPlmTopicPage({ params }: Props) {
  const { topic } = await params;
  const page = getPlmSeoPage(topic, "en");
  if (!page) notFound();
  return <PlmSeoPage content={page} />;
}
