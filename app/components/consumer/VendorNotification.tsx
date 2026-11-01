interface VendorNotificationProps {
  visible: boolean;
}

export function VendorNotification({ visible }: VendorNotificationProps) {
  if (!visible) return null;

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[85%] max-w-[350px] bg-amber-50 border-l-4 border-amber-600 p-4 rounded-lg shadow-xl z-[1000]">
      <p className="m-0 mb-1 text-sm font-bold text-amber-700">
        🔔 Terdeteksi di dekatmu!
      </p>
      <p className="m-0 text-xs text-amber-900">
        Sate Ayam Cak Roni menggunakan fitur Premium Broadcast dan berada dalam
        radius 500m dari lokasimu.
      </p>
    </div>
  );
}
