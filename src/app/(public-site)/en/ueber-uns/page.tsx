import { PublicImage as Image } from "@/components/site/PublicImage";
import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";
import { danielSengstagContentEn } from "@/data/daniel-sengstag";
import { homeTestimonialsEn } from "@/data/home-testimonials";
import { footerPartners, teamOrder, teamProfiles } from "@/data/pages";
import { teamProfilesEn } from "@/data/team-profiles-en";

export const metadata = {
  title: "About us | Abexis",
  description: "Meet the team behind Abexis: management consulting with substance.",
  openGraph: {
    title: "About us | Abexis",
    description: "Experienced guidance with substance: meet our team.",
  },
};

export default function EnglishAboutPage() {
  return (
    <>
      <InteriorPageLayout
        eyebrow="About us"
        title="Experienced guidance with substance"
        description={
          <div className="space-y-4">
            <p>We support you on your path to success and take responsibility together with you.</p>
            <p>
              Our expertise in strategy, sales &amp; marketing, digitalization, change management and business
              leadership is a key factor in your company&apos;s success.
            </p>
            <p>
              We also act as sparring partners for entrepreneurs and executives. In an open dialogue, we discuss current
              business challenges with our counterparts.
            </p>
          </div>
        }
      >
        <SchemaMarkup
          type="About"
          path="/en/ueber-uns"
          name="About us | Abexis"
          description="Meet the team behind Abexis: management consulting with substance."
          breadcrumbs={[
            { name: "Home", url: "/en/home" },
            { name: "About us", url: "/en/ueber-uns" },
          ]}
        />
        <h2 id="team" className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
          Team
        </h2>
        <div className="mt-6 grid items-stretch gap-6 md:grid-cols-2">
          {teamOrder.map((slug) => {
            const p = teamProfiles[slug];
            const english = teamProfilesEn[slug];
            const isDaniel = slug === "danielsengstag";
            const profileTitle = isDaniel ? danielSengstagContentEn.hero.credentials : english.title;
            const profileBody = isDaniel ? danielSengstagContentEn.hero.lead : english.body;
            return isDaniel ? (
              <article
                key={slug}
                className="flex flex-col overflow-hidden rounded-[28px] bg-white shadow-[var(--apple-shadow)] ring-1 ring-black/[0.04] transition-shadow duration-300 hover:shadow-[var(--apple-shadow-lg)] hover:ring-brand-500/20 sm:flex-row md:col-span-2"
              >
                <Link
                  href={`/en/${slug}`}
                  className="relative shrink-0 bg-[#f0f1f5] outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 sm:w-56 md:w-64"
                  aria-label={`Profile: ${p.name}`}
                  style={{ minHeight: 240 }}
                >
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    className="object-cover object-top transition-opacity hover:opacity-95"
                    quality={95}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 224px, 256px"
                  />
                </Link>

                <div className="flex flex-1 flex-col gap-0 p-7 md:p-8">
                  <div>
                    <h3 className="text-[22px] font-semibold tracking-[-0.025em] text-[#1d1d1f]">
                      <Link href={`/en/${slug}`} className="transition-colors duration-200 hover:text-brand-900">
                        {p.name}
                      </Link>
                    </h3>
                    <p className="mt-1.5 text-[13px] font-medium leading-snug text-[#86868b]">{profileTitle}</p>
                  </div>

                  <p className="mt-4 line-clamp-4 text-[15px] leading-relaxed text-[#6e6e73]">{profileBody}</p>

                  <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-black/[0.06] pt-5">
                    <Link
                      href={`/en/${slug}`}
                      className="group inline-flex items-center gap-1.5 rounded-full border border-brand-900/20 px-4 py-2 text-[13px] font-semibold text-brand-900 transition-all duration-200 hover:border-brand-900/40 hover:bg-brand-900/[0.04]"
                    >
                      Learn more
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">
                        <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                    <Link
                      href="/en/kontakt"
                      className="inline-flex min-h-[38px] items-center justify-center rounded-full bg-brand-900 px-5 text-[13px] font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-px hover:bg-[var(--brand-900-hover)] hover:shadow-md hover:shadow-brand-900/25 active:translate-y-0"
                    >
                      Contact Abexis
                    </Link>
                  </div>
                </div>
              </article>
            ) : (
              <article
                key={slug}
                className="flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] bg-white p-6 shadow-[var(--apple-shadow)] ring-1 ring-black/[0.04] transition-shadow duration-300 hover:shadow-[var(--apple-shadow-lg)] hover:ring-brand-500/20"
              >
                <div className="flex min-w-0 gap-4">
                  <Link
                    href={`/en/${slug}`}
                    className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-[#f5f5f7] outline-none ring-1 ring-black/[0.06] transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                    aria-label={`Profile: ${p.name}`}
                  >
                    <Image src={p.image} alt="" fill className="object-cover object-top" quality={95} sizes="72px" />
                  </Link>
                  <div className="min-w-0 pt-0.5">
                    <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
                      <Link href={`/en/${slug}`} className="transition-colors duration-200 hover:text-brand-900">
                        {p.name}
                      </Link>
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[12.5px] font-medium leading-snug text-[#86868b]">
                      {profileTitle}
                    </p>
                  </div>
                </div>
                <p className="mt-4 line-clamp-3 text-[14.5px] leading-relaxed text-[#6e6e73]">{profileBody}</p>
                <div className="mt-auto border-t border-black/[0.06] pt-4">
                  <Link
                    href={`/en/${slug}`}
                    className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-900 transition-colors duration-200 hover:text-brand-500"
                  >
                    Learn more
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">
                      <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <MotionSection className="mt-16 border-t border-black/[0.06] pt-14">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Partnerships</h2>
          <p className="mt-3 max-w-3xl text-[17px] leading-relaxed text-[#6e6e73]">
            We work with various well-known organizations, have built strategic partnerships and are members of selected
            associations and professional bodies:
          </p>
          <ul className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
            {footerPartners.map((p) => (
              <li key={p.href}>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={p.label}
                  className="flex h-16 items-center justify-center rounded-xl bg-white p-3 grayscale ring-1 ring-black/[0.06] transition-all duration-200 hover:grayscale-0 hover:shadow-md hover:ring-brand-500/20"
                >
                  <Image src={p.logo} alt={p.label} width={120} height={48} className="h-full w-full object-contain" sizes="120px" />
                </a>
              </li>
            ))}
          </ul>
        </MotionSection>
      </InteriorPageLayout>

      <MotionSection>
        <TestimonialsSection
          eyebrow="References"
          headline="Results from practice."
          intro="Voices from executives and partners, published with permission."
          items={homeTestimonialsEn}
        />
      </MotionSection>
    </>
  );
}
