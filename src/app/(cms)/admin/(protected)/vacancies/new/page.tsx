"use client";

import dynamic from "next/dynamic";

const NewVacancyClient = dynamic(() => import("./NewVacancyClient"), { ssr: false });

export default function NewVacancyPage() {
  return <NewVacancyClient />;
}
