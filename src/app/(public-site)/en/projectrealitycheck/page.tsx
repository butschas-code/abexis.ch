import { ProjectFitCheck } from "@/components/public-site/ProjectFitCheck";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { ProjectSelfTest } from "@/components/project-reality-check/ProjectSelfTest";
import { localizedAlternates } from "@/lib/seo/localized-metadata";

export const metadata = {
  title: "Project Reality Check",
  description: "A compact Abexis assessment for projects that need clarity on risks, governance and next decisions.",
  alternates: localizedAlternates("/projectrealitycheck", "/en/projectrealitycheck", "en"),
};

export default function EnglishProjectRealityCheckPage() {
  return (
    <>
      <SchemaMarkup
        type="Service"
        path="/en/projectrealitycheck"
        name="Project Reality Check | Abexis"
        description="A compact Abexis assessment for projects that need clarity on risks, governance and next decisions."
        breadcrumbs={[
          { name: "Home", url: "/en/home" },
          { name: "Project Reality Check", url: "/en/projectrealitycheck" },
        ]}
      />
      <ProjectFitCheck locale="en" afterHero={<ProjectSelfTest locale="en" id="project-self-test" />} />
    </>
  );
}
