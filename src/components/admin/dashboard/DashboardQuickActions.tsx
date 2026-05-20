import { CMS_PATHS } from "@/admin/paths";
import Link from "next/link";

const baseActions = [
  {
    href: CMS_PATHS.adminPostNew,
    title: "Neuer Beitrag",
    text: "Editor öffnen",
    style: "primary" as const,
  },
  {
    href: `${CMS_PATHS.adminPosts}?status=draft`,
    title: "Entwürfe",
    text: "Liste filtern",
    style: "secondary" as const,
  },
  {
    href: CMS_PATHS.adminCategories,
    title: "Kategorien",
    text: "Themen & Sites",
    style: "secondary" as const,
  },
  {
    href: CMS_PATHS.adminAuthors,
    title: "Autor:innen",
    text: "Profile pflegen",
    style: "secondary" as const,
  },
  {
    href: CMS_PATHS.adminMedia,
    title: "Bilder einbinden",
    text: "Hinweise zu URLs & Dateien",
    style: "secondary" as const,
  },
] as const;

type Props = {
  showSubmissionsShortcut?: boolean;
};

export function DashboardQuickActions({ showSubmissionsShortcut = true }: Props) {
  const actions = showSubmissionsShortcut
    ? [
        ...baseActions,
        {
          href: CMS_PATHS.adminSubmissions,
          title: "Eingänge",
          text: "Formularmeldungen",
          style: "secondary" as const,
        },
        {
          href: CMS_PATHS.adminApplications,
          title: "Bewerbungen",
          text: "Board & sortierbare Liste",
          style: "secondary" as const,
        },
      ]
    : [...baseActions];

  return (
    <div className="rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <h2 className="font-serif text-lg font-medium text-[var(--apple-text)]">Schnellzugriff</h2>
      <ul className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {actions.map((a) => (
          <li key={a.href} className="min-w-0 flex-1 sm:min-w-[200px]">
            <Link
              href={a.href}
              className={
                a.style === "primary"
                  ? "flex h-full flex-col rounded-xl bg-[var(--brand-900)] px-4 py-4 text-white transition hover:bg-[var(--brand-900-hover)]"
                  : "flex h-full flex-col rounded-xl border border-black/[0.1] bg-[var(--apple-bg)] px-4 py-4 transition hover:border-[var(--brand-900)]/25 hover:bg-white"
              }
            >
              <span className="text-sm font-semibold">{a.title}</span>
              <span
                className={
                  a.style === "primary" ? "mt-1 text-xs text-white/85" : "mt-1 text-xs text-[var(--apple-text-secondary)]"
                }
              >
                {a.text}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
