import { ProjectFitCheck } from "@/components/public-site/ProjectFitCheck";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";

export const metadata = {
  title: "Project Reality Check | Abexis",
  description:
    "Projekte laufen selten falsch — aber oft in die falsche Richtung. Der Abexis Project Reality Check zeigt in kurzer Zeit, wo Ihr Projekt steht und was jetzt entschieden werden muss. Modular: Light, Core, Deep Dive.",
};

export default function ProjectFitCheckPage() {
  return (
    <>
      <SchemaMarkup
        type="BreadcrumbList"
        data={[
          { name: "Startseite", url: "/" },
          { name: "Project Reality Check", url: "/projectfitcheck" },
        ]}
      />
      <ProjectFitCheck />
    </>
  );
}
