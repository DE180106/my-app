import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Settings.css";

const Settings = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 16px" }}>
      <h2>Thông tin & Cài đặt</h2>
      <p>
        <b>Tên:</b> {user.name}
      </p>
      <p>
        <b>Email:</b> {user.email}
      </p>
      <p>
        (Bạn có thể mở rộng trang này: đổi mật khẩu, địa chỉ giao hàng, v.v.)
      </p>
    </div>
  );
};

export default Settings;
