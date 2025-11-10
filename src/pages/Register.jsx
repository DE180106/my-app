import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Register.css";

const USERS_KEY = "hl_users";
const normalize = (s = "") => s.trim().toLowerCase();

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
  const [emailTaken, setEmailTaken] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // kiểm tra trùng email theo thời gian thực
  useEffect(() => {
    const email = formData.email;
    if (!email) {
      setEmailTaken(false);
      setEmailError("");
      return;
    }
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const exists = users.some((u) => normalize(u.email) === normalize(email));
    setEmailTaken(exists);
    setEmailError(exists ? " Email đã tồn tại, vui lòng dùng email khác." : "");
  }, [formData.email]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.name || !formData.email || !formData.password) {
      setMessage(" Vui lòng điền đầy đủ thông tin!");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setMessage(" Mật khẩu xác nhận không khớp!");
      return;
    }

    // kiểm tra trùng email lần nữa trước khi gọi register
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const exists = users.some(
      (u) => normalize(u.email) === normalize(formData.email)
    );
    if (exists) {
      setMessage(" Email đã tồn tại, vui lòng thay đổi email và thử lại.");
      return;
    }

    try {
      register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setMessage(" Đăng ký thành công! Hãy đăng nhập.");
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      navigate("/personal-infor");
    } catch (err) {
      // phòng khi AuthContext vẫn phát hiện trùng
      setMessage(` ${err.message}`);
    }
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
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          aria-invalid={emailTaken}
          className={emailTaken ? "invalid" : ""}
          required
        />
        {emailError && <p className="field-error">{emailError}</p>}

        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Xác nhận mật khẩu"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={emailTaken}>
          Đăng ký
        </button>

        {message && <p className="message">{message}</p>}

        <p style={{ marginTop: 10 }}>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
