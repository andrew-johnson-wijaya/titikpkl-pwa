'use client';

import { PremiumBroadcast } from './PremiumBroadcast';
import { TrackingButton } from './TrackingButton';

interface MerchantPanelProps {
  isTracking: boolean;
  isPremiumActive: boolean;
  lastUpdated: string;
  onToggleTracking: () => void;
  onTogglePremium: (active: boolean) => void;
  onOpenProfile: () => void;
}

export function MerchantPanel({
  isTracking,
  isPremiumActive,
  lastUpdated,
  onToggleTracking,
  onTogglePremium,
  onOpenProfile,
}: MerchantPanelProps) {
  return (
    <div className="absolute bottom-5 left-[5%] right-[5%] bg-white p-5 rounded-2xl shadow-2xl z-[1000]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-left">
          <h2 className="m-0 mb-1 text-xl text-gray-900">Sate Ayam Cak Roni</h2>
          <p className="m-0 text-sm text-gray-500">ID: #PKL-0921</p>
        </div>
        <button
          onClick={onOpenProfile}
          className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer font-bold text-gray-700 hover:bg-gray-200 transition-colors"
        >
          ⚙️ Profil
        </button>
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
