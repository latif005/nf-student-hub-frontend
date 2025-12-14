import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import DosenDashboard from "./DosenDashboard";
import MahasiswaDashboard from "./MahasiswaDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Rute Baru */}
        <Route path="/dosen-dashboard" element={<DosenDashboard />} />
        <Route path="/mahasiswa-dashboard" element={<MahasiswaDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;