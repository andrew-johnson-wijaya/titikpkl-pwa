'use client';

import { formatDistance } from '@/app/lib/utils/distance';

export interface VendorListItem {
  id: string;
  businessName: string;
  category: string;
  isPremium: boolean;
  latitude: number;
  longitude: number;
  distanceMeters?: number;
}

interface VendorListViewProps {
  vendors: VendorListItem[];
  onSelectVendor: (vendor: VendorListItem) => void;
  onViewOnMap: (vendor: VendorListItem) => void;
  query: string;
}

export function VendorListView({
  vendors,
  onSelectVendor,
  onViewOnMap,
  query,
}: VendorListViewProps) {
  return (
    <div className="absolute inset-0 top-[110px] z-[900] bg-gray-100/95 backdrop-blur-md overflow-y-auto p-4 pb-20">
      <div className="max-w-[480px] mx-auto flex flex-col gap-3">
        <div className="flex justify-between items-center mb-1 px-1">
          <h2 className="text-sm font-bold text-gray-800">
            Daftar Pedagang PKL Aktif ({vendors.length})
          </h2>
          <span className="text-[11px] text-gray-500">
            Urut berdasarkan terdekat
          </span>
        </div>

        {vendors.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-sm mt-4">
            <span className="text-4xl block mb-2">🍢</span>
            <p className="font-bold text-gray-800 text-sm">
              Tidak ada PKL ditemukan
            </p>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              {query
                ? `Tidak ada pedagang yang cocok dengan kata kunci "${query}".`
                : 'Belum ada pedagang PKL yang sedang siaran aktif di sekitarmu.'}
            </p>
          </div>
        ) : (
          vendors.map((vendor) => (
            <div
              key={vendor.id}
              className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${
                vendor.isPremium
                  ? 'border-amber-300 ring-1 ring-amber-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      {vendor.category || 'Kuliner'}
                    </span>
                    {vendor.isPremium && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">
                        ✨ Rekomendasi
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-base">
                    {vendor.businessName}
                  </h3>
                </div>

                {vendor.distanceMeters !== undefined && (
                  <span className="px-2 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1 whitespace-nowrap">
                    <span>📍</span>
                    {formatDistance(vendor.distanceMeters)}
                  </span>
                )}
              </div>

              <p className="text-xs text-green-600 font-medium flex items-center gap-1 mb-3">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Sedang Buka &amp; Siaran Live
              </p>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => onViewOnMap(vendor)}
                  className="py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>🗺️</span> Peta
                </button>
                <button
                  onClick={() => onSelectVendor(vendor)}
                  className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                >
                  <span>📋</span> Menu &amp; Pesan
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
