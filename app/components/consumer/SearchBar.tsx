'use client';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  activeCount: number;
  isListView: boolean;
  onToggleView: () => void;
  onBack?: () => void;
}

const CATEGORIES = [
  'Semua',
  'Sate',
  'Bakso & Mie',
  'Nasi Goreng',
  'Gorengan',
  'Minuman & Kopi',
];

export function SearchBar({
  query,
  onQueryChange,
  selectedCategory,
  onCategoryChange,
  activeCount,
  isListView,
  onToggleView,
  onBack,
}: SearchBarProps) {
  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[94%] max-w-[460px] z-[1000] flex flex-col gap-2">
      {/* Search Input Box */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg shadow-slate-900/10 border border-slate-200/90 p-1.5 pl-2 flex items-center gap-2">
        {onBack && (
          <button
            onClick={onBack}
            aria-label="Kembali"
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer transition-colors shrink-0"
            title="Kembali ke Beranda"
          >
            ←
          </button>
        )}

        <span className="text-slate-400 text-sm shrink-0">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Cari sate, bakso, gorengan, PKL..."
          className="flex-1 text-xs sm:text-sm bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 min-w-0"
        />

        {query && (
          <button
            onClick={() => onQueryChange('')}
            className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 text-xs flex items-center justify-center hover:bg-slate-300 cursor-pointer shrink-0"
          >
            ✕
          </button>
        )}

        {/* Toggle Peta vs Daftar PKL */}
        <button
          onClick={onToggleView}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            isListView
              ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-sm shadow-amber-600/30'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
          title={isListView ? 'Tampilkan Peta' : 'Tampilkan Daftar PKL'}
        >
          <span>{isListView ? '🗺️ Peta' : '📋 Daftar'}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
            isListView ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {activeCount}
          </span>
        </button>
      </div>

      {/* Horizontal Category Chips */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shadow-xs ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white/95 backdrop-blur-sm text-slate-700 border border-slate-200/90 hover:bg-white'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
