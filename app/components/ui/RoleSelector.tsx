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
    <div className="h-dvh flex flex-col items-center justify-center bg-gray-100 px-5">
      <h1 className="text-3xl font-bold text-amber-600 mb-2">TitikPKL</h1>
      <p className="text-gray-600 mb-8 text-center text-sm max-w-sm">
        Temukan Jajanan Langgananmu atau Mulai Berdagang Hari Ini.
      </p>

      {/* User is authenticated */}
      {!loading && user && profile ? (
        <div className="w-full max-w-[350px] bg-white p-5 rounded-2xl shadow-md border border-gray-200 text-center flex flex-col gap-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
            Sedang Masuk Sebagai
          </p>
          <p className="text-lg font-bold text-gray-900">{profile.name}</p>
          <span className="inline-block mx-auto px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            {profile.role === 'MERCHANT' ? '🛒 Pedagang PKL' : '👋 Pembeli'}
          </span>

          <div className="flex flex-col gap-2.5 mt-3">
            <button
              onClick={() => onSelectRole(profile.role)}
              className="p-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm cursor-pointer transition-colors shadow-sm"
            >
              Buka Halaman {profile.role === 'MERCHANT' ? 'Pedagang' : 'Peta Jajanan'} →
            </button>
            <button
              onClick={() => signOut()}
              className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs cursor-pointer transition-colors"
            >
              Keluar (Logout)
            </button>
          </div>
        </div>
      ) : (
        /* Not logged in */
        <div className="w-full max-w-[350px] flex flex-col gap-4">
          <button
            onClick={() => onSelectRole('CONSUMER')}
            className="p-4 rounded-xl bg-gray-900 text-white font-bold text-base cursor-pointer hover:bg-gray-800 transition-colors shadow-sm"
          >
            👋 Masuk sebagai Pembeli
          </button>
          <button
            onClick={() => onSelectRole('MERCHANT')}
            className="p-4 rounded-xl bg-green-600 text-white font-bold text-base cursor-pointer hover:bg-green-700 transition-colors shadow-sm"
          >
            🛒 Masuk sebagai Pedagang
          </button>

          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-600">
            <Link
              href="/auth/login"
              className="text-amber-600 font-bold hover:underline"
            >
              🔐 Masuk Akun
            </Link>
            <span>•</span>
            <Link
              href="/auth/register"
              className="text-gray-700 hover:text-amber-600 font-medium"
            >
              ✨ Buat Akun Baru
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
