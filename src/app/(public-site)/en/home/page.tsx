import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";
import { siteConfig } from "@/data/pages";
import { homeEn } from "@/data/home-en";
import { englishTopics } from "@/data/english-site";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { homeHeroImage } from "@/data/site-images";

export const metadata = {
  title: "Management Consulting",
  description: "Abexis helps your company move forward strategically, exploit growth potential and establish effective structures.",
  openGraph: {
    title: "Abexis : Management Consulting",
    description: "Transformation, Strategy & Leadership Advisory.",
    images: [{ url: homeHeroImage }],
  },
};

export default function EnglishHomePage() {
  return (
    <InteriorPageLayout
      eyebrow="English"
      title="Abexis Consulting"
      description={<p className="text-[19px] leading-relaxed md:text-[20px]">{homeEn.lead}</p>}
      wrapContentInMotion={false}
      contentClassName="pt-10 md:pt-14"
    >
      <SchemaMarkup
        path="/en/home"
        name="Management Consulting"
        description="Abexis helps your company move forward strategically, exploit growth potential and establish effective structures."
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "English", url: "/en/home" },
        ]}
      />
      <ul className="space-y-3 border-l border-brand-900/25 pl-5">
        {homeEn.pillars.map((l) => (
          <li key={l} className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#6e6e73]">
            {l}
          </li>
        ))}
      </ul>

      <MotionSection className="mt-14">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">About us</h2>
        <p className="mt-3 max-w-3xl text-[17px] leading-relaxed text-[#6e6e73]">{homeEn.about}</p>
      </MotionSection>

      <MotionSection className="mt-14">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Services</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {englishTopics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/en/topics/${topic.slug}`}
              className="rounded-[24px] bg-white p-6 shadow-[var(--apple-shadow)] ring-1 ring-black/[0.04] transition hover:shadow-[var(--apple-shadow-lg)]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">{topic.subtitle}</p>
              <h3 className="mt-2 text-[21px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">{topic.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#6e6e73]">{topic.excerpt}</p>
            </Link>
          ))}
        </div>
      </MotionSection>

      <MotionSection className="mt-16 border-t border-black/[0.06] pt-12">
        <p className="text-[16px] leading-relaxed text-[#6e6e73]">We look forward to hearing from you.</p>
        <p className="mt-3 text-[16px] leading-relaxed text-[#6e6e73]">
          You are also welcome to arrange a non-binding introductory call via calendly:{" "}
          <a
            className="font-semibold text-brand-900 underline-offset-4 transition-colors hover:text-brand-500 hover:underline"
            href={siteConfig.bookingUrlEn}
          >
            Schedule an appointment
          </a>
          .
        </p>
        <Link
          href="/en/contact"
          className="mt-8 inline-flex text-[15px] font-medium text-brand-900 underline-offset-4 transition-colors hover:text-brand-500 hover:underline"
        >
          Contact Abexis
        </Link>
      </MotionSection>
    </InteriorPageLayout>
  );
}
