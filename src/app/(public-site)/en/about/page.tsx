import Image from "next/image";
import Link from "next/link";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";
import { teamOrder, teamProfiles } from "@/data/pages";

export const metadata = {
  title: "About | Abexis",
  description: "Meet the Abexis team and learn how we support companies with strategy, transformation and execution.",
};

export default function EnglishAboutPage() {
  return (
    <InteriorPageLayout
      eyebrow="About"
      title="Experienced guidance with substance"
      description={
        <div className="space-y-4">
          <p>Abexis supports companies and leadership teams on their path to sustainable success.</p>
          <p>
            Our expertise spans strategy, sales and marketing, digitalization, change management, project execution and
            executive search. We work as pragmatic sparring partners where decisions, implementation and responsibility
            meet.
          </p>
        </div>
      }
    >
      <div className="grid items-stretch gap-6 md:grid-cols-2">
        {teamOrder.map((slug) => {
          const person = teamProfiles[slug];
          return (
            <article key={slug} className="flex gap-4 rounded-[24px] bg-white p-5 shadow-[var(--apple-shadow)] ring-1 ring-black/[0.04]">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f5f5f7]">
                <Image src={person.image} alt="" fill className="object-cover object-top" sizes="80px" />
              </div>
              <div>
                <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">{person.name}</h2>
                <p className="mt-1 line-clamp-3 text-[13px] leading-snug text-[#86868b]">{person.title}</p>
              </div>
            </article>
          );
        })}
      </div>
      <Link href="/en/contact" className="mt-10 inline-flex rounded-full bg-brand-900 px-5 py-3 text-[14px] font-semibold text-white">
        Contact Abexis
      </Link>
    </InteriorPageLayout>
  );
}
