import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { PublicImage as Image } from "@/components/site/PublicImage";
import { getServiceGroupsContent, type ServiceGroupsLocale } from "@/data/service-groups";

/** Two image teasers (VMO, Project Reality Check) using the client-supplied artwork. */
export function FeaturedOffersSection({ locale = "de" }: { locale?: ServiceGroupsLocale }) {
  const c = getServiceGroupsContent(locale).featured;

  return (
    <MotionSection className="bg-[#f5f6fa]">
      <div className="mx-auto max-w-[1068px] px-5 py-16 sm:px-6 md:py-24">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[640px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{c.eyebrow}</p>
            <h2 className="mt-3 text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f] text-balance md:text-[44px]">
              {c.title}
            </h2>
          </div>
          <p className="max-w-[36ch] text-[15px] leading-relaxed text-[#6e6e73]">{c.intro}</p>
        </div>

        <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2">
          {c.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col overflow-hidden rounded-[24px] bg-white ring-1 ring-black/[0.06] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(38,51,124,0.12)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#151d52]">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  className={`object-cover ${item.imagePosition} transition duration-700 group-hover:scale-[1.03]`}
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-7 sm:p-9">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#26337c]">{item.eyebrow}</p>
                <h3 className="mt-3 text-[24px] font-semibold leading-tight tracking-[-0.025em] text-[#1d1d1f] md:text-[28px]">{item.title}</h3>
                <p className="mt-4 flex-1 text-[15px] leading-relaxed text-[#6e6e73] md:text-[16px]">{item.body}</p>
                <span className="mt-6 inline-flex min-h-11 items-center font-semibold text-[#26337c] group-hover:text-[#3550a4]">
                  {item.cta} ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
