'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

interface VendorMarkerProps {
  position: [number, number];
  businessName?: string;
  category?: string;
  isPremium?: boolean;
  onClick?: () => void;
}

function getCategoryIcon(category = ''): string {
  const cat = category.toLowerCase();
  if (cat.includes('sate')) return '🍢';
  if (cat.includes('bakso') || cat.includes('mie')) return '🍜';
  if (cat.includes('nasi')) return '🍛';
  if (cat.includes('goreng')) return '🥟';
  if (cat.includes('minum') || cat.includes('kopi') || cat.includes('es')) return '🧋';
  return '🛒';
}

export function VendorMarker({
  position,
  businessName = 'Pedagang PKL',
  category = 'Kuliner',
  isPremium = false,
  onClick,
}: VendorMarkerProps) {
  const icon = useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    const L = require('leaflet');

    const catIcon = getCategoryIcon(category);
    const pinBg = isPremium
      ? 'linear-gradient(135deg, #f97316, #ea580c)'
      : 'linear-gradient(135deg, #22c55e, #16a34a)';
    const triangleColor = isPremium ? '#ea580c' : '#16a34a';
    const rippleColor = isPremium
      ? 'rgba(249, 115, 22, 0.4)'
      : 'rgba(34, 197, 94, 0.4)';

    return L.divIcon({
      className: 'custom-vendor-pin-wrapper',
      html: `
        <div style="position: relative; width: 64px; height: 76px; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; cursor: pointer; user-select: none;">
          
          <!-- Gelombang Radar Siaran Live -->
          <div style="position: absolute; bottom: 4px; width: 42px; height: 42px; border-radius: 9999px; background: ${rippleColor}; animation: radarPulse 2.2s cubic-bezier(0, 0, 0.2, 1) infinite; pointer-events: none;"></div>
          
          <!-- Pin Container dengan Animasi Mengambang Lembut -->
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; animation: vendorFloat 2.6s ease-in-out infinite;">
            
            <!-- Label Bersih Minimalis (Mirip Google Maps / Gojek Pin) -->
            <div style="background: #ffffff; color: #0f172a; padding: 2.5px 8px; border-radius: 9999px; font-size: 11px; font-weight: 700; white-space: nowrap; box-shadow: 0 3px 8px rgba(0,0,0,0.12); border: 1.5px solid #e2e8f0; display: flex; align-items: center; gap: 4px; margin-bottom: 3px; max-width: 140px;">
              <span style="width: 6px; height: 6px; border-radius: 9999px; background-color: #16a34a; display: inline-block; shrink: 0;"></span>
              <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${businessName}</span>
            </div>

            <!-- Lingkaran Pin Utama (48px) -->
            <div style="width: 48px; height: 48px; background: ${pinBg}; border-radius: 9999px; display: flex; align-items: center; justify-content: center; font-size: 22px; box-shadow: 0 6px 14px rgba(0,0,0,0.18); border: 2.5px solid #ffffff;">
              ${catIcon}
            </div>

            <!-- Jarum Penunjuk Segitiga -->
            <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 7px solid ${triangleColor}; margin-top: -1px;"></div>
          </div>
        </div>
      `,
      iconSize: [64, 76],
      iconAnchor: [32, 76],
    });
  }, [businessName, category, isPremium]);

  const eventHandlers = useMemo(
    () => ({
      click() {
        if (onClick) onClick();
      },
    }),
    [onClick]
  );

  if (!icon) return null;

  return <Marker position={position} icon={icon} eventHandlers={eventHandlers} />;
}
