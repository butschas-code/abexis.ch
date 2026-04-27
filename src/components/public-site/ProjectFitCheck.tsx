import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { PageHero } from "@/components/site/PageHero";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { projectFitVisual } from "@/data/site-images";
import { siteConfig } from "@/data/pages";

// ─── Static data ──────────────────────────────────────────────────────────────

const warnsignale = [
  "Entscheidungen werden vertagt",
  "Statusberichte werden «optimistisch»",
  "Risiken sind bekannt, aber nicht priorisiert",
  "Key Personen verlieren das Vertrauen",
  "Niemand hat den Gesamtüberblick",
] as const;

const dimensionen = [
  {
    key: "Strategy",
    label: "Strategie",
    body: "Sind Ziele, Scope und Erfolgskriterien klar definiert und vom Management getragen?",
  },
  {
    key: "Governance",
    label: "Governance",
    body: "Funktionieren Entscheidungswege, Eskalationspfade und Projektaufsicht zuverlässig?",
  },
  {
    key: "Execution",
    label: "Umsetzung",
    body: "Wie realistisch sind Plan, Ressourcen und Lieferfähigkeit des Teams?",
  },
  {
    key: "Risks",
    label: "Risiken",
    body: "Welche Risiken sind bekannt, unterschätzt oder noch gar nicht erfasst?",
  },
  {
    key: "Change",
    label: "Change",
    body: "Sind Stakeholder eingebunden und ist die Organisation bereit für die Veränderung?",
  },
  {
    key: "Technology",
    label: "Technologie",
    body: "Sind technische Entscheidungen und Abhängigkeiten tragfähig und dokumentiert?",
  },
] as const;

const lieferobjekte = [
  { num: "01", title: "Executive Summary", sub: "Management & Board ready" },
  { num: "02", title: "Ampelbewertung", sub: "Green / Yellow / Red je Dimension" },
  { num: "03", title: "Top 10 Risiken", sub: "Inkl. Eintrittswahrscheinlichkeit" },
  { num: "04", title: "Governance Bewertung", sub: "Strukturen und Entscheidungswege" },
  { num: "05", title: "Change Readiness", sub: "Organisatorische Einschätzung" },
  { num: "06", title: "Massnahmenplan", sub: "30 / 60 / 90 Tage konkret" },
] as const;

const empfehlungen = [
  {
    signal: "Continue",
    color: "#22c55e",
    darkBg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.2)",
    icon: "→",
    title: "Weiterführen",
    body: "Das Projekt ist grundsätzlich auf Kurs. Identifizierte Punkte werden mit gezielten Massnahmen adressiert.",
  },
  {
    signal: "Stabilize",
    color: "#f59e0b",
    darkBg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
    icon: "⟳",
    title: "Stabilisieren",
    body: "Wesentliche Risiken erfordern sofortige Massnahmen, bevor das Projekt in die nächste Phase übergeht.",
  },
  {
    signal: "Reset",
    color: "#ef4444",
    darkBg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
    icon: "✕",
    title: "Neu ausrichten",
    body: "Grundlegende Annahmen oder Strukturen müssen überarbeitet werden. Ein kontrollierter Neustart ist empfehlenswert.",
  },
] as const;

const pakete = [
  {
    name: "Lite",
    dauer: "3 Tage",
    preis: "CHF 5'900.–",
    fokus: "Schnellcheck & Früherkennung",
    bestseller: false,
    items: [
      "Kick-off-Interview mit Projektleitung",
      "Schnellbewertung aller 6 Dimensionen",
      "Ampel-Übersicht (Green / Yellow / Red)",
      "Top 5 Risiken",
      "Kurze schriftliche Einschätzung",
    ],
  },
  {
    name: "Professional",
    dauer: "5 Tage",
    preis: "CHF 9'750.–",
    fokus: "Vollständige Analyse + Massnahmenplan",
    bestseller: true,
    items: [
      "Interviews mit Schlüssel-Stakeholdern",
      "Vollständige 6-Dimensionen-Analyse",
      "Executive Summary (Board-ready)",
      "Top 10 Risiken inkl. Wahrscheinlichkeit",
      "Governance & Change Readiness Einschätzung",
      "Massnahmenplan 30 / 60 / 90 Tage",
      "Klare Empfehlung: Continue / Stabilize / Reset",
    ],
  },
  {
    name: "Deep Dive",
    dauer: "10 Tage",
    preis: "CHF 19'500.–",
    fokus: "Detailanalyse + Umsetzungsbegleitung",
    bestseller: false,
    items: [
      "Alles aus Professional",
      "Erweiterte Stakeholder-Interviews",
      "Technische Deep-Dive-Analyse",
      "Workshop mit Führungsteam",
      "Umsetzungsbegleitung der Massnahmen",
      "Follow-up nach 30 Tagen",
    ],
  },
] as const;

const differenziierung = [
  "Kombination aus Projekt-, Risk- und Change-Expertise",
  "Unabhängig von Software-Anbietern und Interessen",
  "Management-verständlich statt technisch-abstrakt",
  "Schnell, präzise und umsetzungsorientiert",
] as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

function LCorner({ className = "" }: { className?: string }) {
  return (
    <span className={`pointer-events-none absolute ${className}`} aria-hidden>
      <span className="block h-4 w-px bg-current" />
      <span className="block h-px w-4 bg-current" />
    </span>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Page component ───────────────────────────────────────────────────────────

export function ProjectFitCheck() {
  return (
    <InteriorPageRoot>
      {/* ── 1. HERO ──────────────────────────────────────────────────────── */}
      <PageHero imageSrc={projectFitVisual} priority>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
          Angebot
        </p>
        <h1 className="mt-3 max-w-[22ch] text-[clamp(2.25rem,7vw+0.5rem,3.875rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-white text-balance">
          Bringen Sie Klarheit in wichtige Projekte.
        </h1>
        <p className="mt-6 max-w-[52ch] text-[clamp(1rem,1.5vw+0.5rem,1.175rem)] leading-relaxed text-white/80 text-balance">
          Ein strukturierter, unabhängiger Project Fit Check in wenigen Tagen —
          damit Sie wissen, wo Ihr Projekt wirklich steht und wie es weitergeht.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/termin"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-[#26337c] transition-all hover:bg-white/90 hover:scale-[1.02]"
          >
            Unverbindlichen Termin planen
          </Link>
          <Link
            href="#pakete"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/30 px-7 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/10"
          >
            Pakete ansehen
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M7 2v10M2 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </PageHero>

      {/* ── 2. WARNSIGNALE ───────────────────────────────────────────────── */}
      <MotionSection className="relative overflow-hidden bg-[#faf8f2]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 100% 50%, rgba(201,169,110,0.07) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-[1068px] px-6 py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20 lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                Früherkennung
              </p>
              <h2 className="mt-4 text-[clamp(1.625rem,3.5vw+0.5rem,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#1d1d1f]">
                5 Warnsignale, dass ein Projekt kritisch wird.
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-[#6e6e73]">
                Wenn 2 bis 3 davon erkennbar sind, lohnt sich ein genauer
                Blick — bevor aus Risiken Realität wird.
              </p>
              <Link
                href="/termin"
                className="mt-8 inline-flex items-center gap-3 text-[14px] font-semibold text-[#26337c] transition-all hover:gap-4"
              >
                Jetzt Termin vereinbaren
                <ArrowRight />
              </Link>
            </div>
            <ul className="flex flex-col gap-3" role="list">
              {warnsignale.map((signal, i) => (
                <li
                  key={signal}
                  className="group relative flex items-center gap-5 overflow-hidden rounded-2xl border border-[#c9a96e]/15 bg-white px-6 py-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c9a96e]/30 hover:shadow-[0_8px_32px_rgba(201,169,110,0.10)]"
                >
                  <span
                    className="shrink-0 text-[1.75rem] font-semibold leading-none tabular-nums"
                    style={{ color: `rgba(201,169,110,${0.25 + i * 0.15})` }}
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[16px] font-medium leading-snug text-[#1d1d1f]">
                    {signal}
                  </span>
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#c9a96e]/80 to-[#c9a96e]/20 transition-all duration-500 group-hover:w-full" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </MotionSection>

      {/* ── 3. HERAUSFORDERUNG + ERGEBNIS SPLIT ──────────────────────────── */}
      <div className="overflow-hidden md:grid md:grid-cols-2">
        {/* Challenge — dark navy */}
        <div className="relative bg-[#1a2260]">
          <div className="relative ml-auto max-w-[534px] px-8 py-14 md:px-12 md:py-20">
            <LCorner className="top-6 left-6 text-[#45b3e2]/30" />
            <div className="mb-6 h-[3px] w-10 rounded-full bg-[#45b3e2]/50" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
              Herausforderung
            </p>
            <h2 className="mt-3 text-[clamp(1.375rem,3vw+0.5rem,1.875rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-white">
              Viele Projekte laufen scheinbar nach Plan.
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-white/65">
              Doch unter der Oberfläche entstehen Risiken — oft schleichend
              und unsichtbar für das Management.
            </p>
            <ul className="mt-7 flex flex-col gap-3">
              {[
                "Unterschiedliche Wahrnehmung im Management",
                "Fehlende Transparenz über den tatsächlichen Fortschritt",
                "Kritische Themen werden zu spät sichtbar",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-white/60">
                  <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#45b3e2]/50" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 border-l-2 border-[#45b3e2]/25 pl-4 text-[15px] italic leading-relaxed text-white/40">
              Das Ergebnis: Verzögerungen, Kostensteigerungen und Unsicherheit.
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#26337c] via-[#45b3e2]/60 to-transparent" />
        </div>

        {/* Result — warm linen */}
        <div className="relative bg-[#faf8f2]">
          <div className="relative mr-auto max-w-[534px] px-8 py-14 md:px-12 md:py-20">
            <LCorner className="top-6 left-6 text-[#c9a96e]/40" />
            <div className="mb-6 h-[3px] w-10 rounded-full bg-[#c9a96e]/60" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
              Ergebnis
            </p>
            <h2 className="mt-3 text-[clamp(1.375rem,3vw+0.5rem,1.875rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-[#1d1d1f]">
              Sie erhalten konkrete Klarheit.
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-[#6e6e73]">
              Keine Beraterberichte, die im Regal verstauben — sondern eine
              klare Standortbestimmung mit konkretem Handlungsplan.
            </p>
            <ul className="mt-7 flex flex-col gap-4">
              {[
                { label: "Klare Standortbestimmung", sub: "Wo steht das Projekt wirklich?" },
                { label: "Transparenz über Risiken", sub: "Priorisiert nach Eintrittswahrscheinlichkeit" },
                { label: "Konkreter Massnahmenplan", sub: "30 / 60 / 90 Tage umsetzbar" },
                { label: "Klare Empfehlung", sub: "Continue, Stabilize oder Reset" },
              ].map(({ label, sub }) => (
                <li key={label} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c9a96e]/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c9a96e]" />
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold text-[#1d1d1f]">{label}</span>
                    <span className="text-[13px] text-[#86868b]">{sub}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#c9a96e]/60 via-[#c9a96e]/20 to-transparent" />
        </div>
      </div>

      {/* ── 4. 6 DIMENSIONEN ─────────────────────────────────────────────── */}
      <MotionSection className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.8fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                Ansatz
              </p>
              <h2 className="mt-4 text-[clamp(1.625rem,3.5vw+0.5rem,2.375rem)] font-semibold leading-[1.09] tracking-[-0.03em] text-[#1d1d1f]">
                Wir bewerten Ihr Projekt entlang von sechs Dimensionen.
              </h2>
              <div className="mt-7 h-px w-full bg-black/[0.06]" />
              <p className="mt-6 text-[15px] leading-relaxed text-[#6e6e73]">
                Jede Dimension wird mit einer Ampelbewertung versehen —
                Green, Yellow oder Red — und in den Gesamtkontext eingeordnet.
              </p>
              <div className="mt-8 flex items-center gap-4">
                {(["Green", "Yellow", "Red"] as const).map((status) => (
                  <span key={status} className="flex items-center gap-1.5 text-[13px] text-[#6e6e73]">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        background:
                          status === "Green" ? "#22c55e" : status === "Yellow" ? "#f59e0b" : "#ef4444",
                      }}
                    />
                    {status}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {dimensionen.map((dim, i) => (
                <div
                  key={dim.key}
                  className="group relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white px-6 py-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#26337c]/15 hover:shadow-[0_16px_48px_rgba(38,51,124,0.10)]"
                >
                  <LCorner className="top-3 right-3 text-[#c9a96e]/0 transition-colors duration-300 group-hover:text-[#c9a96e]" />
                  <span
                    className="pointer-events-none absolute -bottom-1 right-3 select-none text-[4.5rem] font-semibold leading-none text-[#c9a96e]/[0.06] transition-opacity duration-300 group-hover:opacity-50"
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#45b3e2]">
                    {dim.key}
                  </p>
                  <h3 className="relative mt-2 text-[17px] font-semibold leading-snug tracking-[-0.015em] text-[#1d1d1f]">
                    {dim.label}
                  </h3>
                  <p className="relative mt-2.5 text-[14px] leading-relaxed text-[#6e6e73]">
                    {dim.body}
                  </p>
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#26337c] to-[#45b3e2] transition-all duration-500 group-hover:w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </MotionSection>

      {/* ── 5. LIEFEROBJEKTE ─────────────────────────────────────────────── */}
      <MotionSection className="bg-white">
        <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20 lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                Lieferobjekte
              </p>
              <h2 className="mt-4 text-[clamp(1.625rem,3.5vw+0.5rem,2.375rem)] font-semibold leading-[1.09] tracking-[-0.03em] text-[#1d1d1f]">
                Was Sie konkret von uns erhalten.
              </h2>
              <div className="mt-7 h-px w-full bg-black/[0.06]" />
              <p className="mt-6 text-[15px] leading-relaxed text-[#6e6e73]">
                Alle Dokumente sind Management- und Board-ready: klar strukturiert,
                verdichtet auf das Wesentliche, direkt handlungsrelevant.
              </p>
            </div>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-black/[0.06] bg-black/[0.04] sm:grid-cols-2">
              {lieferobjekte.map((item) => (
                <div key={item.num} className="relative bg-white px-6 py-6">
                  <LCorner className="top-3 right-3 text-[#c9a96e]/20" />
                  <p className="text-[11px] font-semibold tabular-nums tracking-[0.14em] text-[#45b3e2]">
                    {item.num}
                  </p>
                  <h3 className="mt-3 text-[17px] font-semibold leading-snug tracking-[-0.015em] text-[#1d1d1f]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] text-[#86868b]">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MotionSection>

      {/* ── 6. EMPFEHLUNG: CONTINUE / STABILIZE / RESET ──────────────────── */}
      <section className="relative overflow-hidden bg-[#1a1f38]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 90% 60% at 50% 50%, rgba(38,51,124,0.6) 0%, transparent 70%)",
          }}
        />
        <MotionSection>
          <div className="relative mx-auto max-w-[1068px] px-6 py-16 md:py-28">
            <div className="flex items-baseline gap-4 border-b border-white/[0.08] pb-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#45b3e2]/70">
                Klare Empfehlung
              </p>
              <span className="text-[11px] text-white/30">3 mögliche Pfade</span>
            </div>
            <h2 className="mt-8 max-w-[32ch] text-[clamp(1.5rem,3.5vw+0.5rem,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
              Jeder Fit Check endet mit einer klaren Handlungsempfehlung.
            </h2>
            <div className="mt-12 grid gap-5 sm:grid-cols-3">
              {empfehlungen.map((e) => (
                <div
                  key={e.signal}
                  className="relative overflow-hidden rounded-2xl border px-7 py-8 backdrop-blur-sm"
                  style={{ borderColor: e.border, background: e.darkBg }}
                >
                  <p
                    className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                    style={{ color: e.color }}
                  >
                    → {e.signal}
                  </p>
                  <h3 className="mt-3 text-[20px] font-semibold leading-snug tracking-[-0.02em] text-white">
                    {e.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-white/55">{e.body}</p>
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[2px]"
                    style={{
                      background: `linear-gradient(to right, ${e.color}60, transparent)`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </MotionSection>
      </section>

      {/* ── 7. PAKETE / PRICING ───────────────────────────────────────────── */}
      <section id="pakete" className="bg-[#f5f5f7]">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-28">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
              Produktvarianten
            </p>
            <h2 className="mt-4 max-w-[28ch] text-[clamp(1.625rem,3.5vw+0.5rem,2.375rem)] font-semibold leading-[1.09] tracking-[-0.03em] text-[#1d1d1f]">
              Wählen Sie das passende Paket.
            </h2>
            <p className="mt-5 max-w-[52ch] text-[16px] leading-relaxed text-[#6e6e73]">
              Alle Pakete sind fix-preis und zeitlich klar begrenzt — keine versteckten Kosten,
              kein endloses Consulting.
            </p>
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {pakete.map((paket) => (
                <div
                  key={paket.name}
                  className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                    paket.bestseller
                      ? "border-[#26337c]/25 bg-white shadow-[0_8px_48px_rgba(38,51,124,0.12)]"
                      : "border-black/[0.07] bg-white hover:border-[#26337c]/15 hover:shadow-[0_16px_48px_rgba(38,51,124,0.08)]"
                  }`}
                >
                  {paket.bestseller && (
                    <div className="bg-gradient-to-r from-[#26337c] to-[#3550a4] px-6 py-2.5 text-center">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                        Best Seller
                      </span>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col px-7 pb-8 pt-7">
                    <LCorner className="top-4 right-4 text-[#c9a96e]/20 transition-colors duration-300 group-hover:text-[#c9a96e]/40" />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#45b3e2]">
                      {paket.dauer}
                    </p>
                    <h3 className="mt-2 text-[22px] font-semibold leading-snug tracking-[-0.025em] text-[#1d1d1f]">
                      {paket.name}
                    </h3>
                    <p className="mt-1 text-[13px] text-[#86868b]">{paket.fokus}</p>
                    <div className="my-6 h-px bg-black/[0.06]" />
                    <p className="text-[28px] font-semibold tracking-[-0.03em] text-[#1d1d1f]">
                      {paket.preis}
                    </p>
                    <p className="text-[12px] text-[#86868b]">exkl. MwSt.</p>
                    <ul className="mt-6 flex flex-1 flex-col gap-3">
                      {paket.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-[14px] leading-snug text-[#3c3c43]">
                          <span className="mt-[5px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#45b3e2]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      <Link
                        href="/termin"
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-full py-3 text-[14px] font-semibold transition-all hover:scale-[1.02] ${
                          paket.bestseller
                            ? "bg-[#26337c] text-white hover:bg-[#324891]"
                            : "border border-[#26337c]/25 text-[#26337c] hover:border-[#26337c]/50 hover:bg-[#26337c]/05"
                        }`}
                      >
                        Termin vereinbaren
                        <ArrowRight />
                      </Link>
                    </div>
                  </div>
                  <div
                    className={`absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#26337c] to-[#45b3e2] transition-all duration-500 group-hover:w-full ${paket.bestseller ? "w-full opacity-30" : ""}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </MotionSection>
      </section>

      {/* ── 8. WESHALB ABEXIS ────────────────────────────────────────────── */}
      <MotionSection className="bg-white">
        <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-24">
          <div className="grid gap-8 border-b border-black/[0.06] pb-12 md:grid-cols-[1fr_1fr] md:gap-20 md:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                Weshalb Abexis
              </p>
              <h2 className="mt-4 text-[clamp(1.625rem,3.5vw+0.5rem,2.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f]">
                Erfahrung, die den Unterschied macht.
              </h2>
            </div>
            <p className="text-[17px] leading-relaxed text-[#6e6e73] md:pb-1">
              Wir bringen nicht nur Methodik — sondern das Urteilsvermögen aus
              hunderten realer Projektsituationen in verschiedenen Branchen
              und Unternehmensstrukturen.
            </p>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2" role="list">
            {differenziierung.map((d, i) => (
              <li
                key={d}
                className="flex items-start gap-4 rounded-2xl border border-black/[0.06] bg-[#f5f5f7] px-6 py-5"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#26337c]/08 text-[11px] font-semibold tabular-nums text-[#26337c]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[15px] font-medium leading-snug text-[#1d1d1f]">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </MotionSection>

      {/* ── 9. CTA ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          aria-hidden
          style={{ background: "linear-gradient(115deg, #26337c 0%, #3550a4 45%, #45b3e2 100%)" }}
        />
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 80% at 15% 100%, rgba(201,169,110,0.14) 0%, transparent 50%), radial-gradient(ellipse 50% 60% at 90% 10%, rgba(255,255,255,0.07) 0%, transparent 45%)",
          }}
        />
        <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
                Nächster Schritt
              </p>
              <h2 className="mt-4 max-w-[30ch] text-[clamp(1.5rem,3.5vw+0.5rem,2.375rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white text-balance">
                Bereit für Klarheit in Ihrem Projekt?
              </h2>
              <p className="mt-5 max-w-[50ch] text-[16px] leading-relaxed text-white/65">
                In einem kostenlosen 30-Minuten-Erstgespräch besprechen wir Ihr Vorhaben
                und welches Paket am besten passt — unverbindlich und ohne Verpflichtung.
              </p>
              <div className="mt-7 flex flex-wrap gap-4">
                {["Kostenlos", "30 Minuten", "Unverbindlich", "Fixpreis"].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-1.5 text-[12px] font-medium text-white/70"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c9a96e]/70" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 md:shrink-0">
              <Link
                href="/termin"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 text-[14px] font-semibold text-[#26337c] shadow-lg transition-all hover:bg-white/90 hover:scale-[1.02]"
              >
                Jetzt Termin buchen
              </Link>
              <Link
                href={siteConfig.bookingUrlDe}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-8 text-[14px] font-semibold text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/10"
              >
                Online-Kalender öffnen
              </Link>
            </div>
          </div>
          <div className="mt-16 flex items-center gap-4 opacity-20">
            <div className="h-px flex-1 bg-white" />
            <div className="relative h-4 w-4">
              <div className="absolute top-0 left-0 h-4 w-px bg-white" />
              <div className="absolute top-0 left-0 h-px w-4 bg-white" />
            </div>
          </div>
        </div>
      </section>
    </InteriorPageRoot>
  );
}
