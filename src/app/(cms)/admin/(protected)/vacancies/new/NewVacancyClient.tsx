"use client";

import { useMemo } from "react";
import { VacancyForm } from "@/components/admin/vacancies/VacancyForm";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { newVacancyId } from "@/cms/services/vacancy-write-client";

export default function NewVacancyClient() {
  const prepared = useMemo(() => {
    try {
      return { ok: true as const, id: newVacancyId() };
    } catch {
      return { ok: false as const, message: "Firebase/Firestore ist nicht konfiguriert." };
    }
  }, []);

  if (!prepared.ok) {
    return (
      <AdminPageContainer>
        <p className="text-sm text-red-700">{prepared.message}</p>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <VacancyForm mode="new" vacancyId={prepared.id} />
    </AdminPageContainer>
  );
}
