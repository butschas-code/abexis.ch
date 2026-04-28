import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { HeroProjectRealityCheckCta } from "@/components/site/HeroProjectRealityCheckCta";
import { PageHero } from "@/components/site/PageHero";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { fokusPageHeroImages } from "@/data/site-images";
import { fokusthemenMeta, siteConfig } from "@/data/pages";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";

// ─── Static data : module level, no re-allocation ────────────────────────────

const meta = fokusthemenMeta.find((m) => m.slug === "veränderungsmanagement")!;
const heroImage = fokusPageHeroImages["veränderungsmanagement"];
const contentImage = "https://firebasestorage.googleapis.com/v0/b/abexis-cms.firebasestorage.app/o/cms%2Fmedia%2Fmigrated%2F3f6bff6e-7e5a-4da7-92ad-f900954f953f.jpeg?alt=media";

const handlungsfelder = [
  {
    num: "01",
    title: "Change Readiness & Diagnose",
    items: [
      "Veränderungsbereitschaft in der Organisation messen",
      "Risiken, Widerstände und Enabler frühzeitig identifizieren",
      "Ausgangslage und Zielbild klar gegenüberstellen",
    ],
  },
  {
    num: "02",
    title: "Führung & Sponsorship",
    items: [
      "Führungskräfte als sichtbare Treiber des Wandels befähigen",
      "Aktives Sponsorship auf Ebene Geschäftsleitung sicherstellen",
      "Kohärenz zwischen Aussage und Verhalten der Führung herstellen",
    ],
  },
  {
    num: "03",
    title: "Stakeholder-Management",
    items: [
      "Einfluss- und Interessensgruppen systematisch kartieren",
      "Gezielte Einbindungsstrategien je Stakeholdergruppe entwickeln",
      "Kritische Akteure frühzeitig zu Mitgestaltenden machen",
    ],
  },
  {
    num: "04",
    title: "Kommunikation & Transparenz",
    items: [
      "Botschaften klar, konsistent und zielgruppengerecht gestalten",
      "Kommunikationsrhythmus und Kanäle strukturiert aufbauen",
      "Unsicherheiten direkt ansprechen statt ignorieren",
    ],
  },
  {
    num: "05",
    title: "Mitarbeiterbeteiligung & Co-creation",
    items: [
      "Betroffene zu Beteiligten machen : auf allen Ebenen",
      "Rückmeldeschlaufen und Feedbackformate etablieren",
      "Lösungen gemeinsam entwickeln statt verordnen",
    ],
  },
  {
    num: "06",
    title: "Kompetenzaufbau & Training",
    items: [
      "Neue Fähigkeiten und Verhaltensweisen gezielt aufbauen",
      "Führungskräfte im Umgang mit Widerstand schulen",
      "Lernformate an den Wandelprozess anpassen",
    ],
  },
  {
    num: "07",
    title: "Verankerung & Nachhaltigkeit",
    items: [
      "Neue Arbeitsweisen in Strukturen und Prozessen verankern",
      "Erfolge sichtbar machen und feiern",
      "Rückfallmuster erkennen und frühzeitig gegensteuern",
    ],
  },
] as const;

const prozessphasen = [
  {
    num: "01",
    title: "Diagnose & Vorbereitung",
    items: [
      "Ausgangslage, Zielbild und Veränderungstiefe bestimmen",
      "Stakeholder und Risiken kartieren",
      "Change-Koalition und Sponsorship sicherstellen",
      "Rahmenbedingungen und Ressourcen klären",
    ],
  },
  {
    num: "02",
    title: "Planung & Design",
    items: [
      "Change-Strategie und Roadmap entwickeln",
      "Kommunikations- und Beteiligungskonzept erarbeiten",
      "Führungskräfte und Multiplikatoren vorbereiten",
      "Quick Wins identifizieren und einplanen",
    ],
  },
  {
    num: "03",
    title: "Implementierung & Begleitung",
    items: [
      "Massnahmen rollieren und Fortschritt messen",
      "Widerstand erkennen und konstruktiv bearbeiten",
      "Kommunikation kontinuierlich aufrechterhalten",
      "Lernschlaufen einbauen und Anpassungen vornehmen",
    ],
  },
  {
    num: "04",
    title: "Verankerung & Transfer",
    items: [
      "Neues Verhalten in Prozessen und Strukturen festigen",
      "Wirkung messen und dokumentieren",
      "Interne Change-Kompetenz nachhaltig aufbauen",
    ],
  },
] as const;

const nutzen = [
  {
    num: "01",
    title: "Höhere Akzeptanz",
    body: "Wenn Menschen den Wandel mitgestalten, tragen sie ihn mit : statt ihn zu bremsen.",
  },
  {
    num: "02",
    title: "Geringeres Risiko",
    body: "Strukturiertes Vorgehen reduziert die Wahrscheinlichkeit kostspieliger Rückschläge und Projektverzögerungen.",
  },
  {
    num: "03",
    title: "Schnellere Umsetzung",
    body: "Klare Kommunikation und aktive Führung vermeiden Orientierungslosigkeit und Lähmung.",
  },
  {
    num: "04",
    title: "Kulturwandel",
    body: "Veränderungen, die tief verankert sind, verändern auch Haltungen und Arbeitsweisen dauerhaft.",
  },
  {
    num: "05",
    title: "Mitarbeiterbindung",
    body: "Wer in Veränderungen einbezogen wird, fühlt sich gehört : das stärkt Motivation und Loyalität.",
  },
  {
    num: "06",
    title: "Führungskompetenz",
    body: "Führungskräfte, die Wandel aktiv gestalten, wachsen in ihrer Wirksamkeit und Glaubwürdigkeit.",
  },
  {
    num: "07",
    title: "Projekterfolg",
    body: "Transformationen mit professionellem Change Management erreichen ihre Ziele häufiger, schneller und nachhaltiger.",
  },
  {
    num: "08",
    title: "Organisationale Resilienz",
    body: "Unternehmen, die Wandel meistern, werden besser darin : und sind für künftige Veränderungen gewappnet.",
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

export function FokusVeraenderungsmanagement() {
  return (
    <InteriorPageRoot>
      <SchemaMarkup
        type="Service"
        path="/fokusthemen/veränderungsmanagement"
        name={meta.title}
        data={meta}
        breadcrumbs={[
          { name: "Startseite", url: "/" },
          { name: "Leistungen", url: "/leistungen" },
          { name: meta.title, url: "/fokusthemen/veränderungsmanagement" },
        ]}
      />

      {/* ── 1. HERO ──────────────────────────────────────────────────────── */}
      <PageHero imageSrc={heroImage} priority>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
          {meta.subtitle}
        </p>
        <h1 className="mt-3 max-w-[22ch] text-[clamp(2.25rem,7vw+0.5rem,3.875rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-white text-balance">
          Veränderung scheitert nicht an der Strategie : sie scheitert an den Menschen.
        </h1>
        <p className="mt-6 max-w-[50ch] text-[clamp(1rem,1.5vw+0.5rem,1.175rem)] leading-relaxed text-white/80 text-balance">
          Wenn Wandel von oben verordnet statt gemeinsam gestaltet wird, entsteht Widerstand,
          Unsicherheit und Lähmung. Wir begleiten Organisationen dabei, Veränderungen so zu
          führen, dass Menschen mitgehen : und Ergebnisse nachhaltig verankert bleiben.
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

      {/* ── 2. SPLIT PANEL : Veränderungsmanagement vs. Projektmanagement ── */}
      <MotionSection>
        <div className="overflow-hidden md:grid md:grid-cols-2">
          {/* Left half : navy */}
          <div className="relative bg-[#1a2260]">
            <div className="relative ml-auto max-w-[534px] px-8 py-14 md:px-12 md:py-20">
              <LCorner className="top-6 left-6 text-[#45b3e2]/30" />
              <div className="mb-6 h-[3px] w-10 rounded-full bg-[#45b3e2]/50" />
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
                Dimension 1
              </h2>
              <h3 className="mt-3 text-[clamp(1.375rem,3vw+0.5rem,1.875rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-white">
                Projektmanagement
              </h3>
              <p className="mt-5 text-[16px] leading-relaxed text-white/65">
                Steuert Scope, Zeit, Budget und Qualität. Es sorgt dafür, dass die richtigen Dinge
                in der richtigen Reihenfolge umgesetzt werden : technisch korrekt und termingerecht.
              </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#26337c] via-[#45b3e2]/60 to-transparent" />
          </div>

          {/* Right half : warm linen */}
          <div className="relative bg-[#faf8f2]">
            <div className="relative mr-auto max-w-[534px] px-8 py-14 md:px-12 md:py-20">
              <LCorner className="top-6 left-6 text-[#c9a96e]/40" />
              <div className="mb-6 h-[3px] w-10 rounded-full bg-[#c9a96e]/60" />
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                Dimension 2
              </h2>
              <h3 className="mt-3 text-[clamp(1.375rem,3vw+0.5rem,1.875rem)] font-semibold leading-[1.1] tracking-[-0.025em] text-[#1d1d1f]">
                Veränderungsmanagement
              </h3>
              <p className="mt-5 text-[16px] leading-relaxed text-[#6e6e73]">
                Sorgt dafür, dass Menschen die Veränderung verstehen, akzeptieren und mittragen.
                Ohne diese menschliche Dimension scheitern selbst technisch perfekte Projekte ,
                im Widerstand, in der Ablehnung oder im stillen Boykott.
              </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#c9a96e]/60 via-[#c9a96e]/20 to-transparent" />
          </div>
        </div>
      </MotionSection>

      {/* ── 3. HANDLUNGSFELDER : Alternating spine ───────────────────────── */}
      <section id="handlungsfelder" className="bg-[#f5f5f7]">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-24">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.8fr] lg:gap-16">
              {/* Left: sticky anchor */}
              <div className="lg:sticky lg:top-28 lg:self-start">
                <h2 className="text-[clamp(1.625rem,3.5vw+0.5rem,2.375rem)] font-semibold leading-[1.09] tracking-[-0.03em] text-[#1d1d1f]">
                  Sieben Dimensionen wirksamen Wandels.
                </h2>
                <div className="mt-7 h-px w-full bg-black/[0.06]" />
                <p className="mt-6 text-[15px] leading-relaxed text-[#6e6e73]">
                  Veränderung gelingt, wenn alle relevanten Dimensionen gleichzeitig adressiert
                  werden : technisch, organisatorisch und menschlich.
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

              {/* Right: alternating spine : desktop / simple list : mobile */}
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

      {/* ── IMAGE BREAK ──────────────────────────────────────────────────── */}
      <div className="relative h-[380px] overflow-hidden md:h-[480px]">
        <img
          src={contentImage}
          alt="Change Management in der Praxis"
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
            &ldquo;Organisatorischer Wandel ist kein Ereignis : er ist ein Prozess. Wer ihn
            iterativ gestaltet, Menschen einbezieht und Unsicherheiten direkt adressiert,
            verändert nicht nur Strukturen, sondern Haltungen.&rdquo;
          </blockquote>
          <div className="mt-10 flex items-center justify-center gap-5">
            <div className="h-px w-12 bg-[#c9a96e]/35" />
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/30">
              Abexis Change-Prinzip
            </span>
            <div className="h-px w-12 bg-[#c9a96e]/35" />
          </div>
        </div>
      </section>

      {/* ── 5. PROZESSPHASEN : Dark navy phase grid ──────────────────────── */}
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
              Von der Diagnose zur verankerten Veränderung : iterativ, messbar, nachhaltig.
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
              Unser Ansatz ist bewusst iterativ: Zwischen den Phasen gibt es Schlaufen, nicht nur
              Pfeile. Erkenntnisse aus der Umsetzung fliessen zurück in Planung und Kommunikation ,
              damit die Veränderung lebendig bleibt statt zu erstarren.
            </p>
          </div>
        </MotionSection>
      </section>

      {/* ── 6. NUTZEN : Sticky left + card grid ──────────────────────────── */}
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
                  Was professionelles Change Management bewirkt.
                </h2>
                <div className="mt-7 h-px w-full bg-black/[0.06]" />
                <p className="mt-6 text-[15px] leading-relaxed text-[#6e6e73]">
                  Der Unterschied liegt nicht darin, ob Veränderung stattfindet : sondern wie
                  sie gestaltet wird. Struktur, Einbezug und Führung entscheiden über Erfolg
                  oder Scheitern.
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

      {/* ── 7. GUIDE : Unsere Rolle ──────────────────────────────────────── */}
      <section className="bg-white">
        <MotionSection>
          <div className="mx-auto max-w-[1068px] px-6 py-16 md:py-28">

            {/* Header : two-column */}
            <div className="grid gap-8 border-b border-black/[0.06] pb-12 md:grid-cols-[1fr_1fr] md:gap-20 md:items-end">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
                  Unsere Rolle
                </p>
                <h2 className="mt-4 text-[clamp(1.625rem,3.5vw+0.5rem,2.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f]">
                  Der Unterschied zwischen verordnetem und getragenem Wandel.
                </h2>
              </div>
              <p className="text-[17px] leading-relaxed text-[#6e6e73] md:pb-1">
                Veränderungen scheitern selten an der Idee : sie scheitern an der Umsetzung.
                Wir bringen Methodik, externe Perspektive und die Erfahrung aus vielen
                Transformationen mit, damit Ihr Wandel gelingt.
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
                    title: "Transformation droht zu scheitern",
                    body: "Ein laufendes Projekt stösst auf Widerstand, Verzögerungen oder schwindende Unterstützung. Es braucht jetzt eine ehrliche Diagnose und gezielte Gegenmassnahmen.",
                  },
                  {
                    num: "02",
                    title: "Fehlende interne Change-Kompetenz",
                    body: "Das Unternehmen steht vor einer grösseren Veränderung : aber intern fehlen Erfahrung, Methodik und Kapazität, um sie professionell zu begleiten.",
                  },
                  {
                    num: "03",
                    title: "Komplexe Stakeholder-Landschaft",
                    body: "Verschiedene Interessensgruppen ziehen in unterschiedliche Richtungen. Eine neutrale, externe Begleitung schafft die nötige Glaubwürdigkeit, um alle ins Boot zu holen.",
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
                Veränderung gelingt : wenn sie gut begleitet wird.
              </h2>
              <p className="mt-5 max-w-[50ch] text-[16px] leading-relaxed text-white/65">
                In einem kostenlosen 30-Minuten-Erstgespräch klären wir gemeinsam, wo Ihre
                Organisation steht, welche Veränderung ansteht : und wie wir Sie dabei
                begleiten können.
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
