import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { PageHero } from "@/components/site/PageHero";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { fokusPageHeroImages } from "@/data/site-images";
import { fokusthemenMeta, siteConfig } from "@/data/pages";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { MobileExpandProvider, MobileCollapsibleCard } from "@/components/public-site/MobileExpandable";

// ─── Static data — module level, no re-allocation ────────────────────────────

const meta = fokusthemenMeta.find((m) => m.slug === "digitale-transformation")!;
const heroImage = fokusPageHeroImages["digitale-transformation"];

const handlungsfelder = [
  {
    num: "01",
    title: "Kundenorientierung & Experience",
    items: [
      "Digitale Touchpoints entlang der Customer Journey optimieren",
      "Self-Service-Portale und personalisierte Erlebnisse aufbauen",
      "Kundenfeedback systematisch in die Produktentwicklung einbeziehen",
    ],
  },
  {
    num: "02",
    title: "Digitale Strategien & Geschäftsmodelle",
    items: [
      "Wettbewerbspositionierung im digitalen Umfeld schärfen",
      "Neue Erlösquellen und Plattformmodelle entwickeln",
      "Partnerschaften und digitale Ökosysteme strategisch aufbauen",
    ],
  },
  {
    num: "03",
    title: "Führung, Kultur & Organisation",
    items: [
      "Digital Leadership und agile Führungsmodelle einführen",
      "Digitale Kompetenz und Innovationskultur stärken",
      "Organisationsstrukturen an neue Arbeitsweisen anpassen",
    ],
  },
  {
    num: "04",
    title: "Prozessoptimierung & Automatisierung",
    items: [
      "End-to-End-Prozesse analysieren und neu gestalten",
      "Automatisierungspotenziale identifizieren und realisieren",
      "Datenbasierte Entscheidungsgrundlagen schaffen",
    ],
  },
  {
    num: "05",
    title: "Plattformen & Absatzkanäle",
    items: [
      "Digitale Vertriebs- und Kommunikationskanäle aufbauen",
      "Omnichannel-Strategie entwickeln und integrieren",
      "Marktplätze und digitale Ökosysteme nutzen",
    ],
  },
  {
    num: "06",
    title: "Technologien — KI, IoT, Industrie 4.0",
    items: [
      "Anwendungsfälle für KI und Machine Learning identifizieren",
      "IoT- und Industrie-4.0-Lösungen in bestehende Anlagen integrieren",
      "Technologieauswahl anhand strategischer Kriterien treffen",
    ],
  },
  {
    num: "07",
    title: "IT-Infrastruktur & Datenbasis",
    items: [
      "Cloud-Migration strategisch planen und umsetzen",
      "Datenarchitektur und Governance etablieren",
      "Legacy-Systeme schrittweise durch skalierbare Lösungen ablösen",
    ],
  },
] as const;

const prozessphasen = [
  {
    num: "01",
    title: "Vorbereitungsphase",
    items: [
      "Projekt definieren: Ziele, Scope und Prioritäten festlegen",
      "Team zusammenstellen und Verantwortlichkeiten klären",
      "Budget und Zeitplan realistisch planen",
      "Relevante Stakeholder frühzeitig einbinden",
    ],
  },
  {
    num: "02",
    title: "Analysephase",
    items: [
      "Marktanalyse: Kunden, Konkurrenz, Technologietrends",
      "Produkte- und Dienstleistungsportfolio kritisch prüfen",
      "Ideen der Mitarbeiter aufgreifen, Machbarkeit beurteilen",
      "Ist-Situation ermitteln und mit dem Zielbild abgleichen",
    ],
  },
  {
    num: "03",
    title: "Planungsphase",
    items: [
      "Vision und Strategie: Kernkompetenzen und Geschäftsmodell",
      "Prozesse, Organisation und Unternehmenskultur neu gestalten",
      "Ökosystem mit Kunden und Partnern definieren",
      "Plan erstellen: Technologie wählen, messbare Schritte festlegen",
    ],
  },
  {
    num: "04",
    title: "Umsetzungsphase",
    items: [
      "Strategie umsetzen — z.B. mit agiler Methodik",
      "Kontinuierliche Überprüfung und Monitoring einrichten",
      "Allenfalls Justierungen vornehmen, Learnings integrieren",
      "Ergebnisse messen, kommunizieren und konsolidieren",
    ],
  },
] as const;

const nutzen = [
  {
    num: "01",
    title: "Kosten & Ertrag",
    body: "Kosten reduzieren, Produktivität und Umsatz bzw. Gewinn erhöhen.",
  },
  {
    num: "02",
    title: "Datenqualität",
    body: "Datenbasierte Erkenntnisse, höhere Datenqualität und weniger Fehler durch Automatisierung.",
  },
  {
    num: "03",
    title: "Kundenerlebnis",
    body: "Besseres Erlebnis bei Beschaffung und Kundenservice — höhere Kundenzufriedenheit.",
  },
  {
    num: "04",
    title: "Transparenz",
    body: "Transparentere Informationspolitik gegenüber Kunden und Lieferanten.",
  },
  {
    num: "05",
    title: "Neue Märkte",
    body: "Neue Produkte und Leistungen erschliessen neue Kundenpotenziale.",
  },
  {
    num: "06",
    title: "Zusammenarbeit",
    body: "Mehr Kollaboration und bessere Kommunikation durch eine gemeinsame Plattform.",
  },
  {
    num: "07",
    title: "Geschwindigkeit",
    body: "Schnellere Durchlaufzeiten dank effizienter, automatisierter Prozesse.",
  },
  {
    num: "08",
    title: "Zukunftsfähigkeit",
    body: "Investitionen in die Digitale Transformation sichern den Vorsprung gegenüber dem Wettbewerb.",
  },
] as const;

const kredibilitaet = [
  { value: "7", label: "Handlungsfelder" },
  { value: "4", label: "Prozessphasen" },
  { value: "8", label: "Nutzendimensionen" },
  { value: "KMU–Konzern", label: "" },
] as const;

const guidePunkte = [
  {
    label: "Strategie vor Technologie",
    body: "Wir starten mit den Geschäftszielen — nicht mit der Technologie. Erst wenn klar ist, was erreicht werden soll, wählen wir die passenden Mittel.",
    accent: "#26337c",
  },
  {
    label: "Branchenübergreifende Erfahrung",
    body: "Wir kennen die typischen Fallstricke aus verschiedenen Sektoren und bringen bewährte Transformationsmuster aus der Praxis mit.",
    accent: "#45b3e2",
  },
  {
    label: "Begleitung bis zur Umsetzung",
    body: "Wir bleiben nicht bei Konzepten: Wir unterstützen Sie bei der konkreten Implementierung und übernehmen Verantwortung für die Ergebnisse.",
    accent: "#c9a96e",
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

export function FokusDigitaleTransformation() {
  return (
    <InteriorPageRoot>
      <MobileExpandProvider>
      <SchemaMarkup type="Service" data={meta} />
      <SchemaMarkup
        type="BreadcrumbList"
        data={[
          { name: "Startseite", url: "/" },
          { name: "Leistungen", url: "/leistungen" },
          { name: meta.title, url: "/fokusthemen/digitale-transformation" },
        ]}
      />

      {/* ── 1. HERO ──────────────────────────────────────────────────────── */}
      <PageHero imageSrc={heroImage} priority>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
          {meta.subtitle}
        </p>
        <h1 className="mt-3 max-w-[22ch] text-[clamp(2.25rem,7vw+0.5rem,3.875rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-white text-balance">
          Digitale Transformation ist kein IT-Projekt — sie ist eine Führungsaufgabe.
        </h1>
        <p className="mt-6 max-w-[50ch] text-[clamp(1rem,1.5vw+0.5rem,1.175rem)] leading-relaxed text-white/80 text-balance">
          Wenn Verwaltungsrat und Management die Digitalisierung verschieden interpretieren,
          entstehen Fehlinvestitionen, Reibung und verpasste Chancen. Wir helfen Ihnen, aus
          Technologie echten Unternehmenswert zu machen — strukturiert, strategisch, umsetzbar.
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

      {/* ── 2. SPLIT PANEL — Digitalisierung vs. Digitale Transformation ─── */}
      <MotionSection>
        <div className="overflow-hidden md:grid md:grid-cols-2">
          {/* Left half — warm linen: content tracks the 1068px centre column */}
          <div className="relative bg-[#faf8f2]">
            <div className="relative ml-auto max-w-[534px] px-8 py-14 md:px-12 md:py-20">
              <LCorner className="top-6 left-6 text-[#c9a96e]/40" />
              <div className="mb-6 h-[3px] w-10 rounded-full bg-[#c9a96e]/60" />
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                Ebene 1
              </h2>
              <h3 className="mt-3 text-[clamp(1.375rem,3vw+0.5rem,1.875rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-[#1d1d1f]">
                Digitalisierung
              </h3>
              <p className="mt-5 text-[16px] leading-relaxed text-[#6e6e73]">
                Betrifft die taktische Ebene: einzelne Prozesse, Tools und Arbeitsabläufe werden
                digitalisiert oder automatisiert. Wichtig, aber nicht hinreichend — sie verändert
                das Geschäftsmodell nicht.
              </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#c9a96e]/60 via-[#c9a96e]/20 to-transparent" />
          </div>

          {/* Right half — navy: content tracks the 1068px centre column */}
          <div className="relative bg-[#1a2260]">
            <div className="relative mr-auto max-w-[534px] px-8 py-14 md:px-12 md:py-20">
              <LCorner className="top-6 left-6 text-[#45b3e2]/30" />
              <div className="mb-6 h-[3px] w-10 rounded-full bg-[#45b3e2]/50" />
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
                Ebene 2
              </h2>
              <h3 className="mt-3 text-[clamp(1.375rem,3vw+0.5rem,1.875rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-white">
                Digitale Transformation
              </h3>
              <p className="mt-5 text-[16px] leading-relaxed text-white/65">
                Betrifft die strategische Ebene: Geschäftsmodelle, Kundenerlebnisse, Kultur und
                Führung werden grundlegend neu gedacht. Sie schafft nachhaltige Wettbewerbsvorteile
                und erfordert unternehmerische Entschlossenheit.
              </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#26337c] via-[#45b3e2]/60 to-transparent" />
          </div>
        </div>

        {/* Bridge — below the split */}
        <div className="border-b border-black/[0.06] bg-white">
          <div className="mx-auto max-w-[1068px] px-6 py-10 md:py-14">
            <div className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-14 md:items-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b] md:w-32 md:shrink-0">
                Warum das<br className="hidden md:block" /> wichtig ist
              </p>
              <p className="border-l-[3px] border-[#c9a96e]/50 pl-6 text-[18px] font-medium leading-relaxed tracking-[-0.01em] text-[#1d1d1f]">
                Wer nur digitalisiert, ohne zu transformieren, optimiert den Status quo — und
                verpasst die eigentliche Chance. Entscheidend ist ein klares Bild der Ziele,
                bevor die Strategie erarbeitet wird.
              </p>
            </div>
          </div>
        </div>
      </MotionSection>

      {/* ── 3. CREDIBILITY STRIP ─────────────────────────────────────────── */}
      <div className="border-b border-black/[0.05] bg-[#f5f5f7]">
        <div className="mx-auto max-w-[1068px] px-6 py-7">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {kredibilitaet.map(({ value, label }) => (
              <div key={value} className="flex items-center gap-3">
                <p className="text-[1.625rem] font-semibold tabular-nums leading-none tracking-[-0.035em] text-[#26337c]">
                  {value}
                </p>
                {label && <p className="text-[12px] leading-snug text-[#6e6e73]">{label}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. HANDLUNGSFELDER — Alternating spine timeline ──────────────── */}
      <section id="handlungsfelder" className="bg-[#f5f5f7]">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-24">
            <div className="flex items-baseline justify-between gap-8 border-b border-black/[0.07] pb-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                Handlungsfelder
              </p>
              <span className="text-[11px] text-[#86868b]">07 Dimensionen</span>
            </div>

            <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.8fr] lg:gap-16">
              {/* Left: sticky anchor */}
              <div className="lg:sticky lg:top-28 lg:self-start">
                <h2 className="text-[clamp(1.625rem,3.5vw+0.5rem,2.375rem)] font-semibold leading-[1.09] tracking-[-0.03em] text-[#1d1d1f]">
                  Sieben Dimensionen, die eine Transformation ausmachen.
                </h2>
                <div className="mt-7 h-px w-full bg-black/[0.06]" />
                <p className="mt-6 text-[15px] leading-relaxed text-[#6e6e73]">
                  Es muss nicht immer das volle Programm sein. Allenfalls möchten Sie nur einen
                  Teilaspekt betrachten oder benötigen Unterstützung bei der Umsetzung eines
                  bestimmten Handlungsfelds.
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
                    <MobileCollapsibleCard key={item.num}>
                      <SpineCard item={item} />
                    </MobileCollapsibleCard>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </MotionSection>
      </section>

      {/* ── 5. PULL QUOTE ────────────────────────────────────────────────── */}
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
            &ldquo;Digitale Transformation bietet eine Grundlage, um ein Unternehmen zu erneuern
            und qualifizierter für die Zukunft vorzubereiten — als strategische Initiative,
            nicht als Nebenprojekt.&rdquo;
          </blockquote>
          <div className="mt-10 flex items-center justify-center gap-5">
            <div className="h-px w-12 bg-[#c9a96e]/35" />
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/30">
              Abexis Transformations-Prinzip
            </span>
            <div className="h-px w-12 bg-[#c9a96e]/35" />
          </div>
        </div>
      </section>

      {/* ── 6. PROZESSPHASEN — Dark navy phase grid ──────────────────────── */}
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
              Vom Kick-off zur lebenden Strategie — strukturiert, iterativ, messbar.
            </h2>

            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-4">
              {prozessphasen.map((phase, i) => (
                <MobileCollapsibleCard key={phase.num} collapsedClass="max-h-[160px]" fadeFrom="#1a1f38" darkArrow>
                  <div className="relative flex flex-col bg-[#1a1f38]/60 px-6 py-8 backdrop-blur-sm">
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
                </MobileCollapsibleCard>
              ))}
            </div>

            <p className="mt-8 max-w-[60ch] text-[15px] leading-relaxed text-white/50">
              Der Ansatz ist flexibel: Je nach Ausgangslage können Sie mit einem einzelnen Teilaspekt
              starten oder ein umfassendes Transformationsprogramm aufgleisen — immer mit klaren,
              messbaren Schritten.
            </p>
          </div>
        </MotionSection>
      </section>

      {/* ── 7. NUTZEN — Sticky left + card grid ──────────────────────────── */}
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
                  Was richtig umgesetzte Digitalisierung bringt.
                </h2>
                <div className="mt-7 h-px w-full bg-black/[0.06]" />
                <p className="mt-6 text-[15px] leading-relaxed text-[#6e6e73]">
                  Eine erfolgreiche digitale Transformation erzeugt Mehrwert auf mehreren Ebenen —
                  operativ, strategisch und kulturell.
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
                  <MobileCollapsibleCard key={n.num}>
                    <div className="relative bg-white px-6 py-6">
                      <LCorner className="top-3 right-3 text-[#c9a96e]/20" />
                      <p className="text-[11px] font-semibold tabular-nums tracking-[0.14em] text-[#45b3e2]">
                        {n.num}
                      </p>
                      <h3 className="mt-3 text-[17px] font-semibold leading-snug tracking-[-0.015em] text-[#1d1d1f]">
                        {n.title}
                      </h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-[#6e6e73]">{n.body}</p>
                    </div>
                  </MobileCollapsibleCard>
                ))}
              </div>
            </div>
          </div>
        </MotionSection>
      </section>

      {/* ── 8. GUIDE — Unsere Rolle ──────────────────────────────────────── */}
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
                  Der Unterschied zwischen Transformation und Technologieeinkauf.
                </h2>
              </div>
              <p className="text-[17px] leading-relaxed text-[#6e6e73] md:pb-1">
                Viele Unternehmen kaufen Software und nennen es Transformation. Wir helfen Ihnen,
                die richtigen Fragen zuerst zu stellen — und dann die richtigen Schritte in der
                richtigen Reihenfolge zu gehen.
              </p>
            </div>

            {/* Three situations — when companies call Abexis */}
            <div className="mt-12">
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                Typische Ausgangssituationen
              </p>
              <div className="grid gap-px overflow-hidden rounded-2xl border border-black/[0.06] bg-black/[0.04] sm:grid-cols-3">
                {[
                  {
                    num: "01",
                    title: "Fehlende interne Transformationsexpertise",
                    body: "Know-how, Kapazität und Distanz zum Tagesgeschäft fehlen intern — die Voraussetzungen für einen strukturierten Prozess sind nicht vorhanden.",
                  },
                  {
                    num: "02",
                    title: "Dringlichkeit durch Marktveränderung",
                    body: "Neue Wettbewerber, technologische Disruption oder veränderte Kundenerwartungen erfordern rasches, gezieltes Handeln — ohne Orientierungsverlust.",
                  },
                  {
                    num: "03",
                    title: "Hohe Investition, hohes Risiko",
                    body: "Digitale Transformation bindet Kapital und Energie. Ein strukturierter Ansatz mit externem Blick minimiert das Risiko kostspieliger Fehlinvestitionen.",
                  },
                ].map((s) => (
                  <MobileCollapsibleCard key={s.num} collapsedClass="max-h-[168px]">
                    <div className="relative bg-white px-7 py-8">
                      <LCorner className="top-4 right-4 text-[#c9a96e]/30" />
                      <p className="text-[11px] font-semibold tabular-nums tracking-[0.14em] text-[#45b3e2]">
                        {s.num}
                      </p>
                      <h3 className="mt-4 text-[17px] font-semibold leading-snug tracking-[-0.015em] text-[#1d1d1f]">
                        {s.title}
                      </h3>
                      <p className="mt-3 text-[15px] leading-relaxed text-[#6e6e73]">{s.body}</p>
                    </div>
                  </MobileCollapsibleCard>
                ))}
              </div>
            </div>

            {/* Three differentiators */}
            <div className="mt-14 overflow-hidden rounded-2xl border border-white/[0.06]" style={{ background: "#1a2260" }}>
              <div className="border-b border-white/[0.06] px-7 py-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
                  Was uns auszeichnet
                </p>
              </div>
              <div className="grid gap-px bg-white/[0.04] sm:grid-cols-3">
                {guidePunkte.map((vp) => (
                  <MobileCollapsibleCard key={vp.label} fadeFrom="#1a2260" darkArrow>
                    <div className="relative flex flex-col bg-[#1a2260] px-6 py-8">
                      <div className="h-[3px] w-8 rounded-full" style={{ background: vp.accent }} />
                      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
                        {vp.label}
                      </p>
                      <p className="mt-3 text-[15px] leading-relaxed text-white/65">{vp.body}</p>
                    </div>
                  </MobileCollapsibleCard>
                ))}
              </div>
            </div>

          </div>
        </MotionSection>
      </section>

      {/* ── 9. CTA — Specific 30-min offer ───────────────────────────────── */}
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
                Besser früher als spät mit der Digitalen Transformation beginnen.
              </h2>
              <p className="mt-5 max-w-[50ch] text-[16px] leading-relaxed text-white/65">
                In einem kostenlosen 30-Minuten-Erstgespräch klären wir gemeinsam, wo Ihr
                Unternehmen steht, was Sie erreichen wollen — und wie wir Sie dabei begleiten können.
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
      </MobileExpandProvider>
    </InteriorPageRoot>
  );
}
