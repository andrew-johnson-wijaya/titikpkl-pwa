'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  VENDOR_ICON_URL,
  VENDOR_ICON_SIZE,
  VENDOR_ICON_ANCHOR,
} from '@/app/lib/constants';

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

interface VendorMarkerProps {
  position: [number, number];
}

export function VendorMarker({ position }: VendorMarkerProps) {
  const icon = useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    const L = require('leaflet');
    return L.icon({
      iconUrl: VENDOR_ICON_URL,
      iconSize: VENDOR_ICON_SIZE,
      iconAnchor: VENDOR_ICON_ANCHOR,
    });
  }, []);

  if (!icon) return null;

  return <Marker position={position} icon={icon} />;
}
