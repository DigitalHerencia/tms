'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Driver } from '@/types/drivers';

interface DriverMapProps {
  drivers: Driver[];
}

const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Interactive map using Leaflet for driver locations
export function DriverMap({ drivers }: DriverMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = L.map(mapRef.current).setView([39.5, -98.35], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    drivers.forEach((d) => {
      const lat = d.currentLocation?.latitude;
      const lng = d.currentLocation?.longitude;
      if (lat !== undefined && lng !== undefined) {
        L.marker([lat, lng], { icon: markerIcon }).addTo(map);
      }
    });

    return () => {
      map.remove();
    };
  }, [drivers]);

  return <div ref={mapRef} className="h-64 w-full rounded-lg" />;
}
