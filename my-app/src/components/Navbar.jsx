import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <a href="/">🏠 HomeLiving Store</a>
        </div>

        <button className="menu-toggle" onClick={toggleMenu}>
          <span className={isMenuOpen ? 'active' : ''}></span>
          <span className={isMenuOpen ? 'active' : ''}></span>
          <span className={isMenuOpen ? 'active' : ''}></span>
        </button>

        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><a href="/">Trang chủ</a></li>
          <li><a href="#products">Sản phẩm</a></li>
          <li><a href="#categories">Danh mục</a></li>
          <li><a href="#about">Giới thiệu</a></li>
          <li><a href="#contact">Liên hệ</a></li>
        </ul>

        <div className="navbar-icons">
          <a href="#search" className="icon-link">🔍</a>
          <a href="#cart" className="icon-link">
            🛒
            <span className="cart-badge">0</span>
          </a>
          <a href="#account" className="icon-link">👤</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
