import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const STORAGE_KEY = "products_data";

export default function Admin() {
  const [products, setProducts] = useState([]);
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
    const localData = localStorage.getItem(STORAGE_KEY);
    if (localData) {
      setProducts(JSON.parse(localData));
    } else {
      fetch("/data/products.json")
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        })
        .catch((err) => console.error("Lỗi khi tải dữ liệu:", err));
    }
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }
  }, [products]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (editing !== null) {
      const updated = [...products];
      updated[editing] = form;
      setProducts(updated);
      setEditing(null);
    } else {
      setProducts([...products, form]);
    }

    setForm({ name: "", price: "", category: "", stock: "", image: "" });
  };

  const handleEdit = (index) => {
    setForm(products[index]);
    setEditing(index);
  };

  const handleDelete = (index) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      setProducts(products.filter((_, i) => i !== index));
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      filterCategory === "Tất cả" || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + Number(p.stock || 0), 0);
  const totalValue = products.reduce(
    (sum, p) => sum + Number(p.stock || 0) * Number(p.price || 0),
    0
  );
  const outOfStock = products.filter((p) => Number(p.stock) === 0).length;

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 text-primary fw-bold">
        🛍️ Trang quản lý sản phẩm
      </h2>

      {/* Bộ lọc và tìm kiếm */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="form-control"
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
              (cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* Form thêm / sửa */}
      <form
        onSubmit={handleSubmit}
        className="border p-4 rounded shadow-sm mb-5 bg-light"
      >
        <h5 className="mb-3">
          {editing !== null ? "✏️ Chỉnh sửa sản phẩm" : "➕ Thêm sản phẩm mới"}
        </h5>
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              name="name"
              placeholder="Tên sản phẩm"
              className="form-control"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              name="price"
              placeholder="Giá (VND)"
              className="form-control"
              value={form.price}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2">
            <input
              type="text"
              name="category"
              placeholder="Danh mục"
              className="form-control"
              value={form.category}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              name="stock"
              placeholder="Tồn kho"
              className="form-control"
              value={form.stock}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2">
            <input
              type="text"
              name="image"
              placeholder="URL ảnh"
              className="form-control"
              value={form.image}
              onChange={handleChange}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          {editing !== null ? "Cập nhật" : "Thêm mới"}
        </button>
      </form>

      {/* Danh sách sản phẩm */}
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white fw-bold">
          Danh sách sản phẩm
        </div>
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
              {filtered.length > 0 ? (
                filtered.map((p, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={p.image || "https://via.placeholder.com/60"}
                        alt={p.name}
                        width="60"
                        height="60"
                        className="rounded"
                      />
                    </td>
                    <td>{p.name}</td>
                    <td>{Number(p.price).toLocaleString()} ₫</td>
                    <td>{p.category}</td>
                    <td>{p.stock}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(index)}
                        className="btn btn-warning btn-sm me-2"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="btn btn-danger btn-sm"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">Không có sản phẩm nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Thống kê tổng */}
      <div className="row mt-5 text-center">
        <h4 className="mb-4 fw-bold text-primary">📈 Thống kê tổng quan</h4>
        <div className="col-md-3">
          <div className="card border-success shadow-sm mb-3">
            <div className="card-body">
              <h6 className="text-success">Tổng sản phẩm</h6>
              <p className="fs-5 fw-bold">{totalProducts}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-info shadow-sm mb-3">
            <div className="card-body">
              <h6 className="text-info">Tổng tồn kho</h6>
              <p className="fs-5 fw-bold">{totalStock}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-warning shadow-sm mb-3">
            <div className="card-body">
              <h6 className="text-warning">Tổng giá trị hàng</h6>
              <p className="fs-5 fw-bold">
                {totalValue.toLocaleString()} ₫
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-danger shadow-sm mb-3">
            <div className="card-body">
              <h6 className="text-danger">Sản phẩm hết hàng</h6>
              <p className="fs-5 fw-bold">{outOfStock}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}