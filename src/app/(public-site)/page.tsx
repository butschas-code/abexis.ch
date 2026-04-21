import Image from "next/image";
import Link from "next/link";
import { HomeBlogTeasers } from "@/components/home/HomeBlogTeasers";
import { HomeHero } from "@/components/home/HomeHero";
import { WelcomeSection } from "@/components/home/WelcomeSection";
import { SituationsSection } from "@/components/home/SituationsSection";
import { MotionSection } from "@/components/motion/MotionSection";
import { StaggerLines } from "@/components/motion/StaggerLines";
import { BrandGrad } from "@/components/ui/BrandGrad";
import {
  homeAboutTeaser,
  homeIntroLines,
  homeLeadParagraph,
  homeServiceTeasers,
  siteConfig,
} from "@/data/pages";
import { AboutTeamGrid } from "@/components/home/AboutTeamGrid";
import { PartnershipsMarquee } from "@/components/home/PartnershipsMarquee";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { fokusPageHeroImages, serviceCardImages } from "@/data/site-images";

type ServiceSlug = keyof typeof serviceCardImages;

/**
 * Home blog teasers read live Firestore (`getPublishedCmsPosts`). Avoid ISR here so removed or
 * unpublished posts disappear immediately on `/` (blog index already uses `force-dynamic`).
 */
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <HomeHero>
        <div className="max-w-[36rem] md:max-w-[40rem]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">Abexis Consulting</p>
          <h1 className="mt-3 text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-white text-balance md:text-[56px] md:leading-[1.02]">
            Managementberatung mit{" "}
            <BrandGrad variant="dark">Tiefe, Tempo und Verantwortung</BrandGrad>
          </h1>
          <p className="mt-6 text-[19px] font-normal leading-relaxed text-white/88 md:text-[21px]">{homeLeadParagraph}</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/kontakt"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-brand-900 px-8 text-[17px] font-medium text-white shadow-lg shadow-brand-900/35 transition-all duration-200 ease-out hover:bg-[var(--brand-900-hover)] hover:shadow-xl hover:shadow-brand-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              Kontakt aufnehmen
            </Link>
            <Link
              href="/leistungen"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/35 bg-white/10 px-8 text-[17px] font-medium text-white backdrop-blur-sm transition-all duration-200 ease-out hover:border-white/60 hover:bg-white/22 hover:shadow-lg hover:shadow-black/15 hover:-translate-y-0.5 active:translate-y-0"
            >
              Leistungen
            </Link>
          </div>
          <StaggerLines className="mt-12 space-y-3 border-l border-white/45 pl-5 [&_p]:text-[13px] [&_p]:font-medium [&_p]:uppercase [&_p]:tracking-[0.12em] [&_p]:text-white/[0.88] [&_p]:leading-snug [&_p]:[text-shadow:0_1px_12px_rgba(0,0,0,0.45)]">
            {homeIntroLines.map((line) => (
              <p key={line}>
                {line}
              </p>
            ))}
          </StaggerLines>
        </div>
      </HomeHero>

      <WelcomeSection />

      <MotionSection className="apple-animated-gradient py-20 md:py-28">
        <div className="mx-auto max-w-[1068px] px-6">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Leistungen</p>
          <h2 className="mx-auto mt-2 max-w-[24ch] text-center text-[40px] font-semibold tracking-[-0.03em] text-[#1d1d1f] md:text-[48px]">
            Schwerpunkte der Beratung
          </h2>
          <p className="mx-auto mt-4 max-w-[54ch] text-center text-[17px] leading-relaxed text-[#6e6e73]">
            Vertiefende Inhalte finden Sie auf den bestehenden Themenseiten — inklusive Originaltext und Bildmaterial.
          </p>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {homeServiceTeasers.map((s) => {
              const img = serviceCardImages[s.slug as ServiceSlug];
              return (
                <Link
                  key={s.slug}
                  href={s.href}
                  className="group flex flex-col overflow-hidden rounded-[28px] bg-white shadow-[var(--apple-shadow)] ring-1 ring-black/[0.04] transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--apple-shadow-lg)] hover:ring-brand-500/25"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f5f5f7]">
                    <Image
                      src={img}
                      alt=""
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                      sizes="(min-width: 1024px) 30vw, 90vw"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition group-hover:opacity-100" />
                  </div>
                  <div className="flex flex-1 flex-col px-6 pb-8 pt-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#86868b]">{s.subtitle}</p>
                    <h3 className="mt-2 text-[21px] font-semibold leading-snug tracking-[-0.02em] text-[#1d1d1f]">
                      {s.title}
                    </h3>
                    <p className="mt-3 flex-1 text-[14px] leading-relaxed text-[#6e6e73]">{s.excerpt}</p>
                    <span className="mt-5 inline-flex text-[14px] font-medium text-brand-900 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-brand-500">
                      Mehr erfahren →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </MotionSection>

      <MotionSection>
        <SituationsSection />
      </MotionSection>

      <MotionSection className="py-20 md:py-28">
        <div className="mx-auto grid max-w-[1068px] items-center gap-12 px-6 lg:grid-cols-[1fr_1.05fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] bg-[#f5f5f7] shadow-[var(--apple-shadow-lg)] ring-1 ring-black/[0.05]">
            <Image
              src={fokusPageHeroImages.prozessoptimierung}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Vorgehen</p>
            <h2 className="mt-2 text-[32px] font-semibold tracking-[-0.03em] text-[#1d1d1f] md:text-[40px]">
              Wie wir zusammenarbeiten
            </h2>
            <ol className="mt-10 space-y-8">
              {[
                {
                  t: "Situation verstehen",
                  d: "Kontext, Stakeholder, Ziele und Rahmenbedingungen präzise erfassen — analytisch und pragmatisch.",
                },
                {
                  t: "Klarheit schaffen",
                  d: "Optionen bewerten, Entscheidungsgrundlagen liefern, Prioritäten und nächste Schritte definieren.",
                },
                {
                  t: "Umsetzung begleiten",
                  d: "Von der Planung bis zur Wirksamkeit im Alltag — mit messbarer Steuerung und Verantwortung.",
                },
              ].map((step, i) => (
                <li key={step.t} className="flex gap-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5f5f7] text-[13px] font-semibold text-[#1d1d1f]">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[19px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">{step.t}</p>
                    <p className="mt-1 text-[15px] leading-relaxed text-[#6e6e73]">{step.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </MotionSection>

      <HomeBlogTeasers />

      <MotionSection className="border-y border-black/[0.06] bg-white py-20 md:py-28">
        <div className="mx-auto max-w-[1068px] px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Über uns</p>
              <h2 className="mt-2 text-[32px] font-semibold tracking-[-0.03em] text-[#1d1d1f] md:text-[40px]">
                Erfahrung auf Augenhöhe
              </h2>
              <p className="mt-5 text-[17px] leading-relaxed text-[#6e6e73]">{homeAboutTeaser}</p>
              <Link
                href="/ueber-uns"
                className="mt-8 inline-flex text-[15px] font-medium text-brand-900 transition-colors duration-200 hover:text-brand-500 hover:underline"
              >
                Team & Partner
              </Link>
            </div>
            <AboutTeamGrid />
          </div>
        </div>
      </MotionSection>

      <MotionSection>
        <TestimonialsSection />
      </MotionSection>

      <MotionSection>
        <PartnershipsMarquee />
      </MotionSection>

      <MotionSection className="px-6 pt-16 pb-24 md:pt-28">
        <div className="relative mx-auto max-w-[1068px] overflow-hidden rounded-[32px] bg-gradient-to-br from-brand-900 via-[#2d3d8a] to-brand-500 px-8 py-14 text-center text-white md:px-16 md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "radial-gradient(circle at 18% 22%, rgba(255,255,255,0.38), transparent 42%), radial-gradient(circle at 82% 78%, rgba(69,179,226,0.45), transparent 45%), linear-gradient(160deg, rgba(38,51,124,0.2), transparent 55%)",
            }}
          />
          <div className="relative">
            <h2 className="text-[32px] font-semibold tracking-[-0.03em] md:text-[40px]">
              Unverbindlicher Austausch
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-white/90">
              Gerne klären wir in einem ersten Gespräch Passung, Vorgehen und nächste Schritte.
            </p>
            <a
              href={siteConfig.bookingUrlDe}
              className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-8 text-[17px] font-medium text-brand-900 transition-all duration-200 ease-out hover:bg-white hover:shadow-xl hover:shadow-brand-900/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
              rel="noreferrer"
            >
              Termin planen
            </a>
          </div>
        </div>
      </MotionSection>
    </>
  );
}
