"use client";

import dynamic from "next/dynamic";

const EditVacancyClient = dynamic(() => import("./EditVacancyClient"), { ssr: false });

export default function EditVacancyPage() {
  return <EditVacancyClient />;
}
