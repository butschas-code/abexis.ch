'use client';

import { createContext, useContext, useState, useRef, type ReactNode } from 'react';

const MobileExpandCtx = createContext<{ expanded: boolean; expand: () => void }>({
  expanded: false,
  expand: () => {},
});

export function MobileExpandProvider({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <MobileExpandCtx.Provider value={{ expanded, expand: () => setExpanded(true) }}>
      {children}
    </MobileExpandCtx.Provider>
  );
}

export function MobileCollapsibleCard({
  children,
  collapsedClass = 'max-h-[130px]',
  fadeFrom = 'white',
  darkArrow = false,
}: {
  children: ReactNode;
  collapsedClass?: string;
  fadeFrom?: string;
  darkArrow?: boolean;
}) {
  const { expanded, expand } = useContext(MobileExpandCtx);
  const outerRef = useRef<HTMLDivElement>(null);

  function handleExpand(e: React.MouseEvent<HTMLButtonElement>) {
    e.currentTarget.blur();

    const card = outerRef.current;
    if (!card) { expand(); return; }

    // Pin the clicked card to its current viewport position for the full
    // duration of the max-height CSS transition. Without this, cards above
    // the viewport grow and push the page down frame-by-frame, losing the
    // user's reading position.
    const initialY = card.getBoundingClientRect().top;
    expand();

    let running = true;
    setTimeout(() => { running = false; }, 520);

    function step() {
      if (!running || !outerRef.current) return;
      const delta = outerRef.current.getBoundingClientRect().top - initialY;
      if (delta !== 0) window.scrollBy({ top: delta, behavior: 'instant' });
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  return (
    <div ref={outerRef} className="relative" style={{ backgroundColor: fadeFrom }}>
      <div
        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out md:max-h-none md:overflow-visible ${
          expanded ? 'max-h-[2000px]' : collapsedClass
        }`}
      >
        {children}
      </div>

      {!expanded && (
        /* Full-width tap zone — gradient fades content, fold line signals more */
        <button
          type="button"
          onClick={handleExpand}
          className="absolute inset-x-0 bottom-0 h-16 flex items-end justify-center pb-3.5 md:hidden cursor-pointer focus-visible:outline-none"
          style={{ background: `linear-gradient(to top, ${fadeFrom} 55%, transparent)` }}
          aria-label="Alle aufklappen"
        >
          {/* ——— MEHR ——— fold line */}
          <div className="flex items-center gap-2.5">
            <div
              className="h-px w-5 rounded-full"
              style={{ background: darkArrow ? 'rgba(255,255,255,0.2)' : 'rgba(38,51,124,0.15)' }}
            />
            <span
              className="text-[9px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: darkArrow ? 'rgba(255,255,255,0.32)' : 'rgba(38,51,124,0.35)' }}
            >
              Mehr
            </span>
            <div
              className="h-px w-5 rounded-full"
              style={{ background: darkArrow ? 'rgba(255,255,255,0.2)' : 'rgba(38,51,124,0.15)' }}
            />
          </div>
        </button>
      )}
    </div>
  );
}
