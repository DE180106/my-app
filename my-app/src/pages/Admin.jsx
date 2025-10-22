import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const STORAGE_KEY = "products_data";

const initProducts = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    const sample = [
      {
        id: 1,
        name: "Bàn gỗ mini",
        price: 300000,
        category: "Bàn",
        stock: 10,
        image: "https://via.placeholder.com/100",
      },
      {
        id: 2,
        name: "Ghế sofa nhỏ",
        price: 500000,
        category: "Ghế",
        stock: 5,
        image: "https://via.placeholder.com/100",
      },
      {
        id: 3,
        name: "Kệ trang trí nhỏ",
        price: 450000,
        category: "Kệ",
        stock: 8,
        image: "https://via.placeholder.com/100",
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sample));
    return sample;
  }
  return JSON.parse(data);
};

export default function Admin() {
  const [products, setProducts] = useState(initProducts());
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  });
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("Tất cả");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      alert("Vui lòng nhập đủ thông tin sản phẩm!");
      return;
    }

    if (editing) {
      const updated = products.map((p) =>
        p.id === editing ? { ...p, ...form, price: +form.price, stock: +form.stock } : p
      );
      setProducts(updated);
      setEditing(null);
    } else {
      const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
      const newProduct = {
        id: newId,
        name: form.name,
        price: +form.price,
        category: form.category,
        stock: +form.stock,
        image: form.image || "https://via.placeholder.com/100",
      };
      setProducts([...products, newProduct]);
    }

    setForm({ name: "", price: "", category: "", stock: "", image: "" });
  };

  const handleEdit = (id) => {
    const p = products.find((x) => x.id === id);
    setForm(p);
    setEditing(id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = products.reduce((sum, p) => sum + p.stock * p.price, 0);
  const outOfStock = products.filter((p) => p.stock === 0).length;

  const categories = ["Tất cả", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "Tất cả" || p.category === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">🛠️ Quản lý sản phẩm (Admin)</h2>

      {/* Thanh tìm kiếm và lọc */}
      <div className="row mb-3">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Tìm kiếm sản phẩm..."
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
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Form thêm/chỉnh sửa */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-primary text-white">
          {editing ? "✏️ Chỉnh sửa sản phẩm" : "➕ Thêm sản phẩm mới"}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <input
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Tên sản phẩm"
              />
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="Giá (₫)"
              />
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Loại"
              />
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                placeholder="Số lượng"
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Link ảnh"
              />
            </div>
            <div className="col-md-3 d-grid">
              <button type="submit" className="btn btn-success">
                {editing ? "Cập nhật" : "Thêm sản phẩm"}
              </button>
            </div>
            {editing && (
              <div className="col-md-3 d-grid">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditing(null);
                    setForm({ name: "", price: "", category: "", stock: "", image: "" });
                  }}
                >
                  Hủy chỉnh sửa
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Bảng sản phẩm */}
      <div className="table-responsive shadow-sm">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Loại</th>
              <th>Tồn kho</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    <img
                      src={p.image}
                      alt={p.name}
                      width="70"
                      className="rounded shadow-sm"
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>{p.price.toLocaleString()}₫</td>
                  <td>{p.category}</td>
                  <td>{p.stock}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(p.id)}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(p.id)}
                    >
                      🗑️ Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  Không có sản phẩm phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Thống kê */}
      <div className="alert alert-info mt-4">
        <h5>📊 Thống kê</h5>
        <p>Tổng số sản phẩm: {products.length}</p>
        <p>Tổng tồn kho: {totalStock}</p>
        <p>Tổng giá trị hàng hóa: {totalValue.toLocaleString()}₫</p>
        <p>Sản phẩm hết hàng: {outOfStock}</p>
      </div>
    </div>
  );
}
