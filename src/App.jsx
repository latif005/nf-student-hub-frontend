import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import DosenDashboard from "./DosenDashboard";
import MahasiswaDashboard from "./MahasiswaDashboard";
import AdminKeuanganDashboard from "./AdminKeuanganDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dosen-dashboard" element={<DosenDashboard />} />
        <Route path="/mahasiswa-dashboard" element={<MahasiswaDashboard />} />
        <Route path="/admin-keuangan-dashboard" element={<AdminKeuanganDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;