// src/pages/Home.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Home.css";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:9999/products"; // ✅ json-server cách B

// Bỏ dấu tiếng Việt + lower-case để search chuẩn
const normalizeVN = (str = "") =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();

const Home = () => {
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // bộ lọc & sắp xếp
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // dien | mat | noi-that | "" (tất cả)
  const [sortOption, setSortOption] = useState(""); // gia-tang | gia-giam | ten | ""

  // ------- FETCH DATA -------
  useEffect(() => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Lỗi tải sản phẩm:", err))
      .finally(() => setLoading(false));
  }, []);

  /**
   * ánh xạ value của dropdown -> từ khóa để so với product.category
   * (file JSON đang để category là tiếng Việt đầy đủ)
   */
  const CATEGORY_MATCH = {
    "": [], // tất cả
    dien: ["dien", "điện", "gia dung"], // Đồ điện gia dụng
    mat: ["mat", "mát", "làm mát", "quat", "quạt"],
    "noi-that": ["noi that", "nội thất"],
  };

  // ------- LỌC + SẮP XẾP (tính toán tối ưu bằng useMemo) -------
  const filteredSorted = useMemo(() => {
    const search = normalizeVN(searchTerm);

    // 1) Lọc
    const filtered = products.filter((p) => {
      const nameNorm = normalizeVN(p.name);
      const catNorm = normalizeVN(p.category);

      // Lọc theo search (tên hoặc danh mục)
      const matchSearch =
        !search || nameNorm.includes(search) || catNorm.includes(search);

      // Lọc theo danh mục
      const chosen = CATEGORY_MATCH[selectedCategory] || [];
      const matchCategory =
        !selectedCategory || chosen.some((kw) => catNorm.includes(kw)); // chỉ cần chứa 1 từ khóa

      return matchSearch && matchCategory;
    });

    // 2) Sắp xếp
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "gia-tang":
          return a.price - b.price;
        case "gia-giam":
          return b.price - a.price;
        case "ten":
          return a.name.localeCompare(b.name, "vi", { sensitivity: "base" });
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, searchTerm, selectedCategory, sortOption]);

  const categories = [
    {
      icon: "⚡",
      title: "Đồ điện gia dụng",
      value: "dien",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      icon: "🌀",
      title: "Thiết bị làm mát",
      value: "mat",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      icon: "🪑",
      title: "Nội thất phòng ăn",
      value: "noi-that",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      icon: "💡",
      title: "Đèn chiếu sáng",
      value: "den",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
    {
      icon: "🍳",
      title: "Thiết bị nhà bếp",
      value: "bep",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
    {
      icon: "🛏️",
      title: "Nội thất phòng ngủ",
      value: "phong-ngu",
      gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    },
  ];

  // (giữ nguyên phần chèn link quản lý của bạn)
  useEffect(() => {
    if (!user || user.role !== "admin") return;
    const insertAdminLink = () => {
      const candidates = Array.from(
        document.querySelectorAll(
          ".dropdown-menu, .hl-dropdown, .user-menu, .hl-dropdown-card, .list-group"
        )
      );
      for (const menu of candidates) {
        const items = Array.from(menu.querySelectorAll("a,button"));
        const settingsItem = items.find((el) =>
          /thông tin|cài đặt/i.test(el.textContent || "")
        );
        const logoutItem = items.find((el) =>
          /đăng xuất/i.test(el.textContent || "")
        );
        if (settingsItem && logoutItem) {
          if (menu.querySelector("#hl-admin-link")) return;
          const adminLink = document.createElement("a");
          adminLink.id = "hl-admin-link";
          adminLink.href = "/admin";
          adminLink.textContent = "Quản lý";
          adminLink.className = settingsItem.className || "dropdown-item";
          logoutItem.parentNode.insertBefore(adminLink, logoutItem);
          return;
        }
      }
    };
    const t = setTimeout(insertAdminLink, 0);
    const observer = new MutationObserver(insertAdminLink);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      clearTimeout(t);
      observer.disconnect();
    };
  }, [user]);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-modern">
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>

        <div className="container">
          <div className="row align-items-center min-vh-100 py-5">
            <div className="col-lg-6 hero-content-left">
              <div className="badge bg-white bg-opacity-25 text-white px-4 py-2 rounded-pill mb-4 d-inline-block">
                ✨ Chào mừng đến với HomeLiving
              </div>
              <h1 className="display-2 fw-bold text-white mb-4 hero-title">
                Biến Ngôi Nhà
                <br />
                Thành <span className="text-gradient">Thiên Đường</span>
              </h1>
              <p
                className="lead text-white mb-4 fs-4"
                style={{ opacity: 0.95 }}
              >
                Khám phá bộ sưu tập đồ gia dụng và nội thất cao cấp với thiết kế
                hiện đại, chất lượng vượt trội và giá cả hợp lý nhất thị trường.
              </p>
              <div className="hero-stats mb-5">
                <div className="row g-4 text-white">
                  <div className="col-4">
                    <h3 className="fw-bold mb-0">5000+</h3>
                    <small className="opacity-75">Sản phẩm</small>
                  </div>
                  <div className="col-4">
                    <h3 className="fw-bold mb-0">50K+</h3>
                    <small className="opacity-75">Khách hàng</small>
                  </div>
                  <div className="col-4">
                    <h3 className="fw-bold mb-0">4.9⭐</h3>
                    <small className="opacity-75">Đánh giá</small>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-3 flex-wrap">
                <a
                  href="#products"
                  className="btn btn-light btn-lg px-5 rounded-pill shadow-lg"
                >
                  <span className="me-2">🛍️</span> Mua sắm ngay
                </a>
                <a
                  href="#categories"
                  className="btn btn-outline-light btn-lg px-5 rounded-pill"
                >
                  <span className="me-2">📦</span> Khám phá
                </a>
              </div>
            </div>

            <div className="col-lg-6 d-none d-lg-block">
              <div className="hero-image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800"
                  alt="Modern Living Room"
                  className="hero-main-image"
                />
                <div className="floating-card card-1">
                  <span className="emoji">🏠</span>
                  <div>
                    <strong>Nội thất cao cấp</strong>
                    <p className="mb-0 small">Thiết kế hiện đại</p>
                  </div>
                </div>
                <div className="floating-card card-2">
                  <span className="emoji">🚚</span>
                  <div>
                    <strong>Giao hàng miễn phí</strong>
                    <p className="mb-0 small">Toàn quốc</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-section py-4 bg-white shadow-sm">
        <div className="container">
          <div className="row g-4 align-items-center justify-content-center text-center">
            <div className="col-6 col-md-3">
              <div className="d-flex align-items-center justify-content-center gap-2">
                <span className="fs-3">🚚</span>
                <div className="text-start">
                  <strong className="d-block small">Miễn phí ship</strong>
                  <small className="text-muted">Đơn từ 500K</small>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="d-flex align-items-center justify-content-center gap-2">
                <span className="fs-3">🔒</span>
                <div className="text-start">
                  <strong className="d-block small">Thanh toán bảo mật</strong>
                  <small className="text-muted">100% an toàn</small>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="d-flex align-items-center justify-content-center gap-2">
                <span className="fs-3">↩️</span>
                <div className="text-start">
                  <strong className="d-block small">Đổi trả 7 ngày</strong>
                  <small className="text-muted">Miễn phí</small>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="d-flex align-items-center justify-content-center gap-2">
                <span className="fs-3">💬</span>
                <div className="text-start">
                  <strong className="d-block small">Hỗ trợ 24/7</strong>
                  <small className="text-muted">Tư vấn nhiệt tình</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-5 bg-light" id="categories">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-3">
              Danh Mục Sản Phẩm
            </span>
            <h2 className="display-5 fw-bold mb-3">Khám Phá Theo Danh Mục</h2>
            <p className="text-muted fs-5">
              Tìm kiếm sản phẩm phù hợp với không gian của bạn
            </p>
          </div>

          <div className="row g-4">
            {categories.map((category, index) => (
              <div key={index} className="col-6 col-md-4 col-lg-2">
                <div
                  className="category-card-modern h-100"
                  style={{ background: category.gradient }}
                >
                  <div className="category-icon-modern">{category.icon}</div>
                  <h6 className="text-white fw-bold mb-0">{category.title}</h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-5" id="products">
        <div className="container py-4">
          <div className="text-center mb-4">
            <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill mb-3">
              ⭐ Sản Phẩm Nổi Bật
            </span>
            <h2 className="display-5 fw-bold mb-1">Bán Chạy Nhất Tháng</h2>
            <p className="text-muted fs-6 mb-0">
              Đang hiển thị <strong>{filteredSorted.length}</strong> /{" "}
              {products.length} sản phẩm
            </p>
          </div>

          {/* Search & Filter */}
          <div className="row g-3 mb-4">
            <div className="col-md-5">
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-white border-end-0">
                  🔎
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select form-select-lg"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">🏷️ Tất cả danh mục</option>
                <option value="dien">⚡ Đồ điện gia dụng</option>
                <option value="mat">🌀 Thiết bị làm mát</option>
                <option value="noi-that">🪑 Nội thất</option>
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select form-select-lg"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">⚡ Sắp xếp</option>
                <option value="gia-tang">🟡 Giá tăng dần</option>
                <option value="gia-giam">🔵 Giá giảm dần</option>
                <option value="ten">🔤 Tên A-Z</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <p className="text-center text-muted my-5">Đang tải sản phẩm…</p>
          ) : filteredSorted.length === 0 ? (
            <div className="text-center text-muted py-5">
              <div className="mb-2">🙈 Không tìm thấy sản phẩm phù hợp.</div>
              <small>Hãy thử xoá từ khoá hoặc đổi bộ lọc nhé.</small>
            </div>
          ) : (
            <div className="row g-4 mb-4">
              {filteredSorted.map((product) => (
                <div key={product.id} className="col-sm-6 col-lg-4 col-xl-3">
                  <div className="product-card-modern">
                    <div className="product-image-wrapper">
                      <img
                        src={product.image}
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/300x300?text=No+Image";
                        }}
                        onClick={() => navigate(`/product/${product.id}`)}
                        style={{ cursor: "pointer" }}
                      />
                      {product.stock < 10 && (
                        <span className="badge bg-danger position-absolute top-0 end-0 m-3">
                          🔥 Sắp hết
                        </span>
                      )}
                    </div>

                    <div className="product-info-modern">
                      <span className="badge bg-light text-muted mb-2">
                        {product.category}
                      </span>
                      <h6
                        className="fw-bold mb-2"
                        onClick={() => navigate(`/product/${product.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        {product.name}
                      </h6>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <span className="h5 text-primary fw-bold mb-0">
                          {product.price.toLocaleString("vi-VN")}₫
                        </span>
                        <div className="text-warning small">
                          ⭐⭐⭐⭐⭐ <span className="text-muted">(4.8)</span>
                        </div>
                      </div>
                      <button
                        className="btn btn-primary w-100 rounded-pill"
                        onClick={() => addItem(product, 1)}
                      >
                        🛒 Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <button className="btn btn-outline-primary btn-lg px-5 rounded-pill">
              Xem tất cả 5000+ sản phẩm →
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-modern py-5">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center text-white">
              <span className="fs-1 mb-4 d-block">📧</span>
              <h2 className="display-5 fw-bold mb-3">Đăng Ký Nhận Ưu Đãi</h2>
              <p className="lead mb-4 opacity-90">
                Nhận mã giảm giá <strong>100K</strong> cho đơn hàng đầu tiên và
                cập nhật sản phẩm mới nhất
              </p>
              <div className="row g-2 justify-content-center">
                <div className="col-md-7">
                  <input
                    type="email"
                    className="form-control form-control-lg rounded-pill px-4"
                    placeholder="✉️ Nhập email của bạn..."
                  />
                </div>
                <div className="col-md-4">
                  <button className="btn btn-light btn-lg w-100 rounded-pill fw-bold">
                    Đăng ký ngay
                  </button>
                </div>
              </div>
              <p className="small mt-3 opacity-75">
                🔒 Chúng tôi cam kết bảo mật thông tin của bạn
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
