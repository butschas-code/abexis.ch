"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CMS_PATHS } from "@/admin/paths";
import type { CmsPostListItem } from "@/cms/services/posts-client";

type Props = {
  post: CmsPostListItem;
  busy: boolean;
  onDuplicate: () => void;
  onDelete: () => void;
  onPrepareLinkedIn: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
};

export function PostsRowMenu({ post, busy, onDuplicate, onDelete, onPrepareLinkedIn, onPublish, onUnpublish }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative flex justify-end">
      <button
        type="button"
        disabled={busy}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/[0.08] bg-white text-[var(--apple-text-secondary)] hover:bg-black/[0.03] hover:text-[var(--apple-text)] disabled:opacity-50"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Aktionen"
      >
        <span className="text-lg leading-none">⋯</span>
      </button>
      {open ? (
        <div
          className="absolute right-0 top-full z-30 mt-1 min-w-[200px] rounded-xl border border-black/[0.08] bg-white py-1 shadow-[var(--apple-shadow-lg)]"
          role="menu"
        >
          <Link
            role="menuitem"
            href={CMS_PATHS.adminPostEdit(post.id)}
            className="block px-3 py-2 text-sm text-[var(--apple-text)] hover:bg-black/[0.04]"
            onClick={() => setOpen(false)}
          >
            Bearbeiten
          </Link>
          <button
            type="button"
            role="menuitem"
            className="block w-full px-3 py-2 text-left text-sm text-[var(--apple-text)] hover:bg-black/[0.04]"
            onClick={() => {
              setOpen(false);
              onDuplicate();
            }}
          >
            Duplizieren
          </button>
          {post.status !== "published" ? (
            <button
              type="button"
              role="menuitem"
              className="block w-full px-3 py-2 text-left text-sm text-[var(--apple-text)] hover:bg-black/[0.04]"
              onClick={() => {
                setOpen(false);
                onPublish();
              }}
            >
              Veröffentlichen
            </button>
          ) : null}
          {post.status === "published" ? (
            <button
              type="button"
              role="menuitem"
              className="block w-full px-3 py-2 text-left text-sm text-[var(--apple-text)] hover:bg-black/[0.04]"
              onClick={() => {
                setOpen(false);
                onPrepareLinkedIn();
              }}
            >
              LinkedIn vorbereiten
            </button>
          ) : null}
          {post.status === "published" ? (
            <button
              type="button"
              role="menuitem"
              className="block w-full px-3 py-2 text-left text-sm text-[var(--apple-text)] hover:bg-black/[0.04]"
              onClick={() => {
                setOpen(false);
                onUnpublish();
              }}
            >
              Zurückziehen (Entwurf)
            </button>
          ) : null}
          <div className="my-1 border-t border-black/[0.06]" />
          <button
            type="button"
            role="menuitem"
            className="block w-full px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
          >
            Löschen…
          </button>
        </div>
      ) : null}
    </div>
  );
}
