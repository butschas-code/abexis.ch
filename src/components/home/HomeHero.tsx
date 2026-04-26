"use client";

import type { ReactNode } from "react";
import { PageHero } from "@/components/site/PageHero";
import { homeHeroImage } from "@/data/site-images";

type Props = { children: ReactNode };

export function HomeHero({ children }: Props) {
  return (
    <PageHero
      imageSrc={homeHeroImage}
      priority
      contentPlacement="lower"
      imageObjectClassName="object-[32%_40%] md:object-center"
    >
      {children}
    </PageHero>
  );
}
