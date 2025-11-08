import { useState, useEffect } from 'react';
import mapsService, { PHC, UserLocation } from '@/lib/maps-service';

export default function NearbyPHCs() {
  const [phcs, setPHCs] = useState<PHC[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(false);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          setUserLocation({ lat: 9.0765, lng: 7.3986 }); // Abuja default
        }
      );
    } else {
      setUserLocation({ lat: 9.0765, lng: 7.3986 });
    }
  };

  const findNearbyPHCs = async () => {
    if (!userLocation) return;
    
    setLoading(true);
    const nearbyPHCs = await mapsService.getNearbyPHCs(userLocation);
    setPHCs(nearbyPHCs.sort((a, b) => (a.distance || 0) - (b.distance || 0)));
    setLoading(false);
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      findNearbyPHCs();
    }
  }, [userLocation]);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Nearby PHCs</h2>
      
      <button 
        onClick={getUserLocation}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Update Location
      </button>

      {loading && <p className="text-gray-500">Finding nearby PHCs...</p>}

      <div className="space-y-3">
        {phcs.map(phc => (
          <div key={phc.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{phc.name}</h3>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                {phc.distance}km away
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{phc.address}</p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {phc.services.map(service => (
                <span key={service} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {service}
                </span>
              ))}
            </div>
            
            <div className="flex gap-2">
              <a 
                href={mapsService.getMapUrl(phc)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                View on Map
              </a>
              
              <button 
                onClick={() => window.open(`tel:+234${Math.floor(Math.random() * 1000000000)}`, '_self')}
                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
              >
                Call PHC
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}