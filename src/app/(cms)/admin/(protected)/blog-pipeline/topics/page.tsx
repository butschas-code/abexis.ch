"use client";

import { Suspense } from "react";
import { AdminBlogTopicsList } from "@/components/admin/blog-pipeline/AdminBlogTopicsList";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";

function Fallback() {
  return (
    <AdminPageContainer>
      <AdminLoading message="Themen werden geladen…" />
    </AdminPageContainer>
  );
}

export default function AdminBlogPipelineTopicsPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <AdminBlogTopicsList />
    </Suspense>
  );
}
