'use client';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  activeCount: number;
  isListView: boolean;
  onToggleView: () => void;
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
}: SearchBarProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-[420px] z-[1000] flex flex-col gap-2">
      {/* Search Input Box */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/80 px-3.5 py-2 flex items-center gap-2">
        <span className="text-gray-400 text-base">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Cari Sate, Bakso, Gorengan, nama PKL..."
          className="flex-1 text-sm bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-400"
        />
        {query && (
          <button
            onClick={() => onQueryChange('')}
            className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 text-xs flex items-center justify-center hover:bg-gray-300 cursor-pointer"
          >
            ✕
          </button>
        )}

        {/* Toggle Peta vs Daftar PKL */}
        <button
          onClick={onToggleView}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm ${
            isListView
              ? 'bg-amber-600 text-white hover:bg-amber-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
          }`}
          title={isListView ? 'Tampilkan Peta' : 'Tampilkan Daftar PKL'}
        >
          <span>{isListView ? '🗺️ Peta' : '📋 Daftar'}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10">
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
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shadow-sm ${
                isSelected
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-white/90 backdrop-blur-sm text-gray-700 border border-gray-200 hover:bg-white'
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
