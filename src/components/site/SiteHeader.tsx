"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { mainNav, siteConfig } from "@/data/pages";
import { logoUrl } from "@/data/site-images";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <>
      {/* Executive Search bar — static, scrolls away with the page */}
      <div className="bg-brand-900 py-2">
        <div className="mx-auto flex max-w-[1068px] items-center justify-center px-6">
          <a
            href={siteConfig.searchSite}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 text-[12px] tracking-[0.05em] font-medium text-white/70 transition-colors duration-200 hover:text-white"
          >
            Executive Search Services
            <svg
              width="11"
              height="11"
              viewBox="0 0 12 12"
              fill="none"
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              <path
                d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Floating pill nav — sticky, zero height so content flows under it */}
      <header
        className="pointer-events-none sticky top-0 z-40 h-0 overflow-visible"
        style={{ paddingTop: 0 }}
      >
        <div className="px-4 md:px-6" style={{ paddingTop: "calc(0.75rem + env(safe-area-inset-top, 0px))" }}>
        {/* Pill */}
        <div className="pointer-events-auto mx-auto flex max-w-[1068px] w-full items-center justify-between gap-2 rounded-full border border-black/[0.07] bg-white px-3 py-2 shadow-[0_4px_24px_rgba(0,0,0,0.07)] md:gap-4 md:px-4">
          {/* Logo */}
          <Link href="/" className="focus-ring flex shrink-0 items-center rounded-full">
            <Image
              src={logoUrl}
              alt="Abexis"
              width={128}
              height={44}
              className="h-8 w-auto object-contain md:h-9"
              priority
            />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden flex-1 items-center justify-center gap-0.5 md:flex" aria-label="Hauptnavigation">
            {mainNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-1.5 text-[14px] leading-tight tracking-[-0.01em] transition-all duration-200 ${
                    active
                      ? "bg-brand-900 font-medium text-white"
                      : "text-[#6e6e73] hover:bg-black/[0.04] hover:text-[#1d1d1f]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <Link
            href="/termin"
            className="hidden shrink-0 items-center rounded-full bg-brand-900 px-5 py-2 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-[#324891] md:flex"
          >
            Termin buchen
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="focus-ring min-h-10 min-w-10 shrink-0 rounded-full border border-black/10 bg-white/60 px-4 py-1.5 text-[15px] font-medium text-[#1d1d1f] transition-colors duration-200 hover:bg-white hover:text-brand-900 md:hidden"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            Menü
          </button>
        </div>

        {/* Mobile dropdown — floats below the pill */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={reduce ? false : { height: 0, opacity: 0 }}
              animate={reduce ? undefined : { height: "auto", opacity: 1 }}
              exit={reduce ? undefined : { height: 0, opacity: 0 }}
              className="pointer-events-auto mx-auto mt-2 max-w-[1068px] w-full overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] md:hidden"
            >
              <nav
                className="flex flex-col p-3 text-[18px] font-medium"
                aria-label="Hauptnavigation mobil"
              >
                {mainNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-xl px-3 py-3 text-[#1d1d1f] transition-colors duration-200 hover:bg-black/[0.04] hover:text-brand-500"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
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
