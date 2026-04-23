"use client";

import Image from "next/image";
import Link from "next/link";
import { teamOrder, teamProfiles } from "@/data/pages";

export function AboutTeamGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
      {teamOrder.map((slug) => {
        const p = teamProfiles[slug];
        return (
          <Link
            key={slug}
            href={`/${slug}`}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-[#f5f5f7] shadow-sm ring-1 ring-black/[0.06] outline-none transition-[box-shadow,ring-color] duration-300 hover:shadow-[0_16px_40px_-12px_rgba(38,51,124,0.25)] hover:ring-brand-500/35 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            <Image
              src={p.image}
              alt=""
              fill
              className="object-cover saturate-[0.78] contrast-[1.08] transition duration-500 ease-out group-hover:scale-[1.05]"
              sizes="(min-width: 1024px) 220px, (min-width: 640px) 33vw, 50vw"
            />

            <div className="abexis-hero-image-overlay z-[1] opacity-0 transition-opacity duration-300 group-hover:opacity-55 group-focus-visible:opacity-55" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] translate-y-2 p-3 pt-10 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
              <p className="text-[13px] font-semibold leading-tight tracking-[-0.01em] text-white drop-shadow-sm sm:text-[14px]">
                {p.name}
              </p>
              {p.title ? (
                <p className="mt-1 line-clamp-4 text-[10px] font-medium leading-snug text-white/90 sm:text-[11px]">
                  {p.title}
                </p>
              ) : null}
            </div>
            <span className="sr-only">
              {p.name}
              {p.title ? `, ${p.title}` : ""}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
