import { homeTestimonials } from "@/data/home-testimonials";

/**
 * Kundenstimmen im Stil der übrigen Startseite: viel Weissraum, dezente Karten, klare Typografie.
 */
export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden border-y border-black/[0.06] py-20 md:py-28">
      <div
        className="absolute inset-0 bg-[linear-gradient(165deg,#f5f5f7_0%,#ffffff_48%,#fafafa_100%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1068px] px-4 sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Referenzen</p>
        <h2 className="mt-2 text-[32px] font-semibold tracking-[-0.03em] text-[#1d1d1f] md:text-[40px]">
          Ergebnisse aus der Praxis.
        </h2>
        <p className="mt-4 max-w-[54ch] text-[15px] leading-relaxed text-[#6e6e73] sm:text-[16px]">
          Stimmen von Führungspersonen und Partnern — kompakt wiedergegeben, mit Freigabe der Zitierten.
        </p>

        <ul className="mt-14 grid list-none grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {homeTestimonials.map((item, idx) => (
            <li
              key={`${item.attribution}-${idx}`}
              className={idx === 0 ? "min-w-0 md:col-span-2" : "min-w-0"}
            >
              <figure className="group flex flex-col overflow-hidden rounded-[22px] bg-white p-6 shadow-[var(--apple-shadow)] ring-1 ring-black/[0.04] transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[var(--apple-shadow-lg)] hover:ring-black/[0.06] sm:rounded-[28px] sm:p-7 md:p-8">
                <blockquote className="relative border-l-2 border-brand-900/25 pl-4 sm:pl-5 md:pl-6">
                  <p className="text-[15px] font-normal leading-relaxed text-[#3c3c43] sm:text-[16px]">
                    {item.quote}
                  </p>
                </blockquote>
                <figcaption className="mt-6 border-t border-black/[0.06] pt-4 text-[13px] font-semibold leading-snug text-[#1d1d1f] sm:mt-7 sm:pt-5 sm:text-[14px]">
                  {item.attribution}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
