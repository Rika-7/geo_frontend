"use client";

import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

function Map() {
  const [mounted, setMounted] = useState(false);
  const center: [number, number] = [35.592735510792195, 139.43884126045768];

  useEffect(() => {
    // Leafletのアイコン表示
    L.Icon.Default.mergeOptions({
      iconUrl: markerIcon.src,
      iconRetinaUrl: markerIcon2x.src,
      shadowUrl: markerShadow.src,
    });

    setMounted(true);

    // Cleanup function
    return () => {
      // Find the map instance
      const mapInstance = document.querySelector("#map");
      if (mapInstance) {
        // Get the Leaflet map instance
        const map = L.DomUtil.get(
          mapInstance as HTMLElement
        ) as unknown as L.Map;
        if (map && map instanceof L.Map) {
          // Remove all event listeners and remove the map
          map.off();
          map.remove();
        }
      }
    };
  }, []);

  if (!mounted) return null;

  return (
    <div id="map" className="h-screen w-full">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        key={`${center[0]}-${center[1]}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default Map;
