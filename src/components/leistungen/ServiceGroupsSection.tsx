import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { getServiceGroupsContent, type ServiceGroupsLocale } from "@/data/service-groups";

/** Homepage: editorial list of the four service groups, as in the client's draft. */
export function ServiceGroupsSection({ locale = "de", id }: { locale?: ServiceGroupsLocale; id?: string }) {
  const c = getServiceGroupsContent(locale).services;

  return (
    <MotionSection className="scroll-mt-24 bg-white" id={id}>
      <div className="mx-auto max-w-[1068px] px-5 py-16 sm:px-6 md:py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[640px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">{c.eyebrow}</p>
            <h2 className="mt-3 text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f] text-balance md:text-[44px]">
              {c.title}
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-[#6e6e73] md:text-[18px]">{c.intro}</p>
          </div>
          <Link href={c.allHref} className="inline-flex min-h-11 shrink-0 items-center font-semibold text-[#26337c] hover:text-[#3550a4]">
            {c.allLabel} ↗
          </Link>
        </div>

        <div className="mt-12 grid gap-x-14 gap-y-14 md:mt-16 lg:grid-cols-2">
          {c.groups.map((group, gi) => (
            <article key={group.title} className="border-t border-[#1d1d1f]/80">
              <div className="grid grid-cols-[2.25rem_1fr] gap-x-3 border-b border-black/[0.08] pb-6 pt-7">
                <span className="pt-2 text-[13px] font-semibold tabular-nums text-[#45b3e2]">{String(gi + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-[26px] font-semibold leading-tight tracking-[-0.025em] text-[#1d1d1f] md:text-[30px]">{group.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#6e6e73]">{group.body}</p>
                </div>
              </div>
              <ul>
                {group.items.map((item) => (
                  <li key={item.href} className="border-b border-black/[0.08] last:border-0">
                    <Link href={item.href} className="group flex items-start justify-between gap-6 py-6">
                      <div className="min-w-0">
                        <h4 className="text-[18px] font-semibold tracking-[-0.015em] text-[#1d1d1f] transition-colors group-hover:text-[#26337c]">
                          {item.title}
                        </h4>
                        <p className="mt-1.5 max-w-[46ch] text-[15px] leading-relaxed text-[#6e6e73]">{item.body}</p>
                      </div>
                      <span
                        aria-hidden
                        className="mt-1 text-[18px] text-[#26337c] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      >
                        ↗
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
