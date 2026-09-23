"use client";

import { PublicImage as Image } from "@/components/site/PublicImage";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Full-bleed background (same treatment as the home hero). */
  imageSrc: string;
  /** LCP pages can set true for the hero image. */
  priority?: boolean;
  /**
   * Extra classes for the hero Image (after `object-cover`), e.g. `object-[center_28%]` to lift faces in portraits.
   * Default: `object-center`.
   */
  imageObjectClassName?: string;
  /**
   * Vertical placement of the text block. `center` = mid viewport on md+ (default for inner pages).
   * `lower` = sit copy toward the lower third (e.g. home).
   */
  contentPlacement?: "center" | "lower";
  /** Supporting copy shown on a solid surface directly below the image. */
  intro?: ReactNode;
  /** Calls to action shown with the supporting copy below the image. */
  actions?: ReactNode;
};

/**
 * Inner-page hero: full-bleed image + `abexis-hero-fullbleed-overlay` (diagonal scrim, readable type).
 */
export function PageHero({
  children,
  imageSrc,
  priority = false,
  imageObjectClassName = "object-center",
  contentPlacement = "center",
  intro,
  actions,
}: Props) {
  const reduce = useReducedMotion();
  const mdJustify = contentPlacement === "lower" ? "md:justify-end" : "md:justify-center";
  const heroHeight =
    contentPlacement === "lower"
      ? "min-h-[min(100dvh,900px)] md:min-h-[min(92svh,960px)]"
      : "min-h-[min(62svh,620px)] md:min-h-[min(68svh,720px)]";
  /** Home hero (`lower`): balanced mobile bottom padding; pair with `imageObjectClassName` for photo crop. */
  const bottomPad =
    contentPlacement === "lower"
      ? "pb-[max(5.25rem,calc(3.25rem+env(safe-area-inset-bottom,0px)))] md:pb-[max(8.5rem,calc(6.5rem+env(safe-area-inset-bottom,0px)))]"
      : "pb-[max(4rem,calc(2.5rem+env(safe-area-inset-bottom,0px)))] md:pb-[max(7rem,calc(5.5rem+env(safe-area-inset-bottom,0px)))]";

  return (
    <>
      <section
        className={`relative isolate flex w-full flex-col justify-end overflow-hidden pt-24 ${heroHeight} ${mdJustify} ${bottomPad} md:pt-28`}
      >
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
              className={`object-cover ${imageObjectClassName}`}
              sizes="100vw"
              priority={priority}
              quality={90}
            />
          </motion.div>
          <div className="abexis-hero-fullbleed-overlay" aria-hidden />
          {/**
           * Mobile: extra dimming where the stock photo is brightest (top-right) so white headline stays legible.
           * Only for `lower` (home) heroes.
           */}
          {contentPlacement === "lower" ? (
            <div className="abexis-hero-lower-vignette pointer-events-none absolute inset-0 z-[2] md:hidden" aria-hidden />
          ) : null}
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1068px] pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:pl-6 sm:pr-6">
          {children}
        </div>
      </section>
      {intro != null || actions != null ? (
        <section className="border-b border-black/[0.06] bg-white">
          <div className="mx-auto w-full max-w-[1068px] px-4 py-10 sm:px-6 md:py-14">
            {intro != null ? (
              <div className="max-w-3xl text-[17px] leading-relaxed text-[#4b4b50] sm:text-[19px] md:text-[21px] [&_a]:font-medium [&_a]:text-[#26337c] [&_a]:underline [&_a]:underline-offset-4 [&_strong]:font-semibold [&_strong]:text-[#1d1d1f]">
                {intro}
              </div>
            ) : null}
            {actions != null ? (
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">{actions}</div>
            ) : null}
          </div>
        </section>
      ) : null}
    </>
  );
}
