"use client";

import Image from "next/image";
import Link from "next/link";
import { teamOrder, teamProfiles } from "@/data/pages";

export function AboutTeamGrid() {
  return (
    <div className="grid grid-cols-1 items-stretch gap-4 min-[420px]:grid-cols-2 min-[420px]:gap-3 sm:grid-cols-3 sm:gap-4">
      {teamOrder
        .filter((slug) => slug !== "danielsengstag")
        .map((slug) => {
          const p = teamProfiles[slug];
          return (
            <Link
              key={slug}
              href={`/${slug}`}
              className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.06] outline-none transition-[box-shadow,ring-color] duration-300 hover:shadow-[0_16px_40px_-12px_rgba(38,51,124,0.2)] hover:ring-brand-500/30 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              <div className="relative aspect-[5/4] w-full min-w-0 overflow-hidden bg-[#f5f5f7] min-[420px]:aspect-[4/5]">
                <Image
                  src={p.image}
                  alt=""
                  fill
                  quality={95}
                  sizes="(min-width: 1280px) 400px, (min-width: 1024px) 32vw, (min-width: 640px) 33vw, (min-width: 420px) 50vw, 100vw"
                  className="h-full w-full object-cover object-center"
                  priority={false}
                />
              </div>
              <div className="w-full shrink-0 border-t border-black/[0.06] px-4 py-3 min-[420px]:px-3.5 min-[420px]:py-2.5 sm:px-4 sm:py-2.5">
                <p className="text-[16px] font-semibold leading-snug text-[#1d1d1f] min-[420px]:text-[15px]">
                  {p.name}
                </p>
                {p.title ? (
                  <p className="mt-1.5 line-clamp-4 text-[15px] font-normal leading-relaxed text-[#6e6e73] min-[420px]:text-[15px]">
                    {p.title}
                  </p>
                ) : null}
                <p className="mt-2.5 flex items-center gap-1 text-[13px] font-medium text-brand-600">
                  Zum Profil
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </p>
              </div>
            </Link>
          );
        })}
    </div>
  );
}
