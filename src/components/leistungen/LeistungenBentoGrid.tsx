import Image from "next/image";
import Link from "next/link";
import { fokusthemenMeta } from "@/data/pages";
import { serviceCardImages } from "@/data/site-images";

type ServiceSlug = keyof typeof serviceCardImages;

type BentoItem = {
  s: (typeof fokusthemenMeta)[number];
  img: string;
  i: number;
};

function indexLabel(i: number) {
  return String(i + 1).padStart(2, "0");
}

function buildItems(): BentoItem[] {
  return fokusthemenMeta.map((s, i) => ({
    s,
    img: serviceCardImages[s.slug as ServiceSlug],
    i,
  }));
}

/**
 * Gleichmässiges Raster (3×2 ab `xl`) — gleiche Kartenstruktur; Raster `items-stretch` + `h-full`
 * gleicht die Höhe pro Zeile aus, `min-h-*` setzt eine gemeinsame Untergrenze (Luft unten ok).
 */
export function LeistungenBentoGrid() {
  const items = buildItems();

  return (
    <div
      lang="de"
      className="grid grid-cols-1 items-stretch gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3 xl:grid-rows-2 xl:gap-6"
    >
      {items.map((item, idx) => (
        <LeistungenBentoCard key={item.s.slug} item={item} imagePriority={idx === 0} />
      ))}
    </div>
  );
}

function LeistungenBentoCard({ item, imagePriority }: { item: BentoItem; imagePriority?: boolean }) {
  const { s, img, i } = item;

  return (
    <Link
      href={s.href}
      className="group flex h-full min-h-[30rem] flex-col self-stretch overflow-hidden rounded-[28px] bg-white shadow-[var(--apple-shadow)] ring-1 ring-black/[0.06] transition duration-500 hover:-translate-y-0.5 hover:shadow-[var(--apple-shadow-lg)] hover:ring-brand-500/20 sm:min-h-[31rem] xl:min-h-[32rem]"
    >
      <div className="relative h-44 w-full shrink-0 overflow-hidden bg-[#ececf0] sm:h-48 xl:h-[11.5rem]">
        <Image
          src={img}
          alt=""
          fill
          priority={imagePriority}
          className="object-cover transition duration-[1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
        <div className="abexis-tint-overlay" />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/[0.18] to-transparent opacity-0 transition group-hover:opacity-100"
          aria-hidden
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-6 pb-7 pt-5 sm:px-7 sm:pb-8 sm:pt-6">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">{s.subtitle}</p>
          <span className="shrink-0 font-mono text-[10px] font-medium tabular-nums tracking-[0.15em] text-[#c7c7cc]">
            {indexLabel(i)}
          </span>
        </div>
        <h2 className="mt-2 text-balance break-words text-[17px] font-semibold leading-snug tracking-[-0.02em] text-[#1d1d1f] transition group-hover:text-brand-900 sm:text-[18px] sm:leading-[1.35]">
          {s.title}
        </h2>
        <p className="mt-3 line-clamp-4 text-[13px] leading-relaxed text-[#6e6e73] sm:text-[14px] sm:leading-relaxed">
          {s.excerpt}
        </p>
        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[13px] font-semibold text-brand-900 transition group-hover:gap-3 group-hover:text-brand-500">
          Mehr erfahren
          <span aria-hidden className="translate-y-px text-base leading-none">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
