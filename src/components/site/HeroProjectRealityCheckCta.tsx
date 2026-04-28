import Link from "next/link";
import { homeHeroContent } from "@/data/home-page-content";

/** Same primary CTA as the home hero : used on Leistungen and Fokusthemen heroes. */
export function HeroProjectRealityCheckCta() {
  const { href, label } = homeHeroContent.primaryCta;
  return (
    <Link
      href={href}
      className="inline-flex min-h-12 w-full touch-manipulation items-center justify-center rounded-full bg-brand-900 px-5 text-[16px] font-medium text-white shadow-lg shadow-brand-900/35 transition-all duration-200 ease-out hover:bg-[var(--brand-900-hover)] hover:shadow-xl hover:shadow-brand-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] sm:w-auto sm:min-h-[48px] sm:px-8 sm:text-[17px]"
    >
      {label}
    </Link>
  );
}
