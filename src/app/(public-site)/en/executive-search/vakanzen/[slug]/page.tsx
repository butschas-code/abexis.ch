import { redirect } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export default async function EnglishVacancyDetailRedirectPage({ params }: Props) {
  const { slug } = await params;
  redirect(`/executive-search/vakanzen/${encodeURIComponent(slug)}`);
}
