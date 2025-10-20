import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../pages/CartContext"; // hoặc "../context/CartContext" nếu bạn đã chuyển
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { items } = useCart();
  const totalItems = items.reduce((s, i) => s + i.qty, 0);

  const toggleMenu = () => setIsMenuOpen(v => !v);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <NavLink to="/" onClick={closeMenu}>🏠 HomeLiving Store</NavLink>
        </div>

        <button className="menu-toggle" onClick={toggleMenu}>
          <span className={isMenuOpen ? "active" : ""}></span>
          <span className={isMenuOpen ? "active" : ""}></span>
          <span className={isMenuOpen ? "active" : ""}></span>
        </button>

        <ul className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <li><NavLink to="/" onClick={closeMenu}>Trang chủ</NavLink></li>
          <li><a href="#products" onClick={closeMenu}>Sản phẩm</a></li>
          <li><a href="#categories" onClick={closeMenu}>Danh mục</a></li>
          <li><a href="#about" onClick={closeMenu}>Giới thiệu</a></li>
          <li><a href="#contact" onClick={closeMenu}>Liên hệ</a></li>
        </ul>

        <div className="navbar-icons">
          <a href="#search" className="icon-link">🔍</a>
          <Link to="/cart" className="icon-link" onClick={closeMenu} title="Cart">
            🛒 <span className="cart-badge">{totalItems}</span>
          </Link>
          <a href="#account" className="icon-link">👤</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
