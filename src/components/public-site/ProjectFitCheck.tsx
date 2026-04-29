import Image from "next/image";
import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { PageHero } from "@/components/site/PageHero";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { BrandGrad } from "@/components/ui/BrandGrad";
import { homeHeroImage, prcChallengesInfographic, prcDimensionenModell, prcAblaufTimeline } from "@/data/site-images";
import { siteConfig } from "@/data/pages";

/** Same ambient layer as Leistungen / interior long-form pages (`apple-section-mesh` sits on the root). */
const SECTION_MESH_LIGHT =
  "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_-10%,rgba(38,51,124,0.11),transparent_50%),radial-gradient(ellipse_60%_50%_at_100%_50%,rgba(69,179,226,0.1),transparent_45%),linear-gradient(180deg,#fbfbfd_0%,#f0f3fb_40%,#fbfbfd_100%)]";

// ─── Static data ──────────────────────────────────────────────────────────────

/** Entspricht [abexis.ch/projectfitcheck](https://abexis.ch/projectfitcheck); Punkt 4 dort widerspricht «Was wir häufig sehen» : hier konsistent mit Unklarheit formuliert. */
const warnsignale = [
  "Entscheidungen werden vertagt",
  "Statusberichte werden «optimistisch»",
  "Risiken sind bekannt, aber nicht priorisiert",
  "Verantwortlichkeiten sind unklar",
  "Key Personen verlieren das Vertrauen",
  "Niemand hat den Gesamtüberblick",
] as const;

const herausforderungBullets = [
  "Entscheidungen werden vertagt",
  "Risiken sind bekannt, aber nicht priorisiert",
  "Verantwortlichkeiten sind unklar",
  "Probleme werden diskutiert, aber nicht gelöst",
] as const;

const ergebnisFolgen = [
  "Das Projekt bewegt sich, aber nicht wirklich vorwärts",
  "Das grösste Risiko ist nicht der Fehler, sondern die fehlende Klarheit",
] as const;

const ergebnisLieferung = [
  "Eine klare Einschätzung der aktuellen Situation",
  "Priorisierte Risiken",
  "Konkrete Handlungsempfehlungen",
  "Klar formulierter Entscheidungsbedarf",
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
  { id: "exec", title: "Executive Summary", sub: "Management und Board ready" },
  { id: "ampel", title: "Ampelbewertung", sub: "Green / Yellow / Red je Dimension" },
  { id: "risiken", title: "Top 10 Risiken", sub: "inkl. Eintrittswahrscheinlichkeit" },
  { id: "governance", title: "Governance Bewertung", sub: "Strukturen, Rollen und Entscheidungswege" },
  { id: "change", title: "Change Readiness Einschätzung", sub: "Organisatorische Einschätzung" },
  { id: "plan", title: "Konkreter Massnahmenplan", sub: "30 / 60 / 90 Tage" },
  { id: "empfehlung", title: "Klare Empfehlung", sub: "Continue · Stabilize · Reset" },
] as const;

const empfehlungen = [
  {
    key: "continue",
    titleClass: "text-[#7dd3fc]",
    barClass: "from-[#45b3e2]/70",
    title: "Weiterführen",
    body: "Das Projekt ist grundsätzlich auf Kurs. Identifizierte Punkte werden mit gezielten Massnahmen adressiert.",
  },
  {
    key: "stabilize",
    titleClass: "text-[#e8d4a8]",
    barClass: "from-[#c9a96e]/80",
    title: "Stabilisieren",
    body: "Wesentliche Risiken erfordern sofortige Massnahmen, bevor das Projekt in die nächste Phase übergeht.",
  },
  {
    key: "reset",
    titleClass: "text-[#fecaca]",
    barClass: "from-[#f0a8a8]/75",
    title: "Neu ausrichten",
    body: "Grundlegende Annahmen oder Strukturen müssen überarbeitet werden. Ein kontrollierter Neustart ist empfehlenswert.",
  },
] as const;

/**
 * Drei aufeinander aufbauende Phasen eines Project Reality Check : ein zusammenhängender Ablauf, keine isolierten «Produkte».
 * Inhalt gemäss [abexis.ch/projectfitcheck](https://abexis.ch/projectfitcheck).
 */
const prcPipelinePhasen = [
  {
    name: "Light",
    tagline: "Schnelle Standortbestimmung",
    dauer: "3-5 Tage",
    ziel: "Erste Klarheit",
    inhalt: [
      "Interviews (3-5 Schlüsselpersonen)",
      "High Level Analyse entlang 6 Dimensionen",
      "Erste Risikoeinschätzung",
    ],
    output: ["Kurzbewertung", "Top 3-5 kritische Punkte", "Erste Handlungsempfehlungen"],
  },
  {
    name: "Core",
    tagline: "Management Klarheit",
    dauer: "1-2 Wochen",
    ziel: "Entscheidungsbasis für das Management",
    inhalt: [
      "Strukturierte Analyse (6 Dimensionen)",
      "Interviews (5-10 Personen)",
      "Dokumentenreview",
      "Bewertung Risiken, Governance, Execution",
    ],
    output: [
      "Klare Lageeinschätzung",
      "Priorisierte Risiken",
      "Konkrete Massnahmen",
      "Entscheidungsbedarf klar formuliert",
    ],
  },
  {
    name: "Deep Dive",
    tagline: "Stabilisierung & Richtung",
    dauer: "3-4 Wochen",
    ziel: "Grundlage für Turnaround oder Neuausrichtung",
    inhalt: [
      "Vertiefte Analyse",
      "Workshops mit Management / Projektteam",
      "Konkrete Massnahmenplanung",
      "Governance-Empfehlungen",
    ],
    output: [
      "Vollständiges Lagebild",
      "Klare Prioritäten",
      "Konkrete Roadmap",
      "Vorschlag für nächste Schritte (inkl. Rollenbedarf)",
    ],
  },
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
      <PageHero imageSrc={homeHeroImage} priority>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">Project Reality Check</p>
        <h1 className="mt-3 max-w-[22rem] text-[clamp(1.75rem,6vw+0.35rem,3.5rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-balance sm:max-w-[28ch] sm:leading-[1.06]">
          <span className="text-white">Projekte laufen selten falsch</span>
          <br />
          <BrandGrad variant="dark" className="text-balance">
            aber oft in die falsche Richtung
          </BrandGrad>
        </h1>
        <p className="mt-5 max-w-[52ch] text-[clamp(0.9375rem,2.8vw+0.35rem,1.175rem)] leading-[1.55] text-white/88 text-balance sm:mt-6 sm:leading-relaxed">
          Der Abexis Project Reality Check zeigt in kurzer Zeit, wo Ihr Projekt wirklich steht und was jetzt entschieden
          werden muss.
        </p>
        <div className="mt-8 flex w-full max-w-lg flex-col gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href="/kontakt"
            className="inline-flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-full bg-brand-900 px-6 text-[15px] font-medium text-white shadow-lg shadow-brand-900/35 transition-all duration-200 ease-out hover:bg-[var(--brand-900-hover)] hover:shadow-xl hover:shadow-brand-500/25 hover:-translate-y-0.5 active:translate-y-0 sm:w-auto sm:min-h-[48px] sm:px-8 sm:text-[16px]"
          >
            Unverbindlichen Termin vereinbaren
          </Link>
          <Link
            href="#ablauf"
            className="inline-flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 text-[15px] font-medium text-white backdrop-blur-sm transition-all duration-200 ease-out hover:border-white/55 hover:bg-white/18 sm:w-auto sm:min-h-[48px] sm:px-7 sm:text-[16px]"
          >
            Ablauf ansehen
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M7 2v10M2 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </PageHero>

      {/* ── 2. WARNSIGNALE ───────────────────────────────────────────────── */}
      <MotionSection className="relative overflow-hidden">
        <div aria-hidden className={SECTION_MESH_LIGHT} />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_70%_at_100%_40%,rgba(201,169,110,0.08),transparent_55%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1068px] px-4 py-14 sm:px-6 sm:py-16 md:py-24">
          <div className="grid gap-10 sm:gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20 lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                Früherkennung
              </p>
              <h2 className="mt-4 text-[clamp(1.5rem,4.2vw+0.5rem,2.25rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-[#1d1d1f]">
                6 Warnsignale, dass ein Projekt kritisch wird.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#6e6e73] sm:mt-5 sm:text-[16px]">
                Wenn 2 bis 3 davon erkennbar sind, lohnt sich ein genauer Blick.
              </p>
              <Link
                href="/kontakt"
                className="mt-6 inline-flex min-h-11 touch-manipulation items-center gap-3 py-1 text-[14px] font-semibold text-brand-900 transition-all hover:gap-4 hover:text-brand-500 sm:mt-8"
              >
                Jetzt Termin vereinbaren
                <ArrowRight />
              </Link>
            </div>
            <ul className="flex flex-col gap-2.5 sm:gap-3" role="list">
              {warnsignale.map((signal, i) => (
                <li
                  key={signal}
                  className="group relative flex items-start gap-3 overflow-hidden rounded-2xl border border-black/[0.07] bg-white/90 px-4 py-4 shadow-[0_2px_12px_rgba(38,51,124,0.06)] backdrop-blur-sm transition-all duration-300 sm:items-center sm:gap-5 sm:px-6 sm:py-5 hover:-translate-y-0.5 hover:border-[#26337c]/12 hover:shadow-[0_12px_40px_rgba(38,51,124,0.10)]"
                >
                  <span
                    className="shrink-0 pt-0.5 text-[1.35rem] font-semibold leading-none tabular-nums sm:pt-0 sm:text-[1.75rem]"
                    style={{ color: `rgba(201,169,110,${0.25 + i * 0.15})` }}
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 text-[15px] font-medium leading-snug text-[#1d1d1f] sm:text-[16px]">
                    {signal}
                  </span>
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#c9a96e]/80 to-[#c9a96e]/20 transition-all duration-500 group-hover:w-full" />
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 sm:mt-14">
            <div className="overflow-hidden rounded-2xl border border-black/[0.07] shadow-[0_4px_24px_rgba(38,51,124,0.08)]">
              <Image
                src={prcChallengesInfographic}
                alt="Warum Projekte selten scheitern aber oft entgleisen : Übersicht der typischen Muster und wann ein externer Blick hilft"
                width={1536}
                height={1024}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </MotionSection>

      {/* ── 3. HERAUSFORDERUNG + ERGEBNIS SPLIT ──────────────────────────── */}
      <div className="overflow-hidden md:grid md:grid-cols-2">
        {/* Challenge : dark navy */}
        <div className="relative bg-[#1a2260]">
          <div className="relative ml-auto max-w-[534px] px-4 py-12 sm:px-8 sm:py-14 md:px-12 md:py-20">
            <LCorner className="top-5 left-4 text-[#45b3e2]/30 sm:top-6 sm:left-6" />
            <div className="mb-6 h-[3px] w-10 rounded-full bg-[#45b3e2]/50" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">Herausforderung</p>
            <h2 className="mt-3 text-[clamp(1.375rem,3vw+0.5rem,1.875rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-white">
              Viele Projekte wirken stabil, liefern aber nicht den erwarteten Impact.
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-white/88">
              Meetings finden statt, Statusberichte sehen gut aus : und trotzdem entsteht Unsicherheit.
            </p>
            <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">Was wir häufig sehen</p>
            <ul className="mt-4 flex flex-col gap-3">
              {herausforderungBullets.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-white/82">
                  <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#45b3e2]/70" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">Das Ergebnis</p>
            <ul className="mt-4 flex flex-col gap-2">
              {ergebnisFolgen.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] text-white/82">
                  <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#45b3e2]/60" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#26337c] via-[#45b3e2]/60 to-transparent" />
        </div>

        {/* Result : warm linen */}
        <div className="relative bg-[#faf8f2]">
          <div className="relative mr-auto max-w-[534px] px-4 py-12 sm:px-8 sm:py-14 md:px-12 md:py-20">
            <LCorner className="top-5 left-4 text-[#c9a96e]/40 sm:top-6 sm:left-6" />
            <div className="mb-6 h-[3px] w-10 rounded-full bg-[#c9a96e]/60" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Ergebnis</p>
            <h2 className="mt-3 text-[clamp(1.375rem,3vw+0.5rem,1.875rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-[#1d1d1f]">
              Das Ergebnis ist sofort nutzbar.
            </h2>
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">Sie erhalten</p>
            <ul className="mt-4 flex flex-col gap-3">
              {ergebnisLieferung.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c9a96e]/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c9a96e]" />
                  </span>
                  <span className="text-[15px] leading-snug text-[#1d1d1f]">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[15px] font-medium leading-relaxed text-[#6e6e73]">
              Damit Sie wissen, was zu tun ist : und was passiert, wenn nichts passiert.
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#c9a96e]/60 via-[#c9a96e]/20 to-transparent" />
        </div>
      </div>

      {/* ── 4. 6 DIMENSIONEN ─────────────────────────────────────────────── */}
      <MotionSection className="relative overflow-hidden">
        <div aria-hidden className={SECTION_MESH_LIGHT} />
        <div className="relative mx-auto max-w-[1068px] px-4 py-14 sm:px-6 sm:py-16 md:py-24">
          <div className="grid gap-8 sm:gap-10 lg:grid-cols-[1fr_1.8fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Ansatz</p>
              <h2 className="mt-4 text-[clamp(1.625rem,3.5vw+0.5rem,2.375rem)] font-semibold leading-[1.09] tracking-[-0.03em] text-[#1d1d1f]">
                Klarheit statt Vermutung
              </h2>
              <div className="mt-7 h-px w-full bg-black/[0.06]" />
              <p className="mt-6 text-[15px] leading-relaxed text-[#6e6e73]">
                Der Project Reality Check ist eine kurze, unabhängige Analyse auf Management-Ebene : ein strukturierter
                Reality Check mit Fokus auf Entscheidungen, Risiken und Steuerbarkeit.
              </p>
              <p className="mt-4 text-[15px] font-medium leading-relaxed text-[#1d1d1f]">
                Damit sichtbar wird, wo Ihr Projekt wirklich steht.
              </p>
              <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#86868b]">
                Abexis 6 Dimensionen : Methodik
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-[#6e6e73]">
                Jede Dimension wird mit einer Ampelbewertung (Green, Yellow, Red) in den Gesamtkontext eingeordnet.
                Methodik und Bewertungslogik bleiben über den gesamten Ablauf gleich; Umfang und Detailtiefe steigen von
                Phase zu Phase : von Light über Core bis Deep Dive.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
                {(
                  [
                    { status: "Green" as const, tone: "bg-[#5ab88a]" },
                    { status: "Yellow" as const, tone: "bg-[#d4a853]" },
                    { status: "Red" as const, tone: "bg-[#c97a7a]" },
                  ] as const
                ).map(({ status, tone }) => (
                  <span key={status} className="flex items-center gap-1.5 text-[13px] text-[#6e6e73]">
                    <span className={`h-2.5 w-2.5 rounded-full ring-1 ring-black/[0.06] ${tone}`} />
                    {status}
                  </span>
                ))}
              </div>

            </div>

            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-2">
              {dimensionen.map((dim) => (
                <div
                  key={dim.key}
                  className="group relative overflow-hidden rounded-2xl border border-black/[0.07] bg-white/95 px-5 py-5 backdrop-blur-sm transition-all duration-300 sm:px-6 sm:py-6 hover:-translate-y-1 hover:border-brand-900/15 hover:shadow-[0_16px_48px_rgba(38,51,124,0.10)]"
                >
                  <LCorner className="top-3 right-3 text-[#c9a96e]/0 transition-colors duration-300 group-hover:text-[#c9a96e]" />
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
      <MotionSection className="relative overflow-hidden border-y border-black/[0.05]">
        <div aria-hidden className={SECTION_MESH_LIGHT} />
        <div className="relative mx-auto max-w-[1068px] px-4 py-14 sm:px-6 sm:py-16 md:py-24">
          <div className="grid gap-8 sm:gap-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-16 lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Lieferobjekte</p>
              <h2 className="mt-4 text-[clamp(1.625rem,3.5vw+0.5rem,2.375rem)] font-semibold leading-[1.09] tracking-[-0.03em] text-[#1d1d1f]">
                Was Sie konkret erhalten
              </h2>
              <div className="mt-7 h-px w-full bg-black/[0.06]" />
              <p className="mt-6 text-[15px] leading-relaxed text-[#6e6e73]">
                Klar strukturiert, management- und board-tauglich : verdichtet auf das Wesentliche.
              </p>
            </div>
            <div className="relative max-w-xl lg:max-w-lg xl:max-w-xl">
              <ol className="relative m-0 flex list-none flex-col gap-3 p-0">
                {lieferobjekte.map((item, index) => (
                  <li
                    key={item.id}
                    className="flex gap-3 rounded-2xl border border-black/[0.06] bg-white/90 py-4 pl-5 pr-5 shadow-[0_1px_3px_rgba(38,51,124,0.05)] backdrop-blur-sm transition-[border-color,box-shadow] hover:border-black/10 hover:shadow-[0_6px_22px_rgba(38,51,124,0.07)] sm:gap-4 sm:py-5 sm:pl-6 sm:pr-6"
                  >
                    <span
                      className="mt-[0.4rem] flex h-2 w-2 shrink-0 rounded-full bg-[#45b3e2] ring-2 ring-white sm:mt-[0.45rem]"
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <span className="sr-only">
                        {index + 1}.{" "}
                      </span>
                      <h3 className="text-[16px] font-semibold leading-snug tracking-[-0.015em] text-[#1d1d1f] sm:text-[17px]">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-[#6e6e73] sm:text-[14px]">{item.sub}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="mt-10 overflow-hidden rounded-2xl border border-black/[0.07] shadow-[0_4px_20px_rgba(38,51,124,0.08)] sm:mt-12">
            <Image
              src={prcDimensionenModell}
              alt="Abexis 6 Dimensionen Modell : Strategy, Governance, Execution, Risks, Organisation & Change, Technology & Data"
              width={1024}
              height={1024}
              className="w-full"
            />
          </div>

          <div className="relative mt-10 flex justify-center border-t border-black/[0.06] px-1 pt-10 sm:mt-14 sm:pt-12">
            <Link
              href="/kontakt"
              className="inline-flex min-h-12 w-full max-w-md touch-manipulation items-center justify-center rounded-full bg-brand-900 px-6 text-[15px] font-medium text-white shadow-md shadow-brand-900/20 transition-all hover:bg-[var(--brand-900-hover)] sm:w-auto sm:max-w-none sm:px-8 sm:text-[16px]"
            >
              Unverbindlichen Termin vereinbaren
            </Link>
          </div>
        </div>
      </MotionSection>

      {/* ── 6. EMPFEHLUNG: CONTINUE / STABILIZE / RESET (navy wie Fokus-Split) ─ */}
      <section className="relative overflow-hidden bg-[#1a2260]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_0%,rgba(69,179,226,0.14),transparent_58%),radial-gradient(ellipse_50%_40%_at_100%_100%,rgba(201,169,110,0.08),transparent_45%)]"
          aria-hidden
        />
        <MotionSection>
          <div className="relative mx-auto max-w-[1068px] px-4 py-14 sm:px-6 sm:py-16 md:py-28">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-white/10 pb-5 sm:pb-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#45b3e2]/85">
                Klare Empfehlung
              </p>
              <span className="text-[11px] text-white/40">3 mögliche Pfade</span>
            </div>
            <h2 className="mt-6 max-w-[34ch] text-[clamp(1.375rem,3.2vw+0.5rem,2.25rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-white sm:mt-8 sm:leading-[1.1]">
              Jeder Project Reality Check endet mit einer klaren Handlungsempfehlung.
            </h2>
            <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-5">
              {empfehlungen.map((e) => (
                <div
                  key={e.key}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-6 backdrop-blur-[2px] sm:px-7 sm:py-8"
                >
                  <h3
                    className={`text-[20px] font-semibold leading-snug tracking-[-0.02em] sm:text-[22px] ${e.titleClass}`}
                  >
                    {e.title}
                  </h3>
                  <p className="mt-4 text-[14px] leading-relaxed text-white/60">{e.body}</p>
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r ${e.barClass} to-transparent`}
                  />
                </div>
              ))}
            </div>
          </div>
        </MotionSection>
      </section>

      {/* ── 7. ABLAUF : zusammenhängende Pipeline (Light → Core → Deep Dive) ─ */}
      <section id="ablauf" className="relative overflow-hidden scroll-mt-24 sm:scroll-mt-28">
        <div aria-hidden className={SECTION_MESH_LIGHT} />
        <MotionSection>
          <div className="relative mx-auto max-w-[1068px] px-4 py-14 sm:px-6 sm:py-16 md:py-28">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
              Abexis Project Reality Check
            </p>
            <h2 className="mt-3 max-w-[40ch] text-[clamp(1.5rem,4vw+0.5rem,2.375rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#1d1d1f] sm:mt-4 sm:leading-[1.09]">
              Ablauf: drei Phasen, ein zusammenhängender Prozess
            </h2>
            <p className="mt-4 max-w-[56ch] text-[15px] leading-[1.55] text-[#6e6e73] sm:mt-5 sm:text-[16px] sm:leading-relaxed">
              Light, Core und Deep Dive sind keine alternativen «Pakete», sondern die aufeinander aufbauenden Stufen
              desselben Reality Check — von der ersten Einordnung bis zur vertieften Entscheidungs- und Umsetzungsgrundlage.
              Umfang und Investition klären wir im Erstgespräch; in der Regel als Fixpreis, ohne versteckte Folgekosten.
            </p>

            <div className="mt-10 sm:mt-12">
              <div className="overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-[0_4px_20px_rgba(38,51,124,0.07)] p-4 sm:p-6">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">Beispielhafter Ablauf : Core Phase</p>
                <Image
                  src={prcAblaufTimeline}
                  alt="Ablauf Project Reality Check: Tag 1 Kickoff & Dokumentenanalyse, Tag 2-3 Interviews, Tag 4 Analyse & Bewertung, Tag 5 Executive Präsentation"
                  width={1597}
                  height={237}
                  className="w-full"
                />
              </div>
            </div>

            <div className="relative mx-auto mt-10 max-w-3xl sm:mt-14">
              <ol className="relative m-0 flex list-none flex-col gap-6 p-0 sm:gap-8 md:gap-10">
                {prcPipelinePhasen.map((phase, index) => {
                  const step = index + 1;
                  return (
                    <li key={phase.name}>
                      <article className="rounded-2xl border border-black/[0.07] bg-white/95 py-5 pl-4 pr-4 shadow-[0_2px_12px_rgba(38,51,124,0.06)] backdrop-blur-sm sm:py-6 sm:pl-5 sm:pr-5 md:px-8 md:py-7">
                        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 md:gap-5">
                          <span
                            className="flex h-8 w-8 shrink-0 items-center justify-center self-start rounded-full border-2 border-white bg-brand-900 text-[12px] font-semibold tabular-nums text-white shadow-md"
                            aria-hidden
                          >
                            {step}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#45b3e2] sm:text-[11px] sm:tracking-[0.18em]">
                              Phase {step} · {phase.dauer}
                            </p>
                            <h3 className="mt-1.5 text-[clamp(1.0625rem,2.5vw+0.35rem,1.375rem)] font-semibold leading-snug tracking-[-0.02em] text-[#1d1d1f] sm:mt-2">
                              {phase.name}{" "}
                              <span className="block font-normal text-[#6e6e73] sm:inline sm:font-normal">
                                : {phase.tagline}
                              </span>
                            </h3>
                            <p className="mt-2 text-[14px] font-medium leading-snug text-[#26337c] sm:mt-3 sm:text-[15px]">
                              Ziel: {phase.ziel}
                            </p>
                          </div>
                        </div>
                        <div className="mt-5 grid gap-6 sm:mt-6 sm:grid-cols-2 sm:gap-8 md:gap-10">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#86868b]">Inhalt</p>
                            <ul className="mt-3 flex flex-col gap-2.5">
                              {phase.inhalt.map((item) => (
                                <li
                                  key={item}
                                  className="flex items-start gap-2.5 text-[14px] leading-snug text-[#3c3c43]"
                                >
                                  <span className="mt-[5px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#45b3e2]" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#86868b]">Output</p>
                            <ul className="mt-3 flex flex-col gap-2.5">
                              {phase.output.map((item) => (
                                <li
                                  key={item}
                                  className="flex items-start gap-2.5 text-[14px] leading-snug text-[#3c3c43]"
                                >
                                  <span className="mt-[5px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#c9a96e]/85" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ol>
              <div className="mt-2 flex flex-col items-center gap-3 border-t border-black/[0.06] px-1 pt-8 sm:pt-10">
                <p className="max-w-md text-center text-[14px] leading-relaxed text-[#6e6e73]">
                  Wir stimmen den genauen Umfang und die Dauer mit Ihnen ab : als durchgängiger Ablauf, nicht als
                  isolierte Bausteine.
                </p>
                <Link
                  href="/kontakt"
                  className="inline-flex min-h-12 w-full max-w-md touch-manipulation items-center justify-center gap-2 rounded-full bg-brand-900 px-6 text-[15px] font-medium text-white shadow-lg shadow-brand-900/25 transition-all duration-200 ease-out hover:bg-[var(--brand-900-hover)] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 sm:w-auto sm:max-w-none sm:px-8 sm:text-[16px]"
                >
                  Termin vereinbaren
                  <ArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </MotionSection>
      </section>

      {/* ── 8. CTA : gleiche Oberfläche wie Home-Abschluss (`abexis-hero-gradient-surface`) ─ */}
      <section className="px-[max(1rem,env(safe-area-inset-left,0px))] py-12 pr-[max(1rem,env(safe-area-inset-right,0px))] sm:px-6 sm:py-16 md:py-24">
        <div className="mx-auto max-w-[1068px]">
          <div className="abexis-hero-gradient-surface relative overflow-hidden rounded-[20px] px-4 py-8 sm:rounded-[24px] sm:px-8 sm:py-12 md:rounded-[32px] md:px-12 md:py-16">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 18% 22%, rgba(255,255,255,0.38), transparent 42%), radial-gradient(circle at 82% 78%, rgba(69,179,226,0.45), transparent 45%), linear-gradient(160deg, rgba(38,51,124,0.2), transparent 55%)",
              }}
            />
            <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center md:gap-10">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">Nächster Schritt</p>
                <h2 className="mt-3 max-w-[32ch] text-[clamp(1.375rem,3.2vw+0.5rem,2.25rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-white text-balance sm:mt-4 sm:leading-[1.1] md:max-w-[36ch]">
                  Lassen Sie uns kurz darauf schauen
                </h2>
                <p className="mt-4 max-w-[50ch] text-[15px] leading-[1.55] text-white/88 sm:mt-5 sm:text-[16px] sm:leading-relaxed md:text-[17px]">
                  In einem kurzen Gespräch klären wir, ob ein Project Reality Check sinnvoll ist und wo Ihr Projekt aktuell
                  steht : unverbindlich.
                </p>
                <div className="mt-5 flex flex-wrap gap-2 sm:mt-7 sm:gap-3">
                  {["Kostenlos", "Kurzes Gespräch", "Unverbindlich", "Modular"].map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white/85 sm:px-4 sm:text-[12px]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#c9a96e]/90" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex w-full flex-col gap-3 md:w-auto md:shrink-0 md:min-w-[240px]">
                <Link
                  href="/kontakt"
                  className="inline-flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-medium text-brand-900 shadow-lg shadow-brand-900/20 transition-all duration-200 ease-out hover:bg-white hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 sm:px-8 sm:text-[16px]"
                >
                  Unverbindlichen Termin vereinbaren
                </Link>
                <Link
                  href={siteConfig.bookingUrlDe}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 text-[15px] font-medium text-white backdrop-blur-sm transition-all hover:border-white/55 hover:bg-white/15 sm:px-8 sm:text-[16px]"
                >
                  Online-Kalender öffnen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </InteriorPageRoot>
  );
}
