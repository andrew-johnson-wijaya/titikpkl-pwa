'use client';

import { PremiumBroadcast } from './PremiumBroadcast';
import { TrackingButton } from './TrackingButton';

interface MerchantPanelProps {
  businessName?: string;
  businessCode?: string;
  isTracking: boolean;
  isPremiumActive: boolean;
  lastUpdated: string;
  onToggleTracking: () => void;
  onTogglePremium: (active: boolean) => void;
  onOpenProfile: () => void;
}

export function MerchantPanel({
  businessName = 'Sate Ayam Cak Roni',
  businessCode = 'PKL-0921',
  isTracking,
  isPremiumActive,
  lastUpdated,
  onToggleTracking,
  onTogglePremium,
  onOpenProfile,
}: MerchantPanelProps) {
  return (
    <div className="absolute bottom-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-3xl shadow-2xl shadow-slate-900/15 z-[1000] border border-slate-200/90 animate-slide-up">
      {/* Top Handle */}
      <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-3"></div>

      {/* Header Info */}
      <div className="flex justify-between items-center mb-3">
        <div className="min-w-0 pr-2">
          <div className="flex items-center gap-2 mb-0.5">
            <h2 className="text-lg font-bold text-slate-900 truncate">{businessName}</h2>
            <span className="px-2 py-0.2 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 shrink-0">
              #{businessCode}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {isTracking ? (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Siaran Aktif • {lastUpdated || 'Baru saja'}
              </span>
            ) : (
              <span className="text-slate-400">Siaran non-aktif (Lapak tutup)</span>
            )}
          </p>
        </div>

        <button
          onClick={onOpenProfile}
          className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs"
        >
          <span>📋</span>
          <span>Menu &amp; Profil</span>
        </button>
      </div>

      {/* Premium Broadcast Switch */}
      <PremiumBroadcast isActive={isPremiumActive} onToggle={onTogglePremium} />

      {/* Main Big Tracking Action Button */}
      <TrackingButton isTracking={isTracking} onToggle={onToggleTracking} />
    </div>
  );
}
