"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { type LatLngExpression, type LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { useState } from "react";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { GeocoderProps } from "@mapbox/search-js-react/dist/components/Geocoder";
import type { Subcontractor } from "~/types/index";
import Link from "next/link";

const Geocoder = dynamic(
  () =>
    import("@mapbox/search-js-react").then((mod) => mod.Geocoder) as Promise<
      ComponentType<GeocoderProps>
    >,
  { ssr: false },
);

// Define the custom icon for the searched location (e.g., green marker)
const searchedLocationIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Define the custom icon for subcontractors (standard blue marker)
const subcontractorIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom?: number;
  subcontractors?: Subcontractor[];
}

interface MapContentProps {
  onLocationChange: (lat: number, lng: number) => void;
  setTemporaryMarkerPosition: (position: LatLngTuple | null) => void;
}

function MapContent({
  onLocationChange,
  setTemporaryMarkerPosition,
}: MapContentProps) {
  const map = useMap();

  const handleRetrieve: NonNullable<GeocoderProps["onRetrieve"]> = (res) => {
    if (!res.geometry || res.geometry.type !== "Point") {
      setTemporaryMarkerPosition(null); // Clear marker if search is invalid
      return;
    }
    const coordinates = res.geometry.coordinates;
    const [lng, lat] = coordinates;
    const newPosition: LatLngTuple = [Number(lat), Number(lng)];

    map.setView(newPosition, 12); // Zoom and center map
    onLocationChange(Number(lat), Number(lng)); // Update overall map center if needed
    setTemporaryMarkerPosition(newPosition); // Set temporary marker
  };

  const handleClear = () => {
    setTemporaryMarkerPosition(null); // Clear marker when geocoder input is cleared
  };

  return (
    <div className="absolute right-2 top-2 z-[1000] w-96">
      <Geocoder
        accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}
        options={{
          language: "en",
          country: "CA",
        }}
        onRetrieve={handleRetrieve}
        onClear={handleClear}
      />
    </div>
  );
}

const defaults = {
  zoom: 5,
};

const Map = (props: MapProps) => {
  const { zoom = defaults.zoom, posix, subcontractors = [] } = props;
  const [center, setCenter] = useState(posix);
  const [temporaryMarkerPosition, setTemporaryMarkerPosition] =
    useState<LatLngTuple | null>(null);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true} // Changed from false to true
      style={{ height: "100%", width: "100%" }}
    >
      <MapContent
        onLocationChange={(lat, lng) => setCenter([lat, lng])}
        setTemporaryMarkerPosition={setTemporaryMarkerPosition}
      />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {temporaryMarkerPosition && (
        <Marker position={temporaryMarkerPosition} icon={searchedLocationIcon}>
          <Popup>Searched Location</Popup>
        </Marker>
      )}
      {subcontractors.map((sub) => (
        <Marker
          key={sub.id}
          position={[Number(sub.latitude), Number(sub.longitude)]}
          icon={subcontractorIcon} // Use the explicit blue icon for subcontractors
          draggable={false}
        >
          <Popup>
            <div>
              <Link href={`/subcontractors/${sub.id}`} scroll={false}>
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
