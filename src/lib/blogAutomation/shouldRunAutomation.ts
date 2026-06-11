import "server-only";

import { DateTime } from "luxon";
import { Timestamp } from "firebase-admin/firestore";

import { COLLECTIONS } from "@/cms/firestore/collections";
import type { BlogAutomationSettings } from "@/lib/blogAutomation/types";
import { adminDb } from "@/lib/firebaseAdmin";

export type ShouldRunAutomationResult = {
  shouldRun: boolean;
  reason: string;
};

/** Luxon weekday: Monday = 1 … Sunday = 7 → lowercase English keys used in `preferredDays`. */
const WEEKDAY_KEYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

function normalizeDayLabel(s: string): string {
  return s.trim().toLowerCase();
}

/** Parses `HH:mm` (24 h). */
function parsePreferredTime(preferredTime: string): { hour: number; minute: number } | null {
  const m = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(preferredTime.trim());
  if (!m) return null;
  return { hour: Number(m[1]), minute: Number(m[2]) };
}

/**
 * Monday 00:00 in `timezone` for the calendar week that contains `dt` (ISO-style week start).
 */
function startOfIsoWeekInZone(dt: DateTime): DateTime {
  return dt.minus({ days: dt.weekday - 1 }).startOf("day");
}

/**
 * Decides whether this cron invocation should attempt to create **one** automation draft.
 * Uses `blogPipelineRuns` (sums `draftsCreated`) for weekly and daily limits.
 */
export async function shouldRunAutomation(
  settings: BlogAutomationSettings,
  now: Date,
): Promise<ShouldRunAutomationResult> {
  if (!settings.enabled) {
    return { shouldRun: false, reason: "Automation is turned off (enabled = false)." };
  }

  const articlesPerWeek = Math.floor(Number(settings.articlesPerWeek));
  if (!Number.isFinite(articlesPerWeek) || articlesPerWeek <= 0) {
    return { shouldRun: false, reason: "articlesPerWeek must be a positive whole number." };
  }

  const tz = settings.timezone?.trim();
  if (!tz.length) {
    return { shouldRun: false, reason: "No IANA timezone configured (timezone is empty)." };
  }

  const dt = DateTime.fromJSDate(now, { zone: tz });
  if (!dt.isValid) {
    return {
      shouldRun: false,
      reason: `Invalid date or timezone (${tz}): ${dt.invalidExplanation ?? dt.invalidReason ?? "unknown"}.`,
    };
  }

  const timeParts = parsePreferredTime(settings.preferredTime ?? "");
  if (!timeParts) {
    return {
      shouldRun: false,
      reason: `preferredTime must be 24-hour HH:mm (e.g. 09:30); got "${settings.preferredTime}".`,
    };
  }

  const preferredDays = (settings.preferredDays ?? []).map(normalizeDayLabel).filter(Boolean);
  if (preferredDays.length === 0) {
    return { shouldRun: false, reason: "No draft day is configured; choose one weekday for automatic draft creation." };
  }

  const todayKey = WEEKDAY_KEYS[dt.weekday - 1];
  if (!preferredDays.includes(todayKey)) {
    return {
      shouldRun: false,
      reason: `Today (${todayKey}) is not the configured draft day [${preferredDays.join(", ")}] (${tz}).`,
    };
  }

  const minutesNow = dt.hour * 60 + dt.minute;
  const minutesTarget = timeParts.hour * 60 + timeParts.minute;
  if (minutesNow < minutesTarget) {
    return {
      shouldRun: false,
      reason: `Local time ${dt.toFormat("HH:mm")} is before preferredTime ${settings.preferredTime} (${tz}).`,
    };
  }

  const weekStart = startOfIsoWeekInZone(dt);
  const startOfToday = dt.startOf("day");

  const weekStartTs = Timestamp.fromDate(weekStart.toJSDate());
  const runsSnap = await adminDb.collection(COLLECTIONS.blogPipelineRuns).where("startedAt", ">=", weekStartTs).get();

  let draftsThisWeek = 0;
  let draftsToday = 0;

  for (const doc of runsSnap.docs) {
    const data = doc.data();
    const startedRaw = data.startedAt;
    const created =
      typeof data.draftsCreated === "number" && Number.isFinite(data.draftsCreated) ? data.draftsCreated : 0;
    if (!(startedRaw instanceof Timestamp)) continue;

    const started = DateTime.fromJSDate(startedRaw.toDate(), { zone: tz });
    if (started < weekStart) continue;

    draftsThisWeek += created;
    if (started >= startOfToday) {
      draftsToday += created;
    }
  }

  if (draftsToday >= 1) {
    return {
      shouldRun: false,
      reason:
        "Already recorded at least one draft today (sum of draftsCreated on blogPipelineRuns starting today). Only one automation draft per calendar day.",
    };
  }

  if (draftsThisWeek >= articlesPerWeek) {
    return {
      shouldRun: false,
      reason: `Weekly draft already created: ${draftsThisWeek} draft(s) created this ISO week (limit ${articlesPerWeek}, timezone ${tz}).`,
    };
  }

  return {
    shouldRun: true,
    reason: `OK: ${todayKey}, at or after ${settings.preferredTime} ${tz}, ${draftsThisWeek}/${articlesPerWeek} draft(s) used this week, none yet today.`,
  };
}
