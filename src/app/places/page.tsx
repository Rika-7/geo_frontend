"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState, ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { MenuButton } from '@/components/ui/menu_button';

// Dynamic import with TypeScript
const MapComponent = dynamic(
  () => import("@/components/ui/map"),
  {
    loading: (): ReactElement => <p className="text-center py-4">A map is loading...</p>,
    ssr: false,
  }
);

enum PlaceCategory {
  Eatery = 'eatery',
  Sightseeing = 'sightseeing',
  CulturalAttraction = 'cultural_attraction',
  Shop = 'shop'
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
  { category: PlaceCategory.Eatery, label: 'グルメ' },
  { category: PlaceCategory.Sightseeing, label: 'レジャー' },
  { category: PlaceCategory.CulturalAttraction, label: '史跡名所' }
];

const Places = (): ReactElement => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | null>(null);

  useEffect(() => {
    const fetchPlaces = async (): Promise<void> => {
      try {
        if (!process.env.NEXT_PUBLIC_API_URL) {
          throw new Error("API URL is not configured - please check environment variables");
        }

        const apiUrl: string = `${process.env.NEXT_PUBLIC_API_URL}/places`;
        console.log("Fetching from:", apiUrl);

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

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-center p-2 border-b">
        <h1 className="text-base text-white font-semibold">
          町田GIONスタジアム周辺情報
        </h1>
      </header>

      <div className="flex justify-center p-2 border-t">
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

      <div className="flex justify-center items-center py-2">
        <div className="w-1/2 max-w-md h-64">
          {loading && <p className="text-center py-4">Loading map data...</p>}
          {error && (
            <p className="text-center py-4 text-red-500">
              Error loading map data: {error}
            </p>
          )}
          {!loading && !error && places.length > 0 && (
            <MapComponent
              places={filteredPlaces}
              showSearch={false}
              showLegend={false}
              showControls={true}
            />
          )}
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg p-6 shadow w-1/2 max-w-md mx-auto h-64 flex flex-col">
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

      <div className="flex justify-center space-x-2 max-w-md mx-auto mt-4 pb-2">
        <MenuButton href="/home" label="ホーム" isActive={true} />
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