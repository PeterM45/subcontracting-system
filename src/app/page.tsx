"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { api } from "~/trpc/react";
import Link from "next/link";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";

const TORONTO: [number, number] = [43.6532, -79.3832];

export default function Page() {
  const [center] = useState<[number, number]>(TORONTO);
  const { data: subcontractors } = api.subcontractor.getAll.useQuery();

  const Map = useMemo(
    () =>
      dynamic(() => import("~/app/_components/home/map"), {
        loading: () => <Skeleton className="h-full w-full" />,
        ssr: false,
      }),
    [],
  );

  return (
    <main className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Home</h1>

      <div className="relative">
        <div className="relative z-0 h-[700px] w-full">
          <Map posix={center} subcontractors={subcontractors} zoom={9} />
        </div>
        <Link href="/service-requests/new">
          <Button className="absolute bottom-4 right-4 rounded-md bg-primary px-4 py-2 text-white shadow-md">
            New Service Request
          </Button>
        </Link>
      </div>
    </main>
  );
}
