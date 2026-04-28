/**
 * Shared **editorial admin** visuals : boutique / calm, not generic SaaS.
 * Use these instead of one-off rounded/border classes for consistency.
 */

/** Primary content panel (warm white, soft lift). */
export const adminPanel =
  "rounded-[1.25rem] border border-black/[0.06] bg-[var(--apple-bg-elevated)] shadow-[0_1px_0_rgba(0,0,0,0.04),0_18px_48px_-22px_rgba(29,29,31,0.07)]";

/** Lighter inset / filter strip. */
export const adminPanelInset =
  "rounded-[1.25rem] border border-black/[0.05] bg-[color-mix(in_srgb,var(--apple-bg-elevated)_92%,var(--apple-bg-subtle))] p-5 sm:p-6";

export const adminInput =
  "w-full rounded-xl border border-black/[0.08] bg-white px-3.5 py-2.5 text-[15px] leading-snug text-[var(--apple-text)] outline-none transition placeholder:text-[var(--apple-text-tertiary)] focus:border-[var(--brand-500)]/40 focus:shadow-[0_0_0_3px_rgba(69,128,200,0.18)]";

export const adminInputError =
  "border-red-300/90 focus:border-red-400/80 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]";

/** Section label / Kapitälchen : hierarchy without shouting. */
export const adminSectionLabel =
  "text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--apple-text-tertiary)]";

export const adminBody = "text-[15px] leading-relaxed text-[var(--apple-text-secondary)]";

export const adminBtnPrimary =
  "inline-flex min-h-[42px] shrink-0 items-center justify-center rounded-full bg-[var(--brand-900)] px-5 text-[14px] font-medium text-white shadow-sm shadow-[var(--brand-900)]/18 transition hover:bg-[var(--brand-900-hover)] hover:shadow-md active:scale-[0.99] disabled:pointer-events-none disabled:opacity-45";

export const adminBtnSecondary =
  "inline-flex min-h-[42px] shrink-0 items-center justify-center rounded-full border border-black/[0.09] bg-white px-5 text-[14px] font-medium text-[var(--apple-text)] shadow-[0_1px_0_rgba(0,0,0,0.03)] transition hover:border-black/13 hover:bg-[var(--apple-bg-subtle)] active:scale-[0.99] disabled:opacity-45";

export const adminBtnGhost =
  "inline-flex min-h-[40px] items-center justify-center rounded-full px-4 text-[14px] font-medium text-[var(--brand-900)] transition hover:bg-[var(--brand-900)]/[0.07]";

export const adminTableWrap = adminPanel + " overflow-x-auto";

export const adminFeedbackSuccess =
  "rounded-[1rem] border border-emerald-200/80 bg-emerald-50/[0.85] px-4 py-3 text-[14px] leading-snug text-emerald-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]";

export const adminFeedbackError =
  "rounded-[1rem] border border-red-200/90 bg-red-50/95 px-4 py-3 text-[14px] leading-snug text-red-900";

export const adminFeedbackInfo =
  "rounded-[1rem] border border-[var(--brand-900)]/12 bg-[color-mix(in_srgb,var(--brand-900)_7%,white)] px-4 py-3 text-[14px] leading-snug text-[var(--apple-text)]";

/** Status pill (tables). */
export const adminPill =
  "inline-flex items-center rounded-full bg-[color-mix(in_srgb,var(--apple-bg-subtle)_88%,white)] px-2.5 py-0.5 text-[12px] font-medium text-[var(--apple-text)] ring-1 ring-black/[0.05]";
