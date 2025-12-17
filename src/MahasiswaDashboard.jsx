import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MahasiswaDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // State
  const [user, setUser] = useState({}); // Data Profil
  const [uktData, setUktData] = useState([]);
  const [activeTab, setActiveTab] = useState("akademik");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      fetchUserData();
      fetchUktData();
    }
  }, []);

  // 1. Ambil Data Profil (Nama, NIM, Prodi)
  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error("Gagal ambil profil");
    }
  };

  // 2. Ambil Data UKT
  const fetchUktData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/ukt/my", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUktData(response.data);
    } catch (error) {
      console.error("Gagal ambil UKT");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const formatRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(num);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 text-white p-2 rounded-lg font-bold shadow-lg shadow-green-200">NF</div>
          <div>
            <h1 className="font-bold text-gray-800 text-lg">Student Hub</h1>
          </div>
        </div>
        <button onClick={handleLogout} className="text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition">Logout</button>
      </nav>

      <div className="max-w-4xl mx-auto mt-8 px-4">
        
        {/* 🔥 KARTU PROFIL (BARU) */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="bg-white p-1 rounded-full shadow-md">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 font-bold text-2xl">
              {user.nama_lengkap ? user.nama_lengkap.charAt(0) : "M"}
            </div>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">{user.nama_lengkap || "Memuat..."}</h2>
            <div className="flex flex-col md:flex-row gap-2 md:gap-6 mt-2 text-green-100 text-sm font-medium">
              <span className="flex items-center gap-1">
                🎓 {user.prodi || "Prodi Belum Diisi"}
              </span>
              <span className="flex items-center gap-1">
                🆔 {user.nim || "NIM Kosong"}
              </span>
              <span className="flex items-center gap-1">
                📧 {user.email}
              </span>
            </div>
          </div>
        </div>

        {/* TAB MENU */}
        <div className="flex gap-6 border-b border-gray-200 mb-6">
          <button 
            onClick={() => setActiveTab("akademik")}
            className={`pb-3 px-2 font-bold text-sm transition ${activeTab === "akademik" ? "text-green-600 border-b-2 border-green-600" : "text-gray-400 hover:text-gray-600"}`}
          >
            Tagihan UKT
          </button>
          <button 
             onClick={() => setActiveTab("jadwal")}
             className={`pb-3 px-2 font-bold text-sm transition ${activeTab === "jadwal" ? "text-green-600 border-b-2 border-green-600" : "text-gray-400 hover:text-gray-600"}`}
          >
            Jadwal Kuliah
          </button>
        </div>

        {/* CONTENT */}
        {activeTab === "akademik" ? (
          <div className="space-y-4 animate-fade-in">
            {loading ? (
              <div className="p-8 text-center text-gray-400 bg-white rounded-xl">Memuat data...</div>
            ) : uktData.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500">Tidak ada tagihan aktif.</p>
              </div>
            ) : (
              uktData.map((tagihan) => (
                <div key={tagihan.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition">
                  <div>
                    <p className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1">Tagihan Semester</p>
                    <p className="font-bold text-gray-800 text-lg">{tagihan.periode}</p>
                    <p className="text-gray-500 font-mono mt-1">{formatRupiah(tagihan.nominal)}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide
                    ${tagihan.status === 'Lunas' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {tagihan.status}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
             <p className="text-gray-400 text-lg">📅 Jadwal Kuliah belum tersedia.</p>
          </div>
        )}

      </div>
    </div>
  );
}