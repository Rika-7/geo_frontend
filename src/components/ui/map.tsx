import { useState, FC, ChangeEvent, useEffect } from "react";
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
import { visitorsByGroup } from "@/components/ui/visitor_legend";

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
  has_coupon: boolean;
  coupon_url?: string;
}

interface LocationData {
  J_league_id: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
  favorite_club: string;
}

interface MapProps {
  places: Place[];
  locationData?: LocationData[];
  center?: [number, number];
  zoom?: number;
  showSearch?: boolean;
  showLegend?: boolean;
  showControls?: boolean;
  onMarkerClick?: (placeId: number) => void;
  onError?: () => void;
  selectedPlaceId?: number | null;
  currentLocation?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null;
}

const getMarkerIcon = (category: string): L.Icon => {
  // Map the PlaceCategory enum values to their Japanese display names
  let color;
  switch (category) {
    case "sightseeing":
      color = "#22c55e"; // bg-green-500 for レジャー
      break;
    case "eatery":
      color = "#f97316"; // bg-orange-500 for グルメ
      break;
    case "cultural_attraction":
      color = "#8b5cf6"; // bg-violet-500 for 史跡名所
      break;
    case "shop":
      color = "#3b82f6"; // bg-blue-500 for お店
      break;
    default:
      color = "#6b7280"; // bg-gray-500
  }

  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
      <path fill="${color}" d="M12.5 0C5.596 0 0 5.596 0 12.5c0 10.937 12.5 28.5 12.5 28.5s12.5-17.563 12.5-28.5C25 5.596 19.404 0 12.5 0zm0 17.5c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z"/>
    </svg>
  `;

  const blob = new Blob([svgIcon], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  return L.icon({
    iconUrl: url,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

const getSupporterIcon = (favorite_club: string): L.Icon => {
  // Remove "サポーター" from the group name to match with favorite_club
  const groupData = visitorsByGroup.find(
    (g) => g.group.replace("サポーター", "") === favorite_club
  );

  const color = groupData ? groupData.color : "#808080";

  // Create a custom icon with the exact color from visitorsByGroup
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
      <path fill="${color}" d="M12.5 0C5.596 0 0 5.596 0 12.5c0 10.937 12.5 28.5 12.5 28.5s12.5-17.563 12.5-28.5C25 5.596 19.404 0 12.5 0zm0 17.5c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z"/>
    </svg>
  `;

  // Create a blob URL from the SVG
  const blob = new Blob([svgIcon], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  return L.icon({
    iconUrl: url,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
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
    <div className="absolute bottom-4 right-4 z-[1000] bg-white p-0 rounded-md shadow-md text-sm">
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
        <div className="min-w-[200px]">
          <a
            href={place.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            <strong>{place.placename}</strong>
          </a>
          <p className="mt-2 text-sm">{place.description}</p>
          <div className="mt-3 flex items-center gap-2">
            {place.has_coupon && place.coupon_url && (
              <a
                href={place.coupon_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded"
              >
                クーポンを表示
              </a>
            )}
            {place.url && (
              <a
                href={place.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-xs"
              >
                詳細を見る
              </a>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

const Legend: FC = () => (
  <div className="absolute bottom-10 right-4 z-[1000] bg-white p-1 rounded-md shadow-md text-sm">
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

const currentLocationIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapComponent: FC<MapProps> = ({
  places,
  locationData = [],
  center = [35.592735510792195, 139.43884126045768],
  zoom = 13,
  showSearch = false,
  showLegend = true,
  showControls = true,
  onMarkerClick,
  selectedPlaceId,
  currentLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = (): void => {
    console.log("Searching for:", searchQuery);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const MapHandler = ({
    currentLocation,
  }: {
    currentLocation: MapProps["currentLocation"];
  }) => {
    const map = useMap();

    useEffect(() => {
      if (currentLocation) {
        map.setView(
          [currentLocation.latitude, currentLocation.longitude],
          map.getZoom()
        );
      }
    }, [currentLocation, map]);

    return null;
  };

  return (
    <div className="h-full w-full relative">
      {showSearch && (
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

        {/* Display places */}
        {places.map((place: Place) => (
          <MarkerWrapper
            key={place.place_id}
            place={place}
            icon={getMarkerIcon(place.category)}
            onMarkerClick={onMarkerClick}
            isSelected={selectedPlaceId === place.place_id}
          />
        ))}

        {/* Display supporter locations */}
        {locationData.map((location) => (
          <Marker
            key={location.J_league_id}
            position={[location.latitude, location.longitude]}
            icon={getSupporterIcon(location.favorite_club)}
          >
            <Tooltip
              direction="top"
              offset={[0, -20]}
              className="custom-tooltip"
            >
              {location.favorite_club}
            </Tooltip>
            <Popup>
              <div className="text-sm">
                <strong>{location.favorite_club}</strong>
                <p className="mt-1">
                  Accuracy: ±{Math.round(location.accuracy)}m
                </p>
                <p className="mt-1">
                  Time: {new Date(location.timestamp).toLocaleString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Display current location */}
        {currentLocation && (
          <Marker
            position={[currentLocation.latitude, currentLocation.longitude]}
            icon={currentLocationIcon}
          >
            <Tooltip
              direction="top"
              offset={[0, -20]}
              className="custom-tooltip"
            >
              Your Location
            </Tooltip>
            <Popup>
              <div className="text-sm">
                <strong>Your Current Location</strong>
                <p className="mt-1">
                  Accuracy: ±{Math.round(currentLocation.accuracy)}m
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {showControls && <MapControls />}
        {showLegend && <Legend />}
        <MapHandler currentLocation={currentLocation} />
      </MapContainer>
      <GlobalStyle />
    </div>
  );
};

export default MapComponent;
