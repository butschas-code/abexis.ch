import type { ReactNode } from "react";
import { BrandGrad } from "@/components/ui/BrandGrad";

export function HeroHeadlineBrandAccent({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <BrandGrad variant="dark" className={`inline-block pb-[0.08em] leading-[inherit] text-balance ${className}`.trim()}>
      {children}
    </BrandGrad>
  );
}

/** Applies the shared hero gradient to the final phrase while keeping short titles balanced. */
export function HeroHeadlineText({ children, accentWords = 2 }: { children: ReactNode; accentWords?: number }) {
  if (typeof children !== "string") return children;

  const words = children.trim().split(/\s+/);
  const count = Math.min(accentWords, Math.max(1, words.length - 1));

  return (
    <>
      {words.slice(0, -count).join(" ")} {" "}
      <HeroHeadlineBrandAccent>{words.slice(-count).join(" ")}</HeroHeadlineBrandAccent>
    </>
  );
}
