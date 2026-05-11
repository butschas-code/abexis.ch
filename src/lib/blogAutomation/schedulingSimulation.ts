import { DateTime } from "luxon";

/** Minimal settings slice needed to mirror {@link shouldRunAutomation} client-side. */
export type AutomationScheduleSettings = {
  enabled: boolean;
  articlesPerWeek: number;
  preferredDays: string[];
  preferredTime: string;
  timezone: string;
};

export type RunAggRow = {
  startedAt: Date;
  draftsCreated: number;
};

const WEEKDAY_KEYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

function normalizeDayLabel(s: string): string {
  return s.trim().toLowerCase();
}

function parsePreferredTime(preferredTime: string): { hour: number; minute: number } | null {
  const m = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(preferredTime.trim());
  if (!m) return null;
  return { hour: Number(m[1]), minute: Number(m[2]) };
}

function startOfIsoWeekInZone(dt: DateTime): DateTime {
  return dt.minus({ days: dt.weekday - 1 }).startOf("day");
}

/**
 * Mirrors server {@link shouldRunAutomation} enough to estimate whether a draft **could**
 * be created at `now`, given historical runs (same rules as the cron handler).
 */
export function wouldAutomationRunCreateDraftAt(settings: AutomationScheduleSettings, now: Date, runs: RunAggRow[]): boolean {
  if (!settings.enabled) return false;

  const articlesPerWeek = Math.floor(Number(settings.articlesPerWeek));
  if (!Number.isFinite(articlesPerWeek) || articlesPerWeek <= 0) return false;

  const tz = settings.timezone?.trim();
  if (!tz.length) return false;

  const dt = DateTime.fromJSDate(now, { zone: tz });
  if (!dt.isValid) return false;

  const timeParts = parsePreferredTime(settings.preferredTime ?? "");
  if (!timeParts) return false;

  const preferredDays = (settings.preferredDays ?? []).map(normalizeDayLabel).filter(Boolean);
  if (preferredDays.length === 0) return false;

  const todayKey = WEEKDAY_KEYS[dt.weekday - 1];
  if (!preferredDays.includes(todayKey)) return false;

  const minutesNow = dt.hour * 60 + dt.minute;
  const minutesTarget = timeParts.hour * 60 + timeParts.minute;
  if (minutesNow < minutesTarget) return false;

  const weekStart = startOfIsoWeekInZone(dt);
  const startOfToday = dt.startOf("day");

  let draftsThisWeek = 0;
  let draftsToday = 0;

  for (const r of runs) {
    const started = DateTime.fromJSDate(r.startedAt, { zone: tz });
    if (started < weekStart) continue;
    const created = typeof r.draftsCreated === "number" && Number.isFinite(r.draftsCreated) ? r.draftsCreated : 0;
    draftsThisWeek += created;
    if (started >= startOfToday) {
      draftsToday += created;
    }
  }

  if (draftsToday >= 1) return false;
  if (draftsThisWeek >= articlesPerWeek) return false;

  return true;
}

/**
 * UTC hour for the production cron schedule (`vercel.json`).
 * Hobby accounts allow at most **one** cron invocation per day — keep this aligned with that file.
 * 14:00 UTC ≈ afternoon CH/EU so typical morning `preferredTime` values have usually passed.
 */
export const BLOG_AUTOMATION_CRON_UTC_HOUR = 14;

/** Next scheduled cron run instant in UTC (daily at {@link BLOG_AUTOMATION_CRON_UTC_HOUR}:00). */
export function nextBlogAutomationCronUtc(from: Date): Date {
  const dt = DateTime.fromJSDate(from, { zone: "utc" });
  let target = dt.set({
    hour: BLOG_AUTOMATION_CRON_UTC_HOUR,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  if (target.toMillis() <= dt.toMillis()) {
    target = target.plus({ days: 1 });
  }
  return target.toJSDate();
}

/** Next instant when a draft might be created (walks daily cron fires up to `maxDaysAhead`). */
export function findNextLikelyDraftAt(settings: AutomationScheduleSettings, runs: RunAggRow[], from: Date, maxDaysAhead = 14): Date | null {
  let candidate = nextBlogAutomationCronUtc(from);
  const end = DateTime.fromJSDate(from, { zone: "utc" }).plus({ days: maxDaysAhead }).toMillis();

  while (candidate.getTime() <= end) {
    if (wouldAutomationRunCreateDraftAt(settings, candidate, runs)) {
      return candidate;
    }
    candidate = DateTime.fromJSDate(candidate, { zone: "utc" }).plus({ days: 1 }).toJSDate();
  }
  return null;
}
