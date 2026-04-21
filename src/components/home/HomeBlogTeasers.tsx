import Image from "next/image";
import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { getAllBlogPosts } from "@/data/pages";
import { getBlogListCoverByIndex } from "@/data/site-images";
import { getPublishedCmsPosts, type PublishedPostWithId } from "@/public-site/cms";

export type HomeBlogTeaser = {
  slug: string;
  title: string;
  /** ISO date string for display */
  publishedISO: string | null;
  tags: string[];
  coverSrc: string;
};

function coverForCmsPost(post: PublishedPostWithId, fallbackIndex: number): string {
  const u = post.heroImageUrl?.trim();
  if (u && /^https?:\/\//i.test(u)) {
    /** Legacy scrape/CMS may store Hoststar as `http://`; Next/Image + browsers prefer https. */
    if (u.startsWith("http://files.designer.hoststar.ch")) {
      return `https://${u.slice("http://".length)}`;
    }
    return u;
  }
  return getBlogListCoverByIndex(fallbackIndex);
}

/**
 * Latest published CMS posts for this deployment (site-aware via `getPublishedCmsPosts`),
 * or legacy JSON posts when Admin SDK is unavailable (e.g. local without credentials).
 */
export async function getHomeBlogTeasers(): Promise<HomeBlogTeaser[]> {
  let cms: PublishedPostWithId[] = [];
  try {
    cms = await getPublishedCmsPosts(4);
  } catch (err) {
    console.error("[cms] getPublishedCmsPosts failed for home teasers; using legacy JSON.", err);
  }
  // TODO(production): drop JSON fallback once builds always have Admin credentials, or feature-flag for staging only.
  if (cms.length > 0) {
    return cms.map((p, idx) => ({
      slug: p.slug,
      title: p.title,
      publishedISO: p.publishedAt,
      tags: p.tags ?? [],
      coverSrc: coverForCmsPost(p, idx),
    }));
  }

  const legacy = getAllBlogPosts()
    .slice()
    .sort((a, b) => (a.publishedISO < b.publishedISO ? 1 : -1))
    .slice(0, 4);

  const sortedAll = getAllBlogPosts().slice().sort((a, b) => (a.publishedISO < b.publishedISO ? 1 : -1));

  return legacy.map((p, idx) => {
    const coverIdx = sortedAll.findIndex((x) => x.slug === p.slug);
    return {
      slug: p.slug,
      title: p.title,
      publishedISO: p.publishedISO ?? null,
      tags: p.tags ?? [],
      coverSrc: getBlogListCoverByIndex(coverIdx >= 0 ? coverIdx : idx),
    };
  });
}

export async function HomeBlogTeasers() {
  const posts = await getHomeBlogTeasers();

  return (
    <MotionSection className="py-20 md:py-28">
      <div className="mx-auto max-w-[1068px] px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Insights</p>
            <h2 className="mt-2 text-[32px] font-semibold tracking-[-0.03em] text-[#1d1d1f] md:text-[40px]">
              Aus dem Blog
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-[15px] font-medium text-brand-900 transition-colors duration-200 hover:text-brand-500 hover:underline"
          >
            Alle Beiträge
          </Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group overflow-hidden rounded-[28px] bg-white shadow-[var(--apple-shadow)] ring-1 ring-black/[0.04] transition hover:-translate-y-0.5 hover:shadow-[var(--apple-shadow-lg)]"
            >
              <div className="relative aspect-[16/9] w-full bg-[#f5f5f7]">
                <Image
                  src={p.coverSrc}
                  alt=""
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="px-6 pb-7 pt-5">
                <time className="text-[11px] font-medium uppercase tracking-widest text-[#86868b]">
                  {p.publishedISO ? new Date(p.publishedISO).toLocaleDateString("de-CH") : ""}
                </time>
                <h3 className="mt-2 text-[21px] font-semibold leading-snug tracking-[-0.02em] text-[#1d1d1f] group-hover:text-brand-900">
                  {p.title}
                </h3>
                {p.tags?.length ? (
                  <p className="mt-2 text-[12px] text-[#86868b]">{p.tags.slice(0, 4).join(" · ")}</p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
