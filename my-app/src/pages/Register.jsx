import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Register.css";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.name || !formData.email || !formData.password) {
      setMessage("⚠️ Vui lòng điền đầy đủ thông tin!");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      register({ name: formData.name, email: formData.email, password: formData.password });
      setMessage(" Đăng ký thành công! Hãy đăng nhập.");
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      navigate("/login");
    } catch (err) {
      setMessage(`${err.message}`);
    }
  };

  return (
    <div className="register-container">
      <h2>Đăng ký tài khoản</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Họ và tên" value={formData.name} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <input type="password" name="password" placeholder="Mật khẩu" value={formData.password} onChange={handleChange} />
        <input type="password" name="confirmPassword" placeholder="Xác nhận mật khẩu" value={formData.confirmPassword} onChange={handleChange} />
        <button type="submit">Đăng ký</button>
        {message && <p className="message">{message}</p>}
        <p style={{marginTop: 10}}>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
      </form>
    </div>
  );
};

export default Register;
