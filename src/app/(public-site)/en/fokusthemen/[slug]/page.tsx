import { notFound } from "next/navigation";
import { FokusEnglishPage } from "@/components/public-site/FokusEnglishPage";
import { FokusRisikomanagement } from "@/components/public-site/FokusRisikomanagement";
import { getRisikomanagementContent } from "@/data/risikomanagement-content";
import { englishFocusPages, getEnglishFocusPage } from "@/data/english-focus-pages";
import { fokusPageHeroImages } from "@/data/site-images";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [...englishFocusPages.map((page) => ({ slug: page.slug })), { slug: "risikomanagement" }];
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (slug === "risikomanagement") {
    const content = getRisikomanagementContent("en");
    const heroImage = fokusPageHeroImages.risikomanagement;
    return {
      title: content.meta.title,
      description: content.meta.excerpt,
      openGraph: {
        title: `${content.meta.title} | Abexis`,
        description: content.meta.excerpt,
        images: [{ url: heroImage }],
      },
    };
  }
  const page = getEnglishFocusPage(slug);
  if (!page) return {};

  return {
    title: `${page.title} | Abexis`,
    description: page.excerpt,
    openGraph: {
      title: `${page.title} | Abexis`,
      description: page.excerpt,
      images: [{ url: fokusPageHeroImages[page.slug] }],
    },
  };
}

export default async function EnglishTopicPage({ params }: Props) {
  const { slug } = await params;
  if (slug === "risikomanagement") return <FokusRisikomanagement locale="en" />;

  const page = getEnglishFocusPage(slug);
  if (!page) notFound();

  return <FokusEnglishPage page={page} />;
}
