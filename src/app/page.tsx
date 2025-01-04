"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin, ArrowDown, Search } from "lucide-react";
import ReactDOMServer from "react-dom/server";
import { api } from "~/trpc/react";
import { Geocoder } from "@mapbox/search-js-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "~/components/ui/button";

interface GeocoderInstance {
  value: string;
  search: () => void;
}

const customIcon = L.divIcon({
  html: ReactDOMServer.renderToString(
    <MapPin className="fill-black stroke-white" strokeWidth={1.5} />,
  ),
  className: "",
  iconSize: [32, 32],
  iconAnchor: [32, 32],
});

const searchIcon = L.divIcon({
  html: ReactDOMServer.renderToString(
    <ArrowDown
      className="animate-bounce fill-red-500 stroke-white"
      size={32}
      strokeWidth={2}
    />,
  ),
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

function MapUpdater({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function HomePage() {
  const { data: subcontractors } = api.subcontractor.getAll.useQuery();
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    43.6532, -79.3832,
  ]);
  const [zoom, setZoom] = useState(9);
  const [tempMarker, setTempMarker] = useState<[number, number] | null>(null);
  const geocoderRef = useRef<GeocoderInstance>(null);

  const handleSearch = () => {
    if (geocoderRef.current?.value) {
      geocoderRef.current.search();
    }
  };

  const handleRetrieve = (res: {
    properties: { coordinates: { latitude: number; longitude: number } };
  }) => {
    const newCenter: [number, number] = [
      res.properties.coordinates.latitude,
      res.properties.coordinates.longitude,
    ];
    setMapCenter(newCenter);
    setZoom(14);
    setTempMarker(newCenter);
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Home</h1>
      <div className="mb-4 flex gap-2">
        <div className="flex-1">
          <Geocoder
            ref={geocoderRef}
            accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? ""}
            onRetrieve={handleRetrieve}
          />
        </div>
        <Button variant="secondary" size="icon" onClick={handleSearch}>
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
      <div className="h-[600px] w-full rounded-lg border">
        <MapContainer
          center={mapCenter}
          zoom={zoom}
          className="h-full w-full rounded-lg"
          zoomControl={false}
        >
          <ZoomControl position="bottomleft" />
          <MapUpdater center={mapCenter} zoom={zoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          {tempMarker && <Marker position={tempMarker} icon={searchIcon} />}
          {subcontractors?.map((sub) => (
            <Marker
              key={sub.id}
              position={[Number(sub.latitude) ?? 0, Number(sub.longitude) ?? 0]}
              icon={customIcon}
            >
              <Popup>
                <div>
                  <h3 className="font-bold">{sub.name}</h3>
                  {sub.contact && <p>Contact: {sub.contact}</p>}
                  {sub.phone && <p>Phone: {sub.phone}</p>}
                  <p>{sub.location}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </main>
  );
}
