"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useState } from "react";
import type { ProcessStep } from "@/executive-search/data/expertise-content";

const appleEase = [0.25, 0.1, 0.25, 1] as const;

function Chevron({ open }: { open: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="mt-1.5 shrink-0 text-[#6e6e73]"
      aria-hidden
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: reduce ? 0 : 0.35, ease: appleEase }}
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

export function ProcessReveal({ steps }: { steps: ProcessStep[] }) {
  const [openId, setOpenId] = useState<string | null>(steps[0]?.id ?? null);
  const reduce = useReducedMotion();
  const baseId = useId();

  return (
    <div className="bg-white">
      <ol className="m-0 list-none divide-y divide-black/[0.08] p-0">
        {steps.map((step, index) => {
          const open = openId === step.id;
          const panelId = `${baseId}-${step.id}-panel`;
          const n = String(index + 1).padStart(2, "0");

          return (
            <li key={step.id} className="m-0 p-0">
              <button
                type="button"
                id={`${baseId}-${step.id}-trigger`}
                onClick={() => setOpenId(open ? null : step.id)}
                className={`focus-ring group flex w-full items-start gap-5 px-5 py-7 text-left transition-colors duration-200 sm:gap-7 sm:px-9 sm:py-8 md:px-11 md:py-9 ${
                  open ? "bg-[#fbfbfd]" : "bg-white hover:bg-[#f5f5f7]"
                }`}
                aria-expanded={open}
                aria-controls={panelId}
              >
                <span
                  className="mt-[3px] w-9 shrink-0 text-right text-[13px] font-semibold tabular-nums tracking-[-0.02em] text-[#86868b] sm:w-10 sm:text-[14px]"
                  aria-hidden
                >
                  {n}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">{step.label}</span>
                  <span className="mt-1.5 block text-[19px] font-semibold leading-[1.2] tracking-[-0.022em] text-[#1d1d1f] sm:text-[21px] md:text-[22px]">
                    {step.title}
                  </span>
                </span>
                <Chevron open={open} />
              </button>

              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={`${baseId}-${step.id}-trigger`}
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduce ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.42, ease: appleEase }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-black/[0.06] bg-[#fbfbfd] px-5 pb-10 pt-1 sm:px-9 sm:pb-11 sm:pt-2 md:px-11 md:pb-12">
                      <div className="ml-[4.75rem] max-w-[52rem] border-l border-black/[0.08] pl-6 sm:ml-[5.5rem] sm:pl-7 md:ml-[6rem]">
                        {step.imageSrc ? (
                          <div className="relative mb-6 aspect-[2/1] w-full max-w-xl overflow-hidden rounded-xl bg-white ring-1 ring-black/[0.06]">
                            <Image
                              src={step.imageSrc}
                              alt={step.imageAlt ?? ""}
                              fill
                              className="object-contain p-3 sm:p-4"
                              sizes="576px"
                            />
                          </div>
                        ) : null}
                        <p className="m-0 text-[17px] font-normal leading-[1.65] tracking-[-0.011em] text-[#424245] md:text-[18px] md:leading-[1.7]">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
