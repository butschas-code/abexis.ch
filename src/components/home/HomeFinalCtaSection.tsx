import { homeClosingContent } from "@/data/home-page-content";
import { siteConfig } from "@/data/pages";

export function HomeFinalCtaSection() {
  const c = homeClosingContent;
  return (
    <section className="pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] pt-2 pb-20 sm:px-6 sm:pb-24 md:pb-28">
      <div className="abexis-hero-gradient-surface relative mx-auto max-w-[1068px] overflow-hidden rounded-[20px] px-4 py-10 text-center text-white sm:rounded-[24px] sm:px-8 sm:py-12 md:rounded-[32px] md:px-16 md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 18% 22%, rgba(255,255,255,0.38), transparent 42%), radial-gradient(circle at 82% 78%, rgba(69,179,226,0.45), transparent 45%), linear-gradient(160deg, rgba(38,51,124,0.2), transparent 55%)",
          }}
        />
        <div className="relative">
          <h2 className="text-balance break-words text-[26px] font-semibold leading-none tracking-[-0.03em] sm:text-[32px] md:text-[40px]">{c.headline}</h2>
          <p className="mx-auto mt-3 max-w-xl text-[16px] leading-relaxed text-white/90 sm:mt-4 sm:text-[17px]">{c.body}</p>
          <a
            href={siteConfig.bookingUrlDe}
            className="mx-auto mt-7 inline-flex min-h-12 w-full max-w-sm touch-manipulation items-center justify-center rounded-full bg-white px-6 text-[16px] font-medium text-brand-900 transition-all duration-200 ease-out hover:bg-white hover:shadow-xl hover:shadow-brand-900/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] sm:mt-8 sm:min-h-[48px] sm:max-w-none sm:px-8 sm:text-[17px]"
            rel="noreferrer"
          >
            {c.ctaLabel}
          </a>
          <p className="mt-7 flex flex-col items-center gap-2.5 text-[15px] text-white/85 sm:mt-8 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-0 sm:text-[15px]">
            <a
              href={`mailto:${siteConfig.emailPrimary}`}
              className="min-h-11 min-w-0 touch-manipulation break-all underline-offset-2 hover:underline"
            >
              {siteConfig.emailPrimary}
            </a>
            <span className="hidden text-white/50 sm:inline sm:px-1.5" aria-hidden>
              ·
            </span>
            <a
              href={`tel:${siteConfig.phoneTel}`}
              className="min-h-11 min-w-0 touch-manipulation whitespace-nowrap underline-offset-2 hover:underline"
            >
              {siteConfig.phoneDisplay}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
