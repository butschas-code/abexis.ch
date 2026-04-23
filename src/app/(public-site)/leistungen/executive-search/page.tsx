import Link from "next/link";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";

export const metadata = {
  title: "Executive Search (Hinweis)",
};

export default function ExecutiveSearchReferralPage() {
  return (
    <InteriorPageLayout
      eyebrow="Verwandtes Angebot"
      title="Executive Search"
      description={
        <p>
          Executive Search und Personalberatung sind unter der Marke <strong className="font-semibold text-[#1d1d1f]">Abexis Search</strong>{" "}
          auf <strong className="font-semibold text-[#1d1d1f]">abexis.ch</strong> integriert. Hier finden Sie Fokusbereiche, den Suchprozess
          und aktuelle Vakanzen — im gleichen Look &amp; Feel wie die Managementberatung.
        </p>
      }
    >
      <Link
        href="/executive-search"
        className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-brand-900 px-8 text-[17px] font-medium text-white shadow-lg shadow-brand-900/30 transition-all duration-200 ease-out hover:bg-[var(--brand-900-hover)] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
      >
        Executive Search ansehen
      </Link>
      <p className="mt-10 text-[15px] leading-relaxed text-[#6e6e73]">
        Zurück zur{" "}
        <Link
          className="font-medium text-brand-900 underline-offset-4 transition-colors hover:text-brand-500 hover:underline"
          href="/leistungen"
        >
          Leistungsübersicht
        </Link>{" "}
        der Beratung.
      </p>
    </InteriorPageLayout>
  );
}
