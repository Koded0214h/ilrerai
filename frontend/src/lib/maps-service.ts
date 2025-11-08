import axios from 'axios';
import phcDataService from './phc-data-service';

interface PHC {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance?: number;
  services: string[];
}

interface UserLocation {
  lat: number;
  lng: number;
}

class MapsService {
  private apiKey = 'e2b9507f2bmsh2ab87b5b1a01727p1890dajsn024e36a56f93';

  async getNearbyPHCs(userLocation: UserLocation, radius: number = 10): Promise<PHC[]> {
    try {
      const response = await axios.get('https://google-map-places.p.rapidapi.com/maps/api/place/nearbysearch/json', {
        params: {
          location: `${userLocation.lat},${userLocation.lng}`,
          radius: radius * 1000,
          type: 'hospital',
          keyword: 'primary health care'
        },
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': 'google-map-places.p.rapidapi.com'
        }
      });

      return response.data.results.map((place: any, index: number) => ({
        id: place.place_id || `phc-${index}`,
        name: place.name,
        address: place.vicinity,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        distance: this.calculateDistance(userLocation, place.geometry.location),
        services: ['General Consultation', 'Vaccination', 'Health Screening']
      }));
    } catch (error) {
      return await this.getMockPHCs(userLocation);
    }
  }

  private async getMockPHCs(userLocation: UserLocation): Promise<PHC[]> {
    const mockPHCs = [
      { name: 'Central PHC', lat: userLocation.lat + 0.01, lng: userLocation.lng + 0.01 },
      { name: 'Community Health Center', lat: userLocation.lat - 0.02, lng: userLocation.lng + 0.015 },
      { name: 'District PHC', lat: userLocation.lat + 0.025, lng: userLocation.lng - 0.01 }
    ];

    try {
      const realPHCData = await phcDataService.fetchPHCData('anambra');
      return mockPHCs.map((phc, index) => ({
        id: `phc-${index}`,
        name: realPHCData[index]?.name || phc.name,
        address: `${phc.name} Address`,
        lat: phc.lat,
        lng: phc.lng,
        distance: this.calculateDistance(userLocation, { lat: phc.lat, lng: phc.lng }),
        services: realPHCData[index]?.services || ['General Consultation', 'Vaccination', 'Health Screening']
      }));
    } catch (error) {
      return mockPHCs.map((phc, index) => ({
        id: `phc-${index}`,
        name: phc.name,
        address: `${phc.name} Address`,
        lat: phc.lat,
        lng: phc.lng,
        distance: this.calculateDistance(userLocation, { lat: phc.lat, lng: phc.lng }),
        services: ['General Consultation', 'Vaccination', 'Health Screening']
      }));
    }
  }

  calculateDistance(point1: UserLocation, point2: UserLocation): number {
    const R = 6371;
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLon = (point2.lng - point1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 100) / 100;
  }

  getMapUrl(phc: PHC): string {
    return `https://www.google.com/maps?q=${phc.lat},${phc.lng}`;
  }

  async getStreetView(location: string): Promise<string> {
    try {
      const response = await axios.get('https://google-map-places.p.rapidapi.com/maps/api/streetview', {
        params: {
          size: '600x400',
          location,
          return_error_code: 'true'
        },
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': 'google-map-places.p.rapidapi.com'
        }
      });
      return response.data;
    } catch (error) {
      return '';
    }
  }
}

export default new MapsService();
export type { PHC, UserLocation };