"use client";

import { Suspense } from "react";

import { BlogAutomationClient } from "@/components/admin/blog-automation/BlogAutomationClient";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";

export const dynamic = "force-dynamic";

function Fallback() {
  return (
    <AdminPageContainer>
      <AdminLoading message="Blog-Automation wird geladen…" />
    </AdminPageContainer>
  );
}

export default function AdminBlogAutomationPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <BlogAutomationClient />
    </Suspense>
  );
}
