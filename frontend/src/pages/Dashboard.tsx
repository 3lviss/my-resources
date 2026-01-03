import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      {user && (
        <div className="user-info">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user.id}</p>
          <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
        </div>
      )}
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}
