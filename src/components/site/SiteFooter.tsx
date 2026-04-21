import Link from "next/link";
import { footerPartners, siteConfig } from "@/data/pages";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/15 bg-[#26337c] text-white">
      <div className="mx-auto max-w-[1068px] pt-16 pl-[max(1.5rem,env(safe-area-inset-left,0px))] pr-[max(1.5rem,env(safe-area-inset-right,0px))] pb-[max(4rem,calc(3rem+env(safe-area-inset-bottom,0px)))] text-[12px] md:px-6 md:py-16">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-[15px] font-semibold text-white">{siteConfig.company}</p>
            <p className="mt-3 max-w-sm leading-relaxed">{siteConfig.footerAddressHinwil}</p>
            <p className="mt-4 max-w-sm leading-relaxed">
              Registerangaben:{" "}
              <Link
                className="text-white underline-offset-2 hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
                href="/legal-policy"
              >
                Impressum
              </Link>
              .
            </p>
          </div>
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white">Kontakt</p>
              <ul className="mt-3 space-y-2">
                <li>
                  <a
                    className="text-white hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
                    href={`mailto:${siteConfig.emailPrimary}`}
                  >
                    {siteConfig.emailPrimary}
                  </a>
                </li>
                <li>
                  <a
                    className="text-white hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
                    href={`tel:${siteConfig.phoneTel}`}
                  >
                    {siteConfig.phoneDisplay}
                  </a>
                </li>
                <li className="pt-1">
                  <a
                    href={siteConfig.bookingUrlDe}
                    className="text-white underline-offset-2 transition-opacity hover:underline hover:opacity-95 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
                    rel="noreferrer"
                  >
                    Termin planen
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white">Rechtliches</p>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link
                    className="text-white hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
                    href="/legal-policy"
                  >
                    Impressum
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
                    href="/privacy-policy"
                  >
                    Datenschutz
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
                    href="/en/home"
                  >
                    English
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/15 pt-8">
          <p className="leading-relaxed">
            Auch verfügbar:{" "}
            <a
              href="https://abexis-search.ch"
              className="font-medium text-white underline-offset-2 hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
              rel="noopener noreferrer"
            >
              Executive Search (Abexis Search)
            </a>
          </p>
        </div>

        <div className="mt-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white">Netzwerk</p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            {footerPartners.map((p) => (
              <li key={p.href}>
                <a
                  href={p.href}
                  className="text-white underline-offset-2 hover:underline focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
                  rel="noopener noreferrer"
                >
                  {p.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-12 text-[11px] text-white">© {siteConfig.company} · Alle Rechte vorbehalten</p>
      </div>
    </footer>
  );
}
