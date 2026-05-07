"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CMS_PATHS } from "@/admin/paths";
import { getCategoryForAdmin, saveCategory, type CategoryUpsertInput } from "@/cms/services/categories-admin-client";
import { slugFromTitle } from "@/lib/cms/slug-from-title";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageContainer, AdminPageHeader, AdminPageSection } from "@/components/admin/AdminPageContainer";

type Mode = "new" | "edit";

const empty = (id: string): CategoryUpsertInput => ({
  id,
  name: "",
  slug: "",
  site: "abexis",
});

export function CategoryForm({ mode, categoryId }: { mode: Mode; categoryId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState<CategoryUpsertInput>(() => empty(categoryId));
  const slugTouched = useRef(false);

  useEffect(() => {
    if (mode !== "edit") return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const row = await getCategoryForAdmin(categoryId);
        if (cancelled) return;
        if (!row) {
          setError("Kategorie nicht gefunden.");
          return;
        }
        setInput({
          id: row.id,
          name: row.name,
          slug: row.slug,
          site: row.site,
        });
        slugTouched.current = true;
      } catch {
        if (!cancelled) setError("Kategorie konnte nicht geladen werden.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, categoryId]);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      setError(null);
      try {
        if (!input.name.trim()) throw new Error("Name ist erforderlich.");
        if (!input.slug.trim()) throw new Error("Slug ist erforderlich.");
        await saveCategory({ ...input, site: "abexis" });
        router.push(CMS_PATHS.adminCategories);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen.");
      } finally {
        setSaving(false);
      }
    },
    [input, router],
  );

  if (loading) {
    return (
      <AdminPageContainer>
        <AdminLoading message="Kategorie wird geladen…" />
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title={mode === "new" ? "Neue Kategorie" : "Kategorie bearbeiten"}
        description="Name und URL-Slug für die Kategorie."
        actions={
          <Link
            href={CMS_PATHS.adminCategories}
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
              onChange={(e) => {
                const name = e.target.value;
                setInput((s) => {
                  const next = { ...s, name };
                  if (!slugTouched.current) {
                    next.slug = slugFromTitle(name);
                  }
                  return next;
                });
              }}
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-[var(--apple-text)]">Slug</span>
            <input
              required
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 font-mono text-sm outline-none ring-[var(--brand-500)]/20 focus:ring-4"
              value={input.slug}
              onChange={(e) => {
                slugTouched.current = true;
                setInput((s) => ({ ...s, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }));
              }}
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={saving}
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
