import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google: any;
  }
}

interface MapProps {
  center: { lat: number; lng: number };
  zoom: number;
  markers?: Array<{
    id: string;
    position: { lat: number; lng: number };
    title: string;
    info?: string;
  }>;
}

const MapComponent = ({ center, zoom, markers }: MapProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>();

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
      });
      setMap(newMap);
    }
  }, [ref, map, center, zoom]);

  useEffect(() => {
    if (map && markers) {
      markers.forEach((marker) => {
        const mapMarker = new window.google.maps.Marker({
          position: marker.position,
          map,
          title: marker.title,
        });

        if (marker.info) {
          const infoWindow = new window.google.maps.InfoWindow({
            content: marker.info,
          });

          mapMarker.addListener("click", () => {
            infoWindow.open(map, mapMarker);
          });
        }
      });
    }
  }, [map, markers]);

  return <div ref={ref} className="w-full h-64 rounded-lg" />;
};

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">Loading map...</div>;
    case Status.FAILURE:
      return <div className="w-full h-64 bg-red-100 rounded-lg flex items-center justify-center text-red-600">Error loading map</div>;
    case Status.SUCCESS:
      return <MapComponent center={{ lat: 6.5244, lng: 3.3792 }} zoom={12} />;
  }
};

export default function GoogleMap() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="w-full h-64 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-800">
        Google Maps API key not configured
      </div>
    );
  }

  return <Wrapper apiKey={apiKey} render={render} />;
}