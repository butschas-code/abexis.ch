"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { CMS_PATHS } from "@/admin/paths";
import { useCmsAuth } from "@/cms/auth/cms-auth-context";
import {
  DEFAULT_BLOG_AUTOMATION_FORM,
  type BlogAutomationFormState,
  type QueuedBlogTopicRow,
} from "@/cms/services/blog-automation-admin-client";
import {
  apiCreateBlogTopic,
  apiListQueuedBlogTopics,
  apiLoadBlogAutomationSettings,
  apiRunBlogAutomationNow,
  apiSaveBlogAutomationSettings,
} from "@/cms/services/blog-automation-cms-api-client";
import {
  loadBlogAutomationDashboardSnapshot,
  type BlogAutomationDashboardSnapshot,
} from "@/cms/services/blog-automation-dashboard-client";
import { BlogAutomationDashboard } from "@/components/admin/blog-automation/BlogAutomationDashboard";
import {
  BlogAutomationJourneyStrip,
  BlogAutomationNoticeCard,
  BlogAutomationStepCard,
} from "@/components/admin/blog-automation/blog-automation-shell";
import {
  adminBody,
  adminBtnGhost,
  adminBtnPrimary,
  adminBtnSecondary,
  adminInput,
  adminPanel,
  adminSectionLabel,
  adminTableWrap,
  adminFeedbackSuccess,
  adminFeedbackError,
  adminFeedbackInfo,
} from "@/components/admin/admin-ui";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageContainer, AdminPageHeader, AdminPageSection } from "@/components/admin/AdminPageContainer";

const WEEKDAY_OPTIONS = [
  { key: "monday", label: "Montag" },
  { key: "tuesday", label: "Dienstag" },
  { key: "wednesday", label: "Mittwoch" },
  { key: "thursday", label: "Donnerstag" },
  { key: "friday", label: "Freitag" },
] as const;

const TONE_OPTIONS = [
  { value: "Ruhig und exekutiv", label: "Ruhig und exekutiv" },
  { value: "Strategisch und analytisch", label: "Strategisch und analytisch" },
  { value: "Warm und beratend", label: "Warm und beratend" },
  { value: "Direkt und pragmatisch", label: "Direkt und pragmatisch" },
] as const;

const LANGUAGE_OPTIONS = [
  { value: "de-CH", label: "Deutsch (Schweiz)" },
  { value: "de", label: "Deutsch" },
  { value: "en", label: "English" },
  { value: "fr-CH", label: "Français (Suisse)" },
] as const;

const TIMEZONE_OPTIONS = ["Europe/Zurich", "Europe/Berlin", "Europe/Paris", "Europe/Vienna", "UTC"] as const;

function isKnownTimezone(tz: string): tz is (typeof TIMEZONE_OPTIONS)[number] {
  return (TIMEZONE_OPTIONS as readonly string[]).includes(tz);
}

const ARTICLE_LENGTH_OPTIONS = [
  { value: "short" as const, label: "Kurz" },
  { value: "medium" as const, label: "Mittel" },
  { value: "long" as const, label: "Lang" },
];

function ChoiceCard(props: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
  description: string;
}) {
  const { checked, onChange, title, description } = props;
  return (
    <label
      className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition sm:p-6 ${
        checked
          ? "border-[var(--brand-900)]/20 bg-[color-mix(in_srgb,var(--brand-900)_5%,white)] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]"
          : "border-black/[0.06] bg-white/95 hover:border-black/[0.1]"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-black/18 text-[var(--brand-900)]"
      />
      <span className="min-w-0">
        <span className="block text-[16px] font-medium text-[var(--apple-text)]">{title}</span>
        <span className={`mt-2 block ${adminBody}`}>{description}</span>
      </span>
    </label>
  );
}

export function BlogAutomationClient() {
  const { user, ready: authReady } = useCmsAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [docExists, setDocExists] = useState(false);
  const [form, setForm] = useState<BlogAutomationFormState | null>(null);
  const [queuedTopics, setQueuedTopics] = useState<QueuedBlogTopicRow[]>([]);
  const [dashboard, setDashboard] = useState<BlogAutomationDashboardSnapshot | null>(null);
  const [dashboardBusy, setDashboardBusy] = useState(false);
  const [runNowBusy, setRunNowBusy] = useState(false);

  const [newTopic, setNewTopic] = useState({
    title: "",
    keyword: "",
    angle: "",
    notes: "",
    priority: 50,
  });
  const [addingTopic, setAddingTopic] = useState(false);

  const getIdToken = useCallback(async () => {
    if (!user) throw new Error("Bitte melden Sie sich an.");
    return user.getIdToken();
  }, [user]);

  const refreshTopics = useCallback(async () => {
    setTopicsLoading(true);
    try {
      const token = await getIdToken();
      setQueuedTopics(await apiListQueuedBlogTopics(token));
    } catch (err) {
      setQueuedTopics([]);
      setError(err instanceof Error ? err.message : "Die Themenliste konnte nicht geladen werden.");
    } finally {
      setTopicsLoading(false);
    }
  }, [getIdToken]);

  const refreshDashboard = useCallback(
    async (f: BlogAutomationFormState) => {
      setDashboardBusy(true);
      try {
        const token = await getIdToken();
        setDashboard(await loadBlogAutomationDashboardSnapshot(token, f));
      } catch {
        setDashboard(null);
      } finally {
        setDashboardBusy(false);
      }
    },
    [getIdToken],
  );

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getIdToken();
      const { form: f, docExists: exists } = await apiLoadBlogAutomationSettings(token);
      setForm(f);
      setDocExists(exists);
      await Promise.all([refreshTopics(), refreshDashboard(f)]);
    } catch {
      setError("Die Einstellungen konnten nicht geladen werden. Bitte versuchen Sie es später erneut.");
      const fallback = { ...DEFAULT_BLOG_AUTOMATION_FORM };
      setForm(fallback);
      setDocExists(false);
      try {
        await Promise.all([refreshTopics(), refreshDashboard(fallback)]);
      } catch {
        /* ignore */
      }
    } finally {
      setLoading(false);
    }
  }, [getIdToken, refreshTopics, refreshDashboard]);

  useEffect(() => {
    if (!authReady || !user) return;
    queueMicrotask(() => void loadAll());
  }, [authReady, user, loadAll]);

  const patch = useCallback((p: Partial<BlogAutomationFormState>) => {
    setForm((s) => (s ? { ...s, ...p } : s));
  }, []);

  const toggleWeekday = useCallback((key: string, on: boolean) => {
    setForm((s) => {
      if (!s) return s;
      const next = new Set(s.preferredDays);
      if (on) next.add(key);
      else next.delete(key);
      return { ...s, preferredDays: [...next] };
    });
  }, []);

  const linkedinOn = useMemo(() => form?.socialPlatforms.includes("linkedin") ?? false, [form?.socialPlatforms]);
  const xOn = useMemo(() => form?.socialPlatforms.includes("x") ?? false, [form?.socialPlatforms]);

  const setPlatform = useCallback((platform: "linkedin" | "x", on: boolean) => {
    setForm((s) => {
      if (!s) return s;
      const next = new Set(s.socialPlatforms);
      if (on) next.add(platform);
      else next.delete(platform);
      return { ...s, socialPlatforms: [...next] };
    });
  }, []);

  const onSaveSettings = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form) return;
      setSaving(true);
      setError(null);
      setSuccess(null);
      try {
        const token = await getIdToken();
        const toSave: BlogAutomationFormState = {
          ...form,
          articlesPerWeek: Math.min(3, Math.max(1, Math.floor(form.articlesPerWeek) || 1)),
        };
        await apiSaveBlogAutomationSettings(token, toSave, docExists);
        setDocExists(true);
        setSuccess("Änderungen sind gesichert.");
        await loadAll();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen.");
      } finally {
        setSaving(false);
      }
    },
    [form, docExists, loadAll, getIdToken],
  );

  const onRunNow = useCallback(async () => {
    if (!form) return;
    setRunNowBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const token = await getIdToken();
      const toSave: BlogAutomationFormState = {
        ...form,
        enabled: true,
        articlesPerWeek: Math.min(3, Math.max(1, Math.floor(form.articlesPerWeek) || 1)),
      };
      await apiSaveBlogAutomationSettings(token, toSave, docExists);
      setForm(toSave);
      setDocExists(true);

      const result = await apiRunBlogAutomationNow(token);
      await Promise.all([refreshTopics(), refreshDashboard(toSave)]);

      if (result.action === "draft_created") {
        setSuccess("Ein neuer Entwurf wurde vorbereitet. Sie finden ihn unter «Entwürfe prüfen».");
        return;
      }
      if (result.action === "published") {
        setSuccess("Ein neuer Beitrag wurde vorbereitet und veröffentlicht.");
        return;
      }
      setSuccess(result.reason || "Der manuelle Lauf ist abgeschlossen.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sofortige Vorbereitung fehlgeschlagen.");
    } finally {
      setRunNowBusy(false);
    }
  }, [form, docExists, getIdToken, refreshTopics, refreshDashboard]);

  const onAddTopic = useCallback(async () => {
    setAddingTopic(true);
    setError(null);
    try {
      const token = await getIdToken();
      await apiCreateBlogTopic(token, {
        title: newTopic.title,
        targetKeyword: newTopic.keyword,
        angle: newTopic.angle,
        notes: newTopic.notes,
        priority: newTopic.priority,
        audienceFallback: form?.targetAudience ?? "",
      });
      setNewTopic({ title: "", keyword: "", angle: "", notes: "", priority: 50 });
      await refreshTopics();
      setSuccess("Thema wurde zur Liste hinzugefügt.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Thema konnte nicht hinzugefügt werden.");
    } finally {
      setAddingTopic(false);
    }
  }, [newTopic, form, refreshTopics, getIdToken]);

  if (!authReady) {
    return (
      <AdminPageContainer>
        <AdminLoading message="Wird geladen…" />
      </AdminPageContainer>
    );
  }

  if (!user) {
    return (
      <AdminPageContainer>
        <AdminPageHeader title="Blog · Automatisierung" description="Bitte melden Sie sich an." />
      </AdminPageContainer>
    );
  }

  if (loading || !form) {
    return (
      <AdminPageContainer>
        <AdminLoading message="Wird geladen…" />
      </AdminPageContainer>
    );
  }

  return (
    <form onSubmit={onSaveSettings}>
      <AdminPageContainer>
        <AdminPageHeader
          title="Blog · Automatisierung"
          description="Sie geben Rahmen und Rhythmus vor; Abexis bereitet Entwürfe vor. Auf der Website erscheint nur, was Sie ausdrücklich freigeben."
          actions={
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
              <Link href={CMS_PATHS.adminBlogAutomationDrafts} className={`${adminBtnSecondary} !min-h-[42px] text-center text-[14px]`}>
                Entwürfe prüfen
              </Link>
              <button type="button" disabled={runNowBusy || saving} onClick={() => void onRunNow()} className={`${adminBtnSecondary} !min-h-[42px] text-[14px]`}>
                {runNowBusy ? "Wird vorbereitet…" : "Jetzt Entwurf vorbereiten"}
              </button>
              <button type="submit" disabled={saving} className={`${adminBtnPrimary} !min-h-[42px] text-[14px]`}>
                {saving ? "Speichern…" : "Änderungen sichern"}
              </button>
            </div>
          }
        />

        {error ? <div className={adminFeedbackError}>{error}</div> : null}
        {success ? <div className={adminFeedbackSuccess}>{success}</div> : null}

        <AdminPageSection className="!space-y-4">
          <BlogAutomationJourneyStrip />
        </AdminPageSection>

        <AdminPageSection>
          <BlogAutomationStepCard
            step={1}
            title="Automatisierung"
            intro="Bestimmen Sie, ob Abexis neue Entwürfe nach Ihrem Zeitplan vorbereiten soll. Sie können dies jederzeit pausieren."
          >
            <ChoiceCard
              checked={form.enabled}
              onChange={(v) => patch({ enabled: v })}
              title="Vorbereitung von Entwürfen erlauben"
              description="Wenn eingeschaltet, legt Abexis nach Ihren Vorgaben neue Textentwürfe an — zur Prüfung in Ihrer Redaktion, nicht automatisch auf der Website."
            />
            {!form.enabled ? (
              <div className={`rounded-2xl border border-black/[0.06] bg-[color-mix(in_srgb,var(--apple-bg-subtle)_55%,white)] px-5 py-4 ${adminBody}`}>
                Nach dem Einschalten und Speichern werden Entwürfe an den von Ihnen gewählten Tagen erzeugt — sobald Themen oder passende Vorschläge vorliegen.
              </div>
            ) : (
              <p className={`${adminBody} text-[14px]`}>
                Gut so: Unten legen Sie Rhythmus und Themen fest, danach speichern Sie einmal. Die Übersicht weiter unten zeigt den aktuellen Stand.
              </p>
            )}
          </BlogAutomationStepCard>
        </AdminPageSection>

        <AdminPageSection>
          <BlogAutomationStepCard
            step={2}
            title="Wie viele Entwürfe pro Woche?"
            intro="Maximal eine Vorbereitung pro Kalendertag — bis zur hier gewählten Obergrenze pro Woche."
          >
            <label className="block max-w-md space-y-2">
              <span className="text-[14px] font-medium text-[var(--apple-text)]">Entwürfe pro Woche höchstens</span>
              <select className={adminInput} value={form.articlesPerWeek} onChange={(e) => patch({ articlesPerWeek: Number(e.target.value) })}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </label>
          </BlogAutomationStepCard>
        </AdminPageSection>

        <AdminPageSection>
          <BlogAutomationStepCard
            step={3}
            title="Wann soll gearbeitet werden?"
            intro="Wählen Sie Zeitzone, Uhrzeit ab wann ein Entwurf an einem Schreibtag in Frage kommt, und die Wochentage."
          >
            <div className="grid gap-8 md:grid-cols-2">
              <label className="block space-y-2 md:col-span-2">
                <span className="text-[14px] font-medium text-[var(--apple-text)]">Region / Zeitzone</span>
                <select className={adminInput} value={form.timezone} onChange={(e) => patch({ timezone: e.target.value })}>
                  {!isKnownTimezone(form.timezone) ? <option value={form.timezone}>{form.timezone}</option> : null}
                  {TIMEZONE_OPTIONS.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz === "UTC" ? "Weltzeit (UTC)" : tz}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-[14px] font-medium text-[var(--apple-text)]">Ab dieser Uhrzeit</span>
                <input type="time" className={adminInput} value={form.preferredTime} onChange={(e) => patch({ preferredTime: e.target.value })} />
                <span className={`${adminBody} text-[13px]`}>Am gewählten Tag erst nach dieser Zeit (lokal).</span>
              </label>
              <div className="rounded-2xl border border-[var(--brand-900)]/12 bg-[color-mix(in_srgb,var(--brand-900)_6%,white)] px-5 py-4 text-[14px] leading-relaxed text-[var(--apple-text-secondary)] md:col-span-2">
                Der Zeitplan steuert die automatische Tagesprüfung. Für einen sofortigen Entwurf nutzen Sie oben «Jetzt Entwurf vorbereiten».
              </div>
              <div className="space-y-3 md:col-span-2">
                <span className="block text-[14px] font-medium text-[var(--apple-text)]">Schreibtage</span>
                <div className="flex flex-wrap gap-2">
                  {WEEKDAY_OPTIONS.map((d) => (
                    <label
                      key={d.key}
                      className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2.5 text-[14px] transition ${
                        form.preferredDays.includes(d.key)
                          ? "border-[var(--brand-900)]/25 bg-[color-mix(in_srgb,var(--brand-900)_7%,white)] text-[var(--apple-text)]"
                          : "border-black/[0.08] bg-white text-[var(--apple-text)] hover:border-black/14"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.preferredDays.includes(d.key)}
                        onChange={(e) => toggleWeekday(d.key, e.target.checked)}
                        className="h-4 w-4 rounded border-black/18 text-[var(--brand-900)]"
                      />
                      {d.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </BlogAutomationStepCard>
        </AdminPageSection>

        <AdminPageSection>
          <BlogAutomationStepCard
            step={4}
            title="Themen und Ausrichtung"
            intro="Bestimmen Sie, worüber geschrieben wird, und mit welcher Stimme — das gilt für die automatisch erstellten Entwürfe."
          >
            <div className="space-y-6 rounded-2xl border border-black/[0.05] bg-[color-mix(in_srgb,var(--apple-bg-subtle)_35%,white)] p-5 sm:p-6">
              <p className={`${adminSectionLabel}`}>Leitplanken für neue Entwürfe</p>
              <div className="grid gap-6 md:grid-cols-2">
                <label className="block space-y-2 md:col-span-2">
                  <span className="text-[14px] font-medium text-[var(--apple-text)]">Zielgruppe</span>
                  <textarea
                    className={`${adminInput} min-h-[88px] resize-y`}
                    value={form.targetAudience}
                    onChange={(e) => patch({ targetAudience: e.target.value })}
                    placeholder="z. B. Verwaltungsrätinnen und Geschäftsführung in Schweizer KMU"
                  />
                </label>
                <label className="block space-y-2">
                  <span className="text-[14px] font-medium text-[var(--apple-text)]">Tonalität</span>
                  <select className={adminInput} value={form.tone} onChange={(e) => patch({ tone: e.target.value })}>
                    {TONE_OPTIONS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-2">
                  <span className="text-[14px] font-medium text-[var(--apple-text)]">Umfang</span>
                  <select
                    className={adminInput}
                    value={form.articleLength}
                    onChange={(e) => patch({ articleLength: e.target.value as BlogAutomationFormState["articleLength"] })}
                  >
                    {ARTICLE_LENGTH_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-2 md:col-span-2">
                  <span className="text-[14px] font-medium text-[var(--apple-text)]">Sprache der Entwürfe</span>
                  <select className={adminInput} value={form.defaultLanguage} onChange={(e) => patch({ defaultLanguage: e.target.value })}>
                    {LANGUAGE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <fieldset className="space-y-3">
              <legend className="mb-1 text-[14px] font-medium text-[var(--apple-text)]">Woher kommen die Inhaltsideen?</legend>
              <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-black/[0.06] bg-white/95 p-5 transition hover:border-black/[0.1]">
                <input type="radio" name="topicMode" checked={form.topicMode === "topic_queue"} onChange={() => patch({ topicMode: "topic_queue" })} className="mt-1" />
                <span>
                  <span className="font-medium text-[var(--apple-text)]">Eigene Liste</span>
                  <span className={`mt-2 block ${adminBody}`}>Sie tragen Themen ein; sie werden der Reihe nach bearbeitet.</span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-black/[0.06] bg-white/95 p-5 transition hover:border-black/[0.1]">
                <input type="radio" name="topicMode" checked={form.topicMode === "ai_suggested"} onChange={() => patch({ topicMode: "ai_suggested" })} className="mt-1" />
                <span>
                  <span className="font-medium text-[var(--apple-text)]">Liste ergänzen durch Vorschläge</span>
                  <span className={`mt-2 block ${adminBody}`}>Steht nichts auf der Liste, schlägt das System ein zum Profil passendes Thema vor — sobald die Automatisierung läuft.</span>
                </span>
              </label>
            </fieldset>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-medium text-[var(--apple-text)]">Ihre Themenliste</h3>
                <button type="button" onClick={() => void refreshTopics()} className={`${adminBtnGhost} text-[13px]`} disabled={topicsLoading}>
                  {topicsLoading ? "Aktualisieren…" : "Liste aktualisieren"}
                </button>
              </div>
              {queuedTopics.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-black/[0.1] bg-[color-mix(in_srgb,var(--apple-bg-subtle)_50%,white)] px-6 py-12 text-center">
                  <p className="text-[16px] font-medium text-[var(--apple-text)]">Noch keine Themen eingetragen</p>
                  <p className={`mx-auto mt-3 max-w-lg ${adminBody}`}>
                    Nutzen Sie das Formular unten — oder die Option «Liste ergänzen durch Vorschläge», wenn Sie keine festen Themen pflegen möchten.
                  </p>
                </div>
              ) : (
                <div className={adminTableWrap}>
                  <table className="min-w-full border-collapse text-left text-[14px]">
                    <thead>
                      <tr className="border-b border-black/[0.07] text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--apple-text-tertiary)]">
                        <th className="py-3 pr-3">Reihenfolge</th>
                        <th className="py-3 pr-3">Titel</th>
                        <th className="py-3 pr-3">Begriff</th>
                        <th className="py-3 pr-3">Schwerpunkt</th>
                        <th className="py-3">Notiz</th>
                      </tr>
                    </thead>
                    <tbody>
                      {queuedTopics.map((t) => (
                        <tr key={t.id} className="border-b border-black/[0.04] last:border-0">
                          <td className="py-3 pr-3 align-top tabular-nums text-[var(--apple-text-secondary)]">{t.priority}</td>
                          <td className="py-3 pr-3 align-top font-medium text-[var(--apple-text)]">{t.title}</td>
                          <td className="py-3 pr-3 align-top text-[var(--apple-text-secondary)]">{t.targetKeyword}</td>
                          <td className="py-3 pr-3 align-top text-[var(--apple-text-secondary)]">{t.angle}</td>
                          <td className="py-3 align-top text-[var(--apple-text-secondary)]">{t.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-black/[0.06] bg-white/90 p-5 sm:p-6">
              <h3 className="mb-5 font-medium text-[var(--apple-text)]">Thema hinzufügen</h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block space-y-2 sm:col-span-2">
                  <span className="text-[13px] font-medium text-[var(--apple-text)]">Titel</span>
                  <input className={adminInput} value={newTopic.title} onChange={(e) => setNewTopic((n) => ({ ...n, title: e.target.value }))} />
                </label>
                <label className="block space-y-2">
                  <span className="text-[13px] font-medium text-[var(--apple-text)]">Suchbegriff (freiwillig)</span>
                  <input className={adminInput} value={newTopic.keyword} onChange={(e) => setNewTopic((n) => ({ ...n, keyword: e.target.value }))} />
                </label>
                <label className="block space-y-2">
                  <span className="text-[13px] font-medium text-[var(--apple-text)]">Reihenfolge (kleinere Zahl = früher)</span>
                  <input
                    type="number"
                    className={adminInput}
                    value={newTopic.priority}
                    onChange={(e) => setNewTopic((n) => ({ ...n, priority: Number(e.target.value) }))}
                    min={1}
                    max={999}
                  />
                </label>
                <label className="block space-y-2 sm:col-span-2">
                  <span className="text-[13px] font-medium text-[var(--apple-text)]">Schwerpunkt / Blickwinkel</span>
                  <textarea className={`${adminInput} min-h-[72px]`} value={newTopic.angle} onChange={(e) => setNewTopic((n) => ({ ...n, angle: e.target.value }))} />
                </label>
                <label className="block space-y-2 sm:col-span-2">
                  <span className="text-[13px] font-medium text-[var(--apple-text)]">Interne Notiz</span>
                  <textarea className={`${adminInput} min-h-[72px]`} value={newTopic.notes} onChange={(e) => setNewTopic((n) => ({ ...n, notes: e.target.value }))} />
                </label>
              </div>
              <button type="button" disabled={addingTopic} onClick={() => void onAddTopic()} className={`${adminBtnSecondary} mt-5 !min-h-[42px]`}>
                {addingTopic ? "Wird hinzugefügt…" : "Zur Liste hinzufügen"}
              </button>
              <p className={`mt-4 ${adminBody} text-[13px]`}>Rhythmus und Schalter sichern Sie mit «Änderungen sichern» oben oder im nächsten Schritt.</p>
            </div>
          </BlogAutomationStepCard>
        </AdminPageSection>

        <AdminPageSection>
          <BlogAutomationNoticeCard title="Änderungen sichern" variant="neutral">
            <p className={adminBody}>
              Erst nach dem Speichern gelten Rhythmus, Themen und Schalter für die nächsten Läufe. Sie können Einstellungen jederzeit anpassen.
            </p>
            <button type="submit" disabled={saving} className={`${adminBtnPrimary} !min-h-[46px] px-8 text-[15px]`}>
              {saving ? "Speichern…" : "Änderungen sichern"}
            </button>
          </BlogAutomationNoticeCard>
        </AdminPageSection>

        <AdminPageSection>
          <BlogAutomationNoticeCard title="Entwürfe lesen und freigeben" variant="accent">
            <p className={adminBody}>
              Sobald ein Entwurf erstellt wurde, finden Sie ihn unter «Entwürfe prüfen». Dort bearbeiten Sie Texte, geben sie frei oder veröffentlichen sie bewusst auf der Website — ohne die Finger zu lassen.
            </p>
            <div className="flex flex-wrap gap-3">
              <button type="button" disabled={runNowBusy || saving} onClick={() => void onRunNow()} className={`${adminBtnPrimary} !min-h-[46px] px-7 text-[15px]`}>
                {runNowBusy ? "Wird vorbereitet…" : "Jetzt Entwurf vorbereiten"}
              </button>
              <Link href={CMS_PATHS.adminBlogAutomationDrafts} className={`${adminBtnSecondary} inline-flex !min-h-[46px] items-center justify-center text-[15px]`}>
                Zu den Entwürfen
              </Link>
            </div>
          </BlogAutomationNoticeCard>
        </AdminPageSection>

        <AdminPageSection>
          <BlogAutomationDashboard
            snapshot={dashboard}
            displayTimezone={form.timezone?.trim() || "Europe/Zurich"}
            automationEnabled={form.enabled}
            articlesPerWeek={form.articlesPerWeek}
            draftsReviewHref={CMS_PATHS.adminBlogAutomationDrafts}
            busy={dashboardBusy}
            onRefresh={() => void refreshDashboard(form)}
          />
        </AdminPageSection>

        <AdminPageSection>
          <p className={`${adminSectionLabel} mb-4`}>Weitere Optionen</p>
          <div className="space-y-6">
            <div className={`${adminPanel} space-y-5 p-7 sm:p-8`}>
              <div>
                <h3 className="font-serif text-[1.2rem] font-medium text-[var(--apple-text)]">Kurztexte für soziale Netzwerke</h3>
                <p className={`mt-2 max-w-prose ${adminBody}`}>Optional: passende Kurzfassungen zum Kopieren — ohne automatische Veröffentlichung.</p>
              </div>
              <ChoiceCard
                checked={form.createSocialPosts}
                onChange={(v) => patch({ createSocialPosts: v })}
                title="Kurztexte mit erzeugen"
                description="Liegen Entwürfe vor, können ergänzend Textvorschläge für LinkedIn und X erstellt werden. Es wird nichts automatisch gepostet."
              />
              <div className="flex flex-wrap gap-6">
                <label className="flex cursor-pointer items-center gap-2 text-[14px] text-[var(--apple-text)]">
                  <input
                    type="checkbox"
                    checked={linkedinOn}
                    disabled={!form.createSocialPosts}
                    onChange={(e) => setPlatform("linkedin", e.target.checked)}
                    className="h-4 w-4 rounded border-black/18 text-[var(--brand-900)]"
                  />
                  LinkedIn
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-[14px] text-[var(--apple-text)]">
                  <input
                    type="checkbox"
                    checked={xOn}
                    disabled={!form.createSocialPosts}
                    onChange={(e) => setPlatform("x", e.target.checked)}
                    className="h-4 w-4 rounded border-black/18 text-[var(--brand-900)]"
                  />
                  X
                </label>
              </div>
              <p className={`${adminBody} text-[13px]`}>
                Bearbeiten und kopieren Sie die Texte beim jeweiligen Entwurf unter{" "}
                <Link href={CMS_PATHS.adminBlogAutomationDrafts} className="font-medium text-[var(--brand-900)] underline-offset-4 hover:underline">
                  Entwürfe prüfen
                </Link>
                .
              </p>
            </div>

            <div className={`${adminPanel} space-y-5 p-7 sm:p-8`}>
              <div>
                <h3 className="font-serif text-[1.2rem] font-medium text-[var(--apple-text)]">Freigabe vor der Website</h3>
                <p className={`mt-2 max-w-prose ${adminBody}`}>Der sichere Standard: Sie behalten die letzte Kontrolle.</p>
              </div>
              <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-black/[0.06] bg-white/95 p-5">
                <input
                  type="checkbox"
                  checked={form.requireHumanApproval}
                  onChange={(e) => patch({ requireHumanApproval: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded border-black/18 text-[var(--brand-900)]"
                />
                <span>
                  <span className="font-medium text-[var(--apple-text)]">Immer zuerst Entwurf prüfen</span>
                  <span className={`mt-2 block ${adminBody}`}>Empfohlen: Nur nach Ihrer Freigabe wird veröffentlicht.</span>
                </span>
              </label>

              <ChoiceCard
                checked={form.autoPublish}
                onChange={(v) => patch({ autoPublish: v })}
                title="Ohne manuelle Freigabe auf der Website veröffentlichen"
                description="Nur in Ausnahmefällen. Technisch nur wirksam, wenn die vorherige Option ausgeschaltet ist und eine Standard-Autorin im System hinterlegt ist."
              />

              {form.autoPublish ? (
                <div className="rounded-2xl border border-amber-200/90 bg-amber-50/90 px-5 py-4 text-[14px] leading-snug text-amber-950">
                  <span className="font-medium">Mit Bedacht.</span> Für eine Beratungsmarke empfehlen wir, jeden Text vor der Veröffentlichung zu lesen.
                </div>
              ) : null}

              <div className={adminFeedbackInfo}>Standard: Entwürfe bleiben zur Prüfung bei Ihnen; der Zeitplan steuert nur, wann neue Entwürfe entstehen.</div>
            </div>
          </div>
        </AdminPageSection>

        <AdminPageSection>
          <div className="flex flex-col gap-4 border-t border-black/[0.06] pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className={`max-w-md ${adminBody}`}>Speichern Sie, wenn Sie mit Rhythmus und Themen zufrieden sind.</p>
            <button type="submit" disabled={saving} className={`${adminBtnPrimary} !min-h-[46px] px-10 text-[15px]`}>
              {saving ? "Speichern…" : "Änderungen sichern"}
            </button>
          </div>
        </AdminPageSection>
      </AdminPageContainer>
    </form>
  );
}
