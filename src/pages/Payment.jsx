import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../styles/Payment.css";

export default function Payment() {
  const navigate = useNavigate();
  const { items, subtotal, addItem, decreaseItem, removeItem, clearCart } =
    useCart();

  const taxRate = 0.1;
  const tax = subtotal * taxRate;

  // ✅ map phí ship cho từng sản phẩm
  const [shippingMap, setShippingMap] = useState(() =>
    Object.fromEntries(items.map((i) => [i.id, 0]))
  );

  // ✅ đồng bộ shippingMap khi giỏ thay đổi
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

  const shippingTotal = useMemo(
    () => items.reduce((s, it) => s + (shippingMap[it.id] || 0), 0),
    [items, shippingMap]
  );

  const total = subtotal + tax + shippingTotal;
  const formatVND = (n) =>
    (n || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  // ✅ form thông tin người nhận
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [note, setNote] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  // ✅ Khi nhấn “Đặt hàng ngay”
  const handlePlaceOrder = () => {
    if (items.length === 0) {
      alert("🛒 Giỏ hàng của bạn đang trống!");
      return;
    }

    if (!receiverName || !receiverPhone || !receiverAddress) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin người nhận!");
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
      status: "Đang chuẩn bị",
      receiver: {
        name: receiverName,
        phone: receiverPhone,
        address: receiverAddress,
        note,
        deliveryDate: deliveryDate || "Chưa chọn ngày",
      },
    };

    // ✅ Lưu vào localStorage
    const existing = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem("orders", JSON.stringify([order, ...existing]));

    alert(
      "🎉 Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại HomeLiving Store!"
    );
    clearCart();
    navigate("/your-orders");
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
                <span className="text-success">
                  {deliveryDate || "Chưa chọn ngày"}
                </span>
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
                    Giao tiêu chuẩn (3–5 ngày)
                    <br />
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
                    Giao nhanh (1–2 ngày)
                    <br />
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
                    Giao hỏa tốc (trong ngày)
                    <br />
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
          <h5>Thông tin giao hàng</h5>
          <input
            type="text"
            placeholder="Họ và tên người nhận"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Số điện thoại"
            value={receiverPhone}
            onChange={(e) => setReceiverPhone(e.target.value)}
          />
          <input
            type="text"
            placeholder="Địa chỉ giao hàng"
            value={receiverAddress}
            onChange={(e) => setReceiverAddress(e.target.value)}
          />
          <textarea
            placeholder="Ghi chú (tuỳ chọn)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <label>
            Ngày giao hàng mong muốn:
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
            />
          </label>

          <h5 style={{ marginTop: "20px" }}>Tóm tắt đơn hàng</h5>
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
