const RAPIDAPI_KEY = 'e2b9507f2bmsh2ab87b5b1a01727p1890dajsn024e36a56f93';
const RAPIDAPI_HOST = 'google-map-places.p.rapidapi.com';

export const getStreetViewImage = (location: string) => {
  // Direct street view URL that ALWAYS works
  const coords = getLocationCoords(location);
  return `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${coords.lat},${coords.lng}&key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw`;
};

const getLocationCoords = (location: string) => {
  // Lagos PHC coordinates
  const locations: { [key: string]: { lat: number; lng: number } } = {
    'Central PHC Ikeja': { lat: 6.5244, lng: 3.3792 },
    'Community Health Center': { lat: 6.4474, lng: 3.3903 },
    'Primary Care Clinic': { lat: 6.5027, lng: 3.3218 }
  };
  
  return locations[location] || { lat: 6.5244, lng: 3.3792 };
};

export const getPlaceDetails = async (query: string) => {
  try {
    const response = await fetch(`https://google-map-places.p.rapidapi.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&radius=1000`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST
      }
    });
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Place search error:', error);
    return [];
  }
};