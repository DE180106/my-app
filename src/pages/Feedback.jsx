import React, { useEffect, useMemo, useState } from "react";
import "../styles/Feedback.css";
import { useAuth } from "../context/AuthContext";

const STORAGE_KEY = "hl_feedback";

const loadFeedback = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const saveFeedback = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

// Nút sao đơn giản
const Star = ({ filled, onClick, onMouseEnter, onMouseLeave, size = 22 }) => (
  <svg
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    style={{ cursor: "pointer" }}
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

// Bộ chọn rating 1–5 sao
const StarRating = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          filled={n <= (hover || value)}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
        />
      ))}
      <span className="stars-label">
        {value ? `${value}/5` : "Chưa đánh giá"}
      </span>
    </div>
  );
};

const Feedback = () => {
  const { user } = useAuth(); // nếu đã đăng nhập: {name, email,...}
  const [items, setItems] = useState(() => loadFeedback());
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    rating: 0,
    message: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // cập nhật form nếu user thay đổi (đăng nhập/đăng xuất)
    setForm((f) => ({
      ...f,
      name: user?.name || "",
      email: user?.email || "",
    }));
  }, [user]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...items].sort((a, b) => b.createdAt - a.createdAt);
    return items
      .filter(
        (it) =>
          it.name.toLowerCase().includes(q) ||
          it.email.toLowerCase().includes(q) ||
          it.message.toLowerCase().includes(q)
      )
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [items, query]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Vui lòng nhập tên.";
    if (!form.email.trim()) e.email = "Vui lòng nhập email.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Email không hợp lệ.";
    if (!form.rating || form.rating < 1)
      e.rating = "Vui lòng chọn số sao (1-5).";
    if (!form.message.trim()) e.message = "Vui lòng nhập nội dung.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const newItem = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      rating: form.rating,
      message: form.message.trim(),
      createdAt: Date.now(),
    };
    const list = [newItem, ...items];
    setItems(list);
    saveFeedback(list);
    // reset message + rating, giữ tên & email
    setForm((f) => ({ ...f, rating: 0, message: "" }));
  };

  const handleDelete = (id) => {
    const list = items.filter((it) => it.id !== id);
    setItems(list);
    saveFeedback(list);
  };

  return (
    <div className="feedback-page container">
      <h1 className="title">Feedback</h1>

      <section className="feedback-form-card">
        <h2 className="section-title">Gửi phản hồi</h2>
        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-row">
            <label>Họ & Tên</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Nhập tên của bạn"
              readOnly={!!user?.name}
              className={errors.name ? "invalid" : ""}
            />
            {errors.name && <div className="error">{errors.name}</div>}
          </div>
          <div className="form-row">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="email@domain.com"
              readOnly={!!user?.email}
              className={errors.email ? "invalid" : ""}
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>
          <div className="form-row">
            <label>Đánh giá</label>
            <StarRating
              value={form.rating}
              onChange={(n) => setForm((f) => ({ ...f, rating: n }))}
            />
            {errors.rating && <div className="error">{errors.rating}</div>}
          </div>
          <div className="form-row">
            <label>Nội dung</label>
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) =>
                setForm((f) => ({ ...f, message: e.target.value }))
              }
              placeholder="Chia sẻ trải nghiệm của bạn..."
              className={errors.message ? "invalid" : ""}
            />
            {errors.message && <div className="error">{errors.message}</div>}
          </div>
          <button type="submit" className="btn-primary">
            Gửi feedback
          </button>
        </form>
      </section>

      <section className="feedback-list-card">
        <div className="list-header">
          <h2 className="section-title">Tất cả phản hồi</h2>
          <input
            className="search"
            placeholder="Tìm theo tên, email, nội dung…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <p className="muted">Chưa có feedback nào.</p>
        ) : (
          <ul className="feedback-list">
            {filtered.map((it) => (
              <li key={it.id} className="feedback-item">
                <div className="item-head">
                  <div className="who">
                    <div className="avatar">
                      {it.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="name">{it.name}</div>
                      <div className="email">{it.email}</div>
                    </div>
                  </div>
                  <div className="rating">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} filled={idx < it.rating} size={18} />
                    ))}
                  </div>
                </div>
                <p className="message">{it.message}</p>
                <div className="item-foot">
                  <span className="time">
                    {new Date(it.createdAt).toLocaleString()}
                  </span>
                  {/* Cho phép người đã đăng nhập xoá (hoặc chỉ admin nếu bạn có role) */}
                  {true && (
                    <button
                      className="btn-link danger"
                      onClick={() => handleDelete(it.id)}
                    >
                      Xoá
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Feedback;
