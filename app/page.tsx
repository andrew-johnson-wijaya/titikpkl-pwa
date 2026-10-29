'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });

const defaultCenter = [-6.200000, 106.816666];

export default function MainScreen() {
  const [userRole, setUserRole] = useState(null); 
  const [isClient, setIsClient] = useState(false);

  // State Pedagang
  const [merchantLocation, setMerchantLocation] = useState(defaultCenter);
  const [isTracking, setIsTracking] = useState(false);
  const [isPremiumActive, setIsPremiumActive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  
  // State Baru: Untuk Menampilkan Layar Profil
  const [showProfile, setShowProfile] = useState(false);

  // State Pembeli
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  let gerobakIcon;
  if (typeof window !== 'undefined') {
    const L = require('leaflet');
    gerobakIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3081/3081367.png',
      iconSize: [45, 45], 
      iconAnchor: [22, 45],
    });
  }

  useEffect(() => {
    let intervalId;
    if (userRole === 'MERCHANT' && isTracking) {
      const fetchLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const newLocation = [position.coords.latitude, position.coords.longitude];
            setMerchantLocation(newLocation);
            setLastUpdated(`Diperbarui pada ${new Date().toLocaleTimeString()}`);
          });
        }
      };
      fetchLocation(); 
      intervalId = setInterval(fetchLocation, 30000); 
    }
    return () => clearInterval(intervalId);
  }, [isTracking, userRole]);

  useEffect(() => {
    if (userRole === 'CONSUMER') {
      setTimeout(() => setShowNotification(true), 3000);
    }
  }, [userRole]);

  if (!isClient) return <div>Memuat...</div>;

  // 1. LAYAR SIGN IN
  if (!userRole) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', padding: '20px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#d97706', marginBottom: '10px' }}>TitikPKL</h1>
        <p style={{ color: '#4b5563', marginBottom: '40px', textAlign: 'center' }}>Temukan Jajanan Langgananmu atau Mulai Berdagang Hari Ini.</p>
        <div style={{ width: '100%', maxWidth: '350px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button onClick={() => setUserRole('CONSUMER')} style={{ padding: '15px', borderRadius: '10px', backgroundColor: '#111827', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
            👋 Masuk sebagai Pembeli
          </button>
          <button onClick={() => setUserRole('MERCHANT')} style={{ padding: '15px', borderRadius: '10px', backgroundColor: '#16a34a', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
            🛒 Masuk sebagai Pedagang
          </button>
        </div>
      </div>
    );
  }

  // 2. LAYAR PROFIL, FEEDBACK & DELETE ACCOUNT (Membuktikan Unfair Advantage)
  if (showProfile) {
    return (
      <div style={{ height: '100vh', backgroundColor: '#f9fafb', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ margin: 0, color: '#111827' }}>Profil Usaha</h2>
          <button onClick={() => setShowProfile(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✖</button>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>Sate Ayam Cak Roni</h3>
          <p style={{ margin: '0 0 15px 0', color: '#6b7280', fontSize: '14px' }}>#PKL-0921 • Bergabung sejak 2026</p>
          
          {/* BUKTI UNFAIR ADVANTAGE */}
          <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #10b981', padding: '15px', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#047857' }}>✨ 100% Keuntungan Milikmu!</p>
            <p style={{ margin: 0, fontSize: '13px', color: '#065f46', lineHeight: '1.4' }}>TitikPKL tidak memotong komisi aplikasi sepeser pun. Terima pembayaran langsung dari pembeli menggunakan <b>Uang Tunai</b> atau <b>QRIS Pribadi</b>.</p>
          </div>
        </div>

        {/* BUKTI FITUR WAJIB (Feedback & Delete Account) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: 'auto', marginBottom: '20px' }}>
          <button style={{ padding: '15px', borderRadius: '8px', backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db', cursor: 'pointer', fontWeight: 'bold' }}>
            💬 Berikan Feedback Aplikasi
          </button>
          <button style={{ padding: '15px', borderRadius: '8px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', cursor: 'pointer', fontWeight: 'bold' }}>
            🗑️ Delete my Account (Hapus Akun)
          </button>
        </div>
      </div>
    );
  }

  // 3. MAIN SCREEN (MAP)
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      
      <MapContainer center={merchantLocation} zoom={16} style={{ width: '100%', height: '100vh' }} zoomControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
        {(isTracking || userRole === 'CONSUMER') && <Marker position={merchantLocation} icon={gerobakIcon} />}
      </MapContainer>

      <button onClick={() => {setUserRole(null); setIsTracking(false); setShowNotification(false);}} style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000, padding: '10px 15px', borderRadius: '8px', backgroundColor: 'white', border: '1px solid #d1d5db', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        ← Keluar
      </button>

      {/* SISI PEMBELI */}
      {userRole === 'CONSUMER' && (
        <>
          <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', width: '80%', maxWidth: '350px', backgroundColor: 'white', padding: '12px 20px', borderRadius: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 1000 }}>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>🔍 Cari Sate, Bakso, Nasi Goreng...</p>
          </div>
          {showNotification && (
            <div style={{ position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)', width: '85%', maxWidth: '350px', backgroundColor: '#fffbeb', borderLeft: '4px solid #d97706', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', zIndex: 1000 }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold', color: '#b45309' }}>🔔 Terdeteksi di dekatmu!</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#92400e' }}>Sate Ayam Cak Roni menggunakan fitur Premium Broadcast dan berada dalam radius 500m dari lokasimu.</p>
            </div>
          )}
        </>
      )}

      {/* SISI PEDAGANG */}
      {userRole === 'MERCHANT' && (
        <div style={{ position: 'absolute', bottom: '20px', left: '5%', right: '5%', backgroundColor: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 1000 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ margin: '0 0 5px 0', fontSize: '20px', color: '#111827' }}>Sate Ayam Cak Roni</h2>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>ID: #PKL-0921</p>
            </div>
            {/* Tombol Profil Baru */}
            <button onClick={() => setShowProfile(true)} style={{ padding: '8px 12px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#374151' }}>
              ⚙️ Profil
            </button>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', padding: '12px', backgroundColor: '#fffbeb', borderRadius: '10px', border: '1px solid #fde68a' }}>
            <div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#d97706' }}>📡 Premium Broadcast</p>
              <p style={{ margin: 0, fontSize: '11px', color: '#b45309' }}>Beritahu pembeli di radius 1km</p>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" checked={isPremiumActive} onChange={(e) => setIsPremiumActive(e.target.checked)} style={{ width: '22px', height: '22px', accentColor: '#d97706' }} />
            </label>
          </div>

          {isTracking && (
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#16a34a', fontWeight: '500' }}>🟢 Mengudara • {lastUpdated}</p>
            </div>
          )}

          <button onClick={() => setIsTracking(!isTracking)} style={{ width: '100%', padding: '15px', borderRadius: '10px', backgroundColor: isTracking ? '#dc2626' : '#16a34a', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
            {isTracking ? 'Tutup Dagangan (Keluar)' : 'Mulai Berdagang (Masuk)'}
          </button>
        </div>
      )}

    </div>
  );
}