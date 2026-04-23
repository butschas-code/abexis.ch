"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { ProcessReveal } from "@/components/executive-search/ProcessReveal";
import { PublicContentWidth } from "@/components/site/PublicContentWidth";
import type { ProcessStep } from "@/executive-search/data/expertise-content";

type Props = {
  eyebrow: string;
  title: string;
  lead: string;
  steps: ProcessStep[];
  footerNote: ReactNode;
  ambientImageSrc: string;
  ambientImageAlt: string;
};

export function HomeProcessStage({
  eyebrow,
  title,
  lead,
  steps,
  footerNote,
  ambientImageSrc,
  ambientImageAlt,
}: Props) {
  const reduce = useReducedMotion();

  return (
    <section id="prozess" className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#0f1428] via-[#1a2454] to-[#152042]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(circle_at_20%_30%,rgba(69,179,226,0.35),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(99,132,255,0.2),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden h-full w-[min(52%,520px)] lg:block">
        <div className="relative isolate h-full w-full">
          <Image
            src={ambientImageSrc}
            alt={ambientImageAlt}
            fill
            className="object-cover object-[center_20%] opacity-[0.22]"
            sizes="520px"
          />
          <div className="abexis-tint-overlay" aria-hidden />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1428] via-[#0f1428]/85 to-transparent" />
      </div>
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] lg:opacity-[0.05]"
        aria-hidden
        animate={reduce ? undefined : { backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 28, repeat: Infinity, repeatType: "mirror", ease: "linear" }}
        style={{
          backgroundImage:
            "radial-gradient(1.5px 1.5px at 20px 30px, white, transparent), radial-gradient(1.5px 1.5px at 60px 80px, white, transparent)",
          backgroundSize: "120px 140px",
        }}
      />
      <PublicContentWidth className="relative">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-3xl"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">{eyebrow}</p>
          <h2 className="mt-3 text-[28px] font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-[36px] md:text-[40px]">{title}</h2>
          <p className="mt-6 text-[17px] leading-relaxed text-white/78">{lead}</p>
        </motion.div>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative mt-14 overflow-hidden rounded-[1.75rem] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] ring-1 ring-white/25 sm:rounded-[2rem]"
        >
          <ProcessReveal steps={steps} />
        </motion.div>
        <p className="mt-10 max-w-3xl text-[15px] text-white/70">{footerNote}</p>
      </PublicContentWidth>
    </section>
  );
}
