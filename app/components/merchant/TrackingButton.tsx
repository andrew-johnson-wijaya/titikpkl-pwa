'use client';

interface TrackingButtonProps {
  isTracking: boolean;
  onToggle: () => void;
}

export function TrackingButton({ isTracking, onToggle }: TrackingButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`w-full p-4 rounded-xl text-white font-bold text-base cursor-pointer transition-colors ${
        isTracking
          ? 'bg-red-600 hover:bg-red-700'
          : 'bg-green-600 hover:bg-green-700'
      }`}
    >
      {isTracking ? 'Tutup Dagangan (Keluar)' : 'Mulai Berdagang (Masuk)'}
    </button>
  );
}
