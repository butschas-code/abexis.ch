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

const triggerClass = (groupActive: boolean) =>
  `rounded-full px-4 py-1.5 text-[14px] leading-tight tracking-[-0.01em] transition-all duration-200 ${
    groupActive
      ? "bg-brand-900 font-medium text-white"
      : "text-[#6e6e73] hover:bg-black/[0.04] hover:text-[#1d1d1f]"
  }`;

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
          className={triggerClass(groupActive)}
        >
          {item.label}
        </Link>
      ) : (
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={submenuOpen}
          aria-controls={menuId}
          onFocus={() => setSubmenuOpen(true)}
          className={triggerClass(groupActive)}
        >
          {item.label}
        </button>
      )}
      <div
        id={menuId}
        className={`absolute left-0 top-full z-50 min-w-[14rem] max-w-[min(100vw-2rem,22rem)] pt-1 transition-[opacity,visibility] duration-150 ${
          submenuOpen ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
        }`}
        role="menu"
        aria-label={`${item.label} Untermenü`}
        aria-hidden={!submenuOpen}
      >
        <div className="rounded-2xl border border-black/[0.08] bg-white py-1 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
          {item.children.map((c) => {
            const subActive = pathname === c.href || (c.href !== "/" && pathname.startsWith(`${c.href}/`));
            return (
              <Link
                key={c.href}
                href={c.href}
                className={`block px-2 py-2 text-[14px] leading-tight ${
                  subActive
                    ? "bg-brand-900/10 font-medium text-brand-900"
                    : "text-[#1d1d1f] hover:bg-black/[0.04]"
                }`}
                role="menuitem"
                onClick={() => setSubmenuOpen(false)}
              >
                {c.label}
              </Link>
            );
          })}
        </div>
      </div>
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
