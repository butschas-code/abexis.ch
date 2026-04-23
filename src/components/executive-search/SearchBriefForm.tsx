"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const initial = {
  name: "",
  company: "",
  email: "",
  phone: "",
  message: "",
  consent: false,
};

export function SearchBriefForm({ id = "suchmandat" }: { id?: string }) {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const reduce = useReducedMotion();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.consent) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("fail");
      setStatus("ok");
      setForm(initial);
    } catch {
      setStatus("error");
    }
  }

  return (
    <motion.form
      id={id}
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:p-8"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Name"
          value={form.name}
          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
          required
        />
        <Field
          label="Unternehmen"
          value={form.company}
          onChange={(v) => setForm((f) => ({ ...f, company: v }))}
          required
        />
        <Field
          label="E-Mail"
          type="email"
          value={form.email}
          onChange={(v) => setForm((f) => ({ ...f, email: v }))}
          required
        />
        <Field
          label="Telefon"
          type="tel"
          value={form.phone}
          onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
        />
      </div>
      <div>
        <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#86868b]" htmlFor="msg">
          Nachricht / Mandatskontext
        </label>
        <textarea
          id="msg"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          className="focus-ring mt-2 w-full rounded-xl border border-black/[0.08] bg-[#f5f5f7] px-3 py-2 text-[15px] text-[#1d1d1f] placeholder:text-[#86868b]"
          placeholder="Rolle, Kontext, Zeitrahmen — frei formuliert."
        />
      </div>
      <label className="flex items-start gap-3 text-[15px] leading-snug text-[#6e6e73]">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
          className="focus-ring mt-1 rounded border-black/20"
        />
        <span>
          Ich bin damit einverstanden, dass meine Angaben zur Bearbeitung der Anfrage verwendet werden. Hinweise zur
          Datenverarbeitung finden sich in der{" "}
          <Link href="/privacy-policy" className="font-medium text-brand-900 underline-offset-4 hover:underline">
            Datenschutzerklärung
          </Link>
          .
        </span>
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="focus-ring rounded-full bg-[#26337c] px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-white transition-opacity hover:bg-[#324891] disabled:opacity-50"
        >
          {status === "sending" ? "Senden…" : "Suchmandat einreichen"}
        </button>
        {status === "ok" && <p className="text-[15px] text-[#6e6e73]">Vielen Dank — wir melden uns diskret und zeitnah.</p>}
        {status === "error" && (
          <p className="text-[15px] text-[#424245]">Bitte prüfen Sie die Eingaben und die Einwilligung.</p>
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
        {label}
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
