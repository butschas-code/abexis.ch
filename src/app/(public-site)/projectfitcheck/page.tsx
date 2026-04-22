import { notFound } from "next/navigation";
import { SafeHtml } from "@/components/content/SafeHtml";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";
import { getFokusthemaHtml } from "@/data/pages";
import { projectFitVisual } from "@/data/site-images";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";

export const metadata = { title: "Project Fit Check" };

export default function ProjectFitCheckPage() {
  const html = getFokusthemaHtml("projectfitcheck");
  if (!html) {
    notFound();
  }
  return (
    <InteriorPageLayout
      eyebrow="Angebot"
      title="Project Fit Check"
      description={
        <p>Strukturierte Projekt-Reviews in klar definierten Paketen — Inhalt und Darstellung wie auf der bisherigen Website.</p>
      }
      maxWidth="1068"
      contentMaxWidth="4xl"
      contentClassName="pt-10 md:pt-12"
      heroImage={projectFitVisual}
    >
      <SchemaMarkup
        type="BreadcrumbList"
        data={[
          { name: "Startseite", url: "/" },
          { name: "Project Fit Check", url: "/projectfitcheck" },
        ]}
      />
      <SafeHtml html={html} />
    </InteriorPageLayout>
  );
}
