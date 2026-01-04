import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ResourceEdit from "./pages/ResourceEdit";
import ResourceCreate from "./pages/ResourceCreate";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/resources/new" element={<ProtectedRoute><ResourceCreate /></ProtectedRoute>} />
          <Route path="/resources/:id" element={<ProtectedRoute><ResourceEdit /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
