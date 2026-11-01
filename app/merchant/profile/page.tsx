'use client';

import { useRouter } from 'next/navigation';

export default function MerchantProfilePage() {
  const router = useRouter();

  return (
    <div className="h-dvh bg-gray-50 p-5 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="m-0 text-gray-900 text-xl font-semibold">Profil Usaha</h2>
        <button
          onClick={() => router.back()}
          className="bg-transparent border-none text-2xl cursor-pointer hover:opacity-70 transition-opacity"
        >
          ✖
        </button>
      </div>

      {/* Business Card */}
      <div className="bg-white p-5 rounded-xl shadow-sm mb-5">
        <h3 className="m-0 mb-1 text-lg font-semibold">Sate Ayam Cak Roni</h3>
        <p className="m-0 mb-4 text-gray-500 text-sm">#PKL-0921 • Bergabung sejak 2026</p>

        {/* Unfair Advantage Badge */}
        <div className="bg-emerald-50 border border-emerald-500 p-4 rounded-lg">
          <p className="m-0 mb-1 font-bold text-emerald-700">
            ✨ 100% Keuntungan Milikmu!
          </p>
          <p className="m-0 text-[13px] text-emerald-900 leading-relaxed">
            TitikPKL tidak memotong komisi aplikasi sepeser pun. Terima pembayaran
            langsung dari pembeli menggunakan <strong>Uang Tunai</strong> atau{' '}
            <strong>QRIS Pribadi</strong>.
          </p>
        </div>
      </div>

      {/* Action Buttons (pushed to bottom) */}
      <div className="flex flex-col gap-4 mt-auto mb-5">
        <button className="p-4 rounded-lg bg-white text-gray-700 border border-gray-300 cursor-pointer font-bold hover:bg-gray-50 transition-colors">
          💬 Berikan Feedback Aplikasi
        </button>
        <button className="p-4 rounded-lg bg-red-50 text-red-600 border border-red-300 cursor-pointer font-bold hover:bg-red-100 transition-colors">
          🗑️ Delete my Account (Hapus Akun)
        </button>
      </div>
    </div>
  );
}
