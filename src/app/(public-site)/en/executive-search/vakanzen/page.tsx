import Link from "next/link";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";
import { unsplash } from "@/executive-search/lib/images/unsplash";

export const metadata = {
  title: "Vacancies | Abexis Executive Search",
  description: "Current executive search mandates and confidential opportunities.",
};

export default function EnglishVacanciesPage() {
  return (
    <InteriorPageLayout
      eyebrow="Vacancies"
      title="Current mandates"
      heroImage={unsplash.vakanzen}
      description={
        <p>
          Some mandates are published, others remain confidential. Contact us if you would like to discuss your profile
          or receive updates on suitable opportunities.
        </p>
      }
    >
      <div className="rounded-[28px] bg-white p-8 shadow-[var(--apple-shadow)] ring-1 ring-black/[0.04]">
        <p className="text-[16px] leading-relaxed text-[#6e6e73]">
          Please refer to the German vacancies page for currently published roles. We continuously accept new mandates
          and also handle confidential searches that are not listed publicly.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/executive-search/vakanzen" className="rounded-full border border-brand-900/20 px-5 py-3 text-[14px] font-semibold text-brand-900">
            View published roles
          </Link>
          <Link href="/en/kontakt" className="rounded-full bg-brand-900 px-5 py-3 text-[14px] font-semibold text-white">
            Contact Abexis
          </Link>
        </div>
      </div>
    </InteriorPageLayout>
  );
}
