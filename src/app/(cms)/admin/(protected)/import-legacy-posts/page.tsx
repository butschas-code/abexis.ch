"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { AdminPageContainer, AdminPageHeader } from "@/components/admin/AdminPageContainer";
import { useCmsAuth } from "@/cms/auth/cms-auth-context";
import {
  coerceLegacyPostRow,
  mapLegacyPostToUpsert,
  resolveLegacySlugForImport,
} from "@/cms/migration/legacy-post-import";
import { newPostId } from "@/cms/services/post-write-client";
import { postPublishedSlugExistsClient, writeLegacyImportedPostWeb } from "@/cms/services/legacy-post-import-web-client";
import { getCmsAuth } from "@/firebase/auth";
import { isCmsFirestoreAvailable } from "@/firebase/firestore";

type RowPreview = { title: string; slug: string; excerpt: string; publishedAt: string | null };

function formatFirestoreError(e: unknown): string {
  if (typeof e === "object" && e !== null && "code" in e && "message" in e) {
    const { code, message } = e as { code: string; message: string };
    return `${code}: ${message}`;
  }
  return e instanceof Error ? e.message : String(e);
}

export default function ImportLegacyPostsPage() {
  const { user, ready, hasPermission } = useCmsAuth();
  const canImport = hasPermission("manage_posts");

  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "importing" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [rows, setRows] = useState<RowPreview[]>([]);
  const [rawCount, setRawCount] = useState(0);

  const [imported, setImported] = useState(0);
  const [skippedDup, setSkippedDup] = useState(0);
  const [failed, setFailed] = useState(0);
  const [failSamples, setFailSamples] = useState<string[]>([]);

  const firestoreOk = useMemo(() => isCmsFirestoreAvailable(), []);

  const loadJson = useCallback(async () => {
    setMessage(null);
    setStatus("loading");
    setImported(0);
    setSkippedDup(0);
    setFailed(0);
    setFailSamples([]);
    try {
      const auth = getCmsAuth();
      const u = auth?.currentUser ?? user;
      if (!u) {
        setStatus("error");
        setMessage("Bitte zuerst anmelden.");
        return;
      }
      const token = await u.getIdToken();
      const res = await fetch("/api/admin/legacy-abexis-posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setStatus("error");
        setMessage(typeof err.message === "string" ? err.message : `HTTP ${res.status}`);
        return;
      }
      const data: unknown = await res.json();
      const list = Array.isArray(data) ? data : [];
      setRawCount(list.length);
      const previews: RowPreview[] = [];
      for (const item of list) {
        try {
          const coerced = coerceLegacyPostRow(item);
          const slug = resolveLegacySlugForImport(coerced);
          const ex = (coerced.excerpt ?? "").trim() || "";
          const pub =
            coerced.publishedISO?.trim() && Number.isFinite(Date.parse(coerced.publishedISO))
              ? new Date(coerced.publishedISO).toISOString()
              : null;
          previews.push({
            title: coerced.title || coerced.listTitle || slug,
            slug,
            excerpt: ex.slice(0, 160) + (ex.length > 160 ? "…" : ""),
            publishedAt: pub,
          });
        } catch {
          previews.push({ title: "(ungültige Zeile)", slug: "n/a", excerpt: "", publishedAt: null });
        }
      }
      setRows(previews);
      setStatus("ready");
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Laden fehlgeschlagen.");
    }
  }, [user]);

  const runImport = useCallback(async () => {
    setMessage(null);
    setStatus("importing");
    setImported(0);
    setSkippedDup(0);
    setFailed(0);
    setFailSamples([]);
    let imp = 0;
    let skip = 0;
    let fail = 0;
    const fails: string[] = [];

    try {
      const auth = getCmsAuth();
      const u = auth?.currentUser ?? user;
      if (!u) throw new Error("Nicht angemeldet.");
      const token = await u.getIdToken();
      const res = await fetch("/api/admin/legacy-abexis-posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`JSON konnte nicht geladen werden (${res.status}).`);
      const data: unknown = await res.json();
      const list = Array.isArray(data) ? data : [];

      const seen = new Set<string>();
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        try {
          const coerced = coerceLegacyPostRow(item);
          const slug = resolveLegacySlugForImport(coerced);
          if (seen.has(slug)) {
            skip++;
            continue;
          }
          seen.add(slug);
          if (await postPublishedSlugExistsClient(slug)) {
            skip++;
            continue;
          }
          const id = newPostId();
          const mapped = mapLegacyPostToUpsert(coerced, { id, authorId: "_" });
          if (!mapped.ok) {
            fail++;
            if (fails.length < 15) fails.push(`${slug}: ${mapped.reasons.join(" · ")}`);
            continue;
          }
          const finalUpsert = {
            ...mapped.upsert,
            authorId: "_",
            categoryIds: [] as string[],
            featured: false,
            site: "abexis" as const,
            status: "published" as const,
          };
          await writeLegacyImportedPostWeb(finalUpsert);
          imp++;
        } catch (e) {
          fail++;
          const slugHint = typeof item === "object" && item && "slug" in item ? String((item as { slug?: string }).slug) : `#${i + 1}`;
          if (fails.length < 15) fails.push(`${slugHint}: ${formatFirestoreError(e)}`);
        }
      }

      setImported(imp);
      setSkippedDup(skip);
      setFailed(fail);
      setFailSamples(fails);
      setStatus("done");
      setMessage(null);
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Import fehlgeschlagen.");
    }
  }, [user]);

  if (!ready) {
    return (
      <AdminPageContainer>
        <AdminPageHeader title="Legacy-Import" description="Lade…" />
        <p className="text-sm text-[#6e6e73]">Sitzung wird geladen…</p>
      </AdminPageContainer>
    );
  }

  if (!user) {
    return (
      <AdminPageContainer>
        <AdminPageHeader title="Legacy-Import" description="Anmeldung erforderlich" />
        <p className="text-sm text-[#6e6e73]">Bitte unter «Anmelden» einloggen.</p>
        <Link className="mt-4 inline-block text-sm font-medium text-brand-900 underline" href="/admin/login">
          Zur Anmeldung
        </Link>
      </AdminPageContainer>
    );
  }

  if (!canImport) {
    return (
      <AdminPageContainer>
        <AdminPageHeader title="Legacy-Import" description="Keine Berechtigung" />
        <p className="text-sm text-[#6e6e73]">Sie benötigen die Berechtigung «Beiträge verwalten».</p>
        <Link className="mt-4 inline-block text-sm font-medium text-brand-900 underline" href="/admin">
          Zur Übersicht
        </Link>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Legacy-Blog importieren"
        description="Einmaliger Import aus data/legacy-abexis-posts.json über Firestore (Web SDK, angemeldete Session)."
      />
      {!firestoreOk ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Firebase Web SDK ist nicht konfiguriert.
        </p>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full bg-[var(--brand-900)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--brand-900-hover)] disabled:opacity-50"
              onClick={() => void loadJson()}
              disabled={status === "loading" || status === "importing"}
            >
              JSON laden &amp; Vorschau
            </button>
            <button
              type="button"
              className="rounded-full border border-black/[0.12] bg-white px-4 py-2 text-sm font-medium text-[#1d1d1f] hover:bg-black/[0.03] disabled:opacity-50"
              onClick={() => void runImport()}
              disabled={status === "loading" || status === "importing"}
            >
              Import starten
            </button>
            <Link
              href="/admin/posts"
              className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-brand-900 underline-offset-4 hover:underline"
            >
              Zu Beiträgen
            </Link>
          </div>

          {message ? <p className="text-sm text-red-600">{message}</p> : null}
          {status === "loading" ? <p className="text-sm text-[#6e6e73]">Lade Datei…</p> : null}
          {status === "importing" ? <p className="text-sm text-[#6e6e73]">Import läuft… bitte warten.</p> : null}

          {(status === "ready" || status === "done" || status === "importing") && rows.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-[#6e6e73]">
                Vorschau: <strong>{rows.length}</strong> von <strong>{rawCount}</strong> Zeilen
              </p>
              <div className="max-h-[420px] overflow-auto rounded-2xl border border-black/[0.08] bg-white">
                <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
                  <thead className="sticky top-0 bg-[#f5f5f7] text-[11px] font-semibold uppercase tracking-wide text-[#6e6e73]">
                    <tr>
                      <th className="px-3 py-2">Slug</th>
                      <th className="px-3 py-2">Titel</th>
                      <th className="px-3 py-2">Veröffentlicht</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={`${r.slug}-${i}`} className="border-t border-black/[0.06]">
                        <td className="max-w-[200px] truncate px-3 py-2 font-mono text-[12px]">{r.slug}</td>
                        <td className="max-w-[280px] truncate px-3 py-2">{r.title}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-[#6e6e73]">{r.publishedAt ?? "keine Angabe"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {status === "done" ? (
            <div className="rounded-2xl border border-black/[0.08] bg-[#f5f5f7] px-4 py-3 text-sm">
              <p>
                <strong>Importiert:</strong> {imported} &nbsp;|&nbsp; <strong>Übersprungen (Duplikat):</strong>{" "}
                {skippedDup} &nbsp;|&nbsp; <strong>Fehlgeschlagen:</strong> {failed}
              </p>
              {failSamples.length > 0 ? (
                <ul className="mt-2 list-disc pl-5 text-[13px] text-[#6e6e73]">
                  {failSamples.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          <p className="max-w-xl text-[13px] leading-relaxed text-[#6e6e73]">
            Speichern wie im Beitrags-Editor; Veröffentlichungsdatum aus der JSON-Datei. Duplikate: es wird nur geprüft, ob bereits ein{" "}
            <strong>veröffentlichter</strong> Beitrag mit demselben Slug existiert (damit Firestore-Leseregeln mit «nur published» funktionieren). Tritt
            weiterhin «permission-denied» auf: in der Konsole unter Firestore → Regeln prüfen, ob angemeldete Nutzer:innen Beiträge lesen und schreiben
            dürfen, und ob unter <code className="rounded bg-black/[0.06] px-1">users</code> für Ihre UID eine Editor-/Admin-Rolle gesetzt ist (wie im
            normalen CMS).
          </p>
        </div>
      )}
    </AdminPageContainer>
  );
}
