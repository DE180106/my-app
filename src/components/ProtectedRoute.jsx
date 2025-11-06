// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  const location = useLocation();

  // ❌ Chưa đăng nhập → quay về login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ❌ Nếu route yêu cầu admin mà user không phải admin
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // ✅ Đã đăng nhập hợp lệ → render trang
  return children;
}
