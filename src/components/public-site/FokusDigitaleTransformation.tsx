import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { PageHero } from "@/components/site/PageHero";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { fokusPageHeroImages } from "@/data/site-images";
import { fokusthemenMeta, siteConfig } from "@/data/pages";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";

const meta = fokusthemenMeta.find((m) => m.slug === "digitale-transformation")!;
const heroImage = fokusPageHeroImages["digitale-transformation"];

const handlungsfelder = [
  {
    num: "01",
    title: "Kundenorientierung",
    sub: "Kundeninteraktion & Customer Experience",
  },
  {
    num: "02",
    title: "Digitale Strategien",
    sub: "Geschäftsmodelle & Wettbewerbspositionierung",
  },
  {
    num: "03",
    title: "Führung & Kultur",
    sub: "Unternehmenskultur, Mitarbeiter & Organisation",
  },
  {
    num: "04",
    title: "Prozessoptimierung",
    sub: "Geschäftsprozesse optimieren und automatisieren",
  },
  {
    num: "05",
    title: "Plattformen & Kanäle",
    sub: "Absatz- und Kommunikationskanäle",
  },
  {
    num: "06",
    title: "Technologien",
    sub: "Industrie 4.0, IoT, KI & Apps",
  },
  {
    num: "07",
    title: "IT-Infrastruktur",
    sub: "Cloud, Daten, Blockchain & moderne Lösungen",
  },
];

const phasen = [
  {
    num: "01",
    label: "Vorbereitung",
    items: ["Projekt definieren", "Ziele festlegen", "Team zusammenstellen", "Budget planen"],
  },
  {
    num: "02",
    label: "Analyse",
    items: ["Marktanalyse", "Kunden & Konkurrenz", "Technologietrends", "Ist-Situation ermitteln"],
  },
  {
    num: "03",
    label: "Planung",
    items: ["Vision & Strategie", "Kernkompetenzen", "Ökosystem gestalten", "Messbare Ziele"],
  },
  {
    num: "04",
    label: "Umsetzung",
    items: ["Agile Methodik", "Strategie umsetzen", "Kontinuierlich prüfen", "Justierungen vornehmen"],
  },
];

const nutzen = [
  { title: "Kosten & Ertrag", body: "Kosten reduzieren, Produktivität und Umsatz bzw. Gewinn erhöhen." },
  { title: "Datenqualität", body: "Datenbasierte Erkenntnisse, höhere Datenqualität und weniger Fehler durch Automatisierung." },
  { title: "Kundenerlebnis", body: "Besseres Erlebnis bei Beschaffung und Kundenservice — höhere Zufriedenheit." },
  { title: "Transparenz", body: "Transparentere Informationspolitik gegenüber Kunden und Lieferanten." },
  { title: "Neue Märkte", body: "Neue Produkte und Leistungen erschliessen neue Kundenpotenziale." },
  { title: "Zusammenarbeit", body: "Mehr Kollaboration und bessere Kommunikation durch eine gemeinsame Plattform." },
  { title: "Geschwindigkeit", body: "Schnellere Durchlaufzeiten dank effizienter, automatisierter Prozesse." },
  { title: "Zukunftsfähigkeit", body: "Investitionen in Digitalisierung sichern den Vorsprung gegenüber dem Wettbewerb." },
];

/** L-shaped corner accent — brand signature motif */
function LCorner({ className = "" }: { className?: string }) {
  return (
    <span className={`pointer-events-none absolute ${className}`} aria-hidden>
      <span className="block h-4 w-px bg-current" />
      <span className="block h-px w-4 bg-current" />
    </span>
  );
}

export function FokusDigitaleTransformation() {
  return (
    <InteriorPageRoot>
      <SchemaMarkup type="Service" data={meta} />
      <SchemaMarkup
        type="BreadcrumbList"
        data={[
          { name: "Startseite", url: "/" },
          { name: "Leistungen", url: "/leistungen" },
          { name: meta.title, url: `/fokusthemen/digitale-transformation` },
        ]}
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <PageHero imageSrc={heroImage} priority>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
          {meta.subtitle}
        </p>
        <h1 className="mt-3 max-w-[20ch] text-[clamp(2.25rem,7vw+0.5rem,4rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-white text-balance">
          {meta.title}
        </h1>
        <p className="mt-6 max-w-[52ch] text-[clamp(1rem,1.5vw+0.5rem,1.25rem)] leading-relaxed text-white/82 text-balance">
          {meta.excerpt}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/kontakt"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-[#26337c] transition-all hover:bg-white/90 hover:scale-[1.02]"
          >
            Gespräch vereinbaren
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

      {/* ── Intro strip ──────────────────────────────────────────────── */}
      <MotionSection>
        <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-[1fr_auto] md:gap-20 md:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#45b3e2]">
                Transformationsauftrag
              </p>
              <h2 className="mt-4 max-w-[28ch] text-[clamp(1.625rem,4vw+0.5rem,2.625rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f] text-balance">
                Digitale Transformation als strategische Initiative — nicht als IT-Projekt.
              </h2>
            </div>
            <div className="max-w-[38ch] md:pb-1">
              <p className="text-[17px] leading-relaxed text-[#6e6e73]">
                Digitale Transformationsprogramme können viele Formen annehmen — von gezielten
                Optimierungen bis hin zu vollständigen Turnarounds. Entscheidend ist ein klares Bild
                der Ziele, bevor die Strategie erarbeitet wird.
              </p>
            </div>
          </div>

          {/* Stat strip */}
          <div className="mt-14 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-black/[0.06] bg-black/[0.04] md:rounded-3xl">
            {[
              { value: "7", label: "Handlungsfelder" },
              { value: "4", label: "Prozessphasen" },
              { value: "8", label: "Nutzendimensionen" },
            ].map(({ value, label }) => (
              <div key={label} className="relative bg-white/90 px-6 py-7 md:px-10 md:py-9 backdrop-blur-sm">
                <LCorner className="top-3 left-3 text-[#c9a96e]/60" />
                <p className="text-[clamp(2rem,6vw,3rem)] font-semibold tracking-[-0.04em] text-[#26337c]">
                  {value}
                </p>
                <p className="mt-1 text-[13px] font-medium text-[#6e6e73]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </MotionSection>

      {/* ── Handlungsfelder ──────────────────────────────────────────── */}
      <section id="handlungsfelder" className="bg-[#f5f5f7]">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-24">
            <div className="flex items-baseline justify-between gap-8 border-b border-black/[0.07] pb-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                Handlungsfelder
              </p>
              <span className="text-[11px] text-[#86868b]">07 Dimensionen</span>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {handlungsfelder.map((f) => (
                <div
                  key={f.num}
                  className="group relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white px-6 pt-5 pb-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#26337c]/20 hover:shadow-[0_12px_40px_rgba(38,51,124,0.10)]"
                >
                  {/* L-corner accent, appears on hover */}
                  <LCorner className="top-3 right-3 text-[#c9a96e]/0 transition-colors duration-300 group-hover:text-[#c9a96e]" />

                  <p className="text-[11px] font-semibold tabular-nums tracking-[0.12em] text-[#45b3e2]">
                    {f.num}
                  </p>
                  <h3 className="mt-3 text-[15px] font-semibold leading-[1.3] tracking-[-0.015em] text-[#1d1d1f]">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-snug text-[#6e6e73]">{f.sub}</p>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#26337c] to-[#45b3e2] transition-all duration-500 group-hover:w-full" />
                </div>
              ))}

              {/* Quote card — last item fills remainder */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#26337c] to-[#1a2260] px-6 pt-5 pb-6 sm:col-span-2 lg:col-span-1">
                <LCorner className="top-3 right-3 text-[#c9a96e]/60" />
                <p className="mt-1 text-[13px] font-medium uppercase tracking-[0.14em] text-[#45b3e2]/80">
                  Abexis
                </p>
                <p className="mt-4 text-[15px] font-medium leading-relaxed text-white/90">
                  &ldquo;Es muss nicht immer das volle Programm sein — manchmal genügt ein gezielter
                  Teilaspekt.&rdquo;
                </p>
                <div className="mt-6 h-px w-8 bg-[#c9a96e]/60" />
              </div>
            </div>
          </div>
        </MotionSection>
      </section>

      {/* ── Prozessphasen (dark navy) ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#1a1f38]">
        {/* Subtle radial glow */}
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

            <h2 className="mt-8 max-w-[24ch] text-[clamp(1.5rem,3.5vw+0.5rem,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
              Vom Kick-off zur lebenden Strategie — strukturiert, iterativ, messbar.
            </h2>

            {/* Phase grid */}
            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-4">
              {phasen.map((phase, i) => (
                <div key={phase.num} className="relative flex flex-col bg-[#1a1f38]/60 px-6 py-8 backdrop-blur-sm">
                  {/* Phase connector line (not last) */}
                  {i < phasen.length - 1 && (
                    <div className="absolute top-8 right-0 hidden h-[1px] w-px bg-white/[0.08] lg:block" />
                  )}

                  <p
                    className="text-[3rem] font-semibold leading-none tracking-[-0.05em]"
                    style={{ color: `rgba(201,169,110,${0.35 + i * 0.15})` }}
                  >
                    {phase.num}
                  </p>
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
                    {phase.label}
                  </p>
                  <ul className="mt-4 flex flex-col gap-2">
                    {phase.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[13px] text-white/65">
                        <span className="mt-[5px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#45b3e2]/50" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {/* Bottom brass accent */}
                  <div className="mt-auto pt-8">
                    <div className="h-px w-6 bg-[#c9a96e]/40" />
                  </div>
                </div>
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

      {/* ── Nutzen ───────────────────────────────────────────────────── */}
      <MotionSection>
        <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-20 lg:items-start">
            {/* Left: heading */}
            <div className="lg:sticky lg:top-28">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                Nutzen
              </p>
              <h2 className="mt-4 text-[clamp(1.75rem,4vw+0.5rem,2.875rem)] font-semibold leading-[1.07] tracking-[-0.03em] text-[#1d1d1f]">
                Was richtig umgesetzte Digitalisierung bringt.
              </h2>
              <div className="mt-8 h-px w-full bg-black/[0.06]" />
              <p className="mt-8 text-[17px] leading-relaxed text-[#6e6e73]">
                Eine erfolgreiche digitale Transformation erzeugt Mehrwert auf mehreren Ebenen —
                operativ, strategisch und kulturell.
              </p>

              <Link
                href="/kontakt"
                className="mt-10 inline-flex items-center gap-3 text-[14px] font-semibold text-[#26337c] transition-all hover:gap-4"
              >
                Unverbindliches Gespräch
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            {/* Right: benefit cards */}
            <div className="grid gap-3 sm:grid-cols-2">
              {nutzen.map((n, i) => (
                <div
                  key={n.title}
                  className="group relative rounded-2xl border border-black/[0.06] bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#26337c]/15 hover:shadow-[0_8px_32px_rgba(38,51,124,0.08)]"
                >
                  <LCorner className="top-3 left-3 text-[#c9a96e]/0 transition-colors duration-300 group-hover:text-[#c9a96e]/70" />
                  <p
                    className="text-[10px] font-semibold tabular-nums tracking-[0.14em]"
                    style={{ color: i % 2 === 0 ? "#45b3e2" : "#26337c" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-[14px] font-semibold tracking-[-0.01em] text-[#1d1d1f]">
                    {n.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-snug text-[#6e6e73]">{n.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MotionSection>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          aria-hidden
          style={{
            background: "linear-gradient(115deg, #26337c 0%, #3550a4 42%, #45b3e2 100%)",
          }}
        />
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 -z-10 opacity-20"
          aria-hidden
          style={{
            backgroundImage: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)",
          }}
        />

        <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
                Jetzt starten
              </p>
              <h2 className="mt-4 max-w-[28ch] text-[clamp(1.5rem,3.5vw+0.5rem,2.375rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white text-balance">
                Besser früher als spät mit der Digitalen Transformation beginnen.
              </h2>
              <p className="mt-5 max-w-[48ch] text-[16px] leading-relaxed text-white/65">
                Dazu benötigen Sie nicht nur Ratschläge, sondern Begleiter, die auch Verantwortung
                übernehmen wollen. Nehmen Sie für einen unverbindlichen Austausch Kontakt auf.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:shrink-0">
              <Link
                href="/kontakt"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 text-[14px] font-semibold text-[#26337c] shadow-lg transition-all hover:bg-white/90 hover:scale-[1.02]"
              >
                Kontakt aufnehmen
              </Link>
              <Link
                href={siteConfig.bookingUrlDe}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-8 text-[14px] font-semibold text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/10"
              >
                Termin buchen
              </Link>
            </div>
          </div>

          {/* Decorative divider with L-corner motif */}
          <div className="mt-16 flex items-center gap-4 opacity-25">
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
