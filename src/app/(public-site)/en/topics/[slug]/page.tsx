import { notFound, redirect } from "next/navigation";
import { getEnglishTopic } from "@/data/english-site";

type Props = { params: Promise<{ slug: string }> };

export default async function EnglishTopicRedirectPage({ params }: Props) {
  const { slug } = await params;
  const topic = getEnglishTopic(slug);
  if (!topic) notFound();
  redirect(`/en/fokusthemen/${topic.deSlug}`);
}
