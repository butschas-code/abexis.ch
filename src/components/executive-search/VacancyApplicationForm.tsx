"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { submitPublicForm } from "@/cms/services/form-submission-public-client";

const initial = {
  name: "",
  email: "",
  phone: "",
  message: "",
  consent: false,
};

export function VacancyApplicationForm({
  vacancyId,
  vacancyTitle,
}: {
  vacancyId: string;
  vacancyTitle: string;
}) {
  const [form, setForm] = useState(initial);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const reduce = useReducedMotion();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.consent) {
      setErrorMessage("Bitte bestätigen Sie die Datenschutzerklärung.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setErrorMessage("");

    try {
      await submitPublicForm({
        site: "search",
        type: "application",
        payload: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
          extra: {
            jobId: vacancyId,
            jobTitle: vacancyTitle,
          },
        },
        files: file ? [file] : [],
      });
      setStatus("ok");
      setForm(initial);
      setFile(null);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage("Es gab ein Problem beim Senden. Bitte versuchen Sie es erneut.");
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
        <h3 className="text-[19px] font-medium text-[#1d1d1f]">Bewerbung erfolgreich gesendet</h3>
        <p className="mt-2 text-[15px] text-[#6e6e73]">
          Vielen Dank für das Interesse an der Position als {vacancyTitle}. Wir werden uns in Kürze mit Ihnen in Verbindung setzen.
        </p>
      </div>
    );
  }

  return (
    <motion.form
      id="bewerbung"
      onSubmit={onSubmit}
      className="space-y-5 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:p-8"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
    >
      <div>
        <h3 className="text-[19px] font-medium text-[#1d1d1f]">Jetzt bewerben</h3>
        <p className="mt-1 text-[13px] text-[#86868b]">Position: {vacancyTitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Name"
          value={form.name}
          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
          required
        />
        <Field
          label="E-Mail"
          type="email"
          value={form.email}
          onChange={(v) => setForm((f) => ({ ...f, email: v }))}
          required
        />
        <div className="sm:col-span-2">
          <Field
            label="Telefon"
            type="tel"
            value={form.phone}
            onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
          />
        </div>
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#86868b]" htmlFor="msg">
          Nachricht / Motivation
        </label>
        <textarea
          id="msg"
          rows={5}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          className="focus-ring mt-2 w-full rounded-xl border border-black/[0.08] bg-[#f5f5f7] px-3 py-2 text-[15px] text-[#1d1d1f] placeholder:text-[#86868b]"
          placeholder="Ihre Nachricht oder Kurzmotivation an uns..."
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#86868b] block mb-2" htmlFor="cv">
          Lebenslauf & Dokumente hochladen
        </label>
        <input
          id="cv"
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
          onChange={handleFileChange}
          required
          className="w-full text-[13px] text-[#6e6e73] file:mr-4 file:rounded-full file:border-0 file:bg-brand-900/[0.08] file:px-4 file:py-2 file:text-[13px] file:font-semibold file:text-brand-900 hover:file:bg-brand-900/[0.12] transition file:cursor-pointer custom-file-input"
        />
        <p className="mt-1.5 text-[11px] text-[#86868b]">Erlaubt: PDF, Word oder Bild. Max 10MB.</p>
      </div>

      <label className="flex items-start gap-3 text-[15px] leading-snug text-[#6e6e73] pt-2">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
          className="focus-ring mt-1 rounded border-black/20 shrink-0"
        />
        <span>
          Ich bin damit einverstanden, dass meine Angaben zur Bearbeitung der Anfrage verwendet werden. Hinweise zur Datenverarbeitung finden sich in der{" "}
          <Link href="/privacy-policy" className="font-medium text-brand-900 underline-offset-4 hover:underline">
            Datenschutzerklärung
          </Link>
          .
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="focus-ring rounded-full bg-[#26337c] px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#324891] disabled:opacity-50"
        >
          {status === "sending" ? "Wird gesendet…" : "Bewerbung einreichen"}
        </button>
        {status === "error" && (
          <p className="text-[13px] text-[#e02424] font-medium">{errorMessage}</p>
        )}
      </div>
    </motion.form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  const fid = label.replace(/\s+/g, "-").toLowerCase();
  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#86868b]" htmlFor={fid}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        id={fid}
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="focus-ring mt-2 w-full rounded-xl border border-black/[0.08] bg-[#f5f5f7] px-3 py-2 text-[15px] text-[#1d1d1f]"
      />
    </div>
  );
}
