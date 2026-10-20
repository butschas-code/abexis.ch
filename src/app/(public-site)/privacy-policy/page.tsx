import { readFileSync } from "node:fs";
import path from "node:path";
import { SafeHtml } from "@/components/content/SafeHtml";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { localizedAlternates } from "@/lib/seo/localized-metadata";

export const metadata = { title: "Datenschutzerklärung", description: "Datenschutzerklärung der Abexis Website, Kontaktformulare und Bewerbungen.", alternates: localizedAlternates("/privacy-policy", "/en/privacy-policy", "de") };

export default function PrivacyPolicyPage() {
  const html = readFileSync(path.join(process.cwd(), "src/data/privacy-bodies.html"), "utf8");
  return (
    <InteriorPageLayout
      eyebrow="Rechtliches"
      title="Datenschutzerklärung"
      maxWidth="1068"
      contentMaxWidth="3xl"
      contentClassName="pt-10 md:pt-12"
    >
      <SchemaMarkup
        path="/privacy-policy"
        name="Datenschutzerklärung"
        breadcrumbs={[
          { name: "Startseite", url: "/" },
          { name: "Datenschutz", url: "/privacy-policy" },
        ]}
      />
      <SafeHtml html={html} />
    </InteriorPageLayout>
  );
}
