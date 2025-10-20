import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="contact">
      <div className="footer-container">
        <div className="footer-content">
          {/* Thông tin công ty */}
          <div className="footer-column">
            <h3>🏠 HomeLiving Store</h3>
            <p className="footer-description">
              Cung cấp đồ gia dụng và nội thất chất lượng cao cho ngôi nhà Việt. 
              Sản phẩm đa dạng, giá cả hợp lý, dịch vụ tận tâm.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                YouTube
              </a>
            </div>
          </div>

          {/* Liên kết */}
          <div className="footer-column">
            <h4>Về chúng tôi</h4>
            <ul className="footer-links">
              <li><a href="#about">Giới thiệu</a></li>
              <li><a href="#contact">Liên hệ</a></li>
              <li><a href="#stores">Hệ thống cửa hàng</a></li>
              <li><a href="#careers">Tuyển dụng</a></li>
            </ul>
          </div>

          {/* Chăm sóc khách hàng */}
          <div className="footer-column">
            <h4>Chăm sóc khách hàng</h4>
            <ul className="footer-links">
              <li><a href="#shipping">Chính sách giao hàng</a></li>
              <li><a href="#returns">Đổi trả & Hoàn tiền</a></li>
              <li><a href="#warranty">Bảo hành</a></li>
              <li><a href="#faq">Câu hỏi thường gặp</a></li>
            </ul>
          </div>

          {/* Thông tin liên hệ */}
          <div className="footer-column">
            <h4>Thông tin liên hệ</h4>
            <ul className="footer-contact">
              <li>
                <span>📍 123 Đường ABC, Quận 1, TP.HCM</span>
              </li>
              <li>
                <span>📞 Hotline: 1900 xxxx</span>
              </li>
              <li>
                <span>✉️ Email: support@homeliving.vn</span>
              </li>
              <li>
                <span>🕐 Giờ làm việc: 8:00 - 22:00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Phương thức thanh toán */}
        <div className="footer-payment">
          <h4>Phương thức thanh toán</h4>
          <div className="payment-icons">
            <span>💳 Visa</span>
            <span>💳 Mastercard</span>
            <span>💵 Tiền mặt</span>
            <span>🏦 Chuyển khoản</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>&copy; {currentYear} HomeLiving Store. Thiết kế bởi Ngọc. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#terms">Điều khoản sử dụng</a>
            <span className="separator">|</span>
            <a href="#privacy">Chính sách bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
