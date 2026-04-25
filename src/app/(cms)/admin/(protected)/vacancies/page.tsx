"use client";

import { Suspense } from "react";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { AdminVacanciesManager } from "@/components/admin/vacancies/AdminVacanciesManager";

function VacanciesFallback() {
  return (
    <AdminPageContainer>
      <AdminLoading message="Vakanzen werden geladen…" />
    </AdminPageContainer>
  );
}

export default function AdminVacanciesPage() {
  return (
    <Suspense fallback={<VacanciesFallback />}>
      <AdminVacanciesManager />
    </Suspense>
  );
}
