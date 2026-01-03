import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../lib/api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await auth.register(email);

      if (data.status_code === 201) {
        navigate("/login");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full p-8 bg-gray-800 rounded-lg">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
          {error && <p className="text-red-400 bg-red-900/20 p-3 rounded mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400">
          Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Login</Link>
        </p>
      </div>
    </div>
  );
}
