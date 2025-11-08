import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Phone } from 'lucide-react';
import { getStreetViewImage } from '../../lib/maps-api';

interface PHCMapProps {
  phc: any;
  userLocation: { lat: number; lng: number } | null;
  onBack: () => void;
}

export default function PHCMap({ phc, userLocation, onBack }: PHCMapProps) {
  const [streetViewUrl, setStreetViewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const imageUrl = getStreetViewImage(phc.name);
    setStreetViewUrl(imageUrl);
    setLoading(false);
  }, [phc]);

  const openDirections = () => {
    const destination = encodeURIComponent(`${phc.name}, Lagos, Nigeria`);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center mb-4">
          <MapPin className="w-5 h-5 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800">{phc.name}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-800 mb-3">Location Details</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                {phc.phone}
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {phc.distance} away
              </div>
              <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                phc.status === "Open" 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {phc.status}
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={openDirections}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Get Directions
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-3">Street View</h3>
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-500">Loading street view...</div>
                </div>
              ) : streetViewUrl ? (
                <img 
                  src={streetViewUrl} 
                  alt={`Street view of ${phc.name}`}
                  className="w-full h-full object-cover"
                  onLoad={() => console.log('Street view loaded successfully')}
                  onError={(e) => {
                    console.log('Street view failed, showing fallback');
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <p className="text-blue-800 font-medium">{phc.name}</p>
                    <p className="text-blue-600 text-sm">Street view unavailable</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}