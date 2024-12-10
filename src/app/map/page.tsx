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

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const kickoffTime = new Date();
    kickoffTime.setHours(24, 0, 0, 0); // 14:00に設定

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
        setTimeLeft("⚽");
        clearInterval(interval); // タイマー停止
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        color: "white",
        padding: "4px 12px",
        borderRadius: "8px",
        fontSize: "20px", // フォントサイズを大きく
        fontWeight: "bold", // 太字に設定
      }}
    >
      <h3>{timeLeft}</h3>
    </div>
  );
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
          <h1 className="text-xl font-bold">町田GIONスタジアムへ いざ登城！</h1>
          <h2 className="text-lg mt-2">町田ゼルビア vs 川崎フロンターレ</h2>
          <h3 className="text-lg mt-2">キックオフ 15:00</h3>
          <div style={{ textAlign: "center", margin: "10px 0" }}>
            <CountdownTimer />
          </div>
      {/* CountdownTimer を追加 */}
      <CountdownTimer />
      <main className="p-4 md:p-2 space-y-4">
        <div className="text-center">
          <h1 className="text-xl font-bold">町田GIONスタジアムへ！</h1>
          <h2 className="text-lg mt-2">いざ登城！</h2>
          <h3 className="text-lg mt-2">町田ゼルビア vs 川崎フロンターレ</h3>
          <h3 className="text-lg mt-2">キックオフ 14:00</h3>
           <div style={{ textAlign: "center", margin: "10px 0" }}>
            <CountdownTimer />
          </div>
        </div>

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
