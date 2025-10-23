// src/components/CartDrawer.jsx
import React from "react";
import { useCart } from "../context/CartContext";
import "../styles/CartDrawer.css";

export default function CartDrawer({ isOpen, onClose }) {
  const { items, subtotal, addItem, decreaseItem, removeItem, clearCart } =
    useCart();

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? "show" : ""}`}
        onClick={onClose}
      />
      <aside
        className={`cart-drawer ${isOpen ? "open" : ""}`}
        aria-hidden={!isOpen}
      >
        <div className="cart-header d-flex justify-content-between align-items-center">
          <h5 className="m-0">🛒 Giỏ hàng ({items.length})</h5>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>

        <div className="cart-body">
          {items.length === 0 ? (
            <p className="text-muted">Chưa có sản phẩm nào.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="info">
                  <div className="d-flex justify-content-between align-items-start">
                    <strong>{item.name}</strong>
                    <button
                      className="btn btn-sm btn-link text-danger text-decoration-none"
                      onClick={() => removeItem(item.id)}
                    >
                      Xóa
                    </button>
                  </div>
                  <div className="d-flex align-items-center gap-2 mt-2">
                    <button
                      className="qty-btn"
                      onClick={() => decreaseItem(item.id)}
                    >
                      -
                    </button>
                    <span className="fw-semibold">{item.qty}</span>
                    <button
                      className="qty-btn"
                      onClick={() => addItem(item, 1)}
                    >
                      +
                    </button>
                    <span className="ms-auto fw-semibold">
                      {(item.price * item.qty).toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="d-flex justify-content-between">
              <span>Tạm tính</span>
              <strong>{subtotal.toLocaleString("vi-VN")}₫</strong>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button
                className="btn btn-outline-danger w-50"
                onClick={clearCart}
              >
                Xóa hết
              </button>
              <button className="btn btn-primary w-50">Thanh toán</button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
