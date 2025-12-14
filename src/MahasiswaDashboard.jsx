import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MahasiswaDashboard() {
  const navigate = useNavigate();
  const [pengumumanList, setPengumumanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => { fetchPengumuman(); }, []);

  const fetchPengumuman = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/pengumuman", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPengumumanList(response.data); setLoading(false);
    } catch (error) { console.error(error); setLoading(false); }
  };

  const handleLogout = () => { localStorage.clear(); navigate("/"); };

  return (
    <div className="min-h-screen bg-green-50 p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border-b-4 border-green-500">
          <div>
            <h1 className="text-3xl font-bold text-green-700">🎓 Portal Mahasiswa</h1>
            <p className="text-gray-500 mt-1">Cek informasi terbaru kampus di sini</p>
          </div>
          <button onClick={handleLogout} className="bg-white border-2 border-red-500 text-red-500 hover:bg-red-50 px-5 py-2 rounded-lg font-bold transition">
            Keluar
          </button>
        </div>

        {/* FEED PENGUMUMAN */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
            📢 Papan Pengumuman
          </h2>

          {loading ? (
            <p className="text-center text-gray-500 animate-pulse">Memuat data...</p>
          ) : pengumumanList.length === 0 ? (
            <div className="text-center p-10 bg-white rounded-xl shadow-sm">
              <p className="text-gray-400">Tidak ada pengumuman terbaru.</p>
            </div>
          ) : (
            pengumumanList.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden hover:shadow-lg transition duration-300">
                
                {/* Bagian Atas Card (Info Penulis) */}
                <div className="bg-green-100/50 px-6 py-3 flex justify-between items-center border-b border-green-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold text-xs">
                      {item.user.nama_lengkap.charAt(0)}
                    </div>
                    <span className="font-semibold text-green-800 text-sm">{item.user.nama_lengkap}</span>
                  </div>
                  <span className="text-xs text-green-600 font-mono">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Isi Card */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{item.judul}</h3>
                  <p className="text-gray-600 leading-relaxed text-justify">
                    {item.konten}
                  </p>
                </div>
                
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}