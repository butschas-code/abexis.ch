"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { PublicContentWidth } from "@/components/site/PublicContentWidth";

type Props = {
  eyebrow?: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  children: ReactNode;
};

export function HomeIntroBand({ eyebrow, title, imageSrc, imageAlt, children }: Props) {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="home-aurora-blob absolute -left-[20%] top-0 h-[min(90vw,520px)] w-[min(90vw,520px)] rounded-full bg-gradient-to-br from-[#45b3e2]/35 via-[#26337c]/25 to-transparent blur-3xl" />
        <div className="home-aurora-blob absolute -right-[15%] bottom-0 h-[min(70vw,420px)] w-[min(70vw,420px)] rounded-full bg-gradient-to-tl from-[#26337c]/30 via-[#5b8cff]/20 to-transparent blur-3xl [animation-delay:-4s]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#f3f7ff]/90 to-[#fbfbfd]" />
      </div>
      <PublicContentWidth className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,420px)] lg:gap-14">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
            className="min-w-0"
          >
            {eyebrow ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{eyebrow}</p>
            ) : null}
            <h2
              className={`max-w-[40ch] text-[28px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f] sm:text-[36px] md:text-[40px] ${eyebrow ? "mt-3" : ""}`}
            >
              {title}
            </h2>
            <div className="mt-8">{children}</div>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.98 }}
            whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: 0.06, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none"
          >
            <div className="relative isolate aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-[#e8ecf5] shadow-[0_28px_80px_rgba(38,51,124,0.18)] ring-1 ring-black/[0.06] sm:aspect-[5/6]">
              <Image src={imageSrc} alt={imageAlt} fill className="object-cover" sizes="(max-width:1024px) 90vw, 420px" />
              <div className="abexis-tint-overlay" aria-hidden />
            </div>
            <div className="pointer-events-none absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-brand-500/20 via-transparent to-brand-900/15 blur-2xl" />
          </motion.div>
        </div>
      </PublicContentWidth>
    </section>
  );
}
