'use client';

interface VendorNotificationProps {
  visible: boolean;
  vendorName?: string;
  distanceText?: string;
  onClick?: () => void;
  onDismiss?: () => void;
}

export function VendorNotification({
  visible,
  vendorName = 'Sate Ayam Cak Roni',
  distanceText = '500m',
  onClick,
  onDismiss,
}: VendorNotificationProps) {
  if (!visible) return null;

  return (
    <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[92%] max-w-[420px] bg-amber-50/95 backdrop-blur-sm border-l-4 border-amber-600 p-3.5 rounded-2xl shadow-xl z-[1000] border border-amber-200">
      <div className="flex justify-between items-start mb-1">
        <div
          onClick={onClick}
          className="flex-1 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <p className="m-0 text-xs font-bold text-amber-800 flex items-center gap-1.5">
            <span>🔔</span> PKL Terdekat Terdeteksi!
          </p>
          <p className="m-0 mt-0.5 text-xs text-amber-950 leading-snug">
            <strong>{vendorName}</strong> sedang aktif berdagang (~
            {distanceText} dari lokasimu).
          </p>
        </div>

        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={onClick}
            className="text-[11px] font-bold text-amber-700 underline whitespace-nowrap cursor-pointer hover:text-amber-900"
          >
            Menu →
          </button>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-600 text-xs p-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
