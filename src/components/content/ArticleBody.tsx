import { BlogBody } from "@/components/content/BlogBody";

type Props = {
  /** Firestore `posts.body` : JSON envelope or legacy HTML. */
  storedBody: string;
};

/**
 * Public article column: comfortable measure and CMS typography (`blog-prose` / `legacy-prose`).
 */
export function ArticleBody({ storedBody }: Props) {
  return (
    <div className="article-detail-prose-root">
      <BlogBody
        storedBody={storedBody}
        className="article-detail-prose blog-prose legacy-prose max-w-none text-[1.0625rem] leading-[1.75]"
      />
    </div>
  );
}
