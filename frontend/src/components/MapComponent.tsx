import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface Mission {
  id: string;
  title?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  status?: string;
}

interface MapComponentProps {
  missions: Mission[];
}

const MapComponent: React.FC<MapComponentProps> = ({ missions }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const initMap = async () => {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
        setError('Google Maps API key not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.');
        return;
      }

      try {
        const loader = new Loader({
          apiKey: apiKey,
          version: 'weekly',
        });

        await loader.load();

        if (mapRef.current && !map) {
          // Get user location or default to center
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };

              const newMap = new google.maps.Map(mapRef.current!, {
                center: userLocation,
                zoom: 13,
              });

              // Add user marker
              new google.maps.Marker({
                position: userLocation,
                map: newMap,
                title: 'Your Location',
                icon: {
                  url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                },
              });

              setMap(newMap);
            },
            () => {
              // Default location if geolocation fails
              const defaultLocation = { lat: 48.8566, lng: 2.3522 }; // Paris
              const newMap = new google.maps.Map(mapRef.current!, {
                center: defaultLocation,
                zoom: 13,
              });
              setMap(newMap);
            }
          );
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        setError('Failed to load Google Maps. Please check your API key.');
      }
    };

    initMap();
  }, []);

  useEffect(() => {
    if (map && missions.length > 0) {
      // Clear existing markers (you might want to keep track of them)
      // Add mission markers
      missions.forEach((mission) => {
        if (mission.latitude && mission.longitude) {
          new google.maps.Marker({
            position: { lat: mission.latitude, lng: mission.longitude },
            map: map,
            title: mission.title || mission.description || 'Mission',
            icon: {
              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            },
          });
        }
      });
    }
  }, [map, missions]);

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        background: '#fee', 
        border: '1px solid #fcc',
        borderRadius: '8px',
        color: '#c33'
      }}>
        {error}
      </div>
    );
  }

  return <div ref={mapRef} style={{ width: '100%', height: '400px', borderRadius: '8px' }} />;
};

export default MapComponent;
