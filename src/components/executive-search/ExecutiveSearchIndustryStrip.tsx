"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PublicContentWidth } from "@/components/site/PublicContentWidth";

const SECTORS = [
  "Informationstechnologie & Digitalisierung",
  "Industrie",
  "Finanzen, Banking & Risk Management",
  "Öffentlicher Sektor & Verwaltung",
  "Beratung",
] as const;

function SectorTile({ label, index, reduce }: { label: string; index: number; reduce: boolean }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
      className="min-w-0"
    >
      <div className="relative flex min-h-[5.25rem] w-full overflow-hidden rounded-xl bg-gradient-to-br from-brand-900/85 via-[#2d3d8f] to-brand-500/75 p-px shadow-[0_8px_28px_rgba(38,51,124,0.12)] sm:min-h-[5.5rem]">
        <span className="flex w-full flex-1 items-center justify-center rounded-[11px] bg-white/95 px-3 py-3 text-center text-[13px] font-medium leading-snug text-balance text-[#1d1d1f] sm:px-4 sm:py-3.5 sm:text-[14px] sm:leading-normal">
          {label}
        </span>
      </div>
    </motion.div>
  );
}

/**
 * Five-column industry overview — matches Executive Search visual rhythm (same tile language as HomeSectorsGrid).
 */
export function ExecutiveSearchIndustryStrip() {
  const reduce = Boolean(useReducedMotion());
  const firstRow = SECTORS.slice(0, 3);
  const secondRow = SECTORS.slice(3);

  return (
    <section id="branchenschwerpunkte" className="relative overflow-hidden border-b border-black/[0.06] py-16 sm:py-20 md:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#eef4ff] via-white to-[#e8f7fc]" />
        <div className="absolute right-0 top-1/2 h-[min(100vw,640px)] w-[min(100vw,640px)] -translate-y-1/2 translate-x-1/4 rounded-full bg-gradient-to-bl from-brand-500/18 to-transparent blur-3xl" />
      </div>
      <PublicContentWidth className="relative">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-3xl border-l-2 border-brand-500/40 pl-6 md:pl-8"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Unsere Branchenschwerpunkte</p>
          <h2 className="mt-3 text-[26px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f] sm:text-[32px] md:text-[36px]">
            Wo Tiefe auf Markt trifft
          </h2>
          <p className="mt-5 max-w-[52ch] text-[16px] leading-relaxed text-[#6e6e73] sm:text-[17px]">
            Klare Schwerpunkte helfen uns, Rollen präzise einzuordnen — ohne den Blick für individuelle Kontexte zu verlieren.
          </p>
        </motion.div>

        <div className="mx-auto mt-10 max-w-[820px]">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {firstRow.map((s, i) => (
              <SectorTile key={s} label={s} index={i} reduce={reduce} />
            ))}
          </div>
          <div className="mt-3 grid gap-3 sm:mx-auto sm:mt-4 sm:max-w-[560px] sm:grid-cols-2 sm:gap-4">
            {secondRow.map((s, i) => (
              <SectorTile key={s} label={s} index={i + firstRow.length} reduce={reduce} />
            ))}
          </div>
        </div>
      </PublicContentWidth>
    </section>
  );
}
