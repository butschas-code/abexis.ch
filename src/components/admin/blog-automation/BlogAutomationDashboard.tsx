"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import {
  adminBody,
  adminBtnGhost,
  adminSectionLabel,
  adminTableWrap,
} from "@/components/admin/admin-ui";
import type {
  BlogAutomationDashboardSnapshot,
  BlogPipelineLogDashboardRow,
  BlogPipelineRunDashboardRow,
} from "@/cms/services/blog-automation-dashboard-client";
import {
  friendlyAutomationLogLevel,
  friendlyAutomationRunStatus,
  friendlyAutomationTrigger,
  humanizeBlogAutomationText,
} from "@/lib/blogAutomation/uiLabels";

function formatDateTime(iso: string | null, timeZone: string): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("de-CH", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function truncateMessage(s: string, max = 140): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}

function StatCard(props: { title: string; value: ReactNode; hint?: ReactNode }) {
  const { title, value, hint } = props;
  return (
    <div className="rounded-2xl border border-black/[0.05] bg-[color-mix(in_srgb,var(--apple-bg-elevated)_98%,white)] p-6 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--apple-text-tertiary)]">{title}</div>
      <div className="mt-3 font-serif text-[1.65rem] font-medium tracking-tight text-[var(--apple-text)]">{value}</div>
      {hint ? <div className={`mt-3 ${adminBody} text-[13px]`}>{hint}</div> : null}
    </div>
  );
}

function pickRecentAttentionLogs(logs: BlogPipelineLogDashboardRow[]): BlogPipelineLogDashboardRow[] {
  return logs.filter((l) => l.level === "error" || l.level === "warn").slice(0, 14);
}

type Props = {
  snapshot: BlogAutomationDashboardSnapshot | null;
  displayTimezone: string;
  automationEnabled: boolean;
  articlesPerWeek: number;
  draftsReviewHref: string;
  busy: boolean;
  onRefresh: () => void;
};

export function BlogAutomationDashboard(props: Props) {
  const { snapshot, displayTimezone, automationEnabled, articlesPerWeek, draftsReviewHref, busy, onRefresh } = props;

  const lastRun = snapshot?.runs?.[0] ?? null;
  const attentionLogs = snapshot ? pickRecentAttentionLogs(snapshot.logs) : [];

  const lastRunHint =
    lastRun?.lastErrorMessage != null && lastRun.lastErrorMessage.trim().length > 0
      ? truncateMessage(humanizeBlogAutomationText(lastRun.lastErrorMessage))
      : undefined;

  const automationHint = automationEnabled
    ? "Nach Ihrem Zeitplan werden neue Entwürfe vorbereitet."
    : "Ausgeschaltet — es werden keine neuen Entwürfe automatisch angelegt.";

  const draftsAwaiting = snapshot?.draftsAwaitingReview ?? null;
  const draftsHint =
    draftsAwaiting === 0
      ? "Sobald ein Entwurf bereitsteht, sehen Sie ihn hier und unter «Entwürfe prüfen»."
      : "Zur inhaltlichen Prüfung vor der Website.";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl space-y-2">
          <p className={adminSectionLabel}>Stand</p>
          <h2 className="font-serif text-[1.35rem] font-medium tracking-tight text-[var(--apple-text)]">Kurzüberblick</h2>
          <p className={`${adminBody} text-[14px]`}>Zahlen und Hinweise — ohne technische Details.</p>
        </div>
        <button type="button" className={`${adminBtnGhost} text-[13px]`} disabled={busy} onClick={onRefresh}>
          {busy ? "Laden…" : "Aktualisieren"}
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Vorbereitung" value={automationEnabled ? "Ein" : "Aus"} hint={automationHint} />

        <StatCard title="Entwürfe / Woche max." value={articlesPerWeek} hint="Wie unter «Schritt 2» eingestellt." />

        <StatCard
          title="Nächste Planprüfung"
          value={formatDateTime(snapshot?.nextAutomaticCheckAt ?? null, displayTimezone)}
          hint="Ab diesem Zeitpunkt kann ein neuer Entwurf entstehen — wenn Tag, Uhrzeit und Obergrenze passen."
        />

        <StatCard
          title="Offene Entwürfe"
          value={
            snapshot != null ? (
              <Link href={draftsReviewHref} className="text-[var(--brand-900)] underline-offset-4 hover:underline">
                {snapshot.draftsAwaitingReview}
              </Link>
            ) : (
              "—"
            )
          }
          hint={snapshot != null ? draftsHint : "Nach «Aktualisieren» erscheint die Zahl hier."}
        />

        <StatCard
          title="Veröffentlicht (Monat)"
          value={snapshot?.publishedThisMonth ?? "—"}
          hint={`Live auf der Website — Kalender nach ${displayTimezone}.`}
        />

        <StatCard
          title="Letzter Lauf"
          value={lastRun ? friendlyAutomationRunStatus(lastRun.status) : "—"}
          hint={
            lastRun
              ? `${formatDateTime(lastRun.startedAt, displayTimezone)} · ${friendlyAutomationTrigger(lastRun.trigger)} · ${lastRun.draftsCreated} Entwurf(e)${lastRunHint ? ` · ${lastRunHint}` : ""}`
              : "Erscheint, sobald die Vorbereitung zum ersten Mal gelaufen ist."
          }
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          <h3 className="font-medium text-[var(--apple-text)]">Letzte Einträge</h3>
          <p className={`${adminBody} text-[13px]`}>Chronik für Ihre Orientierung.</p>
          <RunsTable runs={snapshot?.runs ?? []} timeZone={displayTimezone} />
        </div>

        <div className="space-y-3">
          <h3 className="font-medium text-[var(--apple-text)]">Hinweise</h3>
          <p className={`${adminBody} text-[13px]`}>Was Aufmerksamkeit verdient.</p>
          <AttentionLogsTable logs={attentionLogs} timeZone={displayTimezone} />
        </div>
      </div>

      {automationEnabled && snapshot?.nextLikelyDraftAt ? (
        <p className={`${adminBody} rounded-2xl border border-black/[0.05] bg-[color-mix(in_srgb,var(--apple-bg-subtle)_40%,white)] px-5 py-4 text-[13px]`}>
          <span className="font-medium text-[var(--apple-text)]">Orientierung nächster Entwurf: </span>
          {formatDateTime(snapshot.nextLikelyDraftAt, displayTimezone)}
          <span className="mt-2 block text-[var(--apple-text-secondary)]">
            Keine Garantie — es müssen Schreibtag, Uhrzeit, Grenzen und Themen zusammenpassen.
          </span>
        </p>
      ) : null}
    </div>
  );
}

function RunsTable(props: { runs: BlogPipelineRunDashboardRow[]; timeZone: string }) {
  const { runs, timeZone } = props;
  if (runs.length === 0) {
    return (
      <p className={`rounded-xl border border-dashed border-black/[0.1] bg-[color-mix(in_srgb,var(--apple-bg-subtle)_55%,white)] px-4 py-8 text-center ${adminBody}`}>
        Noch keine Aktivität in dieser Liste. Sobald die Automatisierung läuft, erscheinen hier die letzten Abläufe.
      </p>
    );
  }
  return (
    <div className={adminTableWrap}>
      <table className="min-w-full border-collapse text-left text-[14px]">
        <thead>
          <tr className="border-b border-black/[0.08] text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-text-tertiary)]">
            <th className="py-2 pr-3">Zeit</th>
            <th className="py-2 pr-3">Auslöser</th>
            <th className="py-2 pr-3">Status</th>
            <th className="py-2 pr-3 tabular-nums">Entwürfe</th>
            <th className="py-2">Kurzinfo</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((r) => (
            <tr key={r.id} className="border-b border-black/[0.05] last:border-0">
              <td className="py-2.5 pr-3 align-top text-[var(--apple-text-secondary)]">{formatDateTime(r.startedAt, timeZone)}</td>
              <td className="py-2.5 pr-3 align-top">{friendlyAutomationTrigger(r.trigger)}</td>
              <td className="py-2.5 pr-3 align-top">{friendlyAutomationRunStatus(r.status)}</td>
              <td className="py-2.5 pr-3 align-top tabular-nums">{r.draftsCreated}</td>
              <td className="py-2.5 align-top text-[var(--apple-text-secondary)]">
                {r.lastErrorMessage ? truncateMessage(humanizeBlogAutomationText(r.lastErrorMessage), 100) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AttentionLogsTable(props: { logs: BlogPipelineLogDashboardRow[]; timeZone: string }) {
  const { logs, timeZone } = props;
  if (logs.length === 0) {
    return (
      <p className={`rounded-xl border border-dashed border-black/[0.1] bg-[color-mix(in_srgb,var(--apple-bg-subtle)_55%,white)] px-4 py-8 text-center ${adminBody}`}>
        Keine Hinweise — das ist in der Regel ein gutes Zeichen.
      </p>
    );
  }
  return (
    <div className={adminTableWrap}>
      <table className="min-w-full border-collapse text-left text-[14px]">
        <thead>
          <tr className="border-b border-black/[0.08] text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--apple-text-tertiary)]">
            <th className="py-2 pr-3">Zeit</th>
            <th className="py-2 pr-3">Stufe</th>
            <th className="py-2">Nachricht</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l.id} className="border-b border-black/[0.05] last:border-0">
              <td className="py-2.5 pr-3 align-top whitespace-nowrap text-[var(--apple-text-secondary)]">{formatDateTime(l.createdAt, timeZone)}</td>
              <td className="py-2.5 pr-3 align-top">{friendlyAutomationLogLevel(l.level)}</td>
              <td className="py-2.5 align-top text-[var(--apple-text-secondary)]">{truncateMessage(humanizeBlogAutomationText(l.message), 180)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
