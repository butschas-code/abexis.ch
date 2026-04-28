import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CmsBlogPostView } from "@/components/public-site/insights/CmsBlogPostView";
import {
  buildCmsPostMetadata,
  listSearchSitePublishedPosts,
  loadPublishedPostPageData,
  loadRelatedPublishedPosts,
  normalizeBlogSlugParam,
} from "@/public-site/cms";

export const revalidate = 120;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await listSearchSitePublishedPosts(100);
  return posts.map((p) => ({ slug: encodeURIComponent(p.slug) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: raw } = await params;
  const slug = normalizeBlogSlugParam(raw);
  const post = await loadPublishedPostPageData(slug);
  if (!post) return {};
  const meta = buildCmsPostMetadata(post.post, `/executive-search/blog/${encodeURIComponent(slug)}`);
  // Canonical points to the primary /blog/ URL to avoid duplicate-content penalties.
  return {
    ...meta,
    alternates: { ...meta.alternates, canonical: `/blog/${encodeURIComponent(slug)}` },
  };
}

export default async function ExecutiveSearchBlogPostPage({ params }: Props) {
  const { slug: raw } = await params;
  const slug = normalizeBlogSlugParam(raw);
  if (!slug) notFound();

  const pageData = await loadPublishedPostPageData(slug);
  if (!pageData) notFound();

  const related = await loadRelatedPublishedPosts(pageData.post, 3).catch(() => []);

  return (
    <CmsBlogPostView
      data={pageData}
      related={related}
      backHref="/executive-search"
      backLabel="← Executive Search"
    />
  );
}
