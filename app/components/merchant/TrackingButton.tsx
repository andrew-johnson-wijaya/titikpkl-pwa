'use client';

interface TrackingButtonProps {
  isTracking: boolean;
  onToggle: () => void;
}

export function TrackingButton({ isTracking, onToggle }: TrackingButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`w-full py-4 px-5 rounded-2xl text-white font-bold text-sm sm:text-base cursor-pointer transition-all active:scale-[0.99] flex items-center justify-center gap-2.5 ${
        isTracking
          ? 'bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/30'
          : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/30'
      }`}
    >
      <span className="text-lg">{isTracking ? '⏹️' : '📡'}</span>
      <span>
        {isTracking ? 'Tutup Siaran Dagangan (Offline)' : 'Mulai Berdagang (Siarkan Lokasi)'}
      </span>
    </button>
  );
}
