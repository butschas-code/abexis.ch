"use client";

import Image from "next/image";
import { ParallaxBlock } from "@/components/executive-search/ParallaxBlock";
import { PublicContentWidth } from "@/components/site/PublicContentWidth";

type Props = {
  imageSrc: string;
  imageAlt: string;
  title: string;
  body: string;
  /** Optional second paragraph (premium pacing). */
  bodyParagraph2?: string;
};

/**
 * Full-bleed parallax image band with strong scrims; white overlay copy (PageHero-style readability).
 */
export function ExecutiveSearchStatementParallax({ imageSrc, imageAlt, title, body, bodyParagraph2 }: Props) {
  return (
    <div
      className="relative w-screen max-w-[100vw] overflow-hidden"
      style={{ marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}
    >
      <div className="absolute inset-0 z-0 min-h-[min(80vh,880px)]">
        <ParallaxBlock yRange={[36, -36]} className="h-full min-h-[min(80vh,880px)] w-full">
          <div className="relative h-[125%] min-h-[min(80vh,880px)] w-full -translate-y-[8%]">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover object-center"
              sizes="100vw"
              quality={90}
            />
          </div>
        </ParallaxBlock>
      </div>

      {/* Strong dark scrims: photo stays visible at top, copy band is reliably dark */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#020308]/65 via-[#080c18]/90 to-[#000000]/98"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/20 to-transparent"
        aria-hidden
      />
      <div className="abexis-hero-fullbleed-overlay absolute inset-0 z-[1]" aria-hidden />

      <div className="relative z-10 flex min-h-[min(80vh,880px)] flex-col justify-end py-16 sm:py-20 md:py-28">
        <PublicContentWidth>
          <h2 className="max-w-[36ch] text-[28px] font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-[36px] md:max-w-[40ch] md:text-[40px]">
            {title}
          </h2>
          <p className="mt-6 max-w-3xl text-[17px] leading-relaxed text-white/90 sm:text-[18px] md:leading-[1.75]">{body}</p>
          {bodyParagraph2 ? (
            <p className="mt-5 max-w-3xl text-[17px] leading-relaxed text-white/88 sm:text-[18px] md:leading-[1.75]">{bodyParagraph2}</p>
          ) : null}
        </PublicContentWidth>
      </div>
    </div>
  );
}
