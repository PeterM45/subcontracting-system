"use client";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { BackButton } from "@/components/ui/back-button";
import { SubcontractorInfo } from "~/app/_components/subcontractors/details/subcontractor-info";
import { RatesTable } from "~/app/_components/subcontractors/details/individual-rates-table";
import { type RouterOutputs } from "~/trpc/react";
import { api } from "~/trpc/react";

type Subcontractor = NonNullable<RouterOutputs["subcontractor"]["getById"]>;
type Rate = RouterOutputs["rate"]["getBySubcontractor"][0];

export function PageContent({
  subcontractor,
  initialRates,
}: {
  subcontractor: Subcontractor;
  initialRates: Rate[];
}) {
  // Use client-side query with initial data
  const { data: rates } = api.rate.getBySubcontractor.useQuery(
    { subcontractorId: subcontractor.id },
    { initialData: initialRates },
  );

  const Map = useMemo(
    () =>
      dynamic(
        () => import("~/app/_components/subcontractors/details/location-map"),
        {
          loading: () => <p>A map is loading</p>,
          ssr: false,
        },
      ),
    [],
  );

  const position: [number, number] = [
    Number(subcontractor.latitude),
    Number(subcontractor.longitude),
  ];

  return (
    <div className="space-y-6">
      <BackButton />
      <SubcontractorInfo subcontractor={subcontractor} />
      <div className="relative z-0 h-[400px] w-full">
        <Map posix={position} subcontractor={subcontractor} zoom={15} />
      </div>
      <RatesTable rates={rates} subcontractor={subcontractor} />
    </div>
  );
}
