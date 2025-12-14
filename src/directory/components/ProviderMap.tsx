import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Loader } from 'lucide-react';
import { Provider } from '../../admin/types';
import { loadGoogleMapsAPI } from '../utils/googleMapsLoader';

declare global {
  interface Window {
    google: any;
  }
}

interface ProviderMapProps {
  provider: Provider;
  isDark: boolean;
}

const ProviderMap: React.FC<ProviderMapProps> = ({ provider, isDark }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const marker = useRef<any>(null);
  const [loading, setLoading] = useState(true);

  // Only render map if latitude and longitude are available
  const hasCoordinates =
    provider.latitude &&
    provider.longitude &&
    typeof provider.latitude === 'number' &&
    typeof provider.longitude === 'number';

  useEffect(() => {
    if (!hasCoordinates) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const initMap = async () => {
      try {
        setLoading(true);

        // Load Google Maps API if not already loaded
        if (!window.google?.maps) {
          await loadGoogleMapsAPI();
        }

        if (!isMounted || !mapContainer.current) return;

        const location = {
          lat: provider.latitude!,
          lng: provider.longitude!,
        };

        // Create map
        map.current = new window.google.maps.Map(mapContainer.current, {
          zoom: 15,
          center: location,
          mapTypeControl: true,
          fullscreenControl: true,
          streetViewControl: false,
          styles: isDark
            ? [
                { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
                { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
                { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
                {
                  featureType: 'administrative.locality',
                  elementType: 'labels.text.fill',
                  stylers: [{ color: '#d59563' }],
                },
                {
                  featureType: 'poi',
                  elementType: 'labels.text.fill',
                  stylers: [{ color: '#d59563' }],
                },
                {
                  featureType: 'poi.park',
                  elementType: 'geometry',
                  stylers: [{ color: '#263c3f' }],
                },
                {
                  featureType: 'poi.park',
                  elementType: 'labels.text.fill',
                  stylers: [{ color: '#6b9080' }],
                },
                {
                  featureType: 'road',
                  elementType: 'geometry',
                  stylers: [{ color: '#38414e' }],
                },
                {
                  featureType: 'road',
                  elementType: 'geometry.stroke',
                  stylers: [{ color: '#212a37' }],
                },
                {
                  featureType: 'road',
                  elementType: 'labels.text.fill',
                  stylers: [{ color: '#9ca5b3' }],
                },
                {
                  featureType: 'road.highway',
                  elementType: 'geometry',
                  stylers: [{ color: '#746855' }],
                },
                {
                  featureType: 'road.highway',
                  elementType: 'geometry.stroke',
                  stylers: [{ color: '#1f2835' }],
                },
                {
                  featureType: 'road.highway',
                  elementType: 'labels.text.fill',
                  stylers: [{ color: '#f3751ff' }],
                },
                {
                  featureType: 'transit',
                  elementType: 'geometry',
                  stylers: [{ color: '#2f3948' }],
                },
                {
                  featureType: 'transit.station',
                  elementType: 'labels.text.fill',
                  stylers: [{ color: '#d59563' }],
                },
                {
                  featureType: 'water',
                  elementType: 'geometry',
                  stylers: [{ color: '#17263c' }],
                },
                {
                  featureType: 'water',
                  elementType: 'labels.text.fill',
                  stylers: [{ color: '#515c6d' }],
                },
                {
                  featureType: 'water',
                  elementType: 'labels.text.stroke',
                  stylers: [{ color: '#17263c' }],
                },
              ]
            : [],
        });

        // Add marker
        marker.current = new window.google.maps.Marker({
          position: location,
          map: map.current,
          title: provider.full_name,
          animation: window.google.maps.Animation.DROP,
        });

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; font-family: system-ui, -apple-system, sans-serif;">
              <p style="margin: 0; font-weight: 600; font-size: 14px;">${provider.full_name}</p>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">${provider.profession}</p>
            </div>
          `,
        });

        marker.current.addListener('click', () => {
          infoWindow.open(map.current, marker.current);
        });

        if (isMounted) {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error initializing map:', err);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initMap();

    return () => {
      isMounted = false;
      // Clean up map instance properly
      if (map.current) {
        // Unbind all events
        window.google?.maps?.event?.clearInstanceListeners(map.current);
        map.current = null;
      }
      if (marker.current) {
        window.google?.maps?.event?.clearInstanceListeners(marker.current);
        marker.current = null;
      }
    };
  }, [provider.latitude, provider.longitude, isDark, hasCoordinates]);



  const handleOpenInMaps = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const mapsUrl = isMobile
      ? `https://maps.apple.com/?q=${provider.latitude},${provider.longitude}`
      : `https://www.google.com/maps/search/${provider.latitude},${provider.longitude}`;
    window.open(mapsUrl, '_blank');
  };

  // If no coordinates, show address with link to open in maps
  if (!hasCoordinates) {
    const addressParts = [
      provider.address_line_1,
      provider.suburb,
      provider.city,
      provider.province,
      provider.country,
    ]
      .filter(Boolean)
      .join(', ');

    return (
      <div className="space-y-3">
        <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Location
        </p>
        <div className={`flex gap-3 p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
          <div className="flex-1">
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {addressParts || 'Address not available'}
            </p>
          </div>
        </div>
        {addressParts && (
          <button
            onClick={() => {
              const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
              const mapsUrl = isMobile
                ? `https://maps.apple.com/?q=${encodeURIComponent(addressParts)}`
                : `https://www.google.com/maps/search/${encodeURIComponent(addressParts)}`;
              window.open(mapsUrl, '_blank');
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-green-500 text-white font-medium text-sm transition-all hover:shadow-lg hover:shadow-green-500/30"
          >
            <ExternalLink className="w-4 h-4" />
            Open in Google Maps
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        Location Map
      </p>

      <div className={`relative w-full h-64 rounded-lg overflow-hidden border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div
          ref={mapContainer}
          className="w-full h-full"
        />
        {loading && (
          <div className={`absolute inset-0 flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <Loader className="w-6 h-6 animate-spin text-green-600" />
          </div>
        )}
      </div>

      <button
        onClick={handleOpenInMaps}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-green-500 text-white font-medium text-sm transition-all hover:shadow-lg hover:shadow-green-500/30"
      >
        <ExternalLink className="w-4 h-4" />
        Open in Google Maps
      </button>
    </div>
  );
};

export default ProviderMap;
