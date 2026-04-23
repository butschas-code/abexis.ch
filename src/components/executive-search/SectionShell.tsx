import type { ReactNode } from "react";
import { PublicContentWidth } from "@/components/site/PublicContentWidth";

export function SectionShell({
  id,
  eyebrow,
  title,
  children,
  density = "comfortable",
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  density?: "comfortable" | "tight";
}) {
  const py = density === "tight" ? "py-14 sm:py-16" : "py-20 sm:py-24";
  return (
    <section id={id} className={`apple-section-mesh ${py}`}>
      <PublicContentWidth>
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{eyebrow}</p>
          )}
          {title && (
            <h2
              className={`max-w-[40ch] text-[28px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f] sm:text-[36px] md:text-[40px] ${eyebrow ? "mt-3" : ""}`}
            >
              {title}
            </h2>
          )}
          <div className={title || eyebrow ? "mt-8" : ""}>{children}</div>
        </div>
      </PublicContentWidth>
    </section>
  );
}
