import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-column">
            <h3>🏠 HomeLiving Store</h3>
            <p>Giải pháp hoàn hảo cho ngôi nhà của bạn</p>
            <div className="social-links">
              <a href="#facebook" aria-label="Facebook">
                📘
              </a>
              <a href="#instagram" aria-label="Instagram">
                📷
              </a>
              <a href="#twitter" aria-label="Twitter">
                🐦
              </a>
              <a href="#youtube" aria-label="YouTube">
                📺
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h4>Về chúng tôi</h4>
            <ul>
              <li>
                <a href="#about">Giới thiệu</a>
              </li>
              <li>
                <a href="#news">Tin tức</a>
              </li>
              <li>
                <a href="#career">Tuyển dụng</a>
              </li>
              <li>
                <a href="#contact">Liên hệ</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Chính sách</h4>
            <ul>
              <li>
                <a href="#privacy">Chính sách bảo mật</a>
              </li>
              <li>
                <a href="#terms">Điều khoản sử dụng</a>
              </li>
              <li>
                <a href="#return">Chính sách đổi trả</a>
              </li>
              <li>
                <a href="#shipping">Chính sách vận chuyển</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Hỗ trợ khách hàng</h4>
            <ul>
              <li>
                <a href="#faq">Câu hỏi thường gặp</a>
              </li>
              <li>
                <a href="#guide">Hướng dẫn mua hàng</a>
              </li>
              <li>
                <a href="#payment">Phương thức thanh toán</a>
              </li>
              <li>
                <a href="#warranty">Chính sách bảo hành</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Liên hệ</h4>
            <ul className="contact-info">
              <li>📍 Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</li>
              <li>📞 Hotline: 1900-xxxx</li>
              <li>✉️ Email: support@homeliving.com</li>
              <li>🕐 Giờ làm việc: 8:00 - 22:00</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 HomeLiving Store. All rights reserved.</p>
          <div className="payment-methods">
            <span>💳 Phương thức thanh toán:</span>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
              alt="Visa"
              width="40"
              height="25"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
              alt="Mastercard"
              width="40"
              height="25"
            />
            <img
              src="https://img.icons8.com/color/48/cash-on-delivery.png"
              alt="Cash on Delivery"
              width="40"
              height="25"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
