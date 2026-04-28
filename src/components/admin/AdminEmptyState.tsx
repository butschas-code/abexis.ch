import Link from "next/link";

import { adminBtnPrimary } from "@/components/admin/admin-ui";

type AdminEmptyStateProps = {
  title: string;
  description?: string;
  /** Optional primary action */
  action?: { label: string; href: string };
};

/**
 * Calm placeholder when a section has no data yet : inviting, not “empty error”.
 */
export function AdminEmptyState({ title, description, action }: AdminEmptyStateProps) {
  return (
    <div className="rounded-[1.25rem] border border-dashed border-black/[0.1] bg-[color-mix(in_srgb,var(--apple-bg-subtle)_55%,var(--apple-bg-elevated))] px-8 py-16 text-center">
      <div className="mx-auto mb-5 h-px w-12 bg-gradient-to-r from-transparent via-[var(--brand-900)]/25 to-transparent" />
      <p className="font-serif text-[1.25rem] font-medium tracking-tight text-[var(--apple-text)]">{title}</p>
      {description ? (
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[var(--apple-text-secondary)]">
          {description}
        </p>
      ) : null}
      {action ? (
        <div className="mt-8">
          <Link href={action.href} className={`${adminBtnPrimary} !px-6`}>
            {action.label}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
