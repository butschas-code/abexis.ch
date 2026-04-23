"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { PublicContentWidth } from "@/components/site/PublicContentWidth";

type Props = {
  trustEyebrow: string;
  trustTitle: string;
  trustImageSrc: string;
  trustImageAlt: string;
  organizationIntro: string;
  contactEyebrow: string;
  contactTitle: string;
  contactLead: ReactNode;
  children: ReactNode;
};

export function HomeTrustContactPanel({
  trustEyebrow,
  trustTitle,
  trustImageSrc,
  trustImageAlt,
  organizationIntro,
  contactEyebrow,
  contactTitle,
  contactLead,
  children,
}: Props) {
  const reduce = Boolean(useReducedMotion());

  return (
    <section
      className="apple-section-mesh relative overflow-hidden border-b border-black/[0.06] bg-white/75 py-16 sm:py-20 md:py-24"
      id="kontakt-teaser"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#f8faff] via-white to-[#eef6fc]" />
      <PublicContentWidth className="relative">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
          className="overflow-hidden rounded-[1.5rem] border border-black/[0.07] bg-white/90 shadow-[0_20px_60px_rgba(38,51,124,0.1)] ring-1 ring-white/80 backdrop-blur-md sm:rounded-[1.75rem]"
        >
          <div className="grid lg:grid-cols-2 lg:divide-x lg:divide-black/[0.08]">
            <div className="flex flex-col border-b border-black/[0.08] p-8 sm:p-10 lg:border-b-0 lg:p-11">
              <div className="border-l-2 border-brand-500/45 pl-6 md:pl-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{trustEyebrow}</p>
                <h2 className="mt-3 text-[26px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f] sm:text-[30px] md:text-[32px]">
                  {trustTitle}
                </h2>
                <p className="mt-6 text-[17px] leading-relaxed text-[#6e6e73]">{organizationIntro}</p>
                <Link
                  href="/ueber-uns"
                  className="focus-ring mt-6 inline-flex text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-900 underline-offset-8 hover:underline"
                >
                  Team & Haltung
                </Link>
              </div>
              <div className="relative isolate mt-8 aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#e8ecf5] ring-1 ring-black/[0.05] lg:mt-10">
                <Image src={trustImageSrc} alt={trustImageAlt} fill className="object-cover object-[center_20%]" sizes="(max-width:1024px) 100vw, 500px" />
                <div className="abexis-tint-overlay" aria-hidden />
              </div>
            </div>

            <div className="flex flex-col p-8 sm:p-10 lg:p-11">
              <div className="border-l-2 border-brand-500/45 pl-6 md:pl-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{contactEyebrow}</p>
                <h2 className="mt-3 text-[26px] font-semibold tracking-[-0.03em] text-[#1d1d1f] sm:text-[30px] md:text-[32px]">{contactTitle}</h2>
                <div className="mt-6 text-[17px] leading-relaxed text-[#6e6e73]">{contactLead}</div>
              </div>
              <div className="mt-8 rounded-2xl border border-black/[0.06] bg-[#fbfbfd]/90 p-5 shadow-inner sm:mt-9 sm:p-6 md:p-7">{children}</div>
            </div>
          </div>
        </motion.div>
      </PublicContentWidth>
    </section>
  );
}
