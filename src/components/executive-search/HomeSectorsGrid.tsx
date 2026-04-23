"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { PublicContentWidth } from "@/components/site/PublicContentWidth";

type Props = {
  eyebrow: string;
  title: string;
  listHeading: string;
  sectors: string[];
  bodyParagraphs: string[];
  featureImageSrc: string;
  featureImageAlt: string;
};

function SectorTile({ label, index, reduce }: { label: string; index: number; reduce: boolean }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
      className="min-w-0"
    >
      <Link
        href="/executive-search#fokusbereiche"
        className="group relative flex min-h-[7.25rem] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-brand-900/90 via-[#2d3d8f] to-brand-500/80 p-[1px] shadow-[0_16px_48px_rgba(38,51,124,0.2)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_56px_rgba(38,51,124,0.28)] sm:min-h-[7.5rem]"
      >
        <span className="flex w-full flex-1 items-center justify-center rounded-2xl bg-white/95 px-4 py-4 text-center text-[15px] font-medium leading-snug text-balance text-[#1d1d1f] backdrop-blur-sm transition-colors group-hover:bg-white sm:px-5 sm:leading-normal">
          {label}
        </span>
      </Link>
    </motion.div>
  );
}

export function HomeSectorsGrid({
  eyebrow,
  title,
  listHeading,
  sectors,
  bodyParagraphs,
  featureImageSrc,
  featureImageAlt,
}: Props) {
  const reduce = Boolean(useReducedMotion());
  const firstRow = sectors.slice(0, 3);
  const secondRow = sectors.slice(3);

  return (
    <section id="fokusbereiche" className="relative overflow-hidden border-b border-black/[0.06] py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#eef4ff] via-white to-[#e8f7fc]" />
        <div className="absolute right-0 top-1/2 h-[min(100vw,640px)] w-[min(100vw,640px)] -translate-y-1/2 translate-x-1/4 rounded-full bg-gradient-to-bl from-brand-500/20 to-transparent blur-3xl" />
      </div>
      <PublicContentWidth className="relative">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-3xl border-l-2 border-brand-500/45 pl-6 md:pl-8"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{eyebrow}</p>
          <h2 className="mt-3 text-[28px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f] sm:text-[36px] md:text-[40px]">{title}</h2>
          {bodyParagraphs.map((p, idx) => (
            <p key={idx} className="mt-6 text-[17px] leading-relaxed text-[#6e6e73]">
              {p}
            </p>
          ))}
          <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">{listHeading}</p>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 26 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative mt-12 overflow-hidden rounded-[1.5rem] bg-[#dfe6f5] shadow-[0_20px_60px_rgba(38,51,124,0.15)] ring-1 ring-black/[0.05]"
        >
          <div className="relative isolate aspect-[21/9] min-h-[200px] w-full sm:min-h-[240px] md:aspect-[2.4/1] md:min-h-[280px]">
            <Image
              src={featureImageSrc}
              alt={featureImageAlt}
              fill
              className="object-cover object-center"
              sizes="(max-width:768px) 100vw, 1068px"
              priority={false}
            />
            <div className="abexis-tint-overlay" aria-hidden />
            <p className="pointer-events-none absolute bottom-5 left-5 z-[2] max-w-[min(100%,20rem)] text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90 drop-shadow md:bottom-6 md:left-8">
              Branchen & Märkte
            </p>
          </div>
        </motion.div>

        <div className="mx-auto mt-10 max-w-[920px]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            {firstRow.map((s, i) => (
              <SectorTile key={s} label={s} index={i} reduce={reduce} />
            ))}
          </div>
          {secondRow.length > 0 ? (
            <div
              className={`mt-4 grid gap-4 sm:mt-5 sm:gap-5 ${
                secondRow.length === 1
                  ? "sm:mx-auto sm:max-w-md sm:grid-cols-1"
                  : "sm:mx-auto sm:max-w-[640px] sm:grid-cols-2"
              }`}
            >
              {secondRow.map((s, i) => (
                <SectorTile key={s} label={s} index={i + firstRow.length} reduce={reduce} />
              ))}
            </div>
          ) : null}
        </div>
      </PublicContentWidth>
    </section>
  );
}
