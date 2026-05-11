import { BlogAutomationDraftEditor } from "@/components/admin/blog-automation/BlogAutomationDraftEditor";

type Props = { params: Promise<{ id: string }> };

export default async function BlogAutomationDraftDetailPage({ params }: Props) {
  const { id } = await params;
  return <BlogAutomationDraftEditor key={id} draftId={id} />;
}
