'use client';

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
  if (!isOpen) return null;

  const handleOpenGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
      '_blank'
    );
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-start">
          <div>
            <span className="inline-block px-2 py-0.5 text-[11px] font-bold rounded bg-amber-100 text-amber-800 mb-1">
              {category || 'Kuliner PKL'}
            </span>
            <h3 className="text-xl font-bold text-gray-900">{vendorName}</h3>
            <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-0.5">
              <span>🟢</span> Sedang Berjualan di Sekitarmu
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Menu Items List */}
        <div className="p-5 overflow-y-auto flex flex-col gap-3.5 flex-1">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-sm font-bold text-gray-800">
              📋 Menu Jajanan & Harga
            </h4>
            <span className="text-xs text-gray-500">{menuItems.length} menu</span>
          </div>

          {menuItems.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 flex justify-between items-start"
            >
              <div className="flex-1 pr-3">
                <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                {item.description && (
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                    {item.description}
                  </p>
                )}
                <span className="inline-block mt-2 font-bold text-amber-700 text-sm">
                  Rp {item.price.toLocaleString('id-ID')}
                </span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${
                  item.isAvailable
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {item.isAvailable ? 'Tersedia' : 'Habis'}
              </span>
            </div>
          ))}

          {/* Info Bayar */}
          <div className="mt-2 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <span className="text-lg">💵</span>
            <p className="m-0 leading-relaxed">
              Menerima pembayaran langsung: <strong>Uang Tunai</strong> &amp;{' '}
              <strong>QRIS Pribadi</strong> (0% biaya admin).
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={handleOpenGoogleMaps}
            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            <span>🧭</span> Petunjuk Arah ke Gerobak
          </button>
        </div>
      </div>
    </div>
  );
}
