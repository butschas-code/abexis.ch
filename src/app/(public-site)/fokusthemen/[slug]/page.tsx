import { notFound } from "next/navigation";
import { SafeHtml } from "@/components/content/SafeHtml";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";
import { fokusthemenMeta, getFokusthemaHtml, normalizeFokusSlug } from "@/data/pages";
import { fokusPageHeroImages, homeHeroImage } from "@/data/site-images";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { FokusDigitaleTransformation } from "@/components/public-site/FokusDigitaleTransformation";
import { FokusUnternehmensstrategie } from "@/components/public-site/FokusUnternehmensstrategie";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return fokusthemenMeta.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const n = normalizeFokusSlug(slug);
  const meta = fokusthemenMeta.find((m) => m.slug === n);
  if (!meta) return {};

  const heroKey = n as keyof typeof fokusPageHeroImages;
  const heroImage = heroKey in fokusPageHeroImages ? fokusPageHeroImages[heroKey] : homeHeroImage;

  return {
    title: meta.title,
    description: meta.excerpt,
    openGraph: {
      title: `${meta.title} | Abexis`,
      description: meta.excerpt,
      images: [{ url: heroImage }],
    },
  };
}

export default async function FokusthemaPage({ params }: Props) {
  const { slug } = await params;
  const n = normalizeFokusSlug(slug);
  const html = getFokusthemaHtml(n);
  if (!html) notFound();

  if (n === "digitale-transformation") return <FokusDigitaleTransformation />;
  if (n === "unternehmensstrategie") return <FokusUnternehmensstrategie />;

  const meta = fokusthemenMeta.find((m) => m.slug === n);
  const heroKey = n as keyof typeof fokusPageHeroImages;
  const heroImage = heroKey in fokusPageHeroImages ? fokusPageHeroImages[heroKey] : homeHeroImage;

  return (
    <InteriorPageLayout
      eyebrow={meta?.subtitle ?? "Fokusthemen"}
      title={meta?.title ?? "Thema"}
      description={meta ? <p>{meta.excerpt}</p> : undefined}
      maxWidth="1068"
      contentMaxWidth="4xl"
      contentClassName="pt-10 md:pt-12"
      heroImage={heroImage}
    >
      {meta && <SchemaMarkup type="Service" data={meta} />}
      <SchemaMarkup
        type="BreadcrumbList"
        data={[
          { name: "Startseite", url: "/" },
          { name: "Leistungen", url: "/leistungen" },
          { name: meta?.title ?? "Thema", url: `/fokusthemen/${slug}` },
        ]}
      />
      <SafeHtml html={html} />
    </InteriorPageLayout>
  );
}
