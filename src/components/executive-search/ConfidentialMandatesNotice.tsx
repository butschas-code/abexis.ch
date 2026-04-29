import { PublicContentWidth } from "@/components/site/PublicContentWidth";

const SUPPORTING_EXEC =
  "Viele Führungs- und Schlüsselpositionen entstehen in vertraulichen Situationen: Nachfolgeregelungen, strategische Neuausrichtungen, sensible Wechsel oder gezielte Marktansprachen. Deshalb erscheinen nicht alle Suchmandate öffentlich auf der Website. Wenn Ihr Profil zu unseren Branchenschwerpunkten passt, lohnt sich eine vertrauliche Kontaktaufnahme auch ohne konkrete Ausschreibung.";

const SUPPORTING_VAKANZEN =
  "Auf dieser Seite sehen Sie nur ausgewählte öffentlich ausgeschriebene Positionen. Viele Suchmandate bearbeiten wir vertraulich. Sie können uns Ihr Profil deshalb auch ohne konkrete Ausschreibung übermitteln.";

export function ConfidentialMandatesNotice({ variant = "executive-search" }: { variant?: "executive-search" | "vakanzen" }) {
  const supporting = variant === "vakanzen" ? SUPPORTING_VAKANZEN : SUPPORTING_EXEC;

  return (
    <section aria-labelledby="verdeckte-mandate-heading" className="border-b border-black/[0.06] bg-gradient-to-b from-[#f8faff] via-white to-[#fbfbfd] py-12 sm:py-14 md:py-16">
      <PublicContentWidth>
        <div className="relative overflow-hidden rounded-[1.35rem] border border-[#26337c]/12 bg-white/90 p-7 shadow-[0_16px_48px_rgba(38,51,124,0.08)] ring-1 ring-black/[0.04] sm:p-8 md:p-10">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_100%_0%,rgba(69,179,226,0.09),transparent_55%),radial-gradient(ellipse_70%_60%_at_0%_100%,rgba(38,51,124,0.06),transparent_50%)]"
            aria-hidden
          />
          <div className="relative">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#26337c]/85">Verdeckte Mandate</p>
            <h2 id="verdeckte-mandate-heading" className="mt-3 max-w-[52ch] text-[21px] font-semibold leading-snug tracking-[-0.025em] text-[#1d1d1f] sm:text-[24px]">
              Die meisten unserer Mandate werden verdeckt und nicht öffentlich ausgeschrieben.
            </h2>
            <p className="mt-5 max-w-[60ch] text-[15px] leading-relaxed text-[#6e6e73] sm:text-[16px]">{supporting}</p>
            <p className="mt-4 text-[12px] leading-relaxed text-[#86868b] sm:text-[13px]">
              Most of our mandates are confidential and not publicly listed.
            </p>
          </div>
        </div>
      </PublicContentWidth>
    </section>
  );
}
