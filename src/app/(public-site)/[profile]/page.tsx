import Image from "next/image";
import { notFound } from "next/navigation";
import { MotionSection } from "@/components/motion/MotionSection";
import { DanielSengstagProfilePage } from "@/components/profile/daniel-sengstag-ui";
import { InteriorPageLayout, InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { danielSengstagContent, danielSengstagImages } from "@/data/daniel-sengstag";
import { siteConfig, teamOrder, teamProfiles, type TeamSlug } from "@/data/pages";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";

type Props = { params: Promise<{ profile: string }> };

function isTeamSlug(s: string): s is TeamSlug {
  return (teamOrder as readonly string[]).includes(s);
}

export function generateStaticParams() {
  return teamOrder.map((profile) => ({ profile }));
}

export async function generateMetadata({ params }: Props) {
  const { profile } = await params;
  if (!isTeamSlug(profile)) return {};
  if (profile === "danielsengstag") {
    return {
      title: danielSengstagContent.meta.title,
      description: danielSengstagContent.meta.description,
      openGraph: {
        title: `${danielSengstagContent.meta.title} | Abexis`,
        description: danielSengstagContent.meta.description,
        type: "profile",
        images: [{ url: danielSengstagImages.hero }],
      },
    };
  }
  const p = teamProfiles[profile];
  return {
    title: p.name,
    description: `${p.name} : ${p.title} bei Abexis.`,
    openGraph: {
      title: `${p.name} | Abexis`,
      description: p.title,
      type: "profile",
      images: [{ url: p.image }],
    },
  };
}

export default async function TeamProfilePage({ params }: Props) {
  const { profile } = await params;
  if (!isTeamSlug(profile)) notFound();
  const p = teamProfiles[profile];

  if (profile === "danielsengstag") {
    return (
      <InteriorPageRoot>
        <SchemaMarkup
          type="Person"
          path={`/${profile}`}
          data={{ ...p, slug: profile }}
          breadcrumbs={[
            { name: "Startseite", url: "/" },
            { name: "Über uns", url: "/ueber-uns" },
            { name: p.name, url: `/${profile}` },
          ]}
        />
        <DanielSengstagProfilePage copy={danielSengstagContent} images={danielSengstagImages} />
      </InteriorPageRoot>
    );
  }

  return (
    <InteriorPageLayout
      eyebrow="Team"
      title={p.name}
      description={<p>{p.title}</p>}
      maxWidth="1068"
      contentMaxWidth="3xl"
      wrapContentInMotion={false}
      contentClassName="pt-10 md:pt-12"
      heroImage={p.image}
      heroImageObjectClassName="object-[center_28%]"
    >
      <SchemaMarkup
        type="Person"
        path={`/${profile}`}
        data={{ ...p, slug: profile }}
        breadcrumbs={[
          { name: "Startseite", url: "/" },
          { name: "Über uns", url: "/ueber-uns" },
          { name: p.name, url: `/${profile}` },
        ]}
      />
      <div className="flex flex-col gap-8 border-b border-black/[0.06] pb-10 md:flex-row md:items-start md:gap-10">
        <div className="relative mx-auto h-44 w-44 shrink-0 overflow-hidden rounded-[28px] bg-[#f5f5f7] shadow-[var(--apple-shadow)] ring-1 ring-black/[0.06] md:mx-0">
          <Image
            src={p.image}
            alt={p.name}
            fill
            className="object-cover"
            quality={95}
            sizes="200px"
          />
        </div>
        <div className="min-w-0 flex-1 text-center md:text-left">
          {p.phone ? (
            <p className="text-[15px] text-[#1d1d1f]">
              <a
                className="font-medium text-brand-900 underline-offset-4 transition-colors hover:text-brand-500 hover:underline"
                href={`tel:${p.phone.replace(/\s/g, "")}`}
              >
                {p.phone}
              </a>
            </p>
          ) : null}
          {p.email ? (
            <p className="mt-2 text-[15px]">
              <a
                className="font-medium text-brand-900 underline-offset-4 transition-colors hover:text-brand-500 hover:underline"
                href={`mailto:${p.email}`}
              >
                {p.email}
              </a>
            </p>
          ) : null}
          {p.links?.length ? (
            <ul className="mt-5 flex flex-wrap justify-center gap-5 text-[15px] md:justify-start">
              {p.links.map((l) => (
                <li key={l.href}>
                  <a
                    className="font-medium text-brand-900 underline-offset-4 transition-colors hover:text-brand-500 hover:underline"
                    href={l.href}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          <a
            href={siteConfig.bookingUrlDe}
            className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-full bg-brand-900 px-8 text-[15px] font-medium text-white shadow-lg shadow-brand-900/30 transition-all duration-200 ease-out hover:bg-[var(--brand-900-hover)] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            rel="noreferrer"
          >
            Unverbindlicher Termin vereinbaren
          </a>
        </div>
      </div>
      <MotionSection className="mt-10 pt-2">
        <div className="whitespace-pre-line text-[16px] leading-relaxed text-[#424245]">{p.body}</div>
      </MotionSection>
    </InteriorPageLayout>
  );
}
