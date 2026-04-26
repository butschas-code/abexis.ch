import Image from "next/image";
import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { homeLeistungenBlock } from "@/data/home-page-content";
import { homeBlogTeaserImage, serviceCardImages } from "@/data/site-images";
import { homeImagery } from "@/executive-search/lib/images/homeImagery";

const SERVICE_KEYS = [
  "digitale-transformation",
  "unternehmensstrategie",
  "vertriebmarketing",
  "veränderungsmanagement",
  "prozessoptimierung",
  "projektmanagement",
] as const;

const LEISTUNG_IMAGES: readonly string[] = [
  ...SERVICE_KEYS.map((k) => serviceCardImages[k]),
  homeImagery.trust,
];

export function HomeLeistungenGridSection() {
  const c = homeLeistungenBlock;
  return (
    <MotionSection className="apple-animated-gradient py-20 md:py-28">
      <div className="mx-auto max-w-[1068px] pl-[max(1.5rem,env(safe-area-inset-left,0px))] pr-[max(1.5rem,env(safe-area-inset-right,0px))] md:px-6">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{c.eyebrow}</p>
        <h2 className="mx-auto mt-2 max-w-[32ch] text-center text-[32px] font-semibold tracking-[-0.03em] text-[#1d1d1f] text-balance sm:text-[40px] md:text-[48px]">
          {c.headline}
        </h2>
        <p className="mx-auto mt-4 max-w-[60ch] text-center text-[17px] leading-relaxed text-[#6e6e73]">{c.intro}</p>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {c.items.map((s, i) => {
            const img = LEISTUNG_IMAGES[i] ?? homeBlogTeaserImage;
            return (
              <Link
                key={s.href}
                href={s.href}
                className="group flex flex-col overflow-hidden rounded-[28px] bg-white shadow-[var(--apple-shadow)] ring-1 ring-black/[0.04] transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--apple-shadow-lg)] hover:ring-brand-500/25"
              >
                <div className="relative isolate aspect-[16/10] w-full overflow-hidden bg-[#f5f5f7]">
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover saturate-[0.78] contrast-[1.08] transition duration-700 group-hover:scale-[1.04]"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <div className="abexis-tint-overlay" />
                </div>
                <div className="flex flex-1 flex-col px-6 pb-8 pt-6">
                  <h3 className="text-[19px] font-semibold leading-snug tracking-[-0.02em] text-[#1d1d1f]">{s.title}</h3>
                  <p className="mt-3 flex-1 text-[14px] leading-relaxed text-[#6e6e73]">{s.body}</p>
                  <span className="mt-5 inline-flex text-[14px] font-medium text-brand-900 transition group-hover:translate-x-0.5 group-hover:text-brand-500">
                    Mehr erfahren →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </MotionSection>
  );
}
