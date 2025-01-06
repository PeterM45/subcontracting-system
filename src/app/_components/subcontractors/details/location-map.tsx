"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { type RouterOutputs } from "~/trpc/react";
import { Card } from "@/components/ui/card";

type Subcontractor = NonNullable<RouterOutputs["subcontractor"]["getById"]>;

export function LocationMap({
  subcontractor,
}: {
  subcontractor: Subcontractor;
}) {
  const position: [number, number] = [
    Number(subcontractor.latitude),
    Number(subcontractor.longitude),
  ];

  return (
    <Card className="overflow-hidden">
      <MapContainer
        center={position}
        zoom={13}
        className="h-64 w-full"
        scrollWheelZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position} />
      </MapContainer>
    </Card>
  );
}
