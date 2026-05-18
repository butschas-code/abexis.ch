import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ConfidentialMandatesNotice } from "@/components/executive-search/ConfidentialMandatesNotice";
import { ExecutiveSearchClosingSection } from "@/components/executive-search/ExecutiveSearchClosingSection";
import { ExecutiveSearchIndustryStrip } from "@/components/executive-search/ExecutiveSearchIndustryStrip";
import { ExecutiveSearchStatementParallax } from "@/components/executive-search/ExecutiveSearchStatementParallax";
import { HeroPanel } from "@/components/executive-search/HeroPanel";
import { HomeIntroBand } from "@/components/executive-search/HomeIntroBand";
import { ParallaxBlock } from "@/components/executive-search/ParallaxBlock";
import { SectionShell } from "@/components/executive-search/SectionShell";
import { HomeVacancyTeasers } from "@/components/home/HomeVacancyTeasers";
import { MotionSection } from "@/components/motion/MotionSection";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { InsightPostCard } from "@/components/public-site/insights/InsightPostCard";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { PublicContentWidth } from "@/components/site/PublicContentWidth";
import { legacySiteImages } from "@/executive-search/data/legacy-site-images";
import { homeImagery } from "@/executive-search/lib/images/homeImagery";
import { listSearchSitePublishedPosts } from "@/public-site/cms";

const HERO_LEAD =
  "Abexis SEARCH fills leadership and key positions discreetly, precisely and with genuine advisory competence. Many of our mandates are deliberately not advertised publicly. That is why we work with confidential direct search, a clearly led search process and a deep understanding of role, market and organization. We bring companies together with personalities who are convincing professionally, fit culturally and create strategic impact.";

const INTRO_BODY =
  "For us, Executive Search is more than finding suitable profiles. It is about identifying personalities who can take responsibility, connect with the culture and create impact in their role, with precision in approach, clarity in assessment and care in placement.";

const BLOCK1_PARAS = [
  "We support companies in filling leadership and key positions where standard processes are not enough. Our work combines discreet direct search with a clearly structured process and a real understanding of roles, markets and organizations.",
  "We do not only search for qualifications. We look for personalities who can become effective in a specific context. What matters is whether experience, attitude, leadership understanding and cultural fit match the task and the company's strategic situation.",
  "The result is placement that convinces professionally, carries human weight and creates long-term impact.",
];

const BLOCK2_TITLE = "Advisory competence instead of pure placement";

const BLOCK2a =
  "Abexis SEARCH does not understand Executive Search as operative personnel placement, but as a high-quality advisory service. The central question is who can truly create impact in a specific role: not only on paper, but in interaction with leadership, team, culture and market.";

const BLOCK2b =
  "That is why we bring entrepreneurial understanding, structured process and a fine sense for context together. Our clients value this combination of analytical sharpness, discreet approach and reliable support in a search process that is clearly led and creates trust.";

const BLOCK3_TITLE = "Industry focus as a quality advantage";

const BLOCK3_PARAS = [
  "Fit is created where role depth and market understanding come together. Our focus areas are information technology and digitalization, industry, finance, banking and risk management, public sector and administration, and consulting.",
  "This focus enables precise outreach, sound assessment and a search that is not only careful, but also efficient. Those who understand functions, industry logic and business realities can identify the right personalities faster and assess their suitability more reliably.",
];

const DESCRIPTION =
  "Abexis SEARCH: discreet Executive Search and advisory for leadership and key positions, confidential mandates, direct search and deep industry understanding.";

const INDUSTRY_STRIP_COPY = {
  eyebrow: "Our industry focus",
  title: "Where depth meets the market",
  body: "Clear focus areas help us assess roles precisely, without losing sight of individual contexts.",
  sectors: [
    "Information technology & digitalization",
    "Industry",
    "Finance, banking & risk management",
    "Public sector & administration",
    "Consulting",
  ],
} as const;

const CONFIDENTIAL_COPY = {
  eyebrow: "Unsolicited application",
  title: "Not every suitable position is publicly visible.",
  paragraphs: [
    "Abexis SEARCH regularly works on confidential search mandates that are not published on the website. If you are open to a new leadership or key position, you can also submit your profile without applying for a specific vacancy.",
    "We review confidentially whether your background fits current or future mandates, especially in the following areas:",
  ],
  roleAreas: [
    "Sales positions",
    "Project and program leadership",
    "Executive positions",
    "Digital and innovation leadership",
    "Business unit leadership",
  ],
  ctaLabel: "Submit your profile",
} as const;

const CLOSING_COPY = {
  title: "Would you like to fill a leadership or key position?",
  body:
    "We would be pleased to discuss the mandate, context and target profile with you in an initial confidential exchange. Together we clarify which personality will not only complement your organization, but strengthen it effectively.",
  primaryLabel: "Book a call",
  secondaryLabel: "Contact Abexis",
  secondaryHref: "/en/kontakt",
} as const;

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Executive Search | Abexis",
  description: DESCRIPTION,
  openGraph: {
    title: "Executive Search | Abexis",
    description: DESCRIPTION,
  },
};

export default async function EnglishExecutiveSearchPage() {
  const searchPosts = await listSearchSitePublishedPosts(6);

  return (
    <InteriorPageRoot>
      <SchemaMarkup
        type="Service"
        path="/en/executive-search"
        name="Executive Search | Abexis"
        description={DESCRIPTION}
        breadcrumbs={[
          { name: "Home", url: "/en/home" },
          { name: "Executive Search", url: "/en/executive-search" },
        ]}
      />
      <HeroPanel
        title="Executive Search"
        subtitle="We find personalities, not just profiles."
        mainLead={HERO_LEAD}
        imageSrc={legacySiteImages.homeHero}
        primaryHref="#search-mandate"
        primaryLabel="Discuss a search mandate"
        secondaryHref="/en/kontakt"
        secondaryLabel="Start a confidential conversation"
      />

      <ExecutiveSearchIndustryStrip {...INDUSTRY_STRIP_COPY} />

      <ParallaxBlock yRange={[32, -32]}>
        <HomeIntroBand
          title="Executive Search with context and judgement"
          imageSrc={homeImagery.intro}
          imageAlt="Advisory-led candidate assessment in the search process"
        >
          <p className="max-w-3xl text-[17px] leading-relaxed text-[#6e6e73]">{INTRO_BODY}</p>
        </HomeIntroBand>
      </ParallaxBlock>

      <MotionSection>
        <div className="py-10 sm:py-14">
          <PublicContentWidth>
            <div className="relative overflow-hidden rounded-[1.5rem] bg-[#dfe6f5] shadow-[0_20px_60px_rgba(38,51,124,0.12)] ring-1 ring-black/[0.05] sm:rounded-[1.75rem]">
              <div className="relative isolate aspect-[21/9] min-h-[200px] w-full sm:min-h-[240px] md:aspect-[2.4/1] md:min-h-[280px]">
                <Image
                  src={homeImagery.sectors}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="(max-width:768px) 100vw, 1068px"
                />
                <div className="abexis-tint-overlay" aria-hidden />
              </div>
            </div>
          </PublicContentWidth>
        </div>
      </MotionSection>

      <MotionSection>
        <SectionShell id="discreet-search" title="Discreet search. Clear leadership. Strong fit.">
          <div className="max-w-3xl space-y-6">
            {BLOCK1_PARAS.map((p, i) => (
              <p key={`discreet-${i}`} className="text-[17px] leading-relaxed text-[#6e6e73]">
                {p}
              </p>
            ))}
          </div>
        </SectionShell>
      </MotionSection>

      <MotionSection>
        <ExecutiveSearchStatementParallax
          imageSrc={homeImagery.trust}
          imageAlt="Confidential collaboration in Executive Search"
          title={BLOCK2_TITLE}
          body={BLOCK2a}
          bodyParagraph2={BLOCK2b}
        />
      </MotionSection>

      <MotionSection>
        <SectionShell title={BLOCK3_TITLE} density="tight">
          <div className="max-w-3xl space-y-6">
            {BLOCK3_PARAS.map((p, i) => (
              <p key={`industry-${i}`} className="text-[17px] leading-relaxed text-[#6e6e73]">
                {p}
              </p>
            ))}
          </div>
        </SectionShell>
      </MotionSection>

      <HomeVacancyTeasers
        heading="Current vacancies"
        allLabel="All vacancies"
        allHref="/en/executive-search/vakanzen"
        actionLabel="View position"
        itemBaseHref="/en/executive-search/vakanzen"
      />

      <ConfidentialMandatesNotice
        copy={CONFIDENTIAL_COPY}
        spontaneousFallbackHref="/en/executive-search/vakanzen"
        linkToSpontaneousVacancy={false}
      />

      {searchPosts.length > 0 && (
        <MotionSection>
          <section className="apple-section-mesh py-20 sm:py-28">
            <PublicContentWidth>
              <div className="mb-10 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Executive Search · Insights</p>
                  <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-[#1d1d1f] sm:text-[32px]">
                    Perspectives & articles
                  </h2>
                </div>
                <Link href="/blog" className="shrink-0 text-[14px] font-medium text-brand-900 hover:underline">
                  All insights →
                </Link>
              </div>
              <ul className="grid list-none gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
                {searchPosts.map((post) => (
                  <li key={post.id} className="h-full">
                    <InsightPostCard
                      post={post}
                      href={`/executive-search/blog/${encodeURIComponent(post.slug)}`}
                      density="compact"
                    />
                  </li>
                ))}
              </ul>
            </PublicContentWidth>
          </section>
        </MotionSection>
      )}

      <ExecutiveSearchClosingSection copy={CLOSING_COPY} />
    </InteriorPageRoot>
  );
}
