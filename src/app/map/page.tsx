"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MenuButton } from "@/components/ui/menu_button";
import CurrentLocationDisplay from "@/components/ui/current_location";
import VisitorLegend from "@/components/ui/visitor_legend";

interface Place {
  place_id: number;
  placename: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  url: string;
  onError?: () => void;
}

// Sample places data
const samplePlaces: Place[] = [
  {
    place_id: 1,
    placename: "Tama Plaza Station",
    description: "Major railway station in Yokohama",
    category: "cultural_attraction",
    latitude: 35.592735510792195,
    longitude: 139.43884126045768,
    url: "https://example.com/tama-plaza",
  },
  {
    place_id: 2,
    placename: "Tama Plaza Terrace",
    description: "Shopping mall with various stores and restaurants",
    category: "shop",
    latitude: 35.59338,
    longitude: 139.43851,
    url: "https://example.com/terrace",
  },
];

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

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMapError = () => {
    setMapKey(Date.now().toString());
  };

  if (!mounted) {
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
            places={samplePlaces}
            center={[35.592735510792195, 139.43884126045768]}
            zoom={15}
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
