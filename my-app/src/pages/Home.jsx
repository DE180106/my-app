import React, { useState, useEffect } from 'react';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Load dữ liệu từ products.json
    fetch('/data/products.json')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
      })
      .catch(error => console.error('Lỗi:', error));
  }, []);

  return (
    <div className="home">
      {/* 1. Banner/Hero Section với ảnh nền */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>🏠 HomeLiving Store</h1>
          <p>Giải pháp hoàn hảo cho ngôi nhà của bạn</p>
          <p className="hero-subtitle">
            Đồ gia dụng và nội thất chất lượng cao với giá cả hợp lý
          </p>
          <a href="#products" className="cta-button">
            Mua sắm ngay
          </a>
        </div>
      </section>

      {/* 2. Hiển thị danh mục nổi bật */}
      <section className="categories-section">
        <h2>Danh mục sản phẩm</h2>
        <div className="categories-grid">
          <div className="category-card">
            <div className="category-icon">⚡</div>
            <h3>Đồ điện gia dụng</h3>
            <a href="#products">Xem thêm →</a>
          </div>
          <div className="category-card">
            <div className="category-icon">🌀</div>
            <h3>Thiết bị làm mát</h3>
            <a href="#products">Xem thêm →</a>
          </div>
          <div className="category-card">
            <div className="category-icon">🪑</div>
            <h3>Nội thất phòng ăn</h3>
            <a href="#products">Xem thêm →</a>
          </div>
          <div className="category-card">
            <div className="category-icon">💡</div>
            <h3>Đèn chiếu sáng</h3>
            <a href="#products">Xem thêm →</a>
          </div>
          <div className="category-card">
            <div className="category-icon">🍳</div>
            <h3>Thiết bị nhà bếp</h3>
            <a href="#products">Xem thêm →</a>
          </div>
          <div className="category-card">
            <div className="category-icon">🛏️</div>
            <h3>Nội thất phòng ngủ</h3>
            <a href="#products">Xem thêm →</a>
          </div>
        </div>
      </section>

      {/* 3. Hiển thị trang chủ - Danh sách sản phẩm nổi bật */}
      <section className="featured-section" id="products">
        <h2>Sản phẩm nổi bật</h2>
        
        {/* Filter/Search Bar (Chỉ hiển thị) */}
        <div className="filter-bar">
          <input 
            type="text" 
            placeholder="🔍 Tìm kiếm sản phẩm..." 
            className="search-input"
          />
          <select className="filter-select">
            <option value="">Tất cả danh mục</option>
            <option value="dien">Đồ điện gia dụng</option>
            <option value="mat">Thiết bị làm mát</option>
            <option value="noi-that">Nội thất</option>
          </select>
          <select className="filter-select">
            <option value="">Sắp xếp</option>
            <option value="gia-tang">Giá: Thấp đến cao</option>
            <option value="gia-giam">Giá: Cao đến thấp</option>
            <option value="ten">Tên A-Z</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img 
                  src={product.image} 
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                  }}
                />
                {product.stock < 10 && (
                  <span className="badge">⚠️ Sắp hết hàng</span>
                )}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="category">{product.category}</p>
                <p className="price">
                  {product.price.toLocaleString('vi-VN')} ₫
                </p>
                <div className="product-actions">
                  <a href={`#product-${product.id}`} className="view-details">
                    Xem chi tiết
                  </a>
                  <button className="add-to-cart-btn">
                    🛒 Thêm vào giỏ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="view-all">
          <a href="#products" className="view-all-button">
            Xem tất cả sản phẩm
          </a>
        </div>
      </section>

      {/* 4. CSS hover/transition/Frame Motion */}
      <section className="features-section">
        <h2>Tại sao chọn chúng tôi?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">🚚</div>
            <h3>Giao hàng miễn phí</h3>
            <p>Đơn hàng từ 500.000đ</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🔒</div>
            <h3>Thanh toán an toàn</h3>
            <p>Bảo mật thông tin 100%</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">↩️</div>
            <h3>Đổi trả dễ dàng</h3>
            <p>Trong vòng 7 ngày</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">💬</div>
            <h3>Hỗ trợ 24/7</h3>
            <p>Tư vấn nhiệt tình</p>
          </div>
        </div>
      </section>

      {/* 5. Thông tin liên hệ/Newsletter */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2>📧 Đăng ký nhận tin khuyến mãi</h2>
          <p>Nhận thông tin về sản phẩm mới và ưu đãi độc quyền</p>
          <div className="newsletter-form">
            <input 
              type="email" 
              placeholder="Nhập email của bạn..." 
              className="newsletter-input"
            />
            <button className="newsletter-btn">Đăng ký</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
