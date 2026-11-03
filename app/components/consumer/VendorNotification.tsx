'use client';

interface VendorNotificationProps {
  visible: boolean;
  vendorName?: string;
  onClick?: () => void;
}

export function VendorNotification({
  visible,
  vendorName = 'Sate Ayam Cak Roni',
  onClick,
}: VendorNotificationProps) {
  if (!visible) return null;

  return (
    <div
      onClick={onClick}
      className="absolute top-20 left-1/2 -translate-x-1/2 w-[88%] max-w-[360px] bg-amber-50/95 backdrop-blur-sm border-l-4 border-amber-600 p-4 rounded-xl shadow-xl z-[1000] cursor-pointer hover:bg-amber-100/90 transition-all border border-amber-200"
    >
      <div className="flex justify-between items-start">
        <p className="m-0 mb-1 text-sm font-bold text-amber-800 flex items-center gap-1.5">
          <span>🔔</span> Terdeteksi di dekatmu!
        </p>
        <span className="text-[11px] font-bold text-amber-700 underline">
          Lihat Menu →
        </span>
      </div>
      <p className="m-0 text-xs text-amber-900 leading-relaxed">
        <strong>{vendorName}</strong> sedang aktif berdagang dalam radius 500m dari lokasimu.
      </p>
    </div>
  );
}
