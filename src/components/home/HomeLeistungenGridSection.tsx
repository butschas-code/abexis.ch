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
    <MotionSection className="apple-animated-gradient relative isolate overflow-x-hidden py-14 sm:py-20 md:py-28">
      <div className="mx-auto min-w-0 max-w-[1068px] pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] sm:pl-6 sm:pr-6">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{c.eyebrow}</p>
        <h2 className="mx-auto mt-2 max-w-full text-center text-balance break-words text-[28px] font-semibold leading-none tracking-[-0.03em] text-[#1d1d1f] hyphens-auto sm:max-w-[32ch] sm:text-[36px] md:text-[44px] lg:text-[48px]">
          {c.headline}
        </h2>
        <p className="mx-auto mt-3 max-w-[60ch] text-center text-[16px] leading-relaxed text-[#6e6e73] sm:mt-4 sm:text-[17px]">{c.intro}</p>
        <div className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {c.items.map((s, i) => {
            const img = LEISTUNG_IMAGES[i] ?? homeBlogTeaserImage;
            return (
              <Link
                key={s.href}
                href={s.href}
                className="group flex flex-col overflow-hidden rounded-[22px] bg-white shadow-[var(--apple-shadow)] ring-1 ring-black/[0.04] transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--apple-shadow-lg)] hover:ring-brand-500/25 sm:rounded-[28px] active:scale-[0.99]"
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
                <div className="flex flex-1 flex-col px-5 pb-7 pt-5 sm:px-6 sm:pb-8 sm:pt-6">
                  <h3 className="text-[17px] font-semibold leading-snug tracking-[-0.02em] text-[#1d1d1f] sm:text-[19px]">{s.title}</h3>
                  <p className="mt-2.5 flex-1 text-[14px] leading-relaxed text-[#6e6e73] sm:mt-3">{s.body}</p>
                  <span className="mt-4 inline-flex min-h-11 items-center text-[14px] font-medium text-brand-900 transition group-hover:translate-x-0.5 group-hover:text-brand-500 sm:mt-5">
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
