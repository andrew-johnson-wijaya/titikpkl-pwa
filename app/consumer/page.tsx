'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MapView } from '@/app/components/map/MapView';
import { VendorMarker } from '@/app/components/map/VendorMarker';
import { UserMarker } from '@/app/components/map/UserMarker';
import { SearchBar } from '@/app/components/consumer/SearchBar';
import { VendorMenuModal } from '@/app/components/consumer/VendorMenuModal';
import { VendorListView, type VendorListItem } from '@/app/components/consumer/VendorListView';
import { DEFAULT_CENTER } from '@/app/lib/constants';
import { calculateDistanceMeters, formatDistance } from '@/app/lib/utils/distance';
import { createClient } from '@/app/lib/supabase/client';

export default function ConsumerPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  // State Lokasi Pengguna & Center Peta
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);

  // State Pedagang Aktif
  const [vendors, setVendors] = useState<VendorListItem[]>([]);

  // State Search & Kategori
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isListView, setIsListView] = useState(false);

  // State Info Pedagang Terdekat untuk Bottom Sheet
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
              businessName: 'Gorengan Renyah Bu Siti',
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

  // 6. Set Pedagang Terdekat untuk Bottom Bar
  useEffect(() => {
    if (vendorsWithDistance.length > 0) {
      const closest = vendorsWithDistance[0];
      if (closest && closest.distanceMeters !== undefined) {
        setNearestVendor({
          name: closest.businessName,
          distanceText: formatDistance(closest.distanceMeters),
        });
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
    <div className="relative w-full h-dvh overflow-hidden bg-slate-100">
      {/* 🗺️ PETA LEAFLET DENGAN GAYA MINIMALIS (GOJEK/GRAB STYLE) */}
      <MapView center={mapCenter}>
        {/* Pin Lokasi Pembeli */}
        {userLocation && <UserMarker position={userLocation} />}

        {/* Pin Pedagang PKL yang Cocok dengan Filter */}
        {filteredVendors.map((vendor) => (
          <VendorMarker
            key={vendor.id}
            position={[vendor.latitude, vendor.longitude]}
            businessName={vendor.businessName}
            category={vendor.category}
            isPremium={vendor.isPremium}
            onClick={() => handleOpenVendorDetail(vendor)}
          />
        ))}
      </MapView>

      {/* 🔍 SEARCH BAR & FILTER KATEGORI */}
      <SearchBar
        query={searchQuery}
        onQueryChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        activeCount={filteredVendors.length}
        isListView={isListView}
        onToggleView={() => setIsListView((prev) => !prev)}
        onBack={() => router.push('/')}
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

      {/* 🛵 FLOATING STATUS BAR & CONTROLS (MIRIP TAMPILAN LIVE TRACKING GOJEK / GRAB) */}
      {!isListView && (
        <div className="absolute bottom-0 left-0 right-0 z-[1000] flex flex-col items-center pointer-events-none">
          {/* Baris Tombol Melayang di Atas Bottom Sheet */}
          <div className="w-full max-w-md px-4 mb-3 flex items-center justify-between pointer-events-auto">
            {/* Tombol Kembali Lingkaran (Kiri Bawah) */}
            <button
              onClick={() => router.push('/')}
              className="w-11 h-11 rounded-full bg-white text-slate-800 shadow-lg shadow-slate-900/10 border border-slate-200/80 flex items-center justify-center font-bold text-base hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
              title="Kembali ke Beranda"
              aria-label="Kembali"
            >
              ←
            </button>

            {/* Tombol Pusatkan ke Lokasiku (Kanan Bawah) */}
            <button
              onClick={handleRecenterUser}
              className="px-3.5 py-2.5 rounded-full bg-white text-slate-800 shadow-lg shadow-slate-900/10 border border-slate-200/80 flex items-center gap-1.5 font-bold text-xs hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
              title="Pusatkan ke Lokasiku"
            >
              <span>🎯</span>
              <span>Lokasiku</span>
            </button>
          </div>

          {/* Bottom Sheet PKL Terdekat (Hijau Bersih seperti Referensi) */}
          {nearestVendor && (
            <div
              onClick={() => {
                const match = filteredVendors.find(
                  (v) => v.businessName === nearestVendor.name
                );
                if (match) handleOpenVendorDetail(match);
              }}
              className="w-full max-w-md bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-4 rounded-t-3xl shadow-2xl cursor-pointer pointer-events-auto transition-colors flex items-center justify-between gap-3 animate-slide-up"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-emerald-500/80 border border-white/20 flex items-center justify-center text-xl shrink-0">
                  🍢
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-emerald-100 uppercase tracking-wider">
                      Gerobak Terdekat
                    </p>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-800/60 text-white font-semibold">
                      ~{nearestVendor.distanceText}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white truncate mt-0.5">
                    {nearestVendor.name}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-1 text-xs font-bold bg-white text-emerald-800 px-3 py-1.5 rounded-xl shadow-xs">
                <span>Menu</span>
                <span>→</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 📋 MODAL / DRAWER MENU & HARGA JAJANAN */}
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
