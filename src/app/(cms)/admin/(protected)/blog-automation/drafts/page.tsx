"use client";

import { Suspense } from "react";

import { BlogAutomationDraftsList } from "@/components/admin/blog-automation/BlogAutomationDraftsList";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";

function Fallback() {
  return (
    <AdminPageContainer>
      <AdminLoading message="Entwürfe werden geladen…" />
    </AdminPageContainer>
  );
}

export default function BlogAutomationDraftsPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <BlogAutomationDraftsList />
    </Suspense>
  );
}
