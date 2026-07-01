"use client";

import { useMemo } from "react";

import { adminBody, adminInput } from "@/components/admin/admin-ui";

type Props = {
  value: string;
  onChange: (value: string) => void;
  imageUrl?: string | null;
  disabled?: boolean;
  label?: string;
};

const LINKEDIN_CHAR_SOFT_LIMIT = 3000;

function formatLinkedInPreview(text: string): string {
  return text.replace(/\r\n/g, "\n").trimEnd();
}

export function LinkedInPostEditor({ value, onChange, imageUrl, disabled, label = "LinkedIn" }: Props) {
  const previewText = useMemo(() => formatLinkedInPreview(value), [value]);
  const charCount = value.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[14px] font-medium text-[var(--apple-text)]">{label}</span>
        <span
          className={`text-[12px] tabular-nums ${
            charCount > LINKEDIN_CHAR_SOFT_LIMIT ? "font-medium text-amber-800" : "text-[var(--apple-text-tertiary)]"
          }`}
        >
          {charCount} Zeichen
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
        <label className="block space-y-2">
          <span className={`${adminBody} text-[12px] text-[var(--apple-text-tertiary)]`}>Text bearbeiten</span>
          <textarea
            className={`${adminInput} min-h-[220px] resize-y leading-relaxed`}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
          />
        </label>

        <div className="space-y-2">
          <span className={`${adminBody} text-[12px] text-[var(--apple-text-tertiary)]`}>Vorschau (LinkedIn-Feed)</span>
          <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-black/[0.06] px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a66c2] text-[13px] font-semibold text-white">
                DS
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[var(--apple-text)]">Daniel Sengstag</p>
                <p className="text-[12px] text-[var(--apple-text-tertiary)]">Gerade eben · 🌐</p>
              </div>
            </div>
            <div className="space-y-3 px-4 py-4">
              <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-[var(--apple-text)]">
                {previewText || "LinkedIn-Text eingeben …"}
              </p>
              {imageUrl?.trim() ? (
                <div className="overflow-hidden rounded-lg border border-black/[0.06]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- CMS preview for editor-selected remote image URL */}
                  <img src={imageUrl.trim()} alt="" className="aspect-[1.91/1] w-full object-cover" />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
