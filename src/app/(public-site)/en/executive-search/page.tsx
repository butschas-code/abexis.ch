import Link from "next/link";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";
import { unsplash } from "@/executive-search/lib/images/unsplash";

export const metadata = {
  title: "Executive Search | Abexis",
  description: "Discreet executive search for leadership and key positions with business understanding and personal judgement.",
};

export default function EnglishExecutiveSearchPage() {
  return (
    <InteriorPageLayout
      eyebrow="Executive Search"
      title="We find personalities, not just profiles"
      heroImage={unsplash.hero}
      description={
        <p>
          Abexis supports companies in filling leadership and key roles discreetly, precisely and with a strong
          understanding of the business context behind each mandate.
        </p>
      }
    >
      <div className="grid gap-6 md:grid-cols-3">
        {["Discreet mandate setup", "Focused direct search", "Clear shortlist and sparring"].map((item) => (
          <article key={item} className="rounded-[24px] bg-white p-6 shadow-[var(--apple-shadow)] ring-1 ring-black/[0.04]">
            <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">{item}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#6e6e73]">
              Senior judgement, structured process and a clear view on fit, motivation and impact.
            </p>
          </article>
        ))}
      </div>
      <Link href="/en/kontakt" className="mt-10 inline-flex rounded-full bg-brand-900 px-5 py-3 text-[14px] font-semibold text-white">
        Start a confidential conversation
      </Link>
    </InteriorPageLayout>
  );
}
