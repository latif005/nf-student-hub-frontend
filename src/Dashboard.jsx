import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>Selamat Datang!</h1>
      <h3>Anda login sebagai: {role}</h3>
      <button onClick={handleLogout} style={{ marginTop: "20px", padding: "10px" }}>
        Logout
      </button>
    </div>
  );
}