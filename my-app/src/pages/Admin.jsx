import React, { useEffect, useState } from "react";

// Key lưu trữ sản phẩm trong localStorage
const STORAGE_KEY = "products_data";

// Hàm khởi tạo dữ liệu mẫu
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

  // Lưu lại dữ liệu mỗi khi products thay đổi
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  // Xử lý thay đổi form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Thêm hoặc Cập nhật sản phẩm
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      alert("Vui lòng nhập đủ thông tin sản phẩm!");
      return;
    }

    if (editing) {
      // Cập nhật sản phẩm
      const updated = products.map((p) =>
        p.id === editing ? { ...p, ...form, price: +form.price, stock: +form.stock } : p
      );
      setProducts(updated);
      setEditing(null);
    } else {
      // Tạo sản phẩm mới với ID tự tăng
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

    // reset form
    setForm({ name: "", price: "", category: "", stock: "", image: "" });
  };

  // Sửa sản phẩm
  const handleEdit = (id) => {
    const p = products.find((x) => x.id === id);
    setForm(p);
    setEditing(id);
  };

  // Xóa sản phẩm
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  // Thống kê
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = products.reduce((sum, p) => sum + p.stock * p.price, 0);
  const outOfStock = products.filter((p) => p.stock === 0).length;

  return (
    <div style={{ padding: "20px" }}>
      <h2>🛠️ Quản lý sản phẩm (Admin)</h2>

      {/* Form sản phẩm */}
      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: "20px",
          background: "#f8f8f8",
          padding: "15px",
          borderRadius: "10px",
        }}
      >
        <h4>{editing ? "✏️ Chỉnh sửa sản phẩm" : "➕ Thêm sản phẩm"}</h4>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Tên sản phẩm"
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Giá"
          type="number"
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Loại sản phẩm"
        />
        <input
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="Số lượng"
          type="number"
        />
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Link ảnh"
        />
        <button type="submit">{editing ? "Cập nhật" : "Thêm"}</button>
      </form>

      {/* Bảng sản phẩm */}
      <table
        border="1"
        cellPadding="6"
        style={{ width: "100%", textAlign: "center", borderCollapse: "collapse" }}
      >
        <thead style={{ background: "#ddd" }}>
          <tr>
            <th>ID</th>
            <th>Ảnh</th>
            <th>Tên Sản Phẩm</th>
            <th>Giá</th>
            <th>Loại</th>
            <th>Tồn kho</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>
                <img src={p.image} alt={p.name} width="60" />
              </td>
              <td>{p.name}</td>
              <td>{p.price.toLocaleString()}₫</td>
              <td>{p.category}</td>
              <td>{p.stock}</td>
              <td>
                <button onClick={() => handleEdit(p.id)}>Sửa</button>{" "}
                <button onClick={() => handleDelete(p.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Thống kê */}
      <div style={{ marginTop: "20px", background: "#f0f0f0", padding: "10px" }}>
        <h4>📊 Thống kê</h4>
        <p>Tổng số sản phẩm: {products.length}</p>
        <p>Tổng tồn kho: {totalStock}</p>
        <p>Tổng giá trị hàng hóa: {totalValue.toLocaleString()}₫</p>
        <p>Sản phẩm hết hàng: {outOfStock}</p>
      </div>
    </div>
  );
}
