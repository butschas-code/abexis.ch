import Link from "next/link";
import { InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { PageHero } from "@/components/site/PageHero";
import { homeHeroImage } from "@/data/site-images";

export default function NotFound() {
  return (
    <InteriorPageRoot>
      <PageHero
        imageSrc={homeHeroImage}
        intro={<p>Der angeforderte Pfad existiert nicht oder wurde verschoben.</p>}
        actions={
          <Link
            href="/"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-brand-900 px-8 text-[17px] font-medium text-white shadow-lg shadow-brand-900/25 transition-all duration-200 ease-out hover:bg-[var(--brand-900-hover)] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            Zur Startseite
          </Link>
        }
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">404</p>
        <h1 className="mt-3 max-w-[20ch] text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-white md:text-[56px] md:leading-[1.02]">
          Seite nicht gefunden
        </h1>
      </PageHero>
    </InteriorPageRoot>
  );
}
