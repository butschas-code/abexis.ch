"use client";

import { useRef, useState } from "react";
import { uploadCmsFile } from "@/firebase/storage";
import { adminBtnSecondary } from "./admin-ui";

interface AdminFileUploadProps {
  /** Target path in storage, e.g. 'cms/heroes/post-id/filename.jpg' */
  path: string;
  onUploadSuccess: (url: string, meta: { storagePath: string; file: File }) => void;
  label?: string;
  accept?: string;
  className?: string;
}

/**
 * Downscales raster images client-side (max 1600px, WebP 82%) to avoid uploading
 * multi-megabyte raw camera files into Firebase Storage.
 */
async function compressImageForUpload(file: File, maxDim = 1600): Promise<{ file: File; extension: string }> {
  if (!file.type.startsWith("image/") || file.type.includes("svg") || file.type.includes("gif")) {
    return { file, extension: "" };
  }

  return new Promise((resolve) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve({ file, extension: "" });

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            return resolve({ file, extension: "" });
          }
          const baseName = file.name.replace(/\.[^/.]+$/, "");
          const compressed = new File([blob], `${baseName}.webp`, { type: "image/webp" });
          resolve({ file: compressed, extension: ".webp" });
        },
        "image/webp",
        0.82
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ file, extension: "" });
    };
    img.src = objectUrl;
  });
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
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setUploading(true);
    setError(null);

    try {
      const { file: uploadFile, extension } = await compressImageForUpload(rawFile);

      // Use the provided path, but ensure the filename is appended if it's a directory-like path
      let finalPath = path;
      if (!path.includes(".") || path.endsWith("/")) {
        const cleanName = uploadFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
        finalPath = path.endsWith("/") ? `${path}${cleanName}` : `${path}/${cleanName}`;
      } else if (extension && !finalPath.endsWith(extension)) {
        finalPath = finalPath.replace(/\.[a-zA-Z0-9]+$/, extension);
      }

      const url = await uploadCmsFile(uploadFile, finalPath);
      onUploadSuccess(url, { storagePath: finalPath, file: uploadFile });
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
