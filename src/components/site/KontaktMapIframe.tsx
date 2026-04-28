import { hinwilGoogleMapsEmbedSrc } from "@/data/pages";

type Props = {
  className?: string;
};

/** Eingebettete Google-Karte (Hinwil) : feste Adresse wie auf der Kontaktseite. */
export function KontaktMapIframe({ className = "" }: Props) {
  return (
    <div
      className={`relative aspect-[4/3] w-full overflow-hidden rounded-[28px] bg-[#e8eaed] ring-1 ring-black/[0.08] lg:aspect-auto lg:h-full lg:min-h-[300px] ${className}`.trim()}
    >
      <iframe
        title="Karte: Abexis GmbH, Zihlstrasse 25, 8340 Hinwil"
        className="absolute inset-0 h-full w-full border-0"
        src={hinwilGoogleMapsEmbedSrc}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
