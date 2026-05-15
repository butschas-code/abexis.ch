import { notFound } from "next/navigation";
import { MotionSection } from "@/components/motion/MotionSection";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";
import { englishTopics, getEnglishTopic } from "@/data/english-site";
import { fokusPageHeroImages } from "@/data/site-images";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return englishTopics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const topic = getEnglishTopic(slug);
  return {
    title: topic ? `${topic.title} | Abexis` : "Topic | Abexis",
    description: topic?.excerpt,
  };
}

export default async function EnglishTopicPage({ params }: Props) {
  const { slug } = await params;
  const topic = getEnglishTopic(slug);
  if (!topic) notFound();

  return (
    <InteriorPageLayout
      eyebrow={topic.subtitle}
      title={topic.title}
      heroImage={fokusPageHeroImages[topic.deSlug]}
      description={<p>{topic.excerpt}</p>}
    >
      <MotionSection className="grid gap-6 md:grid-cols-2">
        {topic.sections.map((section) => (
          <article key={section.title} className="rounded-[24px] bg-white p-7 shadow-[var(--apple-shadow)] ring-1 ring-black/[0.04]">
            <h2 className="text-[23px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">{section.title}</h2>
            {"body" in section ? <p className="mt-4 text-[16px] leading-relaxed text-[#6e6e73]">{section.body}</p> : null}
            {"bullets" in section ? (
              <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-[#6e6e73]">
                {section.bullets.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </MotionSection>
    </InteriorPageLayout>
  );
}
