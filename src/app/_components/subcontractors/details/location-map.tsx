"use client";

import { type RouterOutputs } from "~/trpc/react";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression, LatLngTuple } from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

type Subcontractor = NonNullable<RouterOutputs["subcontractor"]["getById"]>;

interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom?: number;
}

const defaults = {
  zoom: 19,
};

const Map = (Map: MapProps, subcontractor: Subcontractor) => {
  const { zoom = defaults.zoom, posix } = Map;
  const position: [number, number] = [
    Number(subcontractor.latitude),
    Number(subcontractor.longitude),
  ];

  return (
    <MapContainer
      center={posix}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>Hey ! I study here</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
