import Image from "next/image";
import Link from "next/link";
import { AboutTeamGrid } from "@/components/home/AboutTeamGrid";
import { homeWhoWeAreContent } from "@/data/home-page-content";
import { teamProfiles } from "@/data/pages";
import { MotionSection } from "@/components/motion/MotionSection";

export function HomeWhoWeAreSection() {
  const c = homeWhoWeAreContent;
  const daniel = teamProfiles.danielsengstag;

  return (
    <MotionSection className="relative isolate bg-white py-14 sm:py-20 md:py-28">
      <div className="mx-auto min-w-0 max-w-[1068px] pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:pl-6 sm:pr-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{c.eyebrow}</p>
        <h2 className="mt-2 max-w-full text-balance break-words text-[28px] font-semibold leading-none tracking-[-0.03em] text-[#1d1d1f] sm:max-w-[32ch] sm:text-[32px] md:text-[40px]">
          {c.headline}
        </h2>
        <div className="mt-5 max-w-[56ch] space-y-4 text-[16px] leading-relaxed text-[#6e6e73] sm:mt-6 sm:text-[17px]">
          {c.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-10 grid items-center gap-6 sm:mt-14 sm:gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
          <div className="mx-auto w-full max-w-md md:mx-0 md:max-w-none">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-[#f5f5f7] shadow-[var(--apple-shadow)] ring-1 ring-black/[0.05] sm:rounded-[24px] md:rounded-[28px]">
              <Image
                src={daniel.image}
                alt={daniel.name}
                fill
                className="object-cover object-center"
                quality={95}
                sizes="(min-width: 768px) 45vw, 100vw"
                priority={false}
              />
            </div>
          </div>
          <div className="min-w-0 text-center md:text-left">
            <p className="text-[18px] font-semibold leading-snug tracking-[-0.02em] text-[#1d1d1f] sm:text-[20px]">
              {c.daniel.name} — {c.daniel.role}
            </p>
            <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-[#6e6e73] sm:mt-4 sm:text-[16px]">
              {c.daniel.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-6 flex justify-center md:justify-start">
              <Link
                href="/danielsengstag"
                className="inline-flex min-h-[44px] touch-manipulation items-center justify-center rounded-full border border-black/[0.1] bg-white px-6 text-[15px] font-medium text-[#1d1d1f] transition hover:border-brand-500/30 hover:text-brand-900 active:scale-[0.99]"
              >
                Zum Profil
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-14">
          <AboutTeamGrid />
        </div>
      </div>
    </MotionSection>
  );
}
