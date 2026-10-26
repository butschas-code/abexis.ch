import { notFound } from "next/navigation";
import { FokusEnglishPage } from "@/components/public-site/FokusEnglishPage";
import { FokusRisikomanagement } from "@/components/public-site/FokusRisikomanagement";
import { FokusPlmPdm } from "@/components/public-site/FokusPlmPdm";
import { FokusVirtualManagementOffice } from "@/components/public-site/FokusVirtualManagementOffice";
import { getRisikomanagementContent } from "@/data/risikomanagement-content";
import { getPlmPdmContent } from "@/data/plm-pdm-content";
import { getVmoContent } from "@/data/vmo-content";
import { englishFocusPages, getEnglishFocusPage } from "@/data/english-focus-pages";
import { fokusPageHeroImages } from "@/data/site-images";
import { ServiceGuidePromo } from "@/components/public-site/ServiceGuidePage";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [...englishFocusPages.map((page) => ({ slug: page.slug })), { slug: "risikomanagement" }, { slug: "plm-pdm" }, { slug: "virtual-management-office" }];
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (slug === "risikomanagement") {
    const content = getRisikomanagementContent("en");
    const heroImage = fokusPageHeroImages.risikomanagement;
    return {
      title: content.meta.title,
      description: content.meta.excerpt,
      alternates: { canonical: `/en/fokusthemen/${slug}`, languages: { "de-CH": `/fokusthemen/${slug}`, "en-CH": `/en/fokusthemen/${slug}`, "x-default": `/fokusthemen/${slug}` } },
      openGraph: {
        title: content.meta.title,
        description: content.meta.excerpt,
        url: `/en/fokusthemen/${slug}`,
        locale: "en_CH",
        alternateLocale: ["de_CH"],
        images: [{ url: heroImage }],
      },
    };
  }
  if (slug === "plm-pdm") {
    const content = getPlmPdmContent("en");
    const heroImage = fokusPageHeroImages["plm-pdm"];
    const canonical = "/en/fokusthemen/plm-pdm";
    const german = "/fokusthemen/plm-pdm";
    return {
      title: content.meta.title,
      description: content.meta.excerpt,
      alternates: { canonical, languages: { "de-CH": german, "en-CH": canonical, "x-default": german } },
      openGraph: {
        title: `${content.meta.title} | Abexis`,
        description: content.meta.excerpt,
        url: canonical,
        locale: "en_CH",
        alternateLocale: ["de_CH"],
        images: [{ url: heroImage }],
      },
    };
  }
  if (slug === "virtual-management-office") {
    const content = getVmoContent("en");
    const canonical = "/en/fokusthemen/virtual-management-office";
    const german = "/fokusthemen/virtual-management-office";
    return {
      title: content.meta.seoTitle,
      description: content.meta.excerpt,
      alternates: { canonical, languages: { "de-CH": german, "en-CH": canonical, "x-default": german } },
      openGraph: {
        title: `${content.meta.seoTitle} | Abexis`,
        description: content.meta.excerpt,
        url: canonical,
        locale: "en_CH",
        alternateLocale: ["de_CH"],
        images: [{ url: fokusPageHeroImages["virtual-management-office"] }],
      },
    };
  }
  const page = getEnglishFocusPage(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.excerpt,
    alternates: { canonical: `/en/fokusthemen/${slug}`, languages: { "de-CH": `/fokusthemen/${slug}`, "en-CH": `/en/fokusthemen/${slug}`, "x-default": `/fokusthemen/${slug}` } },
    openGraph: {
      title: page.title,
      description: page.excerpt,
      url: `/en/fokusthemen/${slug}`,
      locale: "en_CH",
      alternateLocale: ["de_CH"],
      images: [{ url: fokusPageHeroImages[page.slug] }],
    },
  };
}

export default async function EnglishTopicPage({ params }: Props) {
  const { slug } = await params;
  if (slug === "risikomanagement") return <><FokusRisikomanagement locale="en" /><ServiceGuidePromo parent={slug} locale="en" /></>;
  if (slug === "plm-pdm") return <FokusPlmPdm locale="en" />;
  if (slug === "virtual-management-office") return <FokusVirtualManagementOffice locale="en" />;

  const page = getEnglishFocusPage(slug);
  if (!page) notFound();

  return <><FokusEnglishPage page={page} /><ServiceGuidePromo parent={slug} locale="en" /></>;
}
