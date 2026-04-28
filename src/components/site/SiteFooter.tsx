import Image from "next/image";
import Link from "next/link";
import { mainNav, siteConfig } from "@/data/pages";
import { logoUrl } from "@/data/site-images";

const FOOTER_NAV = mainNav;

function FooterNavColumn({ label, items }: { label: string; items: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">{label}</p>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-[14px] leading-snug text-white/70 transition-colors duration-150 hover:text-white"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden bg-[#1a2460]">
      {/* Dramatic background: radial glow + noise texture layer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 10% 110%, rgba(69,179,226,0.13) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% -10%, rgba(201,169,110,0.09) 0%, transparent 55%)",
        }}
      />

      {/* Top accent gradient line */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, #26337c 0%, #3a68b8 40%, #45b3e2 70%, #c9a96e 100%)" }}
      />

      <div className="relative mx-auto max-w-[1068px] px-[max(1.5rem,env(safe-area-inset-left,0px))] md:px-6">

        {/* ── Main footer body ── */}
        <div className="grid gap-14 py-16 lg:grid-cols-[1fr_2fr] lg:gap-20 lg:py-20">

          {/* Brand column */}
          <div className="flex flex-col gap-8">
            {/* Logo with white-background container */}
            <Link href="/" className="inline-block self-start">
              <span className="block rounded-xl bg-white px-5 py-3 shadow-[0_2px_16px_rgba(0,0,0,0.18)]">
                <Image
                  src={logoUrl}
                  alt="Abexis"
                  width={148}
                  height={48}
                  className="h-10 w-auto object-contain"
                />
              </span>
            </Link>

            <p className="max-w-[22rem] text-[14px] leading-relaxed text-white/55">
              Managementberatung für Strategie, Digitalisierung, Vertrieb und Veränderung : Schweizer Präzision mit messbaren Resultaten.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abexis auf LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/50 transition-all duration-200 hover:border-white/30 hover:bg-white/[0.07] hover:text-white"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href={siteConfig.xing}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abexis auf Xing"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/50 transition-all duration-200 hover:border-white/30 hover:bg-white/[0.07] hover:text-white"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-12.5 16.999h-2l3.5-6-2-3.5h2l2 3.5-3.5 6zm8.5-11.999h2l-6 11h-2l2.5-4.5-2.5-4.5h2l1.5 2.5 2.5-4.5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Nav + Contact columns */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr]">
            {/* Column: Leistungen */}
            <FooterNavColumn
              label="Leistungen"
              items={[
                { href: "/leistungen", label: "Überblick" },
                { href: "/projectfitcheck", label: "Project Reality Check" },
                { href: "/fokusthemen/digitale-transformation", label: "Digitale Transformation" },
                { href: "/fokusthemen/unternehmensstrategie", label: "Unternehmensstrategie" },
                { href: "/fokusthemen/vertriebmarketing", label: "Vertrieb & Marketing" },
                { href: "/fokusthemen/veränderungsmanagement", label: "Veränderungsmanagement" },
                { href: "/fokusthemen/prozessoptimierung", label: "Prozessoptimierung" },
                { href: "/fokusthemen/projektmanagement", label: "Projektmanagement" },
              ]}
            />

            {/* Column: Unternehmen */}
            <FooterNavColumn
              label="Unternehmen"
              items={[
                { href: "/executive-search", label: "Executive Search" },
                { href: "/executive-search/vakanzen", label: "Vakanzen" },
                { href: "/blog", label: "Insights" },
                { href: "/ueber-uns", label: "Über uns" },
                { href: "/kontakt", label: "Kontakt" },
              ]}
            />

            {/* Column: Kontakt */}
            <div>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">Kontakt</p>
              <div className="space-y-3 text-[14px] leading-snug text-white/70">
                <p>{siteConfig.footerAddressHinwil}</p>
                <a
                  href={`mailto:${siteConfig.emailPrimary}`}
                  className="block transition-colors duration-150 hover:text-white"
                >
                  {siteConfig.emailPrimary}
                </a>
                <a
                  href={`tel:${siteConfig.phoneTel}`}
                  className="block transition-colors duration-150 hover:text-white"
                >
                  {siteConfig.phoneDisplay}
                </a>
              </div>

              <a
                href={siteConfig.bookingUrlDe}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#c9a96e]/40 bg-[#c9a96e]/10 px-4 py-2 text-[13px] font-medium text-[#c9a96e] transition-all duration-200 hover:border-[#c9a96e]/70 hover:bg-[#c9a96e]/20"
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <rect x="1" y="2" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M1 6h12" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M4 1v2M10 1v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                Termin buchen
              </a>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col gap-3 border-t border-white/[0.09] py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-white/35">
            © {year} {siteConfig.company} · Alle Rechte vorbehalten
          </p>
          <nav aria-label="Rechtliches" className="flex flex-wrap gap-x-5 gap-y-1">
            {[
              { href: "/legal-policy", label: "Impressum" },
              { href: "/privacy-policy", label: "Datenschutz" },
              { href: "/en/home", label: "English" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[12px] text-white/35 transition-colors duration-150 hover:text-white/70"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
