import type { ReactNode } from "react";
import { BrandGrad } from "@/components/ui/BrandGrad";

/**
 * Second line of dark heroes. Mobile Safari paints `background-clip: text` poorly on wrapped lines
 * (dark / clipped bands); below `lg` we render a solid ice tone (the start of the desktop gradient).
 * From `lg` up we keep `BrandGrad` so desktop is unchanged. `lg` (not `md`) keeps iPad portrait safe.
 *
 * Each variant lives in its own outer wrapper so the `hidden`/`inline` toggle doesn’t collide with the
 * `display: inline` utility that `BrandGrad` ships with (Tailwind would otherwise let `inline` win).
 */
export function HeroHeadlineBrandAccent({ children, className = "" }: { children: ReactNode; className?: string }) {
  const baseShape = ["pb-[0.08em]", "leading-[inherit]", "text-balance", className].filter(Boolean).join(" ");
  return (
    <>
      <span className={`inline lg:hidden ${baseShape} text-[#e8f4fc]`.trim()}>{children}</span>
      <span className="hidden lg:inline">
        <BrandGrad variant="dark" className={baseShape}>
          {children}
        </BrandGrad>
      </span>
    </>
  );
}
