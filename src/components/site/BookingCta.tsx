import { siteConfig } from "@/data/pages";

export function BookingCta() {
  return (
    <div className="rounded-[28px] bg-white p-8 shadow-[var(--apple-shadow)] ring-1 ring-black/[0.04] md:p-10">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">Online Terminierung</p>
          <h2 className="mt-3 text-[22px] font-semibold tracking-[-0.02em] text-[#1d1d1f] md:text-[24px]">
            Direkt im Kalender buchen
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-[#6e6e73]">
            Wählen Sie bequem einen freien Termin für ein Erstgespräch oder einen Austausch.
          </p>
        </div>
        <a
          href={siteConfig.bookingUrlDe}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex min-h-[56px] items-center gap-3 rounded-full bg-brand-900 px-8 text-[16px] font-medium text-white shadow-lg shadow-brand-900/28 transition-all duration-200 hover:bg-[var(--brand-900-hover)] hover:shadow-xl active:scale-[0.98]"
        >
          <CalendarIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
          <span>Termin buchen</span>
        </a>
      </div>
    </div>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}
