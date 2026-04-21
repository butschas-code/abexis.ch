"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { mainNav } from "@/data/pages";
import { logoUrl } from "@/data/site-images";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white pt-[env(safe-area-inset-top,0px)]">
      <div className="mx-auto flex max-w-[1068px] items-center justify-between gap-4 py-3 pl-[max(1.5rem,env(safe-area-inset-left,0px))] pr-[max(1.5rem,env(safe-area-inset-right,0px))] md:gap-8 md:px-6 md:py-4">
        <Link href="/" className="flex items-center gap-2 focus-ring rounded-full">
          <Image src={logoUrl} alt="Abexis" width={128} height={44} className="h-9 w-auto object-contain md:h-10" priority />
        </Link>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Hauptnavigation">
          {mainNav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : item.href === "/admin"
                  ? pathname.startsWith("/admin")
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[15px] leading-tight tracking-[-0.01em] transition-colors duration-200 ease-out ${
                  active
                    ? "font-semibold text-[#1d1d1f] hover:text-brand-900"
                    : "font-normal text-[#6e6e73] hover:text-brand-500"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="focus-ring min-h-11 min-w-11 shrink-0 rounded-full border border-black/10 bg-white px-4 py-2 text-[16px] font-medium text-[#1d1d1f] transition-colors duration-200 hover:border-black/20 hover:bg-[#f5f5f7] hover:text-brand-900 md:hidden"
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
            className="border-t border-black/[0.06] bg-white md:hidden"
          >
            <nav
              className="flex flex-col py-4 pl-[max(1.5rem,env(safe-area-inset-left,0px))] pr-[max(1.5rem,env(safe-area-inset-right,0px))] text-[19px] font-medium"
              aria-label="Hauptnavigation mobil"
            >
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-3 py-3 text-[#1d1d1f] transition-colors duration-200 hover:bg-[#f5f5f7] hover:text-brand-500"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
