import { PublicImage as Image } from "@/components/site/PublicImage";
import { notFound } from "next/navigation";
import { MotionSection } from "@/components/motion/MotionSection";
import { DanielSengstagProfilePage } from "@/components/profile/daniel-sengstag-ui";
import { SchemaMarkup } from "@/components/public-site/SchemaMarkup";
import { InteriorPageLayout, InteriorPageRoot } from "@/components/site/InteriorPageLayout";
import { danielSengstagContentEn, danielSengstagImages } from "@/data/daniel-sengstag";
import { teamOrder, teamProfiles, type TeamSlug } from "@/data/pages";
import { teamProfilesEn } from "@/data/team-profiles-en";

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
      title: danielSengstagContentEn.meta.title,
      description: danielSengstagContentEn.meta.description,
      openGraph: {
        title: `${danielSengstagContentEn.meta.title} | Abexis`,
        description: danielSengstagContentEn.meta.description,
        type: "profile",
        images: [{ url: danielSengstagImages.hero }],
      },
    };
  }
  const p = teamProfiles[profile];
  const english = teamProfilesEn[profile];
  return {
    title: `${p.name} | Abexis`,
    description: `${p.name}: ${english.title} at Abexis.`,
    openGraph: {
      title: `${p.name} | Abexis`,
      description: english.title,
      type: "profile",
      images: [{ url: p.image }],
    },
  };
}

export default async function EnglishTeamProfilePage({ params }: Props) {
  const { profile } = await params;
  if (!isTeamSlug(profile)) notFound();
  const p = teamProfiles[profile];
  const english = teamProfilesEn[profile];

  if (profile === "danielsengstag") {
    return (
      <InteriorPageRoot>
        <SchemaMarkup
          type="Person"
          path={`/en/${profile}`}
          data={{ ...p, title: danielSengstagContentEn.hero.credentials, body: danielSengstagContentEn.meta.description, slug: profile }}
          breadcrumbs={[
            { name: "Home", url: "/en/home" },
            { name: "About us", url: "/en/ueber-uns" },
            { name: p.name, url: `/en/${profile}` },
          ]}
        />
        <DanielSengstagProfilePage copy={danielSengstagContentEn} images={danielSengstagImages} locale="en" />
      </InteriorPageRoot>
    );
  }

  return (
    <InteriorPageLayout
      eyebrow="Team"
      title={p.name}
      description={<p>{english.title}</p>}
      maxWidth="1068"
      contentMaxWidth="3xl"
      wrapContentInMotion={false}
      contentClassName="pt-10 md:pt-12"
      heroImage={p.image}
      heroImageObjectClassName="object-[center_28%]"
    >
      <SchemaMarkup
        type="Person"
        path={`/en/${profile}`}
        data={{ ...p, title: english.title, body: english.body, slug: profile }}
        breadcrumbs={[
          { name: "Home", url: "/en/home" },
          { name: "About us", url: "/en/ueber-uns" },
          { name: p.name, url: `/en/${profile}` },
        ]}
      />
      <div className="flex flex-col gap-8 border-b border-black/[0.06] pb-10 md:flex-row md:items-start md:gap-10">
        <div className="relative mx-auto h-44 w-44 shrink-0 overflow-hidden rounded-[28px] bg-[#f5f5f7] shadow-[var(--apple-shadow)] ring-1 ring-black/[0.06] md:mx-0">
          <Image src={p.image} alt={p.name} fill className="object-cover" quality={95} sizes="200px" />
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
        </div>
      </div>
      <MotionSection className="mt-10 pt-2">
        <div className="whitespace-pre-line text-[16px] leading-relaxed text-[#424245]">{english.body}</div>
      </MotionSection>
    </InteriorPageLayout>
  );
}
