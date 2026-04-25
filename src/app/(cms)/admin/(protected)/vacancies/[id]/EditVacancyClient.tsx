"use client";

import { useParams } from "next/navigation";
import { VacancyForm } from "@/components/admin/vacancies/VacancyForm";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";

export default function EditVacancyClient() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  if (!id) {
    return (
      <AdminPageContainer>
        <p className="text-sm text-red-700">Ungültige Vakanz-ID.</p>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <VacancyForm mode="edit" vacancyId={id} />
    </AdminPageContainer>
  );
}
