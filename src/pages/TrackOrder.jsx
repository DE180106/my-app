import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/TrackOrder.css";

export default function TrackOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  // ✅ Giả lập dữ liệu localStorage hoặc JSON Server
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("orders") || "[]");
    const found = stored.find((o) => o.id === id);
    setOrder(found || null);
  }, [id]);

  // ✅ Nếu không tìm thấy đơn hàng
  if (!order)
    return (
      <div className="track-container">
        <p>Không tìm thấy đơn hàng.</p>
        <Link to="/your-orders" className="back-link">
          ← Quay lại danh sách đơn hàng
        </Link>
      </div>
    );

  // ✅ Xác định tiến trình giao hàng theo status
  const progressMap = {
    preparing: 25,
    shipping: 65,
    delivered: 100,
  };

  const progressWidth = progressMap[order.status] || 25;
  const statusText =
    order.status === "delivered"
      ? "Đơn hàng đã giao thành công"
      : order.status === "shipping"
      ? "Đơn hàng đang được giao"
      : "Đơn hàng đang được chuẩn bị";

  return (
    <div className="track-container">
      <Link to="/your-orders" className="back-link">
        ← Xem tất cả đơn hàng
      </Link>

      {/* 🏷️ Thông tin chung đơn hàng */}
      <div className="order-info">
        <h2>Mã đơn: {order.id}</h2>
        <p>
          <b>Ngày đặt:</b> {order.date}
        </p>
        <p>
          <b>Thanh toán:</b> {order.payment || "Khi nhận hàng (COD)"}
        </p>
        <p>
          <b>Trạng thái:</b>{" "}
          <span className={`status-label ${order.status}`}>{statusText}</span>
        </p>
      </div>

      {/* 📦 Danh sách sản phẩm */}
      <div className="track-items">
        {order.items.map((item) => (
          <div key={item.id} className="track-item">
            <img src={item.image} alt={item.name} />
            <div>
              <h5>{item.name}</h5>
              <p>Số lượng: {item.qty}</p>
              <p>
                Giá:{" "}
                <b>
                  {item.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </b>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 💰 Tổng kết */}
      <div className="order-summary">
        <p>
          Tổng giá trị đơn:{" "}
          <b>
            {order.total
              ? order.total.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })
              : "—"}
          </b>
        </p>
      </div>

      {/* 📊 Tiến trình giao hàng */}
      <h3>{statusText}</h3>
      <div className="progress-labels">
        <span className={order.status !== "preparing" ? "active" : ""}>
          Chuẩn bị hàng
        </span>
        <span
          className={
            order.status === "shipping" || order.status === "delivered"
              ? "active"
              : ""
          }
        >
          Đang giao
        </span>
        <span className={order.status === "delivered" ? "active" : ""}>
          Đã giao
        </span>
      </div>

      <div className="progress-bar">
        <div className="progress" style={{ width: `${progressWidth}%` }}></div>
      </div>
    </div>
  );
}
