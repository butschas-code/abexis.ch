import Link from "next/link";
import { homeIntroStrip } from "@/data/home-page-content";

type IntroStripCopy = { audience: string; segment: string; cta: { href: string; label: string } };

export function HomeIntroStrip({ content = homeIntroStrip }: { content?: IntroStripCopy }) {
  return (
    <div className="border-b border-black/[0.06] bg-white">
      <div className="mx-auto flex max-w-[1068px] flex-col gap-2 px-5 py-6 text-[14px] sm:px-6 md:flex-row md:items-center md:justify-between md:gap-6">
        <strong className="font-semibold text-[#1d1d1f]">{content.audience}</strong>
        <span className="text-[#6e6e73]">{content.segment}</span>
        <Link href={content.cta.href} className="font-semibold text-[#26337c] hover:text-[#3550a4]">
          {content.cta.label} ↗
        </Link>
      </div>
    </div>
  );
}
