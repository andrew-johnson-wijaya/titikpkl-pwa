'use client';

interface PremiumBroadcastProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
}

export function PremiumBroadcast({ isActive, onToggle }: PremiumBroadcastProps) {
  return (
    <div className="flex justify-between items-center p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/80 mb-3.5">
      <div className="pr-2">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-amber-700 font-bold text-xs sm:text-sm">
            ✨ Premium Broadcast
          </span>
          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500 text-white">
            Radius 1km
          </span>
        </div>
        <p className="text-[11px] text-amber-900 leading-snug">
          Prioritaskan gerobakmu di urutan teratas pembeli sekitar
        </p>
      </div>

      {/* Modern iOS-style toggle switch */}
      <button
        type="button"
        role="switch"
        aria-checked={isActive}
        onClick={() => onToggle(!isActive)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          isActive ? 'bg-amber-600' : 'bg-slate-300'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
            isActive ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
