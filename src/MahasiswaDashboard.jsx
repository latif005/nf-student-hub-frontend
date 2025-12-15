import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MahasiswaDashboard() {
  const navigate = useNavigate();
  
  // State Data
  const [pengumumanList, setPengumumanList] = useState([]);
  const [jadwalList, setJadwalList] = useState([]); // <--- State baru untuk Jadwal
  const [loading, setLoading] = useState(true);
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Panggil kedua fungsi saat halaman dibuka
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Ambil Pengumuman
      const reqPengumuman = axios.get("http://127.0.0.1:8000/api/pengumuman", {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 2. Ambil Jadwal (API Baru)
      const reqJadwal = axios.get("http://127.0.0.1:8000/api/jadwal", {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Tunggu keduanya selesai
      const [resPengumuman, resJadwal] = await Promise.all([reqPengumuman, reqJadwal]);

      setPengumumanList(resPengumuman.data);
      setJadwalList(resJadwal.data);
      setLoading(false);

    } catch (error) {
      console.error("Gagal ambil data", error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-green-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border-l-4 border-green-600">
          <div>
            <h1 className="text-3xl font-bold text-green-800">🎓 Portal Akademik</h1>
            <p className="text-gray-500 mt-1">Selamat datang, Semangat belajar!</p>
          </div>
          <button onClick={handleLogout} className="bg-white border border-red-200 text-red-500 hover:bg-red-50 px-6 py-2 rounded-lg font-bold transition">
            Keluar
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 animate-pulse">Sedang memuat data...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* BAGIAN KIRI: JADWAL KULIAH (Dominan) */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-green-600 px-6 py-4">
                  <h2 className="text-white font-bold text-lg flex items-center gap-2">
                    📅 Jadwal Kuliah Minggu Ini
                  </h2>
                </div>
                
                <div className="p-6 overflow-x-auto">
                  {jadwalList.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Belum ada jadwal kuliah.</p>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-green-50 text-green-800 text-sm uppercase tracking-wider">
                          <th className="p-4 font-semibold border-b border-green-100">Hari & Jam</th>
                          <th className="p-4 font-semibold border-b border-green-100">Mata Kuliah</th>
                          <th className="p-4 font-semibold border-b border-green-100">Ruang</th>
                          <th className="p-4 font-semibold border-b border-green-100">Dosen</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                        {jadwalList.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition">
                            <td className="p-4 whitespace-nowrap">
                              <span className="font-bold block text-gray-800">{item.hari}</span>
                              <span className="text-xs text-gray-500">{item.jam}</span>
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-green-700 block">{item.nama_matkul}</span>
                              <span className="text-xs text-gray-400">{item.kode_matkul}</span>
                            </td>
                            <td className="p-4">
                              <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-600">
                                {item.ruangan}
                              </span>
                            </td>
                            <td className="p-4 text-gray-600">{item.dosen_pengampu}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            {/* BAGIAN KANAN: PENGUMUMAN (Feed) */}
            <div className="lg:col-span-1">
              <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                📢 Info Kampus
              </h3>
              
              <div className="space-y-4">
                {pengumumanList.length === 0 ? (
                  <div className="bg-white p-6 rounded-xl text-center text-gray-400 shadow-sm">
                    Sepi, belum ada info.
                  </div>
                ) : (
                  pengumumanList.map((item) => (
                    <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {item.user.nama_lengkap}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-800 mb-1">{item.judul}</h4>
                      <p className="text-sm text-gray-600 line-clamp-3">{item.konten}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}