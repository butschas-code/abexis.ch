import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";
import { fokusthemenMeta, siteConfig } from "@/data/pages";
import { homeEn } from "@/data/home-en";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { homeHeroImage } from "@/data/site-images";

export const metadata = {
  title: "Management Consulting",
  description: "Abexis helps your company move forward strategically, exploit growth potential and establish effective structures.",
  openGraph: {
    title: "Abexis — Management Consulting",
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
        type="BreadcrumbList"
        data={[
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
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Topics</h2>
        <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-[#6e6e73]">
          The detailed English topic pages remain available under the legacy paths on abexis.ch; the German
          consulting pages are the primary reference on this build.
        </p>
        <ul className="mt-8 space-y-3 text-[15px]">
          {fokusthemenMeta.map((t) => (
            <li key={t.slug}>
              <a
                className="font-medium text-brand-900 underline-offset-4 transition-colors hover:text-brand-500 hover:underline"
                href={`https://www.abexis.ch/en/fokusthemen/${slugToEn(t.slug)}`}
              >
                {t.title}
              </a>
            </li>
          ))}
        </ul>
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
          href="/"
          className="mt-8 inline-flex text-[15px] font-medium text-brand-900 underline-offset-4 transition-colors hover:text-brand-500 hover:underline"
        >
          ← Deutsch
        </Link>
      </MotionSection>
    </InteriorPageLayout>
  );
}

function slugToEn(slug: string) {
  if (slug === "digitale-transformation") return "digital-transformation";
  return slug;
}
