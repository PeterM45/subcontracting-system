"use client";

import dynamic from "next/dynamic";
import { BackButton } from "@/components/ui/back-button";
import { SubcontractorInfo } from "~/app/_components/subcontractors/details/subcontractor-info";
import { RatesTable } from "~/app/_components/subcontractors/details/individual-rates-table";
import { type RouterOutputs } from "~/trpc/react";

const LocationMap = dynamic(
  () =>
    import("~/app/_components/subcontractors/details/location-map").then(
      (mod) => mod.LocationMap,
    ),
  { ssr: false },
);

type Subcontractor = NonNullable<RouterOutputs["subcontractor"]["getById"]>;
type Rate = RouterOutputs["rate"]["getBySubcontractor"][0];

export function PageContent({
  subcontractor,
  rates,
}: {
  subcontractor: Subcontractor;
  rates: Rate[];
}) {
  return (
    <div className="space-y-6">
      <BackButton />
      <SubcontractorInfo subcontractor={subcontractor} />
      <LocationMap subcontractor={subcontractor} />
      <RatesTable rates={rates} />
    </div>
  );
}
