"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useCmsAuth } from "@/cms/auth/cms-auth-context";
import {
  apiDeleteBlogSocialPost,
  apiPatchBlogSocialPost,
} from "@/cms/services/blog-automation-cms-api-client";
import type { BlogSocialListItem } from "@/cms/services/blog-pipeline-types";
import { recordMediaAsset } from "@/cms/services/media-client";
import { AdminFileUpload } from "@/components/admin/AdminFileUpload";
import { LinkedInPostEditor } from "@/components/admin/LinkedInPostEditor";
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

export type BlogSocialPostsFlush = () => Promise<void>;

type Props = {
  rows: BlogSocialListItem[];
  onRefresh: () => Promise<void>;
  onFlashSuccess: (message: string) => void;
  onFlashError: (message: string) => void;
  /**
   * Draft-level actions («Änderungen speichern», Freigabe, Veröffentlichung) reload this
   * screen. They must flush LinkedIn edits first, otherwise the reload restores the
   * last stored caption and the adjustment disappears.
   */
  flushRef?: { current: BlogSocialPostsFlush | null };
};

export function BlogAutomationDraftSocialPosts(props: Props) {
  const { rows, onRefresh, onFlashSuccess, onFlashError, flushRef } = props;
  const saversRef = useRef(new Map<string, () => Promise<void>>());

  const registerSave = useCallback((id: string, save: (() => Promise<void>) | null) => {
    if (save) saversRef.current.set(id, save);
    else saversRef.current.delete(id);
  }, []);

  useEffect(() => {
    if (!flushRef) return;
    flushRef.current = async () => {
      for (const save of saversRef.current.values()) {
        await save();
      }
    };
    return () => {
      flushRef.current = null;
    };
  }, [flushRef]);

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
          Text und Bild prüfen. «Änderungen speichern» sichert den LinkedIn-Text mit. Beim Freigeben wird der Post vorbereitet; an Nuelink geht er erst, wenn der Blogbeitrag live geschaltet wird.
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
            registerSave={registerSave}
          />
        ))}
      </div>
    </section>
  );
}

type SocialFieldSnapshot = {
  id: string;
  linkedinPost: string;
  socialImageUrl: string;
  socialImageAlt: string;
};

function snapshotFromRow(row: BlogSocialListItem): SocialFieldSnapshot {
  return {
    id: row.id,
    linkedinPost: row.linkedinPost,
    socialImageUrl: row.socialImageUrl ?? "",
    socialImageAlt: row.socialImageAlt ?? "",
  };
}

function BlogSocialPostCard(props: {
  row: BlogSocialListItem;
  onRefresh: () => Promise<void>;
  onFlashSuccess: (message: string) => void;
  onFlashError: (message: string) => void;
  registerSave: (id: string, save: (() => Promise<void>) | null) => void;
}) {
  const { row, onRefresh, onFlashSuccess, onFlashError, registerSave } = props;
  const { user } = useCmsAuth();
  const [linkedinPost, setLinkedinPost] = useState(row.linkedinPost);
  const [socialImageUrl, setSocialImageUrl] = useState(row.socialImageUrl ?? "");
  const [socialImageAlt, setSocialImageAlt] = useState(row.socialImageAlt ?? "");
  const [busy, setBusy] = useState(false);
  const linkedinRef = useRef(row.linkedinPost);
  const imageUrlRef = useRef(row.socialImageUrl ?? "");
  const imageAltRef = useRef(row.socialImageAlt ?? "");
  const baselineRef = useRef<SocialFieldSnapshot>(snapshotFromRow(row));
  const dirtyRef = useRef(false);
  const syncGen = useRef(0);
  const serverId = row.id;
  const serverLinkedin = row.linkedinPost;
  const serverImageUrl = row.socialImageUrl ?? "";
  const serverImageAlt = row.socialImageAlt ?? "";

  const markDirty = useCallback(() => {
    const base = baselineRef.current;
    dirtyRef.current =
      linkedinRef.current !== base.linkedinPost ||
      imageUrlRef.current !== base.socialImageUrl ||
      imageAltRef.current !== base.socialImageAlt;
  }, []);

  const applyLinkedin = useCallback(
    (value: string) => {
      linkedinRef.current = value;
      setLinkedinPost(value);
      markDirty();
    },
    [markDirty],
  );

  const applyImageUrl = useCallback(
    (value: string) => {
      imageUrlRef.current = value;
      setSocialImageUrl(value);
      markDirty();
    },
    [markDirty],
  );

  const applyImageAlt = useCallback(
    (value: string) => {
      imageAltRef.current = value;
      setSocialImageAlt(value);
      markDirty();
    },
    [markDirty],
  );

  useEffect(() => {
    const next: SocialFieldSnapshot = {
      id: serverId,
      linkedinPost: serverLinkedin,
      socialImageUrl: serverImageUrl,
      socialImageAlt: serverImageAlt,
    };
    const gen = ++syncGen.current;
    queueMicrotask(() => {
      if (syncGen.current !== gen) return;
      // A draft reload must not put the stored caption back over text the editor has not saved yet.
      const switchedRow = baselineRef.current.id !== next.id;
      const textDirty = !switchedRow && linkedinRef.current !== baselineRef.current.linkedinPost;
      const imageDirty =
        !switchedRow &&
        (imageUrlRef.current !== baselineRef.current.socialImageUrl ||
          imageAltRef.current !== baselineRef.current.socialImageAlt);
      const linkedin = textDirty ? linkedinRef.current : next.linkedinPost;
      const imageUrl = imageDirty ? imageUrlRef.current : next.socialImageUrl;
      const imageAlt = imageDirty ? imageAltRef.current : next.socialImageAlt;
      baselineRef.current = {
        id: next.id,
        linkedinPost: textDirty ? baselineRef.current.linkedinPost : next.linkedinPost,
        socialImageUrl: imageDirty ? baselineRef.current.socialImageUrl : next.socialImageUrl,
        socialImageAlt: imageDirty ? baselineRef.current.socialImageAlt : next.socialImageAlt,
      };
      dirtyRef.current = textDirty || imageDirty;
      linkedinRef.current = linkedin;
      imageUrlRef.current = imageUrl;
      imageAltRef.current = imageAlt;
      setLinkedinPost(linkedin);
      setSocialImageUrl(imageUrl);
      setSocialImageAlt(imageAlt);
    });
  }, [serverId, serverImageAlt, serverImageUrl, serverLinkedin]);

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

  const writeFields = useCallback(async () => {
    const token = await getToken();
    const imageUrlRaw = imageUrlRef.current;
    const imageUrl = imageUrlRaw.trim();
    const caption = linkedinRef.current;
    const alt = imageAltRef.current;
    const inheritedBlogImage =
      !row.socialImageManualOverride && !!row.blogHeroImageUrl && imageUrl === row.blogHeroImageUrl;
    await apiPatchBlogSocialPost(token, row.id, {
      linkedinPost: caption,
      socialImageUrl: inheritedBlogImage ? null : imageUrl || null,
      socialImageAlt: inheritedBlogImage ? null : alt.trim() || null,
    });
    baselineRef.current = {
      id: row.id,
      linkedinPost: caption,
      socialImageUrl: imageUrlRaw,
      socialImageAlt: alt,
    };
    dirtyRef.current =
      linkedinRef.current !== caption || imageUrlRef.current !== imageUrlRaw || imageAltRef.current !== alt;
  }, [getToken, row.blogHeroImageUrl, row.id, row.socialImageManualOverride]);

  const persistIfDirty = useCallback(async () => {
    if (!dirtyRef.current) return;
    await writeFields();
  }, [writeFields]);

  useEffect(() => {
    registerSave(row.id, persistIfDirty);
    return () => registerSave(row.id, null);
  }, [persistIfDirty, registerSave, row.id]);

  const onSave = useCallback(async () => {
    setBusy(true);
    try {
      await writeFields();
      onFlashSuccess("LinkedIn-Text und Bild gespeichert.");
      await onRefresh();
    } catch (e) {
      onFlashError(e instanceof Error ? e.message : "Speichern fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  }, [onFlashError, onFlashSuccess, onRefresh, writeFields]);

  const onUseBlogImage = useCallback(async () => {
    setBusy(true);
    try {
      const token = await getToken();
      await apiPatchBlogSocialPost(token, row.id, {
        socialImageUrl: null,
        socialImageAlt: null,
      });
      onFlashSuccess("LinkedIn verwendet wieder das Blogbild.");
      await onRefresh();
    } catch (e) {
      onFlashError(e instanceof Error ? e.message : "Bild konnte nicht übernommen werden.");
    } finally {
      setBusy(false);
    }
  }, [getToken, onFlashError, onFlashSuccess, onRefresh, row.id]);

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

  const onDelete = useCallback(async () => {
    const ok = window.confirm("Diesen LinkedIn-Entwurf löschen? Der Blog-Entwurf bleibt erhalten.");
    if (!ok) return;
    setBusy(true);
    try {
      const token = await getToken();
      await apiDeleteBlogSocialPost(token, row.id);
      onFlashSuccess("Social-Entwurf gelöscht.");
      await onRefresh();
    } catch (e) {
      onFlashError(e instanceof Error ? e.message : "Löschen fehlgeschlagen.");
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
      applyImageUrl(url);
      if (!imageAltRef.current.trim()) applyImageAlt(meta.file.name.replace(/\.[^.]+$/, ""));
    },
    [applyImageAlt, applyImageUrl],
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
          <button type="button" className={`${adminBtnGhost} text-[13px] text-red-700`} disabled={busy || !user} onClick={() => void onDelete()}>
            Löschen
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
          {row.socialImageManualOverride && row.blogHeroImageUrl && row.socialImageUrl !== row.blogHeroImageUrl ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-amber-950">
              Das LinkedIn-Bild weicht vom Blogbild ab. Das ist ok, wenn es bewusst so gewählt wurde.
              <div className="mt-3">
                <button type="button" className={`${adminBtnSecondary} text-[13px]`} disabled={busy || !user} onClick={() => void onUseBlogImage()}>
                  Blogbild übernehmen
                </button>
              </div>
            </div>
          ) : row.blogHeroImageUrl ? (
            <p className={`${adminBody} text-[13px]`}>LinkedIn verwendet das Blogbild, solange hier kein eigenes Bild gespeichert wird.</p>
          ) : null}
          <label className="block space-y-2">
            <span className="text-[14px] font-medium text-[var(--apple-text)]">LinkedIn-Bild URL</span>
            <input className={adminInput} value={socialImageUrl} onChange={(e) => applyImageUrl(e.target.value)} />
          </label>
          <label className="block space-y-2">
            <span className="text-[14px] font-medium text-[var(--apple-text)]">Bildbeschreibung</span>
            <input className={adminInput} value={socialImageAlt} onChange={(e) => applyImageAlt(e.target.value)} />
          </label>
          <AdminFileUpload
            path={`cms/media/social/${row.blogDraftId}/`}
            accept="image/*"
            label="LinkedIn-Bild hochladen"
            onUploadSuccess={(url, meta) => void onUploadSocialImage(url, meta)}
          />
        </div>
      </div>

      <LinkedInPostEditor value={linkedinPost} onChange={applyLinkedin} imageUrl={socialImageUrl} />
    </div>
  );
}
