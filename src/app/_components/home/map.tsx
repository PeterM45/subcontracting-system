"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { LatLngExpression, LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { useState } from "react";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { GeocoderProps } from "@mapbox/search-js-react/dist/components/Geocoder";
import type { Subcontractor } from "~/lib/types";
import Link from "next/link";

const Geocoder = dynamic(
  () =>
    import("@mapbox/search-js-react").then((mod) => mod.Geocoder) as Promise<
      ComponentType<GeocoderProps>
    >,
  { ssr: false },
);

interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom?: number;
  subcontractors?: Subcontractor[];
}

function MapContent({
  onLocationChange,
}: {
  onLocationChange: (lat: number, lng: number) => void;
}) {
  const map = useMap();

  const handleRetrieve: NonNullable<GeocoderProps["onRetrieve"]> = (res) => {
    if (!res.geometry || res.geometry.type !== "Point") {
      return;
    }
    const coordinates = res.geometry.coordinates;
    const [lng, lat] = coordinates;
    map.setView([Number(lat), Number(lng)], 12);
    onLocationChange(Number(lat), Number(lng));
  };

  return (
    <div className="absolute right-2 top-2 z-[1000] w-64">
      <Geocoder
        accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}
        options={{
          language: "en",
          country: "CA",
        }}
        onRetrieve={handleRetrieve}
      />
    </div>
  );
}

const defaults = {
  zoom: 5,
};

const Map = (Map: MapProps) => {
  const { zoom = defaults.zoom, posix, subcontractors = [] } = Map;
  const [center, setCenter] = useState(posix);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <MapContent onLocationChange={(lat, lng) => setCenter([lat, lng])} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {subcontractors.map((sub) => (
        <Marker
          key={sub.id}
          position={[Number(sub.latitude), Number(sub.longitude)]}
          draggable={false}
        >
          <Popup>
            <div>
              <Link href={`/subcontractors/${sub.id}`}>
                <h3 className="font-bold">{sub.name}</h3>
                {sub.contact && <p>Contact: {sub.contact}</p>}
                {sub.phone && <p>Phone: {sub.phone}</p>}
                {sub.location && <p>{sub.location}</p>}
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
