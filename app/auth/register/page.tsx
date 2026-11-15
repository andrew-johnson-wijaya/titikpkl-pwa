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
    <div className="min-h-dvh flex flex-col justify-center items-center bg-gradient-to-b from-amber-500/10 via-slate-50 to-white py-10 px-5">
      <div className="w-full max-w-[420px] bg-white p-7 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/90 animate-slide-up">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/15 text-2xl mb-2">
            🍢
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Daftar <span className="text-amber-600">TitikPKL</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Bergabung ke ekosistem pedagang kaki lima modern
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs leading-relaxed">
            <p className="font-bold text-sm mb-1 text-emerald-900">🎉 Berhasil Mendaftar!</p>
            {successMessage}
            <div className="mt-3">
              <Link
                href="/auth/login"
                className="inline-block py-2 px-3 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
              >
                Masuk ke Akun Sekarang →
              </Link>
            </div>
          </div>
        )}

        {!successMessage && (
          <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
            {/* Pilihan Role */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Daftar Sebagai
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('CONSUMER')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    role === 'CONSUMER'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white'
                  }`}
                >
                  <span>🛵</span>
                  <span>Pembeli</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('MERCHANT')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    role === 'MERCHANT'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/25'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white'
                  }`}
                >
                  <span>🍢</span>
                  <span>Pedagang PKL</span>
                </button>
              </div>
            </div>

            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth: Roni Gunawan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Field Khusus Merchant */}
            {role === 'MERCHANT' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Usaha / Gerobak
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="cth: Sate Madura Cak Roni"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/40 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Makanan / Minuman
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-900"
                  >
                    <option value="Sate">Sate</option>
                    <option value="Bakso & Mie">Bakso &amp; Mie</option>
                    <option value="Nasi Goreng">Nasi Goreng</option>
                    <option value="Gorengan">Gorengan</option>
                    <option value="Minuman & Kopi">Minuman &amp; Kopi</option>
                    <option value="Jajanan Tradisional">Jajanan Tradisional</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Alamat Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kata Sandi (min. 6 karakter)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-2 py-3.5 text-white font-bold rounded-xl text-sm transition-all cursor-pointer shadow-md disabled:opacity-50 active:scale-[0.99] ${
                role === 'MERCHANT'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                  : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30'
              }`}
            >
              {loading ? 'Mendaftarkan Akun...' : 'Daftar Sekarang'}
            </button>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-600">
          Sudah punya akun?{' '}
          <Link
            href="/auth/login"
            className="text-amber-600 font-bold hover:underline"
          >
            Masuk di sini
          </Link>
        </div>

        <div className="mt-3 text-center">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
