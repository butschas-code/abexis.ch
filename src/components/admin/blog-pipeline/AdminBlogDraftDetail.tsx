"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CMS_PATHS } from "@/admin/paths";
import { useCmsAuth } from "@/cms/auth/cms-auth-context";
import { apiGetBlogDraftForAdmin } from "@/cms/services/blog-automation-cms-api-client";
import type { BlogDraftDetail } from "@/cms/services/blog-pipeline-types";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageContainer, AdminPageHeader, AdminPageSection } from "@/components/admin/AdminPageContainer";
import { adminPanelInset } from "@/components/admin/admin-ui";

type Props = { draftId: string };

export function AdminBlogDraftDetail({ draftId }: Props) {
  const { user, ready } = useCmsAuth();
  const [row, setRow] = useState<BlogDraftDetail | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !user) return;
    let cancelled = false;
    void (async () => {
      try {
        const token = await user.getIdToken();
        const r = await apiGetBlogDraftForAdmin(token, draftId);
        if (!cancelled) setRow(r);
      } catch {
        if (!cancelled) setError("Entwurf konnte nicht geladen werden.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [draftId, ready, user]);

  if (!ready || !user) {
    return (
      <AdminPageContainer>
        <AdminLoading message="Entwurf wird geladen…" />
      </AdminPageContainer>
    );
  }

  if (error) {
    return (
      <AdminPageContainer>
        <AdminPageHeader title="Entwurf" description={error} />
      </AdminPageContainer>
    );
  }

  if (row === undefined) {
    return (
      <AdminPageContainer>
        <AdminLoading message="Entwurf wird geladen…" />
      </AdminPageContainer>
    );
  }

  if (row === null) {
    return (
      <AdminPageContainer>
        <AdminPageHeader title="Entwurf" description="Dieser Entwurf wurde nicht gefunden." />
        <Link href={CMS_PATHS.adminBlogPipelineDrafts} className="text-sm font-medium text-[var(--brand-900)] underline-offset-4 hover:underline">
          Zurück zur Liste
        </Link>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title={row.title}
        description="KI-generierter Entwurf — bitte inhaltlich prüfen, fakten und Ton gegen den Leitfaden validieren, erst danach als normalen Beitrag übernehmen."
      />
      <p className="-mt-4 mb-8 text-sm">
        <Link href={CMS_PATHS.adminBlogPipelineDrafts} className="font-medium text-[var(--brand-900)] underline-offset-4 hover:underline">
          ← Alle Entwürfe
        </Link>
        {" · "}
        <Link href={CMS_PATHS.adminBlogPipelineSocial} className="font-medium text-[var(--brand-900)] underline-offset-4 hover:underline">
          Social-Entwürfe
        </Link>
      </p>

      <AdminPageSection>
        <div className="grid gap-6 lg:grid-cols-2">
          <Field label="Slug" value={row.slug} mono />
          <Field label="Status" value={row.status} />
          <Field label="Meta-Titel" value={row.metaTitle} />
          <Field label="Meta-Beschreibung" value={row.metaDescription} />
        </div>
        <div className="mt-6">
          <Field label="Teaser / Excerpt" value={row.excerpt} />
        </div>
      </AdminPageSection>

      <AdminPageSection>
        <h2 className="font-serif text-lg font-medium text-[var(--apple-text)]">Recherche</h2>
        <div className={`rounded-xl ${adminPanelInset} space-y-4 text-sm leading-relaxed text-[var(--apple-text)]`}>
          <p className="whitespace-pre-wrap">{row.researchSummary || "—"}</p>
          {row.sources.length ? (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--apple-text-tertiary)]">
                Quellen
              </p>
              <ul className="list-inside list-disc space-y-1 text-[var(--apple-text-secondary)]">
                {row.sources.map((s, i) => (
                  <li key={`${s.url}-${i}`}>
                    <span className="text-[var(--apple-text)]">{s.title || s.url}</span>
                    {s.url ? (
                      <>
                        {" "}
                        <a href={s.url} target="_blank" rel="noreferrer" className="break-all text-[var(--brand-900)] underline-offset-2 hover:underline">
                          {s.url}
                        </a>
                      </>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-[var(--apple-text-secondary)]">Keine Quellen angegeben.</p>
          )}
          <p className="text-xs text-[var(--apple-text-tertiary)]">
            Response-ID: {row.openaiResponseId ?? "—"}
            {row.pipelineModel ? ` · Modell: ${row.pipelineModel}` : null}
          </p>
        </div>
      </AdminPageSection>

      <AdminPageSection>
        <h2 className="font-serif text-lg font-medium text-[var(--apple-text)]">Artikel (HTML)</h2>
        <textarea
          readOnly
          className="h-[min(55vh,560px)] w-full resize-y rounded-xl border border-black/[0.1] bg-white p-4 font-mono text-xs leading-relaxed text-[var(--apple-text)] shadow-inner"
          value={row.articleHtml}
        />
      </AdminPageSection>
    </AdminPageContainer>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-text-tertiary)]">{label}</p>
      <p className={`mt-1 text-sm text-[var(--apple-text)] ${mono ? "font-mono text-xs" : ""}`}>{value || "—"}</p>
    </div>
  );
}
