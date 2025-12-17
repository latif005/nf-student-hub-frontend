import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        username,
        password,
      });

      const { token, role } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      setMessage("✅ Login Berhasil!");

      setTimeout(() => {
        if (role === "Admin Keuangan") {
          navigate("/admin-keuangan-dashboard");
        } else if (role === "Dosen") {
          navigate("/dosen-dashboard");
        } else {
          navigate("/mahasiswa-dashboard");
        }
      }, 1000);

    } catch (error) {
      setMessage("❌ Username atau Password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">NF Student Hub</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input type="text" placeholder="Username" className="p-3 border rounded-lg" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" className="p-3 border rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading} className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
            {loading ? "Loading..." : "LOGIN"}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm font-bold text-gray-700">{message}</p>}
      </div>
    </div>
  );
}