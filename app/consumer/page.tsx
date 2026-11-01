'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapView } from '@/app/components/map/MapView';
import { VendorMarker } from '@/app/components/map/VendorMarker';
import { SearchBar } from '@/app/components/consumer/SearchBar';
import { VendorNotification } from '@/app/components/consumer/VendorNotification';
import { BackButton } from '@/app/components/ui/BackButton';
import { DEFAULT_CENTER, NEARBY_NOTIFICATION_DELAY_MS } from '@/app/lib/constants';

export default function ConsumerPage() {
  const router = useRouter();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => setShowNotification(true),
      NEARBY_NOTIFICATION_DELAY_MS
    );
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-dvh overflow-hidden">
      <MapView center={DEFAULT_CENTER}>
        <VendorMarker position={DEFAULT_CENTER} />
      </MapView>

      <BackButton onClick={() => router.push('/')} />
      <SearchBar />
      <VendorNotification visible={showNotification} />
    </div>
  );
}
