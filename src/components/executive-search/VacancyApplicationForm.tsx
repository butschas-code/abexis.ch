"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { submitPublicForm } from "@/cms/services/form-submission-public-client";
import { isTurnstileConfigured, TurnstileField } from "@/components/site/TurnstileField";

const initial = {
  name: "",
  email: "",
  phone: "",
  message: "",
  consent: false,
};

type VacancyApplicationFormCopy = {
  defaultHeading: string;
  spontaneousHeading: string;
  submitButton: string;
  consentError: string;
  turnstileError: string;
  sendError: string;
  spontaneousSuccessTitle: string;
  successTitle: string;
  spontaneousSuccessMessage: string;
  successMessage: string;
  positionLabel: string;
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  messageLabel: string;
  messagePlaceholder: string;
  filesLabel: string;
  filesHint: string;
  consentPrefix: string;
  privacyLinkLabel: string;
  consentSuffix: string;
  sendingLabel: string;
};

const DEFAULT_COPY: VacancyApplicationFormCopy = {
  defaultHeading: "Jetzt bewerben",
  spontaneousHeading: "Spontanbewerbung",
  submitButton: "Bewerbung einreichen",
  consentError: "Bitte bestätigen Sie die Datenschutzerklärung.",
  turnstileError: "Bitte bestätigen Sie den Bot-Schutz.",
  sendError: "Es gab ein Problem beim Senden. Bitte versuchen Sie es erneut.",
  spontaneousSuccessTitle: "Spontanbewerbung eingegangen",
  successTitle: "Bewerbung erfolgreich gesendet",
  spontaneousSuccessMessage:
    "Vielen Dank — wir prüfen Ihre Unterlagen vertraulich und melden uns, sobald sich eine Passung zu einem Mandat ergibt.",
  successMessage:
    "Vielen Dank für das Interesse an der Position als {vacancyTitle}. Wir werden uns in Kürze mit Ihnen in Verbindung setzen.",
  positionLabel: "Position",
  nameLabel: "Name",
  emailLabel: "E-Mail",
  phoneLabel: "Telefon",
  messageLabel: "Nachricht / Motivation",
  messagePlaceholder: "Ihre Nachricht oder Kurzmotivation an uns...",
  filesLabel: "Lebenslauf & Dokumente hochladen",
  filesHint: "Erlaubt: PDF, Word oder Bild. Max 10MB.",
  consentPrefix:
    "Ich bin damit einverstanden, dass meine Angaben zur Bearbeitung der Anfrage verwendet werden. Hinweise zur Datenverarbeitung finden sich in der",
  privacyLinkLabel: "Datenschutzerklärung",
  consentSuffix: ".",
  sendingLabel: "Wird gesendet…",
};

export function VacancyApplicationForm({
  vacancyId,
  vacancyTitle,
  jobType = "vacancy",
  isSpontaneous = false,
  heading,
  intro,
  submitButtonLabel,
  copy,
  formIdPrefix = "bewerbung",
}: {
  vacancyId: string;
  vacancyTitle: string;
  jobType?: "vacancy" | "spontanbewerbung";
  isSpontaneous?: boolean;
  heading?: string;
  intro?: string;
  submitButtonLabel?: string;
  copy?: Partial<VacancyApplicationFormCopy>;
  /** Keeps field ids unique when multiple forms appear on one page. */
  formIdPrefix?: string;
}) {
  const [form, setForm] = useState(initial);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);
  const reduce = useReducedMotion();
  const texts = { ...DEFAULT_COPY, ...copy };
  const spontaneousMode = jobType === "spontanbewerbung" || isSpontaneous;

  const resolvedHeading =
    heading ?? (spontaneousMode ? texts.spontaneousHeading : texts.defaultHeading);
  const resolvedSubmit = submitButtonLabel ?? texts.submitButton;

  const hp = formIdPrefix.replace(/\s+/g, "-").toLowerCase();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.consent) {
      setErrorMessage(texts.consentError);
      setStatus("error");
      return;
    }
    if (!turnstileToken) {
      setErrorMessage(texts.turnstileError);
      setStatus("error");
      return;
    }
    setStatus("sending");
    setErrorMessage("");

    try {
      await submitPublicForm({
        site: "abexis",
        type: "application",
        formId: isSpontaneous ? `${formIdPrefix}-spontanbewerbung` : `${formIdPrefix}-${vacancyId}`,
        payload: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
          extra: {
            jobId: vacancyId,
            jobTitle: vacancyTitle,
            jobType,
            isSpontaneous: isSpontaneous ? "true" : "false",
          },
        },
        files: file ? [file] : [],
        turnstileToken,
      });
      setStatus("ok");
      setForm(initial);
      setFile(null);
      setTurnstileToken(null);
      setTurnstileResetSignal((n) => n + 1);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage(texts.sendError);
      setTurnstileToken(null);
      setTurnstileResetSignal((n) => n + 1);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
    } else {
      setFile(null);
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-black/[0.06] bg-white p-8 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-900/[0.08] text-brand-900">
          ✓
        </div>
        <h3 className="text-[19px] font-medium text-[#1d1d1f]">
          {spontaneousMode ? texts.spontaneousSuccessTitle : texts.successTitle}
        </h3>
        <p className="mt-2 text-[15px] text-[#6e6e73]">
          {spontaneousMode
            ? texts.spontaneousSuccessMessage
            : texts.successMessage.replace("{vacancyTitle}", vacancyTitle)}
        </p>
      </div>
    );
  }

  return (
    <motion.form
      id={hp}
      onSubmit={onSubmit}
      className="space-y-5 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:p-8"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
    >
      <div>
        <h3 className="text-[19px] font-medium text-[#1d1d1f]">{resolvedHeading}</h3>
        {intro ? (
          <p className="mt-2 text-[14px] leading-relaxed text-[#6e6e73]">{intro}</p>
        ) : (
          <p className="mt-1 text-[13px] text-[#86868b]">{texts.positionLabel}: {vacancyTitle}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id={`${hp}-name`}
          label={texts.nameLabel}
          value={form.name}
          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
          required
        />
        <Field
          id={`${hp}-email`}
          label={texts.emailLabel}
          type="email"
          value={form.email}
          onChange={(v) => setForm((f) => ({ ...f, email: v }))}
          required
        />
        <div className="sm:col-span-2">
          <Field
            id={`${hp}-phone`}
            label={texts.phoneLabel}
            type="tel"
            value={form.phone}
            onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
          />
        </div>
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#86868b]" htmlFor={`${hp}-msg`}>
          {texts.messageLabel}
        </label>
        <textarea
          id={`${hp}-msg`}
          rows={5}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          className="focus-ring mt-2 w-full rounded-xl border border-black/[0.08] bg-[#f5f5f7] px-3 py-2 text-[15px] text-[#1d1d1f] placeholder:text-[#86868b]"
          placeholder={texts.messagePlaceholder}
        />
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#86868b]" htmlFor={`${hp}-cv`}>
          {texts.filesLabel}
        </label>
        <input
          id={`${hp}-cv`}
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
          onChange={handleFileChange}
          required
          className="w-full text-[13px] text-[#6e6e73] file:mr-4 file:rounded-full file:border-0 file:bg-brand-900/[0.08] file:px-4 file:py-2 file:text-[13px] file:font-semibold file:text-brand-900 hover:file:bg-brand-900/[0.12] transition file:cursor-pointer custom-file-input"
        />
        <p className="mt-1.5 text-[11px] text-[#86868b]">{texts.filesHint}</p>
      </div>

      <label className="flex items-start gap-3 pt-2 text-[15px] leading-snug text-[#6e6e73]">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
          className="focus-ring mt-1 shrink-0 rounded border-black/20"
        />
        <span>
          {texts.consentPrefix}{" "}
          <Link href="/privacy-policy" className="font-medium text-brand-900 underline-offset-4 hover:underline">
            {texts.privacyLinkLabel}
          </Link>
          {texts.consentSuffix}
        </span>
      </label>

      <TurnstileField
        resetSignal={turnstileResetSignal}
        onVerify={(token) => {
          setTurnstileToken(token);
          if (token && errorMessage === texts.turnstileError) setErrorMessage("");
        }}
      />

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={status === "sending" || !isTurnstileConfigured()}
          className="focus-ring rounded-full bg-[#26337c] px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#324891] disabled:opacity-50"
        >
          {status === "sending" ? texts.sendingLabel : resolvedSubmit}
        </button>
        {status === "error" && (
          <p className="text-[13px] font-medium text-[#e02424]">{errorMessage}</p>
        )}
      </div>
    </motion.form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#86868b]" htmlFor={id}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="focus-ring mt-2 w-full rounded-xl border border-black/[0.08] bg-[#f5f5f7] px-3 py-2 text-[15px] text-[#1d1d1f]"
      />
    </div>
  );
}
