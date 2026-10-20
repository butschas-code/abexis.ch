import { GuideHubPage } from "@/components/public-site/GuideHubPage";
import { localizedAlternates } from "@/lib/seo/localized-metadata";

export const metadata = {
  title: "Guides for Management, Projects and Transformation",
  description: "Practical Abexis guides on strategy, transformation, projects, processes, risk, executive search and PLM/PDM.",
  alternates: localizedAlternates("/ratgeber", "/en/guides", "en"),
};

export default function GuidesPage() {
  return <GuideHubPage locale="en" />;
}
