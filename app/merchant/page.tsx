'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapView } from '@/app/components/map/MapView';
import { VendorMarker } from '@/app/components/map/VendorMarker';
import { MerchantPanel } from '@/app/components/merchant/MerchantPanel';
import { BackButton } from '@/app/components/ui/BackButton';
import { useGeolocation } from '@/app/hooks/useGeolocation';

export default function MerchantPage() {
  const router = useRouter();
  const {
    location,
    isTracking,
    lastUpdated,
    toggleTracking,
    stopTracking,
  } = useGeolocation();
  const [isPremiumActive, setIsPremiumActive] = useState(false);

  const handleExit = () => {
    stopTracking();
    router.push('/');
  };

  return (
    <div className="relative w-full h-dvh overflow-hidden">
      <MapView center={location}>
        {isTracking && <VendorMarker position={location} />}
      </MapView>

      <BackButton onClick={handleExit} />

      <MerchantPanel
        isTracking={isTracking}
        isPremiumActive={isPremiumActive}
        lastUpdated={lastUpdated}
        onToggleTracking={toggleTracking}
        onTogglePremium={setIsPremiumActive}
        onOpenProfile={() => router.push('/merchant/profile')}
      />
    </div>
  );
}
