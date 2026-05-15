import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";
import { prcAblaufTimeline } from "@/data/site-images";

export const metadata = {
  title: "Project Reality Check | Abexis",
  description: "A compact Abexis assessment for projects that need clarity on risks, governance and next decisions.",
};

export default function EnglishProjectRealityCheckPage() {
  return (
    <InteriorPageLayout
      eyebrow="Project Reality Check"
      title="When a project needs clarity, quickly"
      heroImage={prcAblaufTimeline}
      description={
        <p>
          The Abexis Project Reality Check creates a precise view of where a project really stands, where risks are
          emerging and which decisions are needed now.
        </p>
      }
    >
      <MotionSection className="grid gap-6 md:grid-cols-3">
        {[
          ["Challenge", "Many projects appear to be on track while risks grow below the surface: unclear governance, optimistic status reports or delayed decisions."],
          ["Result", "You receive a clear assessment, risk transparency, concrete recommendations and a 30 / 60 / 90 day action plan."],
          ["Approach", "We review six dimensions: strategy, governance, execution, risks, change and technology."],
        ].map(([title, body]) => (
          <article key={title} className="rounded-[24px] bg-white p-6 shadow-[var(--apple-shadow)] ring-1 ring-black/[0.04]">
            <h2 className="text-[21px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">{title}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#6e6e73]">{body}</p>
          </article>
        ))}
      </MotionSection>
      <MotionSection className="mt-10 rounded-[28px] bg-[#f5f5f7] p-8">
        <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">Variants</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["Lite", "3 days", "Quick check and early warning"],
            ["Professional", "5 days", "Full analysis and action plan"],
            ["Deep Dive", "10 days", "Detailed analysis and implementation support"],
          ].map(([name, duration, focus]) => (
            <div key={name} className="rounded-[20px] bg-white p-5 ring-1 ring-black/[0.04]">
              <h3 className="text-[18px] font-semibold text-[#1d1d1f]">{name}</h3>
              <p className="mt-2 text-[14px] text-[#6e6e73]">{duration}</p>
              <p className="mt-1 text-[14px] leading-relaxed text-[#6e6e73]">{focus}</p>
            </div>
          ))}
        </div>
        <Link href="/en/contact" className="mt-8 inline-flex rounded-full bg-brand-900 px-5 py-3 text-[14px] font-semibold text-white">
          Discuss your project
        </Link>
      </MotionSection>
    </InteriorPageLayout>
  );
}
