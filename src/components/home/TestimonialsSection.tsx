import { homeTestimonials } from "@/data/home-testimonials";

export function TestimonialsSection() {
  const [featured, ...rest] = homeTestimonials;

  return (
    <section className="relative overflow-hidden border-y border-black/[0.06] py-16 sm:py-24 md:py-32">
      <div
        className="absolute inset-0 bg-[linear-gradient(160deg,#f5f5f7_0%,#ffffff_55%,#fafafa_100%)]"
        aria-hidden
      />

      {/* decorative backdrop quotemark */}
      <span
        className="pointer-events-none absolute -top-6 right-[max(1rem,4vw)] select-none font-serif text-[18rem] leading-none text-black/[0.028] sm:text-[22rem]"
        aria-hidden
      >
        &ldquo;
      </span>

      <div className="relative mx-auto max-w-[1068px] px-[max(1rem,env(safe-area-inset-left,0px))] sm:px-6">

        {/* header */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Referenzen</p>
        <h2 className="mt-2 text-balance break-words text-[28px] font-semibold leading-none tracking-[-0.03em] text-[#1d1d1f] sm:text-[32px] md:text-[40px]">
          Ergebnisse aus der Praxis.
        </h2>
        <p className="mt-3 max-w-[54ch] text-[15px] leading-relaxed text-[#6e6e73] sm:mt-4 sm:text-[16px]">
          Stimmen von Führungspersonen und Partnern — mit Freigabe der Zitierten.
        </p>

        {/* featured testimonial */}
        <figure className="group mt-10 sm:mt-14 overflow-hidden rounded-[24px] bg-white p-7 shadow-[var(--apple-shadow-lg)] ring-1 ring-black/[0.05] transition duration-300 hover:-translate-y-0.5 sm:rounded-[32px] sm:p-10 md:p-12">
          <div className="mb-5 flex items-start gap-4 sm:mb-6">
            <span className="mt-0.5 shrink-0 font-serif text-[3.5rem] leading-none text-brand-900/20 sm:text-[4.5rem]">&ldquo;</span>
            <blockquote className="min-w-0">
              <p className="text-[16px] font-normal leading-[1.75] text-[#3c3c43] sm:text-[18px] md:text-[19px]">
                {featured.quote}
              </p>
            </blockquote>
          </div>
          <figcaption className="flex items-center gap-3 border-t border-black/[0.07] pt-5 sm:pt-6">
            <div className="h-px flex-1 bg-transparent" />
            <div className="text-right">
              <AttributionText text={featured.attribution} />
            </div>
          </figcaption>
        </figure>

        {/* secondary grid */}
        <ul className="mt-5 grid list-none grid-cols-1 gap-5 sm:mt-6 sm:grid-cols-2 sm:gap-6">
          {rest.map((item, idx) => (
            <li key={`${item.attribution}-${idx}`} className="min-w-0">
              <figure className="group flex h-full flex-col overflow-hidden rounded-[20px] bg-white p-6 shadow-[var(--apple-shadow)] ring-1 ring-black/[0.04] transition duration-300 hover:-translate-y-0.5 hover:shadow-[var(--apple-shadow-lg)] hover:ring-black/[0.06] sm:rounded-[24px] sm:p-7">
                <span className="mb-3 block font-serif text-[2.5rem] leading-none text-brand-900/15">&ldquo;</span>
                <blockquote className="flex-1">
                  <p className="text-[15px] leading-[1.7] text-[#3c3c43] sm:text-[15.5px]">
                    {item.quote}
                  </p>
                </blockquote>
                <figcaption className="mt-5 border-t border-black/[0.06] pt-4">
                  <AttributionText text={item.attribution} />
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function AttributionText({ text }: { text: string }) {
  const commaIdx = text.indexOf(",");
  if (commaIdx === -1) {
    return <p className="text-[13px] font-semibold text-[#1d1d1f] sm:text-[14px]">{text}</p>;
  }
  const name = text.slice(0, commaIdx).trim();
  const role = text.slice(commaIdx + 1).trim();
  return (
    <>
      <p className="text-[13px] font-semibold text-[#1d1d1f] sm:text-[14px]">{name}</p>
      <p className="mt-0.5 text-[12px] text-[#86868b] sm:text-[13px]">{role}</p>
    </>
  );
}
