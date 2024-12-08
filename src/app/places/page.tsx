"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState, ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { MenuButton } from "@/components/ui/menu_button";

// Dynamic import with TypeScript and key changes for map initialization
const MapComponent = dynamic(
  () => import("@/components/ui/map").then((mod) => mod.default),
  {
    loading: (): ReactElement => (
      <p className="text-center py-4">A map is loading...</p>
    ),
    ssr: false,
  }
);

enum PlaceCategory {
  Eatery = "eatery",
  Sightseeing = "sightseeing",
  CulturalAttraction = "cultural_attraction",
  Shop = "shop",
}

interface Place {
  place_id: number;
  placename: string;
  description: string;
  category: PlaceCategory;
  latitude: number;
  longitude: number;
  url: string;
}

interface CategoryButton {
  category: PlaceCategory;
  label: string;
}

const categoryButtons: CategoryButton[] = [
  { category: PlaceCategory.Eatery, label: "グルメ" },
  { category: PlaceCategory.Sightseeing, label: "レジャー" },
  { category: PlaceCategory.CulturalAttraction, label: "史跡名所" },
];

const Places = (): ReactElement => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<PlaceCategory | null>(null);
  const [isMapMounted, setIsMapMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMapMounted(true);
    return () => {
      setIsMapMounted(false);
    };
  }, []);

  useEffect(() => {
    const fetchPlaces = async (): Promise<void> => {
      try {
        if (!process.env.NEXT_PUBLIC_API_URL) {
          throw new Error(
            "API URL is not configured - please check environment variables"
          );
        }

        const apiUrl: string = `${process.env.NEXT_PUBLIC_API_URL}/places`;
        const response = await fetch(apiUrl, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to fetch places: ${response.status} ${response.statusText}${
              errorText ? ` - ${errorText}` : ""
            }`
          );
        }

        const data = (await response.json()) as Place[];
        setPlaces(data);
      } catch (err) {
        console.error("Error fetching places:", err);
        setError(
          err instanceof Error
            ? `Error: ${err.message}. API URL: ${
                process.env.NEXT_PUBLIC_API_URL || "not set"
              }`
            : "Failed to fetch places. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const filteredPlaces = selectedCategory
    ? places.filter((place) => place.category === selectedCategory)
    : places;

  const handleCategoryClick = (category: PlaceCategory): void => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const MapLegend = () => (
    <div className="bg-white p-2 rounded-md shadow-md text-sm">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center">
          <span className="inline-block w-4 h-4 mr-2 bg-green-500 rounded-full"></span>
          <span className="text-gray-800">レジャー</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-4 h-4 mr-2 bg-orange-500 rounded-full"></span>
          <span className="text-gray-800">グルメ</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-4 h-4 mr-2 bg-violet-500 rounded-full"></span>
          <span className="text-gray-800">史跡名所</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-4 h-4 mr-2 bg-blue-500 rounded-full"></span>
          <span className="text-gray-800">お店</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-center p-2">
        <h1 className="text-base text-white font-semibold">
          町田GIONスタジアム周辺情報
        </h1>
      </header>

      <div className="flex justify-center pb-2">
        <div className="w-1/2 max-w-md flex justify-between">
          {categoryButtons.map((btn) => (
            <Button
              key={btn.category}
              variant={selectedCategory === btn.category ? "default" : "ghost"}
              size="sm"
              className="text-xs px-3"
              onClick={() => handleCategoryClick(btn.category)}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center pt-0 pb-2 space-y-2">
        <div className="w-1/2 max-w-md h-64">
          {loading && <p className="text-center py-4">Loading map data...</p>}
          {error && (
            <p className="text-center py-4 text-red-500">
              Error loading map data: {error}
            </p>
          )}
          {!loading && !error && places.length > 0 && isMapMounted && (
            <MapComponent
              key={`map-${selectedCategory || "all"}`}
              places={filteredPlaces}
              showSearch={false}
              showLegend={false}
              showControls={true}
            />
          )}
        </div>
        <div className="w-1/2 max-w-md">
          <MapLegend />
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg pb-2 shadow w-1/2 max-w-md mx-auto h-64 flex flex-col">
        <div className="flex-grow flex flex-col justify-center space-y-4">
          <p className="text-sm text-gray-800 text-center mb-4">
            小野路宿里山交流館
            <br />
            江戸時代、小野路宿にあった旅籠
            <br />
            はたご・旧「角屋かどや」を改修した施設
          </p>
          <p className="text-sm text-gray-800 text-center mb-4">
            町田薬師池公園
            <br />
            四季彩の杜
          </p>
        </div>
      </div>

      <div className="flex justify-center space-x-2 max-w-md mx-auto mt-4">
        <MenuButton href="/home" label="ホーム" />
        <MenuButton
          href="/map"
          label={
            <>
              <span className="text-xs">登城</span>
              <span className="text-xs">マップ</span>
            </>
          }
        />
        <MenuButton
          href="/places"
          label={
            <>
              <span className="text-xs">周辺</span>
              <span className="text-xs">情報</span>
            </>
          }
          isActive={true}
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
    </div>
  );
};

export default Places;
