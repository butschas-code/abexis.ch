import { readFileSync } from "node:fs";
import path from "node:path";
import { SafeHtml } from "@/components/content/SafeHtml";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";

export const metadata = { title: "Impressum" };

export default function LegalPolicyPage() {
  const html = readFileSync(path.join(process.cwd(), "src/data/impressum-body.html"), "utf8");
  return (
    <InteriorPageLayout eyebrow="Rechtliches" title="Impressum" maxWidth="1068" contentMaxWidth="3xl" contentClassName="pt-10 md:pt-12">
      <SchemaMarkup
        path="/legal-policy"
        name="Impressum"
        breadcrumbs={[
          { name: "Startseite", url: "/" },
          { name: "Impressum", url: "/legal-policy" },
        ]}
      />
      <SafeHtml html={html} />
    </InteriorPageLayout>
  );
}
