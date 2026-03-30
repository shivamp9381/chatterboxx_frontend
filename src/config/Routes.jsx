import { Routes, Route, Navigate } from "react-router";
import JoinCreateChat from "../components/JoinCreateChat";
import ChatPage from "../components/ChatPage";
import LoginPage from "../components/LoginPage";
import RegisterPage from "../components/RegisterPage";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes — JWT required */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <JoinCreateChat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;