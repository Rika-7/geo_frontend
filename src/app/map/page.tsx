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

interface MapProps {
  locationData: LocationData[];
  center: [number, number];
  zoom: number;
  places: unknown[];
  showLegend: boolean;
  showControls: boolean;
  showSearch: boolean;
  onError: () => void;
  currentLocation?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null;
}

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    // Set target date to December 19th 9:00
    const kickoffTime = new Date(2024, 11, 19, 7, 0, 0); // Note: month is 0-based, so 11 = December

    const interval = setInterval(() => {
      const now = new Date();
      const difference = kickoffTime.getTime() - now.getTime();

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft(
          `⚽ ${hours > 0 ? hours + "時間 " : ""}${minutes}分 ${seconds}秒`
        );
      } else {
        setTimeLeft("⚽ キックオフ！");
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        color: "white",
        padding: "4px 12px",
        borderRadius: "8px",
        fontSize: "20px",
        fontWeight: "bold",
        display: "inline-block",
        margin: "0 auto",
      }}
    >
      <h3>{timeLeft}</h3>
    </div>
  );
};

const Map = dynamic<MapProps>(
  () =>
    import("@/components/ui/map").then(
      (mod) => mod.default as React.ComponentType<MapProps>
    ),
  {
    loading: () => (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-gray-600">Loading map...</div>
      </div>
    ),
    ssr: false,
  }
);

const MapPage: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [mapKey, setMapKey] = useState<string>("initial");
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchLocationData();
  }, []);

  const fetchLocationData = async (): Promise<void> => {
    try {
      const response = await fetch(
        "https://tech0-gen-7-step4-student-finalproject-4-exeabgd9eyekb7c2.canadacentral-01.azurewebsites.net/locations"
      );
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

  const handleMapError = (): void => {
    setMapKey(Date.now().toString());
  };

  const handleLocationUpdate = (
    location: {
      latitude: number;
      longitude: number;
      accuracy: number;
    } | null
  ) => {
    setCurrentLocation(location);
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
      <main className="p-4 md:p-2 space-y-1">
        <div className="text-center space-y-0.5">
          <h1 className="text-xl font-bold">
            町田GIONスタジアムへ！ いざ登城！
          </h1>
          <h2 className="text-lg">町田ゼルビア vs 浦和レッズ</h2>
          <h2 className="text-lg">キックオフ 14:00</h2>
          <div className="flex justify-center mt-1">
            <CountdownTimer />
          </div>
        </div>

        <CurrentLocationDisplay onLocationUpdate={handleLocationUpdate} />

        <div className="h-[400px] w-full rounded-lg overflow-hidden border text-gray-800">
          <Map
            key={mapKey}
            locationData={locationData}
            center={[35.592735510792195, 139.43884126045768]}
            zoom={15}
            places={[]}
            showLegend={false}
            showControls={true}
            showSearch={false}
            onError={handleMapError}
            currentLocation={currentLocation}
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
          <MenuButton
            href="/coupon"
            label={
              <>
                <span>クー</span>
                <span>ポン</span>
              </>
            }
          />
        </div>
      </main>
    </div>
  );
};

export default MapPage;
