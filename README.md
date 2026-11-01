# 🍢 TitikPKL — Platform Pedagang Kaki Lima Real-Time

> *"Temukan Jajanan Langgananmu atau Mulai Berdagang Hari Ini."*

TitikPKL adalah aplikasi web berbasis Progressive Web App (PWA) yang menghubungkan pedagang kaki lima (PKL) dengan konsumen di sekitar mereka secara real-time.

---

## 🚀 Fitur Utama

- **🗺️ Peta Interaktif**: Peta berbasis OpenStreetMap & Leaflet untuk melacak dan menemukan PKL.
- **📍 Real-time Geolocation**: Pedagang dapat menyalakan siaran lokasi langsung dari browser/perangkat.
- **📡 Premium Broadcast**: Notifikasi broadcast pedagang kepada pembeli terdekat dalam radius tertentu.
- **✨ 0% Komisi**: Pedagang menerima pembayaran langsung via tunai atau QRIS pribadi tanpa potongan.
- **📱 Responsive & Mobile-First**: Antarmuka yang dioptimalkan untuk perangkat seluler.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI & State**: React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Mapping**: Leaflet 1.9 & react-leaflet 5
- **Deployment**: Vercel

---

## 📁 Struktur Proyek

```
app/
├── (routes)/
│   ├── page.tsx                       # Halaman Beranda / Pemilihan Peran
│   ├── consumer/page.tsx              # Layar Pembeli (Peta & Pencarian)
│   ├── merchant/page.tsx              # Layar Pedagang (Peta & Kontrol Siaran)
│   └── merchant/profile/page.tsx      # Profil & Pengaturan Usaha Pedagang
├── components/
│   ├── map/
│   │   ├── MapView.tsx                # Wrapper Peta Leaflet (Dynamic SSR-safe)
│   │   └── VendorMarker.tsx           # Marker Gerobak Pedagang
│   ├── consumer/
│   │   ├── SearchBar.tsx              # Komponen Bar Pencarian
│   │   └── VendorNotification.tsx     # Notifikasi PKL Terdekat
│   ├── merchant/
│   │   ├── MerchantPanel.tsx          # Panel Bawah Dashboard Pedagang
│   │   ├── PremiumBroadcast.tsx       # Toggle Broadcast Jangkauan Luas
│   │   └── TrackingButton.tsx         # Tombol Mulai/Tutup Dagangan
│   └── ui/
│       ├── BackButton.tsx             # Tombol Navigasi Kembali
│       └── RoleSelector.tsx           # Kartu Pilihan Peran Masuk
├── hooks/
│   └── useGeolocation.ts              # Custom Hook Pelacakan GPS & Interval
├── lib/
│   └── constants.ts                   # Konstanta (Koordinat, Interval, Aset)
├── globals.css                        # Styling Dasar Tailwind CSS v4
└── layout.tsx                         # Root Layout & Metadata
```

---

## 💻 Menjalankan Secara Lokal

```bash
# 1. Clone repository
git clone <repo-url>
cd titikpkl-pwa

# 2. Install dependensi
npm install

# 3. Jalankan server development
npm run dev

# 4. Buka di browser
# http://localhost:3000
```

---

## 🏗️ Build & Verifikasi

```bash
# Type-checking
npx tsc --noEmit

# Production build
npm run build
```
