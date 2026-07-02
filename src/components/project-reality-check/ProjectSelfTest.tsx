"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";

const QUESTIONS = [
  {
    dim: "Zielklarheit & Scope",
    text: "Ziele, Umfang und Erfolgskriterien des Vorhabens sind klar definiert und alle zentralen Stakeholder verstehen darunter dasselbe.",
  },
  {
    dim: "Sponsorship & Governance",
    text: "Das Vorhaben hat einen aktiven Sponsor und ein funktionierendes Steuerungsgremium, das Entscheide zeitnah trifft.",
  },
  {
    dim: "Status-Transparenz",
    text: "Ich vertraue der Statusberichterstattung. Wenn ein Bericht grün zeigt, ist es auch wirklich grün.",
  },
  {
    dim: "Planungsrealismus",
    text: "Der Termin- und Kostenplan beruht auf einer fundierten Schätzung, nicht auf einem Wunschtermin.",
  },
  {
    dim: "Ressourcen & Team",
    text: "Die richtigen Personen sind mit ausreichend Kapazität im Projekt. Schlüsselrollen sind besetzt und nicht überlastet.",
  },
  {
    dim: "Risikomanagement",
    text: "Die wichtigsten Risiken sind bekannt, haben einen Verantwortlichen und werden aktiv gesteuert, nicht nur in einer Liste verwaltet.",
  },
  {
    dim: "Termin & Budget",
    text: "Das Vorhaben liegt im Plan, ohne wiederholte Termin- oder Budgetverschiebungen.",
  },
  {
    dim: "Entscheidungstempo",
    text: "Notwendige Entscheide werden schnell getroffen. Das Projekt wartet selten auf Beschlüsse.",
  },
  {
    dim: "Anforderungen & Änderungen",
    text: "Anforderungen sind stabil und Änderungen werden kontrolliert bewertet, ohne schleichenden Scope-Zuwachs.",
  },
  {
    dim: "Akzeptanz & Change",
    text: "Die betroffene Organisation ist eingebunden und auf die Veränderung vorbereitet. Die Akzeptanz ist sichergestellt.",
  },
  {
    dim: "Abhängigkeiten & Lieferanten",
    text: "Abhängigkeiten zu anderen Projekten, Lieferanten und Systemen sind transparent und unter Kontrolle.",
  },
  {
    dim: "Liefer-Zuversicht",
    text: "Wenn ich ehrlich bin, bin ich zuversichtlich, dass das Vorhaben in Zeit, Budget und Qualität liefert.",
  },
] as const;

const OPTIONS = [
  { label: "Trifft voll zu", value: 3 },
  { label: "Trifft eher zu", value: 2 },
  { label: "Trifft eher nicht zu", value: 1 },
  { label: "Trifft nicht zu", value: 0 },
] as const;

const CRITICAL_INDEXES = [1, 2, 11] as const;
const MAX_SCORE = QUESTIONS.length * 3;

type Step = "intro" | "quiz" | "result";

function resultForScore(total: number) {
  if (total >= 28) {
    return {
      word: "Grün - auf Kurs",
      color: "#2E9E6B",
      head: "Ihr Vorhaben steht auf solider Grundlage.",
      para: "Die Kernfaktoren stimmen. Halten Sie die Disziplin und schärfen Sie die wenigen offenen Punkte gezielt nach, damit aus einem guten Stand ein sicheres Ergebnis wird.",
    };
  }
  if (total >= 18) {
    return {
      word: "Gelb - wachsam sein",
      color: "#E0A526",
      head: "Es zeigen sich erste Warnsignale.",
      para: "Einzelne Bereiche sind verwundbar. Jetzt ist der richtige Zeitpunkt für eine unabhängige Standortbestimmung, bevor aus Risiken echte Probleme werden und der Handlungsspielraum schrumpft.",
    };
  }
  return {
    word: "Rot - Handlungsbedarf",
    color: "#D2473D",
    head: "Mehrere kritische Schwachstellen gefährden das Ergebnis.",
    para: "Die Signale sprechen für ein Vorhaben, das ohne Gegensteuern aus dem Ruder läuft. Eine unabhängige, schonungslose Standortbestimmung schafft jetzt Klarheit und die Basis für den Kurswechsel.",
  };
}

export function ProjectSelfTest({ id = "projekt-selbsttest" }: { id?: string }) {
  const [step, setStep] = useState<Step>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<number | null>>(() => Array(QUESTIONS.length).fill(null));
  const sectionRef = useRef<HTMLElement | null>(null);

  const total = useMemo(() => answers.reduce<number>((sum, value) => sum + (value ?? 0), 0), [answers]);
  const result = resultForScore(total);
  const weakest = useMemo(
    () =>
      QUESTIONS.map((q, i) => ({ dim: q.dim, value: answers[i] ?? 0 }))
        .filter((item) => item.value <= 1)
        .sort((a, b) => a.value - b.value)
        .slice(0, 3),
    [answers],
  );
  const hasCriticalSignal = CRITICAL_INDEXES.some((i) => (answers[i] ?? 0) <= 1);
  const progress = step === "result" ? 100 : Math.round((index / QUESTIONS.length) * 100);
  const ringDash = 352 * (1 - total / MAX_SCORE);

  function keepBlockInView() {
    window.setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 90);
  }

  function start() {
    setIndex(0);
    setStep("quiz");
    keepBlockInView();
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
    if (index === 0) {
      setStep("intro");
      keepBlockInView();
      return;
    }
    setIndex((current) => current - 1);
  }

  function restart() {
    setAnswers(Array(QUESTIONS.length).fill(null));
    setIndex(0);
    setStep("intro");
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
        <div className="overflow-hidden rounded-[24px] border border-[#dfe5f0] bg-white shadow-[0_24px_70px_-42px_rgba(27,37,92,0.62)]">
          {step === "intro" ? (
            <div className="px-6 py-8 sm:px-9 sm:py-10 md:px-14 md:py-14">
              <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#4A90D9]">
                Selbsttest · 12 Fragen
              </p>
              <h2 className="mt-4 max-w-[24ch] text-[30px] font-semibold leading-[1.08] tracking-[-0.03em] text-brand-900 sm:text-[40px] md:text-[48px]">
                Ist Ihr kritisches Projekt wirklich auf Kurs?
              </h2>
              <p className="mt-5 max-w-[66ch] text-[18px] leading-[1.75] text-[#2f3441] sm:text-[20px]">
                Statusberichte zeigen oft Grün, während ein Vorhaben längst Rot ist. Dieser Selbsttest gibt Ihnen in
                fünf Minuten eine ehrliche Standortbestimmung über zwölf der Punkte, an denen Projekte tatsächlich
                scheitern.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                {["5 Minuten", "12 Fragen", "Sofortiges Ergebnis"].map((label) => (
                  <span
                    key={label}
                    className="rounded-full bg-[#eaf0f9] px-5 py-2 text-[15px] font-semibold text-brand-900"
                  >
                    {label}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={start}
                className="mt-9 inline-flex min-h-12 items-center justify-center rounded-[14px] bg-brand-900 px-8 text-[17px] font-semibold text-white shadow-[0_18px_32px_-20px_rgba(38,51,124,0.95)] transition hover:-translate-y-0.5 hover:bg-[#1b255c] active:translate-y-0"
              >
                Selbsttest starten
              </button>
              <p className="mt-8 max-w-[78ch] text-[16px] leading-relaxed text-[#6b7180]">
                Antworten Sie spontan und ehrlich aus Sicht der Person, die das Vorhaben verantwortet. Es werden keine
                Daten gespeichert oder übermittelt.
              </p>
            </div>
          ) : null}

          {step === "quiz" ? (
            <div className="px-6 py-8 sm:px-9 sm:py-10 md:px-14 md:py-14">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[14px] font-semibold text-brand-900">
                  Frage <span className="text-[#4A90D9]">{index + 1}</span> von {QUESTIONS.length}
                </p>
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#6b7180]">{question.dim}</p>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#e3e8f0]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#4A90D9] to-brand-900 transition-[width] duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div key={index} className="mt-8">
                <h3 className="max-w-[34ch] text-[25px] font-semibold leading-snug tracking-[-0.02em] text-brand-900 md:text-[31px]">
                  {question.text}
                </h3>
                <div className="mt-8 grid gap-3">
                  {OPTIONS.map((option) => {
                    const selected = answers[index] === option.value;
                    return (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() => answer(option.value)}
                        className={`flex min-h-14 w-full items-center gap-4 rounded-[14px] border px-5 py-4 text-left text-[16px] font-semibold transition hover:border-[#4A90D9] hover:bg-[#fafcff] ${
                          selected
                            ? "border-brand-900 bg-[#eaf0f9] text-brand-900"
                            : "border-[#dfe5f0] bg-white text-[#1e2330]"
                        }`}
                      >
                        <span
                          aria-hidden
                          className={`h-[18px] w-[18px] rounded-full border-2 ${
                            selected ? "border-brand-900 bg-brand-900 shadow-[inset_0_0_0_3px_white]" : "border-[#c4ccdb]"
                          }`}
                        />
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={back}
                  className="inline-flex min-h-11 items-center rounded-full px-1 text-[15px] font-semibold text-brand-900 transition hover:text-[#4A90D9]"
                >
                  {index === 0 ? "← Einleitung" : "← Zurück"}
                </button>
              </div>
            </div>
          ) : null}

          {step === "result" ? (
            <div className="px-6 py-8 sm:px-9 sm:py-10 md:px-14 md:py-14">
              <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#4A90D9]">
                Ihr ehrlicher Projektstatus
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
                    <span className="mt-1 text-[13px] font-semibold text-[#6b7180]">von {MAX_SCORE} Punkten</span>
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
                <div className="mt-8 rounded-r-[14px] border-l-4 border-[#E0A526] bg-[#fdf7ea] px-5 py-4 text-[15px] leading-relaxed text-[#6a5417]">
                  <b className="font-semibold text-[#8a6a12]">Einzelne Antworten wiegen schwer.</b> Fehlendes Vertrauen
                  in den Status, ein schwacher Sponsor oder geringe Liefer-Zuversicht sind Warnsignale, unabhängig vom
                  Gesamtergebnis.
                </div>
              ) : null}

              {weakest.length ? (
                <div className="mt-8">
                  <h4 className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#6b7180]">
                    Worauf Sie jetzt achten sollten
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
                <h4 className="text-[22px] font-semibold leading-tight">Schaffen Sie Gewissheit mit einem Project Reality Check.</h4>
                <p className="mt-3 max-w-[62ch] text-[16px] leading-relaxed text-white/82">
                  In wenigen Tagen erhalten Sie eine unabhängige Standortbestimmung Ihres Vorhabens: eine belastbare
                  Entscheidungsgrundlage für Ihren Lenkungsausschuss, zum Fixpreis. Und falls nötig, bringen wir das
                  Projekt wieder auf Kurs.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    href="/kontakt"
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-[15px] font-semibold text-brand-900 transition hover:bg-[#eaf0f9]"
                  >
                    Project Reality Check anfragen
                  </Link>
                  <Link
                    href="/projectrealitycheck"
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/28 px-6 text-[15px] font-semibold text-white transition hover:bg-white/10"
                  >
                    Mehr erfahren
                  </Link>
                </div>
              </div>

              <button
                type="button"
                onClick={restart}
                className="mx-auto mt-7 flex min-h-11 items-center rounded-full px-4 text-[15px] font-semibold text-brand-900 transition hover:text-[#4A90D9]"
              >
                Selbsttest wiederholen
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
