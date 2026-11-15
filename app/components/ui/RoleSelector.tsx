'use client';

import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';

type UserRole = 'CONSUMER' | 'MERCHANT';

interface RoleSelectorProps {
  onSelectRole: (role: UserRole) => void;
}

export function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  const { user, profile, loading, signOut } = useAuth();

  return (
    <div className="min-h-dvh flex flex-col justify-between bg-gradient-to-b from-amber-500/15 via-slate-50 to-white px-5 py-8 max-w-md mx-auto">
      {/* Top Branding Section */}
      <div className="text-center pt-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white text-3xl shadow-lg shadow-amber-500/30 mb-4 animate-fade-in">
          🍢
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">
          Titik<span className="text-amber-600">PKL</span>
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed max-w-xs mx-auto">
          Temukan jajanan kaki lima langgananmu secara live, atau siarkan gerobakmu ke pembeli sekitar.
        </p>

        {/* Value Props Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white border border-slate-200 text-slate-700 shadow-xs">
            📍 GPS Live
          </span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-xs">
            ✨ 0% Komisi
          </span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white border border-slate-200 text-slate-700 shadow-xs">
            💵 Tunai &amp; QRIS
          </span>
        </div>
      </div>

      {/* Main Action Cards */}
      <div className="my-6 flex flex-col gap-3.5">
        {!loading && user && profile ? (
          /* User is authenticated */
          <div className="bg-white p-5 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 text-center animate-slide-up">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 mb-2">
              Akun Terhubung
            </span>
            <p className="text-xl font-bold text-slate-900">{profile.name}</p>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Peran:{' '}
              <strong className="text-slate-800">
                {profile.role === 'MERCHANT' ? '🛒 Pedagang PKL' : '👋 Pembeli'}
              </strong>
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => onSelectRole(profile.role)}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm cursor-pointer transition-all shadow-md shadow-amber-600/25 flex items-center justify-center gap-2"
              >
                <span>Buka Dashboard {profile.role === 'MERCHANT' ? 'Pedagang' : 'Peta Jajanan'}</span>
                <span>→</span>
              </button>
              <button
                onClick={() => signOut()}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer transition-colors"
              >
                Keluar (Logout)
              </button>
            </div>
          </div>
        ) : (
          /* Guest Selection Cards */
          <>
            {/* Card 1: Pembeli */}
            <div
              onClick={() => onSelectRole('CONSUMER')}
              className="group bg-white p-4.5 rounded-2xl shadow-md hover:shadow-xl border-2 border-slate-200 hover:border-amber-500 transition-all cursor-pointer flex items-center gap-4 text-left active:scale-[0.99]"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-100/80 text-amber-800 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                🛵
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-600 transition-colors">
                    Saya Mau Jajan
                  </h3>
                  <span className="text-amber-600 font-bold text-sm">→</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  Cari gerobak sate, bakso, &amp; gorengan terdekat secara live di peta.
                </p>
              </div>
            </div>

            {/* Card 2: Pedagang */}
            <div
              onClick={() => onSelectRole('MERCHANT')}
              className="group bg-white p-4.5 rounded-2xl shadow-md hover:shadow-xl border-2 border-slate-200 hover:border-emerald-500 transition-all cursor-pointer flex items-center gap-4 text-left active:scale-[0.99]"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                🍢
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-600 transition-colors">
                      Saya Pedagang PKL
                    </h3>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Gratis
                    </span>
                  </div>
                  <span className="text-emerald-600 font-bold text-sm">→</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-snug">
                  Nyalakan GPS siaran gerobakmu dan dapatkan pembeli di sekitarmu.
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Auth & Info Links */}
      <div className="text-center pt-2 border-t border-slate-200/80">
        {!user && (
          <div className="flex items-center justify-center gap-3 text-xs text-slate-600 mb-3">
            <Link
              href="/auth/login"
              className="font-bold text-amber-600 hover:text-amber-700 transition-colors"
            >
              Masuk ke Akun
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/auth/register"
              className="font-bold text-slate-700 hover:text-slate-900 transition-colors"
            >
              Daftar Akun Baru
            </Link>
          </div>
        )}
        <p className="text-[11px] text-slate-400">
          TitikPKL • Platform Komunitas Pedagang Kaki Lima Indonesia
        </p>
      </div>
    </div>
  );
}
