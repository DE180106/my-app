// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const API_URL = "http://localhost:9999/products";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch((err) => {
        console.error(err);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="container py-5 text-center">Đang tải…</div>;
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <p>Không tìm thấy sản phẩm.</p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <nav className="mb-3 small">
        <Link to="/" className="text-decoration-none">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </nav>

      <div className="row g-4">
        <div className="col-md-5">
          <div className="border rounded p-3">
            <img
              src={product.image}
              alt={product.name}
              className="img-fluid"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/500x500?text=No+Image";
              }}
            />
          </div>
        </div>

        <div className="col-md-7">
          <h1 className="h3 fw-bold mb-3">{product.name}</h1>
          <div className="mb-2">
            <span className="badge bg-light text-muted">
              {product.category || "Uncategorized"}
            </span>
          </div>
          <div className="fs-4 fw-semibold mb-3">
            {Number(product.price)?.toLocaleString("vi-VN")} ₫
          </div>
          <p className="text-muted" style={{ whiteSpace: "pre-line" }}>
            {product?.description?.trim() ? product.description : "No description."}
            </p>
          <div className="d-flex gap-2 mt-4">
            <button className="btn btn-primary" onClick={() => addItem(product, 1)}>
              🛒 Thêm vào giỏ
            </button>
            <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
              ← Quay lại
            </button>
          </div>

          <ul className="list-unstyled mt-4 small text-muted">
            <li>• Tồn kho: {product.stock ?? "-"}</li>
            {product.brand && <li>• Thương hiệu: {product.brand}</li>}
            {product.sku && <li>• Mã SKU: {product.sku}</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
