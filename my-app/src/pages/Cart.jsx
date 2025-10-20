import { Link } from "react-router-dom";
import { useCart, format } from "./CartContext";

export default function Cart() {
  const { items, subtotal, shipping, total, inc, dec, remove } = useCart();

  if (!items.length) {
    return (
      <div className="container" style={{ padding: 24 }}>
        <h2>Giỏ hàng</h2>
        <p>Chưa có sản phẩm.</p>
        <Link className="btn btn-primary" to="/">Tiếp tục mua sắm</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 24 }}>
      <h2 className="mb-3">Giỏ hàng</h2>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th className="text-center">Giá</th>
              <th className="text-center">Số lượng</th>
              <th className="text-end">Thành tiền</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(p => (
              <tr key={p.id}>
                <td>
                  <div className="d-flex align-items-center gap-3">
                    {p.image && <img alt={p.title} src={p.image} style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8 }} />}
                    <div>
                      <div className="fw-semibold">{p.title}</div>
                      {p.sku && <small className="text-muted">SKU: {p.sku}</small>}
                    </div>
                  </div>
                </td>
                <td className="text-center">{format(p.price)}</td>
                <td className="text-center">
                  <div className="btn-group">
                    <button className="btn btn-outline-secondary" onClick={() => dec(p.id)}>-</button>
                    <button className="btn btn-light" disabled>{p.qty}</button>
                    <button className="btn btn-outline-secondary" onClick={() => inc(p.id)}>+</button>
                  </div>
                </td>
                <td className="text-end">{format(p.price * p.qty)}</td>
                <td className="text-end">
                  <button className="btn btn-link text-danger" onClick={() => remove(p.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td colSpan={3}></td><td className="text-end"><strong>Tạm tính:</strong></td><td className="text-end">{format(subtotal)}</td></tr>
            <tr><td colSpan={3}></td><td className="text-end"><strong>Phí vận chuyển:</strong></td><td className="text-end">{format(shipping)}</td></tr>
            <tr><td colSpan={3}></td><td className="text-end"><strong>Tổng:</strong></td><td className="text-end fw-bold">{format(total)}</td></tr>
          </tfoot>
        </table>
      </div>
      <div className="d-flex justify-content-end gap-2">
        <Link className="btn btn-outline-secondary" to="/">Tiếp tục mua sắm</Link>
        <Link className="btn btn-primary" to="/checkout">Thanh toán</Link>
      </div>
    </div>
  );
}
