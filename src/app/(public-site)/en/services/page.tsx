import Link from "next/link";
import type { ReactNode } from "react";
import { MotionSection } from "@/components/motion/MotionSection";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";
import { englishTopics } from "@/data/english-site";
import { fokusPageHeroImages } from "@/data/site-images";

export const metadata = {
  title: "Services | Abexis",
  description: "Management consulting services for strategy, digital transformation, sales, change and project execution.",
};

export default function EnglishServicesPage() {
  return (
    <InteriorPageLayout
      eyebrow="Services"
      title="Consulting with substance"
      heroImage={fokusPageHeroImages["digitale-transformation"]}
      description={
        <p>
          Abexis supports leadership teams where decisions have weight: strategy, digitalization, sales, change,
          processes and projects. Precise in analysis, discreet in collaboration and focused on implementation.
        </p>
      }
    >
      <MotionSection>
        <div className="grid gap-5 md:grid-cols-2">
          <LinkCard href="/en/projectrealitycheck" title="Project Reality Check" subtitle="Project clarity">
            A compact assessment for projects that need a clear view on risks, governance, execution and next decisions.
          </LinkCard>
          {englishTopics.map((topic) => (
            <LinkCard key={topic.slug} href={`/en/topics/${topic.slug}`} title={topic.title} subtitle={topic.subtitle}>
              {topic.excerpt}
            </LinkCard>
          ))}
        </div>
      </MotionSection>
    </InteriorPageLayout>
  );
}

function LinkCard({ href, title, subtitle, children }: { href: string; title: string; subtitle: string; children: ReactNode }) {
  return (
    <Link href={href} className="rounded-[24px] bg-white p-6 shadow-[var(--apple-shadow)] ring-1 ring-black/[0.04] transition hover:shadow-[var(--apple-shadow-lg)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">{subtitle}</p>
      <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">{title}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-[#6e6e73]">{children}</p>
    </Link>
  );
}
