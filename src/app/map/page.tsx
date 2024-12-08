"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MenuButton } from "@/components/ui/menu_button";

// Sample places data
const samplePlaces = [
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
const Map = dynamic(() => import("@/components/ui/map"), {
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-gray-600">Loading map...</div>
    </div>
  ),
  ssr: false,
});

export default function MapPage() {
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render the map until we're on the client
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <main className="p-4 space-y-4">
        <div className="text-center">
          <h1 className="text-xl font-bold">町田GIONスタジアムへ！</h1>
          <h2 className="text-lg mt-2">いざ登城！</h2>
          <h3 className="text-lg mt-2">町田ゼルビア vs 川崎フロンターレ</h3>
          <h3 className="text-lg mt-2">キックオフ 14:00</h3>
        </div>

        <div className="h-[600px] w-full rounded-lg overflow-hidden border">
          <Map
            places={samplePlaces}
            center={[35.592735510792195, 139.43884126045768]}
            zoom={15}
            showSearch={true}
            showLegend={true}
            showControls={true}
          />
        </div>

        <div className="mt-4 text-sm text-gray-600">
          * Click on markers to view more information about each location
        </div>

        <div className="flex justify-center space-x-4 max-w-md mx-auto">
          <MenuButton href="/home" label="ホーム" isActive={true} />
          <MenuButton
            href="/map"
            label={
              <>
                <span>登城</span>
                <span>マップ</span>
              </>
            }
          />
          <MenuButton
            href="/places"
            label={
              <>
                <span>周辺</span>
                <span>情報</span>
              </>
            }
          />
          <MenuButton
            href="/traffic"
            label={
              <>
                <span>交通</span>
                <span>情報</span>
              </>
            }
          />
        </div>
      </main>
    </div>
  );
}
