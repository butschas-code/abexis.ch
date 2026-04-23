"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { PublicContentWidth } from "@/components/site/PublicContentWidth";

export type Pillar = {
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
  /** Optional `object-*` classes — tall portraits in short cards often need a higher anchor (e.g. `object-[50%_12%]`). */
  imageObjectClass?: string;
};

export function HomePillarGrid({ pillars }: { pillars: Pillar[] }) {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-b border-black/[0.06] py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(69,179,226,0.12),transparent_55%),linear-gradient(180deg,#ffffff_0%,#f5f8ff_45%,#fbfbfd_100%)]" />
      <PublicContentWidth className="relative">
        <div className="grid gap-5 md:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.article
              key={p.title}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={reduce ? undefined : { y: -6 }}
              className="group relative rounded-2xl bg-gradient-to-br from-brand-500/25 via-brand-900/15 to-transparent p-[1px] shadow-[0_12px_40px_rgba(38,51,124,0.08)]"
            >
              <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white/95 shadow-sm backdrop-blur-sm transition-shadow duration-300 group-hover:shadow-[0_20px_50px_rgba(38,51,124,0.14)]">
                <div className="relative isolate aspect-[5/3] min-h-[168px] w-full shrink-0 overflow-hidden bg-[#dce3ef] sm:min-h-[188px]">
                  <Image
                    src={p.imageSrc}
                    alt={p.imageAlt}
                    fill
                    priority={i < 3}
                    className={`object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] ${p.imageObjectClass ?? "object-center"}`}
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                  <div className="abexis-tint-overlay" aria-hidden />
                </div>
                <div className="p-6">
                  <div className="mb-3 h-1 w-10 rounded-full bg-gradient-to-r from-brand-900 to-brand-500" />
                  <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">{p.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#6e6e73]">{p.body}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </PublicContentWidth>
    </section>
  );
}
