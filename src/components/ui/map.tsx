"use client";

import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

interface Place {
  id: number;
  placename: string;
  description: string;
  position: [number, number];
  category: string;
  url: string;
}

if (
  (L.Icon.Default.prototype as unknown as { _getIconUrl?: () => void })
    ._getIconUrl
) {
  delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: () => void })
    ._getIconUrl;
}

function Map() {
  const [mounted, setMounted] = useState(false);
  const center: [number, number] = [35.592735510792195, 139.43884126045768];
  const places: Place[] = [
    {
      id: 1,
      placename: "町田GIONスタジアム",
      description: "FC町田ゼルビアのホームスタジアム",
      position: [35.592735510792195, 139.43884126045768],
      category: "stadium",
      url: "https://www.zelvia.co.jp/stadium/access/",
    },
    {
      id: 2,
      placename: "町田薬師池公園",
      description: "四季彩の杜",
      position: [35.578879824273436, 139.4481512601811],
      category: "park",
      url: "https://machida-shikisainomori.com",
    },
    {
      id: 3,
      placename: "小野路宿里山交流館",
      description:
        "江戸時代、小野路宿にあった旅籠はたご・旧「角屋かどや」を改修した施設",
      position: [35.60129950268735, 139.43801152786767],
      category: "sightseeing",
      url: "https://www.city.machida.tokyo.jp/kanko/miru_aso/satoyamakoryukan/kouryukan_gaiyou_kinou.html",
    },
  ];

  useEffect(() => {
    // Set default icon options
    L.Icon.Default.mergeOptions({
      iconUrl: markerIcon.src,
      iconRetinaUrl: markerIcon2x.src,
      shadowUrl: markerShadow.src,
    });

    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="h-screen w-full p-4">
      <div
        className="flex flex-col h-screen w-full"
        style={{ borderRadius: "var(--brad-2)" }}
      >
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {places.map((place) => (
            <Marker key={place.id} position={place.position}>
              <Popup>
                <a
                  href={place.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "blue", textDecoration: "underline" }}
                >
                  <strong>{place.placename}</strong>
                </a>
                <br />
                {place.description}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </main>
  );
}

export default Map;
