"use client";
import { useEffect, useRef } from "react";
import { type RouterOutputs } from "~/trpc/react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression, LatLngTuple } from "leaflet";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

type Subcontractor = NonNullable<RouterOutputs["subcontractor"]["getById"]>;

interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom?: number;
  subcontractor: Subcontractor;
}

const defaults = {
  zoom: 15,
};

const Map = ({ zoom = defaults.zoom, posix, subcontractor }: MapProps) => {
  const mapRef = useRef<LeafletMap>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(posix, zoom);
    }
  }, [posix, zoom]);

  return (
    <MapContainer
      ref={mapRef}
      center={posix}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={[
          Number(subcontractor.latitude),
          Number(subcontractor.longitude),
        ]}
        draggable={false}
      >
        <Popup>
          <div>
            <h3 className="font-bold">{subcontractor.name}</h3>
            {subcontractor.contact && <p>Contact: {subcontractor.contact}</p>}
            {subcontractor.phone && <p>Phone: {subcontractor.phone}</p>}
            {subcontractor.location && <p>{subcontractor.location}</p>}
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
