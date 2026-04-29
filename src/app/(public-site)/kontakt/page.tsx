import Link from "next/link";
import { BookingCta } from "@/components/site/BookingCta";
import { KontaktPageForm } from "@/components/site/KontaktPageForm";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";
import { siteConfig } from "@/data/pages";
import { kontaktPageHeroImage } from "@/data/site-images";
import { getResolvedPublicDeploymentSite } from "@/public-site/site/resolve";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";

export const metadata = {
  title: "Kontakt",
  description: "Wir freuen uns auf Ihre Kontaktaufnahme : per Telefon, E-Mail oder Kontaktformular.",
  openGraph: {
    title: "Kontakt | Abexis",
    description: "Wir freuen uns auf Ihre Kontaktaufnahme : Unverbindlicher Austausch oder konkrete Anfrage.",
    images: [{ url: kontaktPageHeroImage }],
  },
};

export default async function KontaktPage() {
  const deployment = await getResolvedPublicDeploymentSite();

  if (deployment === "search") {
    return (
      <InteriorPageLayout
        eyebrow="Kontakt"
        title="Nachricht oder Suchbrief"
        heroImage={kontaktPageHeroImage}
        description={
          <p>
            Teilen Sie uns Ihr Anliegen mit : wir behandeln Ihre Angaben vertraulich und melden uns zurück, sobald es
            sachlich passt.
          </p>
        }
      >
        <SchemaMarkup
          type="Contact"
          path="/kontakt"
          breadcrumbs={[
            { name: "Startseite", url: "/" },
            { name: "Kontakt", url: "/kontakt" },
          ]}
        />
        <KontaktPageForm bookingUrl={siteConfig.bookingUrlDe} site="search" />

        <div className="mt-14 rounded-[28px] border border-black/[0.06] bg-white/80 p-8 shadow-sm ring-1 ring-black/[0.03] md:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">Direkt erreichen</p>
            <dl className="mt-6 space-y-6 text-[15px]">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#86868b]">E-Mail</dt>
                <dd className="mt-2">
                  <a
                    className="font-medium text-brand-900 underline-offset-4 transition-colors hover:text-brand-500 hover:underline"
                    href={`mailto:${siteConfig.emailPrimary}`}
                  >
                    {siteConfig.emailPrimary}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#86868b]">Telefon</dt>
                <dd className="mt-2">
                  <a
                    className="font-medium text-brand-900 underline-offset-4 transition-colors hover:text-brand-500 hover:underline"
                    href={`tel:${siteConfig.phoneTel}`}
                  >
                    {siteConfig.phoneDisplay}
                  </a>
                </dd>
              </div>
            </dl>
            <p className="mt-8 text-[13px] leading-relaxed text-[#86868b]">
              Rechtliche Hinweise:{" "}
              <Link className="font-medium text-brand-900 underline-offset-4 hover:text-brand-500 hover:underline" href="/legal-policy">
                Impressum
              </Link>
              {" · "}
              <Link className="font-medium text-brand-900 underline-offset-4 hover:text-brand-500 hover:underline" href="/privacy-policy">
                Datenschutz
              </Link>
              .
            </p>
          </div>
      </InteriorPageLayout>
    );
  }

  return (
    <InteriorPageLayout
      eyebrow="Kontakt"
      title="Wir freuen uns auf Ihre Kontaktaufnahme"
      heroImage={kontaktPageHeroImage}
      description={
        <p>
          Schreiben Sie uns über das Formular : oder erreichen Sie uns direkt per E-Mail und Telefon. Einen Termin können
          Sie bei Bedarf auch online wählen.
        </p>
      }
    >
      <SchemaMarkup
        type="Contact"
        path="/kontakt"
        breadcrumbs={[
          { name: "Startseite", url: "/" },
          { name: "Kontakt", url: "/kontakt" },
        ]}
      />
      <div className="flex flex-col gap-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="rounded-[28px] bg-white p-8 shadow-[var(--apple-shadow)] ring-1 ring-black/[0.04] md:p-10">
            <dl className="space-y-8 text-[15px]">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">Anschrift</dt>
                <dd className="mt-2 leading-relaxed text-[#1d1d1f]">
                  Abexis GmbH
                  <br />
                  Zihlstrasse 25
                  <br />
                  8340 Hinwil
                  <br />
                  Schweiz
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">E-Mail</dt>
                <dd className="mt-2">
                  <a
                    className="font-medium text-brand-900 underline-offset-4 transition-colors hover:text-brand-500 hover:underline"
                    href={`mailto:${siteConfig.emailPrimary}`}
                  >
                    {siteConfig.emailPrimary}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">Telefon</dt>
                <dd className="mt-2">
                  <a
                    className="font-medium text-brand-900 underline-offset-4 transition-colors hover:text-brand-500 hover:underline"
                    href={`tel:${siteConfig.phoneTel}`}
                  >
                    {siteConfig.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">Social</dt>
                <dd className="mt-2 flex flex-wrap gap-6">
                  <a
                    className="font-medium text-brand-900 underline-offset-4 transition-colors hover:text-brand-500 hover:underline"
                    href={siteConfig.linkedin}
                  >
                    LinkedIn
                  </a>
                </dd>
              </div>
            </dl>
          </div>
          <BookingCta />
        </div>
        <KontaktPageForm bookingUrl={siteConfig.bookingUrlDe} site="abexis" />
      </div>
    </InteriorPageLayout>
  );
}
