"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { type MainNavItem, mainNav } from "@/data/pages";
import { logoUrl } from "@/data/site-images";

function isExternalNavHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function isNavItemActive(item: MainNavItem, pathname: string): boolean {
  if ("children" in item && item.children) {
    for (const c of item.children) {
      if (pathname === c.href || (c.href !== "/" && pathname.startsWith(`${c.href}/`))) {
        return true;
      }
    }
    return pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
  }
  if (isExternalNavHref(item.href)) {
    return false;
  }
  return pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
}

function subLinkClassName(active: boolean) {
  return `block w-full rounded-xl px-3 py-2.5 text-left text-[15px] leading-tight ${
    active ? "bg-black/[0.06] font-medium text-[#1d1d1f]" : "text-[#6e6e73] hover:bg-black/[0.04] hover:text-[#1d1d1f]"
  }`;
}

const triggerClass = (groupActive: boolean, open = false) =>
  `flex items-center gap-1 rounded-full px-4 py-1.5 text-[14px] leading-tight tracking-[-0.01em] transition-all duration-200 select-none ${
    groupActive
      ? "bg-brand-900 font-medium text-white"
      : open
      ? "bg-black/[0.05] text-[#1d1d1f]"
      : "text-[#6e6e73] hover:bg-black/[0.04] hover:text-[#1d1d1f]"
  }`;

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      className={`mt-px shrink-0 transition-transform duration-200 ${open ? "-rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path
        d="M1 1L5 5L9 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DesktopSubmenu({
  item,
  pathname,
  groupActive,
}: {
  item: {
    href: string;
    label: string;
    children: readonly { href: string; label: string }[];
    parentIsLink?: boolean;
  };
  pathname: string;
  groupActive: boolean;
}) {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const menuId = useId();
  const parentIsLink = item.parentIsLink !== false;
  const reduce = useReducedMotion();

  const [overviewChild, ...restChildren] = item.children;
  const overviewActive =
    pathname === overviewChild.href ||
    (overviewChild.href !== "/" && pathname.startsWith(`${overviewChild.href}/`));

  return (
    <div
      className="relative w-max max-w-full"
      onMouseEnter={() => setSubmenuOpen(true)}
      onMouseLeave={() => setSubmenuOpen(false)}
      onBlur={(e) => {
        if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
        setSubmenuOpen(false);
      }}
    >
      {parentIsLink ? (
        <Link
          href={item.href}
          aria-haspopup="menu"
          aria-expanded={submenuOpen}
          aria-controls={menuId}
          onFocus={() => setSubmenuOpen(true)}
          className={triggerClass(groupActive, submenuOpen)}
        >
          {item.label}
          <ChevronDown open={submenuOpen} />
        </Link>
      ) : (
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={submenuOpen}
          aria-controls={menuId}
          onFocus={() => setSubmenuOpen(true)}
          className={triggerClass(groupActive, submenuOpen)}
        >
          {item.label}
          <ChevronDown open={submenuOpen} />
        </button>
      )}

      <AnimatePresence>
        {submenuOpen && (
          <motion.div
            id={menuId}
            role="menu"
            aria-label={`${item.label} Untermenü`}
            initial={reduce ? false : { opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "top left" }}
            className="absolute left-0 top-full z-50 min-w-[15rem] max-w-[min(100vw-2rem,24rem)] pt-2"
          >
            <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white/[0.97] shadow-[0_32px_80px_rgba(0,0,0,0.16),0_6px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl">
              {/* Top gradient accent */}
              <div className="h-[2.5px] bg-gradient-to-r from-[#26337c] via-[#3a68b8] to-[#45b3e2]" />

              {/* Featured overview row */}
              <Link
                href={overviewChild.href}
                role="menuitem"
                onClick={() => setSubmenuOpen(false)}
                className={`group flex items-center justify-between px-4 py-3.5 transition-colors duration-150 ${
                  overviewActive ? "bg-[#26337c]/[0.07]" : "hover:bg-[#26337c]/[0.04]"
                }`}
              >
                <div>
                  <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#26337c]/50">
                    {item.label}
                  </p>
                  <p
                    className={`text-[13px] font-medium transition-colors duration-150 ${
                      overviewActive ? "text-[#26337c]" : "text-[#1d1d1f] group-hover:text-[#26337c]"
                    }`}
                  >
                    {overviewChild.label}
                  </p>
                </div>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className={`shrink-0 transition-all duration-150 ${
                    overviewActive
                      ? "text-[#26337c] opacity-60"
                      : "text-[#86868b] opacity-30 group-hover:translate-x-0.5 group-hover:text-[#26337c] group-hover:opacity-60"
                  }`}
                  aria-hidden="true"
                >
                  <path
                    d="M2 7H12M8 3L12 7L8 11"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              {restChildren.length > 0 && (
                <>
                  <div className="border-t border-black/[0.05]" />
                  <div className="py-1.5">
                    {restChildren.map((c, idx) => {
                      const subActive =
                        pathname === c.href || (c.href !== "/" && pathname.startsWith(`${c.href}/`));
                      return (
                        <motion.div
                          key={c.href}
                          initial={reduce ? false : { opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.07 + idx * 0.04,
                            duration: 0.2,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          <Link
                            href={c.href}
                            role="menuitem"
                            onClick={() => setSubmenuOpen(false)}
                            className={`group relative flex items-center px-4 py-[9px] text-[13.5px] leading-snug transition-colors duration-150 ${
                              subActive
                                ? "bg-[#26337c]/[0.07] font-medium text-[#26337c]"
                                : "text-[#3a3a40] hover:bg-[#f4f6fb] hover:text-[#26337c]"
                            }`}
                          >
                            {/* Gradient left rail */}
                            <span
                              className={`absolute left-0 inset-y-1.5 w-[2.5px] rounded-r-full bg-gradient-to-b from-[#26337c] to-[#45b3e2] transition-opacity duration-150 ${
                                subActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                              }`}
                            />
                            <span className="flex-1 pl-1">{c.label}</span>
                            <svg
                              width="5"
                              height="9"
                              viewBox="0 0 5 9"
                              fill="none"
                              className={`ml-2.5 shrink-0 transition-all duration-150 ${
                                subActive
                                  ? "translate-x-0 opacity-60"
                                  : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-40"
                              }`}
                              aria-hidden="true"
                            >
                              <path
                                d="M1 1L4 4.5L1 8"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function navSubPanelId(href: string) {
  return `m-nav-sub-${href.replace(/^\//, "").replaceAll("/", "-")}`;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileSubOpenHref, setMobileSubOpenHref] = useState<string | null>(null);
  const reduce = useReducedMotion();

  return (
    <>
      {/* Floating pill nav — sticky, zero height so content flows under it */}
      <header className="pointer-events-none sticky top-0 z-40 h-0 overflow-visible">
        <div className="px-4 md:px-6" style={{ paddingTop: "calc(0.75rem + env(safe-area-inset-top, 0px))" }}>
          <div className="pointer-events-auto mx-auto flex w-full max-w-[1068px] items-center justify-between gap-2 rounded-full border border-black/[0.07] bg-white px-3 py-2 shadow-[0_4px_24px_rgba(0,0,0,0.07)] md:gap-4 md:px-4">
            <Link href="/" className="flex shrink-0 items-center">
              <Image
                src={logoUrl}
                alt="Abexis"
                width={128}
                height={44}
                className="h-8 w-auto object-contain md:h-9"
                priority
              />
            </Link>

            <nav className="hidden flex-1 items-center justify-center gap-0.5 md:flex" aria-label="Hauptnavigation">
              {mainNav.map((item) => {
                const groupActive = isNavItemActive(item, pathname);
                if ("children" in item && item.children) {
                  return (
                    <DesktopSubmenu
                      key={item.href}
                      item={item}
                      pathname={pathname}
                      groupActive={groupActive}
                    />
                  );
                }
                const external = isExternalNavHref(item.href);
                const baseActive = isNavItemActive(item, pathname);
                const className = `rounded-full px-4 py-1.5 text-[14px] leading-tight tracking-[-0.01em] transition-all duration-200 ${
                  baseActive
                    ? "bg-brand-900 font-medium text-white"
                    : "text-[#6e6e73] hover:bg-black/[0.04] hover:text-[#1d1d1f]"
                }`;
                return external ? (
                  <a key={item.href} href={item.href} className={className} rel="noopener noreferrer">
                    {item.label}
                  </a>
                ) : (
                  <Link key={item.href} href={item.href} className={className}>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <Link
              href="/termin"
              className="hidden shrink-0 items-center rounded-full bg-brand-900 px-5 py-2 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-[#324891] md:flex"
            >
              Termin buchen
            </Link>

            <button
              type="button"
              className="focus-ring min-h-10 min-w-10 shrink-0 rounded-full border border-black/10 bg-white/60 px-4 py-1.5 text-[15px] font-medium text-[#1d1d1f] transition-colors duration-200 hover:bg-white hover:text-brand-900 md:hidden"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              Menü
            </button>
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={reduce ? false : { height: 0, opacity: 0 }}
                animate={reduce ? undefined : { height: "auto", opacity: 1 }}
                exit={reduce ? undefined : { height: 0, opacity: 0 }}
                className="pointer-events-auto mx-auto mt-2 w-full max-w-[1068px] overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] md:hidden"
              >
                <nav className="flex flex-col p-3 text-[18px] font-medium" aria-label="Hauptnavigation mobil">
                  {mainNav.map((item) => {
                    if ("children" in item && item.children) {
                      const gActive = isNavItemActive(item, pathname);
                      const subOpen = mobileSubOpenHref === item.href;
                      const subId = navSubPanelId(item.href);
                      const parentIsLink = item.parentIsLink !== false;
                      return (
                        <div key={item.href} className="flex flex-col">
                          <div className="flex items-stretch gap-0">
                            {parentIsLink ? (
                              <Link
                                href={item.href}
                                className={`min-h-12 flex-1 rounded-xl px-3 py-3 text-left text-[#1d1d1f] transition-colors duration-200 hover:bg-black/[0.04] hover:text-brand-500 ${
                                  gActive ? "bg-black/[0.04] font-semibold" : ""
                                }`}
                                onClick={() => {
                                  setOpen(false);
                                  setMobileSubOpenHref(null);
                                }}
                              >
                                {item.label}
                              </Link>
                            ) : (
                              <span
                                className={`min-h-12 flex-1 rounded-xl px-3 py-3 text-left text-[#1d1d1f] ${
                                  gActive ? "bg-black/[0.04] font-semibold" : ""
                                }`}
                              >
                                {item.label}
                              </span>
                            )}
                            <button
                              type="button"
                              className="focus-ring shrink-0 rounded-xl px-3 py-2 text-[13px] font-semibold text-[#6e6e73] hover:bg-black/[0.04]"
                              aria-expanded={subOpen}
                              aria-controls={subId}
                              onClick={() => setMobileSubOpenHref((h) => (h === item.href ? null : item.href))}
                            >
                              {subOpen ? "−" : "+"}
                            </button>
                          </div>
                          {subOpen ? (
                            <div id={subId} className="ml-2 border-l border-black/[0.08] pl-2 pb-1">
                              {item.children.map((c) => {
                                const a =
                                  pathname === c.href || (c.href !== "/" && pathname.startsWith(`${c.href}/`));
                                return (
                                  <Link
                                    key={c.href}
                                    href={c.href}
                                    className={subLinkClassName(a)}
                                    onClick={() => {
                                      setOpen(false);
                                      setMobileSubOpenHref(null);
                                    }}
                                  >
                                    {c.label}
                                  </Link>
                                );
                              })}
                            </div>
                          ) : null}
                        </div>
                      );
                    }
                    const external = isExternalNavHref(item.href);
                    const className =
                      "rounded-xl px-3 py-3 text-[#1d1d1f] transition-colors duration-200 hover:bg-black/[0.04] hover:text-brand-500";
                    return external ? (
                      <a
                        key={item.href}
                        href={item.href}
                        className={className}
                        rel="noopener noreferrer"
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={className}
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                  <div className="my-2 border-t border-black/[0.06]" />
                  <Link
                    href="/termin"
                    className="mx-1 rounded-full bg-brand-900 px-5 py-3 text-center text-[16px] font-medium text-white transition-colors duration-200 hover:bg-[#324891]"
                    onClick={() => setOpen(false)}
                  >
                    Termin buchen
                  </Link>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}
