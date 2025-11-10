import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/YourOrders.css";

export default function YourOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const { addItem } = useCart();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(stored);
  }, []);

  const formatVND = (n) =>
    n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const handleBuyAgain = (item) => {
    addItem(item, 1);
    navigate("/#products"); // hoặc "/" tùy cấu trúc bạn
  };

  const handleTrack = (orderId) => {
    navigate(`/track-order/${orderId}`);
  };

  if (orders.length === 0)
    return (
      <div className="orders-empty">
        <h3>Bạn chưa có đơn hàng nào</h3>
        <p>Hãy quay lại trang sản phẩm và đặt hàng nhé!</p>
      </div>
    );

  return (
    <div className="orders-page">
      <h2 className="orders-title">Đơn hàng của bạn</h2>

      {orders.map((order) => (
        <div key={order.id} className="order-box">
          <div className="order-header">
            <div>
              <p>
                <strong>Ngày đặt:</strong> {order.date}
              </p>
              <p>
                <strong>Tổng cộng:</strong> {formatVND(order.total)}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                <span className="status-tag">{order.status}</span>
              </p>
            </div>
            <div>
              <p>
                <strong>Mã đơn hàng:</strong> {order.id}
              </p>
              {order.receiver && (
                <p>
                  <strong>Người nhận:</strong> {order.receiver.name}
                </p>
              )}
            </div>
          </div>

          <div className="order-body">
            {order.items.map((item) => (
              <div key={item.id} className="order-item">
                <div className="order-item-left">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h5>{item.name}</h5>
                    {order.receiver && (
                      <p>
                        Ngày giao dự kiến:{" "}
                        <span className="text-success">
                          {order.receiver.deliveryDate}
                        </span>
                      </p>
                    )}
                    <p>Số lượng: {item.qty}</p>
                    <button
                      className="buy-again-btn"
                      onClick={() => handleBuyAgain(item)}
                    >
                      🛒 Mua lại
                    </button>
                  </div>
                </div>

                <div className="order-item-right">
                  <button
                    className="track-btn"
                    onClick={() => handleTrack(order.id)}
                  >
                    Theo dõi đơn hàng
                  </button>
                </div>
              </div>
            ))}
          </div>

          {order.receiver && (
            <div className="order-footer">
              <p>
                <strong>Địa chỉ giao hàng:</strong> {order.receiver.address},
                SĐT: {order.receiver.phone}
              </p>
              {order.receiver.note && (
                <p>
                  <strong>Ghi chú:</strong> {order.receiver.note}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
