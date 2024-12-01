// "use client";

// import { useEffect, useState } from "react";
// import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";

// interface Place {
//   place_id: number;
//   placename: string;
//   description: string;
//   category: string;
//   latitude: number; // DECIMAL in MySQL maps to number in TypeScript
//   longitude: number; // DECIMAL in MySQL maps to number in TypeScript
//   url: string;
// }

// // Move the icon deletion outside the component
// if ((L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl) {
//   delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })
//     ._getIconUrl;
// }

// // Separate MapComponent to handle the actual map rendering
// const MapComponent = ({ places }: { places: Place[] }) => {
//   const center: [number, number] = [35.592735510792195, 139.43884126045768];

//   return (
//     <MapContainer
//       center={center}
//       zoom={13}
//       scrollWheelZoom={false}
//       style={{ height: "100%", width: "100%" }}
//     >
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       {places.map((place) => (
//         <Marker
//           key={place.place_id}
//           position={[place.latitude, place.longitude]}
//         >
//           <Popup>
//             <a
//               href={place.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={{ color: "blue", textDecoration: "underline" }}
//             >
//               <strong>{place.placename}</strong>
//             </a>
//             <br />
//             {place.description}
//           </Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   );
// };

// // Main Map component
// function Map() {
//   const [mounted, setMounted] = useState(false);
//   const [places, setPlaces] = useState<Place[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     // Set default icon options
//     L.Icon.Default.mergeOptions({
//       iconUrl: markerIcon.src,
//       iconRetinaUrl: markerIcon2x.src,
//       shadowUrl: markerShadow.src,
//     });

//     const fetchPlaces = async () => {
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/places`
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch places");
//         }
//         const data = await response.json();
//         setPlaces(data);
//       } catch (err) {
//         console.error("Error fetching places:", err);
//         setError(err instanceof Error ? err.message : "Failed to fetch places");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPlaces();
//     setMounted(true);
//   }, []);

//   if (!mounted) return null;
//   if (loading) return <div>Loading map data...</div>;
//   if (error) return <div>Error loading map data: {error}</div>;

//   return (
//     <main className="h-screen w-full p-4">
//       <div
//         className="flex flex-col h-screen w-full"
//         style={{ borderRadius: "var(--brad-2)" }}
//       >
//         {mounted && <MapComponent places={places} />}
//       </div>
//     </main>
//   );
// }

// export default Map;

"use client";

import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface Place {
  place_id: number;
  placename: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  url: string;
}

// Define category colors
const categoryIcons = {
  sightseeing: L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  }),
  eatery: L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  }),
  cultural_attraction: L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  }),
  shop: L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  }),
};

// Helper function to get the appropriate icon based on category
const getMarkerIcon = (category: string) => {
  const normalizedCategory = category.toLowerCase();
  return (
    categoryIcons[normalizedCategory as keyof typeof categoryIcons] ||
    categoryIcons.sightseeing
  );
};

// Separate MapComponent to handle the actual map rendering
const MapComponent = ({ places }: { places: Place[] }) => {
  const center: [number, number] = [35.592735510792195, 139.43884126045768];

  return (
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
        <Marker
          key={place.place_id}
          position={[place.latitude, place.longitude]}
          icon={getMarkerIcon(place.category)}
        >
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
            <br />
            <em>Category: {place.category}</em>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

// Main Map component
function Map() {
  const [mounted, setMounted] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/places`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch places");
        }
        const data = await response.json();
        setPlaces(data);
      } catch (err) {
        console.error("Error fetching places:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch places");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (loading) return <div>Loading map data...</div>;
  if (error) return <div>Error loading map data: {error}</div>;

  return (
    <main className="h-screen w-full p-4">
      <div
        className="flex flex-col h-screen w-full"
        style={{ borderRadius: "var(--brad-2)" }}
      >
        <div className="mb-4 p-2 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">Map Legend:</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>🟢 レジャー</div>
            <div>🟠 レストラン</div>
            <div>🟣 史跡名所</div>
            <div>🔵 お店</div>
          </div>
        </div>
        {mounted && <MapComponent places={places} />}
      </div>
    </main>
  );
}

export default Map;
