import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus("⏳ Sedang memproses...");
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        username, password
      });
      setStatus("✅ Login Berhasil!");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      
      setTimeout(() => {
        if (response.data.role === "Dosen") navigate("/dosen-dashboard");
        else if (response.data.role === "Mahasiswa") navigate("/mahasiswa-dashboard");
        else navigate("/dosen-dashboard");
      }, 1000);
    } catch (error) {
      setStatus("❌ Login Gagal. Cek username/password.");
    }
  };

  return (
    // Background Biru Gelap
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      
      {/* Kotak Login Putih */}
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">NF Student Hub</h1>
          <p className="text-gray-500 text-sm">Masuk untuk terhubung dengan kampus</p>
        </div>

        {status && (
          <div className="mb-4 p-3 text-center text-sm rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
            {status}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: pakdosen"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg mt-4"
          >
            MASUK SEKARANG
          </button>
        </form>

      </div>
    </div>
  );
}