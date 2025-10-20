import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleLogout = () => { logout(); setOpenProfile(false); navigate("/"); };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">🏠 HomeLiving Store</Link>
        </div>

        <button className="menu-toggle" onClick={toggleMenu}>
          <span className={isMenuOpen ? "active" : ""}></span>
          <span className={isMenuOpen ? "active" : ""}></span>
          <span className={isMenuOpen ? "active" : ""}></span>
        </button>

        <ul className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <li><Link to="/">Trang chủ</Link></li>
          <li><a href="#products">Sản phẩm</a></li>
          <li><a href="#categories">Danh mục</a></li>
          <li><a href="#about">Giới thiệu</a></li>
          <li><a href="#contact">Liên hệ</a></li>

          {!user ? (
            <>
              <li><Link to="/register">Đăng ký</Link></li>
              <li><Link to="/login">Đăng nhập</Link></li>
            </>
          ) : (
            <li className="profile">
              <button className="profile-btn" onClick={() => setOpenProfile((v) => !v)}>
                👋 {user.name}
              </button>
              {openProfile && (
                <div className="profile-menu">
                  <button className="logout-btn" onClick={handleLogout}>Đăng xuất</button>
                </div>
              )}
            </li>
          )}
        </ul>

        <div className="navbar-icons">
          <a href="#search" className="icon-link">🔍</a>
          <a href="#cart" className="icon-link">
            🛒 <span className="cart-badge">0</span>
          </a>
          <Link to={user ? "/" : "/register"} className="icon-link">👤</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
