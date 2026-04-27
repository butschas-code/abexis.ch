import { ProjectFitCheck } from "@/components/public-site/ProjectFitCheck";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";

export const metadata = {
  title: "Project Fit Check — Strukturiertes Projekt-Review | Abexis",
  description:
    "Ein unabhängiger Project Fit Check in 3, 5 oder 10 Tagen: Klare Standortbestimmung, Risikoanalyse und konkreter Massnahmenplan für Ihr Projekt.",
};

export default function ProjectFitCheckPage() {
  return (
    <>
      <SchemaMarkup
        type="BreadcrumbList"
        data={[
          { name: "Startseite", url: "/" },
          { name: "Project Fit Check", url: "/projectfitcheck" },
        ]}
      />
      <ProjectFitCheck />
    </>
  );
}
