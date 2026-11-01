'use client';

interface PremiumBroadcastProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
}

export function PremiumBroadcast({ isActive, onToggle }: PremiumBroadcastProps) {
  return (
    <div className="flex justify-between items-center mb-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
      <div>
        <p className="m-0 text-sm font-bold text-amber-600">📡 Premium Broadcast</p>
        <p className="m-0 text-[11px] text-amber-700">Beritahu pembeli di radius 1km</p>
      </div>
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => onToggle(e.target.checked)}
          className="w-[22px] h-[22px] accent-amber-600"
        />
      </label>
    </div>
  );
}
