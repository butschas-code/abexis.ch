import Image from "next/image";
import { footerPartners } from "@/data/pages";
import { partnershipBannerLogos } from "@/data/site-images";

const INTRO =
  "Wir arbeiten mit verschiedenen namhaften Unternehmen zusammen und haben strategische Partnerschaften aufgebaut. Auch sind wir Mitglied verschiedener Verbände und Fachvereine:";

function PartnerLogoSlot({ label, logo }: { label: string; logo: string }) {
  return (
    <div className="flex shrink-0 cursor-default flex-col items-center gap-2 px-2 md:gap-2.5">
      <span className="relative flex h-12 w-[8.5rem] items-center md:h-14 md:w-36">
        <Image src={logo} alt="" fill className="object-contain opacity-100" sizes="(max-width: 768px) 120px, 144px" />
      </span>
      <span className="max-w-[9rem] text-center text-[10px] font-medium leading-tight text-[#6e6e73] md:max-w-[10rem] md:text-[11px]">{label}</span>
    </div>
  );
}

export function PartnershipsMarquee() {
  const items = footerPartners.map((p, i) => ({
    ...p,
    logo: partnershipBannerLogos[i]!,
  }));

  return (
    <section className="relative border-y border-black/[0.06] bg-gradient-to-b from-[#eef2fb] via-white to-[#e8f4fa] py-14 md:py-20">
      <div className="mx-auto max-w-[1068px] px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Partnerschaften</p>
        <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-[#1d1d1f] md:text-[32px]">Partnerschaften</h2>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-[#6e6e73]">{INTRO}</p>
      </div>

      <div className="partnership-marquee-wrap relative mt-10 overflow-hidden py-4 md:mt-12 md:py-6">
        <div className="partnership-marquee-track">
          <div className="partnership-marquee-seg flex shrink-0 items-center gap-12 md:gap-14">
            {items.map((p) => (
              <PartnerLogoSlot key={p.label} label={p.label} logo={p.logo} />
            ))}
          </div>
          <div
            className="partnership-marquee-seg partnership-marquee-seg--clone flex shrink-0 items-center gap-12 md:gap-14"
            aria-hidden
            inert
          >
            {items.map((p) => (
              <PartnerLogoSlot key={`clone-${p.label}`} label={p.label} logo={p.logo} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
