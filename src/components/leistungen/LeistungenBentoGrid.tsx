import { PublicImage as Image } from "@/components/site/PublicImage";
import Link from "next/link";
import { getServiceGroupsContent, type ServiceGroupsLocale } from "@/data/service-groups";
import { serviceCardImages } from "@/data/site-images";

/**
 * Leistungen overview: image cards arranged in the client's four service groups.
 * Card images come from `serviceCardImages`; VMO and Project Reality Check use the client's artwork.
 */
export function LeistungenBentoGrid({
  locale = "de",
  moreLabel = "Mehr erfahren",
}: {
  locale?: ServiceGroupsLocale;
  moreLabel?: string;
}) {
  const { groups } = getServiceGroupsContent(locale).services;

  return (
    <div lang={locale} className="space-y-16 md:space-y-20">
      {groups.map((group, gi) => (
        <section key={group.title}>
          <div className="mb-6 grid grid-cols-[2.25rem_1fr] gap-x-3 border-t border-[#1d1d1f]/80 pt-6 md:mb-8">
            <span className="pt-2 text-[13px] font-semibold tabular-nums text-[#45b3e2]">{String(gi + 1).padStart(2, "0")}</span>
            <div>
              <h2 className="text-[26px] font-semibold leading-tight tracking-[-0.025em] text-[#1d1d1f] md:text-[30px]">{group.title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-[#6e6e73]">{group.body}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 items-stretch gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
            {group.items.map((item, ii) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-[var(--apple-shadow)] ring-1 ring-black/[0.06] transition duration-500 hover:-translate-y-0.5 hover:shadow-[var(--apple-shadow-lg)] hover:ring-brand-500/20"
              >
                <div className="relative h-48 w-full shrink-0 overflow-hidden bg-[#ececf0] xl:h-[12.5rem]">
                  <Image
                    src={serviceCardImages[item.imageKey]}
                    alt=""
                    fill
                    priority={gi === 0 && ii === 0}
                    className={`object-cover ${item.imagePosition ?? "object-center"} transition duration-[1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]`}
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                </div>
                <div className="flex min-h-0 flex-1 flex-col px-6 pb-7 pt-5 sm:px-7 sm:pb-8 sm:pt-6">
                  <h3 className="text-balance break-words text-[18px] font-semibold leading-snug tracking-[-0.02em] text-[#1d1d1f] transition group-hover:text-brand-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-[#6e6e73]">{item.body}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[13px] font-semibold text-brand-900 transition group-hover:gap-3 group-hover:text-brand-500">
                    {moreLabel}
                    <span aria-hidden className="translate-y-px text-base leading-none">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
