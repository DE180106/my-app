import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/AuthContext";
import seedProducts from "../data/products.json";
import seedUsers from "../data/users.json";

const STORAGE_KEY = "products_data";
const USERS_KEY = "hl_users";
const HARDCODED_ADMIN_EMAILS = ["admin@homeliving.vn"];

const withStableIds = (arr) =>
  (arr || []).map((p) => ({
    ...p,
    id: p.id ?? Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`),
    price: isFinite(Number(p.price)) ? String(p.price) : "",
    stock: isFinite(Number(p.stock)) ? String(p.stock) : "",
  }));

const norm = (s) => (s || "").trim().toLowerCase();

export default function Admin() {
  const { user } = useAuth();

  const [activeScreen, setActiveScreen] = useState("menu"); // menu | products | users

  // -------- PRODUCTS --------
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ id: null, name: "", price: "", category: "", stock: "", image: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("Tất cả");

  useEffect(() => {
    const localData = localStorage.getItem(STORAGE_KEY);
    if (localData) setProducts(withStableIds(JSON.parse(localData)));
    else {
      const hydrated = withStableIds(seedProducts || []);
      setProducts(hydrated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(hydrated));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    const normalized = { ...form, price: String(form.price), stock: String(form.stock || "0"), image: form.image || "" };
    if (editingId) {
      setProducts((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...normalized, id: editingId } : p)));
      setEditingId(null);
    } else {
      const newItem = { id: Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`), ...normalized };
      setProducts((prev) => [...prev, newItem]);
    }
    setForm({ id: null, name: "", price: "", category: "", stock: "", image: "" });
  };

  const startEdit = (productId) => {
    const t = products.find((p) => p.id === productId);
    if (!t) return;
    setForm({
      id: t.id,
      name: t.name || "",
      price: t.price || "",
      category: t.category || "",
      stock: t.stock || "",
      image: t.image || "",
    });
    setEditingId(productId);
  };

  const handleDelete = (productId) => {
    if (window.confirm("Xóa sản phẩm này?")) setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch = (p.name || "").toLowerCase().includes(s);
      const matchesCategory = filterCategory === "Tất cả" || p.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, filterCategory]);

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + Number(p.stock || 0), 0);
  const totalValue = products.reduce((sum, p) => sum + Number(p.stock || 0) * Number(p.price || 0), 0);
  const outOfStock = products.filter((p) => Number(p.stock) === 0).length;

  // -------- USERS (CRUD via localStorage, với Export/Import users.json) --------
  const [usersList, setUsersList] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [userForm, setUserForm] = useState({ id: null, name: "", email: "", password: "", role: "user" });
  const [userEditingId, setUserEditingId] = useState(null);

  useEffect(() => {
    let lsUsers = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    if (!lsUsers || lsUsers.length === 0) {
      lsUsers = (seedUsers || []).map((u) => ({ ...u, role: u.role || "user" }));
      localStorage.setItem(USERS_KEY, JSON.stringify(lsUsers));
    } else {
      lsUsers = lsUsers.map((u) => ({ ...u, role: u.role || "user" }));
    }
    HARDCODED_ADMIN_EMAILS.forEach((email) => {
      const exists = lsUsers.some((u) => norm(u.email) === email);
      if (!exists) {
        lsUsers.unshift({ id: `hardadmin-${email}`, name: "Admin User", email, role: "admin", hardcoded: true });
      }
    });
    setUsersList(lsUsers);
  }, []);

  const saveUsers = (list) => {
    const pure = list.filter((u) => !u.hardcoded);
    localStorage.setItem(USERS_KEY, JSON.stringify(pure));
    const withHard = [...pure];
    HARDCODED_ADMIN_EMAILS.forEach((email) => {
      if (!withHard.some((u) => norm(u.email) === email)) {
        withHard.unshift({ id: `hardadmin-${email}`, name: "Admin User", email, role: "admin", hardcoded: true });
      }
    });
    setUsersList(withHard);
  };

  const handleUserChange = (e) => setUserForm({ ...userForm, [e.target.name]: e.target.value });

  const validateEmail = (mail) => /\S+@\S+\.\S+/.test(mail);

  const handleUserSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, role } = userForm;
    if (!name || !email || (!userEditingId && !password)) {
      alert("Tên, email (và mật khẩu khi tạo mới) là bắt buộc.");
      return;
    }
    if (!validateEmail(email)) {
      alert("Email không hợp lệ.");
      return;
    }
    if (HARDCODED_ADMIN_EMAILS.includes(norm(email))) {
      alert("Không thể tạo/sửa admin cứng.");
      return;
    }
    const dup = usersList.some((u) => !u.hardcoded && norm(u.email) === norm(email) && u.id !== userEditingId);
    if (dup) {
      alert("Email đã tồn tại.");
      return;
    }

    if (userEditingId) {
      const next = usersList.map((u) =>
        u.id === userEditingId ? { ...u, name, email, role, password: password ? password : u.password } : u
      );
      saveUsers(next);
      setUserEditingId(null);
    } else {
      const newUser = {
        id: Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`),
        name,
        email,
        password,
        role: role || "user",
      };
      saveUsers([...usersList, newUser]);
    }
    setUserForm({ id: null, name: "", email: "", password: "", role: "user" });
  };

  const startUserEdit = (u) => {
    if (u.hardcoded) {
      alert("Không thể chỉnh sửa admin cứng.");
      return;
    }
    setUserEditingId(u.id);
    setUserForm({ id: u.id, name: u.name || "", email: u.email || "", password: "", role: u.role || "user" });
  };

  const deleteUser = (u) => {
    if (u.hardcoded) {
      alert("Không thể xóa admin cứng.");
      return;
    }
    if (window.confirm(`Xóa người dùng "${u.name}"?`)) {
      saveUsers(usersList.filter((x) => x.id !== u.id));
    }
  };

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    return usersList.filter((u) => {
      const name = (u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const role = (u.role || "").toLowerCase();
      return name.includes(q) || email.includes(q) || role.includes(q);
    });
  }, [usersList, userSearch]);

  const userCount = usersList.length;
  const adminCount = usersList.filter((u) => u.role === "admin").length;

  const exportUsersJson = () => {
    const data = usersList.filter((u) => !u.hardcoded);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "users.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importUsersJson = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const arr = JSON.parse(text);
      if (!Array.isArray(arr)) throw new Error("invalid");
      const normalized = arr.map((u) => ({ ...u, role: u.role || "user" }));
      saveUsers(normalized);
      alert("Đã nhập users.json");
    } catch {
      alert("Không thể đọc file users.json.");
    } finally {
      e.target.value = "";
    }
  };

  if (!user) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">Bạn chưa đăng nhập. Hãy đăng nhập tài khoản <b>admin</b> để vào trang quản trị.</div>
      </div>
    );
  }
  if (user.role !== "admin") {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">Tài khoản hiện tại không có quyền truy cập trang quản trị (cần <b>admin</b>).</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 text-primary fw-bold">🛠️ Trang quản trị HomeLiving</h2>

      {activeScreen === "menu" && (
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card h-100 shadow-sm border-0" style={{ cursor: "pointer" }} onClick={() => setActiveScreen("products")}>
              <div className="card-body p-4">
                <h4 className="card-title mb-2">➕ Thêm & quản lý sản phẩm</h4>
                <span className="badge bg-primary">Sản phẩm</span>
              </div>
              <div className="card-footer bg-light"><small className="text-muted">Nhấn để mở</small></div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 shadow-sm border-0" style={{ cursor: "pointer" }} onClick={() => setActiveScreen("users")}>
              <div className="card-body p-4">
                <h4 className="card-title mb-2">👥 Quản lý người dùng</h4>
                <span className="badge bg-dark">Người dùng</span>
              </div>
              <div className="card-footer bg-light"><small className="text-muted">Nhấn để mở</small></div>
            </div>
          </div>
        </div>
      )}

      {activeScreen === "products" && (
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
            <span className="fw-bold">Quản lý sản phẩm</span>
            <button className="btn btn-light btn-sm" onClick={() => setActiveScreen("menu")}>← Chọn chức năng khác</button>
          </div>
          <div className="card-body">
            <div className="row mb-4">
              <div className="col-md-6">
                <input type="text" placeholder="Tìm kiếm sản phẩm..." className="form-control" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="col-md-4">
                <select className="form-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                  <option value="Tất cả">Tất cả danh mục</option>
                  {Array.from(new Set(products.map((p) => p.category).filter(Boolean))).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm mb-4 bg-light">
              <h5 className="mb-3">{editingId ? "✏️ Chỉnh sửa sản phẩm" : "➕ Thêm sản phẩm mới"}</h5>
              <div className="row g-3">
                <div className="col-md-4"><input type="text" name="name" placeholder="Tên sản phẩm" className="form-control" value={form.name} onChange={handleChange} /></div>
                <div className="col-md-2"><input type="number" name="price" placeholder="Giá (VND)" className="form-control" value={form.price} onChange={handleChange} /></div>
                <div className="col-md-2"><input type="text" name="category" placeholder="Danh mục" className="form-control" value={form.category} onChange={handleChange} /></div>
                <div className="col-md-2"><input type="number" name="stock" placeholder="Tồn kho" className="form-control" value={form.stock} onChange={handleChange} /></div>
                <div className="col-md-2"><input type="text" name="image" placeholder="URL ảnh" className="form-control" value={form.image} onChange={handleChange} /></div>
              </div>
              <button type="submit" className="btn btn-primary mt-3">{editingId ? "Cập nhật" : "Thêm mới"}</button>
            </form>

            <div className="table-responsive">
              <table className="table table-striped table-bordered text-center align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Giá (VND)</th>
                    <th>Danh mục</th>
                    <th>Tồn kho</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length ? (
                    filtered.map((p) => (
                      <tr key={p.id}>
                        <td><img src={p.image || "https://via.placeholder.com/60"} alt={p.name} width="60" height="60" className="rounded" /></td>
                        <td>{p.name}</td>
                        <td>{Number(p.price || 0).toLocaleString()} ₫</td>
                        <td>{p.category}</td>
                        <td>{p.stock}</td>
                        <td>
                          <button onClick={() => startEdit(p.id)} className="btn btn-warning btn-sm me-2">Sửa</button>
                          <button onClick={() => handleDelete(p.id)} className="btn btn-danger btn-sm">Xóa</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="6">Không có sản phẩm.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="row mt-4 text-center">
              <div className="col-md-3"><div className="card border-success shadow-sm mb-3"><div className="card-body"><h6 className="text-success">Tổng sản phẩm</h6><p className="fs-5 fw-bold">{totalProducts}</p></div></div></div>
              <div className="col-md-3"><div className="card border-info shadow-sm mb-3"><div className="card-body"><h6 className="text-info">Tổng tồn kho</h6><p className="fs-5 fw-bold">{totalStock}</p></div></div></div>
              <div className="col-md-3"><div className="card border-warning shadow-sm mb-3"><div className="card-body"><h6 className="text-warning">Tổng giá trị hàng</h6><p className="fs-5 fw-bold">{totalValue.toLocaleString()} ₫</p></div></div></div>
              <div className="col-md-3"><div className="card border-danger shadow-sm mb-3"><div className="card-body"><h6 className="text-danger">Hết hàng</h6><p className="fs-5 fw-bold">{outOfStock}</p></div></div></div>
            </div>
          </div>
        </div>
      )}

      {activeScreen === "users" && (
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center bg-dark text-white">
            <span className="fw-bold">Người dùng</span>
            <div className="d-flex gap-2">
              <button className="btn btn-light btn-sm" onClick={exportUsersJson}>⬇️ Export users.json</button>
              <label className="btn btn-outline-light btn-sm mb-0">
                ⬆️ Import users.json
                <input type="file" accept="application/json" onChange={importUsersJson} hidden />
              </label>
              <button className="btn btn-light btn-sm" onClick={() => setActiveScreen("menu")}>← Chọn chức năng khác</button>
            </div>
          </div>

          <div className="card-body">
            <form onSubmit={handleUserSubmit} className="border p-3 rounded bg-light mb-4">
              <h5 className="mb-3">{userEditingId ? "✏️ Chỉnh sửa người dùng" : "➕ Thêm người dùng"}</h5>
              <div className="row g-3">
                <div className="col-md-3"><input className="form-control" name="name" placeholder="Tên" value={userForm.name} onChange={handleUserChange} /></div>
                <div className="col-md-3"><input className="form-control" name="email" placeholder="Email" value={userForm.email} onChange={handleUserChange} /></div>
                <div className="col-md-3"><input className="form-control" name="password" placeholder={userEditingId ? "Mật khẩu (để trống nếu giữ nguyên)" : "Mật khẩu"} value={userForm.password} onChange={handleUserChange} /></div>
                <div className="col-md-2">
                  <select className="form-select" name="role" value={userForm.role} onChange={handleUserChange}>
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </div>
                <div className="col-md-1 d-grid"><button className="btn btn-primary">{userEditingId ? "Lưu" : "Thêm"}</button></div>
              </div>
            </form>

            <div className="row g-3 align-items-end mb-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm theo tên, email hoặc vai trò…"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <div className="row text-center">
                  <div className="col-6"><div className="border rounded p-3"><div className="small text-muted">Tổng người dùng</div><div className="fs-5 fw-bold">{userCount}</div></div></div>
                  <div className="col-6"><div className="border rounded p-3"><div className="small text-muted">Quản trị</div><div className="fs-5 fw-bold">{adminCount}</div></div></div>
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length ? (
                    filteredUsers.map((u, idx) => (
                      <tr key={u.id || `${u.email}-${idx}`}>
                        <td>{idx + 1}</td>
                        <td className="fw-semibold">{u.name}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={"badge " + (u.role === "admin" ? "bg-danger" : "bg-secondary")}>
                            {u.role || "user"}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-warning me-2" disabled={u.hardcoded} onClick={() => startUserEdit(u)}>Sửa</button>
                          <button className="btn btn-sm btn-danger" disabled={u.hardcoded} onClick={() => deleteUser(u)}>Xóa</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" className="text-center">Không có người dùng.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
