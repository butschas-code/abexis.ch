"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CMS_PATHS } from "@/admin/paths";
import { getVacancyForAdmin, saveVacancy, type VacancyUpsertInput } from "@/cms/services/vacancy-write-client";
import type { VacancyFile } from "@/cms/types/vacancy";
import type { PostStatus } from "@/cms/types/enums";
import type { SiteKey } from "@/cms/types/site";
import { parsePostBody, serializePostBody } from "@/lib/cms/post-body-storage";
import { slugFromTitle } from "@/lib/cms/slug-from-title";
import {
  adminBtnGhost,
  adminBtnPrimary,
  adminBtnSecondary,
  adminFeedbackError,
  adminFeedbackSuccess,
  adminInput,
  adminInputError,
  adminPanelInset,
  adminSectionLabel,
} from "@/components/admin/admin-ui";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageHeader } from "@/components/admin/AdminPageContainer";
import { AdminFileUpload } from "../AdminFileUpload";

const PostBodyEditor = dynamic(
  () => import("@/components/admin/PostBodyEditor").then((m) => ({ default: m.PostBodyEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-black/10 bg-[var(--apple-bg-elevated)] px-4 text-sm text-[var(--apple-text-secondary)]">
        Editor wird geladen…
      </div>
    ),
  },
);

type Mode = "new" | "edit";

function blankForm(id: string): VacancyUpsertInput {
  return {
    id,
    title: "",
    slug: "",
    excerpt: "",
    sector: "",
    location: "",
    employmentType: "Vollzeit",
    hook: "",
    body: serializePostBody(""),
    files: [],
    apply: "",
    site: "both",
    status: "draft",
  };
}

type Props = { mode: Mode; vacancyId: string };

export function VacancyForm({ mode, vacancyId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<VacancyUpsertInput>(blankForm(vacancyId));
  const [bodyHtml, setBodyHtml] = useState("");
  const [loadingExisting, setLoadingExisting] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [savedBanner, setSavedBanner] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugManual, setSlugManual] = useState(mode === "edit");

  useEffect(() => {
    if (mode !== "edit") return;
    setLoadingExisting(true);
    getVacancyForAdmin(vacancyId)
      .then((v) => {
        if (v) {
          const { html } = parsePostBody(v.body);
          setForm({ ...v, id: vacancyId, publishedAt: v.publishedAt ?? undefined });
          setBodyHtml(html);
        } else {
          setError("Vakanz nicht gefunden.");
        }
      })
      .catch(() => setError("Vakanz konnte nicht geladen werden."))
      .finally(() => setLoadingExisting(false));
  }, [mode, vacancyId]);

  function set<K extends keyof VacancyUpsertInput>(key: K, value: VacancyUpsertInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSavedBanner(false);
  }

  function handleTitleChange(value: string) {
    set("title", value);
    if (!slugManual) set("slug", slugFromTitle(value));
  }

  function handleBodyChange(html: string) {
    setBodyHtml(html);
    set("body", serializePostBody(html));
    setSavedBanner(false);
  }

  // Files
  function addFile() {
    set("files", [...form.files, { label: "", url: "" }]);
  }
  function updateFile(i: number, patch: Partial<VacancyFile>) {
    set("files", form.files.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
  }
  function removeFile(i: number) {
    set("files", form.files.filter((_, idx) => idx !== i));
  }

  async function handleSave(newStatus?: PostStatus) {
    setSaving(true);
    setError(null);
    setSavedBanner(false);
    try {
      const validFiles = form.files.filter((f) => f.label.trim() && f.url.trim());
      const payload: VacancyUpsertInput = {
        ...(newStatus ? { ...form, status: newStatus } : form),
        files: validFiles,
      };
      await saveVacancy(payload);
      if (newStatus) setForm((prev) => ({ ...prev, status: newStatus }));
      setSavedBanner(true);
      if (mode === "new") router.replace(CMS_PATHS.adminVacancyEdit(vacancyId));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Speichern fehlgeschlagen.");
    } finally {
      setSaving(false);
    }
  }

  if (loadingExisting) return <AdminLoading message="Vakanz wird geladen…" />;

  const isPublished = form.status === "published";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={mode === "new" ? "Neue Vakanz" : form.title || "Vakanz bearbeiten"}
        description={mode === "new" ? "Neues Executive Search Mandat erfassen." : `Slug: ${form.slug}`}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => router.push(CMS_PATHS.adminVacancies)} className={adminBtnGhost}>
              ← Übersicht
            </button>
            <button type="button" disabled={saving} onClick={() => void handleSave()} className={adminBtnSecondary}>
              {saving ? "Wird gespeichert…" : "Entwurf speichern"}
            </button>
            {!isPublished ? (
              <button type="button" disabled={saving} onClick={() => void handleSave("published")} className={adminBtnPrimary}>
                Veröffentlichen
              </button>
            ) : (
              <button type="button" disabled={saving} onClick={() => void handleSave("draft")} className={adminBtnSecondary}>
                Zurückziehen
              </button>
            )}
          </div>
        }
      />

      {savedBanner && (
        <div className={adminFeedbackSuccess}>
          Vakanz gespeichert{isPublished ? " und veröffentlicht" : ""}.
        </div>
      )}
      {error && <div className={adminFeedbackError}>{error}</div>}

      {/* Metadata */}
      <div className={adminPanelInset}>
        <p className={`mb-5 ${adminSectionLabel}`}>Kerndaten</p>
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium text-[var(--apple-text)]">Titel *</span>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Account Manager Industrie & Digitalisierung (m/w/d)"
              className={`${adminInput} ${!form.title ? adminInputError : ""}`}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium text-[var(--apple-text)]">Slug (URL-Segment) *</span>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => { setSlugManual(true); set("slug", e.target.value); }}
              placeholder="account-manager-industrie"
              className={`${adminInput} font-mono text-[14px]`}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium text-[var(--apple-text)]">Kurzbeschreibung (Teaser-Text)</span>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="Kurze Beschreibung für Karten und Übersichtsseiten…"
              className={`${adminInput} resize-y`}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium text-[var(--apple-text)]">Hook (Hero-Satz)</span>
            <input
              type="text"
              value={form.hook}
              onChange={(e) => set("hook", e.target.value)}
              placeholder="Du willst nicht einfach Software verkaufen, sondern echten Impact schaffen?"
              className={adminInput}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--apple-text)]">Branche</span>
              <input type="text" value={form.sector} onChange={(e) => set("sector", e.target.value)} placeholder="Industrie & Digitalisierung" className={adminInput} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--apple-text)]">Standort</span>
              <input type="text" value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Schweiz" className={adminInput} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--apple-text)]">Anstellungsart</span>
              <input type="text" value={form.employmentType} onChange={(e) => set("employmentType", e.target.value)} placeholder="Vollzeit" className={adminInput} />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--apple-text)]">Website</span>
              <select value={form.site} onChange={(e) => set("site", e.target.value as SiteKey)} className={adminInput}>
                <option value="search">abexis-search.ch</option>
                <option value="abexis">abexis.ch</option>
                <option value="both">Beide</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-[var(--apple-text)]">Status</span>
              <select value={form.status} onChange={(e) => set("status", e.target.value as PostStatus)} className={adminInput}>
                <option value="draft">Entwurf</option>
                <option value="published">Veröffentlicht</option>
                <option value="archived">Archiviert</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className={adminPanelInset}>
        <p className={`mb-5 ${adminSectionLabel}`}>Inhalt</p>
        <PostBodyEditor
          value={bodyHtml}
          onChange={handleBodyChange}
          placeholder="Stellenbeschreibung: Ausgangslage, Aufgaben, Anforderungen, Angebot… H2 für Abschnittstitel, Aufzählungen für Listen."
          uploadPath={`cms/vacancies/${vacancyId}/body`}
        />
      </div>

      {/* Files */}
      <div className={adminPanelInset}>
        <div className="mb-4 flex items-center justify-between">
          <p className={adminSectionLabel}>Dateien zum Herunterladen</p>
          <button type="button" onClick={addFile} className="rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[12px] font-medium text-[var(--brand-900)] shadow-[0_1px_0_rgba(0,0,0,0.03)] transition hover:bg-[var(--apple-bg-subtle)]">
            + Datei hinzufügen
          </button>
        </div>
        {form.files.length === 0 ? (
          <p className="text-[13px] text-[var(--apple-text-tertiary)]">Noch keine Dateien : z.B. PDF-Stellenbeschrieb.</p>
        ) : (
          <div className="space-y-3">
            {form.files.map((f, i) => (
              <div key={i} className="grid gap-3 sm:grid-cols-[1fr_2fr_auto_auto] items-end">
                <div>
                  <span className="mb-1.5 block text-[12px] font-medium text-[var(--apple-text-secondary)]">Bezeichnung</span>
                  <input
                    type="text"
                    value={f.label}
                    onChange={(e) => updateFile(i, { label: e.target.value })}
                    placeholder="Stellenbeschrieb.pdf"
                    className={adminInput}
                  />
                </div>
                <div>
                  <span className="mb-1.5 block text-[12px] font-medium text-[var(--apple-text-secondary)]">URL / Pfad</span>
                  <input
                    type="text"
                    value={f.url}
                    onChange={(e) => updateFile(i, { url: e.target.value })}
                    placeholder="https://… oder Upload nutzen"
                    className={adminInput}
                  />
                </div>
                <div className="mb-0.5">
                  <AdminFileUpload
                    path={`cms/vacancies/${vacancyId}`}
                    label="↑"
                    onUploadSuccess={(url) => updateFile(i, { url })}
                    className="!w-10"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="mb-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-200/80 text-red-500 transition hover:bg-red-50"
                  aria-label="Datei entfernen"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Apply text */}
      <div className={adminPanelInset}>
        <p className={`mb-4 ${adminSectionLabel}`}>Bewerbungshinweis</p>
        <textarea
          rows={3}
          value={form.apply}
          onChange={(e) => set("apply", e.target.value)}
          placeholder="Interesse geweckt? Sende uns Deine Unterlagen an contact@abexis.ch : oder nimm unverbindlich Kontakt auf."
          className={`${adminInput} resize-y`}
        />
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-black/[0.06] pt-6">
        <button type="button" disabled={saving} onClick={() => void handleSave()} className={adminBtnSecondary}>
          {saving ? "Wird gespeichert…" : "Entwurf speichern"}
        </button>
        {!isPublished ? (
          <button type="button" disabled={saving} onClick={() => void handleSave("published")} className={adminBtnPrimary}>
            Veröffentlichen
          </button>
        ) : (
          <button type="button" disabled={saving} onClick={() => void handleSave("draft")} className={adminBtnSecondary}>
            Zurückziehen
          </button>
        )}
      </div>
    </div>
  );
}
