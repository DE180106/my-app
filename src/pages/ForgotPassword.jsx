import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    // Kiểm tra email tồn tại từ localStorage (dùng key 'hl_users' từ AuthContext)
    const users = JSON.parse(localStorage.getItem("hl_users") || "[]");
    const userExists = users.some(
      (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase()
    );

    if (!userExists) {
      setMessage("Email không tồn tại.");
      setIsLoading(false);
      return;
    }

    // Mock tạo token và lưu local (cho ResetPassword dùng)
    const token =
      Date.now().toString() + Math.random().toString(36).substr(2, 5);
    localStorage.setItem("resetToken", token);
    localStorage.setItem("resetEmail", email);

    // Simulate gửi email (delay)
    setTimeout(() => {
      setMessage(
        "Link reset mật khẩu đã gửi (mock - kiểm tra email thật sau)!"
      );
      setIsLoading(false);
      // Tự chuyển đến reset sau 2s
      setTimeout(() => navigate(`/reset-password/${token}`), 2000);
    }, 1000);
  };

  return (
    <div className="auth-wrapper">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Quên mật khẩu?</h2>
        <p>Nhập email để nhận link đặt lại.</p>
        <label>Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
        <button
          className="auth-btn"
          type="submit"
          disabled={isLoading || !email}
        >
          {isLoading ? "Đang gửi..." : "Gửi link reset"}
        </button>
        {message && (
          <div
            className={
              message.includes("không tồn tại") ? "auth-error" : "auth-success"
            }
          >
            {message}
          </div>
        )}
        <p className="auth-help">
          <Link to="/login">Quay lại đăng nhập</Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
