"use client";

import { Suspense } from "react";
import { AdminBlogSocialList } from "@/components/admin/blog-pipeline/AdminBlogSocialList";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";

function Fallback() {
  return (
    <AdminPageContainer>
      <AdminLoading message="Social-Entwürfe werden geladen…" />
    </AdminPageContainer>
  );
}

export default function AdminBlogPipelineSocialPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <AdminBlogSocialList />
    </Suspense>
  );
}
