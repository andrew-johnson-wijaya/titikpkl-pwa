'use client';

import { useEffect, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '@/app/lib/constants';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  children?: ReactNode;
}

export function MapView({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  children,
}: MapViewProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-dvh flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500">Memuat peta...</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      key={`${center[0]}-${center[1]}`}
      center={center}
      zoom={zoom}
      style={{ width: '100%', height: '100dvh' }}
      zoomControl={false}
    >
      {/* 
        Tile Server Esri World Light Gray Canvas:
        - 100% GRATIS & TANPA API KEY
        - Peta abu-abu terang yang sangat bersih — TIDAK ADA ikon POI (salib, restoran, rumah sakit, dll.)
        - Hanya menampilkan jalanan & area, sempurna untuk tampilan minimalis
      */}
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        attribution='&copy; <a href="https://www.esri.com/">Esri</a>, HERE, Garmin, &copy; OpenStreetMap contributors'
        maxZoom={16}
      />
      {children}
    </MapContainer>
  );
}
