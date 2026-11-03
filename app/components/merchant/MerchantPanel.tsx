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
    <div className="absolute bottom-5 left-[5%] right-[5%] bg-white p-5 rounded-2xl shadow-2xl z-[1000] border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-left">
          <h2 className="m-0 mb-1 text-xl font-bold text-gray-900">{businessName}</h2>
          <p className="m-0 text-sm text-gray-500">ID: #{businessCode}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onOpenProfile}
            className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer font-bold text-amber-800 hover:bg-amber-100 transition-colors text-xs flex items-center gap-1 shadow-sm"
          >
            📋 Menu
          </button>
          <button
            onClick={onOpenProfile}
            className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-xl cursor-pointer font-bold text-gray-700 hover:bg-gray-200 transition-colors text-xs flex items-center gap-1 shadow-sm"
          >
            ⚙️ Profil
          </button>
        </div>
      </div>

      {/* Premium Broadcast */}
      <PremiumBroadcast isActive={isPremiumActive} onToggle={onTogglePremium} />

      {/* Tracking Status */}
      {isTracking && (
        <div className="text-center mb-4">
          <p className="m-0 text-[13px] text-green-600 font-medium">
            🟢 Mengudara • {lastUpdated}
          </p>
        </div>
      )}

      {/* Tracking Button */}
      <TrackingButton isTracking={isTracking} onToggle={onToggleTracking} />
    </div>
  );
}
