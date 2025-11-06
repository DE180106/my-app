import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom"; // 🔹 Dùng để điều hướng
import "../styles/Payment.css";

export default function Payment() {
  const navigate = useNavigate();
  const { items, subtotal, addItem, decreaseItem, removeItem, clearCart } =
    useCart();

  const taxRate = 0.1;
  const tax = subtotal * taxRate;

  // 🔹 map phí ship cho từng sản phẩm
  const [shippingMap, setShippingMap] = useState(() =>
    Object.fromEntries(items.map((i) => [i.id, 0]))
  );

  // 🔹 đồng bộ shippingMap khi giỏ thay đổi
  useEffect(() => {
    setShippingMap((prev) => {
      const next = { ...prev };
      for (const it of items) if (!(it.id in next)) next[it.id] = 0;
      Object.keys(next).forEach((k) => {
        if (!items.find((it) => String(it.id) === String(k))) delete next[k];
      });
      return next;
    });
  }, [items]);

  // 🔹 tổng phí vận chuyển
  const shippingTotal = useMemo(
    () => items.reduce((s, it) => s + (shippingMap[it.id] || 0), 0),
    [items, shippingMap]
  );

  const total = subtotal + tax + shippingTotal;

  const formatVND = (n) =>
    (n || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  // 🔹 Khi nhấn “Đặt hàng ngay”
  const handlePlaceOrder = () => {
    if (items.length === 0) {
      alert("🛒 Giỏ hàng của bạn đang trống!");
      return;
    }

    // ✅ Tạo đơn hàng mới
    const order = {
      id: "ODR" + Date.now(),
      date: new Date().toLocaleDateString("vi-VN"),
      total,
      tax,
      shippingTotal,
      items,
    };

    // ✅ Lưu vào localStorage
    const existing = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem("orders", JSON.stringify([order, ...existing]));

    alert(
      "🎉 Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại HomeLiving Store!"
    );
    clearCart();
    navigate("/your-orders"); // ✅ Chuyển hướng sang trang Your Orders
  };

  return (
    <div className="payment-container">
      <h3 className="page-title">Xem lại đơn hàng của bạn</h3>

      <div className="payment-content">
        {/* LEFT COLUMN */}
        <div className="payment-items">
          {items.map((item) => (
            <div key={item.id} className="payment-card">
              <p className="delivery-date">
                Ngày giao hàng dự kiến:{" "}
                <span className="text-success">Thứ Hai, 17 Tháng 11</span>
              </p>

              <div className="row">
                <div className="image-col">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="info-col">
                  <h5>{item.name}</h5>
                  <p className="price text-danger">{formatVND(item.price)}</p>

                  {/* Nhóm tăng giảm số lượng */}
                  <div className="quantity-control">
                    <button
                      className="qty-btn"
                      onClick={() => decreaseItem(item.id)}
                    >
                      −
                    </button>
                    <span className="qty-display">{item.qty}</span>
                    <button
                      className="qty-btn"
                      onClick={() => addItem(item, 1)}
                    >
                      +
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => removeItem(item.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </div>

                <div className="shipping-col">
                  <p>
                    <strong>Chọn phương thức giao hàng:</strong>
                  </p>

                  <label>
                    <input
                      type="radio"
                      name={`ship-${item.id}`}
                      checked={(shippingMap[item.id] || 0) === 0}
                      onChange={() =>
                        setShippingMap({ ...shippingMap, [item.id]: 0 })
                      }
                    />
                    Thứ Hai, 17 Tháng 11 <br />
                    <span className="sub-text text-success">
                      Miễn phí vận chuyển
                    </span>
                  </label>

                  <label>
                    <input
                      type="radio"
                      name={`ship-${item.id}`}
                      checked={(shippingMap[item.id] || 0) === 120000}
                      onChange={() =>
                        setShippingMap({ ...shippingMap, [item.id]: 120000 })
                      }
                    />
                    Thứ Ba, 11 Tháng 11 <br />
                    <span className="sub-text">
                      + {formatVND(120000)} — Giao nhanh
                    </span>
                  </label>

                  <label>
                    <input
                      type="radio"
                      name={`ship-${item.id}`}
                      checked={(shippingMap[item.id] || 0) === 250000}
                      onChange={() =>
                        setShippingMap({ ...shippingMap, [item.id]: 250000 })
                      }
                    />
                    Thứ Sáu, 7 Tháng 11 <br />
                    <span className="sub-text">
                      + {formatVND(250000)} — Hỏa tốc
                    </span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN */}
        <div className="order-summary">
          <h5>Tóm tắt đơn hàng</h5>

          <div className="summary-row">
            <span>Sản phẩm ({items.length}):</span>
            <span>{formatVND(subtotal)}</span>
          </div>

          <div className="summary-row">
            <span>Phí vận chuyển:</span>
            <span>{formatVND(shippingTotal)}</span>
          </div>

          <div className="summary-row">
            <span>Thuế (10%):</span>
            <span>{formatVND(tax)}</span>
          </div>

          <hr />

          <div className="summary-row total">
            <strong>Tổng cộng:</strong>
            <strong className="text-danger">{formatVND(total)}</strong>
          </div>

          <button className="place-order-btn" onClick={handlePlaceOrder}>
            Đặt hàng ngay
          </button>
        </div>
      </div>
    </div>
  );
}
