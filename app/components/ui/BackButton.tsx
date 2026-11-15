'use client';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

export function BackButton({ onClick, label = 'Beranda' }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Kembali ke Beranda"
      className="absolute top-4 left-4 z-[1000] h-10 px-3.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 text-slate-800 font-bold shadow-lg hover:bg-white active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 text-xs"
    >
      <span className="text-base font-bold leading-none">←</span>
      {label && <span className="font-semibold">{label}</span>}
    </button>
  );
}
