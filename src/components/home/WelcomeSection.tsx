"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { homeWelcomeSection } from "@/data/pages";

export function WelcomeSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.65, 1], reduce ? [1, 1, 1, 1] : [0.45, 0.98, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [18, 0]);

  const { eyebrow, title, titleAccent, paragraphs } = homeWelcomeSection;

  return (
    <div
      ref={ref}
      className="relative border-b border-t border-black/[0.06] py-12 sm:py-16 md:py-20"
      style={{
        /* Solid base matches `apple-animated-gradient` top (Challenge) : layered tints fade to transparent so the bottom edge is uniform on mobile. */
        backgroundColor: "#f5f5f7",
        backgroundImage: [
          "linear-gradient(115deg, rgba(38,51,124,0.08) 0%, rgba(255,255,255,0.72) 36%, rgba(255,255,255,0.2) 68%, rgba(255,255,255,0) 100%)",
          "radial-gradient(ellipse 80% 65% at 100% 22%, rgba(69,179,226,0.1), transparent 58%)",
        ].join(", "),
      }}
    >
      <div className="relative z-[1] mx-auto max-w-[46rem] pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] text-center sm:px-6">
        <motion.p
          style={{ opacity }}
          className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#86868b]"
        >
          {eyebrow}
        </motion.p>
        <motion.div style={{ opacity, y }} className="mt-5">
          <h2 className="text-balance break-words text-[24px] font-semibold leading-none tracking-[-0.03em] text-[#1d1d1f] min-[400px]:text-[28px] md:text-[36px]">
            {title}
            <span className="text-brand-900">{titleAccent}</span>
          </h2>
          <div className="mx-auto mt-8 max-w-[40rem] space-y-5 text-left md:text-center">
            {paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="border-l border-brand-900/20 pl-5 text-[16px] leading-relaxed text-[#424245] md:border-l-0 md:pl-0 md:text-[17px]"
              >
                {p}
              </motion.p>
            ))}
          </div>
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            whileInView={reduce ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12, duration: 0.45 }}
            className="mt-10"
          >
            <Link
              href="/kontakt"
              className="inline-flex min-h-11 items-center text-[15px] font-medium text-brand-900 underline-offset-4 transition-colors duration-200 hover:text-brand-500 hover:underline"
            >
              Kontakt aufnehmen
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
