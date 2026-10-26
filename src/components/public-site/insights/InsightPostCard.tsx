import Link from "next/link";
import { BlogThumbnail } from "@/components/public-site/insights/BlogThumbnail";
import { resolvePostHeroImageUrl } from "@/lib/cms/resolve-post-hero-image";
import type { PublishedPostWithId } from "@/public-site/cms";

type Props = {
  post: PublishedPostWithId;
  href: string;
  categoryLine?: string | null;
  authorName?: string | null;
  sizes?: string;
  dateLocale?: string;
  /** Slightly denser variant for secondary grid columns */
  density?: "comfortable" | "compact";
};

export function InsightPostCard({
  post,
  href,
  categoryLine,
  authorName,
  sizes,
  dateLocale = "de-CH",
  density = "comfortable",
}: Props) {
  const img = resolvePostHeroImageUrl(post);
  const dateStr = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(dateLocale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;
  const titlePad = density === "compact" ? "px-5 pb-6 pt-4" : "px-7 pb-8 pt-6";
  const titleSize = density === "compact" ? "text-[1.125rem] leading-snug" : "text-[1.35rem] md:text-[1.45rem] leading-[1.2]";

  return (
    <article className="group relative h-full">
      <div className="pointer-events-none absolute -inset-px rounded-[28px] bg-gradient-to-br from-white via-white to-[color-mix(in_srgb,var(--brand-500)_6%,white)] opacity-0 transition duration-500 group-hover:opacity-100" />
      <Link
        href={href}
        className="relative flex h-full flex-col overflow-hidden rounded-[27px] bg-white shadow-[0_1px_0_rgba(0,0,0,0.04),0_18px_44px_-28px_rgba(38,51,124,0.35)] ring-1 ring-black/[0.05] transition duration-500 hover:-translate-y-[3px] hover:shadow-[0_24px_56px_-24px_rgba(38,51,124,0.45)] hover:ring-[var(--brand-500)]/22"
      >
        <BlogThumbnail src={img} sizes={sizes ?? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"} />
        <div className={`flex flex-1 flex-col ${titlePad}`}>
          {categoryLine ? (
            <span className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-900)]">{categoryLine}</span>
          ) : null}
          {dateStr ? (
            <time className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#86868b]">{dateStr}</time>
          ) : null}
          <h2
            className={`font-serif font-medium tracking-[-0.02em] text-[#0f0f10] transition group-hover:text-[var(--brand-900)] ${titleSize} ${dateStr ? "mt-2.5" : ""}`}
          >
            {post.title}
          </h2>
          {post.excerpt ? (
            <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-[#6e6e73]">{post.excerpt}</p>
          ) : null}
          <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-5 text-[12px] text-[#86868b]">
            {authorName ? <span>{authorName}</span> : null}
            {authorName && post.tags?.length ? <span className="text-[#d2d2d7]">·</span> : null}
            {post.tags?.length ? <span className="line-clamp-1">{post.tags.slice(0, 3).join(" · ")}</span> : null}
          </div>
        </div>
      </Link>
    </article>
  );
}
