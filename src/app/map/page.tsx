"use client";

import dynamic from "next/dynamic";
import React from "react";

// Dynamically import the Map component with SSR disabled
const Map = dynamic(() => import("@/components/ui/map"), {
  loading: () => <p>A map is loading...</p>,
  ssr: false,
});

function MapPage() {
  return (
    <div>
      <h1>Map Page</h1>
      {/* Rendering the Map component directly since SSR is disabled */}
      <Map />
    </div>
  );
}

export default MapPage;
