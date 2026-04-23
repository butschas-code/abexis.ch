import Image from "next/image";
import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";
import { footerPartners, homeAboutTeaser, teamOrder, teamProfiles } from "@/data/pages";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";

export const metadata = {
  title: "Über uns",
  description: "Erfahren Sie mehr über das Team hinter Abexis — Managementberatung mit Substanz.",
  openGraph: {
    title: "Über uns | Abexis",
    description: "Begleitung mit Erfahrung und Substanz — Lernen Sie unser Team kennen.",
  },
};

export default function UeberUnsPage() {
  return (
    <InteriorPageLayout
      eyebrow="Über uns"
      title="Begleitung mit Erfahrung und Substanz"
      description={<p className="whitespace-pre-line">{homeAboutTeaser}</p>}
    >
      <SchemaMarkup
        type="BreadcrumbList"
        data={[
          { name: "Startseite", url: "/" },
          { name: "Über uns", url: "/ueber-uns" },
        ]}
      />
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Team</h2>
      <div className="mt-6 grid items-stretch gap-6 md:grid-cols-2">
        {teamOrder.map((slug) => {
          const p = teamProfiles[slug];
          return (
            <article
              key={slug}
              className="flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] bg-white p-6 shadow-[var(--apple-shadow)] ring-1 ring-black/[0.04] transition-shadow duration-300 hover:shadow-[var(--apple-shadow-lg)] hover:ring-brand-500/20"
            >
              <div className="flex gap-5">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#f5f5f7] ring-1 ring-black/[0.06]">
                  <Image src={p.image} alt={p.name} fill className="object-cover" sizes="96px" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
                    <Link
                      href={`/${slug}`}
                      className="transition-colors duration-200 hover:text-brand-900 hover:underline hover:decoration-brand-500/60 hover:underline-offset-4"
                    >
                      {p.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-[13px] font-medium text-[#86868b]">{p.title}</p>
                </div>
              </div>
              <p className="mt-5 flex-1 whitespace-pre-line text-[15px] leading-relaxed text-[#6e6e73]">{p.body}</p>
              <Link
                href="/kontakt"
                className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-brand-900 px-6 text-[15px] font-medium text-white transition-all duration-200 ease-out hover:bg-[var(--brand-900-hover)] hover:shadow-lg hover:shadow-brand-900/25 hover:-translate-y-0.5 active:translate-y-0 sm:w-auto sm:self-start"
              >
                Kontakt aufnehmen
              </Link>
            </article>
          );
        })}
      </div>

      <MotionSection className="mt-16 border-t border-black/[0.06] pt-14">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Partnerschaften</h2>
        <p className="mt-3 max-w-3xl text-[17px] leading-relaxed text-[#6e6e73]">
          Wir arbeiten mit verschiedenen namhaften Unternehmen zusammen und haben strategische Partnerschaften aufgebaut.
          Auch sind wir Mitglied verschiedener Verbände und Fachvereine:
        </p>
        <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-[15px]">
          {footerPartners.map((p) => {
            const external = p.href.startsWith("http://") || p.href.startsWith("https://");
            return (
              <li key={p.href}>
                {external ? (
                  <a
                    href={p.href}
                    className="font-medium text-brand-900 underline-offset-4 transition-colors hover:text-brand-500 hover:underline"
                    rel="noopener noreferrer"
                  >
                    {p.label}
                  </a>
                ) : (
                  <Link
                    href={p.href}
                    className="font-medium text-brand-900 underline-offset-4 transition-colors hover:text-brand-500 hover:underline"
                  >
                    {p.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </MotionSection>
    </InteriorPageLayout>
  );
}
