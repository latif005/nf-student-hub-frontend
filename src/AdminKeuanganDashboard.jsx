import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminKeuanganDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  const [uktList, setUktList] = useState([]);
  const [statusMap, setStatusMap] = useState({}); // Menyimpan perubahan sementara

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/ukt/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUktList(response.data);
    } catch (error) {
      console.error("Gagal ambil data", error);
      alert("Sesi habis, silakan login ulang.");
      localStorage.clear();
      navigate("/");
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setStatusMap({ ...statusMap, [id]: newStatus });
  };

  const handleSave = async (id) => {
    const newStatus = statusMap[id];
    if (!newStatus) return;

    try {
      await axios.put(`http://127.0.0.1:8000/api/ukt/${id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Status berhasil diupdate!");
      fetchData(); // Refresh data
      
      // Reset dropdown sementara
      const newMap = { ...statusMap };
      delete newMap[id];
      setStatusMap(newMap);
    } catch (error) {
      alert("❌ Gagal update status.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const formatRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(num);

  return (
    <div className="min-h-screen bg-purple-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow border-l-8 border-purple-600">
          <h1 className="text-2xl font-bold text-purple-800">💰 Admin Keuangan Dashboard</h1>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-bold">LOGOUT</button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-purple-600 text-white uppercase text-sm">
              <tr>
                <th className="p-4">Mahasiswa</th>
                <th className="p-4">Periode</th>
                <th className="p-4">Nominal</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-100">
              {uktList.length === 0 ? (
                <tr><td colSpan="5" className="p-6 text-center">Belum ada data tagihan.</td></tr>
              ) : (
                uktList.map((item) => (
                  <tr key={item.id} className="hover:bg-purple-50">
                    <td className="p-4 font-bold">{item.user?.nama_lengkap || "Tanpa Nama"}</td>
                    <td className="p-4">{item.periode}</td>
                    <td className="p-4 font-mono">{formatRupiah(item.nominal)}</td>
                    <td className="p-4 text-center">
                      <select 
                        className="border p-2 rounded bg-white w-full"
                        value={statusMap[item.id] || item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      >
                        <option value="Belum Bayar">Belum Bayar</option>
                        <option value="Verifikasi">Verifikasi</option>
                        <option value="Lunas">Lunas</option>
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      {statusMap[item.id] && statusMap[item.id] !== item.status ? (
                        <button onClick={() => handleSave(item.id)} className="bg-purple-600 text-white px-4 py-2 rounded text-xs font-bold hover:bg-purple-700">
                          SIMPAN
                        </button>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            item.status === 'Lunas' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}>
                        {item.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}