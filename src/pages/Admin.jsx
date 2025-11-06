import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:9999";

const withStableIds = (arr) =>
  (arr || []).map((p) => ({
    ...p,
    id: p.id ?? Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`),
    price: Number(p.price || 0),
    stock: Number(p.stock || 0),
  }));

export default function Admin() {
  const { user } = useAuth();
  const [activeScreen, setActiveScreen] = useState("menu");

  // ===== PRODUCTS =====
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("Tất cả");

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((r) => r.json())
      .then((data) => setProducts(withStableIds(data)))
      .catch(() => setProducts([]));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      alert("Vui lòng nhập đủ thông tin!");
      return;
    }

    const payload = {
      name: form.name,
      price: Number(form.price),
      category: form.category,
      stock: Number(form.stock || 0),
      image: form.image || "",
    };

    if (editingId) {
      await fetch(`${API_URL}/products/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setEditingId(null);
    } else {
      await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    const updated = await fetch(`${API_URL}/products`).then((r) => r.json());
    setProducts(updated);
    setForm({ name: "", price: "", category: "", stock: "", image: "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xoá sản phẩm này?")) return;
    await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price: p.price,
      category: p.category,
      stock: p.stock,
      image: p.image,
    });
  };

  const filtered = useMemo(() => {
    const s = search.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(s) &&
        (filterCategory === "Tất cả" || p.category === filterCategory)
    );
  }, [products, search, filterCategory]);

  // ===== USERS =====
  const [usersList, setUsersList] = useState([]);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [userEditingId, setUserEditingId] = useState(null);
  const [userSearch, setUserSearch] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/users`)
      .then((r) => r.json())
      .then((data) => setUsersList(data))
      .catch(() => setUsersList([]));
  }, []);

  const handleUserChange = (e) =>
    setUserForm({ ...userForm, [e.target.name]: e.target.value });

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = userForm;
    if (!name || !email || (!userEditingId && !password)) {
      alert("Vui lòng nhập đủ thông tin!");
      return;
    }

    const payload = { name, email, password, role };

    if (userEditingId) {
      await fetch(`${API_URL}/users/${userEditingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setUserEditingId(null);
    } else {
      await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    const updated = await fetch(`${API_URL}/users`).then((r) => r.json());
    setUsersList(updated);
    setUserForm({ name: "", email: "", password: "", role: "user" });
  };

  const startUserEdit = (u) => {
    setUserEditingId(u.id);
    setUserForm({
      name: u.name,
      email: u.email,
      password: "",
      role: u.role || "user",
    });
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Xoá người dùng này?")) return;
    await fetch(`${API_URL}/users/${id}`, { method: "DELETE" });
    setUsersList((prev) => prev.filter((u) => u.id !== id));
  };

  const filteredUsers = useMemo(() => {
    const q = userSearch.toLowerCase().trim();
    return usersList.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
    );
  }, [usersList, userSearch]);

  // ===== AUTH CHECK =====
  if (!user) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">
          Bạn chưa đăng nhập. Vui lòng đăng nhập bằng tài khoản <b>admin</b> để
          truy cập trang quản trị.
        </div>
      </div>
    );
  }
  if (user.role !== "admin") {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">
          Tài khoản hiện tại không có quyền truy cập trang quản trị.
        </div>
      </div>
    );
  }

  // ===== UI =====
  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 text-primary fw-bold">
        🛠️ Trang quản trị HomeLiving
      </h2>

      {activeScreen === "menu" && (
        <div className="row g-4">
          <div className="col-md-6">
            <div
              className="card shadow-sm border-0"
              onClick={() => setActiveScreen("products")}
              style={{ cursor: "pointer" }}
            >
              <div className="card-body p-4">
                <h4>➕ Quản lý sản phẩm</h4>
                <span className="badge bg-primary">Sản phẩm</span>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div
              className="card shadow-sm border-0"
              onClick={() => setActiveScreen("users")}
              style={{ cursor: "pointer" }}
            >
              <div className="card-body p-4">
                <h4>👥 Quản lý người dùng</h4>
                <span className="badge bg-dark">Người dùng</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeScreen === "products" && (
        <div className="card shadow-sm mt-3">
          <div className="card-header bg-primary text-white d-flex justify-content-between">
            <span>Quản lý sản phẩm</span>
            <button
              className="btn btn-light btn-sm"
              onClick={() => setActiveScreen("menu")}
            >
              ← Quay lại
            </button>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Tìm sản phẩm..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <select
                  className="form-select"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="Tất cả">Tất cả danh mục</option>
                  {Array.from(new Set(products.map((p) => p.category))).map(
                    (cat) => (
                      <option key={cat}>{cat}</option>
                    )
                  )}
                </select>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mb-3">
              <div className="row g-3">
                <div className="col-md-3">
                  <input
                    className="form-control"
                    name="name"
                    placeholder="Tên sản phẩm"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-2">
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    placeholder="Giá"
                    value={form.price}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-2">
                  <input
                    className="form-control"
                    name="category"
                    placeholder="Danh mục"
                    value={form.category}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-2">
                  <input
                    type="number"
                    className="form-control"
                    name="stock"
                    placeholder="Tồn kho"
                    value={form.stock}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    className="form-control"
                    name="image"
                    placeholder="Ảnh URL"
                    value={form.image}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <button className="btn btn-primary mt-3">
                {editingId ? "Cập nhật" : "Thêm mới"}
              </button>
            </form>

            <table className="table table-bordered table-hover text-center">
              <thead className="table-dark">
                <tr>
                  <th>Ảnh</th>
                  <th>Tên</th>
                  <th>Giá</th>
                  <th>Danh mục</th>
                  <th>Tồn kho</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <img src={p.image} alt={p.name} width="60" height="60" />
                    </td>
                    <td>{p.name}</td>
                    <td>{p.price.toLocaleString()} ₫</td>
                    <td>{p.category}</td>
                    <td>{p.stock}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => startEdit(p)}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(p.id)}
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeScreen === "users" && (
        <div className="card shadow-sm mt-3">
          <div className="card-header bg-dark text-white d-flex justify-content-between">
            <span>Quản lý người dùng</span>
            <button
              className="btn btn-light btn-sm"
              onClick={() => setActiveScreen("menu")}
            >
              ← Quay lại
            </button>
          </div>
          <div className="card-body">
            <form onSubmit={handleUserSubmit} className="mb-3">
              <div className="row g-3">
                <div className="col-md-3">
                  <input
                    className="form-control"
                    name="name"
                    placeholder="Tên"
                    value={userForm.name}
                    onChange={handleUserChange}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    className="form-control"
                    name="email"
                    placeholder="Email"
                    value={userForm.email}
                    onChange={handleUserChange}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    className="form-control"
                    name="password"
                    placeholder="Mật khẩu"
                    value={userForm.password}
                    onChange={handleUserChange}
                  />
                </div>
                <div className="col-md-2">
                  <select
                    className="form-select"
                    name="role"
                    value={userForm.role}
                    onChange={handleUserChange}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </div>
                <div className="col-md-1 d-grid">
                  <button className="btn btn-primary">
                    {userEditingId ? "Lưu" : "Thêm"}
                  </button>
                </div>
              </div>
            </form>

            <input
              className="form-control mb-3"
              placeholder="Tìm người dùng..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />

            <table className="table table-bordered table-hover text-center">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, i) => (
                  <tr key={u.id}>
                    <td>{i + 1}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.role === "admin" ? "bg-danger" : "bg-secondary"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => startUserEdit(u)}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteUser(u.id)}
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
