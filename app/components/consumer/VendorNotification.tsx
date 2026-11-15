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
    <div className="absolute top-[88px] left-1/2 -translate-x-1/2 w-[94%] max-w-[460px] bg-slate-950/90 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl z-[1000] border border-white/15 animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-lg shrink-0">
          🔔
        </div>

        <div
          onClick={onClick}
          className="flex-1 cursor-pointer hover:opacity-90 transition-opacity min-w-0"
        >
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              PKL Terdekat Aktif
            </p>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-semibold">
              ~{distanceText}
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-100 truncate mt-0.5">
            {vendorName}
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onClick}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            Menu
          </button>
          {onDismiss && (
            <button
              onClick={onDismiss}
              aria-label="Tutup notifikasi"
              className="w-7 h-7 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
