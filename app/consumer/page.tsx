'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapView } from '@/app/components/map/MapView';
import { VendorMarker } from '@/app/components/map/VendorMarker';
import { SearchBar } from '@/app/components/consumer/SearchBar';
import { VendorNotification } from '@/app/components/consumer/VendorNotification';
import { VendorMenuModal } from '@/app/components/consumer/VendorMenuModal';
import { BackButton } from '@/app/components/ui/BackButton';
import { DEFAULT_CENTER, NEARBY_NOTIFICATION_DELAY_MS } from '@/app/lib/constants';
import { createClient } from '@/app/lib/supabase/client';

interface LiveVendor {
  id: string;
  latitude: number;
  longitude: number;
  businessName: string;
  category: string;
  isPremium: boolean;
}

export default function ConsumerPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [showNotification, setShowNotification] = useState(false);
  const [notificationVendor, setNotificationVendor] = useState('Sate Ayam Cak Roni');
  const [vendors, setVendors] = useState<LiveVendor[]>([]);

  // State untuk modal menu jajanan
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<{
    name: string;
    category: string;
    latitude: number;
    longitude: number;
  }>({
    name: 'Sate Ayam Cak Roni',
    category: 'Sate Madura',
    latitude: DEFAULT_CENTER[0],
    longitude: DEFAULT_CENTER[1],
  });

  useEffect(() => {
    // Ambil data pedagang yang sedang aktif berjualan
    const fetchVendors = async () => {
      try {
        const { data, error } = await supabase
          .from('vendor_locations')
          .select(
            `
            id,
            latitude,
            longitude,
            merchants (
              business_name,
              category,
              is_premium
            )
          `
          )
          .eq('is_live', true);

        if (!error && data && data.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mapped: LiveVendor[] = data.map((item: any) => ({
            id: item.id,
            latitude: item.latitude,
            longitude: item.longitude,
            businessName: item.merchants?.business_name || 'Pedagang PKL',
            category: item.merchants?.category || 'Kuliner',
            isPremium: Boolean(item.merchants?.is_premium),
          }));

          setVendors(mapped);

          // Cek apakah ada pedagang premium untuk notifikasi
          const premium = mapped.find((v) => v.isPremium);
          if (premium) {
            setNotificationVendor(premium.businessName);
          }
        }
      } catch (err) {
        console.error('Error fetching vendors from Supabase:', err);
      }
    };

    fetchVendors();

    const timer = setTimeout(
      () => setShowNotification(true),
      NEARBY_NOTIFICATION_DELAY_MS
    );
    return () => clearTimeout(timer);
  }, [supabase]);

  const handleOpenVendorDetail = (
    name = notificationVendor,
    category = 'Kuliner PKL',
    lat = DEFAULT_CENTER[0],
    lng = DEFAULT_CENTER[1]
  ) => {
    setSelectedVendor({
      name,
      category,
      latitude: lat,
      longitude: lng,
    });
    setIsMenuOpen(true);
  };

  return (
    <div className="relative w-full h-dvh overflow-hidden">
      <MapView center={DEFAULT_CENTER}>
        {vendors.length > 0 ? (
          vendors.map((vendor) => (
            <VendorMarker
              key={vendor.id}
              position={[vendor.latitude, vendor.longitude]}
              onClick={() =>
                handleOpenVendorDetail(
                  vendor.businessName,
                  vendor.category,
                  vendor.latitude,
                  vendor.longitude
                )
              }
            />
          ))
        ) : (
          /* Default marker jika belum ada pedagang live dari DB */
          <VendorMarker
            position={DEFAULT_CENTER}
            onClick={() =>
              handleOpenVendorDetail(
                'Sate Ayam Cak Roni',
                'Sate & Kuliner',
                DEFAULT_CENTER[0],
                DEFAULT_CENTER[1]
              )
            }
          />
        )}
      </MapView>

      <BackButton onClick={() => router.push('/')} />
      <SearchBar />

      {/* Notifikasi klik bisa langsung buka menu */}
      <VendorNotification
        visible={showNotification}
        vendorName={notificationVendor}
        onClick={() => handleOpenVendorDetail(notificationVendor)}
      />

      {/* Modal / Drawer Menu Makanan & Harga */}
      <VendorMenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        vendorName={selectedVendor.name}
        category={selectedVendor.category}
        latitude={selectedVendor.latitude}
        longitude={selectedVendor.longitude}
      />
    </div>
  );
}
