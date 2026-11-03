'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapView } from '@/app/components/map/MapView';
import { VendorMarker } from '@/app/components/map/VendorMarker';
import { MerchantPanel } from '@/app/components/merchant/MerchantPanel';
import { BackButton } from '@/app/components/ui/BackButton';
import { useGeolocation } from '@/app/hooks/useGeolocation';
import { useAuth } from '@/app/hooks/useAuth';

export default function MerchantPage() {
  const router = useRouter();
  const { merchant, supabase } = useAuth();
  const {
    location,
    isTracking,
    lastUpdated,
    toggleTracking,
    stopTracking,
  } = useGeolocation();
  const [isPremiumActive, setIsPremiumActive] = useState(false);

  // Sinkronisasi status premium awal dari database
  useEffect(() => {
    if (merchant?.is_premium !== undefined) {
      setIsPremiumActive(merchant.is_premium);
    }
  }, [merchant]);

  // Sinkronisasi lokasi ke Supabase saat tracking aktif
  useEffect(() => {
    if (!merchant?.id) return;

    const syncLocation = async () => {
      try {
        await supabase.from('vendor_locations').upsert(
          {
            merchant_id: merchant.id,
            latitude: location[0],
            longitude: location[1],
            is_live: isTracking,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'merchant_id' }
        );
      } catch (err) {
        console.error('Failed to sync location to database:', err);
      }
    };

    syncLocation();
  }, [location, isTracking, merchant, supabase]);

  const handleTogglePremium = async (active: boolean) => {
    setIsPremiumActive(active);
    if (merchant?.id) {
      try {
        await supabase
          .from('merchants')
          .update({ is_premium: active })
          .eq('id', merchant.id);
      } catch (err) {
        console.error('Failed to update premium status:', err);
      }
    }
  };

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
        businessName={merchant?.business_name}
        businessCode={merchant?.business_code}
        isTracking={isTracking}
        isPremiumActive={isPremiumActive}
        lastUpdated={lastUpdated}
        onToggleTracking={toggleTracking}
        onTogglePremium={handleTogglePremium}
        onOpenProfile={() => router.push('/merchant/profile')}
      />
    </div>
  );
}
