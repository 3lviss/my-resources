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
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-xl w-full p-8 bg-gray-800 rounded-lg">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Dashboard</h1>
        {user && (
          <div className="bg-gray-700 p-4 rounded mb-6">
            <p className="text-gray-300 mb-2"><span className="font-semibold text-white">Email:</span> {user.email}</p>
            <p className="text-gray-300 mb-2"><span className="font-semibold text-white">User ID:</span> {user.id}</p>
            <p className="text-gray-300"><span className="font-semibold text-white">Created:</span> {new Date(user.created_at).toLocaleString()}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full py-3 bg-red-600 text-white rounded font-medium hover:bg-red-500 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
