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

function getCategoryEmoji(category = ''): string {
  const cat = category.toLowerCase();
  if (cat.includes('sate')) return '🍢';
  if (cat.includes('bakso') || cat.includes('mie')) return '🍜';
  if (cat.includes('nasi')) return '🍛';
  if (cat.includes('goreng')) return '🥟';
  if (cat.includes('minum') || cat.includes('kopi') || cat.includes('es')) return '🧋';
  return '🛒';
}

export function VendorListView({
  vendors,
  onSelectVendor,
  onViewOnMap,
  query,
}: VendorListViewProps) {
  return (
    <div className="absolute inset-0 top-[110px] z-[900] bg-slate-900/10 backdrop-blur-md overflow-y-auto p-4 pb-24 animate-fade-in">
      <div className="max-w-[480px] mx-auto flex flex-col gap-3">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-white/80 px-2.5 py-1 rounded-lg backdrop-blur-xs">
            Gerobak Terdekat ({vendors.length})
          </h2>
          <span className="text-[11px] font-medium text-slate-600 bg-white/80 px-2.5 py-1 rounded-lg backdrop-blur-xs">
            Urut dari terdekat
          </span>
        </div>

        {vendors.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-sm mt-3 animate-slide-up">
            <span className="text-4xl block mb-2">🍢</span>
            <p className="font-bold text-slate-800 text-sm">
              Tidak Ada Pedagang yang Cocok
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
              {query
                ? `Tidak ada lapak PKL yang sesuai kata kunci "${query}". Coba cari kata kunci lain.`
                : 'Belum ada pedagang PKL yang menyalakan siaran live di sekitarmu saat ini.'}
            </p>
          </div>
        ) : (
          vendors.map((vendor) => {
            const emoji = getCategoryEmoji(vendor.category);
            return (
              <div
                key={vendor.id}
                className={`bg-white rounded-2xl p-4 shadow-md transition-all border animate-slide-up ${
                  vendor.isPremium
                    ? 'border-amber-300 ring-1 ring-amber-300/50 shadow-amber-500/5'
                    : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  {/* Category Emoji Avatar */}
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-2xl shrink-0">
                    {emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="px-2 py-0.2 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                        {vendor.category || 'Kuliner'}
                      </span>
                      {vendor.isPremium && (
                        <span className="px-1.5 py-0.2 rounded-md text-[10px] font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                          ✨ Rekomendasi
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-base truncate">
                      {vendor.businessName}
                    </h3>
                    <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Sedang Aktif Siaran
                    </p>
                  </div>

                  {vendor.distanceMeters !== undefined && (
                    <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1 shrink-0">
                      <span>📍</span>
                      {formatDistance(vendor.distanceMeters)}
                    </span>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-100">
                  <button
                    onClick={() => onViewOnMap(vendor)}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>🗺️</span>
                    <span>Lihat di Peta</span>
                  </button>
                  <button
                    onClick={() => onSelectVendor(vendor)}
                    className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm shadow-amber-600/30"
                  >
                    <span>📋</span>
                    <span>Menu &amp; Pesan</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
