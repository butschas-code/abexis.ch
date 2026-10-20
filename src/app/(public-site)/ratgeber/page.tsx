import { GuideHubPage } from "@/components/public-site/GuideHubPage";
import { localizedAlternates } from "@/lib/seo/localized-metadata";

export const metadata = {
  title: "Ratgeber für Management, Projekte und Transformation",
  description: "Praxisnahe Abexis Ratgeber zu Strategie, Transformation, Projekten, Prozessen, Risiken, Executive Search und PLM/PDM.",
  alternates: localizedAlternates("/ratgeber", "/en/guides", "de"),
};

export default function RatgeberPage() {
  return <GuideHubPage locale="de" />;
}
