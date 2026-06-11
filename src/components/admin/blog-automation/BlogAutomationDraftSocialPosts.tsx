"use client";

import { useCallback, useEffect, useState } from "react";

import { useCmsAuth } from "@/cms/auth/cms-auth-context";
import {
  apiPatchBlogSocialPost,
} from "@/cms/services/blog-automation-cms-api-client";
import type { BlogSocialListItem } from "@/cms/services/blog-pipeline-types";
import { recordMediaAsset } from "@/cms/services/media-client";
import { AdminFileUpload } from "@/components/admin/AdminFileUpload";
import {
  adminBody,
  adminBtnGhost,
  adminBtnSecondary,
  adminInput,
  adminPanel,
  adminSectionLabel,
} from "@/components/admin/admin-ui";

async function copyRichTextToClipboard(text: string): Promise<boolean> {
  const t = text ?? "";
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(t);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    if (typeof document === "undefined") return false;
    const ta = document.createElement("textarea");
    ta.value = t;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

function formatUsedWhen(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("de-CH", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function formatNuelinkTarget(target: string | null): string {
  if (target === "linkedin") return "LinkedIn";
  if (target === "x") return "X";
  return "Nuelink";
}

type Props = {
  rows: BlogSocialListItem[];
  onRefresh: () => Promise<void>;
  onFlashSuccess: (message: string) => void;
  onFlashError: (message: string) => void;
};

export function BlogAutomationDraftSocialPosts(props: Props) {
  const { rows, onRefresh, onFlashSuccess, onFlashError } = props;

  if (rows.length === 0) {
    return (
      <section className="space-y-3">
        <h2 className={adminSectionLabel}>Social-Posts</h2>
        <div className={`rounded-xl border border-black/[0.06] bg-white/85 px-5 py-4 ${adminBody}`}>
          Keine Kurztexte für diesen Entwurf. Unter Blog-Automation können Sie «Social-Texte mit erstellen» einschalten — dann erscheinen beim nächsten Entwurf LinkedIn-Vorschläge hier.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div>
        <h2 className={adminSectionLabel}>Social-Posts</h2>
        <p className={`mt-1 max-w-[52rem] ${adminBody}`}>
          Text und Bild prüfen. Beim Freigeben des Entwurfs übergibt das CMS den LinkedIn-Post automatisch an Nuelink.
        </p>
      </div>

      <div className="space-y-6">
        {rows.map((row) => (
          <BlogSocialPostCard
            key={row.id}
            row={row}
            onRefresh={onRefresh}
            onFlashSuccess={onFlashSuccess}
            onFlashError={onFlashError}
          />
        ))}
      </div>
    </section>
  );
}

function BlogSocialPostCard(props: {
  row: BlogSocialListItem;
  onRefresh: () => Promise<void>;
  onFlashSuccess: (message: string) => void;
  onFlashError: (message: string) => void;
}) {
  const { row, onRefresh, onFlashSuccess, onFlashError } = props;
  const { user } = useCmsAuth();
  const [linkedinPost, setLinkedinPost] = useState(row.linkedinPost);
  const [socialImageUrl, setSocialImageUrl] = useState(row.socialImageUrl ?? "");
  const [socialImageAlt, setSocialImageAlt] = useState(row.socialImageAlt ?? "");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setLinkedinPost(row.linkedinPost);
      setSocialImageUrl(row.socialImageUrl ?? "");
      setSocialImageAlt(row.socialImageAlt ?? "");
    });
  }, [row.id, row.linkedinPost, row.socialImageAlt, row.socialImageUrl, row.usedAt]);

  const getToken = useCallback(async () => {
    if (!user) throw new Error("Bitte melden Sie sich an.");
    return user.getIdToken();
  }, [user]);

  const doCopy = useCallback(
    async (label: string, text: string) => {
      const ok = await copyRichTextToClipboard(text);
      if (ok) {
        onFlashSuccess(`${label} wurde in die Zwischenablage kopiert.`);
      } else {
        onFlashError("Kopieren nicht möglich. Bitte Text manuell markieren oder einen anderen Browser verwenden.");
      }
    },
    [onFlashError, onFlashSuccess],
  );

  const onSave = useCallback(async () => {
    setBusy(true);
    try {
      const token = await getToken();
      await apiPatchBlogSocialPost(token, row.id, {
        linkedinPost,
        socialImageUrl: socialImageUrl.trim() || null,
        socialImageAlt: socialImageAlt.trim() || null,
      });
      onFlashSuccess("LinkedIn-Text und Bild gespeichert.");
      await onRefresh();
    } catch (e) {
      onFlashError(e instanceof Error ? e.message : "Speichern fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  }, [getToken, linkedinPost, onFlashError, onFlashSuccess, onRefresh, row.id, socialImageAlt, socialImageUrl]);

  const onMarkUsed = useCallback(async () => {
    setBusy(true);
    try {
      const token = await getToken();
      await apiPatchBlogSocialPost(token, row.id, { markUsed: true });
      onFlashSuccess("Als verwendet markiert.");
      await onRefresh();
    } catch (e) {
      onFlashError(e instanceof Error ? e.message : "Aktion fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  }, [getToken, onFlashError, onFlashSuccess, onRefresh, row.id]);

  const onUploadSocialImage = useCallback(
    async (url: string, meta: { storagePath: string; file: File }) => {
      try {
        await recordMediaAsset({
          storagePath: meta.storagePath,
          downloadUrl: url,
          originalFileName: meta.file.name,
          mimeType: meta.file.type || "image/jpeg",
          sizeBytes: meta.file.size,
          kind: "hero",
          source: "blog_automation_social",
        });
      } catch {
        /* The social row can still use the uploaded URL. */
      }
      setSocialImageUrl(url);
      if (!socialImageAlt.trim()) setSocialImageAlt(meta.file.name.replace(/\.[^.]+$/, ""));
    },
    [socialImageAlt],
  );

  return (
    <div className={`space-y-4 ${adminPanel} p-6 sm:p-7`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-text-tertiary)]">Vorschlag für Social Media</p>
          {row.usedAt ? (
            <p className={`mt-2 text-[13px] font-medium text-emerald-900`}>Verwendet · {formatUsedWhen(row.usedAt)}</p>
          ) : row.nuelinkLastSentAt ? (
            <p className={`mt-2 text-[13px] font-medium text-emerald-900`}>
              An Nuelink übergeben · {formatNuelinkTarget(row.nuelinkLastTarget)} · {formatUsedWhen(row.nuelinkLastSentAt)}
            </p>
          ) : (
            <p className={`mt-2 ${adminBody} text-[13px]`}>Noch nicht als verwendet markiert.</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={`${adminBtnSecondary} text-[13px]`} disabled={busy || !user} onClick={() => void onSave()}>
            Speichern
          </button>
          <button type="button" className={`${adminBtnGhost} text-[13px]`} disabled={busy || !user} onClick={() => void onMarkUsed()}>
            Als verwendet markieren
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-black/[0.05] pb-4">
        <button type="button" className={`${adminBtnGhost} text-[13px]`} disabled={busy} onClick={() => void doCopy("LinkedIn-Text", linkedinPost)}>
          LinkedIn kopieren
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(180px,260px)_1fr] md:items-start">
        <div className="overflow-hidden rounded-xl border border-black/[0.06] bg-black/[0.02]">
          {socialImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={socialImageUrl} alt="" className="aspect-video w-full object-cover" />
          ) : (
            <div className={`flex aspect-video items-center justify-center px-4 text-center ${adminBody} text-[13px]`}>
              Kein LinkedIn-Bild gewählt.
            </div>
          )}
        </div>
        <div className="space-y-3">
          <label className="block space-y-2">
            <span className="text-[14px] font-medium text-[var(--apple-text)]">LinkedIn-Bild URL</span>
            <input className={adminInput} value={socialImageUrl} onChange={(e) => setSocialImageUrl(e.target.value)} />
          </label>
          <label className="block space-y-2">
            <span className="text-[14px] font-medium text-[var(--apple-text)]">Bildbeschreibung</span>
            <input className={adminInput} value={socialImageAlt} onChange={(e) => setSocialImageAlt(e.target.value)} />
          </label>
          <AdminFileUpload
            path={`cms/media/social/${row.blogDraftId}/`}
            accept="image/*"
            label="LinkedIn-Bild hochladen"
            onUploadSuccess={(url, meta) => void onUploadSocialImage(url, meta)}
          />
        </div>
      </div>

      <label className="block space-y-2">
        <span className="text-[14px] font-medium text-[var(--apple-text)]">LinkedIn</span>
        <textarea className={`${adminInput} min-h-[140px]`} value={linkedinPost} onChange={(e) => setLinkedinPost(e.target.value)} />
      </label>
    </div>
  );
}
