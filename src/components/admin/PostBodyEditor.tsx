"use client";

import Image from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";
import { sanitizeBlogHtml } from "@/lib/cms/sanitize-blog-html";
import { useState } from "react";

type Props = {
  /** Decoded HTML fragment (not the JSON envelope). */
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** If provided, enables image uploads to this path in Firebase Storage. */
  uploadPath?: string;
};

function isLikelyHttpUrl(s: string): boolean {
  const t = s.trim();
  if (!t) return false;
  try {
    const u = new URL(t);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function PostBodyEditor({ value, onChange, placeholder, disabled, uploadPath }: Props) {
  const lastEmitted = useRef("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-xl my-4 ring-1 ring-black/[0.06]",
          loading: "lazy",
        },
      }),
      Placeholder.configure({
        placeholder:
          placeholder ??
          "Fliesstext und Überschriften. Bilder: Schaltfläche «Bild (URL)» : öffentliche Bild-Adresse einfügen.",
      }),
    ],
    content: sanitizeBlogHtml(value || "<p></p>"),
    editorProps: {
      attributes: {
        class: "tiptap min-h-[280px] px-4 py-3 text-[var(--apple-text)] focus:outline-none",
      },
    },
    onUpdate: ({ editor: ed }) => {
      const html = sanitizeBlogHtml(ed.getHTML());
      lastEmitted.current = html;
      onChange(html);
    },
  });

  useEffect(() => {
    if (editor) editor.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (!editor) return;
    const safe = sanitizeBlogHtml(value || "<p></p>");
    const current = sanitizeBlogHtml(editor.getHTML());
    if (safe === current) return;
    if (safe === lastEmitted.current) return;
    editor.commands.setContent(safe, false);
  }, [value, editor]);

  function insertImageByUrl() {
    if (!editor) return;
    const raw = window.prompt(
      "Bild einfügen: volle Web-Adresse des Bildes (https://…)\n\nDas Bild muss öffentlich erreichbar sein (kein Login).",
      "https://",
    );
    if (raw == null) return;
    const url = raw.trim();
    if (!url) return;
    if (!isLikelyHttpUrl(url)) {
      window.alert("Bitte eine gültige Adresse mit http:// oder https:// eingeben.");
      return;
    }
    const altRaw = window.prompt("Kurzer Alternativtext für das Bild (empfohlen, z. B. für Screenreader)", "");
    const alt = altRaw == null ? "" : altRaw.trim();
    editor.chain().focus().setImage({ src: url, alt }).run();
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editor || !uploadPath) return;

    setUploading(true);
    try {
      const { uploadCmsFile } = await import("@/firebase/storage");
      const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const path = uploadPath.endsWith("/") ? `${uploadPath}${cleanName}` : `${uploadPath}/${cleanName}`;
      const url = await uploadCmsFile(file, path);
      
      editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    } catch (err) {
      console.error("Upload error:", err);
      window.alert("Upload fehlgeschlagen.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function setLink() {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const next = window.prompt("Link-Adresse (https://…)", prev ?? "https://");
    if (next === null) return;
    const trimmed = next.trim();
    if (trimmed === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: trimmed }).run();
  }

  if (!editor) {
    return (
      <div className="min-h-[280px] rounded-xl border border-black/10 bg-[var(--apple-bg-subtle)] px-4 py-8 text-center text-sm text-[var(--apple-text-secondary)]">
        Editor wird geladen…
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
      <div className="flex flex-wrap gap-1 border-b border-black/[0.06] bg-[var(--apple-bg-subtle)] px-2 py-2">
        <ToolbarBtn
          label="Fett"
          active={editor.isActive("bold")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarBtn
          label="Kursiv"
          active={editor.isActive("italic")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <span className="mx-1 w-px self-stretch bg-black/10" aria-hidden />
        <ToolbarBtn
          label="H2"
          active={editor.isActive("heading", { level: 2 })}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolbarBtn
          label="H3"
          active={editor.isActive("heading", { level: 3 })}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        />
        <span className="mx-1 w-px self-stretch bg-black/10" aria-hidden />
        <ToolbarBtn
          label="Liste"
          active={editor.isActive("bulletList")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarBtn
          label="Nummeriert"
          active={editor.isActive("orderedList")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarBtn
          label="Zitat"
          active={editor.isActive("blockquote")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <span className="mx-1 w-px self-stretch bg-black/10" aria-hidden />
        <ToolbarBtn label="Link" active={editor.isActive("link")} disabled={disabled} onClick={() => setLink()} />
        <ToolbarBtn
          label="Link entfernen"
          active={false}
          disabled={disabled}
          onClick={() => editor.chain().focus().unsetLink().run()}
        />
        <span className="mx-1 w-px self-stretch bg-black/10" aria-hidden />
        <ToolbarBtn label="Bild (URL)" active={false} disabled={disabled} onClick={() => insertImageByUrl()} />
        {uploadPath && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <ToolbarBtn
              label={uploading ? "Sende…" : "Bild hochladen ↑"}
              active={false}
              disabled={disabled || uploading}
              onClick={() => fileInputRef.current?.click()}
            />
          </>
        )}
      </div>
      <div className="legacy-prose max-w-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function ToolbarBtn({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={
        active
          ? "rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium text-[var(--apple-text)] shadow-sm ring-1 ring-black/10"
          : "rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--apple-text-secondary)] hover:bg-black/[0.04] hover:text-[var(--apple-text)] disabled:opacity-50"
      }
    >
      {label}
    </button>
  );
}
