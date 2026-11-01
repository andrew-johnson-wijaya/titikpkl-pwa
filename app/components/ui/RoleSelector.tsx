'use client';

type UserRole = 'CONSUMER' | 'MERCHANT';

interface RoleSelectorProps {
  onSelectRole: (role: UserRole) => void;
}

export function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  return (
    <div className="h-dvh flex flex-col items-center justify-center bg-gray-100 px-5">
      <h1 className="text-3xl font-bold text-amber-600 mb-2">TitikPKL</h1>
      <p className="text-gray-600 mb-10 text-center">
        Temukan Jajanan Langgananmu atau Mulai Berdagang Hari Ini.
      </p>
      <div className="w-full max-w-[350px] flex flex-col gap-4">
        <button
          onClick={() => onSelectRole('CONSUMER')}
          className="p-4 rounded-xl bg-gray-900 text-white font-bold text-base cursor-pointer hover:bg-gray-800 transition-colors"
        >
          👋 Masuk sebagai Pembeli
        </button>
        <button
          onClick={() => onSelectRole('MERCHANT')}
          className="p-4 rounded-xl bg-green-600 text-white font-bold text-base cursor-pointer hover:bg-green-700 transition-colors"
        >
          🛒 Masuk sebagai Pedagang
        </button>
      </div>
    </div>
  );
}
