import Link from "next/link";
import { ArticleBody } from "@/components/content/ArticleBody";
import { MotionSection } from "@/components/motion/MotionSection";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";
import { resolvePostHeroImageUrl } from "@/lib/cms/resolve-post-hero-image";
import type { PublishedPostPageData, PublishedPostWithId } from "@/public-site/cms";
import { RelatedInsights } from "./RelatedInsights";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";

type Props = {
  data: PublishedPostPageData;
  related: PublishedPostWithId[];
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

export function CmsBlogPostView({ data, related }: Props) {
  const { post, authorName, categories } = data;
  const heroImage = resolvePostHeroImageUrl(post);
  const dateLong = formatDate(post.publishedAt);
  const tagList = Array.isArray(post.tags) ? post.tags : [];
  const hasTags = tagList.length > 0;
  const hasCategories = categories.length > 0;

  return (
    <InteriorPageLayout
      eyebrow="Insights"
      title={<span className="font-serif font-medium tracking-[-0.03em] text-balance">{post.title}</span>}
      maxWidth="1068"
      contentMaxWidth="3xl"
      heroImage={heroImage}
      heroPriority
      wrapContentInMotion={false}
      contentClassName="pt-8 md:pt-10"
      description={
        <div className="space-y-4">
          {dateLong ? (
            <time className="block text-[12px] font-medium uppercase tracking-[0.18em] text-white/70" dateTime={post.publishedAt ?? undefined}>
              {dateLong}
            </time>
          ) : null}
          {(authorName || hasCategories) && (
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] text-white/85">
              {authorName ? <span>{authorName}</span> : null}
              {authorName && hasCategories ? <span className="text-white/40">·</span> : null}
              {hasCategories ? (
                <span className="inline-flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/blog?category=${encodeURIComponent(c.id)}`}
                      className="rounded-full border border-white/25 bg-white/10 px-2.5 py-0.5 text-[13px] font-medium text-white/95 backdrop-blur-sm transition hover:border-white/40 hover:bg-white/15"
                    >
                      {c.name}
                    </Link>
                  ))}
                </span>
              ) : null}
            </p>
          )}
        </div>
      }
    >
      <SchemaMarkup
        type="Article"
        data={{
          title: post.title,
          excerpt: post.excerpt,
          image: heroImage,
          publishedAt: post.publishedAt,
          authorName: authorName,
        }}
      />
      <SchemaMarkup
        type="BreadcrumbList"
        data={[
          { name: "Startseite", url: "/" },
          { name: "Insights", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />
      <nav aria-label="Brotkrumen">
        <Link
          href="/blog"
          className="inline-flex text-[14px] font-medium text-[var(--brand-900)] underline-offset-4 transition-colors hover:text-[var(--brand-500)] hover:underline"
        >
          ← Alle Insights
        </Link>
      </nav>

      {post.excerpt?.trim() ? (
        <p className="mt-8 max-w-3xl font-serif text-[1.35rem] leading-[1.45] tracking-[-0.015em] text-[#3d3d41] md:text-[1.45rem]">
          {post.excerpt.trim()}
        </p>
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
    </InteriorPageLayout>
  );
}
