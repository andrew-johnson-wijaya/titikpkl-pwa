'use client';

import { useState } from 'react';

export interface MenuItemData {
  id: string;
  name: string;
  price: number;
  description?: string;
  isAvailable: boolean;
}

interface VendorMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorName: string;
  category: string;
  menuItems?: MenuItemData[];
  latitude?: number;
  longitude?: number;
}

const DEFAULT_SAMPLE_MENU: MenuItemData[] = [
  {
    id: '1',
    name: 'Sate Ayam Bumbu Kacang (10 Tusuk)',
    price: 20000,
    description: 'Daging ayam empuk disiram bumbu kacang gurih khas Madura.',
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Sate Kulit Ayam Renyah (5 Tusuk)',
    price: 12000,
    description: 'Kulit ayam pilihan dibakar dengan kecap manis bumbu rempah.',
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Lontong Daun Pisang',
    price: 4000,
    description: 'Lontong pulen dan wangi daun pisang.',
    isAvailable: true,
  },
  {
    id: '4',
    name: 'Es Teh Manis Segar',
    price: 5000,
    description: 'Teh melati seduh segar dengan gula tebu asli.',
    isAvailable: true,
  },
];

export function VendorMenuModal({
  isOpen,
  onClose,
  vendorName,
  category,
  menuItems = DEFAULT_SAMPLE_MENU,
  latitude = -6.2,
  longitude = 106.816666,
}: VendorMenuModalProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  if (!isOpen) return null;

  const handleUpdateQty = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const totalPrice = menuItems.reduce((acc, item) => {
    const qty = quantities[item.id] || 0;
    return acc + qty * item.price;
  }, 0);

  const selectedCount = Object.values(quantities).reduce((a, b) => a + b, 0);

  const handleOpenGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
      '_blank'
    );
  };

  const handleOrderWhatsApp = () => {
    let message = `Halo ${vendorName}! Saya mau jajan via TitikPKL:\n\n`;
    if (selectedCount > 0) {
      menuItems.forEach((item) => {
        const qty = quantities[item.id];
        if (qty && qty > 0) {
          message += `• ${item.name} (${qty}x) = Rp ${(qty * item.price).toLocaleString('id-ID')}\n`;
        }
      });
      message += `\nTotal: Rp ${totalPrice.toLocaleString('id-ID')}\n`;
      message += `Apakah porsinya masih tersedia?`;
    } else {
      message += `Apakah gerobakmu saat ini masih buka dan siap melayani pembeli?`;
    }

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl animate-slide-up border border-slate-100 overflow-hidden">
        {/* Mobile Pull Handle */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-amber-100 text-amber-800">
                {category || 'Kuliner PKL'}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Siaran Live
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">{vendorName}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Menu Items List */}
        <div className="p-5 overflow-y-auto flex flex-col gap-3 flex-1">
          <div className="flex justify-between items-center mb-0.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Daftar Menu &amp; Harga
            </h4>
            <span className="text-xs text-slate-400">{menuItems.length} menu</span>
          </div>

          {menuItems.map((item) => {
            const qty = quantities[item.id] || 0;
            return (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white transition-colors flex justify-between items-start gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        item.isAvailable
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {item.isAvailable ? 'Ada' : 'Habis'}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  <p className="mt-2 font-bold text-amber-600 text-sm">
                    Rp {item.price.toLocaleString('id-ID')}
                  </p>
                </div>

                {/* Counter / Quantity Selector */}
                {item.isAvailable ? (
                  <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-1 shadow-xs shrink-0 self-center">
                    <button
                      onClick={() => handleUpdateQty(item.id, -1)}
                      disabled={qty === 0}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center disabled:opacity-30 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold text-xs text-slate-900">
                      {qty}
                    </span>
                    <button
                      onClick={() => handleUpdateQty(item.id, 1)}
                      className="w-7 h-7 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm flex items-center justify-center cursor-pointer shadow-xs"
                    >
                      +
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}

          {/* Payment Info Card */}
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-center gap-3">
            <span className="text-2xl">💵</span>
            <div className="leading-snug">
              <p className="font-bold text-amber-900">100% Bebas Biaya Aplikasi</p>
              <p className="text-amber-800 text-[11px] mt-0.5">
                Bayar langsung ke pedagang di tempat memakai <strong>Tunai</strong> atau{' '}
                <strong>QRIS Pribadi</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/90 flex flex-col gap-2.5">
          {selectedCount > 0 && (
            <div className="flex justify-between items-center px-1 text-xs">
              <span className="text-slate-600 font-medium">
                Pilihan: <strong>{selectedCount} item</strong>
              </span>
              <span className="text-sm font-bold text-slate-900">
                Total: Rp {totalPrice.toLocaleString('id-ID')}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleOpenGoogleMaps}
              className="py-3 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>🧭</span>
              <span>Arah Peta</span>
            </button>
            <button
              onClick={handleOrderWhatsApp}
              className="py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/30"
            >
              <span>💬</span>
              <span>{selectedCount > 0 ? 'Pesan via WA' : 'Tanya via WA'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
