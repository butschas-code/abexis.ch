import Link from "next/link";
import { KontaktMapIframe } from "@/components/site/KontaktMapIframe";
import { SearchBriefContactForm } from "@/components/site/search/SearchBriefContactForm";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";
import { siteConfig } from "@/data/pages";
import { kontaktPageHeroImage } from "@/data/site-images";
import { getResolvedPublicDeploymentSite } from "@/public-site/site/resolve";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";

export const metadata = {
  title: "Kontakt",
  description: "Wir freuen uns auf Ihre Kontaktaufnahme — per Telefon, E-Mail oder Kontaktformular.",
  openGraph: {
    title: "Kontakt | Abexis",
    description: "Wir freuen uns auf Ihre Kontaktaufnahme — Unverbindlicher Austausch oder konkrete Anfrage.",
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
            Teilen Sie uns Ihr Anliegen mit — wir behandeln Ihre Angaben vertraulich und melden uns zurück, sobald es
            sachlich passt.
          </p>
        }
      >
        <SchemaMarkup
          type="BreadcrumbList"
          data={[
            { name: "Startseite", url: "/" },
            { name: "Kontakt", url: "/kontakt" },
          ]}
        />
        <SearchBriefContactForm />

        <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
          <div className="rounded-[28px] border border-black/[0.06] bg-white/80 p-8 shadow-sm ring-1 ring-black/[0.03] md:p-10">
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
          <KontaktMapIframe />
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
        <p>Gerne können Sie auch einen Termin für einen unverbindlichen Austausch vereinbaren.</p>
      }
    >
      <SchemaMarkup
        type="BreadcrumbList"
        data={[
          { name: "Startseite", url: "/" },
          { name: "Kontakt", url: "/kontakt" },
        ]}
      />
      <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
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
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">Termin</dt>
              <dd className="mt-2">
                <a
                  className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-brand-900 px-6 text-[15px] font-medium text-white shadow-md shadow-brand-900/25 transition-all duration-200 hover:bg-[var(--brand-900-hover)] hover:shadow-lg"
                  href={siteConfig.bookingUrlDe}
                >
                  Termin planen (Outlook)
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
                <a
                  className="font-medium text-brand-900 underline-offset-4 transition-colors hover:text-brand-500 hover:underline"
                  href={siteConfig.xing}
                >
                  Xing
                </a>
              </dd>
            </div>
          </dl>
        </div>
        <KontaktMapIframe />
      </div>

      <p className="mt-10 text-[13px] leading-relaxed text-[#86868b]">
        Hinweis: Impressum mit Registerangaben und weiterer Adresse:{" "}
        <Link className="font-medium text-brand-900 underline-offset-4 hover:text-brand-500 hover:underline" href="/legal-policy">
          Impressum
        </Link>
        .
      </p>
    </InteriorPageLayout>
  );
}
