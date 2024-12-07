"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Sample places data
const samplePlaces = [
  {
    place_id: 1,
    placename: "Tama Plaza Station",
    description: "Major railway station in Yokohama",
    category: "cultural_attraction",
    latitude: 35.592735510792195,
    longitude: 139.43884126045768,
    url: "https://example.com/tama-plaza"
  },
  {
    place_id: 2,
    placename: "Tama Plaza Terrace",
    description: "Shopping mall with various stores and restaurants",
    category: "shop",
    latitude: 35.59338,
    longitude: 139.43851,
    url: "https://example.com/terrace"
  }
];

// Dynamically import the Map component with SSR disabled
const Map = dynamic(() => import("@/components/ui/map"), {
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-gray-600">Loading map...</div>
    </div>
  ),
  ssr: false
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
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">いざ登城！</h1>
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
    </div>
  );
}
