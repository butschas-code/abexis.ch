"use client";

import { useRef, useState } from "react";
import { uploadCmsFile } from "@/firebase/storage";
import { adminBtnSecondary, adminFeedbackError } from "./admin-ui";

interface AdminFileUploadProps {
  /** Target path in storage, e.g. 'cms/heroes/post-id/filename.jpg' */
  path: string;
  onUploadSuccess: (url: string) => void;
  label?: string;
  accept?: string;
  className?: string;
}

export function AdminFileUpload({
  path,
  onUploadSuccess,
  label = "Datei hochladen",
  accept,
  className = "",
}: AdminFileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // Use the provided path, but ensure the filename is appended if it's a directory-like path
      // If the path already has an extension, we use it as is (overwriting or specific file)
      // Otherwise we append the filename
      let finalPath = path;
      if (!path.includes(".") || path.endsWith("/")) {
        const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
        finalPath = path.endsWith("/") ? `${path}${cleanName}` : `${path}/${cleanName}`;
      }

      const url = await uploadCmsFile(file, finalPath);
      onUploadSuccess(url);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Upload fehlgeschlagen.");
    } finally {
      setUploading(false);
      // Reset input so the same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
        className={adminBtnSecondary + " w-full sm:w-auto"}
      >
        {uploading ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Lädt hoch…
          </span>
        ) : (
          label
        )}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
