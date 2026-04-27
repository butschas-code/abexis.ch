import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { HeroProjectRealityCheckCta } from "@/components/site/HeroProjectRealityCheckCta";
import { PageHero } from "@/components/site/PageHero";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { fokusPageHeroImages } from "@/data/site-images";
import { fokusthemenMeta, siteConfig } from "@/data/pages";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";

// ─── Static data — module level, no re-allocation ────────────────────────────

const meta = fokusthemenMeta.find((m) => m.slug === "unternehmensstrategie")!;
const heroImage = fokusPageHeroImages["unternehmensstrategie"];
const contentImage = "https://firebasestorage.googleapis.com/v0/b/abexis-cms.firebasestorage.app/o/cms%2Fmedia%2Fmigrated%2Fe006b913-0cb3-4631-9d9d-7304bc2bab8e.jpg?alt=media";

const prozessSchritte = [
  {
    num: "01",
    title: "Vorbereitungen & Analyse",
    items: [
      "Umfassende interne Analyse: Stärken, Schwächen, finanzielle Situation",
      "Externe Analyse: Marktchancen, Risiken, Trends und Kundennutzen",
      "Wettbewerbsbedingungen verstehen",
      "SWOT-Analyse: Interne und externe Faktoren kombinieren",
    ],
  },
  {
    num: "02",
    title: "Vision & Mission festlegen",
    items: [
      "Klare, inspirierende Unternehmensvision definieren",
      "Langfristige Ziele und gewünschten Zustand beschreiben",
      "Mission: Zweck und Verpflichtung gegenüber Stakeholdern",
    ],
  },
  {
    num: "03",
    title: "Strategische Ziele ableiten",
    items: [
      "Konkrete, messbare und zeitgebundene Ziele aus Vision und Mission",
      "Interessen verschiedener Stakeholder berücksichtigen",
    ],
  },
  {
    num: "04",
    title: "Strategische Optionen entwickeln",
    items: [
      "Verschiedene strategische Optionen identifizieren",
      "Bewertung nach Machbarkeit, Rentabilität und strategischer Passung",
    ],
  },
  {
    num: "05",
    title: "Beste Strategie auswählen",
    items: [
      "Erkenntnisse aus Analyse und Bewertung integrieren",
      "Am besten geeignete Strategie wählen",
      "Klare Kommunikation an alle relevanten Stakeholder",
    ],
  },
  {
    num: "06",
    title: "Strategie implementieren",
    items: [
      "Konkrete Aktionspläne entwickeln",
      "Klare Verantwortlichkeiten und Ressourcen zuweisen",
      "Überwachungsmechanismen und Fortschrittskontrollen einrichten",
    ],
  },
  {
    num: "07",
    title: "Monitoring & Anpassung",
    items: [
      "Kontinuierlichen Überwachungsprozess etablieren",
      "Strategie bei Bedarf an veränderte Bedingungen anpassen",
    ],
  },
] as const;

const fallstricke = [
  {
    title: "Fehlende Vision und Mission",
    body: "Das Fehlen einer klaren Richtung führt zu Unsicherheit und beeinträchtigt die Motivation aller Beteiligten im Unternehmen.",
  },
  {
    title: "Mangelnde Stakeholder-Einbindung",
    body: "Werden Schlüsselinteressengruppen nicht aktiv einbezogen, entstehen Widerstand und mangelnde Unterstützung.",
  },
  {
    title: "Unzureichende Analyse",
    body: "Oberflächliche oder fehlerhafte Analysen führen zu falschen Schlussfolgerungen und gefährlichen strategischen Fehlentscheidungen.",
  },
  {
    title: "Schlechte Kommunikation",
    body: "Mangelnde Transparenz über die Strategie erzeugt Informationslücken, Unsicherheiten und Fehlorientierung im Betrieb.",
  },
  {
    title: "Widerstand gegen Veränderung",
    body: "Mitarbeiter und Führungskräfte sträuben sich, wenn sie nicht ausreichend informiert, eingebunden und abgeholt werden.",
  },
  {
    title: "Mangelnde Ressourcen",
    body: "Unzureichende finanzielle, personelle oder technologische Ressourcen blockieren selbst die konzeptionell beste Strategie.",
  },
  {
    title: "Starre, unflexible Strategien",
    body: "In dynamischen Umgebungen scheitern Strategien, die nicht an veränderte interne und externe Rahmenbedingungen angepasst werden.",
  },
  {
    title: "Unklare Verantwortlichkeiten",
    body: "Fehlende Klarheit über Zuständigkeiten führt zu Verwirrung, Doppelarbeit und Effizienzverlusten bei der Umsetzung.",
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

type Step = (typeof prozessSchritte)[number];

function SpineCard({ step }: { step: Step }) {
  return (
    <div className="group relative h-full overflow-hidden rounded-2xl border border-black/[0.06] bg-white px-6 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#26337c]/15 hover:shadow-[0_16px_48px_rgba(38,51,124,0.10)]">
      <LCorner className="top-3 right-3 text-[#c9a96e]/0 transition-colors duration-300 group-hover:text-[#c9a96e]" />
      {/* Ghost number watermark */}
      <span
        className="pointer-events-none absolute -bottom-2 right-3 select-none text-[5rem] font-semibold leading-none tabular-nums text-[#c9a96e]/[0.08] transition-opacity duration-300 group-hover:opacity-50"
        aria-hidden
      >
        {step.num}
      </span>
      <h3 className="relative text-[17px] font-semibold leading-snug tracking-[-0.015em] text-[#1d1d1f]">
        {step.title}
      </h3>
      <ul className="relative mt-3 flex flex-col gap-2">
        {step.items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[15px] leading-snug text-[#6e6e73]">
            <span className="mt-[5px] h-[4px] w-[4px] shrink-0 rounded-full bg-[#45b3e2]" />
            {item}
          </li>
        ))}
      </ul>
      {/* Bottom accent on hover */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#26337c] to-[#45b3e2] transition-all duration-500 group-hover:w-full" />
    </div>
  );
}

// ─── Page component ───────────────────────────────────────────────────────────

export function FokusUnternehmensstrategie() {
  return (
    <InteriorPageRoot>
      <SchemaMarkup type="Service" data={meta} />
      <SchemaMarkup
        type="BreadcrumbList"
        data={[
          { name: "Startseite", url: "/" },
          { name: "Leistungen", url: "/leistungen" },
          { name: meta.title, url: "/fokusthemen/unternehmensstrategie" },
        ]}
      />

      {/* ── 1. HERO ──────────────────────────────────────────────────────── */}
      <PageHero imageSrc={heroImage}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
          {meta.subtitle}
        </p>
        <h1 className="mt-3 max-w-[22ch] text-[clamp(2.25rem,7vw+0.5rem,3.875rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-white text-balance">
          Strategie entsteht dort, wo Perspektiven auseinandergehen.
        </h1>
        <p className="mt-6 max-w-[50ch] text-[clamp(1rem,1.5vw+0.5rem,1.175rem)] leading-relaxed text-white/80 text-balance">
          Wenn Verwaltungsrat und Führungsteam die Zukunft verschieden sehen, braucht es Methodik,
          Struktur und eine externe Perspektive — keinen Kompromiss. Wir begleiten Sie vom ersten
          Schritt bis zur gelebten Strategie.
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
            href="#prozess"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/30 px-7 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/10"
          >
            Zum Prozess
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M7 2v10M2 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </PageHero>

      {/* ── 2. SPLIT PANEL — Unternehmensstrategie vs. Eignerstrategie ─── */}
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
                Unternehmensstrategie
              </h3>
              <p className="mt-5 text-[16px] leading-relaxed text-[#6e6e73]">
                Betrifft die gesamte Organisation. Sie legt fest, wie das Unternehmen als Ganzes
                geführt wird und welche strategischen Entscheidungen nötig sind, um nachhaltige
                Wettbewerbsvorteile zu erzielen.
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
                Eignerstrategie
              </h3>
              <p className="mt-5 text-[16px] leading-relaxed text-white/65">
                Konzentriert sich auf die Präferenzen und Ziele der Eigentümer: Renditeerwartungen,
                Risikotoleranz und langfristige Vision. Sie muss mit der Unternehmensstrategie in
                Einklang stehen.
              </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#26337c] via-[#45b3e2]/60 to-transparent" />
          </div>
        </div>

      </MotionSection>


      {/* ── 4. PROCESS — Alternating spine timeline ──────────────────────── */}
      <section id="prozess" className="bg-[#f5f5f7]">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-24">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.8fr] lg:gap-16">
              {/* Left: sticky anchor */}
              <div className="lg:sticky lg:top-28 lg:self-start">
                <h2 className="text-[clamp(1.625rem,3.5vw+0.5rem,2.375rem)] font-semibold leading-[1.09] tracking-[-0.03em] text-[#1d1d1f]">
                  Von der Analyse zur gelebten Strategie — in sieben Schritten.
                </h2>
                <div className="mt-7 h-px w-full bg-black/[0.06]" />
                <p className="mt-6 text-[15px] leading-relaxed text-[#6e6e73]">
                  Jeder Schritt baut auf dem vorherigen auf. Die Erarbeitung erfordert sorgfältige
                  Planung, tiefe Analyse und die Fähigkeit zur Anpassung.
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
                    {/* Continuous brass spine line */}
                    <div
                      className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px"
                      style={{
                        background:
                          "linear-gradient(to bottom, rgba(201,169,110,0.05), rgba(201,169,110,0.25) 8%, rgba(201,169,110,0.25) 92%, rgba(201,169,110,0.05))",
                      }}
                    />

                    <div className="space-y-8">
                      {prozessSchritte.map((step, i) => {
                        const isLeft = i % 2 === 0;
                        return (
                          <div
                            key={step.num}
                            className="relative grid grid-cols-2"
                          >
                            {/* Spine node — centered on the line */}
                            <div className="absolute left-1/2 top-5 z-10 -translate-x-1/2">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a96e]/40 bg-white text-[11px] font-semibold tabular-nums text-[#26337c] shadow-sm">
                                {step.num}
                              </div>
                            </div>

                            {/* Left cell */}
                            <div className="pr-10">
                              {isLeft ? <SpineCard step={step} /> : null}
                            </div>

                            {/* Right cell */}
                            <div className="pl-10">
                              {!isLeft ? <SpineCard step={step} /> : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ── Mobile: simple vertical list ── */}
                <div className="flex flex-col gap-4 lg:hidden">
                  {prozessSchritte.map((step) => (
                    <SpineCard key={step.num} step={step} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </MotionSection>
      </section>

      {/* ── IMAGE BREAK ──────────────────────────────────────────────────── */}
      <div className="relative h-[380px] overflow-hidden md:h-[480px]">
        <img
          src={contentImage}
          alt="Strategieprozess in der Praxis"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background:
              "linear-gradient(to top, rgba(26,31,56,0.55) 0%, transparent 55%), linear-gradient(to bottom, rgba(26,31,56,0.2) 0%, transparent 30%)",
          }}
        />
      </div>

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
            &ldquo;Die erfolgreiche Bewältigung erfordert eine ganzheitliche Herangehensweise,
            klare Kommunikation, aktive Einbindung der Stakeholder und die Fähigkeit zur
            Anpassung an sich ändernde Bedingungen.&rdquo;
          </blockquote>
          <div className="mt-10 flex items-center justify-center gap-5">
            <div className="h-px w-12 bg-[#c9a96e]/35" />
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/30">
              Abexis Strategie-Prinzip
            </span>
            <div className="h-px w-12 bg-[#c9a96e]/35" />
          </div>
        </div>
      </section>

      {/* ── 6. PITFALLS — Editorial newspaper list ───────────────────────── */}
      <MotionSection>
        <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.8fr] lg:gap-20 lg:items-start">
            {/* Left anchor */}
            <div className="lg:sticky lg:top-28">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                Kritische Aspekte
              </p>
              <h2 className="mt-4 text-[clamp(1.625rem,3.5vw+0.5rem,2.375rem)] font-semibold leading-[1.09] tracking-[-0.03em] text-[#1d1d1f]">
                Was eine Strategie scheitern lässt.
              </h2>
              <div className="mt-7 h-px w-full bg-black/[0.06]" />
              <p className="mt-6 text-[15px] leading-relaxed text-[#6e6e73]">
                Die häufigsten Hindernisse sind keine Überraschungen. Sie sind bekannt — und
                trotzdem werden sie in der Praxis immer wieder unterschätzt.
              </p>
              <div className="mt-8 h-px w-8 bg-[#c9a96e]/50" />
            </div>

            {/* Right: card grid */}
            <div className="grid gap-px overflow-hidden rounded-2xl border border-black/[0.06] bg-black/[0.04] sm:grid-cols-2">
              {fallstricke.map((f, i) => (
                <div key={f.title} className="relative bg-white px-6 py-6">
                  <LCorner className="top-3 right-3 text-[#c9a96e]/20" />
                  <p className="text-[11px] font-semibold tabular-nums tracking-[0.14em] text-[#45b3e2]">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-[17px] font-semibold leading-snug tracking-[-0.015em] text-[#1d1d1f]">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#6e6e73]">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MotionSection>

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
                  Die Perspektive, die intern fehlt — und den Unterschied macht.
                </h2>
              </div>
              <p className="text-[17px] leading-relaxed text-[#6e6e73] md:pb-1">
                Sie wissen, dass Ihr Unternehmen eine klare Strategie braucht. Zwischen
                Tagesgeschäft, Zeitdruck und unterschiedlichen Meinungen im Führungskreis bleibt
                dafür selten der nötige Raum. Genau hier setzen wir an.
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
                    title: "Fehlende interne Voraussetzungen",
                    body: "Zeit, Distanz zum Tagesgeschäft und methodische Erfahrung fehlen — die Voraussetzungen für einen soliden Strategieprozess sind intern nicht gegeben.",
                  },
                  {
                    num: "02",
                    title: "Divergierende Führungsperspektiven",
                    body: "Verwaltungsrat und Geschäftsleitung sehen die Zukunft verschieden. Externe Moderation hilft, divergierende Sichtweisen in eine gemeinsame Richtung zu überführen.",
                  },
                  {
                    num: "03",
                    title: "Strategische Entscheidungen mit hohem Einsatz",
                    body: "Manche Entscheidungen sind zu wichtig für Improvisation. Ein strukturierter Prozess mit externem Blick reduziert das Risiko kostspieliger Fehlentscheidungen.",
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

      {/* ── 8. CTA — Specific 30-min offer ───────────────────────────────── */}
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
                Strategische Klarheit entsteht nicht von selbst — aber mit dem richtigen Partner schneller.
              </h2>
              <p className="mt-5 max-w-[50ch] text-[16px] leading-relaxed text-white/65">
                In einem kostenlosen 30-Minuten-Erstgespräch klären wir gemeinsam, wo Ihr
                Unternehmen steht, was Sie erreichen wollen — und wie wir Sie dabei begleiten können.
              </p>

              {/* Offer details */}
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

          {/* L-corner decorative rule */}
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
