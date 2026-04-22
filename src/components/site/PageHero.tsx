"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Full-bleed background (same treatment as the home hero). */
  imageSrc: string;
  /** LCP pages can set true for the hero image. */
  priority?: boolean;
};

/**
 * Inner-page hero: same layout, motion, gradients and vignette as {@link HomeHero},
 * with a configurable background image.
 */
export function PageHero({ children, imageSrc, priority = false }: Props) {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate flex min-h-[min(100dvh,900px)] w-full flex-col justify-end overflow-hidden pt-24 pb-[max(4rem,calc(2.5rem+env(safe-area-inset-bottom,0px)))] md:min-h-[min(92svh,960px)] md:justify-center md:pb-[max(7rem,calc(5.5rem+env(safe-area-inset-bottom,0px)))] md:pt-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={reduce ? undefined : { scale: [1, 1.04, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority={priority}
            quality={90}
          />
          <div className="abexis-tint-overlay" />
        </motion.div>
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#26337c]/88 via-[#26337c]/50 to-[#45b3e2]/18 md:from-[#26337c]/82 md:via-[#1a1f38]/45 md:to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0a0c18]/88 via-black/28 to-[#26337c]/40"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_72%_18%,rgba(69,179,226,0.15)_0%,rgba(0,0,0,0.4)_100%)]"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1068px] px-6">{children}</div>
    </section>
  );
}
