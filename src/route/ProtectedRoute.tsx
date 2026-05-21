import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Jika terautentikasi (NIM & Nama ada), perbolehkan masuk ke layout dashboard
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}