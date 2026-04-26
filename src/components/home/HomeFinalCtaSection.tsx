import { homeClosingContent } from "@/data/home-page-content";
import { siteConfig } from "@/data/pages";

export function HomeFinalCtaSection() {
  const c = homeClosingContent;
  return (
    <section className="px-6 pt-4 pb-24 md:pb-28">
      <div className="abexis-hero-gradient-surface relative mx-auto max-w-[1068px] overflow-hidden rounded-[24px] px-5 py-12 text-center text-white sm:rounded-[28px] sm:px-8 sm:py-14 md:rounded-[32px] md:px-16 md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 18% 22%, rgba(255,255,255,0.38), transparent 42%), radial-gradient(circle at 82% 78%, rgba(69,179,226,0.45), transparent 45%), linear-gradient(160deg, rgba(38,51,124,0.2), transparent 55%)",
          }}
        />
        <div className="relative">
          <h2 className="text-[32px] font-semibold tracking-[-0.03em] md:text-[40px]">{c.headline}</h2>
          <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-white/90">{c.body}</p>
          <a
            href={siteConfig.bookingUrlDe}
            className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-8 text-[17px] font-medium text-brand-900 transition-all duration-200 ease-out hover:bg-white hover:shadow-xl hover:shadow-brand-900/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            rel="noreferrer"
          >
            {c.ctaLabel}
          </a>
          <p className="mt-8 text-[15px] text-white/85">
            <a href={`mailto:${siteConfig.emailPrimary}`} className="underline-offset-2 hover:underline">
              {siteConfig.emailPrimary}
            </a>
            <span className="text-white/50"> · </span>
            <a href={`tel:${siteConfig.phoneTel}`} className="underline-offset-2 hover:underline">
              {siteConfig.phoneDisplay}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
