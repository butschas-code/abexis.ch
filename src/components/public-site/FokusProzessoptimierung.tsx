import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { HeroProjectRealityCheckCta } from "@/components/site/HeroProjectRealityCheckCta";
import { PageHero } from "@/components/site/PageHero";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { fokusPageHeroImages } from "@/data/site-images";
import { fokusthemenMeta, siteConfig } from "@/data/pages";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";

// ─── Static data : module level, no re-allocation ────────────────────────────

const meta = fokusthemenMeta.find((m) => m.slug === "prozessoptimierung")!;
const heroImage = fokusPageHeroImages["prozessoptimierung"];
const contentImage = "https://firebasestorage.googleapis.com/v0/b/abexis-cms.firebasestorage.app/o/cms%2Fmedia%2Fmigrated%2Fb738bd96-1957-43aa-8025-8980b84673c6.jpg?alt=media";

const handlungsfelder = [
  {
    num: "01",
    title: "Prozessanalyse & Diagnose",
    items: [
      "Bestehende Prozesse erfassen, visualisieren und bewerten",
      "Ineffizienzen, Redundanzen und Medienbrüche aufdecken",
      "Priorisierung nach Kosten, Risiko und Optimierungspotenzial",
    ],
  },
  {
    num: "02",
    title: "Lean & Wertstromdesign",
    items: [
      "Wertstrom-Analyse: wertschöpfende vs. nicht-wertschöpfende Aktivitäten",
      "Verschwendung systematisch identifizieren und eliminieren",
      "Flussoptimierung und Durchlaufzeiten verkürzen",
    ],
  },
  {
    num: "03",
    title: "Prozessautomatisierung",
    items: [
      "Automatisierungspotenziale realistisch bewerten",
      "RPA, Workflow-Systeme und KI-gestützte Lösungen prüfen",
      "Implementierung schrittweise und risikoarm gestalten",
    ],
  },
  {
    num: "04",
    title: "Kostenoptimierung",
    items: [
      "Kostentreiber in Prozessen transparent machen",
      "Einsparpotenziale quantifizieren und priorisieren",
      "Massnahmen ohne Qualitätsverlust umsetzen",
    ],
  },
  {
    num: "05",
    title: "Prozessdesign & Standardisierung",
    items: [
      "Soll-Prozesse gemeinsam mit Fachbereichen entwickeln",
      "Standards, Vorlagen und Prozessdokumentation etablieren",
      "Einheitliche Vorgehensweisen über Einheiten hinweg sicherstellen",
    ],
  },
  {
    num: "06",
    title: "Schnittstellen & Integration",
    items: [
      "Übergabepunkte zwischen Abteilungen und Systemen klären",
      "Reibungsverluste an Schnittstellen gezielt reduzieren",
      "End-to-End-Sicht über Bereichsgrenzen hinweg etablieren",
    ],
  },
  {
    num: "07",
    title: "Prozess-Monitoring & KVP",
    items: [
      "Kennzahlen zur Prozesskontrolle definieren und einführen",
      "Kontinuierlichen Verbesserungsprozess (KVP) verankern",
      "Prozessverantwortung klar zuweisen und leben",
    ],
  },
] as const;

const prozessphasen = [
  {
    num: "01",
    title: "Analyse & Aufnahme",
    items: [
      "Prozesslandschaft erfassen und priorisieren",
      "Schnittstellen, Systeme und Verantwortlichkeiten klären",
      "Einsparpotenziale und Schmerzpunkte identifizieren",
      "Handlungsfelder gemeinsam bewerten",
    ],
  },
  {
    num: "02",
    title: "Konzept & Design",
    items: [
      "Soll-Prozesse entwickeln und modellieren",
      "Automatisierungsoptionen prüfen und einplanen",
      "Business Case für Massnahmen aufstellen",
      "Umsetzungsroadmap priorisieren",
    ],
  },
  {
    num: "03",
    title: "Implementierung",
    items: [
      "Prozessänderungen schrittweise einführen",
      "Betroffene befähigen und Akzeptanz sicherstellen",
      "Systeme, Tools und Dokumentation aufschalten",
      "Pilotläufe durchführen und nachschärfen",
    ],
  },
  {
    num: "04",
    title: "Messen & Verstetigen",
    items: [
      "Ergebnisse messen und mit Zielbild abgleichen",
      "KVP-Strukturen einrichten und übergeben",
      "Prozessverantwortung intern verankern",
    ],
  },
] as const;

const nutzen = [
  {
    num: "01",
    title: "Kostensenkung",
    body: "Schlanke Prozesse reduzieren Aufwände, vermeiden Doppelarbeit und senken operative Kosten nachhaltig.",
  },
  {
    num: "02",
    title: "Höhere Qualität",
    body: "Standardisierte, klar definierte Prozesse minimieren Fehler und erhöhen die Verlässlichkeit der Ergebnisse.",
  },
  {
    num: "03",
    title: "Schnelligkeit",
    body: "Kürzere Durchlaufzeiten und weniger Wartezeiten erhöhen die Reaktionsfähigkeit gegenüber Kunden und Märkten.",
  },
  {
    num: "04",
    title: "Transparenz",
    body: "Sichtbare Prozesse und klare Verantwortlichkeiten machen Steuerung einfacher und Entscheidungen fundierter.",
  },
  {
    num: "05",
    title: "Skalierbarkeit",
    body: "Optimierte und automatisierte Prozesse wachsen mit : ohne proportional mehr Personal zu erfordern.",
  },
  {
    num: "06",
    title: "Mitarbeiterzufriedenheit",
    body: "Weniger Reibung, klarere Abläufe und sinnvolle Automatisierung entlasten Teams von repetitiven Aufgaben.",
  },
  {
    num: "07",
    title: "Compliance & Sicherheit",
    body: "Dokumentierte, kontrollierte Prozesse erleichtern das Einhalten von Vorschriften und Auditanforderungen.",
  },
  {
    num: "08",
    title: "Wettbewerbsfähigkeit",
    body: "Operative Exzellenz ist ein nachhaltiger Vorteil : besonders wenn Margen sinken und Geschwindigkeit zählt.",
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

type Handlungsfeld = (typeof handlungsfelder)[number];

function SpineCard({ item }: { item: Handlungsfeld }) {
  return (
    <div className="group relative h-full overflow-hidden rounded-2xl border border-black/[0.06] bg-white px-6 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#26337c]/15 hover:shadow-[0_16px_48px_rgba(38,51,124,0.10)]">
      <LCorner className="top-3 right-3 text-[#c9a96e]/0 transition-colors duration-300 group-hover:text-[#c9a96e]" />
      <span
        className="pointer-events-none absolute -bottom-2 right-3 select-none text-[5rem] font-semibold leading-none tabular-nums text-[#c9a96e]/[0.08] transition-opacity duration-300 group-hover:opacity-50"
        aria-hidden
      >
        {item.num}
      </span>
      <h3 className="relative text-[17px] font-semibold leading-snug tracking-[-0.015em] text-[#1d1d1f]">
        {item.title}
      </h3>
      <ul className="relative mt-3 flex flex-col gap-2">
        {item.items.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2.5 text-[15px] leading-snug text-[#6e6e73]">
            <span className="mt-[5px] h-[4px] w-[4px] shrink-0 rounded-full bg-[#45b3e2]" />
            {bullet}
          </li>
        ))}
      </ul>
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#26337c] to-[#45b3e2] transition-all duration-500 group-hover:w-full" />
    </div>
  );
}

// ─── Page component ───────────────────────────────────────────────────────────

export function FokusProzessoptimierung() {
  return (
    <InteriorPageRoot>
      <SchemaMarkup type="Service" data={meta} />
      <SchemaMarkup
        type="BreadcrumbList"
        data={[
          { name: "Startseite", url: "/" },
          { name: "Leistungen", url: "/leistungen" },
          { name: meta.title, url: "/fokusthemen/prozessoptimierung" },
        ]}
      />

      {/* ── 1. HERO ──────────────────────────────────────────────────────── */}
      <PageHero imageSrc={heroImage} priority>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
          {meta.subtitle}
        </p>
        <h1 className="mt-3 max-w-[22ch] text-[clamp(2.25rem,7vw+0.5rem,3.875rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-white text-balance">
          Wenn Prozesse wachsen, aber nicht atmen : zahlt das Unternehmen dafür.
        </h1>
        <p className="mt-6 max-w-[50ch] text-[clamp(1rem,1.5vw+0.5rem,1.175rem)] leading-relaxed text-white/80 text-balance">
          Gewachsene Strukturen, ungeklärte Schnittstellen und manuelle Umwege kosten täglich
          Zeit, Geld und Motivation. Wir helfen Ihnen, Prozesse zu durchleuchten, zu
          straffen und dort zu automatisieren, wo es echten Mehrwert bringt.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <HeroProjectRealityCheckCta />
          <Link
            href="/kontakt"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-[#26337c] transition-all hover:bg-white/90 hover:scale-[1.02]"
          >
            30-Minuten-Erstgespräch
          </Link>
          <Link
            href="#handlungsfelder"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/30 px-7 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/10"
          >
            Handlungsfelder
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M7 2v10M2 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </PageHero>

      {/* ── 2. SPLIT PANEL : Optimierung vs. Automatisierung ─────────────── */}
      <MotionSection>
        <div className="overflow-hidden md:grid md:grid-cols-2">
          {/* Left half : warm linen */}
          <div className="relative bg-[#faf8f2]">
            <div className="relative ml-auto max-w-[534px] px-8 py-14 md:px-12 md:py-20">
              <LCorner className="top-6 left-6 text-[#c9a96e]/40" />
              <div className="mb-6 h-[3px] w-10 rounded-full bg-[#c9a96e]/60" />
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                Ansatz 1
              </h2>
              <h3 className="mt-3 text-[clamp(1.375rem,3vw+0.5rem,1.875rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-[#1d1d1f]">
                Prozessoptimierung
              </h3>
              <p className="mt-5 text-[16px] leading-relaxed text-[#6e6e73]">
                Analysiert bestehende Abläufe und entfernt, was keinen Wert schafft: Wartezeiten,
                Doppelarbeit, Medienbrüche, ungeklärte Zuständigkeiten. Das Ziel ist ein
                schlanker, transparenter Prozess : mit oder ohne Technologie.
              </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#c9a96e]/60 via-[#c9a96e]/20 to-transparent" />
          </div>

          {/* Right half : navy */}
          <div className="relative bg-[#1a2260]">
            <div className="relative mr-auto max-w-[534px] px-8 py-14 md:px-12 md:py-20">
              <LCorner className="top-6 left-6 text-[#45b3e2]/30" />
              <div className="mb-6 h-[3px] w-10 rounded-full bg-[#45b3e2]/50" />
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
                Ansatz 2
              </h2>
              <h3 className="mt-3 text-[clamp(1.375rem,3vw+0.5rem,1.875rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-white">
                Prozessautomatisierung
              </h3>
              <p className="mt-5 text-[16px] leading-relaxed text-white/65">
                Nutzt Technologie, um repetitive, regelbasierte Aufgaben maschinell auszuführen.
                Wirksam : aber nur dort, wo der Prozess bereits sauber ist. Automatisierung
                eines schlechten Prozesses erzeugt nur schnellere Fehler.
              </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#26337c] via-[#45b3e2]/60 to-transparent" />
          </div>
        </div>
      </MotionSection>

      {/* ── 3. HANDLUNGSFELDER ───────────────────────────────────────────── */}
      <section id="handlungsfelder" className="bg-[#f5f5f7]">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-24">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.8fr] lg:gap-16">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <h2 className="text-[clamp(1.625rem,3.5vw+0.5rem,2.375rem)] font-semibold leading-[1.09] tracking-[-0.03em] text-[#1d1d1f]">
                  Sieben Hebel für operative Exzellenz.
                </h2>
                <div className="mt-7 h-px w-full bg-black/[0.06]" />
                <p className="mt-6 text-[15px] leading-relaxed text-[#6e6e73]">
                  Prozessoptimierung wirkt auf mehreren Ebenen. Wir helfen Ihnen, die richtigen
                  Ansatzpunkte zu finden : und konsequent umzusetzen.
                </p>
                <Link
                  href="/kontakt"
                  className="mt-8 inline-flex items-center gap-3 text-[14px] font-semibold text-[#26337c] transition-all hover:gap-4"
                >
                  Beratungsgespräch anfragen
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>

              <div>
                <div className="hidden lg:block">
                  <div className="relative">
                    <div
                      className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px"
                      style={{
                        background:
                          "linear-gradient(to bottom, rgba(201,169,110,0.05), rgba(201,169,110,0.25) 8%, rgba(201,169,110,0.25) 92%, rgba(201,169,110,0.05))",
                      }}
                    />
                    <div className="space-y-8">
                      {handlungsfelder.map((item, i) => {
                        const isLeft = i % 2 === 0;
                        return (
                          <div key={item.num} className="relative grid grid-cols-2">
                            <div className="absolute left-1/2 top-5 z-10 -translate-x-1/2">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a96e]/40 bg-white text-[11px] font-semibold tabular-nums text-[#26337c] shadow-sm">
                                {item.num}
                              </div>
                            </div>
                            <div className="pr-10">{isLeft ? <SpineCard item={item} /> : null}</div>
                            <div className="pl-10">{!isLeft ? <SpineCard item={item} /> : null}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 lg:hidden">
                  {handlungsfelder.map((item) => (
                    <SpineCard key={item.num} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </MotionSection>
      </section>

      {/* ── BPMN DIAGRAM : Beispiel Prozessvisualisierung ────────────────── */}
      <section className="bg-white">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-24">
            <div className="grid gap-8 border-b border-black/[0.06] pb-10 md:grid-cols-[1fr_1fr] md:gap-16 md:items-end">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                  Methodik
                </p>
                <h2 className="mt-4 text-[clamp(1.5rem,3vw+0.5rem,2.125rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#1d1d1f]">
                  Prozesse sichtbar machen : als Grundlage jeder Verbesserung.
                </h2>
              </div>
              <p className="text-[16px] leading-relaxed text-[#6e6e73] md:pb-1">
                Was nicht visualisiert ist, kann nicht verbessert werden. Wir erfassen Prozesse
                in strukturierten Modellen : von einfachen Ablaufdiagrammen bis zu detaillierten
                BPMN-Darstellungen mit Swimlanes und Entscheidungspunkten.
              </p>
            </div>

            <div className="mt-10 overflow-hidden rounded-2xl border border-black/[0.07] bg-[#f5f5f7] p-6 md:p-10">
              <img
                src={contentImage}
                alt="Beispiel BPMN-Prozessdiagramm mit Swimlanes"
                className="mx-auto w-full max-w-[880px] object-contain"
                loading="lazy"
              />
              <p className="mt-5 text-center text-[12px] text-[#86868b]">
                Beispiel: BPMN-Prozessmodell mit Swimlanes : Rollen, Entscheidungen und Übergaben auf einen Blick
              </p>
            </div>
          </div>
        </MotionSection>
      </section>

      {/* ── 4. PULL QUOTE ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#1a1f38]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 90% 60% at 50% 50%, rgba(38,51,124,0.6) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-[800px] px-6 py-20 text-center md:py-32">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c9a96e]/60">
            Grundsatz
          </p>
          <blockquote className="mt-8 text-[clamp(1.375rem,3.5vw+0.5rem,2.25rem)] font-semibold leading-[1.22] tracking-[-0.025em] text-white text-balance">
            &ldquo;Operative Exzellenz entsteht nicht durch Technologie allein : sie entsteht
            durch das konsequente Hinterfragen jedes Schritts, der keinen Wert schafft.
            Erst der saubere Prozess, dann die Automatisierung.&rdquo;
          </blockquote>
          <div className="mt-10 flex items-center justify-center gap-5">
            <div className="h-px w-12 bg-[#c9a96e]/35" />
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/30">
              Abexis Operations-Prinzip
            </span>
            <div className="h-px w-12 bg-[#c9a96e]/35" />
          </div>
        </div>
      </section>

      {/* ── 5. PROZESSPHASEN ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#1a1f38]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 15% 50%, rgba(69,179,226,0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 70% at 85% 30%, rgba(38,51,124,0.4) 0%, transparent 60%)",
          }}
        />
        <MotionSection>
          <div className="relative mx-auto max-w-[1068px] px-6 py-16 md:py-28">
            <div className="flex items-baseline gap-4 border-b border-white/[0.08] pb-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#45b3e2]/70">
                Vorgehensmodell
              </p>
              <span className="text-[11px] text-white/30">04 Phasen</span>
            </div>
            <h2 className="mt-8 max-w-[28ch] text-[clamp(1.5rem,3.5vw+0.5rem,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
              Von der Prozessaufnahme zur messbaren Verbesserung : strukturiert und nachhaltig.
            </h2>
            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-4">
              {prozessphasen.map((phase, i) => (
                <div key={phase.num} className="relative flex flex-col bg-[#1a1f38]/60 px-6 py-8 backdrop-blur-sm">
                  <p
                    className="text-[3rem] font-semibold leading-none tracking-[-0.05em]"
                    style={{ color: `rgba(201,169,110,${0.35 + i * 0.15})` }}
                  >
                    {phase.num}
                  </p>
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
                    {phase.title}
                  </p>
                  <ul className="mt-4 flex flex-col gap-2">
                    {phase.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[13px] text-white/65">
                        <span className="mt-[5px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#45b3e2]/50" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-8">
                    <div className="h-px w-6 bg-[#c9a96e]/40" />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 max-w-[60ch] text-[15px] leading-relaxed text-white/50">
              Wir arbeiten pragmatisch: Scope und Tiefe richten sich nach Ihrer Ausgangslage.
              Ob punktuelle Optimierung eines kritischen Prozesses oder systematisches
              Programm : der Ansatz bleibt faktenbasiert, umsetzungsorientiert und messbar.
            </p>
          </div>
        </MotionSection>
      </section>

      {/* ── 6. NUTZEN ────────────────────────────────────────────────────── */}
      <section className="bg-[#f5f5f7]">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-28">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.8fr] lg:gap-20 lg:items-start">
              <div className="lg:sticky lg:top-28">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                  Nutzen
                </p>
                <h2 className="mt-4 text-[clamp(1.625rem,3.5vw+0.5rem,2.375rem)] font-semibold leading-[1.09] tracking-[-0.03em] text-[#1d1d1f]">
                  Was schlanke Prozesse einem Unternehmen bringen.
                </h2>
                <div className="mt-7 h-px w-full bg-black/[0.06]" />
                <p className="mt-6 text-[15px] leading-relaxed text-[#6e6e73]">
                  Prozessoptimierung ist keine Sparübung : sie ist eine Investition in
                  Geschwindigkeit, Qualität und die Fähigkeit zu skalieren.
                </p>
                <Link
                  href="/kontakt"
                  className="mt-8 inline-flex items-center gap-3 text-[14px] font-semibold text-[#26337c] transition-all hover:gap-4"
                >
                  Unverbindliches Gespräch
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
              <div className="grid gap-px overflow-hidden rounded-2xl border border-black/[0.06] bg-black/[0.04] sm:grid-cols-2">
                {nutzen.map((n) => (
                  <div key={n.num} className="relative bg-white px-6 py-6">
                    <LCorner className="top-3 right-3 text-[#c9a96e]/20" />
                    <p className="text-[11px] font-semibold tabular-nums tracking-[0.14em] text-[#45b3e2]">
                      {n.num}
                    </p>
                    <h3 className="mt-3 text-[17px] font-semibold leading-snug tracking-[-0.015em] text-[#1d1d1f]">
                      {n.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-[#6e6e73]">{n.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </MotionSection>
      </section>

      {/* ── 7. UNSERE ROLLE ──────────────────────────────────────────────── */}
      <section className="bg-white">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-28">
            <div className="grid gap-8 border-b border-black/[0.06] pb-12 md:grid-cols-[1fr_1fr] md:gap-20 md:items-end">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                  Unsere Rolle
                </p>
                <h2 className="mt-4 text-[clamp(1.625rem,3.5vw+0.5rem,2.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f]">
                  Der externe Blick, der Vertrautes in Frage stellt.
                </h2>
              </div>
              <p className="text-[17px] leading-relaxed text-[#6e6e73] md:pb-1">
                Wer täglich in einem Prozess arbeitet, sieht ihn kaum noch. Wir bringen die
                Distanz, die Methodik und die Erfahrung aus verschiedensten Branchen mit : und
                stellen die Fragen, die intern niemand mehr stellt.
              </p>
            </div>
            <div className="mt-12">
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                Typische Ausgangssituationen
              </p>
              <div className="grid gap-px overflow-hidden rounded-2xl border border-black/[0.06] bg-black/[0.04] sm:grid-cols-3">
                {[
                  {
                    num: "01",
                    title: "Wachstum hat Prozesse überholt",
                    body: "Was in kleineren Strukturen funktionierte, erzeugt heute Reibung, Fehler und Verzögerungen. Die Prozesse müssen mit dem Unternehmen mitwachsen.",
                  },
                  {
                    num: "02",
                    title: "Kostendruck erfordert Effizienz",
                    body: "Sinkende Margen oder steigender Wettbewerb zwingen dazu, operativen Aufwand zu reduzieren : ohne Qualität und Lieferfähigkeit zu gefährden.",
                  },
                  {
                    num: "03",
                    title: "Automatisierung will geplant sein",
                    body: "Die Technologie ist vorhanden, aber unklar ist, welche Prozesse sich wirklich eignen und wo der Business Case überzeugend ist.",
                  },
                ].map((s) => (
                  <div key={s.num} className="relative bg-white px-7 py-8">
                    <LCorner className="top-4 right-4 text-[#c9a96e]/30" />
                    <p className="text-[11px] font-semibold tabular-nums tracking-[0.14em] text-[#45b3e2]">
                      {s.num}
                    </p>
                    <h3 className="mt-4 text-[17px] font-semibold leading-snug tracking-[-0.015em] text-[#1d1d1f]">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-[#6e6e73]">{s.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </MotionSection>
      </section>

      {/* ── 8. CTA ───────────────────────────────────────────────────────── */}
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
                Operative Exzellenz ist kein Zustand : sie ist eine Entscheidung.
              </h2>
              <p className="mt-5 max-w-[50ch] text-[16px] leading-relaxed text-white/65">
                In einem kostenlosen 30-Minuten-Erstgespräch klären wir, wo in Ihren Prozessen
                die grössten Hebel liegen : und wie ein gezieltes Optimierungsprogramm aussehen könnte.
              </p>
              <div className="mt-7 flex flex-wrap gap-4">
                {["Kostenlos", "30 Minuten", "Unverbindlich"].map((tag) => (
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
                href="/kontakt"
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
