"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MenuButton } from "@/components/ui/menu_button";
import CurrentLocationDisplay from "@/components/ui/current_location";
import VisitorLegend from "@/components/ui/visitor_legend";

interface LocationData {
  J_league_id: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
  favorite_club: string;
}

// Dynamically import the Map component with SSR disabled
const Map = dynamic(
  () => import("@/components/ui/map").then((mod) => mod.default),
  {
    loading: () => (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-gray-600">Loading map...</div>
      </div>
    ),
    ssr: false,
  }
);

export default function MapPage() {
  const [mounted, setMounted] = useState(false);
  const [mapKey, setMapKey] = useState("initial");
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchLocationData();
  }, []);

  const fetchLocationData = async () => {
    try {
      // Replace with your FastAPI backend URL
      const response = await fetch("http://localhost:8000/locations");
      if (!response.ok) {
        throw new Error("Failed to fetch location data");
      }
      const data = await response.json();
      setLocationData(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  const handleMapError = () => {
    setMapKey(Date.now().toString());
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-black text-white font-sans">
        <main className="p-4 md:p-6 space-y-4">
          <div className="text-center">
            <h1 className="text-xl font-bold">Loading...</h1>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white font-sans">
        <main className="p-4 md:p-6 space-y-4">
          <div className="text-center">
            <h1 className="text-xl font-bold text-red-500">Error: {error}</h1>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <main className="p-4 md:p-2 space-y-4">
        <div className="text-center">
          <h1 className="text-xl font-bold">町田GIONスタジアムへ！</h1>
          <h2 className="text-lg mt-2">いざ登城！</h2>
          <h3 className="text-lg mt-2">町田ゼルビア vs 川崎フロンターレ</h3>
          <h3 className="text-lg mt-2">キックオフ 14:00</h3>
        </div>

        <CurrentLocationDisplay />

        <div className="h-[400px] w-full rounded-lg overflow-hidden border text-gray-800">
          <Map
            key={mapKey}
            locationData={locationData}
            center={[35.592735510792195, 139.43884126045768]}
            zoom={15}
            places={[]} // Add the missing places property
            showLegend={false}
            showControls={true}
            showSearch={false}
            onError={handleMapError}
          />
        </div>

        <div className="relative">
          <VisitorLegend />
        </div>

        <div className="flex justify-center space-x-2 sm:space-x-4 max-w-md mx-auto">
          <MenuButton href="/home" label="ホーム" />
          <MenuButton
            href="/map"
            label={
              <>
                <span className="text-xs">登城</span>
                <span className="text-xs">マップ</span>
              </>
            }
            isActive={true}
          />
          <MenuButton
            href="/places"
            label={
              <>
                <span className="text-xs">周辺</span>
                <span className="text-xs">情報</span>
              </>
            }
          />
          <MenuButton
            href="/traffic"
            label={
              <>
                <span className="text-xs">交通</span>
                <span className="text-xs">情報</span>
              </>
            }
          />
        </div>
      </main>
    </div>
  );
}
