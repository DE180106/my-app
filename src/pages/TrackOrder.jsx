import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/TrackOrder.css";

export default function TrackOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("orders") || "[]");
    const found = stored.find((o) => o.id === id);
    setOrder(found || null);
  }, [id]);

  if (!order)
    return (
      <div className="track-container">
        <p>Không tìm thấy đơn hàng.</p>
        <Link to="/your-orders">← Quay lại danh sách đơn hàng</Link>
      </div>
    );

  return (
    <div className="track-container">
      <Link to="/your-orders" className="back-link">
        ← Xem tất cả đơn hàng
      </Link>

      <h3>Đang giao vào Thứ Ba, 18 Tháng 11</h3>
      <div className="track-items">
        {order.items.map((item) => (
          <div key={item.id} className="track-item">
            <img src={item.image} alt={item.name} />
            <div>
              <h5>{item.name}</h5>
              <p>Số lượng: {item.qty}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="progress-labels">
        <span className="active">Đang chuẩn bị</span>
        <span>Đang giao</span>
        <span>Đã giao</span>
      </div>

      <div className="progress-bar">
        <div className="progress" style={{ width: "25%" }}></div>
      </div>
    </div>
  );
}
