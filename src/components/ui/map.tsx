import { useState, FC, ChangeEvent } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, ZoomIn, ZoomOut } from "lucide-react";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  .custom-tooltip {
    background-color: white;
    border: 1px solid #ccc;
    padding: 2px 5px;
    font-size: 12px;
    white-space: nowrap;
  }
`;

interface Place {
  place_id: number;
  placename: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  url: string;
}

interface MapProps {
  places: Place[];
  center?: [number, number];
  zoom?: number;
  showSearch?: boolean;
  showLegend?: boolean;
  showControls?: boolean;
  onMarkerClick?: (placeId: number) => void;
  onError?: () => void;
  selectedPlaceId?: number | null;
}

type CategoryIcons = {
  [key in "sightseeing" | "eatery" | "cultural_attraction" | "shop"]: L.Icon;
};

const categoryIcons: CategoryIcons = {
  sightseeing: L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  }),
  eatery: L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  }),
  cultural_attraction: L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  }),
  shop: L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  }),
};

const getMarkerIcon = (category: string): L.Icon => {
  const normalizedCategory = category.toLowerCase() as keyof CategoryIcons;
  return categoryIcons[normalizedCategory] || categoryIcons.sightseeing;
};

const MapControls: FC = () => {
  const map = useMap();

  const handleZoomIn = (): void => {
    map.zoomIn();
  };

  const handleZoomOut = (): void => {
    map.zoomOut();
  };

  const handleCurrentLocation = (): void => {
    map.locate().on("locationfound", (e: L.LocationEvent) => {
      map.flyTo(e.latlng, map.getZoom());
    });
  };

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-[1000]">
      <Button
        variant="secondary"
        size="sm"
        onClick={handleCurrentLocation}
        className="bg-white text-black hover:bg-gray-200"
      >
        <MapPin className="h-4 w-4 mr-2" />
        Current Location
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={handleZoomIn}
        className="bg-white text-black hover:bg-gray-200"
      >
        <ZoomIn className="h-4 w-4" />
        <span className="ml-1">+</span>
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={handleZoomOut}
        className="bg-white text-black hover:bg-gray-200"
      >
        <ZoomOut className="h-4 w-4" />
        <span className="ml-1">-</span>
      </Button>
    </div>
  );
};

interface MarkerWrapperProps {
  place: Place;
  icon: L.Icon;
  onMarkerClick?: (placeId: number) => void;
  isSelected?: boolean;
}

const MarkerWrapper: FC<MarkerWrapperProps> = ({
  place,
  icon,
  onMarkerClick,
  isSelected,
}) => {
  const map = useMap();

  const handleClick = () => {
    if (onMarkerClick) {
      onMarkerClick(place.place_id);
      // Center the map on the clicked marker with a slight offset for better visibility
      map.setView(
        [place.latitude + 0.0005, place.longitude],
        map.getZoom() || 13,
        {
          animate: true,
          duration: 0.5,
        }
      );
    }
  };

  return (
    <Marker
      position={[place.latitude, place.longitude]}
      icon={icon}
      eventHandlers={{
        click: handleClick,
      }}
    >
      <Tooltip
        direction="top"
        offset={[0, -20]}
        className={`custom-tooltip ${isSelected ? "font-bold" : ""}`}
      >
        {place.placename}
      </Tooltip>
      <Popup>
        <a
          href={place.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          <strong>{place.placename}</strong>
        </a>
        <p className="mt-2">{place.description}</p>
        <p className="mt-1 italic">Category: {place.category}</p>
      </Popup>
    </Marker>
  );
};

const Legend: FC = () => (
  <div className="absolute bottom-20 right-4 z-[1000] bg-white p-2 rounded-md shadow-md text-sm">
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

const MapComponent: FC<MapProps> = ({
  places,
  center = [35.592735510792195, 139.43884126045768],
  zoom = 13,
  showSearch = false,
  showLegend = true,
  showControls = true,
  onMarkerClick,
  selectedPlaceId,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const isSearchNeeded = (): boolean => {
    return showSearch && places.length > 0;
  };

  const handleSearch = (): void => {
    console.log("Searching for:", searchQuery);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="h-full w-full relative">
      {isSearchNeeded() && (
        <div className="absolute top-4 left-4 right-4 z-[1000] flex space-x-2">
          <Input
            placeholder="Search location..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-grow"
          />
          <Button variant="outline" size="icon" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      )}
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ height: "100%", width: "100%", borderRadius: "var(--radius)" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {places.map((place: Place) => (
          <MarkerWrapper
            key={place.place_id}
            place={place}
            icon={getMarkerIcon(place.category)}
            onMarkerClick={onMarkerClick}
            isSelected={selectedPlaceId === place.place_id}
          />
        ))}
        {showControls && <MapControls />}
        {showLegend && <Legend />}
      </MapContainer>
      <GlobalStyle />
    </div>
  );
};

export default MapComponent;
