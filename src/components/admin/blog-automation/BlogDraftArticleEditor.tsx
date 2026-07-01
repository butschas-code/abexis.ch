"use client";

import dynamic from "next/dynamic";

import { adminPanel } from "@/components/admin/admin-ui";

const PostBodyEditor = dynamic(
  () => import("@/components/admin/PostBodyEditor").then((m) => ({ default: m.PostBodyEditor })),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex min-h-[280px] items-center justify-center rounded-xl border border-black/10 bg-[var(--apple-bg-elevated)] px-4 text-sm text-[var(--apple-text-secondary)]"
        role="status"
        aria-live="polite"
      >
        Editor wird geladen…
      </div>
    ),
  },
);

type Props = {
  value: string;
  onChange: (html: string) => void;
  readOnly?: boolean;
  previewHtml: string;
  uploadPath?: string;
};

export function BlogDraftArticleEditor({ value, onChange, readOnly, previewHtml, uploadPath }: Props) {
  if (readOnly) {
    return (
      <div className={`${adminPanel} p-6 sm:p-8`}>
        <div
          className="article-detail-prose blog-prose legacy-prose max-w-none text-[1rem] leading-[1.75]"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      </div>
    );
  }

  return (
    <div className={`${adminPanel} overflow-hidden p-2 sm:p-3`}>
      <PostBodyEditor value={value} onChange={onChange} uploadPath={uploadPath} />
    </div>
  );
}
