import { useState, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const CurrentLocationDisplay = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);
  const [error, setError] = useState<string>("");
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsTracking(true);
    setError("");

    const id = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setError("");
      },
      (error) => {
        setError(getLocationErrorMessage(error));
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    setWatchId(id);
  };

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
  };

  const getLocationErrorMessage = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return "Location permission denied. Please enable location services.";
      case error.POSITION_UNAVAILABLE:
        return "Location information is unavailable.";
      case error.TIMEOUT:
        return "Location request timed out.";
      default:
        return "An unknown error occurred.";
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <Button
          onClick={isTracking ? stopTracking : startTracking}
          variant={isTracking ? "destructive" : "default"}
          className="w-full rounded-lg"
        >
          {isTracking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Stop Tracking
            </>
          ) : (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              Start Location Tracking
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          {error}
        </div>
      )}

      {location && (
        <div className="space-y-2 p-4 bg-gray-400 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span className="font-medium">Current Location:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Latitude:</span>
              <span className="ml-2">{location.latitude.toFixed(6)}°</span>
            </div>
            <div>
              <span className="font-medium">Longitude:</span>
              <span className="ml-2">{location.longitude.toFixed(6)}°</span>
            </div>
            <div className="col-span-2">
              <span className="font-medium">Accuracy:</span>
              <span className="ml-2">
                ±{Math.round(location.accuracy)} meters
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentLocationDisplay;
