"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { PublicImage as Image } from "@/components/site/PublicImage";
import { danielSengstagImages } from "@/data/daniel-sengstag";

type SelfTestLocale = "de" | "en";

const COPY = {
  de: {
    questions: [
      { dim: "Zielklarheit & Scope", text: "Ziele, Umfang und Erfolgskriterien des Vorhabens sind klar definiert und alle zentralen Stakeholder verstehen darunter dasselbe." },
      { dim: "Sponsorship & Governance", text: "Das Vorhaben hat einen aktiven Sponsor und ein funktionierendes Steuerungsgremium, das Entscheide zeitnah trifft." },
      { dim: "Status-Transparenz", text: "Ich vertraue der Statusberichterstattung. Wenn ein Bericht grün zeigt, ist es auch wirklich grün." },
      { dim: "Planungsrealismus", text: "Der Termin- und Kostenplan beruht auf einer fundierten Schätzung, nicht auf einem Wunschtermin." },
      { dim: "Ressourcen & Team", text: "Die richtigen Personen sind mit ausreichend Kapazität im Projekt. Schlüsselrollen sind besetzt und nicht überlastet." },
      { dim: "Risikomanagement", text: "Die wichtigsten Risiken sind bekannt, haben einen Verantwortlichen und werden aktiv gesteuert, nicht nur in einer Liste verwaltet." },
      { dim: "Termin & Budget", text: "Das Vorhaben liegt im Plan, ohne wiederholte Termin- oder Budgetverschiebungen." },
      { dim: "Entscheidungstempo", text: "Notwendige Entscheide werden schnell getroffen. Das Projekt wartet selten auf Beschlüsse." },
      { dim: "Anforderungen & Änderungen", text: "Anforderungen sind stabil und Änderungen werden kontrolliert bewertet, ohne schleichenden Scope-Zuwachs." },
      { dim: "Akzeptanz & Change", text: "Die betroffene Organisation ist eingebunden und auf die Veränderung vorbereitet. Die Akzeptanz ist sichergestellt." },
      { dim: "Abhängigkeiten & Lieferanten", text: "Abhängigkeiten zu anderen Projekten, Lieferanten und Systemen sind transparent und unter Kontrolle." },
      { dim: "Liefer-Zuversicht", text: "Wenn ich ehrlich bin, bin ich zuversichtlich, dass das Vorhaben in Zeit, Budget und Qualität liefert." },
    ],
    options: ["Trifft voll zu", "Trifft eher zu", "Trifft eher nicht zu", "Trifft nicht zu"],
    results: {
      green: { word: "Grün - auf Kurs", head: "Ihr Vorhaben steht auf solider Grundlage.", para: "Die Kernfaktoren stimmen. Halten Sie die Disziplin und schärfen Sie die wenigen offenen Punkte gezielt nach, damit aus einem guten Stand ein sicheres Ergebnis wird." },
      yellow: { word: "Gelb - wachsam sein", head: "Es zeigen sich erste Warnsignale.", para: "Einzelne Bereiche sind verwundbar. Jetzt ist der richtige Zeitpunkt für eine unabhängige Standortbestimmung, bevor aus Risiken echte Probleme werden und der Handlungsspielraum schrumpft." },
      red: { word: "Rot - Handlungsbedarf", head: "Mehrere kritische Schwachstellen gefährden das Ergebnis.", para: "Die Signale sprechen für ein Vorhaben, das ohne Gegensteuern aus dem Ruder läuft. Eine unabhängige, schonungslose Standortbestimmung schafft jetzt Klarheit und die Basis für den Kurswechsel." },
    },
    eyebrow: "Selbsttest · 12 Fragen",
    questionOf: (n: number, total: number) => ["Frage", `von ${total}`, n] as const,
    intro: "Zwölf kurze Aussagen geben Ihnen in fünf Minuten eine ehrliche Standortbestimmung. Es werden keine Daten gespeichert oder übermittelt.",
    back: "← Zurück",
    resultEyebrow: "Ihr ehrlicher Projektstatus",
    pointsOf: (max: number) => `von ${max} Punkten`,
    criticalStrong: "Einzelne Antworten wiegen schwer.",
    criticalRest: "Fehlendes Vertrauen in den Status, ein schwacher Sponsor oder geringe Liefer-Zuversicht sind Warnsignale, unabhängig vom Gesamtergebnis.",
    focusHeading: "Worauf Sie jetzt achten sollten",
    ctaHead: "Schaffen Sie Gewissheit mit einem Project Reality Check.",
    ctaBody: "In wenigen Tagen erhalten Sie eine unabhängige Standortbestimmung Ihres Vorhabens: eine belastbare Entscheidungsgrundlage für Ihren Lenkungsausschuss, zum Fixpreis. Und falls nötig, bringen wir das Projekt wieder auf Kurs.",
    ctaPrimary: "Project Reality Check anfragen",
    ctaPrimaryHref: "/kontakt",
    ctaSecondary: "Mehr erfahren",
    ctaSecondaryHref: "/projectrealitycheck",
    restart: "Selbsttest wiederholen",
    portraitRole: "Gründer und Inhaber",
  },
  en: {
    questions: [
      { dim: "Goals & scope", text: "The goals, scope and success criteria of the initiative are clearly defined, and all key stakeholders understand them the same way." },
      { dim: "Sponsorship & governance", text: "The initiative has an active sponsor and a functioning steering committee that takes decisions promptly." },
      { dim: "Status transparency", text: "I trust the status reporting. When a report shows green, it really is green." },
      { dim: "Realistic planning", text: "The schedule and cost plan are based on a sound estimate, not on a wished-for date." },
      { dim: "Resources & team", text: "The right people are on the project with enough capacity. Key roles are filled and not overloaded." },
      { dim: "Risk management", text: "The main risks are known, have an owner and are actively managed, not just kept in a list." },
      { dim: "Schedule & budget", text: "The initiative is on plan, without repeated schedule or budget shifts." },
      { dim: "Decision speed", text: "Necessary decisions are taken quickly. The project rarely waits for approvals." },
      { dim: "Requirements & changes", text: "Requirements are stable and changes are assessed in a controlled way, without creeping scope growth." },
      { dim: "Acceptance & change", text: "The affected organisation is involved and prepared for the change. Acceptance is ensured." },
      { dim: "Dependencies & suppliers", text: "Dependencies on other projects, suppliers and systems are transparent and under control." },
      { dim: "Delivery confidence", text: "If I am honest, I am confident that the initiative will deliver on time, on budget and to the required quality." },
    ],
    options: ["Fully agree", "Somewhat agree", "Somewhat disagree", "Disagree"],
    results: {
      green: { word: "Green - on track", head: "Your initiative stands on a solid foundation.", para: "The core factors are right. Keep up the discipline and sharpen the few open points so that a good position becomes a secure result." },
      yellow: { word: "Amber - stay alert", head: "First warning signs are showing.", para: "Some areas are vulnerable. Now is the right time for an independent assessment, before risks turn into real problems and your room for manoeuvre shrinks." },
      red: { word: "Red - action needed", head: "Several critical weaknesses put the result at risk.", para: "The signals point to an initiative that will get out of hand without corrective action. An independent, candid assessment now creates clarity and the basis for a change of course." },
    },
    eyebrow: "Self-test · 12 questions",
    questionOf: (n: number, total: number) => ["Question", `of ${total}`, n] as const,
    intro: "Twelve short statements give you an honest assessment in five minutes. No data is stored or transmitted.",
    back: "← Back",
    resultEyebrow: "Your honest project status",
    pointsOf: (max: number) => `of ${max} points`,
    criticalStrong: "Some answers carry extra weight.",
    criticalRest: "A lack of trust in the status, a weak sponsor or low delivery confidence are warning signs, regardless of the overall result.",
    focusHeading: "What to pay attention to now",
    ctaHead: "Gain certainty with a Project Reality Check.",
    ctaBody: "Within a few days, you receive an independent assessment of your initiative: a sound basis for your steering committee's decisions, at a fixed price. And if needed, we bring the project back on track.",
    ctaPrimary: "Request a Project Reality Check",
    ctaPrimaryHref: "/en/kontakt",
    ctaSecondary: "Learn more",
    ctaSecondaryHref: "/en/projectrealitycheck",
    restart: "Repeat the self-test",
    portraitRole: "Founder and owner",
  },
};

const OPTION_VALUES = [3, 2, 1, 0] as const;
const CRITICAL_INDEXES = [1, 2, 11] as const;
const QUESTION_COUNT = COPY.de.questions.length;
const MAX_SCORE = QUESTION_COUNT * 3;

type Step = "quiz" | "result";

function resultForScore(total: number, locale: SelfTestLocale) {
  const r = COPY[locale].results;
  if (total >= 28) return { ...r.green, color: "#2E9E6B" };
  if (total >= 18) return { ...r.yellow, color: "#E0A526" };
  return { ...r.red, color: "#D2473D" };
}

export function ProjectSelfTest({
  id = "projekt-selbsttest",
  locale = "de",
}: {
  id?: string;
  locale?: SelfTestLocale;
}) {
  const t = COPY[locale];
  const QUESTIONS = t.questions;
  const [step, setStep] = useState<Step>("quiz");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<number | null>>(() => Array(QUESTION_COUNT).fill(null));
  const sectionRef = useRef<HTMLElement | null>(null);

  const total = useMemo(() => answers.reduce<number>((sum, value) => sum + (value ?? 0), 0), [answers]);
  const result = resultForScore(total, locale);
  const weakest = useMemo(
    () =>
      QUESTIONS.map((q, i) => ({ dim: q.dim, value: answers[i] ?? 0 }))
        .filter((item) => item.value <= 1)
        .sort((a, b) => a.value - b.value)
        .slice(0, 3),
    [answers, QUESTIONS],
  );
  const hasCriticalSignal = CRITICAL_INDEXES.some((i) => (answers[i] ?? 0) <= 1);
  const progress = step === "result" ? 100 : Math.round(((index + 1) / QUESTIONS.length) * 100);
  const ringDash = 352 * (1 - total / MAX_SCORE);

  function keepBlockInView() {
    window.setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 90);
  }

  function answer(value: number) {
    setAnswers((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
    window.setTimeout(() => {
      if (index < QUESTIONS.length - 1) {
        setIndex((current) => current + 1);
      } else {
        setStep("result");
      }
      keepBlockInView();
    }, 180);
  }

  function back() {
    if (index === 0) return;
    setIndex((current) => current - 1);
  }

  function restart() {
    setAnswers(Array(QUESTION_COUNT).fill(null));
    setIndex(0);
    setStep("quiz");
    keepBlockInView();
  }

  const question = QUESTIONS[index];

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_100%_70%_at_50%_-10%,rgba(38,51,124,0.09),transparent_52%),linear-gradient(180deg,#fbfbfd_0%,#f1f4fb_100%)] py-14 sm:py-20 md:py-24"
    >
      <div className="mx-auto max-w-[1068px] px-4 sm:px-6">
        <div className="grid items-stretch gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(250px,300px)] lg:gap-6">
          <div className="overflow-hidden rounded-[24px] border border-[#dfe5f0] bg-white shadow-[0_24px_70px_-42px_rgba(27,37,92,0.62)]">
            {step === "quiz" ? (
              <div className="px-6 py-8 sm:px-9 md:px-10 md:py-9">
                <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#4A90D9]">
                  {t.eyebrow}
                </p>
                <div className="mt-4 border-t border-[#e3e8f0] pt-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[14px] font-semibold text-brand-900">
                      {t.questionOf(index + 1, QUESTIONS.length)[0]} <span className="text-[#4A90D9]">{index + 1}</span>{" "}
                      {t.questionOf(index + 1, QUESTIONS.length)[1]}
                    </p>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#6b7180]">{question.dim}</p>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e3e8f0]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#4A90D9] to-brand-900 transition-[width] duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div key={index} className="mt-5">
                    <h2 className="text-[22px] font-semibold leading-snug tracking-[-0.02em] text-brand-900 md:text-[25px]">
                      {question.text}
                    </h2>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {OPTION_VALUES.map((value, oi) => {
                        const option = { value, label: t.options[oi] };
                        const selected = answers[index] === option.value;
                        return (
                          <button
                            type="button"
                            key={option.value}
                            onClick={() => answer(option.value)}
                            className={`flex min-h-12 w-full items-center gap-3 rounded-[14px] border px-4 py-3 text-left text-[15px] font-semibold transition hover:border-[#4A90D9] hover:bg-[#fafcff] ${
                              selected
                                ? "border-brand-900 bg-[#eaf0f9] text-brand-900"
                                : "border-[#dfe5f0] bg-white text-[#1e2330]"
                            }`}
                          >
                            <span
                              aria-hidden
                              className={`h-[18px] w-[18px] shrink-0 rounded-full border-2 ${
                                selected
                                  ? "border-brand-900 bg-brand-900 shadow-[inset_0_0_0_3px_white]"
                                  : "border-[#c4ccdb]"
                              }`}
                            />
                            <span>{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    {index === 0 ? (
                      <p className="mt-5 border-t border-[#e3e8f0] pt-4 text-[14px] leading-relaxed text-[#6b7180]">
                        {t.intro}
                      </p>
                    ) : null}
                  </div>

                </div>

                {index > 0 ? (
                  <div className="mt-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={back}
                    className="inline-flex min-h-11 items-center rounded-full px-1 text-[15px] font-semibold text-brand-900 transition hover:text-[#4A90D9]"
                  >
                    {t.back}
                  </button>
                  </div>
                ) : null}
              </div>
            ) : null}

          {step === "result" ? (
            <div className="px-6 py-8 sm:px-9 sm:py-10 md:px-14 md:py-14">
              <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#4A90D9]">
                {t.resultEyebrow}
              </p>
              <div className="mt-7 flex flex-col gap-7 md:flex-row md:items-center">
                <div className="relative h-[130px] w-[130px] shrink-0">
                  <svg width="130" height="130" viewBox="0 0 130 130" className="-rotate-90">
                    <circle cx="65" cy="65" r="56" fill="none" stroke="#E8ECF4" strokeWidth="13" />
                    <circle
                      cx="65"
                      cy="65"
                      r="56"
                      fill="none"
                      stroke={result.color}
                      strokeWidth="13"
                      strokeLinecap="round"
                      strokeDasharray="352"
                      strokeDashoffset={ringDash}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <b className="text-[34px] font-semibold leading-none text-brand-900">{total}</b>
                    <span className="mt-1 text-[13px] font-semibold text-[#6b7180]">{t.pointsOf(MAX_SCORE)}</span>
                  </div>
                </div>
                <div className="min-w-0">
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-semibold"
                    style={{ color: result.color, backgroundColor: `${result.color}1A` }}
                  >
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: result.color }} />
                    {result.word}
                  </span>
                  <h3 className="mt-4 text-[28px] font-semibold leading-tight tracking-[-0.02em] text-brand-900">
                    {result.head}
                  </h3>
                  <p className="mt-4 max-w-[62ch] text-[17px] leading-relaxed text-[#2f3441]">{result.para}</p>
                </div>
              </div>

              {hasCriticalSignal ? (
                <div className="mt-8 rounded-[14px] border border-[#E0A526]/35 bg-[#fdf7ea] px-5 py-4 text-[15px] leading-relaxed text-[#6a5417]">
                  <b className="font-semibold text-[#8a6a12]">{t.criticalStrong}</b> {t.criticalRest}
                </div>
              ) : null}

              {weakest.length ? (
                <div className="mt-8">
                  <h4 className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#6b7180]">
                    {t.focusHeading}
                  </h4>
                  <ul className="mt-4 grid gap-2">
                    {weakest.map((item) => (
                      <li key={item.dim} className="flex items-center gap-3 text-[16px] font-semibold text-[#1e2330]">
                        <span className="h-2 w-2 rounded-[3px] bg-[#D2473D]" />
                        {item.dim}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-9 rounded-[20px] bg-gradient-to-br from-brand-900 to-[#2e3e96] px-6 py-7 text-white md:px-8 md:py-8">
                <h4 className="text-[22px] font-semibold leading-tight">{t.ctaHead}</h4>
                <p className="mt-3 max-w-[62ch] text-[16px] leading-relaxed text-white/82">
                  {t.ctaBody}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    href={t.ctaPrimaryHref}
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-[15px] font-semibold text-brand-900 transition hover:bg-[#eaf0f9]"
                  >
                    {t.ctaPrimary}
                  </Link>
                  <Link
                    href={t.ctaSecondaryHref}
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/28 px-6 text-[15px] font-semibold text-white transition hover:bg-white/10"
                  >
                    {t.ctaSecondary}
                  </Link>
                </div>
              </div>

              <button
                type="button"
                onClick={restart}
                className="mx-auto mt-7 flex min-h-11 items-center rounded-full px-4 text-[15px] font-semibold text-brand-900 transition hover:text-[#4A90D9]"
              >
                {t.restart}
              </button>
            </div>
          ) : null}
          </div>

          <aside className="relative min-h-[360px] overflow-hidden rounded-[24px] bg-brand-900 shadow-[0_24px_70px_-42px_rgba(27,37,92,0.62)] lg:min-h-full">
            <Image
              src={danielSengstagImages.editorial}
              alt="Daniel Sengstag"
              fill
              className="object-cover object-[center_18%]"
              sizes="(max-width: 1023px) 100vw, 300px"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#11183f] via-[#11183f]/85 to-transparent px-6 pb-6 pt-20 text-white">
              <p className="text-[18px] font-semibold">Daniel Sengstag</p>
              <p className="mt-1 text-[14px] text-white/75">{t.portraitRole}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
