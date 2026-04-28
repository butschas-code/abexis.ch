"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { z } from "zod";
import { submitPublicForm } from "@/cms/services/form-submission-public-client";
import { isTurnstileConfigured, TurnstileField } from "@/components/site/TurnstileField";

const schema = z.object({
  name: z.string().trim().min(1, "Bitte geben Sie Ihren Namen an."),
  company: z.string().max(200).optional(),
  email: z.string().trim().email("Bitte geben Sie eine gültige E-Mail-Adresse an."),
  phone: z.string().max(80).optional(),
  message: z.string().trim().min(1, "Bitte formulieren Sie eine kurze Nachricht."),
  privacyAccepted: z.literal(true, {
    errorMap: () => ({ message: "Bitte bestätigen Sie die Datenschutzhinweise." }),
  }),
});

type Values = z.infer<typeof schema>;

const initial = {
  name: "",
  company: "",
  email: "",
  phone: "",
  message: "",
  privacyAccepted: false as boolean,
};

type KontaktPageFormProps = {
  /** Outlook / Buchungs-URL : vom Server übergeben, damit der Client nicht `pages.ts` bundelt. */
  bookingUrl: string;
  site?: "abexis" | "search";
};

/** Kontaktformular für `/kontakt` (ohne Datei-Upload). */
export function KontaktPageForm({ bookingUrl, site = "abexis" }: KontaktPageFormProps) {
  const formId = useId();
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof Values | "privacyAccepted", string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);
  const [phase, setPhase] = useState<"idle" | "submitting" | "success">("idle");

  const set =
    (key: keyof typeof initial) =>
    (v: string | boolean) => {
      setValues((s) => ({ ...s, [key]: v }));
      setErrors((e) => {
        const n = { ...e };
        delete n[key as keyof Values];
        return n;
      });
      setFormError(null);
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const parsed = schema.safeParse({
      ...values,
      company: values.company.trim() || undefined,
      phone: values.phone.trim() || undefined,
    });
    if (!parsed.success) {
      const next: Partial<Record<keyof Values | "privacyAccepted", string>> = {};
      for (const iss of parsed.error.issues) {
        const k = iss.path[0];
        if (k === "name") next.name = iss.message;
        if (k === "email") next.email = iss.message;
        if (k === "message") next.message = iss.message;
        if (k === "privacyAccepted") next.privacyAccepted = iss.message;
      }
      setErrors(next);
      return;
    }
    if (!turnstileToken) {
      setTurnstileError("Bitte bestätigen Sie den Bot-Schutz.");
      return;
    }

    setPhase("submitting");
    const payload = {
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
      ...(parsed.data.company?.trim() ? { company: parsed.data.company.trim() } : {}),
      ...(parsed.data.phone?.trim() ? { phone: parsed.data.phone.trim() } : {}),
    };

    try {
      await submitPublicForm({
        site,
        type: "contact",
        formId: site === "search" ? "kontakt-page-search" : "kontakt-page",
        payload: {
          ...payload,
          extra: { privacyConsent: "true" },
        },
        turnstileToken,
      });

      setPhase("success");
      setValues(initial);
      setTurnstileToken(null);
      setTurnstileResetSignal((n) => n + 1);
    } catch (err) {
      setPhase("idle");
      setFormError(err instanceof Error ? err.message : "Senden fehlgeschlagen.");
      setTurnstileToken(null);
      setTurnstileResetSignal((n) => n + 1);
    }
  };

  if (phase === "success") {
    return (
      <div
        className="rounded-[28px] bg-white p-8 shadow-[var(--apple-shadow)] ring-1 ring-black/[0.06] md:p-10"
        role="status"
        aria-live="polite"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Gesendet</p>
        <h2 className="mt-3 text-[22px] font-semibold tracking-[-0.02em] text-[#1d1d1f] md:text-[24px]">
          Vielen Dank für Ihre Nachricht
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-[#6e6e73]">
          Wir melden uns, sobald es sachlich passt : in der Regel innerhalb weniger Werktage.
        </p>
        <p className="mt-6 text-[14px] text-[#86868b]">
          Alternativ:{" "}
          <a
            className="font-medium text-brand-900 underline-offset-4 hover:text-brand-500 hover:underline"
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Termin direkt im Kalender wählen
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      className="rounded-[28px] bg-white p-8 shadow-[var(--apple-shadow)] ring-1 ring-black/[0.04] md:p-10"
      onSubmit={onSubmit}
      noValidate
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Nachricht</p>
      <h2 className="mt-3 text-[22px] font-semibold tracking-[-0.02em] text-[#1d1d1f] md:text-[24px]">
        Schreiben Sie uns
      </h2>
      <p className="mt-4 text-[14px] leading-relaxed text-[#6e6e73]">
        Ihre Angaben werden verschlüsselt übermittelt und vertraulich bearbeitet.
      </p>

      {formError ? (
        <div className="mt-6 rounded-2xl border border-red-200/90 bg-red-50/90 px-4 py-3 text-[14px] text-red-900" role="alert">
          {formError}
        </div>
      ) : null}

      <div className="mt-8 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Field
            label="Name"
            name="name"
            required
            autoComplete="name"
            value={values.name}
            onChange={(v) => set("name")(v)}
            error={errors.name}
          />
          <Field
            label="Unternehmen"
            name="company"
            optional
            autoComplete="organization"
            value={values.company}
            onChange={(v) => set("company")(v)}
            error={errors.company}
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Field
            label="E-Mail"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={values.email}
            onChange={(v) => set("email")(v)}
            error={errors.email}
          />
          <Field
            label="Telefon"
            name="tel"
            type="tel"
            optional
            autoComplete="tel"
            value={values.phone}
            onChange={(v) => set("phone")(v)}
            error={errors.phone}
            hint="Optional."
          />
        </div>

        <div>
          <label htmlFor={`${formId}-msg`} className="block text-[13px] font-medium text-[#1d1d1f]">
            Ihre Nachricht <span className="text-red-600">*</span>
          </label>
          <textarea
            id={`${formId}-msg`}
            name="message"
            required
            rows={5}
            value={values.message}
            onChange={(e) => set("message")(e.target.value)}
            className="mt-2 w-full resize-y rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 py-3 text-[15px] leading-relaxed text-[#1d1d1f] outline-none transition placeholder:text-[#aeaeb2] focus:border-brand-500/40 focus:bg-white focus:ring-2 focus:ring-brand-500/25"
            placeholder="Thema und wie wir Sie am besten erreichen."
            aria-invalid={errors.message ? true : undefined}
          />
          {errors.message ? (
            <p className="mt-2 text-[13px] text-red-700" role="alert">
              {errors.message}
            </p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-black/[0.06] bg-[#fafafa] p-4">
          <label className="flex cursor-pointer gap-3 text-[14px] leading-snug text-[#1d1d1f]">
            <input
              type="checkbox"
              className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded border-black/25 text-brand-900 focus:ring-brand-500/30"
              checked={values.privacyAccepted}
              onChange={(e) => set("privacyAccepted")(e.target.checked)}
            />
            <span>
              Ich habe die{" "}
              <Link
                href="/privacy-policy"
                className="font-medium text-brand-900 underline-offset-4 hover:text-brand-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Datenschutzerklärung
              </Link>{" "}
              zur Kenntnis genommen. <span className="text-red-600">*</span>
            </span>
          </label>
          {errors.privacyAccepted ? (
            <p className="mt-3 text-[13px] text-red-700" role="alert">
              {errors.privacyAccepted}
            </p>
          ) : null}
        </div>

        <TurnstileField
          resetSignal={turnstileResetSignal}
          error={turnstileError}
          onVerify={(token) => {
            setTurnstileToken(token);
            setTurnstileError(null);
          }}
        />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={phase === "submitting" || !isTurnstileConfigured()}
          className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-brand-900 px-8 text-[16px] font-medium text-white shadow-lg shadow-brand-900/28 transition-all duration-200 hover:bg-[var(--brand-900-hover)] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          {phase === "submitting" ? "Wird gesendet …" : "Nachricht senden"}
        </button>
      </div>
    </form>
  );
}

function Field(props: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  autoComplete?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-medium text-[#1d1d1f]">
        {props.label}{" "}
        {props.required ? <span className="text-red-600">*</span> : null}
        {props.optional ? <span className="font-normal text-[#86868b]"> (optional)</span> : null}
      </label>
      <input
        id={id}
        name={props.name}
        type={props.type ?? "text"}
        required={props.required}
        autoComplete={props.autoComplete}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 py-3 text-[15px] text-[#1d1d1f] outline-none transition placeholder:text-[#aeaeb2] focus:border-brand-500/40 focus:bg-white focus:ring-2 focus:ring-brand-500/25"
        aria-invalid={props.error ? true : undefined}
      />
      {props.error ? (
        <p className="mt-2 text-[13px] text-red-700" role="alert">
          {props.error}
        </p>
      ) : props.hint ? (
        <p className="mt-2 text-[12px] text-[#86868b]">{props.hint}</p>
      ) : null}
    </div>
  );
}
