import { ProjectFitCheck } from "@/components/public-site/ProjectFitCheck";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";

export const metadata = {
  title: "Project Reality Check | Abexis",
  description: "A compact Abexis assessment for projects that need clarity on risks, governance and next decisions.",
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
      <ProjectFitCheck locale="en" />
    </>
  );
}
