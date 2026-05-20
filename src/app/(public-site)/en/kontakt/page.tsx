import { KontaktPageForm } from "@/components/site/KontaktPageForm";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";
import { siteConfig } from "@/data/pages";
import { kontaktPageHeroImage } from "@/data/site-images";

export const metadata = {
  title: "Contact | Abexis",
  description: "Contact Abexis by email, phone or schedule an introductory call.",
};

export default function EnglishContactPage() {
  return (
    <InteriorPageLayout
      eyebrow="Contact"
      title="We look forward to hearing from you"
      heroImage={kontaktPageHeroImage}
      description={<p>Reach us directly by email or phone, or schedule a non-binding introductory call online.</p>}
    >
      <div className="flex flex-col gap-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="rounded-[28px] bg-white p-8 shadow-[var(--apple-shadow)] ring-1 ring-black/[0.04] md:p-10">
            <dl className="space-y-8 text-[15px]">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">Head office</dt>
                <dd className="mt-2 whitespace-pre-line leading-relaxed text-[#1d1d1f]">
                  {siteConfig.company}
                  {"\n"}
                  {siteConfig.footerAddressHinwil}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">Additional location</dt>
                <dd className="mt-2 whitespace-pre-line leading-relaxed text-[#1d1d1f]">
                  {siteConfig.company}
                  {"\n"}
                  {siteConfig.footerAddressZurich}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">Email</dt>
                <dd className="mt-2">
                  <a className="font-medium text-brand-900 underline-offset-4 hover:underline" href={`mailto:${siteConfig.emailPrimary}`}>
                    {siteConfig.emailPrimary}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">Phone</dt>
                <dd className="mt-2">
                  <a className="font-medium text-brand-900 underline-offset-4 hover:underline" href={`tel:${siteConfig.phoneTel}`}>
                    {siteConfig.phoneDisplay}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
          <div className="rounded-[28px] bg-white p-8 shadow-[var(--apple-shadow)] ring-1 ring-black/[0.04] md:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">Online scheduling</p>
            <h2 className="mt-3 text-[22px] font-semibold tracking-[-0.02em] text-[#1d1d1f] md:text-[24px]">
              Book directly in the calendar
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[#6e6e73]">
              Choose a convenient time for an introductory conversation or a first exchange.
            </p>
            <a
              href={siteConfig.bookingUrlEn}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-[56px] items-center rounded-full bg-brand-900 px-8 text-[16px] font-medium text-white shadow-lg shadow-brand-900/28"
            >
              Book a call
            </a>
          </div>
        </div>
        <KontaktPageForm bookingUrl={siteConfig.bookingUrlEn} locale="en" />
      </div>
    </InteriorPageLayout>
  );
}
