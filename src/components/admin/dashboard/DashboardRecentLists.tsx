import Link from "next/link";
import { CMS_PATHS } from "@/admin/paths";
import type { CmsPostListItem } from "@/cms/services/posts-client";
import type { SubmissionRow } from "@/cms/services/submissions-client";

function formatWhen(iso: string | null) {
  if (!iso) return ",";
  try {
    return new Intl.DateTimeFormat("de-CH", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return ",";
  }
}

const statusDe: Record<string, string> = {
  draft: "Entwurf",
  published: "Live",
  archived: "Archiv",
};

type Props = {
  posts: CmsPostListItem[];
  submissions: SubmissionRow[];
  /** When false, hide the submissions column (editor role). */
  showSubmissions?: boolean;
};

function ListEmpty({ title, hint, href, cta }: { title: string; hint: string; href: string; cta: string }) {
  return (
    <div className="rounded-xl border border-dashed border-black/[0.1] bg-[var(--apple-bg-subtle)]/50 px-5 py-10 text-center">
      <p className="text-sm font-medium text-[var(--apple-text)]">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-[var(--apple-text-secondary)]">{hint}</p>
      <p className="mt-4">
        <Link href={href} className="text-xs font-medium text-[var(--brand-900)] hover:underline">
          {cta}
        </Link>
      </p>
    </div>
  );
}

export function DashboardRecentLists({ posts, submissions, showSubmissions = true }: Props) {
  return (
    <div className={showSubmissions ? "grid gap-6 lg:grid-cols-2" : "grid gap-6"}>
      <section className="rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-end justify-between gap-3 border-b border-black/[0.06] pb-4">
          <div>
            <h2 className="font-serif text-lg font-medium text-[var(--apple-text)]">Neueste Beiträge</h2>
            <p className="mt-0.5 text-xs text-[var(--apple-text-secondary)]">Nach letzter Bearbeitung</p>
          </div>
          <Link href={CMS_PATHS.adminPosts} className="shrink-0 text-xs font-medium text-[var(--brand-900)] hover:underline">
            Alle →
          </Link>
        </div>
        {posts.length === 0 ? (
          <div className="mt-5">
            <ListEmpty
              title="Noch keine Beiträge"
              hint="Sobald Sie Inhalte anlegen, erscheinen die letzten Änderungen hier."
              href={CMS_PATHS.adminPostNew}
              cta="Ersten Beitrag starten"
            />
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-black/[0.06]">
            {posts.map((p) => (
              <li key={p.id} className="flex flex-wrap items-start justify-between gap-2 py-3 first:pt-0">
                <div className="min-w-0">
                  <Link
                    href={CMS_PATHS.adminPostEdit(p.id)}
                    className="text-sm font-medium text-[var(--apple-text)] hover:text-[var(--brand-900)]"
                  >
                    {p.title || "(ohne Titel)"}
                  </Link>
                  <p className="mt-0.5 font-mono text-[11px] text-[var(--apple-text-tertiary)]">{p.slug}</p>
                </div>
                <div className="shrink-0 text-right text-xs text-[var(--apple-text-secondary)]">
                  <span className="rounded-full bg-black/[0.05] px-2 py-0.5">{statusDe[p.status] ?? p.status}</span>
                  <p className="mt-1">{formatWhen(p.updatedAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {showSubmissions ? (
        <section className="rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-end justify-between gap-3 border-b border-black/[0.06] pb-4">
            <div>
              <h2 className="font-serif text-lg font-medium text-[var(--apple-text)]">Neueste Eingänge</h2>
              <p className="mt-0.5 text-xs text-[var(--apple-text-secondary)]">Formular- und Kontaktmeldungen</p>
            </div>
            <Link
              href={CMS_PATHS.adminSubmissions}
              className="shrink-0 text-xs font-medium text-[var(--brand-900)] hover:underline"
            >
              Alle →
            </Link>
          </div>
          {submissions.length === 0 ? (
            <div className="mt-5">
              <ListEmpty
                title="Noch keine Eingänge"
                hint="Sobald Besucher:innen ein Formular senden, erscheinen die Meldungen hier."
                href={CMS_PATHS.adminSubmissions}
                cta="Zur Eingangsliste"
              />
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-black/[0.06]">
              {submissions.map((s) => (
                <li key={s.id} className="flex flex-wrap items-start justify-between gap-2 py-3 first:pt-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--apple-text)]">{s.type || "Eingang"}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-[var(--apple-text-tertiary)]">{s.id}</p>
                  </div>
                  <div className="shrink-0 text-right text-xs text-[var(--apple-text-secondary)]">
                    <p>{s.site}</p>
                    <p className="mt-1">{formatWhen(s.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}
    </div>
  );
}
