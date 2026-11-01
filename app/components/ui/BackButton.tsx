'use client';

interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute top-5 left-5 z-[1000] px-4 py-2.5 rounded-lg bg-white border border-gray-300 cursor-pointer font-bold shadow-md hover:bg-gray-50 transition-colors"
    >
      ← Keluar
    </button>
  );
}
