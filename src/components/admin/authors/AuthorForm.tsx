"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CMS_PATHS } from "@/admin/paths";
import { uploadAuthorPortrait } from "@/cms/services/author-portrait-upload-client";
import { getAuthorForAdmin, saveAuthor, type AuthorUpsertInput } from "@/cms/services/authors-admin-client";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageContainer, AdminPageHeader, AdminPageSection } from "@/components/admin/AdminPageContainer";

type Mode = "new" | "edit";

const empty = (id: string): AuthorUpsertInput => ({
  id,
  name: "",
  role: "",
  imageUrl: null,
  bio: "",
});

export function AuthorForm({ mode, authorId }: { mode: Mode; authorId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState<AuthorUpsertInput>(() => empty(authorId));
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (mode !== "edit") return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const row = await getAuthorForAdmin(authorId);
        if (cancelled) return;
        if (!row) {
          setError("Profil nicht gefunden.");
          return;
        }
        setInput({
          id: row.id,
          name: row.name,
          role: row.role,
          imageUrl: row.imageUrl,
          bio: row.bio ?? "",
        });
      } catch {
        if (!cancelled) setError("Profil konnte nicht geladen werden.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, authorId]);

  const onPortrait = useCallback(
    async (file: File | null) => {
      if (!file) return;
      setUploading(true);
      setError(null);
      try {
        const { url } = await uploadAuthorPortrait(authorId, file);
        setInput((s) => ({ ...s, imageUrl: url }));
      } catch {
        setError("Bild-Upload ist fehlgeschlagen.");
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = "";
      }
    },
    [authorId],
  );

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      setError(null);
      try {
        if (!input.name.trim()) throw new Error("Name ist erforderlich.");
        await saveAuthor(input);
        router.push(CMS_PATHS.adminAuthors);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen.");
      } finally {
        setSaving(false);
      }
    },
    [input, router],
  );

  const clearImage = () => setInput((s) => ({ ...s, imageUrl: null }));

  if (loading) {
    return (
      <AdminPageContainer>
        <AdminLoading message="Profil wird geladen…" />
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title={mode === "new" ? "Neues Profil" : "Autor:in bearbeiten"}
        description="Name, Rolle, Bild und Kurzbiografie für Beiträge."
        actions={
          <Link
            href={CMS_PATHS.adminAuthors}
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-[var(--apple-text-secondary)] hover:border-black/15"
          >
            Zur Liste
          </Link>
        }
      />

      <AdminPageSection>
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
        ) : null}

        <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-6">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-[var(--apple-text)]">Name</span>
            <input
              required
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none ring-[var(--brand-500)]/20 focus:ring-4"
              value={input.name}
              onChange={(e) => setInput((s) => ({ ...s, name: e.target.value }))}
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-[var(--apple-text)]">Rolle</span>
            <input
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none ring-[var(--brand-500)]/20 focus:ring-4"
              value={input.role}
              onChange={(e) => setInput((s) => ({ ...s, role: e.target.value }))}
              placeholder="z. B. Managing Partner"
            />
          </label>

          <div className="space-y-3 rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
            <span className="text-sm font-medium text-[var(--apple-text)]">Porträt</span>
            <div className="flex flex-wrap items-start gap-4">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-[var(--apple-bg-subtle)] ring-1 ring-black/10">
                {input.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- admin preview
                  <img src={input.imageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-[var(--apple-text-tertiary)]">
                    Kein Bild
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  disabled={uploading || saving}
                  onChange={(e) => void onPortrait(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-[var(--apple-text-secondary)] file:mr-3 file:rounded-full file:border-0 file:bg-[var(--brand-900)] file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-[var(--brand-900-hover)]"
                />
                {uploading ? <p className="text-xs text-[var(--apple-text-secondary)]">Wird hochgeladen…</p> : null}
                {input.imageUrl ? (
                  <button
                    type="button"
                    onClick={clearImage}
                    className="text-xs font-medium text-red-700 hover:underline"
                  >
                    Bild entfernen
                  </button>
                ) : null}
                <label className="mt-2 block space-y-1">
                  <span className="text-xs text-[var(--apple-text-secondary)]">oder Bild-URL einfügen</span>
                  <input
                    type="url"
                    inputMode="url"
                    placeholder="https://…"
                    disabled={uploading || saving}
                    className="w-full rounded-lg border border-black/10 bg-white px-2.5 py-2 text-xs outline-none ring-[var(--brand-500)]/20 focus:ring-2"
                    value={input.imageUrl ?? ""}
                    onChange={(e) => {
                      const v = e.target.value.trim();
                      setInput((s) => ({ ...s, imageUrl: v.length ? v : null }));
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-[var(--apple-text)]">Kurzbiografie</span>
            <textarea
              rows={5}
              className="w-full resize-y rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none ring-[var(--brand-500)]/20 focus:ring-4"
              value={input.bio}
              onChange={(e) => setInput((s) => ({ ...s, bio: e.target.value }))}
              placeholder="Optional : erscheint z. B. auf Profilseiten oder im Beitragskopf."
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={saving || uploading}
              className="rounded-full bg-[var(--brand-900)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--brand-950)] disabled:opacity-50"
            >
              {saving ? "Wird gespeichert…" : "Speichern"}
            </button>
          </div>
        </form>
      </AdminPageSection>
    </AdminPageContainer>
  );
}
