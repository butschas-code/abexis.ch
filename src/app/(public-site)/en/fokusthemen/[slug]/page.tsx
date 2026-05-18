import { notFound } from "next/navigation";
import { FokusEnglishPage } from "@/components/public-site/FokusEnglishPage";
import { englishFocusPages, getEnglishFocusPage } from "@/data/english-focus-pages";
import { fokusPageHeroImages } from "@/data/site-images";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return englishFocusPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
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
  const page = getEnglishFocusPage(slug);
  if (!page) notFound();

  return <FokusEnglishPage page={page} />;
}
