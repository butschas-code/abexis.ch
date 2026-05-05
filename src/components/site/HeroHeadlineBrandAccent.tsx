import type { ReactNode } from "react";
import { BrandGrad } from "@/components/ui/BrandGrad";

/**
 * Second line of dark heroes: large viewports keep `BrandGrad` (gradient). Below `lg`, Safari (esp. iOS)
 * often paints `background-clip: text` badly on wrapped lines (dark / clipped bands); solid ice tone
 * matches the desktop gradient’s light stops. `lg` avoids iPad-portrait (768px) still hitting gradient.
 */
export function HeroHeadlineBrandAccent({ children, className = "" }: { children: ReactNode; className?: string }) {
  const shared = ["inline", "pb-[0.08em]", "leading-[inherit]", "text-balance", className].filter(Boolean).join(" ");
  return (
    <>
      <span className={`${shared} text-[#e8f4fc] lg:hidden`}>{children}</span>
      <BrandGrad variant="dark" className={`${shared} hidden lg:inline`}>
        {children}
      </BrandGrad>
    </>
  );
}
