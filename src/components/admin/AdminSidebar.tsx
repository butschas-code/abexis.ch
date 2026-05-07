"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CMS_PATHS } from "@/admin/paths";
import { useCmsAuth } from "@/cms/auth/cms-auth-context";
import { roleHasPermission } from "@/cms/auth/permissions";
import { ADMIN_NAV_ITEMS, adminNavItemIsActive } from "./admin-navigation";

type AdminSidebarProps = {
  onNavigate?: () => void;
  className?: string;
};

export function AdminSidebar({ onNavigate, className = "" }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, role, roleReady } = useCmsAuth();
  const navPending = user === undefined || !roleReady;
  const visibleNav = navPending ? [] : ADMIN_NAV_ITEMS.filter((item) => roleHasPermission(role, item.permission));

  return (
    <aside
      className={`flex h-full min-h-0 flex-col border-r border-black/[0.07] bg-[#f7f6f3] ${className}`}
    >
      <div className="border-b border-black/[0.05] px-5 py-7">
        <Link
          href={CMS_PATHS.adminHome}
          onClick={onNavigate}
          className="group block outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-900)]/22 focus-visible:ring-offset-2"
        >
          <span className="block font-serif text-[1.4rem] font-medium tracking-[-0.02em] text-[var(--apple-text)] transition group-hover:text-[var(--brand-900)]">
            Abexis
          </span>
          <span className="mt-1.5 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--apple-text-tertiary)]">
            Redaktion
          </span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-5" aria-label="CMS Hauptnavigation">
        {navPending ? (
          <ul className="space-y-2" aria-hidden>
            {Array.from({ length: 8 }).map((_, i) => (
              <li
                key={i}
                className="h-10 animate-pulse rounded-[11px] bg-black/[0.06]"
                style={{ width: `${100 - (i % 3) * 8}%` }}
              />
            ))}
          </ul>
        ) : (
          visibleNav.map((item) => {
            const active = adminNavItemIsActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={
                  active
                    ? "relative rounded-[11px] border border-black/[0.06] bg-white py-2.5 pl-3 pr-3 text-[14px] font-medium leading-snug text-[var(--apple-text)] shadow-[0_1px_0_rgba(0,0,0,0.03)] before:absolute before:left-0 before:top-1/2 before:h-[60%] before:w-[3px] before:-translate-y-1/2 before:rounded-full before:bg-[var(--brand-900)] before:content-['']"
                    : "rounded-[11px] px-3 py-2.5 text-[14px] font-normal leading-snug text-[var(--apple-text-secondary)] transition hover:bg-black/[0.04] hover:text-[var(--apple-text)]"
                }
              >
                {item.label}
              </Link>
            );
          })
        )}
      </nav>

      <div className="mt-auto border-t border-black/[0.05] px-5 py-5">
        <p className="text-[11px] leading-[1.55] text-[var(--apple-text-tertiary)]">
          Publikation für{" "}
          <span className="font-medium text-[var(--apple-text-secondary)]">abexis.ch</span>
        </p>
      </div>
    </aside>
  );
}
