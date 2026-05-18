import Link from "next/link";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";

export const metadata = {
  title: "Executive Search | Abexis",
};

export default function EnglishExecutiveSearchReferralPage() {
  return (
    <InteriorPageLayout
      eyebrow="Related offering"
      title="Executive Search"
      description={
        <p>
          Executive Search and personnel consulting are integrated under the <strong className="font-semibold text-[#1d1d1f]">Abexis Search</strong>{" "}
          offering on <strong className="font-semibold text-[#1d1d1f]">abexis.ch</strong>. You will find focus areas, the search process
          and current vacancies in the same look and feel as the management consulting site.
        </p>
      }
    >
      <Link
        href="/en/executive-search"
        className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-brand-900 px-8 text-[17px] font-medium text-white shadow-lg shadow-brand-900/30 transition-all duration-200 ease-out hover:bg-[var(--brand-900-hover)] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
      >
        View Executive Search
      </Link>
      <p className="mt-10 text-[15px] leading-relaxed text-[#6e6e73]">
        Back to the{" "}
        <Link
          className="font-medium text-brand-900 underline-offset-4 transition-colors hover:text-brand-500 hover:underline"
          href="/en/leistungen"
        >
          services overview
        </Link>
        .
      </p>
    </InteriorPageLayout>
  );
}
