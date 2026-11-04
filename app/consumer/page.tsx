'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MapView } from '@/app/components/map/MapView';
import { VendorMarker } from '@/app/components/map/VendorMarker';
import { UserMarker } from '@/app/components/map/UserMarker';
import { SearchBar } from '@/app/components/consumer/SearchBar';
import { VendorNotification } from '@/app/components/consumer/VendorNotification';
import { VendorMenuModal } from '@/app/components/consumer/VendorMenuModal';
import { VendorListView, type VendorListItem } from '@/app/components/consumer/VendorListView';
import { BackButton } from '@/app/components/ui/BackButton';
import { DEFAULT_CENTER, NEARBY_NOTIFICATION_DELAY_MS } from '@/app/lib/constants';
import { calculateDistanceMeters, formatDistance } from '@/app/lib/utils/distance';
import { createClient } from '@/app/lib/supabase/client';

export default function ConsumerPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  // State Lokasi Pengguna
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);

  // State Pedagang Aktif
  const [vendors, setVendors] = useState<VendorListItem[]>([]);

  // State Search & Kategori
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isListView, setIsListView] = useState(false);

  // State Notifikasi
  const [showNotification, setShowNotification] = useState(false);
  const [nearestVendor, setNearestVendor] = useState<{
    name: string;
    distanceText: string;
  } | null>(null);

  // State Modal Menu
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

  // 1. Ambil Lokasi GPS Asli Pengguna
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setUserLocation(userPos);
          setMapCenter(userPos);
        },
        (error) => {
          console.warn('Geolocation not allowed, fallback to default center:', error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  // 2. Fetch Data Pedagang Aktif dari Supabase
  const fetchVendors = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_locations')
        .select(
          `
          id,
          latitude,
          longitude,
          is_live,
          merchants (
            business_name,
            category,
            is_premium
          )
        `
        )
        .eq('is_live', true);

      if (!error && data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped: VendorListItem[] = data.map((item: any) => ({
          id: item.id,
          latitude: item.latitude,
          longitude: item.longitude,
          businessName: item.merchants?.business_name || 'Pedagang PKL',
          category: item.merchants?.category || 'Kuliner',
          isPremium: Boolean(item.merchants?.is_premium),
        }));
        setVendors(mapped);
      }
    } catch (err) {
      console.error('Error fetching vendors:', err);
    }
  }, [supabase]);

  // 3. Setup Supabase Realtime Subscription
  useEffect(() => {
    fetchVendors();

    const channel = supabase
      .channel('realtime-vendor-locations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vendor_locations',
        },
        () => {
          // Ketika pedagang update lokasi atau status is_live berubah, refresh otomatis!
          fetchVendors();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchVendors]);

  // 4. Hitung Jarak & Urutkan Pedagang Terdekat
  const vendorsWithDistance = useMemo(() => {
    const referencePos = userLocation || DEFAULT_CENTER;

    // Jika belum ada pedagang live dari DB, berikan contoh fallback agar peta tetap interaktif
    const baseList: VendorListItem[] =
      vendors.length > 0
        ? vendors
        : [
            {
              id: 'sample-1',
              businessName: 'Sate Ayam Cak Roni',
              category: 'Sate',
              isPremium: true,
              latitude: referencePos[0] + 0.002,
              longitude: referencePos[1] + 0.0015,
            },
            {
              id: 'sample-2',
              businessName: 'Bakso Malang Mas Anto',
              category: 'Bakso & Mie',
              isPremium: false,
              latitude: referencePos[0] - 0.0018,
              longitude: referencePos[1] - 0.002,
            },
            {
              id: 'sample-3',
              businessName: 'Gorengan Renyah Ibu Siti',
              category: 'Gorengan',
              isPremium: false,
              latitude: referencePos[0] + 0.0035,
              longitude: referencePos[1] - 0.001,
            },
          ];

    return baseList
      .map((vendor) => {
        const dist = calculateDistanceMeters(
          referencePos[0],
          referencePos[1],
          vendor.latitude,
          vendor.longitude
        );
        return {
          ...vendor,
          distanceMeters: dist,
        };
      })
      .sort((a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0));
  }, [vendors, userLocation]);

  // 5. Filter Berdasarkan Query Pencarian & Kategori
  const filteredVendors = useMemo(() => {
    return vendorsWithDistance.filter((vendor) => {
      const matchQuery =
        vendor.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === 'Semua' ||
        vendor.category.toLowerCase().includes(selectedCategory.toLowerCase());

      return matchQuery && matchCategory;
    });
  }, [vendorsWithDistance, searchQuery, selectedCategory]);

  // 6. Real Proximity Notification (Deteksi PKL < 1km)
  useEffect(() => {
    if (vendorsWithDistance.length > 0) {
      const closest = vendorsWithDistance[0];
      if (closest && closest.distanceMeters !== undefined && closest.distanceMeters <= 1200) {
        setNearestVendor({
          name: closest.businessName,
          distanceText: formatDistance(closest.distanceMeters),
        });

        const timer = setTimeout(() => {
          setShowNotification(true);
        }, NEARBY_NOTIFICATION_DELAY_MS);

        return () => clearTimeout(timer);
      }
    }
  }, [vendorsWithDistance]);

  const handleOpenVendorDetail = (vendor: {
    businessName: string;
    category: string;
    latitude: number;
    longitude: number;
  }) => {
    setSelectedVendor({
      name: vendor.businessName,
      category: vendor.category,
      latitude: vendor.latitude,
      longitude: vendor.longitude,
    });
    setIsMenuOpen(true);
  };

  const handleViewOnMap = (vendor: VendorListItem) => {
    setMapCenter([vendor.latitude, vendor.longitude]);
    setIsListView(false);
  };

  const handleRecenterUser = () => {
    if (userLocation) {
      setMapCenter([userLocation[0], userLocation[1]]);
    } else {
      setMapCenter(DEFAULT_CENTER);
    }
  };

  return (
    <div className="relative w-full h-dvh overflow-hidden bg-gray-100">
      {/* 🗺️ PETA LEAFLET */}
      <MapView center={mapCenter}>
        {/* Pin Lokasi Pembeli */}
        {userLocation && <UserMarker position={userLocation} />}

        {/* Pin Pedagang PKL yang Cocok dengan Filter */}
        {filteredVendors.map((vendor) => (
          <VendorMarker
            key={vendor.id}
            position={[vendor.latitude, vendor.longitude]}
            onClick={() => handleOpenVendorDetail(vendor)}
          />
        ))}
      </MapView>

      {/* Tombol Keluar Navigasi */}
      <BackButton onClick={() => router.push('/')} />

      {/* 🔍 SEARCH BAR & FILTER KATEGORI */}
      <SearchBar
        query={searchQuery}
        onQueryChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        activeCount={filteredVendors.length}
        isListView={isListView}
        onToggleView={() => setIsListView((prev) => !prev)}
      />

      {/* 📋 VIEW DAFTAR PKL (OVERLAY) */}
      {isListView && (
        <VendorListView
          vendors={filteredVendors}
          onSelectVendor={handleOpenVendorDetail}
          onViewOnMap={handleViewOnMap}
          query={searchQuery}
        />
      )}

      {/* 🔔 NOTIFIKASI PKL TERDEKAT RIIL */}
      {!isListView && nearestVendor && (
        <VendorNotification
          visible={showNotification}
          vendorName={nearestVendor.name}
          distanceText={nearestVendor.distanceText}
          onClick={() => {
            const match = filteredVendors.find(
              (v) => v.businessName === nearestVendor.name
            );
            if (match) handleOpenVendorDetail(match);
          }}
          onDismiss={() => setShowNotification(false)}
        />
      )}

      {/* 🎯 FLOATING BUTTON: LOKASIKU */}
      {!isListView && (
        <button
          onClick={handleRecenterUser}
          className="absolute bottom-6 right-5 z-[1000] w-12 h-12 rounded-full bg-white text-gray-800 shadow-xl border border-gray-200 flex items-center justify-center text-lg hover:bg-gray-50 transition-all cursor-pointer"
          title="Pusatkan ke Lokasiku"
        >
          🎯
        </button>
      )}

      {/* 📋 MODAL MENU & HARGA JAJANAN */}
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
