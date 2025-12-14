import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DosenDashboard() {
  const navigate = useNavigate();
  const [judul, setJudul] = useState("");
  const [konten, setKonten] = useState("");
  const [pengumumanList, setPengumumanList] = useState([]);
  const [status, setStatus] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => { fetchPengumuman(); }, []);

  const fetchPengumuman = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/pengumuman", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPengumumanList(response.data);
    } catch (error) { console.error("Gagal ambil data", error); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("⏳ Mengirim...");
    try {
      await axios.post("http://127.0.0.1:8000/api/pengumuman", { judul, konten }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus("✅ Berhasil diposting!");
      setJudul(""); setKonten(""); fetchPengumuman();
    } catch (error) { setStatus("❌ Gagal mengirim."); }
  };

  const handleLogout = () => { localStorage.clear(); navigate("/"); };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 bg-white p-5 rounded-xl shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">👨‍🏫 Dashboard Dosen</h1>
            <p className="text-gray-500">Kelola pengumuman untuk mahasiswa</p>
          </div>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition shadow-md">
            Logout
          </button>
        </div>

        {/* GRID LAYOUT: KIRI INPUT, KANAN LIST */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* KOLOM KIRI: FORM INPUT */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-md sticky top-8 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                📢 Buat Baru
              </h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input 
                  type="text" 
                  placeholder="Judul Pengumuman" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={judul} onChange={(e) => setJudul(e.target.value)} required
                />
                <textarea 
                  placeholder="Isi pesan..." 
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={konten} onChange={(e) => setKonten(e.target.value)} required
                ></textarea>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition shadow-lg">
                  KIRIM SEKARANG
                </button>
                {status && <p className="text-center text-sm font-medium text-green-600 mt-2">{status}</p>}
              </form>
            </div>
          </div>

          {/* KOLOM KANAN: DAFTAR PENGUMUMAN */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-gray-700 mb-2">📋 Riwayat Postingan</h3>
            
            {pengumumanList.length === 0 ? (
              <div className="bg-white p-8 rounded-xl text-center text-gray-400 border border-dashed border-gray-300">
                Belum ada pengumuman yang dibuat.
              </div>
            ) : (
              pengumumanList.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl font-bold text-gray-800">{item.judul}</h4>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{item.konten}</p>
                  <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
                    Diposting oleh: <span className="font-semibold text-gray-500">{item.user.nama_lengkap}</span>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}