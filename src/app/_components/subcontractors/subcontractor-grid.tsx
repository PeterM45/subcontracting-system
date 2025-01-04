"use client";

import { api } from "~/trpc/react";
import { SubcontractorCard } from "./card";

export function SubcontractorGrid() {
  const { data: subcontractors } = api.subcontractor.getAll.useQuery();

  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {subcontractors?.map((sub) => (
        <SubcontractorCard key={sub.id} subcontractor={sub} />
      ))}
    </div>
  );
}
