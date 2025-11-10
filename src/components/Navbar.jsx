import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const { totalQty } = useCart();
  const [isCartOpen, setCartOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setOpenProfile((v) => !v);
  const handleLogout = () => {
    logout();
    setOpenProfile(false);
    navigate("/");
  };

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
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-logo">
            <Link to="/">🏠 HomeLiving Store</Link>
          </div>

          {/* Hamburger */}
          <button
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={isMenuOpen ? "active" : ""}></span>
            <span className={isMenuOpen ? "active" : ""}></span>
            <span className={isMenuOpen ? "active" : ""}></span>
          </button>

          {/* Menu trái */}
          <ul className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
            <li>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                Trang chủ
              </Link>
            </li>
            <li>
              <a href="#products" onClick={() => setIsMenuOpen(false)}>
                Sản phẩm
              </a>
            </li>
            <li>
              <a href="#categories" onClick={() => setIsMenuOpen(false)}>
                Danh mục
              </a>
            </li>

            {/* 🆕 Thay link Giới thiệu và Liên hệ thành route riêng */}
            <li>
              <Link to="/about" onClick={() => setIsMenuOpen(false)}>
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                Liên hệ
              </Link>
            </li>

            <li>
              <Link to="/feedback" onClick={() => setIsMenuOpen(false)}>
                Feedback
              </Link>
            </li>
          </ul>

          {/* Icons + Tài khoản */}
          <div className="navbar-icons" ref={profileRef}>
            <a href="#search" className="icon-link" aria-label="Tìm kiếm">
              🔍
            </a>

            {/* Giỏ hàng */}
            <a
              href="#cart"
              className="icon-link"
              aria-label="Giỏ hàng"
              onClick={(e) => {
                e.preventDefault();
                setCartOpen(true);
              }}
            >
              🛒 <span className="cart-badge">{totalQty}</span>
            </a>

            {/* Khu vực tài khoản */}
            {!user ? (
              <div className="account-area">
                <button className="account-btn" onClick={toggleProfile}>
                  Đăng nhập / Đăng ký
                </button>
                {openProfile && (
                  <div className="profile-menu right">
                    <Link
                      className="menu-item"
                      to="/login"
                      onClick={() => setOpenProfile(false)}
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      className="menu-item"
                      to="/register"
                      onClick={() => setOpenProfile(false)}
                    >
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
                    <Link
                      className="menu-item"
                      to="/settings"
                      onClick={() => setOpenProfile(false)}
                    >
                      Thông tin cá nhân
                    </Link>

                    <Link
                      className="menu-item"
                      to="/your-orders"
                      onClick={() => setOpenProfile(false)}
                    >
                      🧾 Lịch sử đặt hàng
                    </Link>

                    {user?.role === "admin" && (
                      <Link
                        className="menu-item"
                        to="/admin"
                        onClick={() => setOpenProfile(false)}
                      >
                        Quản lý
                      </Link>
                    )}

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

      {/* Drawer giỏ hàng */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;
