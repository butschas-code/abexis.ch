import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { PageHero } from "@/components/site/PageHero";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { fokusPageHeroImages } from "@/data/site-images";
import { fokusthemenMeta, siteConfig } from "@/data/pages";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";

// ─── Static data — module level, no re-allocation ────────────────────────────

const meta = fokusthemenMeta.find((m) => m.slug === "vertriebmarketing")!;
const heroImage = fokusPageHeroImages["vertriebmarketing"];

const handlungsfelder = [
  {
    num: "01",
    title: "Vertriebsstrategie & Go-to-Market",
    items: [
      "Marktpotenziale identifizieren und Prioritäten setzen",
      "Go-to-Market-Modell entwickeln und schärfen",
      "Wettbewerbspositionierung klar definieren",
    ],
  },
  {
    num: "02",
    title: "Vertriebsstruktur & Organisation",
    items: [
      "Rollen, Verantwortlichkeiten und Gebiete klar zuweisen",
      "Innen- und Aussendienst effektiv verzahnen",
      "Channel-Management und Partnerstrukturen aufbauen",
    ],
  },
  {
    num: "03",
    title: "Kundensegmentierung & Targeting",
    items: [
      "Ideale Kundenprofile definieren und priorisieren",
      "Segmente nach Potenzial, Fit und Aufwand bewerten",
      "Akquisefokus auf gewinnbare Märkte ausrichten",
    ],
  },
  {
    num: "04",
    title: "Positionierung & Messaging",
    items: [
      "Klares Wertversprechen für jedes Segment formulieren",
      "Differenzierung gegenüber dem Wettbewerb schärfen",
      "Konsistente Kommunikation über alle Kanäle sicherstellen",
    ],
  },
  {
    num: "05",
    title: "Sales Enablement & Prozesse",
    items: [
      "Vertriebsprozesse standardisieren und dokumentieren",
      "Unterlagen, Tools und Argumentation für das Team aufbauen",
      "Onboarding und Weiterentwicklung strukturieren",
    ],
  },
  {
    num: "06",
    title: "Performance-Steuerung & KPIs",
    items: [
      "Relevante Kennzahlen entlang des Funnels definieren",
      "Reporting und Forecasting verlässlich gestalten",
      "Führungsrhythmus mit datenbasierten Reviews etablieren",
    ],
  },
  {
    num: "07",
    title: "Digitaler Vertrieb & Kanäle",
    items: [
      "Digitale Akquise- und Nurturing-Kanäle aufbauen",
      "CRM als strategisches Steuerungsinstrument nutzen",
      "Marketing Automation sinnvoll einsetzen",
    ],
  },
] as const;

const prozessphasen = [
  {
    num: "01",
    title: "Analyse & Diagnose",
    items: [
      "Ist-Situation im Vertrieb und Marketing erfassen",
      "Pipeline-Qualität, Conversion-Raten und Deckungsbeiträge analysieren",
      "Engpässe, Reibungsverluste und Blindflugbereiche identifizieren",
      "Kundenperspektive und Wettbewerbsumfeld einbeziehen",
    ],
  },
  {
    num: "02",
    title: "Strategie & Konzept",
    items: [
      "Zielkunden, Wertversprechen und Positionierung festlegen",
      "Go-to-Market-Modell und Kanalstrategie definieren",
      "Organisationsstruktur und Rollen klären",
      "Messbare Ziele und Meilensteine vereinbaren",
    ],
  },
  {
    num: "03",
    title: "Implementierung",
    items: [
      "Prozesse, Tools und Unterlagen aufbauen",
      "Team befähigen und Führungsrhythmus einführen",
      "Pilotprojekte starten und erste Erkenntnisse gewinnen",
      "Marketing- und Vertriebsaktivitäten koordiniert aufgleisen",
    ],
  },
  {
    num: "04",
    title: "Performance & Optimierung",
    items: [
      "KPIs kontinuierlich messen und interpretieren",
      "Learnings systematisch in den Prozess zurückspielen",
      "Skalierung vorbereiten und Wachstumshebel aktivieren",
    ],
  },
] as const;

const nutzen = [
  {
    num: "01",
    title: "Umsatzwachstum",
    body: "Klare Strategie, besseres Targeting und strukturierte Prozesse führen zu mehr abgeschlossenen Geschäften.",
  },
  {
    num: "02",
    title: "Effizienz",
    body: "Weniger Streuverlust — das Team fokussiert sich auf die richtigen Kunden mit dem richtigen Angebot.",
  },
  {
    num: "03",
    title: "Kundenbindung",
    body: "Konsistente Kommunikation und echtes Verständnis der Kundenbedürfnisse stärken Loyalität und Weiterempfehlungen.",
  },
  {
    num: "04",
    title: "Marktposition",
    body: "Eine differenzierte Positionierung macht Sie im Wettbewerb sichtbarer und verhandlungsstärker.",
  },
  {
    num: "05",
    title: "Planungssicherheit",
    body: "Verlässliche Pipeline-Daten und Forecasts schaffen Grundlagen für sichere Ressourcen- und Investitionsentscheide.",
  },
  {
    num: "06",
    title: "Skalierbarkeit",
    body: "Dokumentierte Prozesse und klare Strukturen ermöglichen Wachstum, ohne dass Qualität und Konsistenz leiden.",
  },
  {
    num: "07",
    title: "Teamperformance",
    body: "Klare Rollen, gute Werkzeuge und regelmässiges Coaching steigern Motivation und Abschlussquoten.",
  },
  {
    num: "08",
    title: "Alignment",
    body: "Marketing und Vertrieb ziehen am selben Strick — gemeinsame Ziele, gemeinsame Sprache, gemeinsame Wirkung.",
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

export function FokusVertriebMarketing() {
  return (
    <InteriorPageRoot>
      <SchemaMarkup type="Service" data={meta} />
      <SchemaMarkup
        type="BreadcrumbList"
        data={[
          { name: "Startseite", url: "/" },
          { name: "Leistungen", url: "/leistungen" },
          { name: meta.title, url: "/fokusthemen/vertriebmarketing" },
        ]}
      />

      {/* ── 1. HERO ──────────────────────────────────────────────────────── */}
      <PageHero imageSrc={heroImage} priority>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
          {meta.subtitle}
        </p>
        <h1 className="mt-3 max-w-[22ch] text-[clamp(2.25rem,7vw+0.5rem,3.875rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-white text-balance">
          Vertrieb ohne Strategie ist teures Rauschen.
        </h1>
        <p className="mt-6 max-w-[50ch] text-[clamp(1rem,1.5vw+0.5rem,1.175rem)] leading-relaxed text-white/80 text-balance">
          Wenn Vertrieb und Marketing gegeneinander arbeiten, Zielkunden unklar sind und Prozesse
          vom Zufall abhängen, entgehen Ihnen Umsatz und Marktanteile. Wir helfen Ihnen, Struktur,
          Fokus und Wirkung in Ihre Go-to-Market-Aktivitäten zu bringen.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
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

      {/* ── 2. SPLIT PANEL — Vertrieb vs. Marketing ──────────────────────── */}
      <MotionSection>
        <div className="overflow-hidden md:grid md:grid-cols-2">
          {/* Left half — warm linen */}
          <div className="relative bg-[#faf8f2]">
            <div className="relative ml-auto max-w-[534px] px-8 py-14 md:px-12 md:py-20">
              <LCorner className="top-6 left-6 text-[#c9a96e]/40" />
              <div className="mb-6 h-[3px] w-10 rounded-full bg-[#c9a96e]/60" />
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                Funktion 1
              </h2>
              <h3 className="mt-3 text-[clamp(1.375rem,3vw+0.5rem,1.875rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-[#1d1d1f]">
                Vertrieb
              </h3>
              <p className="mt-5 text-[16px] leading-relaxed text-[#6e6e73]">
                Vertrieb schafft direkte Kundenbeziehungen, qualifiziert Interessenten und
                schliesst Geschäfte ab. Seine Wirkung hängt entscheidend davon ab, wie klar
                Zielsegmente definiert, Prozesse strukturiert und Ressourcen eingesetzt sind.
              </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#c9a96e]/60 via-[#c9a96e]/20 to-transparent" />
          </div>

          {/* Right half — navy */}
          <div className="relative bg-[#1a2260]">
            <div className="relative mr-auto max-w-[534px] px-8 py-14 md:px-12 md:py-20">
              <LCorner className="top-6 left-6 text-[#45b3e2]/30" />
              <div className="mb-6 h-[3px] w-10 rounded-full bg-[#45b3e2]/50" />
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
                Funktion 2
              </h2>
              <h3 className="mt-3 text-[clamp(1.375rem,3vw+0.5rem,1.875rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-white">
                Marketing
              </h3>
              <p className="mt-5 text-[16px] leading-relaxed text-white/65">
                Marketing schafft Sichtbarkeit, Vertrauen und Nachfrage. Es positioniert das
                Unternehmen, qualifiziert Interessenten vor und gibt dem Vertrieb die Grundlage,
                auf der erfolgreiche Gespräche erst möglich werden.
              </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#26337c] via-[#45b3e2]/60 to-transparent" />
          </div>
        </div>
      </MotionSection>

      {/* ── 3. HANDLUNGSFELDER — Alternating spine ───────────────────────── */}
      <section id="handlungsfelder" className="bg-[#f5f5f7]">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-24">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.8fr] lg:gap-16">
              {/* Left: sticky anchor */}
              <div className="lg:sticky lg:top-28 lg:self-start">
                <h2 className="text-[clamp(1.625rem,3.5vw+0.5rem,2.375rem)] font-semibold leading-[1.09] tracking-[-0.03em] text-[#1d1d1f]">
                  Sieben Hebel für wirksames Wachstum.
                </h2>
                <div className="mt-7 h-px w-full bg-black/[0.06]" />
                <p className="mt-6 text-[15px] leading-relaxed text-[#6e6e73]">
                  Vertrieb und Marketing wirken auf mehreren Ebenen. Wir helfen Ihnen, die
                  richtigen Prioritäten zu setzen — und konsequent umzusetzen.
                </p>
                <Link
                  href="/kontakt"
                  className="mt-8 inline-flex items-center gap-3 text-[14px] font-semibold text-[#26337c] transition-all hover:gap-4"
                >
                  Beratungsgespräch anfragen
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path
                      d="M3 8h10M8 3l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>

              {/* Right: alternating spine — desktop / simple list — mobile */}
              <div>
                {/* ── Desktop: alternating two-column spine ── */}
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
                            <div className="pr-10">
                              {isLeft ? <SpineCard item={item} /> : null}
                            </div>
                            <div className="pl-10">
                              {!isLeft ? <SpineCard item={item} /> : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ── Mobile: simple vertical list ── */}
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
            &ldquo;Vertrieb und Marketing sind keine getrennten Welten — sie sind zwei Seiten
            desselben Wachstumshebels. Wer sie ausrichtet, wächst. Wer sie entkoppelt, kämpft
            mit sich selbst.&rdquo;
          </blockquote>
          <div className="mt-10 flex items-center justify-center gap-5">
            <div className="h-px w-12 bg-[#c9a96e]/35" />
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/30">
              Abexis Go-to-Market-Prinzip
            </span>
            <div className="h-px w-12 bg-[#c9a96e]/35" />
          </div>
        </div>
      </section>

      {/* ── 5. PROZESSPHASEN — Dark navy phase grid ──────────────────────── */}
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
              Von der Diagnose zur performanten Vertriebsorganisation — strukturiert und messbar.
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
              Jedes Engagement beginnt mit einer ehrlichen Bestandsaufnahme. Je nach Ausgangslage
              arbeiten wir gezielt an einzelnen Hebeln oder begleiten Sie durch einen umfassenden
              Go-to-Market-Aufbau — immer mit klaren Zielen und messbaren Ergebnissen.
            </p>
          </div>
        </MotionSection>
      </section>

      {/* ── 6. NUTZEN — Sticky left + card grid ──────────────────────────── */}
      <section className="bg-[#f5f5f7]">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-28">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.8fr] lg:gap-20 lg:items-start">
              {/* Left anchor */}
              <div className="lg:sticky lg:top-28">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                  Nutzen
                </p>
                <h2 className="mt-4 text-[clamp(1.625rem,3.5vw+0.5rem,2.375rem)] font-semibold leading-[1.09] tracking-[-0.03em] text-[#1d1d1f]">
                  Was professioneller Vertrieb und Marketing bringen.
                </h2>
                <div className="mt-7 h-px w-full bg-black/[0.06]" />
                <p className="mt-6 text-[15px] leading-relaxed text-[#6e6e73]">
                  Die Wirkung zeigt sich nicht nur im Umsatz — sondern in der Art, wie ein
                  Unternehmen am Markt auftritt, wächst und seine Kunden bindet.
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

              {/* Right: 4x2 card grid */}
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

      {/* ── 7. GUIDE — Unsere Rolle ──────────────────────────────────────── */}
      <section className="bg-white">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-28">

            {/* Header — two-column */}
            <div className="grid gap-8 border-b border-black/[0.06] pb-12 md:grid-cols-[1fr_1fr] md:gap-20 md:items-end">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                  Unsere Rolle
                </p>
                <h2 className="mt-4 text-[clamp(1.625rem,3.5vw+0.5rem,2.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f]">
                  Der Unterschied zwischen Aktivität und Wachstum.
                </h2>
              </div>
              <p className="text-[17px] leading-relaxed text-[#6e6e73] md:pb-1">
                Viele Unternehmen haben aktive Vertriebsteams und laufende Marketingmassnahmen —
                aber das Wachstum bleibt aus. Wir helfen Ihnen herauszufinden, wo die eigentlichen
                Hebel liegen, und begleiten Sie beim Umsetzen.
              </p>
            </div>

            {/* Three situations */}
            <div className="mt-12">
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                Typische Ausgangssituationen
              </p>
              <div className="grid gap-px overflow-hidden rounded-2xl border border-black/[0.06] bg-black/[0.04] sm:grid-cols-3">
                {[
                  {
                    num: "01",
                    title: "Stagnation trotz Aktivität",
                    body: "Das Team ist beschäftigt, aber der Umsatz wächst nicht. Ziele werden verfehlt, ohne dass klar ist warum — Diagnose und Neuausrichtung sind gefragt.",
                  },
                  {
                    num: "02",
                    title: "Vertrieb und Marketing im Silo",
                    body: "Beide Funktionen arbeiten mit unterschiedlichen Zielen, Sprachen und Messgrössen. Das kostet Wirkung — und Energie, die im Markt fehlt.",
                  },
                  {
                    num: "03",
                    title: "Wachstum ohne Fundament",
                    body: "Schnelles Wachstum hat Strukturen überholt: Prozesse, Rollen und Steuerung halten nicht Schritt. Jetzt braucht es Stabilisierung und skalierbare Grundlagen.",
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
                Mehr Wirkung im Markt beginnt mit dem richtigen Gespräch.
              </h2>
              <p className="mt-5 max-w-[50ch] text-[16px] leading-relaxed text-white/65">
                In einem kostenlosen 30-Minuten-Erstgespräch klären wir gemeinsam, wo Ihr
                Vertrieb und Marketing heute stehen — und wo die grössten Hebel liegen.
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
