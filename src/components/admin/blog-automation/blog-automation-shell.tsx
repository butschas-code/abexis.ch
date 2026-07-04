/**
 * Shared shell for Blog Automation CMS — Swiss-editorial step layout (spacing, cards, typography).
 */

import type { ReactNode } from "react";

import { adminBody, adminPanel, adminSectionLabel } from "@/components/admin/admin-ui";

export const blogAutomationJourney = [
  { step: 1, label: "Einschalten", caption: "Automatisierung" },
  { step: 2, label: "Entwurfstag", caption: "Drafts erstellen" },
  { step: 3, label: "Live-Termin", caption: "Freigaben planen" },
  { step: 4, label: "Themen", caption: "Liste oder Vorschläge" },
  { step: 5, label: "Sichern", caption: "Speichern" },
  { step: 6, label: "Prüfen", caption: "Entwürfe lesen" },
] as const;

export function BlogAutomationJourneyStrip() {
  return (
    <div className="rounded-[1.25rem] border border-black/[0.05] bg-[color-mix(in_srgb,var(--apple-bg-elevated)_96%,white)] px-4 py-5 sm:px-8 sm:py-6">
      <p className={`${adminSectionLabel} mb-4 text-center sm:text-left`}>So gehen Sie vor</p>
      <ol className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-6 sm:gap-2 sm:overflow-visible sm:pb-0">
        {blogAutomationJourney.map(({ step, label, caption }) => (
          <li
            key={step}
            className="flex min-w-[104px] shrink-0 snap-start flex-col items-center gap-2 text-center sm:min-w-0"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.07] bg-white text-[13px] font-semibold tabular-nums text-[var(--apple-text)] shadow-[0_1px_0_rgba(0,0,0,0.03)]">
              {step}
            </span>
            <span className="text-[13px] font-medium leading-tight text-[var(--apple-text)]">{label}</span>
            <span className="text-[11px] leading-snug text-[var(--apple-text-tertiary)]">{caption}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

type AutomationStepCardProps = {
  step: number;
  title: string;
  intro?: string;
  children: ReactNode;
};

export function BlogAutomationStepCard({ step, title, intro, children }: AutomationStepCardProps) {
  return (
    <section className={`${adminPanel} p-7 sm:p-9`}>
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/[0.06] bg-[color-mix(in_srgb,var(--apple-bg-subtle)_55%,white)] text-[15px] font-semibold tabular-nums text-[var(--apple-text)]">
          {step}
        </div>
        <div className="min-w-0 flex-1 space-y-6">
          <header className="space-y-2">
            <p className={adminSectionLabel}>Schritt {step}</p>
            <h2 className="font-serif text-[1.4rem] font-medium leading-snug tracking-[-0.02em] text-[var(--apple-text)] sm:text-[1.5rem]">
              {title}
            </h2>
            {intro ? <p className={`max-w-prose ${adminBody}`}>{intro}</p> : null}
          </header>
          <div className="space-y-5">{children}</div>
        </div>
      </div>
    </section>
  );
}

type AutomationNoticeCardProps = {
  title: string;
  children: ReactNode;
  variant?: "neutral" | "accent";
};

/** Highlight card for save / review CTAs */
export function BlogAutomationNoticeCard({ title, children, variant = "neutral" }: AutomationNoticeCardProps) {
  const wrap =
    variant === "accent"
      ? "rounded-[1.25rem] border border-[var(--brand-900)]/14 bg-[color-mix(in_srgb,var(--brand-900)_6%,white)] p-7 sm:p-9"
      : "rounded-[1.25rem] border border-black/[0.06] bg-[color-mix(in_srgb,var(--apple-bg-subtle)_45%,white)] p-7 sm:p-9";
  return (
    <section className={wrap}>
      <h2 className="font-serif text-[1.35rem] font-medium tracking-tight text-[var(--apple-text)]">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
