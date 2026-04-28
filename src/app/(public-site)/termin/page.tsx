import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";
import { siteConfig } from "@/data/pages";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";

export const metadata = { title: "Termin buchen" };

export default function TerminPage() {
  return (
    <InteriorPageLayout
      eyebrow="Kontakt"
      title="Termin buchen"
      description={
        <p>Für einen unverbindlichen Austausch können Sie direkt einen Termin über die bestehende Kalenderfunktion wählen.</p>
      }
    >
      <SchemaMarkup
        path="/termin"
        name="Termin buchen"
        breadcrumbs={[
          { name: "Startseite", url: "/" },
          { name: "Termin buchen", url: "/termin" },
        ]}
      />
      <a
        href={siteConfig.bookingUrlDe}
        className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-brand-900 px-8 text-[17px] font-medium text-white shadow-lg shadow-brand-900/30 transition-all duration-200 ease-out hover:bg-[var(--brand-900-hover)] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
        rel="noreferrer"
      >
        Termin planen
      </a>
    </InteriorPageLayout>
  );
}
