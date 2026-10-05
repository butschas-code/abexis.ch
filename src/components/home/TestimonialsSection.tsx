import { homeTestimonials, type HomeTestimonialItem } from "@/data/home-testimonials";

export function TestimonialsSection({
  eyebrow = "Referenzen",
  headline = "Ergebnisse aus der Praxis.",
  intro = "Stimmen von Führungspersonen und Partnern — mit Freigabe der Zitierten.",
  items = homeTestimonials,
}: {
  eyebrow?: string;
  headline?: string;
  intro?: string;
  items?: HomeTestimonialItem[];
} = {}) {
  if (items.length === 0) return null;

  return (
    <section className="relative overflow-hidden border-y border-black/[0.06] py-16 sm:py-24 md:py-32">
      <div
        className="absolute inset-0 bg-[linear-gradient(160deg,#f5f5f7_0%,#ffffff_48%,#f7f8fc_100%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[46rem] px-[max(1rem,env(safe-area-inset-left,0px))] sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6e6e73]">{eyebrow}</p>
        <h2 className="mt-3 text-balance break-words text-[28px] font-semibold leading-none tracking-[-0.03em] text-[#1d1d1f] sm:text-[32px] md:text-[40px]">
          {headline}
        </h2>
        <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-[#424245] sm:text-[16px]">{intro}</p>

        <ul className="mt-10 space-y-5 sm:mt-14 sm:space-y-6">
          {items.map((item) => {
            const paragraphs = item.quote.split(/\n\n+/).map((paragraph) => paragraph.trim()).filter(Boolean);
            return (
              <li key={item.attribution}>
                <figure className="rounded-[24px] bg-white px-6 py-7 shadow-[var(--apple-shadow)] ring-1 ring-black/[0.05] sm:rounded-[28px] sm:px-10 sm:py-9 md:px-12 md:py-10">
                  <blockquote>
                    <span className="block font-serif text-[3.25rem] leading-none text-brand-900/70" aria-hidden>
                      &ldquo;
                    </span>
                    {paragraphs.map((paragraph, index) => (
                      <p
                        key={index}
                        className={`text-[16.5px] leading-[1.75] text-[#1d1d1f] sm:text-[18px] ${index === 0 ? "mt-3" : "mt-4"}`}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </blockquote>
                  <figcaption className="mt-6 border-t border-black/[0.07] pt-4 text-right">
                    <AttributionText text={item.attribution} />
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function AttributionText({ text }: { text: string }) {
  const commaIdx = text.indexOf(",");
  if (commaIdx === -1) {
    return <p className="text-[15px] font-semibold tracking-[-0.01em] text-[#1d1d1f]">{text}</p>;
  }
  const name = text.slice(0, commaIdx).trim();
  const role = text.slice(commaIdx + 1).trim();
  return (
    <>
      <p className="text-[15px] font-semibold tracking-[-0.01em] text-[#1d1d1f]">{name}</p>
      <p className="mt-1 text-[13px] leading-snug text-[#424245]">{role}</p>
    </>
  );
}
