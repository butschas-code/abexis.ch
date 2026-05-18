import { readFileSync } from "node:fs";
import path from "node:path";
import { SafeHtml } from "@/components/content/SafeHtml";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";

export const metadata = {
  title: "Privacy policy | Abexis",
  description: "Privacy policy for the Abexis website, contact forms and applications.",
};

export default function EnglishPrivacyPolicyPage() {
  const html = readFileSync(path.join(process.cwd(), "src/data/privacy-policy-en.html"), "utf8");
  return (
    <InteriorPageLayout eyebrow="Legal" title="Privacy policy" maxWidth="1068" contentMaxWidth="3xl" contentClassName="pt-10 md:pt-12">
      <SchemaMarkup
        path="/en/privacy-policy"
        name="Privacy policy"
        breadcrumbs={[
          { name: "Home", url: "/en/home" },
          { name: "Privacy policy", url: "/en/privacy-policy" },
        ]}
      />
      <SafeHtml html={html} />
    </InteriorPageLayout>
  );
}
