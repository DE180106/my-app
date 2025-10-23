import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../styles/ResetPassword.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isValidToken, setIsValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Kiểm tra token từ localStorage (mock)
    const storedToken = localStorage.getItem("resetToken");
    if (token === storedToken) {
      setIsValidToken(true);
    } else {
      setMessage("Token không hợp lệ hoặc hết hạn.");
      setTimeout(() => navigate("/login"), 3000);
    }
  }, [token, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (newPassword.length < 6) {
      setMessage("Mật khẩu phải ít nhất 6 ký tự.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    // Update password từ localStorage (dùng key 'hl_users')
    const resetEmail = localStorage.getItem("resetEmail");
    let users = JSON.parse(localStorage.getItem("hl_users") || "[]");
    const userIndex = users.findIndex(
      (u) => u.email.trim().toLowerCase() === resetEmail.trim().toLowerCase()
    );
    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem("hl_users", JSON.stringify(users));
      localStorage.removeItem("resetToken");
      localStorage.removeItem("resetEmail");
      setMessage("Mật khẩu đã được đặt lại thành công!");
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setMessage("Lỗi khi cập nhật mật khẩu.");
    }
    setIsLoading(false);
  };

  if (!isValidToken) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <p>{message || "Đang kiểm tra token..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Đặt lại mật khẩu</h2>
        {message && (
          <div
            className={
              message.includes("không khớp") || message.includes("Lỗi")
                ? "auth-error"
                : "auth-success"
            }
          >
            {message}
          </div>
        )}
        <label>Mật khẩu mới</label>
        <input
          type="password"
          placeholder="••••••••"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength="6"
          disabled={isLoading}
        />
        <label>Xác nhận mật khẩu</label>
        <input
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        <button className="auth-btn" type="submit" disabled={isLoading}>
          {isLoading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
        </button>
        <p className="auth-help">
          <Link to="/login">Quay lại đăng nhập</Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;
