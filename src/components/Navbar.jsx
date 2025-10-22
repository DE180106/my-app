import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);      // menu hamburger
  const [openProfile, setOpenProfile] = useState(false);     // menu tài khoản
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setOpenProfile((v) => !v);
  const handleLogout = () => {
    logout();
    setOpenProfile(false);
    navigate("/");
  };

  // Đóng menu tài khoản khi click ra ngoài
  useEffect(() => {
    const onClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/">🏠 HomeLiving Store</Link>
        </div>

        {/* Hamburger */}
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={isMenuOpen ? "active" : ""}></span>
          <span className={isMenuOpen ? "active" : ""}></span>
          <span className={isMenuOpen ? "active" : ""}></span>
        </button>

        {/* Menu trái (giữ như cũ, không hiển thị login/register ở đây nữa) */}
        <ul className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <li><Link to="/">Trang chủ</Link></li>
          <li><a href="#products">Sản phẩm</a></li>
          <li><a href="#categories">Danh mục</a></li>
          <li><a href="#about">Giới thiệu</a></li>
          <li><a href="#contact">Liên hệ</a></li>
        </ul>

        {/* Icons + Tài khoản */}
        <div className="navbar-icons" ref={profileRef}>
          <a href="#search" className="icon-link" aria-label="Tìm kiếm">🔍</a>
          <a href="#cart" className="icon-link" aria-label="Giỏ hàng">
            🛒 <span className="cart-badge">0</span>
          </a>

          {/* KHU VỰC TÀI KHOẢN */}
          {!user ? (
            <div className="account-area">
              <button className="account-btn" onClick={toggleProfile}>
                Đăng nhập / Đăng ký
              </button>
              {openProfile && (
                <div className="profile-menu right">
                  <Link className="menu-item" to="/login" onClick={() => setOpenProfile(false)}>
                    Đăng nhập
                  </Link>
                  <Link className="menu-item" to="/register" onClick={() => setOpenProfile(false)}>
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="account-area">
              <button className="account-btn" onClick={toggleProfile}>
                👋 {user.name}
              </button>
              {openProfile && (
                <div className="profile-menu right">
                  <Link className="menu-item" to="/settings" onClick={() => setOpenProfile(false)}>
                    Thông tin & Cài đặt
                  </Link>
                  <button className="menu-item danger" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
