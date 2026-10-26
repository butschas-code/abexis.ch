import Link from "next/link";
import { ArticleBody } from "@/components/content/ArticleBody";
import { MotionSection } from "@/components/motion/MotionSection";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { PublicImage as Image } from "@/components/site/PublicImage";
import { resolvePostHeroImageUrl } from "@/lib/cms/resolve-post-hero-image";
import type { PublishedPostPageData, PublishedPostWithId } from "@/public-site/cms";
import { RelatedInsights } from "./RelatedInsights";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";

type Props = {
  data: PublishedPostPageData;
  related: PublishedPostWithId[];
  backHref?: string;
  backLabel?: string;
};

function formatDate(iso: string | null | undefined) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("de-CH", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return null;
  }
}

export function CmsBlogPostView({ data, related, backHref = "/blog", backLabel = "← Alle Insights" }: Props) {
  const { post, authorName, categories } = data;
  const heroImage = resolvePostHeroImageUrl(post);
  const dateLong = formatDate(post.publishedAt);
  const tagList = Array.isArray(post.tags) ? post.tags : [];
  const hasTags = tagList.length > 0;
  const hasCategories = categories.length > 0;

  // Post images are LinkedIn thumbnails with text baked in, so they are not used as a full-bleed
  // hero (title would repeat over it). Shown in full inside the article instead.
  const ownImage = post.heroImageUrl?.trim() ? heroImage : null;

  return (
    <InteriorPageRoot>
      <article className="mx-auto max-w-3xl px-4 pb-16 pt-28 sm:px-6 sm:pb-20 md:pb-28 md:pt-36">
      <SchemaMarkup
        type="Article"
        path={`/blog/${post.slug}`}
        data={{
          title: post.title,
          excerpt: post.excerpt,
          image: heroImage,
          publishedAt: post.publishedAt,
          authorName: authorName,
        }}
        breadcrumbs={[
          { name: "Startseite", url: "/" },
          { name: "Insights", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />
      <nav aria-label="Brotkrumen">
        <Link
          href={backHref}
          className="inline-flex text-[14px] font-medium text-[var(--brand-900)] underline-offset-4 transition-colors hover:text-[var(--brand-500)] hover:underline"
        >
          {backLabel}
        </Link>
      </nav>

      <header className="mt-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Insights</p>
        <h1 className="mt-3 text-[clamp(1.875rem,3.5vw+1rem,3rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f] text-balance">
          {post.title}
        </h1>
        {dateLong || authorName || hasCategories ? (
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] text-[#6e6e73]">
            {dateLong ? <time dateTime={post.publishedAt ?? undefined}>{dateLong}</time> : null}
            {dateLong && authorName ? <span className="text-black/20">·</span> : null}
            {authorName ? <span>{authorName}</span> : null}
            {hasCategories ? (
              <span className="inline-flex flex-wrap gap-2">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/blog?category=${encodeURIComponent(c.id)}`}
                    className="rounded-full border border-black/[0.08] px-2.5 py-0.5 text-[13px] font-medium text-[var(--brand-900)] transition hover:border-[var(--brand-900)]/30"
                  >
                    {c.name}
                  </Link>
                ))}
              </span>
            ) : null}
          </div>
        ) : null}
      </header>

      {post.excerpt?.trim() ? (
        <p className="mt-8 text-[19px] leading-relaxed text-[#3d3d41] md:text-[21px]">{post.excerpt.trim()}</p>
      ) : null}

      {ownImage ? (
        <figure className="mt-10 overflow-hidden rounded-[20px] bg-[#f5f6fa] ring-1 ring-black/[0.06]">
          <Image src={ownImage} alt="" width={1600} height={1000} priority className="h-auto w-full" sizes="(min-width: 768px) 720px, 100vw" />
        </figure>
      ) : null}

      <MotionSection className={post.excerpt?.trim() ? "mt-10 border-t border-black/[0.06] pt-10" : "mt-8 border-t border-black/[0.06] pt-10"}>
        <ArticleBody storedBody={post.body} />
      </MotionSection>

      {(hasTags || hasCategories) && (
        <footer className="mt-12 flex flex-wrap items-baseline gap-x-6 gap-y-3 border-t border-black/[0.06] pt-8 text-[14px] text-[#6e6e73]">
          {hasCategories ? (
            <div>
              <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a1a1a6]">
                Themen
              </span>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/blog?category=${encodeURIComponent(c.id)}`}
                  className="mr-3 font-medium text-[var(--brand-900)] underline-offset-2 hover:underline"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          ) : null}
          {hasTags ? (
            <div>
              <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a1a1a6]">
                Stichwörter
              </span>
              <span>{tagList.join(" · ")}</span>
            </div>
          ) : null}
        </footer>
      )}

      <RelatedInsights posts={related} />
      </article>
    </InteriorPageRoot>
  );
}
