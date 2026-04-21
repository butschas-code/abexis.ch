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
      <div className="relative mx-auto max-w-[1068px] px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Stimmen</p>
        <h2 className="mt-2 text-[32px] font-semibold tracking-[-0.03em] text-[#1d1d1f] md:text-[40px]">
          Was unsere Kunden sagen
        </h2>
        <p className="mt-4 max-w-[54ch] text-[17px] leading-relaxed text-[#6e6e73]">
          Aussagen von Führungspersonen aus Verwaltung und Wirtschaft — inhaltlich unverändert gegenüber den
          Kundenfreigaben der bisherigen Website, neu für gute Lesbarkeit aufbereitet.
        </p>

        <ul className="mt-14 grid list-none grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {homeTestimonials.map((item, idx) => (
            <li key={`${item.attribution}-${idx}`} className="min-w-0">
              <figure className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-white p-8 shadow-[var(--apple-shadow)] ring-1 ring-black/[0.04] transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[var(--apple-shadow-lg)] hover:ring-black/[0.06] md:p-10">
                <blockquote className="relative flex-1 border-l-2 border-brand-900/25 pl-5 md:pl-6">
                  <p className="font-serif text-[19px] font-normal leading-[1.55] tracking-[-0.015em] text-[#1d1d1f] md:text-[21px] md:leading-[1.5]">
                    {item.quote}
                  </p>
                </blockquote>
                <figcaption className="mt-8 border-t border-black/[0.06] pt-6 text-[14px] font-semibold leading-snug tracking-[-0.01em] text-[#1d1d1f] md:text-[15px]">
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
