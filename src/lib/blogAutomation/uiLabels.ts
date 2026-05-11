/**
 * Friendly German labels for Blog Automation CMS (avoid jargon like "cron", "pipeline").
 */

export function humanizeBlogAutomationText(raw: string): string {
  let s = raw;
  s = s.replace(/\[blogAutomation\]\s*/gi, "");
  s = s.replace(/\[blog-pipeline\]\s*/gi, "");
  s = s.replace(/Missing OPENAI_API_KEY[^\n.]*/gi, "Die KI-Anbindung ist nicht konfiguriert — bitte technischen Kontakt informieren.");
  s = s.replace(/Unauthorized\.?/gi, "Nicht berechtigt.");
  s = s.replace(/\bCRON_SECRET\b/gi, "geheimer Zeitplan-Schlüssel");
  return s
    .replace(/\bcron\b/gi, "automatische Prüfung")
    .replace(/\bpipeline\b/gi, "Blog-Automatisierung")
    .replace(/\bqueued\b/gi, "wartend")
    .replace(/\bfailed\b/gi, "benötigt Aufmerksamkeit");
}

export function friendlyAutomationTrigger(trigger: string): string {
  const t = trigger.trim().toLowerCase();
  if (t === "cron") return "Automatische Prüfung";
  if (t === "manual") return "Manuell";
  return trigger ? humanizeBlogAutomationText(trigger) : "—";
}

export function friendlyAutomationRunStatus(status: string): string {
  switch (status.trim().toLowerCase()) {
    case "started":
      return "Läuft";
    case "completed":
      return "Abgeschlossen";
    case "failed":
      return "Benötigt Aufmerksamkeit";
    case "cancelled":
      return "Abgebrochen";
    default:
      return status ? humanizeBlogAutomationText(status) : "—";
  }
}

export function friendlyAutomationLogLevel(level: string): string {
  switch (level.trim().toLowerCase()) {
    case "error":
      return "Wichtig";
    case "warn":
      return "Hinweis";
    case "info":
      return "Info";
    case "debug":
      return "Details";
    default:
      return level || "—";
  }
}
