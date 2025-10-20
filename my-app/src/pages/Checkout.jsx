import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart, format } from "./CartContext";

export default function Checkout() {
  const { items, subtotal, shipping, total, clear } = useCart();
  const nav = useNavigate();
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", address: "", payment: "cod" });
  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.address) {
      alert("Vui lòng điền đầy đủ Họ tên, SĐT và Địa chỉ.");
      return;
    }
    console.log("ORDER:", { form, items, total });
    clear();
    alert("Đặt hàng thành công!");
    nav("/");
  };

  if (!items.length) return <div className="container" style={{ padding: 24 }}><h2>Checkout</h2><p>Giỏ hàng trống.</p></div>;

  return (
    <div className="container" style={{ padding: 24, maxWidth: 960 }}>
      <h2 className="mb-3">Thanh toán</h2>
      <div className="row g-4">
        <div className="col-md-7">
          <form onSubmit={onSubmit} className="vstack gap-3">
            <div><label className="form-label">Họ và tên</label><input name="fullName" className="form-control" value={form.fullName} onChange={onChange}/></div>
            <div className="row">
              <div className="col-md-6"><label className="form-label">Số điện thoại</label><input name="phone" className="form-control" value={form.phone} onChange={onChange}/></div>
              <div className="col-md-6"><label className="form-label">Email (tuỳ chọn)</label><input name="email" type="email" className="form-control" value={form.email} onChange={onChange}/></div>
            </div>
            <div><label className="form-label">Địa chỉ giao hàng</label><textarea name="address" rows={3} className="form-control" value={form.address} onChange={onChange}/></div>
            <div>
              <label className="form-label">Phương thức thanh toán</label>
              <select name="payment" className="form-select" value={form.payment} onChange={onChange}>
                <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                <option value="bank">Chuyển khoản ngân hàng</option>
                <option value="card">Thẻ (giả lập)</option>
              </select>
            </div>
            <button className="btn btn-primary" type="submit">Đặt hàng</button>
          </form>
        </div>
        <div className="col-md-5">
          <div className="card">
            <div className="card-header fw-semibold">Đơn hàng</div>
            <div className="card-body">
              <ul className="list-group list-group-flush mb-3">
                {items.map(i => (
                  <li key={i.id} className="list-group-item d-flex justify-content-between">
                    <span>{i.title} × {i.qty}</span>
                    <span>{format(i.price * i.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="d-flex justify-content-between"><span>Tạm tính</span><span>{format(subtotal)}</span></div>
              <div className="d-flex justify-content-between"><span>Vận chuyển</span><span>{format(shipping)}</span></div>
              <hr/>
              <div className="d-flex justify-content-between fw-bold"><span>Tổng</span><span>{format(total)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
