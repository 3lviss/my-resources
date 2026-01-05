import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Index from "./pages/resource/Index";
import Create from "./pages/resource/Create";
import Edit from "./pages/resource/Edit";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/resources" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/resources/new" element={<ProtectedRoute><Create /></ProtectedRoute>} />
          <Route path="/resources/:id" element={<ProtectedRoute><Edit /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
