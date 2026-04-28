"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { homeChallengeContent } from "@/data/home-page-content";

const ease = [0.22, 1, 0.36, 1] as const;

/** Body copy: darker grey for comfortable reading (not #6e6e73 on white). */
const body = "text-[15px] font-normal leading-relaxed text-[#3c3c43]";

function listItems(
  g: (typeof homeChallengeContent.groups)[number]
): readonly string[] {
  if ("bullets" in g && g.bullets) return g.bullets;
  if ("lines" in g && g.lines) return g.lines;
  return [];
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5c5c5f]">
      {children}
    </p>
  );
}

export function HomeChallengeSection() {
  const reduce = useReducedMotion();
  const c = homeChallengeContent;

  return (
    <section
      id="herausforderung"
      className="apple-animated-gradient relative isolate overflow-x-hidden border-b border-t-0 border-black/[0.06] py-12 sm:py-16 md:py-20"
    >
      <div className="relative mx-auto min-w-0 max-w-[1068px] pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:pl-6 sm:pr-6">
        <motion.header
          className="max-w-2xl"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.4, ease }}
        >
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h2 className="mt-1.5 text-balance break-words text-[26px] font-semibold leading-none tracking-[-0.03em] text-[#1d1d1f] min-[400px]:text-[30px] sm:text-[32px] md:text-[40px]">
            {c.headline}
          </h2>
          <p className={`mt-4 ${body}`}>{c.intro}</p>
        </motion.header>

        {/* Two-column: label left / cards right */}
        <div className="mt-8 md:mt-10 md:grid md:grid-cols-[5fr_8fr] md:gap-10 lg:gap-14">
          <div className="mb-6 md:mb-0 md:pt-0.5">
            <Eyebrow>Typische Situationen</Eyebrow>
            <p className={`mt-2 max-w-[28ch] md:max-w-none ${body}`}>{c.situationsSubline}</p>
          </div>

          <ul
            className="grid grid-cols-1 gap-3 list-none pl-0 min-[480px]:grid-cols-2 sm:gap-4"
            role="list"
            aria-label="Typische Projektsituationen"
          >
            {c.groups.map((g, i) => {
              const items = listItems(g);
              return (
                <motion.li
                  key={g.title}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-6% 0px" }}
                  transition={{ delay: reduce ? 0 : 0.05 + i * 0.07, duration: 0.45, ease }}
                  className="min-w-0"
                >
                  <article className="h-full rounded-2xl border border-black/[0.08] bg-white p-4 shadow-[var(--apple-shadow)] ring-1 ring-black/[0.04] sm:p-5">
                    <h3 className="text-[15px] font-semibold leading-snug text-[#1d1d1f] sm:text-base">
                      {g.title}
                    </h3>
                    <ul className="mt-2 list-none space-y-1.5 pl-0 text-[15px] font-normal leading-relaxed text-[#3c3c43] sm:mt-2.5 sm:space-y-2">
                      {items.map((line) => (
                        <li key={line} className="flex gap-2.5">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-900" aria-hidden />
                          {line}
                        </li>
                      ))}
                    </ul>
                  </article>
                </motion.li>
              );
            })}
          </ul>
        </div>

        {/* Three-column info strip */}
        <div className="mt-10 border-t border-black/[0.08] pt-10 md:mt-12 md:pt-12">
          <div className="grid gap-px overflow-hidden rounded-2xl bg-black/[0.06] shadow-[0_2px_20px_rgba(38,51,124,0.07)] sm:grid-cols-2 lg:grid-cols-3">
            {/* Col 1: What is missing */}
            <div className="bg-white px-6 py-7 sm:px-7 sm:py-8 lg:px-8">
              <h3 className="text-[15px] font-semibold leading-snug text-[#1d1d1f] sm:text-base">
                {c.whatIsMissing.title}
              </h3>
              <p className={`mt-2 ${body}`}>{c.whatIsMissing.line}</p>
              <p className="mt-1 text-[14px] leading-relaxed text-[#6e6e73]">{c.whatIsMissing.sub}</p>
            </div>

            {/* Col 2: When external perspective makes sense */}
            <div className="bg-white px-6 py-7 sm:px-7 sm:py-8 lg:px-8">
              <h3 className="text-[15px] font-semibold leading-snug text-[#1d1d1f] sm:text-base">
                {c.whenExternal.title}
              </h3>
              <ul className="mt-2.5 list-none space-y-2 pl-0" role="list">
                {c.whenExternal.bullets.map((b) => (
                  <li key={b} className={`flex gap-2.5 ${body}`}>
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-900" aria-hidden />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Framing statement : dark navy card, punchline */}
            <div className="relative overflow-hidden bg-[#1a2260] px-6 py-7 sm:col-span-2 sm:px-7 sm:py-8 lg:col-span-1 lg:px-8">
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_65%_at_5%_105%,rgba(69,179,226,0.14),transparent_52%)]"
                aria-hidden
              />
              <p className="relative text-[19px] font-semibold leading-[1.45] tracking-[-0.018em] text-white sm:text-[20px]">
                {c.framing}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
