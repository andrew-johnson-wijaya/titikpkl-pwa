'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
}

const INITIAL_MENU: MenuItem[] = [
  { id: '1', name: 'Sate Ayam Bumbu Kacang (10 Tusuk)', price: 20000, isAvailable: true },
  { id: '2', name: 'Sate Kulit Ayam Renyah (5 Tusuk)', price: 12000, isAvailable: true },
  { id: '3', name: 'Lontong Daun Pisang', price: 4000, isAvailable: true },
  { id: '4', name: 'Es Teh Manis Segar', price: 5000, isAvailable: true },
];

export default function MerchantProfilePage() {
  const router = useRouter();
  const { user, merchant, signOut } = useAuth();

  const [menuList, setMenuList] = useState<MenuItem[]>(INITIAL_MENU);
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  const [feedbackSent, setFeedbackSent] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const businessName = merchant?.business_name || 'Sate Ayam Cak Roni';
  const businessCode = merchant?.business_code || 'PKL-0921';
  const joinYear = merchant?.created_at
    ? new Date(merchant.created_at).getFullYear()
    : '2026';

  const handleToggleAvailability = (id: string) => {
    setMenuList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const handleAddMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemPrice) return;
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      price: parseInt(newItemPrice, 10) || 0,
      isAvailable: true,
    };
    setMenuList((prev) => [...prev, newItem]);
    setNewItemName('');
    setNewItemPrice('');
    setShowAddMenuModal(false);
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setShowFeedbackModal(false);
      setFeedbackSent(false);
      setFeedbackText('');
    }, 1500);
  };

  return (
    <div className="min-h-dvh bg-gray-50 p-5 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="m-0 text-gray-900 text-xl font-bold">Profil Usaha PKL</h2>
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer transition-colors shadow-sm"
        >
          ✕
        </button>
      </div>

      {/* Business Card */}
      <div className="bg-white p-5 rounded-2xl shadow-sm mb-5 border border-gray-100">
        <div className="flex justify-between items-start mb-1">
          <div>
            <h3 className="m-0 text-lg font-bold text-gray-900">{businessName}</h3>
            <p className="m-0 text-gray-500 text-sm">
              #{businessCode} • Bergabung sejak {joinYear}
            </p>
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
            Aktif
          </span>
        </div>

        {user?.email && (
          <p className="mt-2 text-xs text-gray-400">Akun: {user.email}</p>
        )}

        {/* Unfair Advantage Badge */}
        <div className="mt-4 bg-emerald-50 border border-emerald-500 p-4 rounded-xl">
          <p className="m-0 mb-1 font-bold text-emerald-700 text-sm">
            ✨ 100% Keuntungan Milikmu!
          </p>
          <p className="m-0 text-[13px] text-emerald-900 leading-relaxed">
            TitikPKL tidak memotong komisi aplikasi sepeser pun. Terima pembayaran
            langsung dari pembeli menggunakan <strong>Uang Tunai</strong> atau{' '}
            <strong>QRIS Pribadi</strong>.
          </p>
        </div>
      </div>

      {/* Section: Menu Jajanan Dagangan */}
      <div className="bg-white p-5 rounded-2xl shadow-sm mb-5 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="text-base font-bold text-gray-900">
              📋 Menu Dagangan
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Menu yang dapat dilihat oleh calon pembeli di sekitarmu
            </p>
          </div>
          <button
            onClick={() => setShowAddMenuModal(true)}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            + Tambah Menu
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {menuList.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                <p className="font-bold text-amber-700 text-xs mt-0.5">
                  Rp {item.price.toLocaleString('id-ID')}
                </p>
              </div>
              <button
                onClick={() => handleToggleAvailability(item.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer border ${
                  item.isAvailable
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200'
                    : 'bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300'
                }`}
              >
                {item.isAvailable ? '✓ Tersedia' : '✕ Habis'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Not Logged In Notice */}
      {!user && (
        <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex justify-between items-center">
          <div>
            <p className="font-bold">Mode Tamu / Demo</p>
            <p className="mt-0.5">Daftar akun untuk menyimpan toko dan lokasimu secara permanen.</p>
          </div>
          <Link
            href="/auth/register"
            className="ml-3 px-3 py-1.5 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 whitespace-nowrap transition-colors"
          >
            Daftar
          </Link>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 mt-auto mb-5">
        <button
          onClick={() => setShowFeedbackModal(true)}
          className="p-4 rounded-xl bg-white text-gray-700 border border-gray-300 cursor-pointer font-bold hover:bg-gray-50 transition-colors shadow-sm text-sm"
        >
          💬 Berikan Feedback Aplikasi
        </button>

        {user && (
          <button
            onClick={() => signOut()}
            className="p-3.5 rounded-xl bg-gray-200 text-gray-800 cursor-pointer font-semibold hover:bg-gray-300 transition-colors text-sm"
          >
            🚪 Keluar Akun (Logout)
          </button>
        )}

        <button
          onClick={() => setShowDeleteModal(true)}
          className="p-4 rounded-xl bg-red-50 text-red-600 border border-red-200 cursor-pointer font-bold hover:bg-red-100 transition-colors text-sm"
        >
          🗑️ Delete my Account (Hapus Akun)
        </button>
      </div>

      {/* Add Menu Item Modal */}
      {showAddMenuModal && (
        <div className="fixed inset-0 z-[2000] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              Tambah Menu Baru
            </h3>
            <form onSubmit={handleAddMenuItem} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nama Menu Jajanan
                </label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="cth: Bakso Telur Spesial"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Harga (Rp)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="500"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  placeholder="cth: 15000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMenuModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-600 rounded-lg hover:bg-amber-700"
                >
                  Simpan Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-[2000] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-base font-bold text-gray-900 mb-2">
              Kirim Feedback
            </h3>
            {feedbackSent ? (
              <p className="text-sm text-green-600 py-4 font-semibold text-center">
                ✅ Terima kasih! Feedback kamu sangat berharga.
              </p>
            ) : (
              <form onSubmit={handleSendFeedback} className="flex flex-col gap-3">
                <textarea
                  required
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Tulis saran atau kendala yang kamu temukan..."
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-amber-600 rounded-lg hover:bg-amber-700"
                  >
                    Kirim
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[2000] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <div className="text-3xl mb-2">⚠️</div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              Konfirmasi Hapus Akun
            </h3>
            <p className="text-xs text-gray-600 mb-5 leading-relaxed">
              Tindakan ini akan menghapus data usaha dan riwayat siaran lokasimu secara permanen.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  if (user) signOut();
                  else router.push('/');
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Ya, Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
