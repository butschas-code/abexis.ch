import { readFileSync } from "node:fs";
import path from "node:path";
import { SafeHtml } from "@/components/content/SafeHtml";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";

export const metadata = {
  title: "Legal notice | Abexis",
  description: "Legal notice and company information for Abexis GmbH.",
};

export default function EnglishLegalPolicyPage() {
  const html = readFileSync(path.join(process.cwd(), "src/data/legal-notice-en.html"), "utf8");
  return (
    <InteriorPageLayout eyebrow="Legal" title="Legal notice" maxWidth="1068" contentMaxWidth="3xl" contentClassName="pt-10 md:pt-12">
      <SchemaMarkup
        path="/en/legal-policy"
        name="Legal notice"
        breadcrumbs={[
          { name: "Home", url: "/en/home" },
          { name: "Legal notice", url: "/en/legal-policy" },
        ]}
      />
      <SafeHtml html={html} />
    </InteriorPageLayout>
  );
}
