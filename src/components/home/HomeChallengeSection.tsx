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
      className="border-y border-black/[0.06] py-12 sm:py-16 md:py-20 apple-animated-gradient"
    >
      <div className="relative mx-auto max-w-[1068px] pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:pl-6 sm:pr-6">
        <motion.header
          className="max-w-2xl"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.4, ease }}
        >
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h2 className="mt-1.5 text-balance text-[26px] font-semibold leading-[1.12] tracking-[-0.03em] text-[#1d1d1f] min-[400px]:text-[30px] sm:text-[32px] sm:leading-tight md:text-[40px]">
            {c.headline}
          </h2>
          <p className={`mt-4 ${body}`}>{c.intro}</p>
        </motion.header>

        <div className="mt-8 md:mt-10">
          <div className="max-w-2xl">
            <Eyebrow>Typische Situationen</Eyebrow>
            <p className={`mt-1.5 ${body}`}>{c.situationsSubline}</p>
          </div>

          <ul
            className="mx-auto mt-5 grid w-full max-w-3xl list-none grid-cols-1 gap-3 pl-0 min-[480px]:grid-cols-2 min-[480px]:gap-2.5 sm:gap-4"
            role="list"
            aria-label="Typische Projektsituationen"
          >
            {c.groups.map((g) => {
              const items = listItems(g);
              return (
                <li key={g.title} className="min-w-0">
                  <article className="h-full rounded-2xl border border-black/[0.08] bg-white p-4 shadow-[var(--apple-shadow)] ring-1 ring-black/[0.04] min-[480px]:p-3.5 sm:p-5">
                    <h3 className="text-[15px] font-semibold leading-snug text-[#1d1d1f] sm:text-base">
                      {g.title}
                    </h3>
                    <ul
                      className="mt-2 list-none space-y-1.5 pl-0 text-[15px] font-normal leading-relaxed text-[#3c3c43] sm:mt-2.5 sm:space-y-2"
                    >
                      {items.map((line) => (
                        <li key={line} className="flex gap-2.5">
                          <span
                            className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-900"
                            aria-hidden
                          />
                          {line}
                        </li>
                      ))}
                    </ul>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-10 border-t border-black/[0.08] pt-10 md:mt-12 md:pt-12">
          <div className="max-w-2xl space-y-10">
            <div>
              <Eyebrow>{c.whatIsMissing.title}</Eyebrow>
              <p className="mt-2.5 text-[16px] font-normal leading-[1.6] text-[#1d1d1f]">
                {c.whatIsMissing.line} {c.whatIsMissing.sub}
              </p>
            </div>

            <div>
              <Eyebrow>{c.whenExternal.title}</Eyebrow>
              <ul className="mt-2.5 list-none space-y-2.5 pl-0" role="list">
                {c.whenExternal.bullets.map((b) => (
                  <li key={b} className={`flex gap-2.5 ${body}`}>
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-900"
                      aria-hidden
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <p className="border-l-2 border-brand-900/30 pl-4 text-[16px] font-normal leading-[1.6] text-[#1d1d1f] sm:pl-5">
              {c.framing}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
