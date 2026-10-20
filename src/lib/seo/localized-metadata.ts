import type { Metadata } from "next";

export function localizedAlternates(dePath: string, enPath: string, locale: "de" | "en"): Metadata["alternates"] {
  return {
    canonical: locale === "en" ? enPath : dePath,
    languages: {
      "de-CH": dePath,
      "en-CH": enPath,
      "x-default": dePath,
    },
  };
}
