"use client";

import { useEffect, useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { homeTestimonials, type HomeTestimonialItem } from "@/data/home-testimonials";

export function TestimonialsSection({
  eyebrow = "Referenzen",
  headline = "Ergebnisse aus der Praxis.",
  intro = "Stimmen von Führungspersonen und Partnern — mit Freigabe der Zitierten.",
  items = homeTestimonials,
  listLabel = "Alle Stimmen",
  prevLabel = "Vorheriges Statement",
  nextLabel = "Nächstes Statement",
}: {
  eyebrow?: string;
  headline?: string;
  intro?: string;
  items?: HomeTestimonialItem[];
  listLabel?: string;
  prevLabel?: string;
  nextLabel?: string;
} = {}) {
  const baseId = useId();
  const reduce = useReducedMotion();
  const wide = useWideScreen();
  const [index, setIndex] = useState(0);

  if (items.length === 0) return null;

  const safeIndex = ((index % items.length) + items.length) % items.length;
  const active = items[safeIndex];
  const paragraphs = active.quote.split(/\n\n+/).map((paragraph) => paragraph.trim()).filter(Boolean);

  function select(next: number) {
    const count = items.length;
    setIndex(((next % count) + count) % count);
  }

  function onTabKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const key = event.key;
    const forward = key === "ArrowRight" || key === "ArrowDown";
    const backward = key === "ArrowLeft" || key === "ArrowUp";
    if (!forward && !backward && key !== "Home" && key !== "End") return;
    event.preventDefault();
    const next = key === "Home" ? 0 : key === "End" ? items.length - 1 : safeIndex + (forward ? 1 : -1);
    const count = items.length;
    const wrapped = ((next % count) + count) % count;
    setIndex(wrapped);
    document.getElementById(`${baseId}-tab-${wrapped}`)?.focus();
  }

  return (
    <section className="relative overflow-hidden border-y border-black/[0.06] py-16 sm:py-24 md:py-32">
      <div
        className="absolute inset-0 bg-[linear-gradient(160deg,#f5f5f7_0%,#ffffff_48%,#f7f8fc_100%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1068px] px-[max(1rem,env(safe-area-inset-left,0px))] sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6e6e73]">{eyebrow}</p>
        <h2 className="mt-3 text-balance break-words text-[28px] font-semibold leading-none tracking-[-0.03em] text-[#1d1d1f] sm:text-[32px] md:text-[40px]">
          {headline}
        </h2>
        <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-[#424245] sm:text-[16px]">{intro}</p>

        <div className="mt-10 lg:mt-14 lg:grid lg:grid-cols-[17.5rem_minmax(0,1fr)] lg:items-start lg:gap-8">
          <div
            role="tablist"
            aria-label={listLabel}
            aria-orientation={wide ? "vertical" : "horizontal"}
            className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:flex-col lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
            onKeyDown={onTabKeyDown}
          >
            {items.map((item, itemIndex) => {
              const { name, detail } = splitAttribution(item.attribution);
              const selected = itemIndex === safeIndex;
              return (
                <button
                  key={item.attribution}
                  id={`${baseId}-tab-${itemIndex}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  className={`shrink-0 rounded-2xl px-3.5 py-2.5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900 lg:w-full lg:shrink lg:px-4 lg:py-3 ${
                    selected
                      ? "bg-brand-900 text-white shadow-[var(--apple-shadow)] lg:bg-white lg:text-[#1d1d1f] lg:ring-1 lg:ring-black/[0.06]"
                      : "bg-white/80 text-[#1d1d1f] ring-1 ring-black/[0.06] hover:bg-white"
                  }`}
                  onClick={() => select(itemIndex)}
                >
                  <span className={`block text-[14px] leading-snug ${selected ? "font-semibold lg:text-brand-900" : "font-medium"}`}>
                    {name}
                  </span>
                  {detail ? (
                    <span className={`mt-0.5 block text-[12px] leading-snug ${selected ? "text-white/80 lg:text-[#424245]" : "text-[#424245]"}`}>
                      {detail}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <figure
            id={`${baseId}-panel`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${safeIndex}`}
            className="mt-5 rounded-[24px] bg-white px-6 py-7 shadow-[var(--apple-shadow)] ring-1 ring-black/[0.05] sm:rounded-[28px] sm:px-10 sm:py-9 lg:mt-0 md:px-12 md:py-10"
          >
            <motion.blockquote
              key={active.attribution}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="block font-serif text-[3.25rem] leading-none text-brand-900/70" aria-hidden>
                &ldquo;
              </span>
              {paragraphs.map((paragraph, paragraphIndex) => (
                <p
                  key={paragraphIndex}
                  className={`max-w-[68ch] text-[16.5px] leading-[1.75] text-[#1d1d1f] sm:text-[18px] ${paragraphIndex === 0 ? "mt-3" : "mt-4"}`}
                >
                  {paragraph}
                </p>
              ))}
            </motion.blockquote>
            <figcaption className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-black/[0.07] pt-5">
              <AttributionText text={active.attribution} />
              <div className="flex items-center gap-2">
                <p className="min-w-12 text-center text-[13px] tabular-nums text-[#424245]">
                  {safeIndex + 1} / {items.length}
                </p>
                <button type="button" className={navButtonClass} aria-label={prevLabel} onClick={() => select(safeIndex - 1)}>
                  <Chevron direction="left" />
                </button>
                <button type="button" className={navButtonClass} aria-label={nextLabel} onClick={() => select(safeIndex + 1)}>
                  <Chevron direction="right" />
                </button>
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

const navButtonClass =
  "inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f5f5f7] text-[#1d1d1f] ring-1 ring-black/[0.06] transition hover:bg-white hover:ring-brand-900/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900";

function useWideScreen() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return wide;
}

function splitAttribution(text: string) {
  const commaIdx = text.indexOf(",");
  if (commaIdx === -1) return { name: text, detail: null as string | null };
  return { name: text.slice(0, commaIdx).trim(), detail: text.slice(commaIdx + 1).trim() };
}

function AttributionText({ text }: { text: string }) {
  const { name, detail } = splitAttribution(text);
  if (!detail) {
    return <p className="text-[15px] font-semibold tracking-[-0.01em] text-[#1d1d1f]">{name}</p>;
  }
  return (
    <div>
      <p className="text-[15px] font-semibold tracking-[-0.01em] text-[#1d1d1f]">{name}</p>
      <p className="mt-1 text-[13px] leading-snug text-[#424245]">{detail}</p>
    </div>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d={direction === "left" ? "M11 4.5 6.5 9 11 13.5" : "M7 4.5 11.5 9 7 13.5"}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
