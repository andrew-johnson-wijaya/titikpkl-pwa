'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/app/lib/supabase/client';
import type { UserRole } from '@/app/lib/supabase/types';

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('CONSUMER');
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('Kuliner');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            business_name: role === 'MERCHANT' ? businessName : undefined,
            category: role === 'MERCHANT' ? category : undefined,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (data.session) {
        // Langsung aktif login
        if (role === 'MERCHANT') {
          router.push('/merchant');
        } else {
          router.push('/consumer');
        }
        router.refresh();
      } else {
        // Butuh konfirmasi email (default Supabase)
        setSuccessMessage(
          'Pendaftaran berhasil! Silakan periksa inbox email kamu untuk memverifikasi akun sebelum masuk.'
        );
      }
    } catch {
      setErrorMessage('Terjadi kesalahan saat pendaftaran. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col justify-center items-center bg-gray-100 py-10 px-5">
      <div className="w-full max-w-[420px] bg-white p-7 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-amber-600 mb-1">TitikPKL</h1>
          </Link>
          <p className="text-sm text-gray-500">Mulai bergabung ke ekosistem PKL</p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs leading-relaxed">
            {successMessage}
            <div className="mt-3">
              <Link
                href="/auth/login"
                className="font-bold underline text-emerald-800"
              >
                Ke Halaman Masuk →
              </Link>
            </div>
          </div>
        )}

        {!successMessage && (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            {/* Pilihan Role */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Daftar Sebagai
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('CONSUMER')}
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    role === 'CONSUMER'
                      ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  👋 Pembeli
                </button>
                <button
                  type="button"
                  onClick={() => setRole('MERCHANT')}
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    role === 'MERCHANT'
                      ? 'bg-green-600 text-white border-green-600 shadow-sm'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  🛒 Pedagang PKL
                </button>
              </div>
            </div>

            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth: Roni Gunawan"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Field Khusus Merchant */}
            {role === 'MERCHANT' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nama Usaha / Gerobak
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="cth: Sate Madura Cak Roni"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Kategori Makanan / Minuman
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="Sate">Sate</option>
                    <option value="Bakso & Mie">Bakso & Mie</option>
                    <option value="Nasi Goreng">Nasi Goreng</option>
                    <option value="Gorengan">Gorengan</option>
                    <option value="Minuman & Kopi">Minuman & Kopi</option>
                    <option value="Jajanan Tradisional">Jajanan Tradisional</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Alamat Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Kata Sandi (min. 6 karakter)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-2 py-3 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-50 ${
                role === 'MERCHANT'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-gray-600">
          Sudah punya akun?{' '}
          <Link
            href="/auth/login"
            className="text-amber-600 font-bold hover:underline"
          >
            Masuk di sini
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
