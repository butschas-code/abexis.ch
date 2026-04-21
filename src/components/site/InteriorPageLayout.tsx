import type { ReactNode } from "react";
import { MotionSection } from "@/components/motion/MotionSection";
import { homeHeroImage } from "@/data/site-images";
import { PageHero } from "./PageHero";

const maxMap = {
  "1068": "max-w-[1068px]",
  "1140": "max-w-[1140px]",
  "4xl": "max-w-4xl",
  "3xl": "max-w-3xl",
} as const;

export type InteriorMaxWidth = keyof typeof maxMap;

type HeaderProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  maxWidth?: InteriorMaxWidth;
};

/** Light intro strip (optional; most pages use {@link InteriorPageLayout} + {@link PageHero} instead). */
export function InteriorPageHeader({ eyebrow, title, description, maxWidth = "1068" }: HeaderProps) {
  const mx = maxMap[maxWidth];
  return (
    <section className="border-b border-black/[0.06]">
      <div className={`mx-auto ${mx} px-6 py-14 md:py-20`}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{eyebrow}</p>
        <h1 className="mt-3 max-w-[40ch] text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f] sm:text-[40px] sm:leading-[1.05] md:text-[48px]">
          {title}
        </h1>
        {description != null ? <div className="mt-5 max-w-2xl text-[17px] leading-relaxed text-[#6e6e73]">{description}</div> : null}
      </div>
    </section>
  );
}

export function InteriorPageRoot({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`apple-section-mesh min-h-screen ${className}`.trim()}>{children}</div>;
}

type LayoutProps = HeaderProps & {
  children: ReactNode;
  /** Background image (default: same as home hero). */
  heroImage?: string;
  /** Pass true for index / LCP-critical heroes. */
  heroPriority?: boolean;
  contentMaxWidth?: InteriorMaxWidth;
  contentClassName?: string;
  wrapContentInMotion?: boolean;
};

/** Full-bleed hero (same treatment as home) + mesh content area. */
export function InteriorPageLayout({
  eyebrow,
  title,
  description,
  children,
  maxWidth = "1068",
  heroImage = homeHeroImage,
  heroPriority = false,
  contentMaxWidth,
  contentClassName = "",
  wrapContentInMotion = true,
}: LayoutProps) {
  const contentMx = maxMap[contentMaxWidth ?? maxWidth];
  const contentTopPad = wrapContentInMotion ? "pt-12 md:pt-16" : "";
  const inner = (
      <div className={`mx-auto ${contentMx} px-4 pb-16 sm:px-6 sm:pb-20 md:pb-28 ${contentTopPad} ${contentClassName}`.trim()}>
      {children}
    </div>
  );
  return (
    <InteriorPageRoot>
      <PageHero imageSrc={heroImage} priority={heroPriority}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">{eyebrow}</p>
        <h1 className="mt-3 max-w-[28ch] text-[clamp(1.875rem,6vw+0.65rem,2.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-white text-balance sm:text-[40px] sm:leading-[1.05] md:max-w-[40ch] md:text-[56px] md:leading-[1.02]">
          {title}
        </h1>
        {description != null ? (
          <div className="mt-6 max-w-2xl text-[17px] font-normal leading-relaxed text-white/88 sm:text-[19px] md:text-[21px] [&_a]:font-medium [&_a]:text-white [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors [&_a:hover]:text-[#b8e8f7] [&_strong]:font-semibold [&_strong]:text-white">
            {description}
          </div>
        ) : null}
      </PageHero>
      {wrapContentInMotion ? <MotionSection>{inner}</MotionSection> : inner}
    </InteriorPageRoot>
  );
}
