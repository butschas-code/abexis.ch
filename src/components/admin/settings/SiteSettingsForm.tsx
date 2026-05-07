"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CMS_PATHS } from "@/admin/paths";
import { getSiteSettingsForAdmin, saveSiteSettings } from "@/cms/services/settings-admin-client";
import type { SiteSettingsReplaceInput } from "@/cms/types/dto";
import type {
  SiteContactDetails,
  SiteFooterColumn,
  SiteFooterLegalLink,
  SiteSeoBlock,
  SiteSocialLink,
  SiteSwitchBarLink,
} from "@/cms/types/settings";
import {
  emptyContact,
  emptySeoBlock,
  mergeSiteSettingsForForm,
} from "@/lib/cms/site-settings-defaults";
import { adminBtnPrimary, adminBtnSecondary, adminInput, adminPanel, adminSectionLabel } from "@/components/admin/admin-ui";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageContainer, AdminPageHeader, AdminPageSection } from "@/components/admin/AdminPageContainer";

function formatTs(iso: string | null) {
  if (!iso) return ",";
  try {
    return new Intl.DateTimeFormat("de-CH", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return ",";
  }
}

export function SiteSettingsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hadExistingDoc, setHadExistingDoc] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [form, setForm] = useState<SiteSettingsReplaceInput | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const row = await getSiteSettingsForAdmin();
      setHadExistingDoc(row != null);
      setUpdatedAt(row?.updatedAt ?? null);
      setForm(mergeSiteSettingsForForm(row?.settings ?? null));
    } catch {
      setError("Einstellungen konnten nicht geladen werden.");
      setForm(mergeSiteSettingsForForm(null));
      setHadExistingDoc(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  const patchContact = useCallback((patch: Partial<SiteContactDetails>) => {
    setForm((s) => {
      if (!s) return s;
      const prev = { ...emptyContact(), ...s.contactBySite?.abexis };
      return {
        ...s,
        contactBySite: {
          ...s.contactBySite,
          abexis: { ...prev, ...patch },
        },
      };
    });
  }, []);

  const patchSeo = useCallback((patch: Partial<SiteSeoBlock>) => {
    setForm((s) => {
      if (!s) return s;
      const prev = { ...emptySeoBlock(), ...s.seoBySite?.abexis };
      return {
        ...s,
        seoBySite: {
          ...s.seoBySite,
          abexis: { ...prev, ...patch },
        },
      };
    });
  }, []);

  const patchFooter = useCallback((patch: Partial<SiteSettingsReplaceInput["footer"]>) => {
    setForm((s) => (s ? { ...s, footer: { ...s.footer, ...patch } } : s));
  }, []);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form) return;
      setSaving(true);
      setError(null);
      try {
        await saveSiteSettings(form, { hadExistingDoc });
        await load();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen.");
      } finally {
        setSaving(false);
      }
    },
    [form, hadExistingDoc, load],
  );

  const contact = useMemo(() => {
    if (!form) return null;
    return form.contactBySite?.abexis ?? null;
  }, [form]);

  const seo = useMemo(() => {
    if (!form) return null;
    return form.seoBySite?.abexis ?? null;
  }, [form]);

  if (loading || !form) {
    return (
      <AdminPageContainer>
        <AdminLoading message="Einstellungen werden geladen…" />
      </AdminPageContainer>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <AdminPageContainer>
        <AdminPageHeader
          title="Website-Einstellungen"
          description="Kontakt, Footer, SEO und die obere Link-Leiste für abexis.ch. Änderungen wirken auf der Live-Website, sobald Sie speichern."
          actions={
            <div className="flex max-w-full flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
              <p className="text-center text-[12px] text-[var(--apple-text-tertiary)] sm:text-right">
                Zuletzt: {formatTs(updatedAt)}
                {!hadExistingDoc ? " · noch nicht in der Datenbank" : ""}
              </p>
              <div className="flex flex-wrap justify-end gap-2">
                <Link href={CMS_PATHS.adminHome} className={`${adminBtnSecondary} !min-h-[40px] !px-4 text-[13px]`}>
                  Übersicht
                </Link>
                <button type="submit" disabled={saving} className={`${adminBtnPrimary} !min-h-[40px] text-[13px]`}>
                  {saving ? "Wird gespeichert…" : "Speichern"}
                </button>
              </div>
            </div>
          }
        />

        {error ? (
          <div className="rounded-[1rem] border border-red-200/95 bg-red-50 px-4 py-3 text-[14px] leading-snug text-red-900">
            {error}
          </div>
        ) : null}

        <AdminPageSection>
          <h2 className={adminSectionLabel}>Kontakt & SEO</h2>
          <p className="mb-4 max-w-prose text-[15px] leading-relaxed text-[var(--apple-text-secondary)]">
            Alle Felder gelten für die Website abexis.ch.
          </p>

          <div className={`grid gap-8 md:grid-cols-2 ${adminPanel} p-6 sm:p-7`}>
            <div className="space-y-5">
              <h3 className="text-[15px] font-semibold text-[var(--apple-text)]">Kontakt & Firma</h3>
              <label className="block space-y-2">
                <span className="text-[14px] font-medium text-[var(--apple-text)]">Firmenname</span>
                <input
                  className={adminInput}
                  value={contact?.businessName ?? ""}
                  onChange={(e) => patchContact( { businessName: e.target.value || null })}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-[var(--apple-text)]">Überschrift / Abschnittstitel</span>
                <input
                  className={adminInput}
                  value={contact?.headline ?? ""}
                  onChange={(e) => patchContact( { headline: e.target.value || null })}
                  placeholder="z. B. Kontakt"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-[var(--apple-text)]">E-Mail</span>
                <input
                  type="email"
                  className={adminInput}
                  value={contact?.email ?? ""}
                  onChange={(e) => patchContact( { email: e.target.value || null })}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-[var(--apple-text)]">Telefon</span>
                <input
                  className={adminInput}
                  value={contact?.phone ?? ""}
                  onChange={(e) => patchContact( { phone: e.target.value || null })}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-[var(--apple-text)]">Adresse</span>
                <span className="block text-xs text-[var(--apple-text-tertiary)]">Eine Zeile pro Zeile.</span>
                <textarea
                  rows={4}
                  className={`${adminInput} resize-y`}
                  value={(contact?.addressLines ?? []).join("\n")}
                  onChange={(e) =>
                    patchContact( {
                      addressLines: e.target.value
                        .split("\n")
                        .map((l) => l.trim())
                        .filter((l) => l.length > 0),
                    })
                  }
                />
              </label>
            </div>

            <div className="space-y-5">
              <h3 className="text-[15px] font-semibold text-[var(--apple-text)]">SEO-Standards</h3>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-[var(--apple-text)]">Standard-Titel</span>
                <input
                  className={adminInput}
                  value={seo?.defaultTitle ?? ""}
                  onChange={(e) => patchSeo( { defaultTitle: e.target.value || null })}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-[var(--apple-text)]">Meta-Beschreibung</span>
                <textarea
                  rows={4}
                  className={`${adminInput} resize-y`}
                  value={seo?.defaultMetaDescription ?? ""}
                  onChange={(e) => patchSeo( { defaultMetaDescription: e.target.value || null })}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-[var(--apple-text)]">Titel-Suffix</span>
                <input
                  className={adminInput}
                  value={seo?.titleSuffix ?? ""}
                  onChange={(e) => patchSeo( { titleSuffix: e.target.value || null })}
                  placeholder="z. B.  | Abexis"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium text-[var(--apple-text)]">Open Graph-Typ</span>
                <select
                  className={adminInput}
                  value={seo?.ogType ?? "website"}
                  onChange={(e) =>
                    patchSeo( { ogType: e.target.value === "article" ? "article" : "website" })
                  }
                >
                  <option value="website">website</option>
                  <option value="article">article</option>
                </select>
              </label>
            </div>
          </div>
        </AdminPageSection>

        <AdminPageSection>
          <h2 className={adminSectionLabel}>Footer (alle Sites)</h2>
          <div className={`space-y-5 ${adminPanel} p-6 sm:p-7`}>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-[var(--apple-text)]">Copyright (HTML erlaubt)</span>
              <textarea
                rows={2}
                className={`${adminInput} resize-y font-mono text-xs`}
                value={form.footer.copyrightHtml ?? ""}
                onChange={(e) => patchFooter({ copyrightHtml: e.target.value || null })}
              />
            </label>

            <div className="space-y-2">
              <span className="text-sm font-medium text-[var(--apple-text)]">Rechtliche Links</span>
              {(form.footer.legalLinks ?? []).map((row, i) => (
                <FooterLegalRow
                  key={`legal-${i}`}
                  row={row}
                  onChange={(next) => {
                    const legalLinks = [...(form.footer.legalLinks ?? [])];
                    legalLinks[i] = next;
                    patchFooter({ legalLinks });
                  }}
                  onRemove={() => {
                    const legalLinks = [...(form.footer.legalLinks ?? [])];
                    legalLinks.splice(i, 1);
                    patchFooter({ legalLinks });
                  }}
                />
              ))}
              <button
                type="button"
                className="text-sm font-medium text-[var(--brand-900)] hover:underline"
                onClick={() =>
                  patchFooter({
                    legalLinks: [...(form.footer.legalLinks ?? []), { label: "Neuer Link", href: "/" }],
                  })
                }
              >
                + Link hinzufügen
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium text-[var(--apple-text)]">Zusatzspalten (optional)</span>
              {(form.footer.columns ?? []).map((col, i) => (
                <FooterColumnRow
                  key={`col-${i}`}
                  col={col}
                  onChange={(next) => {
                    const columns = [...(form.footer.columns ?? [])];
                    columns[i] = next;
                    patchFooter({ columns });
                  }}
                  onRemove={() => {
                    const columns = [...(form.footer.columns ?? [])];
                    columns.splice(i, 1);
                    patchFooter({ columns });
                  }}
                />
              ))}
              <button
                type="button"
                className="text-sm font-medium text-[var(--brand-900)] hover:underline"
                onClick={() =>
                  patchFooter({
                    columns: [...(form.footer.columns ?? []), { title: "Spalte", bodyHtml: null }],
                  })
                }
              >
                + Spalte hinzufügen
              </button>
            </div>
          </div>
        </AdminPageSection>

        <AdminPageSection>
          <h2 className={adminSectionLabel}>Kopfzeilen-Links</h2>
          <p className="max-w-prose text-[15px] leading-relaxed text-[var(--apple-text-secondary)]">
            Zusätzliche Links in der oberen Leiste : Text, Zieladresse und Reihenfolge (z. B. zu Ankern oder internen Seiten).
          </p>
          <div className="overflow-hidden rounded-[1.15rem] border border-black/[0.06] bg-[var(--apple-bg-elevated)] shadow-[0_1px_0_rgba(0,0,0,0.04)]">
            <table className="w-full text-left text-[15px]">
              <thead className="border-b border-black/[0.07] bg-[color-mix(in_srgb,var(--apple-bg-subtle)_65%,white)] text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-text-tertiary)]">
                <tr>
                  <th className="px-3 py-2">Label</th>
                  <th className="px-3 py-2">URL</th>
                  <th className="px-3 py-2">Sort</th>
                  <th className="w-[1%] px-3 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {(form.switchBarLinks ?? []).map((row, i) => (
                  <SwitchBarRow
                    key={`sb-${i}`}
                    row={row}
                    onChange={(next) => {
                      const switchBarLinks = [...(form.switchBarLinks ?? [])];
                      switchBarLinks[i] = next;
                      setForm((s) => (s ? { ...s, switchBarLinks } : s));
                    }}
                    onRemove={() => {
                      const switchBarLinks = [...(form.switchBarLinks ?? [])];
                      switchBarLinks.splice(i, 1);
                      setForm((s) => (s ? { ...s, switchBarLinks } : s));
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            className="text-sm font-medium text-[var(--brand-900)] hover:underline"
            onClick={() =>
              setForm((s) =>
                s
                  ? {
                      ...s,
                      switchBarLinks: [
                        ...(s.switchBarLinks ?? []),
                        { label: "Neuer Link", href: "/", site: "abexis", order: (s.switchBarLinks?.length ?? 0) },
                      ],
                    }
                  : s,
              )
            }
          >
            + Eintrag hinzufügen
          </button>
        </AdminPageSection>

        <AdminPageSection>
          <h2 className={adminSectionLabel}>Social Media</h2>
          <div className="overflow-hidden rounded-[1.15rem] border border-black/[0.06] bg-[var(--apple-bg-elevated)] shadow-[0_1px_0_rgba(0,0,0,0.04)]">
            <table className="w-full text-left text-[15px]">
              <thead className="border-b border-black/[0.07] bg-[color-mix(in_srgb,var(--apple-bg-subtle)_65%,white)] text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-text-tertiary)]">
                <tr>
                  <th className="px-3 py-2">Label</th>
                  <th className="px-3 py-2">URL</th>
                  <th className="px-3 py-2">Reihenfolge</th>
                  <th className="w-[1%] px-3 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {(form.socialLinks ?? []).map((row, i) => (
                  <SocialRow
                    key={`soc-${i}`}
                    row={row}
                    onChange={(next) => {
                      const socialLinks = [...(form.socialLinks ?? [])];
                      socialLinks[i] = next;
                      setForm((s) => (s ? { ...s, socialLinks } : s));
                    }}
                    onRemove={() => {
                      const socialLinks = [...(form.socialLinks ?? [])];
                      socialLinks.splice(i, 1);
                      setForm((s) => (s ? { ...s, socialLinks } : s));
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            className="text-sm font-medium text-[var(--brand-900)] hover:underline"
            onClick={() =>
              setForm((s) =>
                s
                  ? {
                      ...s,
                      socialLinks: [
                        ...(s.socialLinks ?? []),
                        { label: "LinkedIn", href: "https://", order: s.socialLinks?.length ?? 0 },
                      ],
                    }
                  : s,
              )
            }
          >
            + Social-Link hinzufügen
          </button>
        </AdminPageSection>

        <div className="border-t border-black/[0.05] pt-9 pb-4">
          <button type="submit" disabled={saving} className={adminBtnPrimary}>
            {saving ? "Wird gespeichert…" : "Alle Änderungen speichern"}
          </button>
        </div>
      </AdminPageContainer>
    </form>
  );
}

function FooterLegalRow({
  row,
  onChange,
  onRemove,
}: {
  row: SiteFooterLegalLink;
  onChange: (v: SiteFooterLegalLink) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-wrap items-end gap-2">
      <label className="min-w-[120px] flex-1 space-y-1">
        <span className="text-xs text-[var(--apple-text-tertiary)]">Label</span>
        <input className={adminInput} value={row.label} onChange={(e) => onChange({ ...row, label: e.target.value })} />
      </label>
      <label className="min-w-[160px] flex-[2] space-y-1">
        <span className="text-xs text-[var(--apple-text-tertiary)]">URL</span>
        <input className={adminInput} value={row.href} onChange={(e) => onChange({ ...row, href: e.target.value })} />
      </label>
      <button type="button" className="mb-0.5 text-xs font-medium text-red-700 hover:underline" onClick={onRemove}>
        Entfernen
      </button>
    </div>
  );
}

function FooterColumnRow({
  col,
  onChange,
  onRemove,
}: {
  col: SiteFooterColumn;
  onChange: (v: SiteFooterColumn) => void;
  onRemove: () => void;
}) {
  return (
    <div className="space-y-2 rounded-xl border border-black/[0.06] bg-[var(--apple-bg-subtle)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="block min-w-[200px] flex-1 space-y-1">
          <span className="text-xs text-[var(--apple-text-tertiary)]">Titel</span>
          <input
            className={adminInput}
            value={col.title ?? ""}
            onChange={(e) => onChange({ ...col, title: e.target.value || null })}
          />
        </label>
        <button type="button" className="text-xs font-medium text-red-700 hover:underline" onClick={onRemove}>
          Spalte entfernen
        </button>
      </div>
      <label className="block space-y-1">
        <span className="text-xs text-[var(--apple-text-tertiary)]">Inhalt (HTML)</span>
        <textarea
          rows={3}
          className={`${adminInput} resize-y font-mono text-xs`}
          value={col.bodyHtml ?? ""}
          onChange={(e) => onChange({ ...col, bodyHtml: e.target.value || null })}
        />
      </label>
    </div>
  );
}

function SwitchBarRow({
  row,
  onChange,
  onRemove,
}: {
  row: SiteSwitchBarLink;
  onChange: (v: SiteSwitchBarLink) => void;
  onRemove: () => void;
}) {
  return (
    <tr>
      <td className="px-3 py-2">
        <input className={adminInput} value={row.label} onChange={(e) => onChange({ ...row, label: e.target.value, site: "abexis" })} />
      </td>
      <td className="px-3 py-2">
        <input className={adminInput} value={row.href} onChange={(e) => onChange({ ...row, href: e.target.value, site: "abexis" })} />
      </td>
      <td className="px-3 py-2">
        <input
          type="number"
          className={adminInput}
          value={row.order}
          onChange={(e) => onChange({ ...row, order: Number(e.target.value) || 0, site: "abexis" })}
        />
      </td>
      <td className="px-3 py-2">
        <button type="button" className="text-xs font-medium text-red-700 hover:underline" onClick={onRemove}>
          ×
        </button>
      </td>
    </tr>
  );
}

function SocialRow({
  row,
  onChange,
  onRemove,
}: {
  row: SiteSocialLink;
  onChange: (v: SiteSocialLink) => void;
  onRemove: () => void;
}) {
  return (
    <tr>
      <td className="px-3 py-2">
        <input className={adminInput} value={row.label} onChange={(e) => onChange({ ...row, label: e.target.value })} />
      </td>
      <td className="px-3 py-2">
        <input className={adminInput} value={row.href} onChange={(e) => onChange({ ...row, href: e.target.value })} />
      </td>
      <td className="px-3 py-2">
        <input
          type="number"
          className={adminInput}
          value={row.order}
          onChange={(e) => onChange({ ...row, order: Number(e.target.value) || 0 })}
        />
      </td>
      <td className="px-3 py-2">
        <button type="button" className="text-xs font-medium text-red-700 hover:underline" onClick={onRemove}>
          ×
        </button>
      </td>
    </tr>
  );
}
