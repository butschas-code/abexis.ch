"use client";

import Link from "next/link";
import { useCallback, useId, useState } from "react";
import { submitPublicForm } from "@/cms/services/form-submission-public-client";
import {
  ALLOWED_BRIEF_FILE_MIME,
  SEARCH_BRIEF_MAX_FILES,
  searchBriefFormValuesSchema,
  validateBriefFiles,
  type SearchBriefFormValues,
} from "./search-brief-form-schema";

type FieldKey = keyof SearchBriefFormValues | "files";

const initial: SearchBriefFormValues = {
  name: "",
  company: "",
  email: "",
  phone: "",
  message: "",
  privacyAccepted: false,
};

function zodIssuesToFieldErrors(issues: { path: (string | number)[]; message: string }[]): Partial<
  Record<FieldKey, string>
> {
  const out: Partial<Record<FieldKey, string>> = {};
  for (const iss of issues) {
    const k = iss.path[0];
    if (k === "files") out.files = iss.message;
    if (k === "name") out.name = iss.message;
    if (k === "company") out.company = iss.message;
    if (k === "email") out.email = iss.message;
    if (k === "phone") out.phone = iss.message;
    if (k === "message") out.message = iss.message;
    if (k === "privacyAccepted") out.privacyAccepted = iss.message;
  }
  return out;
}

export function SearchBriefContactForm() {
  const formId = useId();
  const [values, setValues] = useState<typeof initial>(initial);
  const [files, setFiles] = useState<File[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "submitting" | "success">("idle");

  const set =
    (key: keyof typeof initial) =>
    (v: string | boolean) => {
      setValues((s) => ({ ...s, [key]: v }));
      setFieldErrors((e) => {
        const next = { ...e };
        delete next[key];
        return next;
      });
      setFormError(null);
    };

  const onFiles = useCallback((list: FileList | null) => {
    setFormError(null);
    setFieldErrors((e) => {
      const n = { ...e };
      delete n.files;
      return n;
    });
    if (!list?.length) {
      setFiles([]);
      return;
    }
    const next = Array.from(list).slice(0, SEARCH_BRIEF_MAX_FILES);
    const err = validateBriefFiles(next);
    if (err) {
      setFieldErrors((e) => ({ ...e, files: err }));
      setFiles([]);
      return;
    }
    setFiles(next);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFieldErrors((e) => {
      const n = { ...e };
      delete n.files;
      return n;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const parsed = searchBriefFormValuesSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(zodIssuesToFieldErrors(parsed.error.issues));
      return;
    }

    const fileErr = validateBriefFiles(files);
    if (fileErr) {
      setFieldErrors({ files: fileErr });
      return;
    }

    setPhase("submitting");
    try {
      const companyTrim = parsed.data.company.trim();
      const phoneTrim = parsed.data.phone.trim();
      await submitPublicForm({
        site: "search",
        type: "executive_search",
        formId: "search-brief-contact",
        payload: {
          name: parsed.data.name,
          ...(companyTrim ? { company: companyTrim } : {}),
          email: parsed.data.email,
          ...(phoneTrim ? { phone: phoneTrim } : {}),
          message: parsed.data.message,
          extra: { privacyConsent: "true" },
        },
        files: files.length ? files : undefined,
      });
      setPhase("success");
      setValues(initial);
      setFiles([]);
    } catch (err) {
      setPhase("idle");
      const msg = err instanceof Error ? err.message : "Senden fehlgeschlagen.";
      setFormError(msg);
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
        <h2 className="mt-3 text-[26px] font-semibold tracking-[-0.02em] text-[#1d1d1f] md:text-[30px]">
          Vielen Dank für Ihre Nachricht
        </h2>
        <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-[#6e6e73]">
          Wir haben Ihre Angaben erhalten. Ein Berater nimmt bei passender Gelegenheit persönlich Kontakt mit Ihnen auf ,
          diskret und ohne Dringlichkeitsversprechen.
        </p>
        <p className="mt-6 text-[14px] leading-relaxed text-[#86868b]">
          Bei Rückfragen erreichen Sie uns wie gewohnt über die auf dieser Seite genannten Kanäle.
        </p>
      </div>
    );
  }

  return (
    <form
      id={formId}
      className="rounded-[28px] bg-white p-8 shadow-[var(--apple-shadow)] ring-1 ring-black/[0.04] md:p-10"
      onSubmit={handleSubmit}
      noValidate
    >
      <p className="text-[14px] leading-relaxed text-[#6e6e73]">
        Ihre Angaben werden verschlüsselt übermittelt und vertraulich behandelt. Optional hochgeladene Dokumente
        speichern wir sicher in einem geschützten Bereich.
      </p>

      {formError ? (
        <div
          className="mt-6 rounded-2xl border border-red-200/90 bg-red-50/90 px-4 py-3 text-[14px] text-red-900"
          role="alert"
        >
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
            error={fieldErrors.name}
          />
          <Field
            label="Unternehmen"
            name="company"
            autoComplete="organization"
            value={values.company}
            onChange={(v) => set("company")(v)}
            error={fieldErrors.company}
            optional
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
            error={fieldErrors.email}
          />
          <Field
            label="Telefon"
            name="tel"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(v) => set("phone")(v)}
            error={fieldErrors.phone}
            optional
            hint="Optional, für einen schnellen Rückruf."
          />
        </div>

        <div>
          <label htmlFor={`${formId}-msg`} className="block text-[13px] font-medium text-[#1d1d1f]">
            Ihre Nachricht / Suchauftrag <span className="text-red-600">*</span>
          </label>
          <textarea
            id={`${formId}-msg`}
            name="message"
            required
            rows={6}
            value={values.message}
            onChange={(e) => set("message")(e.target.value)}
            className="mt-2 w-full resize-y rounded-2xl border border-black/[0.08] bg-[#fafafa] px-4 py-3 text-[15px] leading-relaxed text-[#1d1d1f] outline-none ring-brand-900/0 transition placeholder:text-[#aeaeb2] focus:border-brand-500/40 focus:bg-white focus:ring-2 focus:ring-brand-500/25"
            placeholder="Kontext zur Position, Branche, Zeitrahmen : je nachdem, was für Sie sinnvoll ist."
            aria-invalid={fieldErrors.message ? true : undefined}
            aria-describedby={fieldErrors.message ? `${formId}-msg-err` : undefined}
          />
          {fieldErrors.message ? (
            <p id={`${formId}-msg-err`} className="mt-2 text-[13px] text-red-700" role="alert">
              {fieldErrors.message}
            </p>
          ) : (
            <p className="mt-2 text-[12px] text-[#86868b]">Mindestens zwei bis drei Sätze helfen uns, Sie passend zu beraten.</p>
          )}
        </div>

        <div>
          <label htmlFor={`${formId}-file`} className="block text-[13px] font-medium text-[#1d1d1f]">
            Anhänge
          </label>
          <p className="mt-1 text-[12px] text-[#86868b]">
            PDF, Word oder Bilder, maximal {SEARCH_BRIEF_MAX_FILES} Dateien à 10 MB.
          </p>
          <input
            id={`${formId}-file`}
            name="files"
            type="file"
            multiple
            accept={Array.from(ALLOWED_BRIEF_FILE_MIME).join(",")}
            className="mt-3 block w-full text-[14px] file:mr-4 file:rounded-full file:border-0 file:bg-[#f5f5f7] file:px-4 file:py-2 file:text-[14px] file:font-medium file:text-[#1d1d1f] hover:file:bg-[#e8e8ed]"
            onChange={(e) => onFiles(e.target.files)}
          />
          {fieldErrors.files ? (
            <p className="mt-2 text-[13px] text-red-700" role="alert">
              {fieldErrors.files}
            </p>
          ) : null}
          {files.length > 0 ? (
            <ul className="mt-3 space-y-2 text-[14px] text-[#1d1d1f]">
              {files.map((f, i) => (
                <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-3 rounded-xl bg-[#f5f5f7] px-3 py-2">
                  <span className="min-w-0 truncate">{f.name}</span>
                  <button
                    type="button"
                    className="shrink-0 text-[13px] font-medium text-brand-900 underline-offset-4 hover:text-brand-500 hover:underline"
                    onClick={() => removeFile(i)}
                  >
                    Entfernen
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="rounded-2xl border border-black/[0.06] bg-[#fafafa] p-4">
          <label className="flex cursor-pointer gap-3 text-[14px] leading-snug text-[#1d1d1f]">
            <input
              type="checkbox"
              className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded border-black/25 text-brand-900 focus:ring-brand-500/30"
              checked={values.privacyAccepted}
              onChange={(e) => set("privacyAccepted")(e.target.checked)}
              aria-invalid={fieldErrors.privacyAccepted ? true : undefined}
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
              zur Kenntnis genommen und willige in die Bearbeitung meiner Angaben zu Kontaktzwecken ein.{" "}
              <span className="text-red-600">*</span>
            </span>
          </label>
          {fieldErrors.privacyAccepted ? (
            <p className="mt-3 text-[13px] text-red-700" role="alert">
              {fieldErrors.privacyAccepted}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={phase === "submitting"}
          className="inline-flex min-h-[48px] min-w-[200px] items-center justify-center rounded-full bg-brand-900 px-8 text-[16px] font-medium text-white shadow-lg shadow-brand-900/28 transition-all duration-200 hover:bg-[var(--brand-900-hover)] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          {phase === "submitting" ? "Wird gesendet …" : "Nachricht senden"}
        </button>
        <p className="text-[12px] text-[#86868b]">SSL-übertragene Daten · Zugriff nur für autorisierte Berater</p>
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
        aria-describedby={props.error ? `${id}-err` : undefined}
      />
      {props.error ? (
        <p id={`${id}-err`} className="mt-2 text-[13px] text-red-700" role="alert">
          {props.error}
        </p>
      ) : props.hint ? (
        <p className="mt-2 text-[12px] text-[#86868b]">{props.hint}</p>
      ) : null}
    </div>
  );
}
