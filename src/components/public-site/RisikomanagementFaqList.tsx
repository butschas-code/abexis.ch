"use client";

import { useState } from "react";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-black/[0.06] last:border-0">
      <button
        type="button"
        className="flex w-full items-start justify-between gap-4 py-5 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="text-[16px] font-semibold leading-snug tracking-[-0.015em] text-[#1d1d1f]">{q}</span>
        <span className="mt-1 shrink-0 text-[18px] leading-none text-[#86868b]" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>
      {open ? <p className="pb-5 text-[15px] leading-relaxed text-[#6e6e73]">{a}</p> : null}
    </div>
  );
}

export function RisikomanagementFaqList({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <>
      {items.map((item) => (
        <FaqItem key={item.q} q={item.q} a={item.a} />
      ))}
    </>
  );
}
