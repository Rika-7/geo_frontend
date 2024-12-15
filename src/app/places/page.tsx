"use client";

import dynamic from "next/dynamic";
import React, {
  useEffect,
  useState,
  ReactElement,
  useRef,
  useCallback,
} from "react";
import { Button } from "@/components/ui/button";
import { MenuButton } from "@/components/ui/menu_button";
import { ExternalLink } from "lucide-react";

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
  has_coupon: boolean;
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
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [key, setKey] = useState<number>(0);
  const listRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

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
    setSelectedPlaceId(null);
    setKey((prev) => prev + 1); // Force map remount when changing category
  };

  const scrollToPlace = useCallback((placeId: number): void => {
    const element = listRefs.current[placeId];
    const container = listContainerRef.current;

    if (element && container) {
      // Calculate the scroll position to center the element
      const containerHeight = container.clientHeight;
      const elementHeight = element.clientHeight;
      const scrollTop =
        element.offsetTop - containerHeight / 2 + elementHeight / 2;

      container.scrollTo({
        top: scrollTop,
        behavior: "smooth",
      });
    }
  }, []);

  const handleMarkerClick = useCallback(
    (placeId: number) => {
      setSelectedPlaceId(placeId);
      scrollToPlace(placeId); // Add scrolling when clicking marker
    },
    [scrollToPlace]
  );

  const handleListItemClick = useCallback(
    (placeId: number) => {
      setSelectedPlaceId(placeId);
      scrollToPlace(placeId);
    },
    [scrollToPlace]
  );

  const MapLegend = () => (
    <div className="bg-white p-2 rounded-md shadow-md text-sm">
      <div className="grid grid-cols-4 gap-2">
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

  const PlacesList = () => (
    <div
      ref={listContainerRef}
      className="overflow-y-auto h-full scroll-smooth"
    >
      {filteredPlaces.map((place) => (
        <div
          key={place.place_id}
          ref={(el) => {
            listRefs.current[place.place_id] = el;
          }}
          className={`p-3 border-b border-gray-200 last:border-none cursor-pointer transition-all duration-300 ${
            selectedPlaceId === place.place_id
              ? "bg-blue-50 shadow-md border-l-4 border-l-blue-500"
              : "hover:bg-gray-50 border-l-4 border-l-transparent"
          }`}
          onClick={() => handleListItemClick(place.place_id)}
        >
          <div className="flex justify-between items-start">
            <h3
              className={`text-sm font-medium ${
                selectedPlaceId === place.place_id
                  ? "text-blue-900"
                  : "text-gray-900"
              }`}
            >
              {place.placename}
            </h3>
            <div className="flex items-center gap-2">
              {place.has_coupon && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("当日観戦者限定！　500円割引！");
                  }}
                >
                  クーポンはこちら！
                </Button>
              )}
              {place.url && (
                <a
                  href={place.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
          <p
            className={`text-xs mt-1 ${
              selectedPlaceId === place.place_id
                ? "text-blue-800"
                : "text-gray-600"
            }`}
          >
            {place.description}
          </p>
        </div>
      ))}
      {filteredPlaces.length === 0 && (
        <p className="text-center text-gray-500 py-4">
          {loading ? "Loading places..." : "No places found"}
        </p>
      )}
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
        <div className="relative h-[400px] w-full">
          {loading && <p className="text-center py-4">Loading map data...</p>}
          {error && (
            <p className="text-center py-4 text-red-500">
              Error loading map data: {error}
            </p>
          )}
          {!loading && !error && places.length > 0 && (
            <>
              <div className="absolute inset-0 rounded-lg overflow-hidden border">
                <MapComponent
                  key={key}
                  places={filteredPlaces}
                  showSearch={false}
                  showLegend={false}
                  showControls={true}
                  onMarkerClick={handleMarkerClick}
                  selectedPlaceId={selectedPlaceId}
                />
              </div>
              <div className="absolute bottom-4 right-4 z-[1000]">
                <MapLegend />
              </div>
            </>
          )}
        </div>
      </div>
      <div className="bg-gray-100 rounded-lg pb-2 shadow relative h-64 flex flex-col">
        <PlacesList />
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
    </div>
  );
};

export default Places;
