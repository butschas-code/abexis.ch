import Image from "next/image";
import Link from "next/link";
import type { PublishedPostWithId } from "@/public-site/cms";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='1' x2='1' y2='0'%3E%3Cstop stop-color='%2326337c' stop-opacity='0.08'/%3E%3Cstop offset='1' stop-color='%2345b3e2' stop-opacity='0.1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='675' fill='url(%23g)'/%3E%3C/svg%3E";

type Props = {
  primary: PublishedPostWithId;
  secondary?: PublishedPostWithId[];
  hrefFor: (post: PublishedPostWithId) => string;
  categoryLine?: string | null;
  authorName?: string | null;
};

export function InsightsFeatured({ primary, secondary = [], hrefFor, categoryLine, authorName }: Props) {
  const hero = primary.heroImageUrl?.trim() || PLACEHOLDER;
  const dateStr = primary.publishedAt
    ? new Date(primary.publishedAt).toLocaleDateString("de-CH", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <section className="mb-14 md:mb-20">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Empfehlung</p>
          <h2 className="mt-1.5 font-serif text-[22px] font-medium tracking-[-0.02em] text-[#1d1d1f] md:text-[26px]">
            Herausgehoben
          </h2>
        </div>
        <div className="hidden h-px flex-1 translate-y-[-10px] bg-gradient-to-r from-transparent via-black/[0.12] to-transparent md:block" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8 lg:items-stretch">
        <Link
          href={hrefFor(primary)}
          className="group relative block overflow-hidden rounded-[32px] bg-[#0a0a0b] shadow-[0_32px_80px_-40px_rgba(20,28,64,0.75)] ring-1 ring-white/10"
        >
          <div className="relative isolate aspect-[16/11] w-full md:aspect-auto md:min-h-[320px] lg:min-h-[380px]">
            <Image
              src={hero}
              alt=""
              fill
              className="object-cover saturate-[0.78] contrast-[1.08] opacity-[0.92] transition duration-[1.4s] group-hover:scale-[1.03] group-hover:opacity-100"
              sizes="(min-width: 1024px) 58vw, 100vw"
              priority
              unoptimized={hero.startsWith("data:")}
            />
            <div className="abexis-tint-overlay" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/50 to-transparent md:via-[#050508]/25" />
            <div className="absolute inset-x-0 bottom-0 p-7 md:p-9 lg:p-10">
              {dateStr ? (
                <time className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/55">{dateStr}</time>
              ) : null}
              {categoryLine ? (
                <span className="mt-3 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-md">
                  {categoryLine}
                </span>
              ) : null}
              <h3 className="mt-4 max-w-[20ch] font-serif text-[28px] font-medium leading-[1.08] tracking-[-0.03em] text-white text-balance md:max-w-[24ch] md:text-[36px] lg:text-[40px]">
                {primary.title}
              </h3>
              {primary.excerpt ? (
                <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-white/78 md:text-[16px]">
                  <span className="line-clamp-3">{primary.excerpt}</span>
                </p>
              ) : null}
              {authorName ? <p className="mt-5 text-[13px] font-medium text-white/65">{authorName}</p> : null}
            </div>
          </div>
        </Link>

        {secondary.length > 0 ? (
          <div className="flex flex-col gap-4">
            {secondary.map((post) => {
              const smImg = post.heroImageUrl?.trim() || PLACEHOLDER;
              const smDate = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("de-CH", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : null;
              return (
                <Link
                  key={post.id}
                  href={hrefFor(post)}
                  className="group flex gap-4 rounded-2xl border border-black/[0.06] bg-white/80 p-3 pr-4 shadow-sm ring-1 ring-black/[0.03] transition hover:border-[var(--brand-500)]/25 hover:shadow-md"
                >
                  <div className="relative isolate h-[104px] w-[120px] shrink-0 overflow-hidden rounded-xl bg-[#f2f3f7]">
                    <Image
                      src={smImg}
                      alt=""
                      fill
                      className="object-cover saturate-[0.78] contrast-[1.08] transition duration-700 group-hover:scale-105"
                      sizes="120px"
                      unoptimized={smImg.startsWith("data:")}
                    />
                    <div className="abexis-tint-overlay" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center py-1">
                    {smDate ? (
                      <time className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#a1a1a6]">{smDate}</time>
                    ) : null}
                    <h4 className="mt-1.5 font-serif text-[16px] font-medium leading-snug tracking-[-0.02em] text-[#1d1d1f] transition group-hover:text-[var(--brand-900)] line-clamp-3">
                      {post.title}
                    </h4>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
