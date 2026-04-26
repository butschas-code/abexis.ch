import Image from "next/image";
import { AboutTeamGrid } from "@/components/home/AboutTeamGrid";
import { homeWhoWeAreContent } from "@/data/home-page-content";
import { teamProfiles } from "@/data/pages";
import { MotionSection } from "@/components/motion/MotionSection";

export function HomeWhoWeAreSection() {
  const c = homeWhoWeAreContent;
  const daniel = teamProfiles.danielsengstag;

  return (
    <MotionSection className="py-20 md:py-28">
      <div className="mx-auto max-w-[1068px] px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{c.eyebrow}</p>
        <h2 className="mt-2 max-w-[32ch] text-[32px] font-semibold tracking-[-0.03em] text-[#1d1d1f] text-balance md:text-[40px]">
          {c.headline}
        </h2>
        <div className="mt-6 max-w-[56ch] space-y-4 text-[17px] leading-relaxed text-[#6e6e73]">
          {c.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-14 grid items-start gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
          <div className="mx-auto w-full max-w-md md:mx-0 md:max-w-none">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] bg-[#f5f5f7] shadow-[var(--apple-shadow)] ring-1 ring-black/[0.05]">
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
          <div className="min-w-0">
            <p className="text-[20px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
              {c.daniel.name} — {c.daniel.role}
            </p>
            <div className="mt-4 space-y-3 text-[16px] leading-relaxed text-[#6e6e73]">
              {c.daniel.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14">
          <AboutTeamGrid />
        </div>
      </div>
    </MotionSection>
  );
}
