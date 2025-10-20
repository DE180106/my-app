import React, { useState } from "react";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Mật khẩu xác nhận không khớp!");
      return;
    }
    if (!formData.name || !formData.email || !formData.password) {
      setMessage("⚠️ Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Giả lập lưu thành công
    setMessage("✅ Đăng ký thành công!");
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
  };

  return (
    <div className="register-container">
      <h2>Đăng ký tài khoản</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Họ và tên"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Xác nhận mật khẩu"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <button type="submit">Đăng ký</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default Register;
