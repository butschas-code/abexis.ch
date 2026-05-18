import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";
import { siteConfig } from "@/data/pages";

export const metadata = {
  title: "Book a call | Abexis",
  description: "Schedule a non-binding introductory conversation with Abexis.",
};

export default function EnglishTerminPage() {
  return (
    <InteriorPageLayout
      eyebrow="Contact"
      title="Book a call"
      description={<p>For a non-binding first exchange, choose a convenient time directly in our calendar.</p>}
    >
      <SchemaMarkup
        path="/en/termin"
        name="Book a call"
        breadcrumbs={[
          { name: "Home", url: "/en/home" },
          { name: "Book a call", url: "/en/termin" },
        ]}
      />
      <a
        href={siteConfig.bookingUrlEn}
        className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-brand-900 px-8 text-[17px] font-medium text-white shadow-lg shadow-brand-900/30 transition-all duration-200 ease-out hover:bg-[var(--brand-900-hover)] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
        rel="noreferrer"
      >
        Schedule appointment
      </a>
    </InteriorPageLayout>
  );
}
