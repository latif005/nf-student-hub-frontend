import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DosenDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // State Tab Aktif (Default: pengumuman)
  const [activeTab, setActiveTab] = useState("pengumuman");

  // State Pengumuman
  const [judul, setJudul] = useState("");
  const [konten, setKonten] = useState("");
  const [pengumumanList, setPengumumanList] = useState([]);

  // State Jadwal (BARU)
  const [jadwalForm, setJadwalForm] = useState({
    kode_matkul: "",
    nama_matkul: "",
    hari: "Senin",
    jam: "",
    ruangan: "",
    dosen_pengampu: "", // Nanti otomatis diisi nama dosen
  });

  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchPengumuman();
  }, []);

  // --- API CALLS ---
  const fetchPengumuman = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/pengumuman", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPengumumanList(response.data);
    } catch (error) { console.error(error); }
  };

  const handlePostPengumuman = async (e) => {
    e.preventDefault();
    setStatus("⏳ Mengirim Pengumuman...");
    try {
      await axios.post("http://127.0.0.1:8000/api/pengumuman", { judul, konten }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus("✅ Pengumuman Terkirim!");
      setJudul(""); setKonten(""); fetchPengumuman();
    } catch (error) { setStatus("❌ Gagal mengirim."); }
  };

  const handlePostJadwal = async (e) => {
    e.preventDefault();
    setStatus("⏳ Menyimpan Jadwal...");
    try {
      await axios.post("http://127.0.0.1:8000/api/jadwal", jadwalForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus("✅ Jadwal Berhasil Disimpan!");
      // Reset form
      setJadwalForm({ ...jadwalForm, kode_matkul: "", nama_matkul: "", jam: "", ruangan: "" });
    } catch (error) { setStatus("❌ Gagal menyimpan jadwal."); }
  };

  const handleLogout = () => { localStorage.clear(); navigate("/"); };

  return (
    <div className="min-h-screen bg-blue-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">👨‍🏫 Panel Dosen</h1>
            <p className="text-gray-500">Kelola aktivitas akademik mahasiswa</p>
          </div>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition">
            Logout
          </button>
        </div>

        {/* TAB MENU NAVIGATION */}
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => { setActiveTab("pengumuman"); setStatus(""); }}
            className={`flex-1 py-3 px-6 rounded-xl font-bold transition shadow-sm ${activeTab === 'pengumuman' ? 'bg-blue-600 text-white ring-2 ring-blue-300' : 'bg-white text-gray-600 hover:bg-blue-50'}`}
          >
            📢 Kelola Pengumuman
          </button>
          <button 
            onClick={() => { setActiveTab("jadwal"); setStatus(""); }}
            className={`flex-1 py-3 px-6 rounded-xl font-bold transition shadow-sm ${activeTab === 'jadwal' ? 'bg-blue-600 text-white ring-2 ring-blue-300' : 'bg-white text-gray-600 hover:bg-blue-50'}`}
          >
            📅 Input Jadwal Kuliah
          </button>
        </div>

        {/* STATUS NOTIFICATION */}
        {status && (
          <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border-l-4 border-blue-500 text-blue-800 font-medium animate-pulse">
            {status}
          </div>
        )}

        {/* KONTEN BERDASARKAN TAB */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* === TAB 1: PENGUMUMAN === */}
          {activeTab === "pengumuman" && (
            <>
              {/* Form Pengumuman */}
              <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-md h-fit">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Tulis Info Baru</h3>
                <form onSubmit={handlePostPengumuman} className="flex flex-col gap-4">
                  <input type="text" placeholder="Judul..." className="input-style" value={judul} onChange={(e) => setJudul(e.target.value)} required />
                  <textarea placeholder="Isi pesan..." rows="4" className="input-style" value={konten} onChange={(e) => setKonten(e.target.value)} required></textarea>
                  <button type="submit" className="btn-primary">KIRIM</button>
                </form>
              </div>

              {/* List Pengumuman */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-lg font-bold text-gray-700">Riwayat Postingan</h3>
                {pengumumanList.map((item) => (
                  <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                    <h4 className="font-bold text-blue-800">{item.judul}</h4>
                    <p className="text-gray-600 mt-1">{item.konten}</p>
                    <small className="text-gray-400 mt-2 block">{new Date(item.created_at).toLocaleString()}</small>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* === TAB 2: JADWAL KULIAH === */}
          {activeTab === "jadwal" && (
            <div className="md:col-span-3 bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">📝 Tambah Jadwal Kuliah Baru</h3>
              <form onSubmit={handlePostJadwal} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div>
                  <label className="label-style">Kode Mata Kuliah</label>
                  <input type="text" placeholder="Cth: TI-2024" className="input-style" 
                    value={jadwalForm.kode_matkul} onChange={(e) => setJadwalForm({...jadwalForm, kode_matkul: e.target.value})} required />
                </div>

                <div>
                  <label className="label-style">Nama Mata Kuliah</label>
                  <input type="text" placeholder="Cth: Rekayasa Perangkat Lunak" className="input-style" 
                    value={jadwalForm.nama_matkul} onChange={(e) => setJadwalForm({...jadwalForm, nama_matkul: e.target.value})} required />
                </div>

                <div>
                  <label className="label-style">Hari</label>
                  <select className="input-style" value={jadwalForm.hari} onChange={(e) => setJadwalForm({...jadwalForm, hari: e.target.value})}>
                    <option>Senin</option><option>Selasa</option><option>Rabu</option><option>Kamis</option><option>Jumat</option><option>Sabtu</option>
                  </select>
                </div>

                <div>
                  <label className="label-style">Jam Kuliah</label>
                  <input type="text" placeholder="Cth: 08:00 - 10:00" className="input-style" 
                    value={jadwalForm.jam} onChange={(e) => setJadwalForm({...jadwalForm, jam: e.target.value})} required />
                </div>

                <div>
                  <label className="label-style">Ruangan</label>
                  <input type="text" placeholder="Cth: Lab Komputer 2" className="input-style" 
                    value={jadwalForm.ruangan} onChange={(e) => setJadwalForm({...jadwalForm, ruangan: e.target.value})} required />
                </div>

                <div>
                  <label className="label-style">Dosen Pengampu</label>
                  <input type="text" placeholder="Nama Dosen" className="input-style" 
                    value={jadwalForm.dosen_pengampu} onChange={(e) => setJadwalForm({...jadwalForm, dosen_pengampu: e.target.value})} required />
                </div>

                <div className="md:col-span-2 mt-4">
                  <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg transition">
                    SIMPAN JADWAL
                  </button>
                </div>

              </form>
            </div>
          )}

        </div>
      </div>
      
      {/* CSS Helper (Biar kodingan di atas rapi) */}
      <style>{`
        .input-style { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px; outline: none; transition: all; }
        .input-style:focus { ring: 2px solid #3b82f6; border-color: transparent; }
        .label-style { display: block; font-weight: 600; color: #374151; margin-bottom: 5px; font-size: 0.9em; }
        .btn-primary { width: 100%; background: #2563eb; color: white; font-weight: bold; padding: 10px; border-radius: 8px; transition: background 0.3s; }
        .btn-primary:hover { background: #1d4ed8; }
      `}</style>
    </div>
  );
}